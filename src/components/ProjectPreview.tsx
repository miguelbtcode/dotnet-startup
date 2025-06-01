// src/components/ProjectPreview.tsx
import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Flex,
  Button,
  IconButton,
  useColorModeValue,
  Tooltip,
  SimpleGrid,
  Circle,
  Container,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useProjectStore } from "../store/projectStore";
import { useArchitectures } from "../hooks/useArchitectures";
import { ArchitectureInfo } from "../types/project";
import {
  ChevronLeft,
  ChevronRight,
  Package,
  Layers,
  GitBranch,
  Star,
  ArrowRight,
  Zap,
  Target,
  Settings,
  Database,
  RefreshCw,
} from "lucide-react";

const slideIn = keyframes`
  from { 
    opacity: 0; 
    transform: translateX(50px) scale(0.95); 
  }
  to { 
    opacity: 1; 
    transform: translateX(0) scale(1); 
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

export const ProjectPreview: React.FC = () => {
  const { config } = useProjectStore();
  const { getArchitectureInfo, isApiAvailable, refetch } = useArchitectures();

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [architectureInfo, setArchitectureInfo] =
    useState<ArchitectureInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Cargar información de arquitectura cuando cambie la configuración
  useEffect(() => {
    const loadArchitectureInfo = async () => {
      if (!config.architecture) {
        console.log("❌ No architecture selected");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("🔄 Loading architecture info for:", config.architecture);
        const info = await getArchitectureInfo(config.architecture);
        console.log("✅ Architecture info loaded:", info);
        setArchitectureInfo(info);
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load architecture info";
        setError(errorMessage);
        console.error("❌ Error loading architecture info:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArchitectureInfo();
  }, [config.architecture, getArchitectureInfo]);

  // Reset project index when architecture changes or when index is out of bounds
  useEffect(() => {
    if (!architectureInfo?.projects) return;

    if (
      currentProjectIndex >= architectureInfo.projects.length ||
      currentProjectIndex < 0
    ) {
      setCurrentProjectIndex(0);
      setIsAutoPlaying(true);
    }
  }, [architectureInfo, currentProjectIndex]);

  // Force update when switching to default architecture
  useEffect(() => {
    if (config.architecture === "default") {
      setCurrentProjectIndex(0);
      setIsAutoPlaying(false);
    }
  }, [config.architecture]);

  // Auto-play carousel
  useEffect(() => {
    if (
      !isAutoPlaying ||
      !architectureInfo?.projects ||
      architectureInfo.projects.length <= 1
    )
      return;

    const interval = setInterval(() => {
      setCurrentProjectIndex(
        (prev) => (prev + 1) % architectureInfo.projects.length
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, architectureInfo]);

  const nextProject = () => {
    if (!architectureInfo?.projects) return;
    setCurrentProjectIndex(
      (prev) => (prev + 1) % architectureInfo.projects.length
    );
    setIsAutoPlaying(false);
  };

  const prevProject = () => {
    if (!architectureInfo?.projects) return;
    setCurrentProjectIndex(
      (prev) =>
        (prev - 1 + architectureInfo.projects.length) %
        architectureInfo.projects.length
    );
    setIsAutoPlaying(false);
  };

  const goToProject = (index: number) => {
    setCurrentProjectIndex(index);
    setIsAutoPlaying(false);
  };

  const getLayerInfo = (layer?: string) => {
    switch (layer) {
      case "domain":
        return {
          color: "purple",
          icon: Target,
          label: "Domain",
          gradient: "linear(to-r, purple.400, purple.600)",
          description: "Business Logic Core",
        };
      case "application":
        return {
          color: "blue",
          icon: GitBranch,
          label: "Application",
          gradient: "linear(to-r, blue.400, blue.600)",
          description: "Use Cases & Services",
        };
      case "infrastructure":
        return {
          color: "green",
          icon: Database,
          label: "Infrastructure",
          gradient: "linear(to-r, green.400, green.600)",
          description: "External Concerns",
        };
      case "presentation":
        return {
          color: "orange",
          icon: Zap,
          label: "Presentation",
          gradient: "linear(to-r, orange.400, orange.600)",
          description: "API & Controllers",
        };
      case "shared":
        return {
          color: "gray",
          icon: Star,
          label: "Shared",
          gradient: "linear(to-r, gray.400, gray.600)",
          description: "Common Components",
        };
      default:
        return {
          color: "blue",
          icon: Package,
          label: "General",
          gradient: "linear(to-r, blue.400, blue.600)",
          description: "Application Layer",
        };
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box
        bg={cardBg}
        rounded="2xl"
        shadow="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        p={8}
        minH="500px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg" fontWeight="medium" color="gray.500">
            Loading architecture preview...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box
        bg={cardBg}
        rounded="2xl"
        shadow="2xl"
        borderWidth="1px"
        borderColor={borderColor}
        overflow="hidden"
        minH="500px"
      >
        <Box p={8}>
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Box flex="1">
              <AlertDescription>
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">
                    Failed to load architecture preview
                  </Text>
                  <Text fontSize="sm">{error}</Text>
                  <Button
                    size="sm"
                    leftIcon={<RefreshCw size={16} />}
                    onClick={() => window.location.reload()}
                    colorScheme="red"
                    variant="outline"
                  >
                    Retry
                  </Button>
                </VStack>
              </AlertDescription>
            </Box>
          </Alert>
        </Box>
      </Box>
    );
  }

  // No architecture info or empty config
  if (!architectureInfo || architectureInfo.projects.length === 0) {
    console.log("❌ ProjectPreview - No data to show:", {
      hasArchitectureInfo: !!architectureInfo,
      configArchitecture: config.architecture,
      projectsCount: architectureInfo?.projects?.length || 0,
      architectureInfo,
    });

    return (
      <Box
        bg={cardBg}
        p={8}
        rounded="2xl"
        shadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <Icon as={Settings} boxSize={12} color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.500">
            {!config.architecture
              ? "Select an architecture to see the preview"
              : !isApiAvailable
              ? "API connection required to show architecture preview"
              : architectureInfo?.projects?.length === 0
              ? `No project structure defined for ${config.architecture} architecture`
              : "Loading architecture preview..."}
          </Text>
          {!isApiAvailable && (
            <Button
              size="sm"
              leftIcon={<RefreshCw size={16} />}
              onClick={refetch}
              colorScheme="blue"
              variant="outline"
            >
              Retry API Connection
            </Button>
          )}
          {/* Debug info */}
          <Box fontSize="xs" color="gray.400" textAlign="center">
            <Text>Architecture: {config.architecture || "None"}</Text>
            <Text>API: {isApiAvailable ? "✅" : "❌"}</Text>
            <Text>Projects: {architectureInfo?.projects?.length || 0}</Text>
            <Text>Loading: {loading ? "⏳" : "✅"}</Text>
          </Box>
        </VStack>
      </Box>
    );
  }

  const currentProject = architectureInfo.projects[currentProjectIndex];
  if (!currentProject) {
    return (
      <Box
        bg={cardBg}
        p={8}
        rounded="2xl"
        shadow="xl"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <Icon as={Package} boxSize={12} color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.500">
            No projects defined for this architecture
          </Text>
        </VStack>
      </Box>
    );
  }

  const layerInfo = getLayerInfo(currentProject.layer);

  return (
    <Box
      bg={cardBg}
      rounded="2xl"
      shadow="2xl"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
      position="relative"
      minH="500px"
    >
      {/* Animated Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="4px"
        bgGradient={layerInfo.gradient}
        opacity={0.8}
      />

      {/* Shimmer Effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        background={`linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`}
        backgroundSize="200px 100%"
        animation={`${shimmer} 3s infinite`}
        pointerEvents="none"
      />

      <VStack spacing={0} align="stretch">
        {/* Header */}
        <Box p={6} pb={4}>
          <VStack spacing={4} align="stretch">
            <Flex justify="space-between" align="center">
              <VStack align="start" spacing={1}>
                <HStack spacing={2}>
                  <Text
                    fontSize="2xl"
                    fontWeight="bold"
                    bgGradient="linear(to-r, blue.400, purple.500)"
                    bgClip="text"
                  >
                    Architecture Preview
                  </Text>
                  {!isApiAvailable && (
                    <Tooltip label="Using static data - API unavailable">
                      <Badge
                        colorScheme="orange"
                        variant="outline"
                        fontSize="xs"
                      >
                        Static
                      </Badge>
                    </Tooltip>
                  )}
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  {architectureInfo.description}
                </Text>
              </VStack>

              <Badge
                colorScheme="blue"
                px={3}
                py={1}
                borderRadius="full"
                fontSize="sm"
                animation={`${pulse} 2s infinite`}
              >
                {config.architecture.toUpperCase()}
              </Badge>
            </Flex>

            {/* Project Counter & Navigation */}
            <Flex justify="space-between" align="center">
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Project {currentProjectIndex + 1} of{" "}
                  {architectureInfo.projects.length}
                </Text>
                <Badge variant="outline" colorScheme={layerInfo.color}>
                  {layerInfo.label} Layer
                </Badge>
              </HStack>

              <HStack spacing={2}>
                <IconButton
                  icon={<ChevronLeft size={16} />}
                  aria-label="Previous project"
                  size="sm"
                  variant="ghost"
                  onClick={prevProject}
                  isDisabled={architectureInfo.projects.length <= 1}
                  borderRadius="full"
                />
                <IconButton
                  icon={<ChevronRight size={16} />}
                  aria-label="Next project"
                  size="sm"
                  variant="ghost"
                  onClick={nextProject}
                  isDisabled={architectureInfo.projects.length <= 1}
                  borderRadius="full"
                />
              </HStack>
            </Flex>
          </VStack>
        </Box>

        {/* Main Project Card */}
        <Box p={6} pt={2}>
          <Box
            key={currentProjectIndex}
            animation={`${slideIn} 0.5s ease-out`}
            bg="gray.50"
            rounded="xl"
            p={6}
            borderWidth="2px"
            borderColor={`${layerInfo.color}.200`}
            position="relative"
            overflow="hidden"
            _before={{
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "3px",
              bgGradient: layerInfo.gradient,
            }}
          >
            {/* Floating Icon */}
            <Circle
              size={12}
              bg={layerInfo.gradient}
              position="absolute"
              top={4}
              right={4}
              animation={`${float} 3s ease-in-out infinite`}
            >
              <Icon as={layerInfo.icon} color="white" boxSize={6} />
            </Circle>

            <VStack align="stretch" spacing={6}>
              {/* Project Header */}
              <VStack align="start" spacing={2}>
                <HStack spacing={3} align="center">
                  <Text
                    fontSize="xl"
                    fontWeight="bold"
                    color={`${layerInfo.color}.700`}
                  >
                    {currentProject.name}
                  </Text>
                  {currentProject.isCore && (
                    <Badge
                      colorScheme={layerInfo.color}
                      variant="solid"
                      borderRadius="full"
                      px={3}
                    >
                      CORE
                    </Badge>
                  )}
                </HStack>

                <Text fontSize="md" color="gray.600" lineHeight="1.6">
                  {currentProject.description}
                </Text>

                <Text
                  fontSize="sm"
                  color={`${layerInfo.color}.600`}
                  fontWeight="medium"
                >
                  {layerInfo.description}
                </Text>
              </VStack>

              {/* Folder Structure */}
              <Box>
                <HStack spacing={2} mb={3}>
                  <Icon as={Package} color={`${layerInfo.color}.500`} />
                  <Text fontWeight="semibold" color="gray.700">
                    Project Structure
                  </Text>
                </HStack>

                <SimpleGrid columns={2} spacing={2}>
                  {currentProject.folders.map((folder, index) => (
                    <Tooltip
                      key={index}
                      label={`${folder} directory`}
                      placement="top"
                    >
                      <Box
                        p={3}
                        bg="white"
                        rounded="lg"
                        borderWidth="1px"
                        borderColor="gray.200"
                        transition="all 0.2s"
                        _hover={{
                          transform: "translateY(-2px)",
                          shadow: "md",
                          borderColor: `${layerInfo.color}.300`,
                        }}
                        cursor="pointer"
                      >
                        <HStack spacing={2}>
                          <Text fontSize="lg">📁</Text>
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color="gray.700"
                          >
                            {folder}
                          </Text>
                        </HStack>
                      </Box>
                    </Tooltip>
                  ))}
                </SimpleGrid>
              </Box>

              {/* Dependencies */}
              {currentProject.dependencies &&
                currentProject.dependencies.length > 0 && (
                  <Box>
                    <HStack spacing={2} mb={3}>
                      <Icon as={ArrowRight} color={`${layerInfo.color}.500`} />
                      <Text fontWeight="semibold" color="gray.700">
                        Project Dependencies
                      </Text>
                    </HStack>

                    <VStack align="stretch" spacing={2}>
                      {currentProject.dependencies.map((dep, index) => (
                        <Box
                          key={index}
                          p={3}
                          bg="white"
                          rounded="lg"
                          borderWidth="1px"
                          borderColor="purple.200"
                          borderLeftWidth="4px"
                          borderLeftColor="purple.400"
                        >
                          <HStack spacing={2}>
                            <Icon as={GitBranch} color="purple.500" size={16} />
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="purple.700"
                            >
                              {dep}
                            </Text>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                )}
            </VStack>
          </Box>
        </Box>

        {/* Project Navigation Dots */}
        {architectureInfo.projects.length > 1 && (
          <Box p={6} pt={2}>
            <Flex justify="center" align="center">
              <HStack spacing={2}>
                {architectureInfo.projects.map((_, index) => {
                  const projectLayerInfo = getLayerInfo(
                    architectureInfo.projects[index].layer
                  );
                  return (
                    <Tooltip
                      key={index}
                      label={architectureInfo.projects[index].name}
                      placement="top"
                    >
                      <Circle
                        size={3}
                        bg={
                          index === currentProjectIndex
                            ? `${projectLayerInfo.color}.500`
                            : "gray.300"
                        }
                        cursor="pointer"
                        onClick={() => goToProject(index)}
                        transition="all 0.2s"
                        _hover={{
                          transform: "scale(1.2)",
                          bg: `${projectLayerInfo.color}.400`,
                        }}
                      />
                    </Tooltip>
                  );
                })}
              </HStack>
            </Flex>
          </Box>
        )}

        {/* Auto-play indicator */}
        {isAutoPlaying && architectureInfo.projects.length > 1 && (
          <Box position="absolute" bottom={2} right={2}>
            <Circle size={6} bg="blue.500" opacity={0.7}>
              <Box
                w={2}
                h={2}
                bg="white"
                rounded="full"
                animation={`${pulse} 1s infinite`}
              />
            </Circle>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
