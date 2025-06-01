// src/components/features/FeaturesPresets.tsx
import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Icon,
  HStack,
  Text,
  Badge,
  VStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Sparkles,
  ChevronDown,
  Zap,
  Shield,
  Code,
  Layers,
  Rocket,
  Crown,
  Star,
} from "lucide-react";
import { useEnhancedFeaturesStore } from "../../store/enhancedFeaturesStore";
import { FeaturePreset, SelectedFeatures } from "../../types/features";

// Predefined presets for different scenarios
const predefinedPresets: FeaturePreset[] = [
  {
    id: "minimal",
    name: "Minimal Setup",
    description: "Basic features for simple applications with minimal overhead",
    complexity: "Beginner",
    projectTypes: ["webapi", "mvc", "console"],
    architectures: ["default", "clean"],
    features: {
      authentication: "none",
      documentation: "swagger",
      logging: "default",
      error_handling: "exceptions",
    },
    tags: ["simple", "quick-start", "minimal"],
    isOfficial: true,
  },
  {
    id: "standard",
    name: "Standard API",
    description:
      "Well-balanced setup for most production APIs with essential features",
    complexity: "Intermediate",
    projectTypes: ["webapi"],
    architectures: ["clean", "onion", "hexagonal"],
    features: {
      authentication: "jwt",
      documentation: "swagger_extended",
      cqrs: "mediatr",
      logging: "serilog",
      error_handling: "result_pattern",
      containerization: "dockerfile",
    },
    tags: ["production", "recommended", "api"],
    isOfficial: true,
  },
  {
    id: "enterprise",
    name: "Enterprise Grade",
    description: "Full-featured setup for large-scale enterprise applications",
    complexity: "Advanced",
    projectTypes: ["webapi"],
    architectures: ["ddd", "clean"],
    features: {
      authentication: "jwt",
      documentation: ["swagger_extended", "scalar"],
      cqrs: "mediatr",
      logging: "serilog",
      error_handling: "result_pattern",
      containerization: ["dockerfile", "docker_compose"],
      events: "rabbitmq",
    },
    tags: ["enterprise", "scalable", "microservices"],
    isOfficial: true,
  },
  {
    id: "microservice",
    name: "Microservice Ready",
    description:
      "Optimized for microservices architecture with event-driven patterns",
    complexity: "Advanced",
    projectTypes: ["webapi"],
    architectures: ["ddd", "clean", "hexagonal"],
    features: {
      authentication: "jwt",
      documentation: "scalar",
      cqrs: "mediatr",
      logging: "serilog",
      error_handling: "result_pattern",
      containerization: ["dockerfile", "docker_compose"],
      events: "rabbitmq",
    },
    tags: ["microservices", "distributed", "events"],
    isOfficial: true,
  },
  {
    id: "rapid_prototype",
    name: "Rapid Prototype",
    description: "Quick setup for prototyping and MVP development",
    complexity: "Beginner",
    projectTypes: ["webapi", "mvc"],
    architectures: ["default"],
    features: {
      authentication: "none",
      documentation: "swagger",
      logging: "serilog",
      error_handling: "exceptions",
      containerization: "dockerfile",
    },
    tags: ["prototype", "mvp", "fast"],
    isOfficial: true,
  },
  {
    id: "security_focused",
    name: "Security Focused",
    description: "Enhanced security features for sensitive applications",
    complexity: "Advanced",
    projectTypes: ["webapi"],
    architectures: ["clean", "ddd"],
    features: {
      authentication: "identity",
      documentation: "swagger_extended",
      cqrs: "mediatr",
      logging: "serilog",
      error_handling: "result_pattern",
    },
    tags: ["security", "identity", "compliance"],
    isOfficial: true,
  },
];

export const FeaturesPresets: React.FC = () => {
  const { applyPreset, currentArchitecture, currentProjectType } =
    useEnhancedFeaturesStore();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPreset, setSelectedPreset] = useState<FeaturePreset | null>(
    null
  );
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Filter presets based on current architecture and project type
  const compatiblePresets = predefinedPresets.filter(
    (preset) =>
      preset.architectures.includes(currentArchitecture) &&
      preset.projectTypes.includes(currentProjectType)
  );

  const handlePresetSelect = (preset: FeaturePreset) => {
    setSelectedPreset(preset);
    onOpen();
  };

  const applySelectedPreset = () => {
    if (selectedPreset) {
      applyPreset({ features: selectedPreset.features });
      toast({
        title: "Preset Applied",
        description: `"${selectedPreset.name}" configuration has been applied to your project`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };

  const getPresetIcon = (presetId: string) => {
    const iconMap: { [key: string]: any } = {
      minimal: Code,
      standard: Star,
      enterprise: Crown,
      microservice: Layers,
      rapid_prototype: Zap,
      security_focused: Shield,
    };
    return iconMap[presetId] || Sparkles;
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

  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDown size={16} />}
          leftIcon={<Sparkles size={16} />}
          variant="outline"
          size="md"
          borderRadius="lg"
          _hover={{
            bg: "purple.50",
            borderColor: "purple.300",
          }}
        >
          Apply Preset
        </MenuButton>
        <MenuList borderRadius="xl" p={2} minW="280px">
          <VStack spacing={1} align="stretch">
            <Text
              px={3}
              py={2}
              fontSize="sm"
              fontWeight="bold"
              color="gray.600"
            >
              🚀 Quick Start Presets
            </Text>

            {compatiblePresets.length > 0 ? (
              compatiblePresets.map((preset) => {
                const PresetIcon = getPresetIcon(preset.id);

                return (
                  <MenuItem
                    key={preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    borderRadius="lg"
                    p={3}
                    _hover={{ bg: "purple.50" }}
                    _focus={{ bg: "purple.50" }}
                  >
                    <HStack spacing={3} w="full">
                      <Box
                        p={2}
                        bg="purple.50"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="purple.200"
                      >
                        <Icon as={PresetIcon} color="purple.600" size={16} />
                      </Box>

                      <VStack align="start" spacing={1} flex="1">
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="medium" fontSize="sm">
                            {preset.name}
                          </Text>
                          <Badge
                            colorScheme={getComplexityColor(preset.complexity)}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {preset.complexity}
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.600" lineHeight="1.3">
                          {preset.description}
                        </Text>
                      </VStack>
                    </HStack>
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem isDisabled>
                <VStack spacing={2} py={2}>
                  <Text fontSize="sm" color="gray.500">
                    No presets available
                  </Text>
                  <Text fontSize="xs" color="gray.400" textAlign="center">
                    for {currentProjectType} with {currentArchitecture}{" "}
                    architecture
                  </Text>
                </VStack>
              </MenuItem>
            )}

            <MenuDivider />

            <MenuItem
              onClick={onOpen}
              borderRadius="lg"
              p={3}
              _hover={{ bg: "blue.50" }}
              _focus={{ bg: "blue.50" }}
            >
              <HStack spacing={2}>
                <Icon as={Rocket} color="blue.500" size={16} />
                <Text fontSize="sm" fontWeight="medium">
                  Browse All Presets
                </Text>
              </HStack>
            </MenuItem>
          </VStack>
        </MenuList>
      </Menu>

      {/* Preset Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent borderRadius="2xl" maxH="90vh">
          <ModalHeader pb={2}>
            <HStack spacing={3}>
              <Icon as={Sparkles} color="purple.500" />
              <Text>
                {selectedPreset
                  ? `${selectedPreset.name} Preset`
                  : "Available Presets"}
              </Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6} overflowY="auto">
            {selectedPreset ? (
              // Single preset details
              <VStack spacing={6} align="stretch">
                <Box
                  p={6}
                  bg="purple.50"
                  borderRadius="xl"
                  border="2px solid"
                  borderColor="purple.200"
                >
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between" align="start">
                      <VStack align="start" spacing={2}>
                        <HStack spacing={3}>
                          <Icon
                            as={getPresetIcon(selectedPreset.id)}
                            color="purple.600"
                            size={24}
                          />
                          <Text fontSize="xl" fontWeight="bold">
                            {selectedPreset.name}
                          </Text>
                        </HStack>
                        <Text color="gray.600" lineHeight="1.5">
                          {selectedPreset.description}
                        </Text>
                      </VStack>

                      <VStack spacing={2}>
                        <Badge
                          colorScheme={getComplexityColor(
                            selectedPreset.complexity
                          )}
                          variant="solid"
                          px={3}
                          py={1}
                          borderRadius="full"
                        >
                          {selectedPreset.complexity}
                        </Badge>
                        {selectedPreset.isOfficial && (
                          <Badge
                            colorScheme="blue"
                            variant="solid"
                            fontSize="xs"
                          >
                            Official
                          </Badge>
                        )}
                      </VStack>
                    </HStack>

                    <HStack spacing={2} flexWrap="wrap">
                      {selectedPreset.tags.map((tag) => (
                        <Badge
                          key={tag}
                          colorScheme="purple"
                          variant="outline"
                          fontSize="xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </HStack>
                  </VStack>
                </Box>

                {/* Features included */}
                <Box>
                  <Text fontSize="lg" fontWeight="bold" mb={4}>
                    📋 Included Features
                  </Text>
                  <VStack spacing={3} align="stretch">
                    {Object.entries(selectedPreset.features).map(
                      ([groupId, selection]) => {
                        const selectionArray = Array.isArray(selection)
                          ? selection
                          : [selection];

                        return (
                          <Box
                            key={groupId}
                            p={4}
                            bg={cardBg}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="lg"
                          >
                            <VStack align="stretch" spacing={2}>
                              <Text
                                fontWeight="medium"
                                fontSize="sm"
                                textTransform="capitalize"
                              >
                                {groupId.replace("_", " ")}
                              </Text>
                              <HStack spacing={2} flexWrap="wrap">
                                {selectionArray.map((item) => (
                                  <Badge
                                    key={item}
                                    colorScheme="blue"
                                    variant="subtle"
                                  >
                                    {item.replace("_", " ")}
                                  </Badge>
                                ))}
                              </HStack>
                            </VStack>
                          </Box>
                        );
                      }
                    )}
                  </VStack>
                </Box>

                {/* Apply button */}
                <HStack justify="flex-end" spacing={3} pt={4}>
                  <Button variant="ghost" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    colorScheme="purple"
                    leftIcon={<Zap size={16} />}
                    onClick={applySelectedPreset}
                    size="lg"
                  >
                    Apply This Preset
                  </Button>
                </HStack>
              </VStack>
            ) : (
              // All presets overview
              <VStack spacing={6} align="stretch">
                <Text color="gray.600">
                  Choose a preset that matches your project requirements. Each
                  preset is optimized for specific scenarios and includes
                  carefully selected features.
                </Text>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  {compatiblePresets.map((preset) => {
                    const PresetIcon = getPresetIcon(preset.id);

                    return (
                      <Box
                        key={preset.id}
                        p={4}
                        bg={cardBg}
                        borderWidth="1px"
                        borderColor={borderColor}
                        borderRadius="xl"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          transform: "translateY(-2px)",
                          shadow: "md",
                          borderColor: "purple.300",
                        }}
                        onClick={() => setSelectedPreset(preset)}
                      >
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <HStack spacing={3}>
                              <Icon
                                as={PresetIcon}
                                color="purple.500"
                                size={20}
                              />
                              <Text fontWeight="bold">{preset.name}</Text>
                            </HStack>
                            <Badge
                              colorScheme={getComplexityColor(
                                preset.complexity
                              )}
                              variant="subtle"
                              fontSize="xs"
                            >
                              {preset.complexity}
                            </Badge>
                          </HStack>

                          <Text fontSize="sm" color="gray.600" lineHeight="1.4">
                            {preset.description}
                          </Text>

                          <HStack spacing={1} flexWrap="wrap">
                            {preset.tags.slice(0, 3).map((tag) => (
                              <Badge
                                key={tag}
                                colorScheme="purple"
                                variant="outline"
                                fontSize="xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {preset.tags.length > 3 && (
                              <Badge
                                colorScheme="gray"
                                variant="outline"
                                fontSize="xs"
                              >
                                +{preset.tags.length - 3}
                              </Badge>
                            )}
                          </HStack>
                        </VStack>
                      </Box>
                    );
                  })}
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
