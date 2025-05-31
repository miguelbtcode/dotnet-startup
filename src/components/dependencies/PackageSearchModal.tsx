import React, { useState, useEffect } from "react";
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
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  Flex,
  Box,
  Spinner,
  useToast,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Avatar,
  Tooltip,
  IconButton,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Progress,
  useColorModeValue,
  ButtonGroup,
} from "@chakra-ui/react";
import {
  Search,
  Download,
  Shield,
  Plus,
  Package,
  ExternalLink,
  Filter,
  SortAsc,
  Users,
  Code, // Para código/librerías
  Database, // Para ORM
  Activity, // Para logging
  Repeat, // Para mapping/transformación
  CheckCircle, // Para validación
  Radio, // Para CQRS/comunicación
  RotateCcw, // Para resilience
  FileText, // Para archivos/docs
} from "lucide-react";
import { nugetService } from "../../services/NuGetService";
import { NuGetPackage } from "../../types/nuget";
import { useDebounce } from "../../hooks/useDebounce";
import { PackageVersionSelector } from "./PackageVersionSelector";

interface PackageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: string;
  onAddPackage: (projectName: string, nugetPackage: NuGetPackage) => void;
  dotnetVersion?: string;
}

type SortOption = "relevance" | "downloads" | "recent" | "name";
type FilterOption = "all" | "popular" | "recent" | "verified";

interface ExtendedNuGetPackage extends NuGetPackage {
  selectedVersion?: string;
  isLoading?: boolean;
}

export const PackageSearchModal: React.FC<PackageSearchModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  onAddPackage,
  dotnetVersion = "8.0",
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ExtendedNuGetPackage[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [filterBy, setFilterBy] = useState<FilterOption>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [packageVersions, setPackageVersions] = useState<{
    [packageId: string]: string;
  }>({});

  const toast = useToast();
  const debouncedSearch = useDebounce(searchQuery, 400);
  const resultsPerPage = 8;

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (debouncedSearch.trim()) {
      setCurrentPage(1);
      searchPackages();
    } else {
      setSearchResults([]);
      setTotalResults(0);
    }
  }, [debouncedSearch, sortBy, filterBy]);

  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchPackages();
    }
  }, [currentPage]);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSearchResults([]);
      setCurrentPage(1);
      setTotalResults(0);
      setSortBy("relevance");
      setFilterBy("all");
      setPackageVersions({});
    }
  }, [isOpen]);

  const searchPackages = async () => {
    if (!debouncedSearch.trim()) return;

    setLoading(true);
    try {
      const skip = (currentPage - 1) * resultsPerPage;

      // Apply sorting and filtering logic
      let searchOptions: any = {
        take: resultsPerPage,
        skip,
        prerelease: false,
      };

      // Apply filters
      if (filterBy === "verified") {
        // Note: NuGet API doesn't have direct verified filter, we'll filter after
      }

      const result = await nugetService.searchPackages(
        debouncedSearch,
        searchOptions
      );

      let packages = result.packages.map((pkg) => ({
        ...pkg,
        selectedVersion: pkg.version,
        isLoading: false,
      }));

      // Client-side filtering for verified packages
      if (filterBy === "verified") {
        packages = packages.filter((pkg) => pkg.verified);
      } else if (filterBy === "popular") {
        packages = packages.filter((pkg) => pkg.totalDownloads > 100000);
      }

      // Client-side sorting
      packages = sortPackages(packages, sortBy);

      setSearchResults(packages);
      setTotalResults(result.totalHits);

      // Initialize version selections
      const initialVersions: { [key: string]: string } = {};
      packages.forEach((pkg) => {
        initialVersions[pkg.id] = pkg.version;
      });
      setPackageVersions((prev) => ({ ...prev, ...initialVersions }));
    } catch (error) {
      console.error("Search error:", error);
      toast({
        title: "Search Failed",
        description: "Unable to search packages. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const sortPackages = (
    packages: ExtendedNuGetPackage[],
    sortOption: SortOption
  ) => {
    return [...packages].sort((a, b) => {
      switch (sortOption) {
        case "downloads":
          return b.totalDownloads - a.totalDownloads;
        case "recent":
          // Since we don't have published date in search results, use downloads as proxy
          return b.totalDownloads - a.totalDownloads;
        case "name":
          return a.id.localeCompare(b.id);
        case "relevance":
        default:
          return 0; // Keep original order from API
      }
    });
  };

  const handleVersionChange = (packageId: string, version: string) => {
    setPackageVersions((prev) => ({
      ...prev,
      [packageId]: version,
    }));
  };

  const handleAddPackage = async (pkg: ExtendedNuGetPackage) => {
    const selectedVersion = packageVersions[pkg.id] || pkg.version;

    // Create package with selected version
    const packageToAdd: NuGetPackage = {
      ...pkg,
      version: selectedVersion,
    };

    try {
      await onAddPackage(selectedProject, packageToAdd);

      toast({
        title: "Package Added Successfully",
        description: `${pkg.id} v${selectedVersion} has been added to ${selectedProject}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Don't close modal, allow user to add more packages
    } catch (error) {
      toast({
        title: "Failed to Add Package",
        description: "An error occurred while adding the package",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatDownloads = (downloads: number): string => {
    if (downloads >= 1000000) {
      return `${(downloads / 1000000).toFixed(1)}M`;
    } else if (downloads >= 1000) {
      return `${(downloads / 1000).toFixed(1)}K`;
    }
    return downloads.toLocaleString();
  };

  const getPopularityLevel = (
    downloads: number
  ): { level: string; color: string } => {
    if (downloads >= 10000000) return { level: "Very Popular", color: "green" };
    if (downloads >= 1000000) return { level: "Popular", color: "blue" };
    if (downloads >= 100000) return { level: "Growing", color: "orange" };
    return { level: "New", color: "gray" };
  };

  const totalPages = Math.ceil(totalResults / resultsPerPage);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
      <ModalContent maxH="90vh" bg={bgColor} borderRadius="2xl" shadow="2xl">
        <ModalHeader pb={4} pt={6} px={8} position="relative">
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" align="center" pr={8}>
              <HStack spacing={4}>
                <Box
                  p={3}
                  bg="blue.50"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="blue.200"
                >
                  <Icon as={Package} color="blue.500" boxSize={6} />
                </Box>
                <VStack align="start" spacing={1}>
                  <Text fontSize="xl" fontWeight="bold" color="gray.800">
                    Add Package to {selectedProject}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    Search and install NuGet packages with version selection
                  </Text>
                </VStack>
              </HStack>
              <Badge
                colorScheme="blue"
                variant="solid"
                fontSize="sm"
                px={4}
                py={2}
                borderRadius="full"
                fontWeight="bold"
              >
                .NET {dotnetVersion}
              </Badge>
            </HStack>
          </VStack>
          <ModalCloseButton
            top={4}
            right={4}
            size="lg"
            borderRadius="full"
            bg="gray.100"
            _hover={{ bg: "gray.200" }}
            _focus={{ boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
          />
        </ModalHeader>

        <ModalBody pb={8} px={8} overflowY="auto">
          <VStack spacing={6} align="stretch">
            {/* Search and Filters */}
            <VStack spacing={4} align="stretch">
              {/* Search Input */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" h="12">
                  <Icon as={Search} color="gray.400" size={20} />
                </InputLeftElement>
                <Input
                  placeholder="Search packages... (e.g., EntityFramework, Serilog, AutoMapper)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  bg={bgColor}
                  borderColor={borderColor}
                  borderRadius="xl"
                  h="12"
                  fontSize="md"
                  pl="12"
                  _focus={{
                    borderColor: "blue.500",
                    boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.1)",
                  }}
                  _placeholder={{ color: "gray.400" }}
                />
              </InputGroup>

              {/* Filters and Sort */}
              <HStack
                spacing={6}
                wrap="wrap"
                bg="gray.50"
                p={4}
                borderRadius="xl"
              >
                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Icon as={Filter} size={16} color="gray.500" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                    Filter:
                  </Text>
                  <Select
                    value={filterBy}
                    onChange={(e) =>
                      setFilterBy(e.target.value as FilterOption)
                    }
                    size="sm"
                    w="160px"
                    variant="outline"
                    bg="white"
                    borderRadius="lg"
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                  >
                    <option value="all">All Packages</option>
                    <option value="popular">Popular (100K+)</option>
                    <option value="recent">Recently Updated</option>
                    <option value="verified">Verified Only</option>
                  </Select>
                </HStack>

                <HStack spacing={3}>
                  <Box
                    p={2}
                    bg="white"
                    borderRadius="lg"
                    border="1px solid"
                    borderColor="gray.200"
                  >
                    <Icon as={SortAsc} size={16} color="gray.500" />
                  </Box>
                  <Text fontSize="sm" color="gray.600" fontWeight="semibold">
                    Sort by:
                  </Text>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortOption)}
                    size="sm"
                    w="140px"
                    variant="outline"
                    bg="white"
                    borderRadius="lg"
                    _focus={{
                      borderColor: "blue.500",
                      boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)",
                    }}
                  >
                    <option value="relevance">Relevance</option>
                    <option value="downloads">Downloads</option>
                    <option value="recent">Recent</option>
                    <option value="name">Name</option>
                  </Select>
                </HStack>

                {totalResults > 0 && (
                  <Box
                    ml="auto"
                    px={4}
                    py={2}
                    bg="blue.50"
                    borderRadius="full"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <Text fontSize="sm" color="blue.700" fontWeight="medium">
                      {totalResults.toLocaleString()} packages found
                    </Text>
                  </Box>
                )}
              </HStack>
            </VStack>

            <Divider />

            <Box
              bg="white"
              borderRadius="2xl"
              shadow="sm"
              border="1px solid"
              borderColor="gray.200"
              overflow="hidden"
            >
              {loading ? (
                <VStack spacing={6} py={16}>
                  <Box position="relative">
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="8"
                      h="8"
                      bg="blue.500"
                      borderRadius="full"
                      opacity="0.2"
                      animation="ping 1s cubic-bezier(0, 0, 0.2, 1) infinite"
                    />
                  </Box>
                  <VStack spacing={2}>
                    <Text color="gray.700" fontWeight="medium" fontSize="lg">
                      Searching packages...
                    </Text>
                    <Text color="gray.500" fontSize="sm">
                      Finding the best matches for your query
                    </Text>
                  </VStack>
                  <Progress
                    size="sm"
                    isIndeterminate
                    w="240px"
                    colorScheme="blue"
                    borderRadius="full"
                  />
                </VStack>
              ) : searchResults.length > 0 ? (
                <VStack spacing={0} align="stretch">
                  {/* Results Table */}
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead bg="gray.50">
                        <Tr>
                          <Th
                            width="35%"
                            color="gray.700"
                            fontWeight="semibold"
                            fontSize="sm"
                            py={4}
                            borderColor="gray.200"
                          >
                            Package Information
                          </Th>
                          <Th
                            width="12%"
                            color="gray.700"
                            fontWeight="semibold"
                            fontSize="sm"
                            py={4}
                            borderColor="gray.200"
                          >
                            Version
                          </Th>
                          <Th
                            width="12%"
                            color="gray.700"
                            fontWeight="semibold"
                            fontSize="sm"
                            py={4}
                            borderColor="gray.200"
                          >
                            Downloads
                          </Th>
                          <Th
                            width="15%"
                            color="gray.700"
                            fontWeight="semibold"
                            fontSize="sm"
                            py={2}
                            borderColor="gray.200"
                            textAlign="center"
                          >
                            Status
                          </Th>
                          <Th
                            width="10%"
                            color="gray.700"
                            fontWeight="semibold"
                            fontSize="sm"
                            py={4}
                            borderColor="gray.200"
                            textAlign="center"
                          >
                            Action
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {searchResults.map((pkg, index) => {
                          const popularity = getPopularityLevel(
                            pkg.totalDownloads
                          );

                          return (
                            <Tr
                              key={pkg.id}
                              _hover={{ bg: "blue.25" }}
                              transition="all 0.2s"
                              borderBottom={
                                index === searchResults.length - 1
                                  ? "none"
                                  : "1px solid"
                              }
                              borderColor="gray.100"
                            >
                              {/* Package Info */}
                              <Td py={4}>
                                <HStack spacing={4} align="start">
                                  <Box
                                    w="12"
                                    h="12"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    border="2px solid"
                                    borderColor="gray.200"
                                    bg="white"
                                    flexShrink={0}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
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
                                      <Text
                                        fontSize="lg"
                                        fontWeight="bold"
                                        color="blue.500"
                                      >
                                        {pkg.id.charAt(0).toUpperCase()}
                                      </Text>
                                    )}
                                  </Box>
                                  <VStack
                                    align="start"
                                    spacing={2}
                                    flex="1"
                                    minW="0"
                                  >
                                    <HStack spacing={2} wrap="wrap">
                                      <Text
                                        fontWeight="bold"
                                        color="gray.800"
                                        fontSize="md"
                                        isTruncated
                                        maxW="280px"
                                      >
                                        {pkg.id}
                                      </Text>
                                      {pkg.verified && (
                                        <Tooltip label="Verified Package by Microsoft">
                                          <Badge
                                            colorScheme="green"
                                            variant="solid"
                                            fontSize="xs"
                                            px={2}
                                            py={1}
                                            borderRadius="md"
                                          >
                                            <HStack spacing={1}>
                                              <Icon as={Shield} size={10} />
                                              <Text>Verified</Text>
                                            </HStack>
                                          </Badge>
                                        </Tooltip>
                                      )}
                                    </HStack>
                                    <Tooltip
                                      label={
                                        <VStack
                                          align="start"
                                          spacing={2}
                                          maxW="400px"
                                        >
                                          <Text fontWeight="bold" color="white">
                                            {pkg.id}
                                          </Text>
                                          <Text fontSize="sm" color="gray.200">
                                            {pkg.description ||
                                              "No description available"}
                                          </Text>
                                          {pkg.authors &&
                                            pkg.authors.length > 0 && (
                                              <Text
                                                fontSize="xs"
                                                color="gray.300"
                                              >
                                                Authors:{" "}
                                                {Array.isArray(pkg.authors)
                                                  ? pkg.authors.join(", ")
                                                  : pkg.authors}
                                              </Text>
                                            )}
                                          {pkg.tags && pkg.tags.length > 0 && (
                                            <HStack spacing={1} wrap="wrap">
                                              <Text
                                                fontSize="xs"
                                                color="gray.300"
                                              >
                                                Tags:
                                              </Text>
                                              {pkg.tags
                                                .slice(0, 5)
                                                .map((tag, idx) => (
                                                  <Text
                                                    key={idx}
                                                    fontSize="xs"
                                                    color="blue.200"
                                                  >
                                                    {tag}
                                                    {idx <
                                                    Math.min(
                                                      4,
                                                      pkg.tags.length - 1
                                                    )
                                                      ? ","
                                                      : ""}
                                                  </Text>
                                                ))}
                                              {pkg.tags.length > 5 && (
                                                <Text
                                                  fontSize="xs"
                                                  color="gray.300"
                                                >
                                                  +{pkg.tags.length - 5} more
                                                </Text>
                                              )}
                                            </HStack>
                                          )}
                                        </VStack>
                                      }
                                      placement="top"
                                      hasArrow
                                      bg="gray.800"
                                      color="white"
                                      borderRadius="lg"
                                      p={3}
                                      maxW="450px"
                                      openDelay={500}
                                      closeDelay={200}
                                    >
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        lineHeight="1.4"
                                        maxW="300px" // Ancho máximo de 300px
                                        display="-webkit-box"
                                        style={{
                                          WebkitLineClamp: 2, // Máximo 2 líneas
                                          WebkitBoxOrient: "vertical",
                                          overflow: "hidden",
                                        }}
                                        cursor="help" // AGREGAR: Cursor que indica más info
                                        _hover={{
                                          // AGREGAR: Efecto hover
                                          color: "gray.800",
                                        }}
                                      >
                                        {pkg.description ||
                                          "No description available"}
                                      </Text>
                                    </Tooltip>
                                    {pkg.authors && pkg.authors.length > 0 && (
                                      <HStack spacing={1}>
                                        <Icon
                                          as={Users}
                                          size={12}
                                          color="gray.400"
                                        />
                                        <Text fontSize="xs" color="gray.500">
                                          by{" "}
                                          {Array.isArray(pkg.authors)
                                            ? pkg.authors.slice(0, 2).join(", ")
                                            : pkg.authors}
                                          {Array.isArray(pkg.authors) &&
                                            pkg.authors.length > 2 &&
                                            ` +${pkg.authors.length - 2} more`}
                                        </Text>
                                      </HStack>
                                    )}
                                  </VStack>
                                </HStack>
                              </Td>

                              {/* Version Selector */}
                              <Td py={4}>
                                <Box w="full">
                                  <PackageVersionSelector
                                    packageId={pkg.id}
                                    defaultVersion={pkg.version}
                                    dotnetVersion={dotnetVersion}
                                    onVersionChange={(version) =>
                                      handleVersionChange(pkg.id, version)
                                    }
                                    size="sm"
                                  />
                                </Box>
                              </Td>

                              {/* Downloads */}
                              <Td py={4}>
                                <HStack spacing={2} justify="start">
                                  <Icon
                                    as={Download}
                                    size={16}
                                    color="gray.500"
                                  />
                                  <Text
                                    fontWeight="bold"
                                    fontSize="md"
                                    color="gray.700"
                                  >
                                    {formatDownloads(pkg.totalDownloads)}
                                  </Text>
                                </HStack>
                              </Td>

                              {/* Status Column - Solo status y link de repo */}
                              <Td py={4} textAlign="center">
                                <VStack align="center" spacing={2}>
                                  <Badge
                                    colorScheme={popularity.color}
                                    variant="subtle"
                                    size="sm"
                                    px={3}
                                    py={1}
                                    borderRadius="full"
                                    fontWeight="medium"
                                  >
                                    {popularity.level}
                                  </Badge>

                                  {pkg.projectUrl && (
                                    <Tooltip label="View Project Repository">
                                      <IconButton
                                        size="sm"
                                        variant="ghost"
                                        icon={<ExternalLink size={14} />}
                                        aria-label="View project"
                                        as="a"
                                        href={pkg.projectUrl}
                                        target="_blank"
                                        color="gray.500"
                                        borderRadius="lg"
                                        _hover={{
                                          color: "blue.500",
                                          bg: "blue.50",
                                        }}
                                      />
                                    </Tooltip>
                                  )}
                                </VStack>
                              </Td>

                              {/* Action */}
                              <Td py={4} textAlign="center">
                                <Button
                                  size="md"
                                  colorScheme="blue"
                                  leftIcon={<Plus size={16} />}
                                  onClick={() => handleAddPackage(pkg)}
                                  isLoading={pkg.isLoading}
                                  loadingText="Adding..."
                                  borderRadius="xl"
                                  px={6}
                                  fontWeight="semibold"
                                  _hover={{
                                    transform: "translateY(-1px)",
                                    shadow: "md",
                                  }}
                                  transition="all 0.2s"
                                >
                                  Add
                                </Button>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </TableContainer>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Box
                      p={6}
                      bg="gray.50"
                      borderTop="1px solid"
                      borderColor="gray.200"
                    >
                      <Flex justify="center" align="center">
                        <ButtonGroup spacing={2}>
                          <Button
                            size="md"
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            isDisabled={currentPage === 1}
                            variant="outline"
                            borderRadius="lg"
                            _hover={{
                              bg: "blue.50",
                              borderColor: "blue.300",
                            }}
                          >
                            Previous
                          </Button>

                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
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
                                  size="md"
                                  variant={
                                    currentPage === pageNum
                                      ? "solid"
                                      : "outline"
                                  }
                                  colorScheme={
                                    currentPage === pageNum ? "blue" : "gray"
                                  }
                                  onClick={() => setCurrentPage(pageNum)}
                                  minW="48px"
                                  borderRadius="lg"
                                  fontWeight={
                                    currentPage === pageNum ? "bold" : "medium"
                                  }
                                  _hover={
                                    currentPage !== pageNum
                                      ? {
                                          bg: "blue.50",
                                          borderColor: "blue.300",
                                        }
                                      : {}
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}

                          <Button
                            size="md"
                            onClick={() =>
                              setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            isDisabled={currentPage === totalPages}
                            variant="outline"
                            borderRadius="lg"
                            _hover={{
                              bg: "blue.50",
                              borderColor: "blue.300",
                            }}
                          >
                            Next
                          </Button>
                        </ButtonGroup>
                      </Flex>
                    </Box>
                  )}
                </VStack>
              ) : searchQuery ? (
                <VStack spacing={6} py={16}>
                  <Box
                    p={6}
                    bg="blue.50"
                    borderRadius="full"
                    border="2px solid"
                    borderColor="blue.200"
                  >
                    <Icon as={Search} size={24} color="blue.500" />
                  </Box>
                  <VStack spacing={3}>
                    <Text fontWeight="bold" color="gray.700" fontSize="lg">
                      No packages found for "{searchQuery}"
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.500"
                      textAlign="center"
                      maxW="400px"
                    >
                      Try different keywords, check your spelling, or browse our
                      popular packages below
                    </Text>
                  </VStack>
                  <HStack spacing={3}>
                    <Button
                      size="md"
                      variant="outline"
                      colorScheme="blue"
                      onClick={() => setSearchQuery("")}
                      borderRadius="lg"
                    >
                      Clear Search
                    </Button>
                    <Button
                      size="md"
                      variant="solid"
                      colorScheme="blue"
                      onClick={() => setFilterBy("popular")}
                      borderRadius="lg"
                    >
                      View Popular
                    </Button>
                  </HStack>
                </VStack>
              ) : (
                <VStack spacing={8} py={16}>
                  <Box
                    p={8}
                    bg="blue.50"
                    borderRadius="3xl"
                    border="2px solid"
                    borderColor="blue.200"
                    position="relative"
                    overflow="hidden"
                  >
                    <Icon
                      as={Package}
                      size={32}
                      color="blue.500"
                      position="relative"
                      zIndex={1}
                    />
                  </Box>
                  <VStack spacing={4}>
                    <Text fontWeight="bold" color="gray.700" fontSize="xl">
                      Search for NuGet Packages
                    </Text>
                    <Text
                      fontSize="md"
                      color="gray.500"
                      textAlign="center"
                      maxW="480px"
                      lineHeight="1.6"
                    >
                      Find and install packages to add functionality to your
                      project. Search by name, functionality, or browse by
                      category.
                    </Text>
                  </VStack>

                  {/* Popular packages suggestions */}
                  <VStack spacing={4}>
                    <Text fontSize="md" fontWeight="semibold" color="gray.700">
                      Popular Packages
                    </Text>
                    <HStack
                      spacing={3}
                      wrap="wrap"
                      justify="center"
                      maxW="600px"
                    >
                      {[
                        {
                          name: "Serilog",
                          icon: Activity,
                          desc: "Logging",
                          color: "orange",
                        },
                        {
                          name: "AutoMapper",
                          icon: Repeat,
                          desc: "Mapping",
                          color: "green",
                        },
                        {
                          name: "FluentValidation",
                          icon: CheckCircle,
                          desc: "Validation",
                          color: "blue",
                        },
                        {
                          name: "MediatR",
                          icon: Radio,
                          desc: "CQRS",
                          color: "purple",
                        },
                        {
                          name: "Polly",
                          icon: RotateCcw,
                          desc: "Resilience",
                          color: "red",
                        },
                        {
                          name: "EntityFramework",
                          icon: Database,
                          desc: "ORM",
                          color: "indigo",
                        },
                      ].map((suggestion) => (
                        <Button
                          key={suggestion.name}
                          size="md"
                          variant="outline"
                          colorScheme={suggestion.color}
                          onClick={() => setSearchQuery(suggestion.name)}
                          borderRadius="xl"
                          px={4}
                          py={6}
                          h="auto"
                          flexDirection="column"
                          spacing={2}
                          _hover={{
                            transform: "translateY(-2px)",
                            shadow: "md",
                            bg: `${suggestion.color}.50`,
                          }}
                          transition="all 0.2s"
                        >
                          <Icon as={suggestion.icon} size={20} />
                          <Text fontSize="sm" fontWeight="semibold">
                            {suggestion.name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {suggestion.desc}
                          </Text>
                        </Button>
                      ))}
                    </HStack>
                  </VStack>
                </VStack>
              )}
            </Box>

            {/* Footer Info */}
            {searchResults.length > 0 && (
              <Alert
                status="info"
                borderRadius="xl"
                fontSize="sm"
                bg="blue.50"
                border="1px solid"
                borderColor="blue.200"
                p={4}
              >
                <AlertIcon color="blue.500" />
                <AlertDescription color="blue.700">
                  <HStack spacing={1} wrap="wrap">
                    <Text fontWeight="semibold">💡 Pro Tip:</Text>
                    <Text>
                      Select different versions using the dropdown in the
                      Version column. Versions are automatically filtered for
                      .NET {dotnetVersion} compatibility.
                    </Text>
                  </HStack>
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
