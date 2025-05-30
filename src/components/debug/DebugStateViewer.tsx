// src/components/debug/DebugStateViewer.tsx
import React from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Code,
  Button,
} from "@chakra-ui/react";
import { useProjectStore } from "../../store/projectStore";
import { getArchitectureInfo } from "../../utils/architectureUtils";

export const DebugStateViewer: React.FC = () => {
  const { config, setConfig } = useProjectStore();

  // Only show in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  // Helper functions for testing (duplicated for debugging)
  const mapTemplateNameToProjectName = (
    templateName: string,
    projectBaseName: string,
    projects: any[]
  ) => {
    if (
      templateName === "MonolithProject" ||
      templateName === projectBaseName
    ) {
      return projectBaseName;
    }

    const exactMatch = projects.find(
      (project: any) => project.name === templateName
    );
    if (exactMatch) return exactMatch.name;

    const suffixMatch = projects.find((project: any) =>
      project.name.endsWith(`.${templateName}`)
    );
    if (suffixMatch) return suffixMatch.name;

    return `${projectBaseName}.${templateName}`;
  };

  const mapProjectNameToTemplateName = (
    projectName: string,
    projectBaseName: string
  ) => {
    if (projectName === projectBaseName) return "MonolithProject";

    const parts = projectName.split(".");
    if (parts.length > 1) return parts[parts.length - 1];

    return projectName;
  };

  // Test Functions
  const testAddPackage = () => {
    const architectureInfo = getArchitectureInfo(
      config.architecture,
      config.name || "MyProject",
      config.type
    );

    const firstProject = architectureInfo.projects[0];
    if (!firstProject) return;

    const testPackage = {
      [firstProject.name]: [
        {
          id: "TestPackage",
          version: "1.0.0",
          description: "Test package for debugging",
          verified: true,
          addedAt: new Date().toISOString(),
        },
      ],
    };

    console.log("🧪 Adding test package to project:", firstProject.name);
    setConfig({
      selectedPackages: { ...config.selectedPackages, ...testPackage },
    });
  };

  const testAddToAllProjects = () => {
    const architectureInfo = getArchitectureInfo(
      config.architecture,
      config.name || "MyProject",
      config.type
    );

    const testPackages: { [key: string]: any[] } = {};

    architectureInfo.projects.forEach((project, index) => {
      testPackages[project.name] = [
        {
          id: `TestPackage${index + 1}`,
          version: "1.0.0",
          description: `Test package for ${project.name}`,
          verified: true,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    console.log("🧪 Adding test packages to all projects:", testPackages);
    setConfig({
      selectedPackages: { ...config.selectedPackages, ...testPackages },
    });
  };

  const testMappingFunction = () => {
    const architectureInfo = getArchitectureInfo(
      config.architecture,
      config.name || "MyProject",
      config.type
    );

    console.log(
      "🧪 Testing mapping function with all possible template names:"
    );

    const testTemplateNames = [
      "MonolithProject",
      "Domain",
      "Application",
      "Infrastructure",
      "API",
      "Shared",
      "Web",
      "Core",
      "Services",
    ];

    testTemplateNames.forEach((templateName) => {
      const actualName = mapTemplateNameToProjectName(
        templateName,
        config.name || "MyProject",
        architectureInfo.projects
      );
      const reverseName = mapProjectNameToTemplateName(
        actualName,
        config.name || "MyProject"
      );

      console.log(`🔄 ${templateName} -> ${actualName} -> ${reverseName}`);
    });

    console.log(
      "🏗️ Actual projects in architecture:",
      architectureInfo.projects.map((p) => p.name)
    );
  };

  const clearAllPackages = () => {
    setConfig({ selectedPackages: {} });
  };

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      w="400px"
      bg="red.50"
      borderWidth="2px"
      borderColor="red.200"
      borderRadius="md"
      p={4}
      shadow="lg"
      zIndex={9999}
    >
      <VStack align="stretch" spacing={3}>
        {/* Header */}
        <HStack justify="space-between">
          <Text fontWeight="bold" color="red.700">
            🐛 Debug State Viewer
          </Text>
          <Badge colorScheme="red">DEV ONLY</Badge>
        </HStack>

        {/* State Information */}
        <Accordion allowToggle size="sm">
          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="sm">
                  Selected Packages (
                  {Object.keys(config.selectedPackages || {}).length} projects)
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Code fontSize="xs" whiteSpace="pre-wrap" display="block" p={2}>
                {JSON.stringify(config.selectedPackages, null, 2)}
              </Code>
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                <Text fontSize="sm">Full Config</Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
              <Code fontSize="xs" whiteSpace="pre-wrap" display="block" p={2}>
                {JSON.stringify(config, null, 2)}
              </Code>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* Test Buttons */}
        <VStack spacing={2}>
          <Button
            size="xs"
            colorScheme="blue"
            onClick={testAddPackage}
            w="full"
          >
            Add Test Package (First Project)
          </Button>
          <Button
            size="xs"
            colorScheme="green"
            onClick={testAddToAllProjects}
            w="full"
          >
            Add Test to All Projects
          </Button>
          <Button
            size="xs"
            colorScheme="purple"
            onClick={testMappingFunction}
            w="full"
          >
            Test Mapping Function
          </Button>
          <Button
            size="xs"
            colorScheme="red"
            onClick={clearAllPackages}
            w="full"
          >
            Clear All Packages
          </Button>
        </VStack>

        {/* Footer */}
        <Text fontSize="xs" color="gray.600" textAlign="center">
          Check browser console for detailed logs
        </Text>
      </VStack>
    </Box>
  );
};
