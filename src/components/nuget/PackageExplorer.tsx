import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  Text,
  Spinner,
  Select,
  HStack,
  Icon,
  useToast,
  Button,
  Badge,
  Flex,
  Avatar,
  Wrap,
  WrapItem,
  ButtonGroup,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import {
  Search,
  Package,
  Download,
  Shield,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plus,
  Tag,
} from "lucide-react";
import { nugetService } from "../../services/NuGetService";
import { NuGetPackage } from "../../types/nuget";
import { useDebounce } from "../../hooks/useDebounce";

interface PackageExplorerProps {
  projectType: string;
  onPackagesChange: (packages: NuGetPackage[]) => void;
}

export const PackageExplorer: React.FC<PackageExplorerProps> = ({
  projectType,
  onPackagesChange,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<NuGetPackage[]>([]);
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHits, setTotalHits] = useState(0);
  const toast = useToast();

  const debouncedSearch = useDebounce(searchQuery, 300);
  const packagesPerPage = 5;

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when search changes
  }, [debouncedSearch]);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!debouncedSearch) {
        setPackages([]);
        setTotalHits(0);
        return;
      }

      setLoading(true);
      try {
        const skip = (currentPage - 1) * packagesPerPage;
        const result = await nugetService.searchPackages(debouncedSearch, {
          // Removido packageType ya que 'webapi' no es válido
          prerelease: false,
          skip,
          take: packagesPerPage,
        });
        setPackages(result.packages);
        setTotalHits(result.totalHits);
      } catch (error) {
        toast({
          title: "Error fetching packages",
          description: "Please try again later",
          status: "error",
          duration: 3000,
        });
        setPackages([]);
        setTotalHits(0);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [debouncedSearch, currentPage, toast]);

  const handlePackageSelect = async (pkg: NuGetPackage) => {
    try {
      const metadata = await nugetService.getPackageMetadata(
        pkg.id,
        pkg.version
      );
      const vulnerabilities = await nugetService.checkVulnerabilities(
        pkg.id,
        pkg.version
      );

      onPackagesChange([...packages, { ...pkg, metadata, vulnerabilities }]);

      toast({
        title: "Package added",
        description: `${pkg.id} has been added to your project`,
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error adding package",
        description: "Failed to add the package. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const totalPages = Math.ceil(totalHits / packagesPerPage);
  const startItem = (currentPage - 1) * packagesPerPage + 1;
  const endItem = Math.min(currentPage * packagesPerPage, totalHits);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const PackageRow: React.FC<{ package: NuGetPackage }> = ({
    package: pkg,
  }) => (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      borderColor="gray.200"
      bg="white"
      shadow="sm"
      _hover={{
        shadow: "md",
        borderColor: "blue.300",
        transform: "translateY(-1px)",
      }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="flex-start" gap={4}>
        {/* Left section - Package info */}
        <Flex flex="1" gap={3} align="flex-start" minW="0">
          <Box
            w="40px"
            h="40px"
            borderRadius="md"
            bg="blue.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            flexShrink={0}
          >
            {pkg.iconUrl ? (
              <img
                src={pkg.iconUrl}
                alt={pkg.id}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Icon as={Package} color="white" boxSize={4} />
            )}
          </Box>

          <VStack align="flex-start" spacing={2} flex="1" minW="0">
            <Flex align="center" gap={2} wrap="wrap">
              <Text
                fontWeight="bold"
                color="blue.600"
                fontSize="lg"
                isTruncated
                maxW="300px"
              >
                {pkg.id}
              </Text>
              <Badge colorScheme="gray" fontSize="xs">
                v{pkg.version}
              </Badge>
              {pkg.verified && (
                <Tooltip label="Verified package">
                  <Badge colorScheme="green" fontSize="xs">
                    <Icon as={Shield} boxSize={2} mr={1} />
                    Verified
                  </Badge>
                </Tooltip>
              )}
            </Flex>

            <Text color="gray.600" fontSize="sm" noOfLines={2} lineHeight="1.4">
              {pkg.description || "No description available"}
            </Text>

            <Flex gap={4} align="center" wrap="wrap">
              <Flex align="center" gap={1}>
                <Icon as={Download} boxSize={3} color="gray.500" />
                <Text fontSize="xs" color="gray.500">
                  {formatNumber(pkg.totalDownloads)} downloads
                </Text>
              </Flex>

              {pkg.authors && pkg.authors.length > 0 && (
                <Text fontSize="xs" color="gray.500">
                  by{" "}
                  {Array.isArray(pkg.authors)
                    ? pkg.authors.join(", ")
                    : pkg.authors}
                </Text>
              )}
            </Flex>

            {pkg.tags && pkg.tags.length > 0 && (
              <Wrap spacing={1} maxW="100%">
                {pkg.tags.slice(0, 5).map((tag, index) => (
                  <WrapItem key={index}>
                    <Badge
                      size="sm"
                      colorScheme="purple"
                      variant="subtle"
                      fontSize="xs"
                    >
                      <Icon as={Tag} boxSize={2} mr={1} />
                      {tag}
                    </Badge>
                  </WrapItem>
                ))}
                {pkg.tags.length > 5 && (
                  <WrapItem>
                    <Badge
                      size="sm"
                      colorScheme="gray"
                      variant="subtle"
                      fontSize="xs"
                    >
                      +{pkg.tags.length - 5} more
                    </Badge>
                  </WrapItem>
                )}
              </Wrap>
            )}
          </VStack>
        </Flex>

        {/* Right section - Actions */}
        <VStack spacing={2} align="flex-end">
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<Plus size={14} />}
            onClick={() => handlePackageSelect(pkg)}
            minW="100px"
          >
            Install
          </Button>

          <HStack spacing={1}>
            {pkg.projectUrl && (
              <Tooltip label="Project URL">
                <IconButton
                  size="xs"
                  variant="ghost"
                  icon={<ExternalLink size={12} />}
                  aria-label="Project URL"
                  as="a"
                  href={pkg.projectUrl}
                  target="_blank"
                />
              </Tooltip>
            )}
          </HStack>
        </VStack>
      </Flex>
    </Box>
  );

  return (
    <VStack spacing={6} align="stretch">
      {/* Search and Filter Header */}
      <VStack spacing={4} align="stretch">
        <HStack spacing={4}>
          <InputGroup flex="1">
            <InputLeftElement pointerEvents="none">
              <Icon as={Search} color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search NuGet packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              bg="white"
              borderColor="gray.300"
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px blue.500",
              }}
            />
          </InputGroup>
          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            w="200px"
            bg="white"
            borderColor="gray.300"
          >
            <option value="all">All Packages</option>
            <option value="popular">Most Popular</option>
            <option value="recent">Recently Updated</option>
          </Select>
        </HStack>

        {/* Results count */}
        {totalHits > 0 && !loading && (
          <Flex justify="space-between" align="center" px={2}>
            <Text fontSize="sm" color="gray.600">
              Showing {startItem}-{endItem} of {totalHits.toLocaleString()}{" "}
              packages
            </Text>
          </Flex>
        )}
      </VStack>

      {/* Content Area */}
      <Box minH="600px">
        {loading ? (
          <Flex justify="center" align="center" py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text color="gray.500">Searching packages...</Text>
            </VStack>
          </Flex>
        ) : packages.length > 0 ? (
          <VStack spacing={3} align="stretch">
            {packages.map((pkg) => (
              <PackageRow key={`${pkg.id}-${pkg.version}`} package={pkg} />
            ))}
          </VStack>
        ) : (
          <Flex justify="center" align="center" py={20}>
            <VStack spacing={4}>
              <Icon as={Package} boxSize={12} color="gray.400" />
              <Text color="gray.500" textAlign="center">
                {searchQuery
                  ? "No packages found. Try a different search term."
                  : "Start typing to search for packages"}
              </Text>
            </VStack>
          </Flex>
        )}
      </Box>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Flex justify="center" align="center" pt={4}>
          <ButtonGroup spacing={2}>
            <IconButton
              icon={<ChevronLeft size={16} />}
              aria-label="Previous page"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              isDisabled={currentPage === 1}
              size="sm"
            />

            <HStack spacing={1}>
              {/* Show page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    size="sm"
                    variant={currentPage === pageNum ? "solid" : "outline"}
                    colorScheme={currentPage === pageNum ? "blue" : "gray"}
                    onClick={() => setCurrentPage(pageNum)}
                    minW="40px"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </HStack>

            <IconButton
              icon={<ChevronRight size={16} />}
              aria-label="Next page"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              isDisabled={currentPage === totalPages}
              size="sm"
            />
          </ButtonGroup>
        </Flex>
      )}
    </VStack>
  );
};
