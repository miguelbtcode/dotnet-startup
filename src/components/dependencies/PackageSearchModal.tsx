// src/components/dependencies/PackageSearchModal.tsx
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
} from "@chakra-ui/react";
import { Search, Download, Shield, Plus } from "lucide-react";
import { nugetService } from "../../services/NuGetService";
import { NuGetPackage } from "../../types/nuget";
import { useDebounce } from "../../hooks/useDebounce";

interface PackageSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProject: string;
  onAddPackage: (projectName: string, nugetPackage: NuGetPackage) => void;
}

export const PackageSearchModal: React.FC<PackageSearchModalProps> = ({
  isOpen,
  onClose,
  selectedProject,
  onAddPackage,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NuGetPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const debouncedSearch = useDebounce(searchQuery, 300);

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
          prerelease: false,
        });
        setSearchResults(result.packages);
      } catch (error) {
        toast({
          title: "Error searching packages",
          description: "Please try again later",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    searchPackages();
  }, [debouncedSearch, toast]);

  const handleAddPackage = (pkg: NuGetPackage) => {
    onAddPackage(selectedProject, pkg);
    setSearchQuery("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Package to {selectedProject}</ModalHeader>
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
                      _hover={{ bg: "gray.50" }}
                      cursor="pointer"
                      onClick={() => handleAddPackage(pkg)}
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
                            <Text>
                              {pkg.totalDownloads.toLocaleString()} downloads
                            </Text>
                          </HStack>
                        </VStack>
                        <Button
                          size="sm"
                          colorScheme="blue"
                          leftIcon={<Plus size={14} />}
                        >
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
  );
};
