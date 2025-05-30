// src/components/dependencies/TemplateSelectionModal.tsx
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Icon,
  Flex,
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
} from "@chakra-ui/react";
import { Sparkles, Zap } from "lucide-react";
import { ProjectStructure } from "../../types/project";
import { PackageVersionSelector } from "./PackageVersionSelector";

interface TemplatePackage {
  id: string;
  description: string;
  version: string;
  category: string;
  essential: boolean;
}

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: {
    type: string;
    architecture: string;
    dotnetVersion: string;
    database: string;
  };
  architectureInfo: {
    projects: ProjectStructure[];
  };
  recommendedTemplates: { [projectName: string]: TemplatePackage[] };
  selectedTemplate: { [projectName: string]: { [packageId: string]: boolean } };
  onTogglePackage: (projectName: string, packageId: string) => void;
  onSelectAllForProject: (projectName: string) => void;
  onApplyTemplate: (packageVersions: {
    [projectName: string]: { [packageId: string]: string };
  }) => void;
}

const getLayerColor = (layer?: string) => {
  switch (layer) {
    case "domain":
      return "purple";
    case "application":
      return "blue";
    case "infrastructure":
      return "green";
    case "presentation":
      return "orange";
    case "shared":
      return "gray";
    default:
      return "blue";
  }
};

const getLayerIcon = (layer?: string) => {
  const icons = {
    domain: "🧠",
    application: "⚙️",
    infrastructure: "🏗️",
    presentation: "🎨",
    shared: "🔗",
    default: "📦",
  };
  return icons[layer as keyof typeof icons] || icons.default;
};

export const TemplateSelectionModal: React.FC<TemplateSelectionModalProps> = ({
  isOpen,
  onClose,
  config,
  architectureInfo,
  recommendedTemplates,
  selectedTemplate,
  onTogglePackage,
  onSelectAllForProject,
  onApplyTemplate,
}) => {
  // State to track version selections
  const [packageVersions, setPackageVersions] = useState<{
    [projectName: string]: { [packageId: string]: string };
  }>({});

  const hasAnySelection = Object.values(selectedTemplate).some((project) =>
    Object.values(project || {}).some(Boolean)
  );

  const handleVersionChange = (
    projectName: string,
    packageId: string,
    version: string
  ) => {
    setPackageVersions((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        [packageId]: version,
      },
    }));
  };

  const handleApplyTemplate = () => {
    onApplyTemplate(packageVersions);
  };

  // Initialize package versions with default values
  React.useEffect(() => {
    const initialVersions: {
      [projectName: string]: { [packageId: string]: string };
    } = {};

    Object.entries(recommendedTemplates).forEach(([projectName, packages]) => {
      initialVersions[projectName] = {};
      packages.forEach((pkg) => {
        initialVersions[projectName][pkg.id] = pkg.version;
      });
    });

    setPackageVersions(initialVersions);
  }, [recommendedTemplates]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <HStack spacing={2}>
            <Icon as={Sparkles} color="purple.500" />
            <Text>Recommended Package Templates</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} overflowY="auto">
          <VStack spacing={6} align="stretch">
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <AlertDescription>
                Select packages optimized for <strong>{config.type}</strong>{" "}
                projects using <strong>{config.architecture}</strong>{" "}
                architecture with <strong>.NET {config.dotnetVersion}</strong>
                {config.database !== "none" && (
                  <>
                    {" "}
                    and <strong>{config.database}</strong> database
                  </>
                )}
              </AlertDescription>
            </Alert>

            {Object.entries(recommendedTemplates).map(
              ([projectName, packages]) => {
                const project = architectureInfo.projects.find(
                  (p) => p.name === projectName
                );
                const layerColor = getLayerColor(project?.layer);
                const layerIcon = getLayerIcon(project?.layer);

                return (
                  <Box
                    key={projectName}
                    borderWidth="1px"
                    borderRadius="lg"
                    p={4}
                  >
                    <VStack align="stretch" spacing={4}>
                      <Flex justify="space-between" align="center">
                        <HStack spacing={2}>
                          <Text fontSize="lg">{layerIcon}</Text>
                          <Text
                            fontSize="lg"
                            fontWeight="bold"
                            color={`${layerColor}.700`}
                          >
                            {projectName}
                          </Text>
                          <Badge colorScheme={layerColor} variant="subtle">
                            {packages.length} packages
                          </Badge>
                        </HStack>
                        <HStack spacing={2}>
                          <Button
                            size="sm"
                            variant="outline"
                            colorScheme={layerColor}
                            onClick={() => onSelectAllForProject(projectName)}
                          >
                            Select All
                          </Button>
                          <Text fontSize="xs" color="gray.500">
                            {
                              Object.values(
                                selectedTemplate[projectName] || {}
                              ).filter(Boolean).length
                            }{" "}
                            selected
                          </Text>
                        </HStack>
                      </Flex>

                      <TableContainer>
                        <Table size="sm">
                          <Thead>
                            <Tr>
                              <Th width="40px"></Th>
                              <Th>Package</Th>
                              <Th width="200px">Version</Th>
                              <Th>Category</Th>
                              <Th>Description</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {packages.map((pkg) => {
                              const isSelected =
                                selectedTemplate[projectName]?.[pkg.id] ||
                                false;

                              return (
                                <Tr
                                  key={pkg.id}
                                  bg={
                                    isSelected
                                      ? `${layerColor}.50`
                                      : "transparent"
                                  }
                                >
                                  <Td>
                                    <Checkbox
                                      isChecked={isSelected}
                                      onChange={() =>
                                        onTogglePackage(projectName, pkg.id)
                                      }
                                      colorScheme={layerColor}
                                    />
                                  </Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <Text fontWeight="medium">{pkg.id}</Text>
                                      {pkg.essential && (
                                        <Badge colorScheme="red" size="xs">
                                          Essential
                                        </Badge>
                                      )}
                                    </HStack>
                                  </Td>
                                  <Td>
                                    <PackageVersionSelector
                                      packageId={pkg.id}
                                      defaultVersion={pkg.version}
                                      dotnetVersion={config.dotnetVersion}
                                      onVersionChange={(version) =>
                                        handleVersionChange(
                                          projectName,
                                          pkg.id,
                                          version
                                        )
                                      }
                                      size="sm"
                                      isDisabled={!isSelected}
                                    />
                                  </Td>
                                  <Td>
                                    <Badge
                                      colorScheme={layerColor}
                                      variant="subtle"
                                      size="sm"
                                    >
                                      {pkg.category}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Text
                                      fontSize="sm"
                                      color="gray.600"
                                      noOfLines={1}
                                    >
                                      {pkg.description}
                                    </Text>
                                  </Td>
                                </Tr>
                              );
                            })}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </VStack>
                  </Box>
                );
              }
            )}

            <Flex justify="space-between" align="center" pt={4}>
              <Text fontSize="sm" color="gray.600">
                💡 Tip: Version selectors are automatically populated from NuGet
                API with compatible versions for .NET {config.dotnetVersion}
              </Text>

              <HStack spacing={3}>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="purple"
                  leftIcon={<Zap size={16} />}
                  onClick={handleApplyTemplate}
                  isDisabled={!hasAnySelection}
                >
                  Apply Selected Packages (
                  {Object.values(selectedTemplate).reduce(
                    (total, project) =>
                      total +
                      Object.values(project || {}).filter(Boolean).length,
                    0
                  )}{" "}
                  selected)
                </Button>
              </HStack>
            </Flex>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
