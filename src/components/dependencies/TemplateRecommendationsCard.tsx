// src/components/dependencies/TemplateRecommendationsCard.tsx
import React from "react";
import { Box, VStack, HStack, Text, Button, Icon } from "@chakra-ui/react";
import { Sparkles, BookOpen } from "lucide-react";

interface TemplateRecommendationsCardProps {
  config: {
    type: string;
    architecture: string;
    dotnetVersion: string;
    database: string;
  };
  hasRecommendations: boolean;
  onOpenTemplate: () => void;
}

export const TemplateRecommendationsCard: React.FC<
  TemplateRecommendationsCardProps
> = ({ config, hasRecommendations, onOpenTemplate }) => {
  if (!hasRecommendations) return null;

  return (
    <Box
      p={4}
      bg="purple.50"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="purple.200"
    >
      <HStack justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Icon as={Sparkles} color="purple.500" />
            <Text fontWeight="bold" color="purple.700">
              Recommended Templates Available
            </Text>
          </HStack>
          <Text fontSize="sm" color="purple.600">
            Pre-configured package sets optimized for {config.type} with{" "}
            {config.architecture} architecture on .NET {config.dotnetVersion}
          </Text>
        </VStack>
        <Button
          colorScheme="purple"
          leftIcon={<BookOpen size={16} />}
          onClick={onOpenTemplate}
        >
          Browse Templates
        </Button>
      </HStack>
    </Box>
  );
};
