import React from 'react';
import {
  VStack,
  SimpleGrid,
  Box,
  Text,
  Alert,
  AlertIcon,
  HStack,
  Icon,
  Badge,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { Zap, AlertTriangle } from 'lucide-react';
import { useFeaturesStore } from '../../store/featuresStore';
import { featureCategories } from '../../data/featureCategories';
import { FeatureCard } from './FeatureCard';

export const FeaturesTab: React.FC = () => {
  const {
    selectedFeatures,
    selectFeature,
    complexity,
    isValid,
    conflicts,
  } = useFeaturesStore();

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Box
        bg={cardBg}
        p={6}
        rounded="xl"
        borderWidth="1px"
        borderColor={borderColor}
        shadow="sm"
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between">
            <HStack spacing={3}>
              <Icon as={Zap} boxSize={6} color="blue.500" />
              <Text fontSize="xl" fontWeight="bold">
                Project Features
              </Text>
            </HStack>
            <Badge
              colorScheme={
                complexity === 'Advanced'
                  ? 'red'
                  : complexity === 'Intermediate'
                  ? 'orange'
                  : 'green'
              }
              px={3}
              py={1}
              borderRadius="full"
            >
              {complexity} Complexity
            </Badge>
          </HStack>

          <Text color="gray.600">
            Configure advanced features and patterns for your .NET project.
            Select options that best match your requirements and expertise level.
          </Text>

          {!isValid && conflicts.length > 0 && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontWeight="medium">Configuration Conflicts Detected</Text>
                {conflicts.map((conflict, index) => (
                  <Text key={index} fontSize="sm">
                    • {conflict}
                  </Text>
                ))}
              </VStack>
            </Alert>
          )}
        </VStack>
      </Box>

      {/* Feature Categories */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {featureCategories.map((category) => (
          <Box key={category.id}>
            <VStack align="stretch" spacing={4}>
              <HStack spacing={2}>
                <Icon as={category.icon} color="purple.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  {category.title}
                </Text>
                {category.isRequired && (
                  <Badge colorScheme="red">Required</Badge>
                )}
              </HStack>

              <Text fontSize="sm" color="gray.600">
                {category.description}
              </Text>

              <VStack align="stretch" spacing={4}>
                {category.options.map((option) => (
                  <FeatureCard
                    key={option.id}
                    option={option}
                    isSelected={selectedFeatures[category.id] === option.id}
                    onSelect={() => selectFeature(category.id, option.id)}
                  />
                ))}
              </VStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};