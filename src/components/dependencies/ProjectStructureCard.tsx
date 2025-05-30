// src/components/dependencies/ProjectStructureCard.tsx
import React, { useEffect, useState } from "react";
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
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  Package,
  Layers,
  Plus,
  Trash2,
  GitBranch,
  ChevronRight,
  Star,
  Shield,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { ProjectStructure } from "../../types/project";
import { NuGetDependency } from "../../types/project";

interface ProjectStructureCardProps {
  project: ProjectStructure;
  packages: NuGetDependency[];
  hasRecommendations: boolean;
  onAddPackage: () => void;
  onOpenTemplate: () => void;
  onRemovePackage: (packageId: string) => void;
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
  switch (layer) {
    case "domain":
      return Layers;
    case "application":
      return GitBranch;
    case "infrastructure":
      return Package;
    case "presentation":
      return ChevronRight;
    case "shared":
      return Star;
    default:
      return Package;
  }
};

const pulseGreen = keyframes`
  0% { 
    background-color: rgba(72, 187, 120, 0.1);
    border-color: rgba(72, 187, 120, 0.3);
    transform: scale(1);
  }
  50% { 
    background-color: rgba(72, 187, 120, 0.2);
    border-color: rgba(72, 187, 120, 0.5);
    transform: scale(1.02);
  }
  100% { 
    background-color: rgba(72, 187, 120, 0.1);
    border-color: rgba(72, 187, 120, 0.3);
    transform: scale(1);
  }
`;

const slideInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

export const ProjectStructureCard: React.FC<ProjectStructureCardProps> = ({
  project,
  packages,
  hasRecommendations,
  onAddPackage,
  onOpenTemplate,
  onRemovePackage,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const layerColor = getLayerColor(project.layer);
  const LayerIcon = getLayerIcon(project.layer);

  // Track recently added packages for animation
  const [recentlyAdded, setRecentlyAdded] = useState<Set<string>>(new Set());
  const [previousPackageCount, setPreviousPackageCount] = useState(
    packages.length
  );
  const [cardPulse, setCardPulse] = useState(false);

  // Debug log every render
  console.log(`🔄 ProjectStructureCard render for ${project.name}:`, {
    packagesReceived: packages.length,
    packagesData: packages.map((p) => ({ id: p.id, version: p.version })),
    hasRecommendations,
    timestamp: new Date().toISOString(),
  });

  // Detect new packages and trigger animations
  useEffect(() => {
    if (packages.length > previousPackageCount) {
      // Find newly added packages
      const newPackageIds = packages
        .slice(previousPackageCount)
        .map((pkg) => pkg.id);

      setRecentlyAdded(new Set(newPackageIds));
      setCardPulse(true);

      // Clear animations after 3 seconds
      const timer = setTimeout(() => {
        setRecentlyAdded(new Set());
        setCardPulse(false);
      }, 3000);

      setPreviousPackageCount(packages.length);
      return () => clearTimeout(timer);
    } else {
      setPreviousPackageCount(packages.length);
    }
  }, [packages.length, previousPackageCount]);

  const isRecentlyAdded = (packageId: string) => recentlyAdded.has(packageId);

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={4}
      bg={bgColor}
      shadow="sm"
      borderLeftWidth="4px"
      borderLeftColor={`${layerColor}.400`}
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
      animation={cardPulse ? `${pulseGreen} 1s ease-in-out` : "none"}
      position="relative"
    >
      {/* Success indicator when packages are added */}
      {cardPulse && (
        <Box
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          animation={`${slideInUp} 0.5s ease-out`}
        >
          <Badge
            colorScheme="green"
            variant="solid"
            borderRadius="full"
            px={2}
            py={1}
            fontSize="xs"
          >
            <HStack spacing={1}>
              <Icon as={CheckCircle} size={10} />
              <Text>Updated!</Text>
            </HStack>
          </Badge>
        </Box>
      )}

      <VStack align="stretch" spacing={4}>
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
          <Badge
            colorScheme={packages.length > 0 ? layerColor : "gray"}
            variant="outline"
            size="sm"
          >
            {packages.length} packages
          </Badge>
        </Flex>

        <Text fontSize="sm" color="gray.600">
          {project.description}
        </Text>

        {/* Action Buttons */}
        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme={layerColor}
            leftIcon={<Plus size={14} />}
            onClick={onAddPackage}
            flex="1"
          >
            Add Package
          </Button>

          {hasRecommendations && (
            <Tooltip label="Apply recommended template">
              <IconButton
                size="sm"
                colorScheme="purple"
                variant="outline"
                icon={<Sparkles size={14} />}
                aria-label="Apply template"
                onClick={onOpenTemplate}
              />
            </Tooltip>
          )}
        </HStack>

        {/* Installed Packages */}
        {packages.length > 0 ? (
          <Box>
            <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2}>
              INSTALLED PACKAGES ({packages.length})
            </Text>
            <VStack align="stretch" spacing={1} maxH="200px" overflowY="auto">
              {packages.map((pkg) => {
                const isNew = isRecentlyAdded(pkg.id);

                return (
                  <Box
                    key={`${pkg.id}-${pkg.addedAt || "default"}`}
                    animation={isNew ? `${slideInUp} 0.5s ease-out` : "none"}
                  >
                    <Flex
                      justify="space-between"
                      align="center"
                      p={3}
                      bg={isNew ? "green.50" : "white"}
                      borderRadius="md"
                      fontSize="sm"
                      borderWidth="1px"
                      borderColor={isNew ? "green.300" : "gray.200"}
                      _hover={{
                        borderColor: `${layerColor}.300`,
                        shadow: "sm",
                      }}
                      transition="all 0.2s"
                      position="relative"
                    >
                      {/* New package indicator */}
                      {isNew && (
                        <Box
                          position="absolute"
                          top="-2px"
                          right="-2px"
                          zIndex={1}
                        >
                          <Circle size={4} bg="green.500">
                            <Icon as={CheckCircle} size={8} color="white" />
                          </Circle>
                        </Box>
                      )}

                      <HStack spacing={2} flex="1" minW="0">
                        <Icon
                          as={Package}
                          size={12}
                          color={`${layerColor}.500`}
                        />
                        <VStack align="start" spacing={0} flex="1" minW="0">
                          <Text fontWeight="medium" isTruncated fontSize="sm">
                            {pkg.id}
                          </Text>
                          {pkg.description && (
                            <Text fontSize="xs" color="gray.500" isTruncated>
                              {pkg.description}
                            </Text>
                          )}
                        </VStack>
                        <Badge
                          size="xs"
                          colorScheme={isNew ? "green" : "gray"}
                          flexShrink={0}
                          variant={isNew ? "solid" : "outline"}
                        >
                          v{pkg.version}
                        </Badge>
                        {pkg.verified && (
                          <Icon
                            as={Shield}
                            size={12}
                            color="green.500"
                            flexShrink={0}
                          />
                        )}
                      </HStack>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        colorScheme="red"
                        icon={<Trash2 size={12} />}
                        aria-label="Remove package"
                        onClick={() => onRemovePackage(pkg.id)}
                        flexShrink={0}
                      />
                    </Flex>
                  </Box>
                );
              })}
            </VStack>
          </Box>
        ) : (
          <Box
            p={4}
            border="2px dashed"
            borderColor="gray.300"
            borderRadius="md"
            textAlign="center"
          >
            <VStack spacing={2}>
              <Icon as={Package} size={16} color="gray.400" />
              <Text fontSize="sm" color="gray.500">
                No packages installed
              </Text>
              <Text fontSize="xs" color="gray.400">
                Click "Add Package" or use templates
              </Text>
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
