import React from 'react';
import { ChakraProvider, Container, Grid, VStack, Heading } from '@chakra-ui/react';
import { ProjectForm } from './components/ProjectForm';
import { ProjectPreview } from './components/ProjectPreview';
import { JsonOutput } from './components/JsonOutput';

function App() {
  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading textAlign="center" size="xl" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text">
            .NET Project Generator
          </Heading>
          
          <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
            <VStack spacing={8} align="stretch">
              <ProjectForm />
            </VStack>
            
            <VStack spacing={8} align="stretch">
              <ProjectPreview />
              <JsonOutput />
            </VStack>
          </Grid>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;