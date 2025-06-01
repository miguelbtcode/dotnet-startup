// src/App.tsx
import React, { useState } from "react";
import {
  ChakraProvider,
  Container,
  Grid,
  VStack,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Icon,
  Badge,
  Box,
  Text,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  Settings,
  Package,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Lock,
  Save,
  Zap,
} from "lucide-react";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectPreview } from "./components/ProjectPreview";
import { JsonOutput } from "./components/JsonOutput";
import { ProjectDependenciesManager } from "./components/ProjectDependenciesManager";
import { useProjectStore } from "./store/projectStore";
import { EnhancedFeaturesTab } from "./components/features/EnhancedFeaturesTab";

function App() {
  const {
    config,
    isConfigurationSaved,
    isBasicConfigValid,
    canAccessDependencies,
    canAccessExport,
    hasUnsavedChanges,
  } = useProjectStore();

  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  const handleTabChange = (index: number) => {
    if (index === 1 && !canAccessDependencies()) {
      toast({
        title: "Save Configuration Required",
        description:
          "Please save your configuration first by clicking 'Save Configuration' button",
        status: "warning",
        duration: 4000,
        position: "top",
      });
      return;
    }

    if (index === 2 && !canAccessDependencies()) {
      toast({
        title: "Save Configuration Required",
        description: "Please save your configuration first",
        status: "warning",
        duration: 3000,
        position: "top",
      });
      return;
    }

    setActiveTab(index);
  };

  const getTabStatus = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return isBasicConfigValid() && isConfigurationSaved
          ? "complete"
          : "current";
      case 1:
      case 2:
        return canAccessDependencies() ? "available" : "disabled";
      case 3:
        return canAccessExport() ? "available" : "disabled";
      default:
        return "disabled";
    }
  };

  const TabWithStatus: React.FC<{
    index: number;
    icon: any;
    label: string;
    description: string;
  }> = ({ index, icon, label, description }) => {
    const status = getTabStatus(index);

    return (
      <Tab
        isDisabled={status === "disabled"}
        opacity={status === "disabled" ? 0.5 : 1}
        _selected={{
          borderBottomColor: "blue.500",
          color: "blue.600",
        }}
        position="relative"
      >
        <VStack spacing={1} py={2}>
          <HStack spacing={2}>
            <Icon as={icon} size={16} />
            <Text fontSize="sm" fontWeight="medium">
              {label}
            </Text>
            {status === "complete" && (
              <Icon as={CheckCircle} size={14} color="green.500" />
            )}
            {status === "disabled" && (
              <Icon
                as={!isConfigurationSaved ? Lock : AlertTriangle}
                size={14}
                color="gray.400"
              />
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            {status === "disabled" && !isConfigurationSaved
              ? "Save config first"
              : description}
          </Text>
        </VStack>
      </Tab>
    );
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4}>
            <Heading
              textAlign="center"
              size="xl"
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              .NET Project Generator
            </Heading>

            {/* Progress Indicator */}
            <HStack spacing={4} justify="center">
              <Badge
                colorScheme={
                  isBasicConfigValid() && isConfigurationSaved
                    ? "green"
                    : hasUnsavedChanges()
                    ? "orange"
                    : "gray"
                }
                variant={
                  isBasicConfigValid() && isConfigurationSaved
                    ? "solid"
                    : "outline"
                }
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon
                    as={isConfigurationSaved ? CheckCircle : Save}
                    size={12}
                  />
                  <Text fontSize="xs">
                    {isConfigurationSaved
                      ? "Config Saved"
                      : hasUnsavedChanges()
                      ? "Save Required"
                      : "Configure"}
                  </Text>
                </HStack>
              </Badge>

              <Icon as={ArrowRight} size={16} color="gray.400" />

              <Badge
                colorScheme={canAccessDependencies() ? "blue" : "gray"}
                variant={canAccessDependencies() ? "solid" : "outline"}
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon
                    as={canAccessDependencies() ? Package : Lock}
                    size={12}
                  />
                  <Text fontSize="xs">Dependencies</Text>
                </HStack>
              </Badge>

              <Icon as={ArrowRight} size={16} color="gray.400" />

              <Badge
                colorScheme={canAccessExport() ? "purple" : "gray"}
                variant={canAccessExport() ? "solid" : "outline"}
                px={3}
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon as={canAccessExport() ? FileText : Lock} size={12} />
                  <Text fontSize="xs">Export</Text>
                </HStack>
              </Badge>
            </HStack>
          </VStack>

          {/* Configuration Alerts - Only show one at a time */}
          {!isBasicConfigValid() ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                <strong>Getting Started:</strong> Please enter your project name
                and select your preferred settings to begin.
              </AlertDescription>
            </Alert>
          ) : !isConfigurationSaved ? (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                <strong>Save Required:</strong> Click the "Save Configuration"
                button to unlock additional features and proceed to the next
                steps.
              </AlertDescription>
            </Alert>
          ) : config.architecture === "default" && activeTab === 0 ? (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                <strong>Enhanced Features Available:</strong> You can switch to
                Clean Architecture, DDD, Hexagonal, or Onion to access advanced
                dependency management features.
              </AlertDescription>
            </Alert>
          ) : null}

          <Tabs
            index={activeTab}
            onChange={handleTabChange}
            variant="enclosed"
            colorScheme="blue"
          >
            <TabList>
              <TabWithStatus
                index={0}
                icon={Settings}
                label="Project Configuration"
                description="Basic setup & features"
              />
              <TabWithStatus
                index={2}
                icon={Zap}
                label="Features"
                description="Advanced features & patterns"
              />
              <TabWithStatus
                index={1}
                icon={Package}
                label="Dependencies"
                description="NuGet packages per project"
              />
              <TabWithStatus
                index={3}
                icon={FileText}
                label="Preview & Export"
                description="Review & download config"
              />
            </TabList>

            <TabPanels>
              {/* Basic Configuration Tab */}
              <TabPanel p={0} pt={6}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                  gap={8}
                >
                  <VStack spacing={8} align="stretch">
                    <ProjectForm />
                  </VStack>

                  <VStack spacing={8} align="stretch">
                    <ProjectPreview />

                    {canAccessDependencies() ? (
                      <Box
                        p={4}
                        bg="blue.50"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="blue.200"
                      >
                        <VStack spacing={3}>
                          <Icon as={Package} size={24} color="blue.500" />
                          <Text
                            textAlign="center"
                            fontWeight="medium"
                            color="blue.700"
                          >
                            Ready for Dependencies!
                          </Text>
                          <Text
                            fontSize="sm"
                            textAlign="center"
                            color="blue.600"
                          >
                            {config.architecture === "default"
                              ? "Your monolithic project is ready. Add NuGet packages to enhance functionality."
                              : `Your ${config.architecture} architecture is configured. Move to the Dependencies tab to add NuGet packages.`}
                          </Text>
                          <Button
                            colorScheme="blue"
                            size="sm"
                            onClick={() => setActiveTab(1)}
                            rightIcon={<ArrowRight size={14} />}
                          >
                            {config.architecture === "default"
                              ? "Add Packages"
                              : "Configure Dependencies"}
                          </Button>
                        </VStack>
                      </Box>
                    ) : null}
                  </VStack>
                </Grid>
              </TabPanel>

              {/* Features Tab */}
              <TabPanel p={0} pt={6}>
                {canAccessDependencies() ? (
                  <EnhancedFeaturesTab />
                ) : (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">
                          Features tab is locked. You need to:
                        </Text>
                        <Text>• Complete the basic configuration</Text>
                        <Text>• Save your configuration first</Text>
                      </VStack>
                    </AlertDescription>
                  </Alert>
                )}
              </TabPanel>

              {/* Dependencies Tab */}
              <TabPanel p={0} pt={6}>
                {canAccessDependencies() ? (
                  <ProjectDependenciesManager />
                ) : (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">
                          Dependencies tab is locked. You need to:
                        </Text>
                        <Text>• Complete the basic configuration</Text>
                        <Text>• Save your configuration first</Text>
                      </VStack>
                    </AlertDescription>
                  </Alert>
                )}
              </TabPanel>

              {/* Preview & Export Tab */}
              <TabPanel p={0} pt={6}>
                {canAccessExport() ? (
                  <Grid
                    templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                    gap={8}
                  >
                    <VStack spacing={8} align="stretch">
                      <ProjectPreview />
                    </VStack>

                    <VStack spacing={8} align="stretch">
                      <JsonOutput />

                      {/* Summary Stats */}
                      <Box
                        p={4}
                        bg="green.50"
                        borderRadius="lg"
                        borderWidth="1px"
                        borderColor="green.200"
                      >
                        <VStack spacing={3}>
                          <Icon as={CheckCircle} size={24} color="green.500" />
                          <Text
                            textAlign="center"
                            fontWeight="medium"
                            color="green.700"
                          >
                            Configuration Complete
                          </Text>
                          <VStack spacing={1} fontSize="sm" color="green.600">
                            <Text>• Architecture: {config.architecture}</Text>
                            <Text>• .NET Version: {config.dotnetVersion}</Text>
                            <Text>• Project Type: {config.type}</Text>
                            <Text>
                              • Total Packages:{" "}
                              {config.selectedPackages
                                ? Object.values(config.selectedPackages).reduce(
                                    (sum, packages) => sum + packages.length,
                                    0
                                  )
                                : 0}
                            </Text>
                          </VStack>
                        </VStack>
                      </Box>
                    </VStack>
                  </Grid>
                ) : (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                      <VStack align="start" spacing={2}>
                        <Text fontWeight="bold">
                          Export tab is locked. You need to:
                        </Text>
                        <Text>• Complete the basic configuration</Text>
                        <Text>• Save your configuration first</Text>
                      </VStack>
                    </AlertDescription>
                  </Alert>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
