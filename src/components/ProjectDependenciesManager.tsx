// src/components/ProjectDependenciesManager.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Icon,
  Flex,
  Divider,
  useToast,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Spinner,
  List,
  ListItem,
  ListIcon,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import {
  Package,
  Layers,
  Plus,
  Trash2,
  Search,
  Download,
  Shield,
  GitBranch,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
  Star,
} from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { getArchitectureInfo } from '../utils/architectureUtils';
import { nugetService } from '../services/NuGetService';
import { NuGetPackage } from '../types/nuget';
import { NuGetDependency } from '../types/project';
import { useDebounce } from '../hooks/useDebounce';

export const ProjectDependenciesManager: React.FC = () => {
  const { config, setConfig } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NuGetPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const debouncedSearch = useDebounce(searchQuery, 300);
  const architectureInfo = getArchitectureInfo(
    config.architecture, 
    config.name || 'MyProject',
    config.type,
    config.database
  );

  useEffect(() => {
    if (architectureInfo.projects.length > 0 && !selectedProject) {
      setSelectedProject(architectureInfo.projects[0].name);
    }
  }, [architectureInfo.projects, selectedProject]);

  useEffect(() => {
    const searchPackages = async () => {
      if (!debouncedSearch.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const result = await nugetService.searchPackages(debouncedSearch, {
          take: 10,
          prerelease: false
        });
        setSearchResults(result.packages);
      } catch (error) {
        toast({
          title: 'Error searching packages',
          description: 'Please try again later',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    searchPackages();
  }, [debouncedSearch, toast]);

  const addPackageToProject = (projectName: string, nugetPackage: NuGetPackage) => {
    const dependency: NuGetDependency = {
      id: nugetPackage.id,
      version: nugetPackage.version,
      description: nugetPackage.description,
      verified: nugetPackage.verified,
      addedAt: new Date().toISOString()
    };

    const currentPackages = config.selectedPackages || {};
    const projectPackages = currentPackages[projectName] || [];
    
    // Check if package already exists
    const existingPackage = projectPackages.find(p => p.id === dependency.id);
    if (existingPackage) {
      toast({
        title: 'Package already added',
        description: `${dependency.id} is already in ${projectName}`,
        status: 'warning',
        duration: 2000,
      });
      return;
    }

    const updatedPackages = {
      ...currentPackages,
      [projectName]: [...projectPackages, dependency]
    };

    setConfig({ selectedPackages: updatedPackages });
    setSearchQuery('');
    onClose();

    toast({
      title: 'Package added',
      description: `${dependency.id} added to ${projectName}`,
      status: 'success',
      duration: 2000,
    });
  };

  const removePackageFromProject = (projectName: string, packageId: string) => {
    const currentPackages = config.selectedPackages || {};
    const projectPackages = currentPackages[projectName] || [];
    
    const updatedProjectPackages = projectPackages.filter(p => p.id !== packageId);
    const updatedPackages = {
      ...currentPackages,
      [projectName]: updatedProjectPackages
    };

    setConfig({ selectedPackages: updatedPackages });

    toast({
      title: 'Package removed',
      description: `${packageId} removed from ${projectName}`,
      status: 'info',
      duration: 2000,
    });
  };

  const addRecommendedPackage = (projectName: string, packageName: string) => {
    setSearchQuery(packageName);
    setSelectedProject(projectName);
    onOpen();
  };

  const getLayerColor = (layer?: string) => {
    switch (layer) {
      case 'domain': return 'purple';
      case 'application': return 'blue';
      case 'infrastructure': return 'green';
      case 'presentation': return 'orange';
      case 'shared': return 'gray';
      default: return 'blue';
    }
  };

  const getLayerIcon = (layer?: string) => {
    switch (layer) {
      case 'domain': return Layers;
      case 'application': return GitBranch;
      case 'infrastructure': return Package;
      case 'presentation': return ChevronRight;
      case 'shared': return Star;
      default: return Package;
    }
  };

  const ProjectStructureCard: React.FC<{ project: any }> = ({ project }) => {
    const projectPackages = config.selectedPackages?.[project.name] || [];
    const recommendedPackages = architectureInfo.recommendedPackages?.[project.name] || [];
    const layerColor = getLayerColor(project.layer);
    const LayerIcon = getLayerIcon(project.layer);

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        bg="white"
        shadow="sm"
        borderLeftWidth="4px"
        borderLeftColor={`${layerColor}.400`}
        _hover={{ shadow: 'md' }}
        transition="all 0.2s"
      >
        <VStack align="stretch" spacing={3}>
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Icon as={LayerIcon} color={`${layerColor}.500`} />
              <Text fontWeight="bold" color={`${layerColor}.700`}>
                {project.name}
              </Text>
              {project.isCore && (
                <Badge colorScheme={layerColor} variant="subtle" size="sm">
                  Core
                </Badge>
              )}
            </HStack>
            <Badge colorScheme="gray" variant="outline" size="sm">
              {project.layer || 'general'}
            </Badge>
          </Flex>

          <Text fontSize="sm" color="gray.600">
            {project.description}
          </Text>

          {/* Folders */}
          <Box>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>
              FOLDERS ({project.folders.length})
            </Text>
            <Flex wrap="wrap" gap={1}>
              {project.folders.map((folder: string, index: number) => (
                <Badge key={index} variant="outline" size="sm" colorScheme="gray">
                  📁 {folder}
                </Badge>
              ))}
            </Flex>
          </Box>

          {/* Dependencies on other projects */}
          {project.dependencies && project.dependencies.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={1}>
                PROJECT DEPENDENCIES
              </Text>
              <VStack align="start" spacing={1}>
                {project.dependencies.map((dep: string, index: number) => (
                  <Badge key={index} colorScheme="purple" variant="outline" size="sm">
                    {dep}
                  </Badge>
                ))}
              </VStack>
            </Box>
          )}

          {/* NuGet Packages */}
          <Box>
            <Flex justify="space-between" align="center" mb={2}>
              <Text fontSize="xs" fontWeight="semibold" color="gray.500">
                NUGET PACKAGES ({projectPackages.length})
              </Text>
              <Button
                size="xs"
                colorScheme={layerColor}
                leftIcon={<Plus size={12} />}
                onClick={() => {
                  setSelectedProject(project.name);
                  onOpen();
                }}
              >
                Add Package
              </Button>
            </Flex>

            {projectPackages.length > 0 ? (
              <VStack align="stretch" spacing={1}>
                {projectPackages.map((pkg) => (
                  <Flex
                    key={pkg.id}
                    justify="space-between"
                    align="center"
                    p={2}
                    bg="gray.50"
                    borderRadius="md"
                    fontSize="sm"
                  >
                    <HStack spacing={2}>
                      <Icon as={Package} size={12} color={`${layerColor}.500`} />
                      <Text fontWeight="medium">{pkg.id}</Text>
                      <Badge size="xs" colorScheme="gray">
                        v{pkg.version}
                      </Badge>
                      {pkg.verified && (
                        <Icon as={Shield} size={12} color="green.500" />
                      )}
                    </HStack>
                    <IconButton
                      size="xs"
                      variant="ghost"
                      colorScheme="red"
                      icon={<Trash2 size={12} />}
                      aria-label="Remove package"
                      onClick={() => removePackageFromProject(project.name, pkg.id)}
                    />
                  </Flex>
                ))}
              </VStack>
            ) : (
              <Text fontSize="xs" color="gray.400" textAlign="center" py={2}>
                No packages added yet
              </Text>
            )}
          </Box>

          {/* Recommended Packages */}
          {recommendedPackages.length > 0 && (
            <Box>
              <Text fontSize="xs" fontWeight="semibold" color={`${layerColor}.600`} mb={1}>
                RECOMMENDED PACKAGES
              </Text>
              <Flex wrap="wrap" gap={1}>
                {recommendedPackages.map((pkgName, index) => (
                  <Button
                    key={index}
                    size="xs"
                    variant="outline"
                    colorScheme={layerColor}
                    leftIcon={<Plus size={10} />}
                    onClick={() => addRecommendedPackage(project.name, pkgName)}
                  >
                    {pkgName}
                  </Button>
                ))}
              </Flex>
            </Box>
          )}
        </VStack>
      </Box>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Project Dependencies</AlertTitle>
          <AlertDescription>
            Configure NuGet packages for each project in your {config.architecture} architecture.
            Click "Add Package" to search and install dependencies.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Project Structure Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={4}>
        {architectureInfo.projects.map((project, index) => (
          <ProjectStructureCard key={index} project={project} />
        ))}
      </SimpleGrid>

      {/* Package Search Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Add Package to {selectedProject}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={Search} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Search NuGet packages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </InputGroup>

              <Box maxH="400px" overflowY="auto">
                {loading ? (
                  <Flex justify="center" py={8}>
                    <Spinner color="blue.500" />
                  </Flex>
                ) : searchResults.length > 0 ? (
                  <VStack spacing={2} align="stretch">
                    {searchResults.map((pkg) => (
                      <Box
                        key={pkg.id}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        _hover={{ bg: 'gray.50' }}
                        cursor="pointer"
                        onClick={() => addPackageToProject(selectedProject, pkg)}
                      >
                        <Flex justify="space-between" align="start">
                          <VStack align="start" spacing={1} flex="1">
                            <HStack>
                              <Text fontWeight="medium">{pkg.id}</Text>
                              <Badge size="sm">v{pkg.version}</Badge>
                              {pkg.verified && (
                                <Icon as={Shield} size={14} color="green.500" />
                              )}
                            </HStack>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {pkg.description}
                            </Text>
                            <HStack fontSize="xs" color="gray.500">
                              <Icon as={Download} size={12} />
                              <Text>{pkg.totalDownloads.toLocaleString()} downloads</Text>
                            </HStack>
                          </VStack>
                          <Button size="sm" colorScheme="blue" leftIcon={<Plus size={14} />}>
                            Add
                          </Button>
                        </Flex>
                      </Box>
                    ))}
                  </VStack>
                ) : searchQuery ? (
                  <Text textAlign="center" color="gray.500" py={8}>
                    No packages found for "{searchQuery}"
                  </Text>
                ) : (
                  <Text textAlign="center" color="gray.500" py={8}>
                    Start typing to search for packages
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  );
};