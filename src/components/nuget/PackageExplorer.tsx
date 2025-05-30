import React, { useState, useEffect } from 'react';
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  VStack,
  Text,
  Spinner,
  Select,
  HStack,
  Icon,
  useToast,
} from '@chakra-ui/react';
import { Search, Package } from 'lucide-react';
import { PackageCard } from './PackageCard';
import { nugetService } from '../../services/NuGetService';
import { NuGetPackage } from '../../types/nuget';
import { useDebounce } from '../../hooks/useDebounce';

interface PackageExplorerProps {
  projectType: string;
  onPackagesChange: (packages: NuGetPackage[]) => void;
}

export const PackageExplorer: React.FC<PackageExplorerProps> = ({
  projectType,
  onPackagesChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<NuGetPackage[]>([]);
  const [filter, setFilter] = useState('all');
  const toast = useToast();
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    const fetchPackages = async () => {
      if (!debouncedSearch) {
        setPackages([]);
        return;
      }

      setLoading(true);
      try {
        const result = await nugetService.searchPackages(debouncedSearch, {
          packageType: projectType,
          prerelease: false,
        });
        setPackages(result.packages);
      } catch (error) {
        toast({
          title: 'Error fetching packages',
          description: 'Please try again later',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [debouncedSearch, projectType, toast]);

  const handlePackageSelect = async (pkg: NuGetPackage) => {
    try {
      const metadata = await nugetService.getPackageMetadata(pkg.id, pkg.version);
      const vulnerabilities = await nugetService.checkVulnerabilities(pkg.id, pkg.version);
      
      // Here you would typically update the selected packages in your state management
      onPackagesChange([...packages, { ...pkg, metadata, vulnerabilities }]);
      
      toast({
        title: 'Package added',
        description: `${pkg.id} has been added to your project`,
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Error adding package',
        description: 'Failed to add the package. Please try again.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
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
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} w="200px">
          <option value="all">All Packages</option>
          <option value="popular">Most Popular</option>
          <option value="recent">Recently Updated</option>
        </Select>
      </HStack>

      {loading ? (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : packages.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {packages.map((pkg) => (
            <PackageCard
              key={`${pkg.id}-${pkg.version}`}
              package={pkg}
              onSelect={handlePackageSelect}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Box textAlign="center" py={8}>
          <Icon as={Package} size={40} color="gray.400" />
          <Text mt={2} color="gray.500">
            {searchQuery
              ? 'No packages found. Try a different search term.'
              : 'Start typing to search for packages'}
          </Text>
        </Box>
      )}
    </VStack>
  );
};