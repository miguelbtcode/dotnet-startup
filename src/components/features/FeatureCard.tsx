// src/components/features/FeatureCard.tsx
import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  useColorModeValue,
  Tooltip,
  IconButton,
  Collapse,
  Button,
} from '@chakra-ui/react';
import { ChevronDown, ChevronUp, Code, Check, X } from 'lucide-react';
import { FeatureOption } from '../../types/features';

interface FeatureCardProps {
  option: FeatureOption;
  isSelected: boolean;
  onSelect: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  option,
  isSelected,
  onSelect,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const selectedBg = useColorModeValue('blue.50', 'blue.900');
  const selectedBorder = useColorModeValue('blue.500', 'blue.200');

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'gray';
    }
  };

  return (
    <Box
      p={4}
      bg={isSelected ? selectedBg : cardBg}
      borderWidth="1px"
      borderColor={isSelected ? selectedBorder : borderColor}
      borderRadius="xl"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
      }}
      position="relative"
      overflow="hidden"
    >
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between">
          <HStack spacing={2}>
            <Text fontWeight="bold" fontSize="lg">
              {option.title}
            </Text>
            {option.isRecommended && (
              <Badge colorScheme="green" variant="subtle">
                Recommended
              </Badge>
            )}
            {option.isEnterprise && (
              <Badge colorScheme="purple" variant="subtle">
                Enterprise
              </Badge>
            )}
          </HStack>
          <Badge
            colorScheme={getComplexityColor(option.complexity)}
            variant="subtle"
          >
            {option.complexity}
          </Badge>
        </HStack>

        <Text color="gray.600" fontSize="sm">
          {option.description}
        </Text>

        <HStack spacing={2}>
          <Button
            size="sm"
            colorScheme={isSelected ? 'blue' : 'gray'}
            variant={isSelected ? 'solid' : 'outline'}
            onClick={onSelect}
            leftIcon={isSelected ? <Check size={16} /> : undefined}
          >
            {isSelected ? 'Selected' : 'Select'}
          </Button>
          <IconButton
            size="sm"
            variant="ghost"
            icon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            aria-label="Toggle details"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </HStack>

        <Collapse in={isExpanded}>
          <VStack align="stretch" spacing={4} pt={2}>
            {/* Pros & Cons */}
            <HStack spacing={4} align="start">
              <VStack align="stretch" flex="1">
                <Text fontWeight="medium" color="green.600">
                  Pros
                </Text>
                <VStack align="stretch" spacing={1}>
                  {option.pros.map((pro, index) => (
                    <HStack key={index} spacing={2}>
                      <Icon as={Check} color="green.500" boxSize={4} />
                      <Text fontSize="sm">{pro}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
              <VStack align="stretch" flex="1">
                <Text fontWeight="medium" color="red.600">
                  Cons
                </Text>
                <VStack align="stretch" spacing={1}>
                  {option.cons.map((con, index) => (
                    <HStack key={index} spacing={2}>
                      <Icon as={X} color="red.500" boxSize={4} />
                      <Text fontSize="sm">{con}</Text>
                    </HStack>
                  ))}
                </VStack>
              </VStack>
            </HStack>

            {/* Code Examples */}
            {option.codeExamples.map((example, index) => (
              <Box
                key={index}
                bg="gray.50"
                p={3}
                borderRadius="md"
                borderWidth="1px"
                borderColor="gray.200"
              >
                <HStack spacing={2} mb={2}>
                  <Icon as={Code} color="gray.600" />
                  <Text fontSize="sm" fontWeight="medium">
                    {example.title}
                  </Text>
                </HStack>
                <Box
                  bg="gray.900"
                  p={3}
                  borderRadius="md"
                  fontFamily="mono"
                  fontSize="sm"
                >
                  <Text color="gray.100" whiteSpace="pre">
                    {example.code}
                  </Text>
                </Box>
              </Box>
            ))}
          </VStack>
        </Collapse>
      </VStack>
    </Box>
  );
};