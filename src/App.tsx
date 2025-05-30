import React from "react";
import {
  ChakraProvider,
  Container,
  Grid,
  VStack,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { ProjectForm } from "./components/ProjectForm";
import { ProjectPreview } from "./components/ProjectPreview";
import { JsonOutput } from "./components/JsonOutput";
import { PackageExplorer } from "./components/nuget/PackageExplorer";
import { useProjectStore } from "./store/projectStore";
import { NuGetPackage } from "./types/nuget";

function App() {
  const { config, setConfig } = useProjectStore();

  const handlePackagesChange = (packages: NuGetPackage[]) => {
    // Update the store with selected packages
    // You would need to extend ProjectConfig to include packages
  };

  return (
    <ChakraProvider>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          <Heading
            textAlign="center"
            size="xl"
            bgGradient="linear(to-r, blue.400, purple.500)"
            bgClip="text"
          >
            .NET Project Generator
          </Heading>

          <Tabs variant="enclosed" colorScheme="blue">
            <TabList>
              <Tab>Project Configuration</Tab>
              <Tab>NuGet Packages</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0} pt={4}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                  gap={8}
                >
                  <VStack spacing={8} align="stretch">
                    <ProjectForm />
                  </VStack>

                  <VStack spacing={8} align="stretch">
                    <ProjectPreview />
                    <JsonOutput />
                  </VStack>
                </Grid>
              </TabPanel>

              <TabPanel p={0} pt={4}>
                <Grid
                  templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
                  gap={8}
                >
                  <VStack spacing={8} align="stretch">
                    <PackageExplorer
                      projectType={config.type}
                      onPackagesChange={handlePackagesChange}
                    />
                  </VStack>

                  <VStack spacing={8} align="stretch">
                    <ProjectPreview />
                    <JsonOutput />
                  </VStack>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </ChakraProvider>
  );
}

export default App;
