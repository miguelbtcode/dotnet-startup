// src/components/features/FeaturesSummary.tsx
import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useColorModeValue,
  Divider,
  Progress,
  Code,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Button,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import {
  Package,
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Copy,
  Download,
  Layers,
} from "lucide-react";
import { useEnhancedFeaturesStore } from "../../store/enhancedFeaturesStore";
import { enhancedFeatureGroups } from "../../data/enhancedFeatures";

export const FeaturesSummary: React.FC = () => {
  const {
    selectedFeatures,
    configuration,
    validation,
    getSelectedPackages,
    getConfigFiles,
  } = useEnhancedFeaturesStore();

  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const selectedPackages = getSelectedPackages();
  const configFiles = getConfigFiles();
  const selectedCount = Object.keys(selectedFeatures).filter(
    (key) => selectedFeatures[key]
  ).length;

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "Advanced":
        return "red";
      case "Intermediate":
        return "orange";
      case "Beginner":
        return "green";
      default:
        return "gray";
    }
  };

  const getSetupTimeColor = (minutes: number) => {
    if (minutes <= 30) return "green";
    if (minutes <= 120) return "orange";
    return "red";
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${label} Copied`,
      description: `${label} have been copied to clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const exportConfiguration = () => {
    const config = {
      selectedFeatures,
      configuration,
      packages: selectedPackages,
      configFiles,
      validation,
    };

    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "features-configuration.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Configuration Exported",
      description: "Features configuration has been downloaded",
      status: "success",
      duration: 3000,
    });
  };

  const getSelectedFeatureDetails = () => {
    const details: Array<{
      groupTitle: string;
      groupId: string;
      selectedOptions: Array<{
        id: string;
        title: string;
        complexity: string;
        category: string;
      }>;
    }> = [];

    Object.entries(selectedFeatures).forEach(([groupId, selection]) => {
      if (!selection) return;

      const group = enhancedFeatureGroups.find((g) => g.id === groupId);
      if (!group) return;

      const selectedIds = Array.isArray(selection) ? selection : [selection];
      const selectedOptions = selectedIds
        .map((id) => {
          const option = group.options.find((o) => o.id === id);
          return option
            ? {
                id: option.id,
                title: option.title,
                complexity: option.complexity,
                category: option.category,
              }
            : null;
        })
        .filter(Boolean) as Array<{
        id: string;
        title: string;
        complexity: string;
        category: string;
      }>;

      if (selectedOptions.length > 0) {
        details.push({
          groupTitle: group.title,
          groupId: group.id,
          selectedOptions,
        });
      }
    });

    return details;
  };

  const selectedFeatureDetails = getSelectedFeatureDetails();
  const progressPercentage =
    selectedCount > 0
      ? Math.min((selectedCount / enhancedFeatureGroups.length) * 100, 100)
      : 0;

  return (
    <VStack spacing={6} align="stretch">
      {/* Main Summary Card */}
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="2xl"
        p={6}
        shadow="lg"
        position="sticky"
        top="6"
      >
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between" align="center">
            <HStack spacing={3}>
              <Box
                p={2}
                bg="blue.50"
                borderRadius="lg"
                border="2px solid"
                borderColor="blue.200"
              >
                <Icon as={Layers} color="blue.600" size={20} />
              </Box>
              <Text fontSize="lg" fontWeight="bold" color="gray.800">
                Configuration Summary
              </Text>
            </HStack>

            <Badge
              colorScheme={getComplexityColor(configuration.complexity)}
              variant="solid"
              px={3}
              py={1}
              borderRadius="full"
              fontSize="sm"
            >
              {configuration.complexity}
            </Badge>
          </HStack>

          {/* Progress Bar */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Setup Progress
              </Text>
              <Text fontSize="sm" color="gray.500">
                {selectedCount} features selected
              </Text>
            </HStack>
            <Progress
              value={progressPercentage}
              colorScheme="blue"
              size="md"
              borderRadius="full"
              bg="gray.100"
            />
          </Box>

          {/* Key Metrics */}
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon as={Clock} color="orange.500" size={16} />
                <Text fontSize="sm" color="gray.600">
                  Setup Time
                </Text>
              </HStack>
              <Badge
                colorScheme={getSetupTimeColor(
                  configuration.estimatedSetupTime
                )}
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
              >
                {configuration.estimatedSetupTime}m
              </Badge>
            </HStack>

            <HStack justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon as={Package} color="purple.500" size={16} />
                <Text fontSize="sm" color="gray.600">
                  NuGet Packages
                </Text>
              </HStack>
              <Badge
                colorScheme="purple"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
              >
                {configuration.totalPackages}
              </Badge>
            </HStack>

            <HStack justify="space-between" align="center">
              <HStack spacing={2}>
                <Icon as={FileText} color="teal.500" size={16} />
                <Text fontSize="sm" color="gray.600">
                  Config Files
                </Text>
              </HStack>
              <Badge
                colorScheme="teal"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
              >
                {configuration.configFilesCount}
              </Badge>
            </HStack>
          </VStack>

          <Divider />

          {/* Validation Status */}
          <VStack spacing={3} align="stretch">
            <HStack spacing={2}>
              <Icon
                as={validation.isValid ? CheckCircle : TrendingUp}
                color={validation.isValid ? "green.500" : "orange.500"}
                size={16}
              />
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                Configuration Status
              </Text>
            </HStack>

            <Badge
              colorScheme={validation.isValid ? "green" : "orange"}
              variant="subtle"
              p={2}
              borderRadius="md"
              fontSize="sm"
            >
              {validation.isValid
                ? "✅ Ready to implement"
                : "⚠️ Needs attention"}
            </Badge>

            {!validation.isValid && validation.errors.length > 0 && (
              <VStack align="stretch" spacing={1}>
                <Text fontSize="xs" color="red.600" fontWeight="medium">
                  Issues to resolve:
                </Text>
                {validation.errors.slice(0, 2).map((error, index) => (
                  <Text key={index} fontSize="xs" color="red.600">
                    • {error}
                  </Text>
                ))}
                {validation.errors.length > 2 && (
                  <Text fontSize="xs" color="red.500">
                    +{validation.errors.length - 2} more issues
                  </Text>
                )}
              </VStack>
            )}
          </VStack>

          {/* Export Actions */}
          {selectedCount > 0 && (
            <>
              <Divider />
              <VStack spacing={2} align="stretch">
                <Button
                  size="sm"
                  leftIcon={<Download size={16} />}
                  onClick={exportConfiguration}
                  colorScheme="blue"
                  variant="outline"
                  borderRadius="lg"
                >
                  Export Configuration
                </Button>
              </VStack>
            </>
          )}
        </VStack>
      </Box>

      {/* Selected Features Details */}
      {selectedFeatureDetails.length > 0 && (
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          overflow="hidden"
        >
          <Box
            p={4}
            bg="gray.50"
            borderBottom="1px solid"
            borderColor={borderColor}
          >
            <Text fontSize="md" fontWeight="semibold" color="gray.700">
              Selected Features ({selectedCount})
            </Text>
          </Box>

          <VStack spacing={0} align="stretch">
            {selectedFeatureDetails.map((detail, index) => (
              <Box key={detail.groupId}>
                <Box p={4}>
                  <VStack align="stretch" spacing={3}>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {detail.groupTitle}
                    </Text>

                    <VStack align="stretch" spacing={2}>
                      {detail.selectedOptions.map((option) => (
                        <HStack
                          key={option.id}
                          justify="space-between"
                          align="center"
                        >
                          <Text fontSize="sm" color="gray.600">
                            {option.title}
                          </Text>
                          <Badge
                            colorScheme={getComplexityColor(option.complexity)}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {option.complexity}
                          </Badge>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Box>
                {index < selectedFeatureDetails.length - 1 && <Divider />}
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* Packages and Files Accordion */}
      {(selectedPackages.length > 0 || configFiles.length > 0) && (
        <Accordion allowToggle>
          {/* NuGet Packages */}
          {selectedPackages.length > 0 && (
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <HStack spacing={2}>
                    <Icon as={Package} color="purple.500" size={16} />
                    <Text fontSize="sm" fontWeight="medium">
                      NuGet Packages ({selectedPackages.length})
                    </Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">
                      Packages to install
                    </Text>
                    <Tooltip label="Copy package list">
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<Copy size={12} />}
                        onClick={() =>
                          copyToClipboard(
                            selectedPackages.join("\n"),
                            "Packages"
                          )
                        }
                      >
                        Copy
                      </Button>
                    </Tooltip>
                  </HStack>

                  {selectedPackages.map((pkg, index) => (
                    <Code key={index} fontSize="xs" p={2}>
                      {pkg}
                    </Code>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          )}

          {/* Config Files */}
          {configFiles.length > 0 && (
            <AccordionItem>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <HStack spacing={2}>
                    <Icon as={FileText} color="teal.500" size={16} />
                    <Text fontSize="sm" fontWeight="medium">
                      Configuration Files ({configFiles.length})
                    </Text>
                  </HStack>
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontSize="xs" color="gray.500">
                      Files to be generated
                    </Text>
                    <Tooltip label="Copy file list">
                      <Button
                        size="xs"
                        variant="ghost"
                        leftIcon={<Copy size={12} />}
                        onClick={() =>
                          copyToClipboard(
                            configFiles.join("\n"),
                            "Config Files"
                          )
                        }
                      >
                        Copy
                      </Button>
                    </Tooltip>
                  </HStack>

                  {configFiles.map((file, index) => (
                    <Code key={index} fontSize="xs" p={2}>
                      {file}
                    </Code>
                  ))}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          )}
        </Accordion>
      )}

      {/* Empty State */}
      {selectedCount === 0 && (
        <Box
          bg={cardBg}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="xl"
          p={8}
          textAlign="center"
        >
          <VStack spacing={4}>
            <Box
              p={4}
              bg="gray.50"
              borderRadius="full"
              border="2px dashed"
              borderColor="gray.300"
            >
              <Icon as={Layers} size={24} color="gray.400" />
            </Box>
            <VStack spacing={2}>
              <Text fontSize="md" fontWeight="medium" color="gray.600">
                No Features Selected
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                textAlign="center"
                maxW="250px"
              >
                Choose features from the left to see a detailed summary and
                configuration details here.
              </Text>
            </VStack>
          </VStack>
        </Box>
      )}
    </VStack>
  );
};
