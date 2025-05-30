// src/App.tsx
import React, { useState, useEffect } from "react";
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
  ArrowRight 
} from "lucide-react";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectPreview } from "./components/ProjectPreview";
import { JsonOutput } from "./components/JsonOutput";
import { ProjectDependenciesManager } from "./components/ProjectDependenciesManager";
import { useProjectStore } from "./store/projectStore";

function App() {
  const { config } = useProjectStore();
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();

  // Validation for tab access
  const isBasicConfigValid = () => {
    return config.name && config.name.trim().length > 0;
  };

  const canAccessDependencies = () => {
    return isBasicConfigValid() && config.architecture !== 'default';
  };

  const handleTabChange = (index: number) => {
    if (index === 1 && !canAccessDependencies()) {
      toast({
        title: "Configuration Required",
        description: "Please complete basic configuration and select an architecture first",
        status: "warning",
        duration: 3000,
      });
      return;
    }
    setActiveTab(index);
  };

  // Auto-advance to dependencies tab when config is complete
  useEffect(() => {
    if (canAccessDependencies() && activeTab === 0) {
      // Optional: Auto-suggest moving to dependencies
      // You can uncomment this if you want automatic progression
      // setActiveTab(1);
    }
  }, [config.name, config.architecture, activeTab]);

  const getTabStatus = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return isBasicConfigValid() ? 'complete' : 'current';
      case 1:
        return canAccessDependencies() ? 'available' : 'disabled';
      case 2:
        return isBasicConfigValid() ? 'available' : 'disabled';
      default:
        return 'disabled';
    }
  };

  const TabWithStatus: React.FC<{ 
    index: number; 
    icon: any; 
    label: string; 
    description: string 
  }> = ({ index, icon, label, description }) => {
    const status = getTabStatus(index);
    const isActive = activeTab === index;
    
    return (
      <Tab
        isDisabled={status === 'disabled'}
        opacity={status === 'disabled' ? 0.5 : 1}
        _selected={{
          borderBottomColor: 'blue.500',
          color: 'blue.600',
        }}
        position="relative"
      >
        <VStack spacing={1} py={2}>
          <HStack spacing={2}>
            <Icon as={icon} size={16} />
            <Text fontSize="sm" fontWeight="medium">
              {label}
            </Text>
            {status === 'complete' && (
              <Icon as={CheckCircle} size={14} color="green.500" />
            )}
            {status === 'disabled' && (
              <Icon as={AlertTriangle} size={14} color="gray.400" />
            )}
          </HStack>
          <Text fontSize="xs" color="gray.500" textAlign="center">
            {description}
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
                colorScheme={isBasicConfigValid() ? 'green' : 'gray'} 
                variant={isBasicConfigValid() ? 'solid' : 'outline'}
                px={3} 
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon as={Settings} size={12} />
                  <Text fontSize="xs">Basic Config</Text>
                  {isBasicConfigValid() && <Icon as={CheckCircle} size={10} />}
                </HStack>
              </Badge>
              
              <Icon as={ArrowRight} size={16} color="gray.400" />
              
              <Badge 
                colorScheme={canAccessDependencies() ? 'blue' : 'gray'} 
                variant={canAccessDependencies() ? 'solid' : 'outline'}
                px={3} 
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon as={Package} size={12} />
                  <Text fontSize="xs">Dependencies</Text>
                </HStack>
              </Badge>
              
              <Icon as={ArrowRight} size={16} color="gray.400" />
              
              <Badge 
                colorScheme={isBasicConfigValid() ? 'purple' : 'gray'} 
                variant={isBasicConfigValid() ? 'solid' : 'outline'}
                px={3} 
                py={1}
                borderRadius="full"
              >
                <HStack spacing={1}>
                  <Icon as={FileText} size={12} />
                  <Text fontSize="xs">Export</Text>
                </HStack>
              </Badge>
            </HStack>
          </VStack>

          {/* Configuration Guide */}
          {!isBasicConfigValid() && (
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                <strong>Getting Started:</strong> Please enter your project name and select your preferred architecture to begin configuring dependencies.
              </AlertDescription>
            </Alert>
          )}

          {isBasicConfigValid() && !canAccessDependencies() && (
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                <strong>Enhanced Architecture:</strong> Select Clean Architecture, DDD, Hexagonal, or Onion to access advanced dependency management features.
              </AlertDescription>
            </Alert>
          )}

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
                index={1}
                icon={Package}
                label="Dependencies"
                description="NuGet packages per project"
              />
              <TabWithStatus 
                index={2}
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
                    
                    {canAccessDependencies() && (
                      <Box p={4} bg="blue.50" borderRadius="lg" borderWidth="1px" borderColor="blue.200">
                        <VStack spacing={3}>
                          <Icon as={Package} size={24} color="blue.500" />
                          <Text textAlign="center" fontWeight="medium" color="blue.700">
                            Ready for Dependencies!
                          </Text>
                          <Text fontSize="sm" textAlign="center" color="blue.600">
                            Your {config.architecture} architecture is configured. 
                            Move to the Dependencies tab to add NuGet packages.
                          </Text>
                          <Button 
                            colorScheme="blue" 
                            size="sm"
                            onClick={() => setActiveTab(1)}
                            rightIcon={<ArrowRight size={14} />}
                          >
                            Configure Dependencies
                          </Button>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Grid>
              </TabPanel>

              {/* Dependencies Tab */}
              <TabPanel p={0} pt={6}>
                {canAccessDependencies() ? (
                  <ProjectDependenciesManager />
                ) : (
                  <Alert status="warning" borderRadius="lg">
                    <AlertIcon />
                    <AlertDescription>
                      Please complete the basic configuration first. You need to:
                      <br />• Enter a project name
                      <br />• Select an architecture (Clean, DDD, Hexagonal, or Onion)
                    </AlertDescription>
                  </Alert>
                )}
              </TabPanel>

              {/* Preview & Export Tab */}
              <TabPanel p={0} pt={6}>
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
                    {isBasicConfigValid() && (
                      <Box p={4} bg="green.50" borderRadius="lg" borderWidth="1px" borderColor="green.200">
                        <VStack spacing={3}>
                          <Icon as={CheckCircle} size={24} color="green.500" />
                          <Text textAlign="center" fontWeight="medium" color="green.700">
                            Configuration Complete
                          </Text>
                          <VStack spacing={1} fontSize="sm" color="green.600">
                            <Text>• Architecture: {config.architecture}</Text>
                            <Text>• Database: {config.database}</Text>
                            <Text>• Features: {Object.values(config.features).filter(Boolean).length}</Text>
                            <Text>• Projects: {config.selectedPackages ? Object.keys(config.selectedPackages).length : 0}</Text>
                            <Text>• Total Packages: {config.selectedPackages ? 
                              Object.values(config.selectedPackages).reduce((sum, packages) => sum + packages.length, 0) : 0
                            }</Text>
                          </VStack>
                        </VStack>
                      </Box>
                    )}
                  </VStack>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;