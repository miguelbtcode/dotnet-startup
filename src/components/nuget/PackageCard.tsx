import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Badge,
  Icon,
  Tooltip,
  useColorModeValue,
} from '@chakra-ui/react';
import { Package, Download, Star, Shield, Info } from 'lucide-react';
import { NuGetPackage } from '../../types/nuget';

interface PackageCardProps {
  package: NuGetPackage;
  onSelect: (pkg: NuGetPackage) => void;
}

export const PackageCard: React.FC<PackageCardProps> = ({ package: pkg, onSelect }) => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      p={4}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
        borderColor: 'blue.400',
      }}
      onClick={() => onSelect(pkg)}
    >
      <VStack align="stretch" spacing={3}>
        <HStack justify="space-between">
          <HStack>
            <Icon as={Package} color="blue.500" />
            <Text fontWeight="bold" fontSize="lg">
              {pkg.id}
            </Text>
          </HStack>
          <Badge colorScheme="blue" variant="subtle">
            v{pkg.version}
          </Badge>
        </HStack>

        <Text fontSize="sm" color="gray.600" noOfLines={2}>
          {pkg.description}
        </Text>

        <HStack spacing={4} fontSize="sm">
          <Tooltip label="Total Downloads">
            <HStack spacing={1}>
              <Icon as={Download} size={14} />
              <Text>{pkg.totalDownloads.toLocaleString()}</Text>
            </HStack>
          </Tooltip>

          {pkg.verified && (
            <Tooltip label="Verified Package">
              <HStack spacing={1} color="green.500">
                <Icon as={Shield} size={14} />
                <Text>Verified</Text>
              </HStack>
            </Tooltip>
          )}
        </HStack>

        <HStack spacing={2} flexWrap="wrap">
          {pkg.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} colorScheme="purple" variant="subtle" fontSize="xs">
              {tag}
            </Badge>
          ))}
          {pkg.tags.length > 3 && (
            <Tooltip label={pkg.tags.slice(3).join(', ')}>
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                +{pkg.tags.length - 3}
              </Badge>
            </Tooltip>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};