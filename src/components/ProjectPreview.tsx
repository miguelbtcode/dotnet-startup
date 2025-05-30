import React from 'react';
import {
  Box,
  VStack,
  Text,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { useProjectStore } from '../store/projectStore';
import { getArchitectureInfo } from '../utils/architectureUtils';
import { FolderTree, GitFork, ArrowRight, Package, GitBranch } from 'lucide-react';

export const ProjectPreview: React.FC = () => {
  const { config } = useProjectStore();
  const architectureInfo = getArchitectureInfo(config.architecture, config.name || 'MyProject');

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <VStack align="stretch" spacing={4}>
        <Text 
          fontSize="xl" 
          fontWeight="bold" 
          bgGradient="linear(to-r, blue.400, purple.500)" 
          bgClip="text"
        >
          Project Preview
        </Text>
        
        <Box>
          <Text fontWeight="semibold" mb={2}>Configuration</Text>
          <HStack spacing={2} flexWrap="wrap">
            <Badge colorScheme="blue">.NET {config.dotnetVersion}</Badge>
            <Badge colorScheme="purple">{config.type}</Badge>
            <Badge colorScheme="green">{config.architecture}</Badge>
            <Badge colorScheme="orange">{config.database}</Badge>
          </HStack>
        </Box>

        <Divider />

        <Box>
          <Tooltip label={architectureInfo.description} placement="top">
            <HStack spacing={2} mb={4}>
              <Icon as={GitBranch} color="blue.500" />
              <Text fontWeight="semibold">Architecture Overview</Text>
            </HStack>
          </Tooltip>

          <VStack align="stretch" spacing={4}>
            {architectureInfo.projects.map((project, index) => (
              <Box 
                key={index}
                p={4}
                bg="gray.50"
                rounded="md"
                borderLeft="4px"
                borderColor="blue.400"
                transition="all 0.2s"
                _hover={{ transform: 'translateX(4px)' }}
              >
                <Tooltip label={project.description} placement="top">
                  <Text 
                    fontWeight="semibold" 
                    display="flex" 
                    alignItems="center" 
                    mb={3}
                    color="blue.700"
                  >
                    <Icon as={Package} className="mr-2" />
                    {project.name}
                  </Text>
                </Tooltip>

                <VStack align="stretch" spacing={3}>
                  <Box>
                    <Text fontSize="sm" color="gray.600" mb={2}>
                      <Icon as={FolderTree} className="mr-2" />
                      Structure:
                    </Text>
                    <VStack align="start" spacing={1} pl={4}>
                      {project.folders.map((folder, folderIndex) => (
                        <Text 
                          key={folderIndex} 
                          fontSize="sm" 
                          color="gray.600"
                          display="flex"
                          alignItems="center"
                        >
                          <span className="mr-2">📁</span>
                          {folder}
                        </Text>
                      ))}
                    </VStack>
                  </Box>

                  {project.dependencies && project.dependencies.length > 0 && (
                    <Box>
                      <Text fontSize="sm" color="gray.600" mb={2}>
                        <Icon as={ArrowRight} className="mr-2" />
                        Dependencies:
                      </Text>
                      <VStack align="start" spacing={1} pl={4}>
                        {project.dependencies.map((dep, depIndex) => (
                          <Badge 
                            key={depIndex}
                            colorScheme="purple"
                            variant="outline"
                            size="sm"
                          >
                            {dep}
                          </Badge>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </Box>
            ))}
          </VStack>
        </Box>

        <Divider />

        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton _hover={{ bg: 'gray.50' }}>
              <Box flex="1" textAlign="left">
                Selected Features
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <HStack spacing={2} flexWrap="wrap">
                {Object.entries(config.features).map(([key, value]) => (
                  value && (
                    <Badge 
                      key={key} 
                      colorScheme="blue" 
                      px={3} 
                      py={1} 
                      rounded="full"
                    >
                      {key}
                    </Badge>
                  )
                ))}
              </HStack>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </VStack>
    </Box>
  );
};