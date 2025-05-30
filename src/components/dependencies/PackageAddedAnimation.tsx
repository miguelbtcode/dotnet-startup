// src/components/dependencies/PackageAddedAnimation.tsx
import React, { useEffect, useState } from "react";
import { Box, Badge, HStack, Icon, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { CheckCircle, Package } from "lucide-react";

const slideInAndFade = keyframes`
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  20% {
    transform: translateX(0);
    opacity: 1;
  }
  80% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(20px);
    opacity: 0;
  }
`;

const pulseGreen = keyframes`
  0% {
    background-color: rgba(72, 187, 120, 0.1);
    border-color: rgba(72, 187, 120, 0.3);
  }
  50% {
    background-color: rgba(72, 187, 120, 0.2);
    border-color: rgba(72, 187, 120, 0.5);
  }
  100% {
    background-color: rgba(72, 187, 120, 0.1);
    border-color: rgba(72, 187, 120, 0.3);
  }
`;

interface PackageAddedAnimationProps {
  packageName: string;
  version: string;
  isNew?: boolean;
  layerColor: string;
}

export const PackageAddedAnimation: React.FC<PackageAddedAnimationProps> = ({
  packageName,
  version,
  isNew = false,
  layerColor,
}) => {
  const [showAnimation, setShowAnimation] = useState(isNew);

  useEffect(() => {
    if (isNew) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  const isRecentlyAdded = isNew && showAnimation;

  return (
    <Box
      position="relative"
      animation={isRecentlyAdded ? `${pulseGreen} 2s ease-in-out` : "none"}
      borderRadius="md"
      transition="all 0.3s ease"
    >
      {isRecentlyAdded && (
        <Box
          position="absolute"
          top="-8px"
          right="-8px"
          zIndex={2}
          animation={`${slideInAndFade} 3s ease-in-out`}
        >
          <HStack
            spacing={1}
            bg="green.500"
            color="white"
            px={2}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            shadow="md"
          >
            <Icon as={CheckCircle} size={10} />
            <Text>Added!</Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
};
