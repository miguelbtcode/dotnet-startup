// src/components/features/FeatureGroupCard.tsx
import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useColorModeValue,
  Collapse,
  Button,
  IconButton,
  Tooltip,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Divider,
  Code,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  Check,
  X,
  Star,
  Crown,
  Package,
  FileText,
  Eye,
  Code as CodeIcon,
  Shield,
  Activity,
  GitBranch,
  AlertTriangle,
  Radio as RadioIcon,
} from "lucide-react";
import { FeatureGroup, FeatureOption } from "../../types/features";
import { useEnhancedFeaturesStore } from "../../store/enhancedFeaturesStore";

interface FeatureGroupCardProps {
  group: FeatureGroup;
  selectedValue: string | string[] | undefined;
  onSelectionChange: (value: string | string[]) => void;
}

const getIconComponent = (iconName: string) => {
  const iconMap: { [key: string]: any } = {
    Shield,
    FileText,
    GitBranch,
    Activity,
    AlertTriangle,
    Package,
    Radio: RadioIcon,
  };
  return iconMap[iconName] || Package;
};

const getCategoryColor = (category: string) => {
  const colorMap: { [key: string]: string } = {
    security: "green",
    documentation: "blue",
    patterns: "purple",
    logging: "orange",
    infrastructure: "teal",
    messaging: "pink",
  };
  return colorMap[category] || "gray";
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

export const FeatureGroupCard: React.FC<FeatureGroupCardProps> = ({
  group,
  selectedValue,
}) => {
  const { selectFeature, toggleMultipleFeature } = useEnhancedFeaturesStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    isOpen: isModalOpen,
    onOpen: openModal,
    onClose: closeModal,
  } = useDisclosure();
  const [selectedOptionForDetails, setSelectedOptionForDetails] =
    useState<FeatureOption | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const categoryColor = getCategoryColor(group.category);
  const IconComponent = getIconComponent(group.icon);

  const handleSelection = (optionId: string) => {
    if (group.allowMultiple) {
      toggleMultipleFeature(group.id, optionId);
    } else {
      selectFeature(group.id, optionId);
    }
  };

  const getSelectedOptions = (): string[] => {
    if (!selectedValue) return [];
    return Array.isArray(selectedValue) ? selectedValue : [selectedValue];
  };

  const isOptionSelected = (optionId: string): boolean => {
    const selected = getSelectedOptions();
    return selected.includes(optionId);
  };

  const openOptionDetails = (option: FeatureOption) => {
    setSelectedOptionForDetails(option);
    openModal();
  };

  const OptionDetailsModal = () => (
    <Modal isOpen={isModalOpen} onClose={closeModal} size="4xl">
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" borderRadius="2xl">
        <ModalHeader pb={2}>
          <HStack spacing={3}>
            <Icon as={IconComponent} color={`${categoryColor}.500`} />
            <Text>{selectedOptionForDetails?.title}</Text>
            <Badge
              colorScheme={getComplexityColor(
                selectedOptionForDetails?.complexity || "Beginner"
              )}
              variant="subtle"
            >
              {selectedOptionForDetails?.complexity}
            </Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} overflowY="auto">
          {selectedOptionForDetails && (
            <VStack spacing={6} align="stretch">
              <Text fontSize="md" color="gray.600" lineHeight="1.6">
                {selectedOptionForDetails.description}
              </Text>

              {/* Pros and Cons */}
              <HStack spacing={6} align="start">
                <Box flex="1">
                  <Text fontWeight="bold" color="green.600" mb={3}>
                    ✅ Advantages
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    {selectedOptionForDetails.pros.map((pro, index) => (
                      <HStack key={index} spacing={2} align="start">
                        <Icon as={Check} color="green.500" size={16} mt={0.5} />
                        <Text fontSize="sm" lineHeight="1.5">
                          {pro}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                <Box flex="1">
                  <Text fontWeight="bold" color="red.600" mb={3}>
                    ❌ Considerations
                  </Text>
                  <VStack align="stretch" spacing={2}>
                    {selectedOptionForDetails.cons.map((con, index) => (
                      <HStack key={index} spacing={2} align="start">
                        <Icon as={X} color="red.500" size={16} mt={0.5} />
                        <Text fontSize="sm" lineHeight="1.5">
                          {con}
                        </Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </HStack>

              {/* Packages and Config Files */}
              <HStack spacing={6} align="start">
                {selectedOptionForDetails.nugetPackages &&
                  selectedOptionForDetails.nugetPackages.length > 0 && (
                    <Box flex="1">
                      <Text fontWeight="bold" color="purple.600" mb={3}>
                        📦 NuGet Packages
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        {selectedOptionForDetails.nugetPackages.map(
                          (pkg, index) => (
                            <Box
                              key={index}
                              p={2}
                              bg="purple.50"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="purple.200"
                            >
                              <Code fontSize="sm" color="purple.800">
                                {pkg}
                              </Code>
                            </Box>
                          )
                        )}
                      </VStack>
                    </Box>
                  )}

                {selectedOptionForDetails.configFiles &&
                  selectedOptionForDetails.configFiles.length > 0 && (
                    <Box flex="1">
                      <Text fontWeight="bold" color="blue.600" mb={3}>
                        📄 Config Files
                      </Text>
                      <VStack align="stretch" spacing={2}>
                        {selectedOptionForDetails.configFiles.map(
                          (file, index) => (
                            <Box
                              key={index}
                              p={2}
                              bg="blue.50"
                              borderRadius="md"
                              border="1px solid"
                              borderColor="blue.200"
                            >
                              <Code fontSize="sm" color="blue.800">
                                {file}
                              </Code>
                            </Box>
                          )
                        )}
                      </VStack>
                    </Box>
                  )}
              </HStack>

              {/* Code Examples */}
              {selectedOptionForDetails.codeExamples &&
                selectedOptionForDetails.codeExamples.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" color="gray.700" mb={4}>
                      💻 Code Examples
                    </Text>
                    <Tabs variant="enclosed" colorScheme="gray">
                      <TabList>
                        {selectedOptionForDetails.codeExamples.map(
                          (example, index) => (
                            <Tab key={index} fontSize="sm">
                              <HStack spacing={2}>
                                <Icon as={CodeIcon} size={14} />
                                <Text>{example.title}</Text>
                              </HStack>
                            </Tab>
                          )
                        )}
                      </TabList>
                      <TabPanels>
                        {selectedOptionForDetails.codeExamples.map(
                          (example, index) => (
                            <TabPanel key={index} p={0}>
                              <Box
                                bg="gray.900"
                                p={4}
                                borderRadius="md"
                                overflow="auto"
                                maxH="400px"
                              >
                                {example.filename && (
                                  <Text
                                    fontSize="xs"
                                    color="gray.400"
                                    mb={2}
                                    fontFamily="mono"
                                  >
                                    {example.filename}
                                  </Text>
                                )}
                                <Code
                                  display="block"
                                  whiteSpace="pre"
                                  p={0}
                                  bg="transparent"
                                  color="gray.100"
                                  fontSize="sm"
                                  fontFamily="'Fira Code', 'Consolas', monospace"
                                  lineHeight="1.6"
                                >
                                  {example.code}
                                </Code>
                              </Box>
                            </TabPanel>
                          )
                        )}
                      </TabPanels>
                    </Tabs>
                  </Box>
                )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return (
    <>
      <Box
        bg={cardBg}
        borderWidth="2px"
        borderColor={borderColor}
        borderRadius="2xl"
        overflow="hidden"
        transition="all 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          shadow: "xl",
          borderColor: `${categoryColor}.300`,
        }}
        position="relative"
      >
        {/* Category Indicator */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          height="4px"
          bgGradient={`linear(to-r, ${categoryColor}.400, ${categoryColor}.600)`}
        />

        <VStack spacing={0} align="stretch">
          {/* Header */}
          <Box p={6} pb={4}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between" align="start">
                <HStack spacing={3}>
                  <Box
                    p={3}
                    bg={`${categoryColor}.50`}
                    borderRadius="xl"
                    border="2px solid"
                    borderColor={`${categoryColor}.200`}
                  >
                    <Icon
                      as={IconComponent}
                      color={`${categoryColor}.600`}
                      size={20}
                    />
                  </Box>
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <Text fontWeight="bold" fontSize="lg" color="gray.800">
                        {group.title}
                      </Text>
                      {group.isRequired && (
                        <Badge colorScheme="red" variant="solid" fontSize="xs">
                          Required
                        </Badge>
                      )}
                    </HStack>
                    <Badge
                      colorScheme={categoryColor}
                      variant="subtle"
                      fontSize="xs"
                      textTransform="capitalize"
                    >
                      {group.category}
                    </Badge>
                  </VStack>
                </HStack>

                <IconButton
                  size="sm"
                  variant="ghost"
                  icon={
                    isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )
                  }
                  aria-label="Toggle details"
                  onClick={() => setIsExpanded(!isExpanded)}
                  borderRadius="full"
                />
              </HStack>

              <Text fontSize="sm" color="gray.600" lineHeight="1.5">
                {group.description}
              </Text>
            </VStack>
          </Box>

          {/* Options */}
          <Box px={6} pb={6}>
            <VStack spacing={3} align="stretch">
              {group.allowMultiple ? (
                <CheckboxGroup
                  value={getSelectedOptions()}
                  onChange={(values) => {
                    // Handle multiple selection through individual option clicks
                  }}
                >
                  <VStack spacing={3} align="stretch">
                    {group.options.map((option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        isSelected={isOptionSelected(option.id)}
                        onSelect={() => handleSelection(option.id)}
                        onViewDetails={() => openOptionDetails(option)}
                        selectionType="multiple"
                        categoryColor={categoryColor}
                      />
                    ))}
                  </VStack>
                </CheckboxGroup>
              ) : (
                <RadioGroup
                  value={(selectedValue as string) || ""}
                  onChange={(value) => selectFeature(group.id, value)}
                >
                  <VStack spacing={3} align="stretch">
                    {group.options.map((option) => (
                      <OptionCard
                        key={option.id}
                        option={option}
                        isSelected={isOptionSelected(option.id)}
                        onSelect={() => handleSelection(option.id)}
                        onViewDetails={() => openOptionDetails(option)}
                        selectionType="single"
                        categoryColor={categoryColor}
                      />
                    ))}
                  </VStack>
                </RadioGroup>
              )}
            </VStack>
          </Box>

          {/* Expanded Details */}
          <Collapse in={isExpanded}>
            <Box px={6} pb={6} pt={0}>
              <Divider mb={4} />
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  🔧 Implementation Details
                </Text>

                {getSelectedOptions().length > 0 ? (
                  <VStack spacing={3} align="stretch">
                    {getSelectedOptions().map((optionId) => {
                      const option = group.options.find(
                        (o) => o.id === optionId
                      );
                      if (!option) return null;

                      return (
                        <Box
                          key={optionId}
                          p={3}
                          bg="gray.50"
                          borderRadius="lg"
                          border="1px solid"
                          borderColor="gray.200"
                        >
                          <VStack align="stretch" spacing={2}>
                            <HStack justify="space-between">
                              <Text fontWeight="medium" fontSize="sm">
                                {option.title}
                              </Text>
                              <Badge
                                colorScheme={getComplexityColor(
                                  option.complexity
                                )}
                                variant="subtle"
                                size="sm"
                              >
                                {option.complexity}
                              </Badge>
                            </HStack>

                            {option.nugetPackages &&
                              option.nugetPackages.length > 0 && (
                                <Box>
                                  <Text fontSize="xs" color="gray.600" mb={1}>
                                    Packages: {option.nugetPackages.length}
                                  </Text>
                                  <HStack spacing={1} flexWrap="wrap">
                                    {option.nugetPackages
                                      .slice(0, 3)
                                      .map((pkg, idx) => (
                                        <Code
                                          key={idx}
                                          fontSize="xs"
                                          px={2}
                                          py={1}
                                        >
                                          {pkg}
                                        </Code>
                                      ))}
                                    {option.nugetPackages.length > 3 && (
                                      <Badge variant="outline" size="sm">
                                        +{option.nugetPackages.length - 3} more
                                      </Badge>
                                    )}
                                  </HStack>
                                </Box>
                              )}
                          </VStack>
                        </Box>
                      );
                    })}
                  </VStack>
                ) : (
                  <Text fontSize="sm" color="gray.500" fontStyle="italic">
                    Select an option to see implementation details
                  </Text>
                )}
              </VStack>
            </Box>
          </Collapse>
        </VStack>
      </Box>

      <OptionDetailsModal />
    </>
  );
};

interface OptionCardProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetails: () => void;
  selectionType: "single" | "multiple";
  categoryColor: string;
}

const OptionCard: React.FC<OptionCardProps> = ({
  option,
  isSelected,
  onSelect,
  onViewDetails,
  selectionType,
  categoryColor,
}) => {
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const selectedBg = useColorModeValue(
    `${categoryColor}.50`,
    `${categoryColor}.900`
  );
  const selectedBorder = useColorModeValue(
    `${categoryColor}.300`,
    `${categoryColor}.600`
  );

  return (
    <Box
      p={4}
      bg={isSelected ? selectedBg : "transparent"}
      borderWidth="1px"
      borderColor={isSelected ? selectedBorder : "gray.200"}
      borderRadius="xl"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        bg: isSelected ? selectedBg : hoverBg,
        borderColor: isSelected ? selectedBorder : `${categoryColor}.200`,
        transform: "translateY(-1px)",
      }}
      onClick={onSelect}
      position="relative"
    >
      <HStack justify="space-between" align="start" spacing={4}>
        <HStack spacing={3} flex="1" align="start">
          {selectionType === "single" ? (
            <Radio value={option.id} colorScheme={categoryColor} mt={1} />
          ) : (
            <Checkbox
              isChecked={isSelected}
              colorScheme={categoryColor}
              mt={1}
              onChange={onSelect}
            />
          )}

          <VStack align="start" spacing={2} flex="1">
            <HStack spacing={2} wrap="wrap">
              <Text fontWeight="semibold" fontSize="md">
                {option.title}
              </Text>

              {option.isRecommended && (
                <Tooltip label="Recommended by experts">
                  <Badge colorScheme="green" variant="solid" fontSize="xs">
                    <HStack spacing={1}>
                      <Icon as={Star} size={10} />
                      <Text>Recommended</Text>
                    </HStack>
                  </Badge>
                </Tooltip>
              )}

              {option.isEnterprise && (
                <Tooltip label="Enterprise-grade feature">
                  <Badge colorScheme="purple" variant="solid" fontSize="xs">
                    <HStack spacing={1}>
                      <Icon as={Crown} size={10} />
                      <Text>Enterprise</Text>
                    </HStack>
                  </Badge>
                </Tooltip>
              )}

              <Badge
                colorScheme={getComplexityColor(option.complexity)}
                variant="subtle"
                fontSize="xs"
              >
                {option.complexity}
              </Badge>
            </HStack>

            <Text fontSize="sm" color="gray.600" lineHeight="1.4">
              {option.description}
            </Text>

            {/* Quick Info */}
            <HStack spacing={4} fontSize="xs" color="gray.500">
              {option.nugetPackages && option.nugetPackages.length > 0 && (
                <HStack spacing={1}>
                  <Icon as={Package} size={12} />
                  <Text>{option.nugetPackages.length} packages</Text>
                </HStack>
              )}

              {option.configFiles && option.configFiles.length > 0 && (
                <HStack spacing={1}>
                  <Icon as={FileText} size={12} />
                  <Text>{option.configFiles.length} config files</Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </HStack>

        <Tooltip label="View implementation details">
          <IconButton
            size="sm"
            variant="ghost"
            icon={<Eye size={16} />}
            aria-label="View details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails();
            }}
            borderRadius="full"
            _hover={{
              bg: `${categoryColor}.100`,
              color: `${categoryColor}.600`,
            }}
          />
        </Tooltip>
      </HStack>
    </Box>
  );
};
