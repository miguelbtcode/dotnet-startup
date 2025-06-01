// src/components/features/EnhancedFeaturesTab.tsx
import React, { useEffect } from "react";
import {
  VStack,
  SimpleGrid,
  Box,
  Text,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Icon,
  Badge,
  Button,
  useColorModeValue,
  Progress,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Tooltip,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Package,
  FileText,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEnhancedFeaturesStore } from "../../store/enhancedFeaturesStore";
import { useProjectStore } from "../../store/projectStore";
import { FeatureGroupCard } from "./FeatureGroupCard";
import { FeaturesSummary } from "./FeaturesSummary";
import { FeaturesPresets } from "./FeaturesPresets";

export const EnhancedFeaturesTab: React.FC = () => {
  const { config } = useProjectStore();
  const {
    selectedFeatures,
    validation,
    configuration,
    estimatedSetupTime,
    setArchitecture,
    setProjectType,
    resetAllFeatures,
    getAvailableGroups,
    validateFeatures,
    getFeatureConfiguration,
  } = useEnhancedFeaturesStore();

  const toast = useToast();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Sync with project configuration
  useEffect(() => {
    setArchitecture(config.architecture);
    setProjectType(config.type);
  }, [config.architecture, config.type, setArchitecture, setProjectType]);

  const availableGroups = getAvailableGroups();
  const selectedCount = Object.keys(selectedFeatures).filter(
    (key) => selectedFeatures[key]
  ).length;

  const handleResetFeatures = () => {
    resetAllFeatures();
    toast({
      title: "Features Reset",
      description: "All feature selections have been cleared",
      status: "info",
      duration: 2000,
    });
  };

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

  return (
    <VStack spacing={8} align="stretch">
      {/* Header Section */}
      <Box
        bg={cardBg}
        p={6}
        rounded="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="lg"
        position="relative"
        overflow="hidden"
      >
        {/* Gradient Background */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="4px"
          bgGradient="linear(to-r, purple.400, blue.500, teal.400)"
        />

        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <HStack spacing={4}>
              <Box
                p={3}
                bg="purple.50"
                borderRadius="xl"
                border="2px solid"
                borderColor="purple.200"
              >
                <Icon as={Sparkles} boxSize={8} color="purple.500" />
              </Box>
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                  Enhanced Features
                </Text>
                <Text color="gray.600" fontSize="md">
                  Configure advanced features and patterns for your{" "}
                  {config.type} project with {config.architecture} architecture
                </Text>
              </VStack>
            </HStack>

            <HStack spacing={3}>
              <Badge
                colorScheme={getComplexityColor(configuration.complexity)}
                variant="subtle"
                px={4}
                py={2}
                borderRadius="full"
                fontSize="sm"
                fontWeight="bold"
              >
                <HStack spacing={1}>
                  <Icon as={TrendingUp} size={14} />
                  <Text>{configuration.complexity}</Text>
                </HStack>
              </Badge>

              <ButtonGroup size="sm" variant="outline">
                <Tooltip label="Reset all selections">
                  <Button
                    leftIcon={<RotateCcw size={16} />}
                    onClick={handleResetFeatures}
                    isDisabled={selectedCount === 0}
                    colorScheme="gray"
                  >
                    Reset
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </HStack>
          </Flex>

          {/* Quick Stats */}
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Features Selected
              </StatLabel>
              <StatNumber fontSize="2xl" color="blue.600">
                {selectedCount}
              </StatNumber>
              <StatHelpText fontSize="xs">
                of {availableGroups.length} available
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Setup Time
              </StatLabel>
              <StatNumber
                fontSize="2xl"
                color={`${getSetupTimeColor(estimatedSetupTime)}.600`}
              >
                {estimatedSetupTime}m
              </StatNumber>
              <StatHelpText fontSize="xs">estimated</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                NuGet Packages
              </StatLabel>
              <StatNumber fontSize="2xl" color="purple.600">
                {configuration.totalPackages}
              </StatNumber>
              <StatHelpText fontSize="xs">to be added</StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Config Files
              </StatLabel>
              <StatNumber fontSize="2xl" color="teal.600">
                {configuration.configFilesCount}
              </StatNumber>
              <StatHelpText fontSize="xs">to be generated</StatHelpText>
            </Stat>
          </SimpleGrid>

          {/* Progress Bar */}
          {selectedCount > 0 && (
            <Box>
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Configuration Progress
                </Text>
                <Text fontSize="sm" color="gray.500">
                  {Math.round((selectedCount / availableGroups.length) * 100)}%
                  complete
                </Text>
              </Flex>
              <Progress
                value={(selectedCount / availableGroups.length) * 100}
                colorScheme="purple"
                size="md"
                borderRadius="full"
                bg="gray.100"
              />
            </Box>
          )}
        </VStack>
      </Box>

      {/* Validation Alerts */}
      {!validation.isValid && validation.errors.length > 0 && (
        <Alert
          status="error"
          borderRadius="xl"
          border="2px solid"
          borderColor="red.200"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertDescription>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Configuration Issues:</Text>
                {validation.errors.map((error, index) => (
                  <Text key={index} fontSize="sm">
                    • {error}
                  </Text>
                ))}
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {validation.warnings.length > 0 && (
        <Alert
          status="warning"
          borderRadius="xl"
          border="2px solid"
          borderColor="orange.200"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertDescription>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">Recommendations:</Text>
                {validation.warnings.map((warning, index) => (
                  <Text key={index} fontSize="sm">
                    • {warning}
                  </Text>
                ))}
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {validation.suggestions.length > 0 && (
        <Alert
          status="info"
          borderRadius="xl"
          border="2px solid"
          borderColor="blue.200"
        >
          <AlertIcon />
          <Box flex="1">
            <AlertDescription>
              <VStack align="start" spacing={2}>
                <Text fontWeight="bold">💡 Suggestions:</Text>
                {validation.suggestions.map((suggestion, index) => (
                  <Text key={index} fontSize="sm">
                    • {suggestion}
                  </Text>
                ))}
              </VStack>
            </AlertDescription>
          </Box>
        </Alert>
      )}

      {/* Architecture-specific Notice */}
      {config.architecture === "default" && (
        <Alert
          status="info"
          borderRadius="xl"
          border="2px solid"
          borderColor="blue.200"
        >
          <AlertIcon />
          <AlertDescription>
            <VStack align="start" spacing={2}>
              <Text fontWeight="bold">🏗️ Architecture Notice:</Text>
              <Text fontSize="sm">
                Some advanced features like CQRS and Events are only available
                with Clean Architecture, DDD, Hexagonal, or Onion patterns.
                Consider upgrading your architecture in the Project
                Configuration tab for access to more features.
              </Text>
            </VStack>
          </AlertDescription>
        </Alert>
      )}

      <Divider />

      {/* Main Content */}
      <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={8}>
        {/* Feature Groups - Left Column (2/3 width on xl) */}
        <Box gridColumn={{ xl: "span 2" }}>
          <VStack spacing={6} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                Available Features
              </Text>
              <FeaturesPresets />
            </HStack>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
              {availableGroups.map((group) => (
                <FeatureGroupCard
                  key={group.id}
                  group={group}
                  selectedValue={selectedFeatures[group.id]}
                  onSelectionChange={(value) => {
                    // This will be handled by the individual FeatureGroupCard
                  }}
                />
              ))}
            </SimpleGrid>

            {availableGroups.length === 0 && (
              <Box
                p={12}
                textAlign="center"
                bg="gray.50"
                borderRadius="xl"
                border="2px dashed"
                borderColor="gray.300"
              >
                <VStack spacing={4}>
                  <Icon as={Package} size={32} color="gray.400" />
                  <VStack spacing={2}>
                    <Text fontSize="lg" fontWeight="medium" color="gray.600">
                      No Features Available
                    </Text>
                    <Text fontSize="sm" color="gray.500" maxW="400px">
                      Features will appear here based on your selected
                      architecture. Try switching to Clean Architecture or DDD
                      for more options.
                    </Text>
                  </VStack>
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>

        {/* Summary Panel - Right Column (1/3 width on xl) */}
        <Box>
          <FeaturesSummary />
        </Box>
      </SimpleGrid>
    </VStack>
  );
};
