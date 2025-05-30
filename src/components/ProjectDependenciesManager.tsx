// src/components/ProjectDependenciesManager.tsx
import React, { useState, useEffect } from "react";
import {
  VStack,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  SimpleGrid,
  useToast,
  useDisclosure,
  Box,
} from "@chakra-ui/react";
import { useProjectStore } from "../store/projectStore";
import { getArchitectureInfo } from "../utils/architectureUtils";
import { NuGetPackage } from "../types/nuget";
import { NuGetDependency } from "../types/project";
import { TemplateService } from "./dependencies/TemplateService";

// Import the new modular components
import { ProjectStructureCard } from "./dependencies/ProjectStructureCard";
import { PackageSearchModal } from "./dependencies/PackageSearchModal";
import { TemplateSelectionModal } from "./dependencies/TemplateSelectionModal";
import { TemplateRecommendationsCard } from "./dependencies/TemplateRecommendationsCard";
import { DebugStateViewer } from "./debug/DebugStateViewer";

export const ProjectDependenciesManager: React.FC = () => {
  const { config, setConfig } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<{
    [projectName: string]: { [packageId: string]: boolean };
  }>({});

  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();
  const {
    isOpen: isTemplateOpen,
    onOpen: onTemplateOpen,
    onClose: onTemplateClose,
  } = useDisclosure();

  const toast = useToast();

  const architectureInfo = getArchitectureInfo(
    config.architecture,
    config.name || "MyProject",
    config.type
  );

  // Get recommended templates using the service
  const recommendedTemplates = TemplateService.getRecommendedTemplates(
    config.type,
    config.architecture,
    config.dotnetVersion,
    config.database
  );

  /**
   * Maps template project names to actual project names
   * Template names: Domain, Application, Infrastructure, API, Shared, Web, Core, MonolithProject, etc.
   * Actual names: TechMart.Domain, TechMart.Application, TechMart.Infrastructure, TechMart.API, TechMart.Shared, TechMart
   */
  const mapTemplateNameToProjectName = (templateName: string): string => {
    const projectBaseName = config.name || "MyProject";

    // For monolithic projects (default architecture)
    if (
      templateName === "MonolithProject" ||
      templateName === projectBaseName
    ) {
      return projectBaseName;
    }

    // For any other template name, try to find actual project that matches
    // First, try exact match
    const exactMatch = architectureInfo.projects.find(
      (project) => project.name === templateName
    );
    if (exactMatch) {
      return exactMatch.name;
    }

    // Then try to find project that ends with template name
    const suffixMatch = architectureInfo.projects.find((project) => {
      return project.name.endsWith(`.${templateName}`);
    });
    if (suffixMatch) {
      return suffixMatch.name;
    }

    // If no match found, construct the expected name: ProjectBaseName.TemplateName
    return `${projectBaseName}.${templateName}`;
  };

  /**
   * Maps actual project names back to template names for reverse lookup
   * More generic approach - extracts the suffix after the last dot, or returns MonolithProject for base name
   */
  const mapProjectNameToTemplateName = (projectName: string): string => {
    const projectBaseName = config.name || "MyProject";

    // For monolithic projects (base name only)
    if (projectName === projectBaseName) {
      return "MonolithProject";
    }

    // For any project with dots, extract the suffix
    // e.g., "TechMart.Domain" -> "Domain", "TechMart.Shared" -> "Shared"
    const parts = projectName.split(".");
    if (parts.length > 1) {
      return parts[parts.length - 1]; // Get the last part after the last dot
    }

    // If no dots, return as-is (might be a single-word project name)
    return projectName;
  };

  // Debug: Log template and project name matching
  console.log(
    "🏗️ Architecture Info Projects:",
    architectureInfo.projects.map((p) => ({
      name: p.name,
      layer: p.layer,
      description: p.description,
    }))
  );
  console.log(
    "📋 Available Template Projects:",
    Object.keys(recommendedTemplates)
  );

  // Test the mapping function
  Object.keys(recommendedTemplates).forEach((templateName) => {
    const mappedName = mapTemplateNameToProjectName(templateName);
    console.log(`🔄 Template Mapping: "${templateName}" -> "${mappedName}"`);
  });

  console.log(
    "🔍 Template Matching Check:",
    architectureInfo.projects.map((project) => ({
      projectName: project.name,
      templateName: mapProjectNameToTemplateName(project.name),
      hasTemplate:
        !!recommendedTemplates[mapProjectNameToTemplateName(project.name)],
      templatePackages:
        recommendedTemplates[mapProjectNameToTemplateName(project.name)]
          ?.length || 0,
    }))
  );

  // Debug: Log current state
  console.log("🔍 Dependencies Manager State:", {
    selectedPackages: config.selectedPackages,
    templatesAvailable: Object.keys(recommendedTemplates).length,
    projects: architectureInfo.projects.map((p) => p.name),
  });

  useEffect(() => {
    if (architectureInfo.projects.length > 0 && !selectedProject) {
      setSelectedProject(architectureInfo.projects[0].name);
    }
  }, [architectureInfo.projects, selectedProject]);

  const addPackageToProject = (
    projectName: string,
    nugetPackage: NuGetPackage
  ) => {
    console.log("🚀 Adding package to project:", {
      projectName,
      package: nugetPackage.id,
    });

    const dependency: NuGetDependency = {
      id: nugetPackage.id,
      version: nugetPackage.version,
      description: nugetPackage.description,
      verified: nugetPackage.verified,
      addedAt: new Date().toISOString(),
    };

    const currentPackages = config.selectedPackages || {};
    const projectPackages = currentPackages[projectName] || [];

    const existingPackage = projectPackages.find((p) => p.id === dependency.id);
    if (existingPackage) {
      toast({
        title: "Package already added",
        description: `${dependency.id} is already in ${projectName}`,
        status: "warning",
        duration: 2000,
      });
      return;
    }

    const updatedPackages = {
      ...currentPackages,
      [projectName]: [...projectPackages, dependency],
    };

    console.log("📦 Updating packages state:", updatedPackages);
    setConfig({ selectedPackages: updatedPackages });

    toast({
      title: "Package added",
      description: `${dependency.id} added to ${projectName}`,
      status: "success",
      duration: 2000,
    });
  };

  const removePackageFromProject = (projectName: string, packageId: string) => {
    console.log("🗑️ Removing package from project:", {
      projectName,
      packageId,
    });

    const currentPackages = config.selectedPackages || {};
    const projectPackages = currentPackages[projectName] || [];

    const updatedProjectPackages = projectPackages.filter(
      (p) => p.id !== packageId
    );
    const updatedPackages = {
      ...currentPackages,
      [projectName]: updatedProjectPackages,
    };

    console.log("📦 Updated packages after removal:", updatedPackages);
    setConfig({ selectedPackages: updatedPackages });

    toast({
      title: "Package removed",
      description: `${packageId} removed from ${projectName}`,
      status: "info",
      duration: 2000,
    });
  };

  const handleAddPackage = (projectName: string) => {
    setSelectedProject(projectName);
    onSearchOpen();
  };

  const applyTemplate = (packageVersions: {
    [projectName: string]: { [packageId: string]: string };
  }) => {
    console.log("🎯 Starting template application...");
    console.log("🎯 Selected template state:", selectedTemplate);
    console.log("🎯 Package versions:", packageVersions);
    console.log("🎯 Available templates:", recommendedTemplates);
    console.log("🎯 Current config.selectedPackages:", config.selectedPackages);

    const currentPackages = config.selectedPackages || {};
    let updatedPackages = { ...currentPackages };
    let addedCount = 0;
    let skippedCount = 0;

    // Debug: Check what we're iterating over
    console.log(
      "🔄 Iterating over selectedTemplate entries:",
      Object.entries(selectedTemplate)
    );

    Object.entries(selectedTemplate).forEach(
      ([templateProjectName, packages]) => {
        console.log(`📁 Processing template project: ${templateProjectName}`);

        // Map template name to actual project name
        const actualProjectName =
          mapTemplateNameToProjectName(templateProjectName);
        console.log(
          `🔄 Mapped "${templateProjectName}" -> "${actualProjectName}"`
        );

        console.log(`📦 Packages for ${templateProjectName}:`, packages);

        Object.entries(packages).forEach(([packageId, isSelected]) => {
          console.log(
            `  📦 Package ${packageId}: ${
              isSelected ? "SELECTED" : "NOT SELECTED"
            }`
          );

          if (isSelected) {
            const template = recommendedTemplates[templateProjectName]?.find(
              (p) => p.id === packageId
            );
            console.log(`  🔍 Template found for ${packageId}:`, template);

            if (template) {
              const projectPackages = updatedPackages[actualProjectName] || [];
              const existingPackage = projectPackages.find(
                (p) => p.id === packageId
              );

              console.log(
                `  📋 Current packages in ${actualProjectName}:`,
                projectPackages.map((p) => p.id)
              );
              console.log(
                `  🔍 Existing package check for ${packageId}:`,
                existingPackage
              );

              if (!existingPackage) {
                // Use the selected version from packageVersions, fallback to template version
                const selectedVersion =
                  packageVersions[templateProjectName]?.[packageId] ||
                  template.version;

                const dependency: NuGetDependency = {
                  id: template.id,
                  version: selectedVersion,
                  description: template.description,
                  verified: true,
                  addedAt: new Date().toISOString(),
                };

                // Ensure the project array exists
                if (!updatedPackages[actualProjectName]) {
                  updatedPackages[actualProjectName] = [];
                }

                updatedPackages[actualProjectName] = [
                  ...projectPackages,
                  dependency,
                ];
                addedCount++;

                console.log(
                  `  ✅ Added package: ${packageId}@${selectedVersion} to ${actualProjectName} (was ${templateProjectName})`
                );
                console.log(
                  `  📋 Updated packages for ${actualProjectName}:`,
                  updatedPackages[actualProjectName]
                );
              } else {
                skippedCount++;
                console.log(
                  `  ⏭️ Skipped existing package: ${packageId} in ${actualProjectName}`
                );
              }
            } else {
              console.log(
                `  ❌ No template found for package ${packageId} in template project ${templateProjectName}`
              );
              console.log(
                `  🔍 Available templates for ${templateProjectName}:`,
                recommendedTemplates[templateProjectName]
              );
            }
          }
        });
      }
    );

    console.log("📦 Final updated packages state:", updatedPackages);
    console.log("📊 Summary - Added:", addedCount, "Skipped:", skippedCount);

    // Force a complete re-render by creating a completely new object
    const finalPackages = JSON.parse(JSON.stringify(updatedPackages));

    console.log("🏪 Calling setConfig with:", {
      selectedPackages: finalPackages,
    });

    // Update the store with new packages
    setConfig({ selectedPackages: finalPackages });

    // Reset template selection and close modal
    setSelectedTemplate({});
    onTemplateClose();

    // Show detailed feedback
    if (addedCount > 0) {
      toast({
        title: "Template applied successfully!",
        description: `${addedCount} packages added to your projects${
          skippedCount > 0 ? `, ${skippedCount} already existed` : ""
        }`,
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } else if (skippedCount > 0) {
      toast({
        title: "No new packages added",
        description: `All ${skippedCount} selected packages already exist in your projects`,
        status: "info",
        duration: 3000,
      });
    } else {
      toast({
        title: "No packages selected",
        description: "Please select packages to apply",
        status: "warning",
        duration: 3000,
      });
    }
  };

  const toggleTemplatePackage = (projectName: string, packageId: string) => {
    setSelectedTemplate((prev) => ({
      ...prev,
      [projectName]: {
        ...prev[projectName],
        [packageId]: !prev[projectName]?.[packageId],
      },
    }));
  };

  const selectAllForProject = (projectName: string) => {
    const packages = recommendedTemplates[projectName] || [];
    setSelectedTemplate((prev) => ({
      ...prev,
      [projectName]: packages.reduce(
        (acc, pkg) => ({
          ...acc,
          [pkg.id]: true,
        }),
        {}
      ),
    }));
  };

  const hasAnyRecommendations = Object.keys(recommendedTemplates).length > 0;

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Alert status="info" borderRadius="lg">
        <AlertIcon />
        <Box>
          <AlertTitle>Project Dependencies</AlertTitle>
          <AlertDescription>
            Configure NuGet packages for your {config.architecture}{" "}
            architecture. Use recommended templates or search for specific
            packages.
          </AlertDescription>
        </Box>
      </Alert>

      {/* Template Recommendations Card */}
      <TemplateRecommendationsCard
        config={config}
        hasRecommendations={hasAnyRecommendations}
        onOpenTemplate={onTemplateOpen}
      />

      {/* Project Structure Grid */}
      <SimpleGrid columns={{ base: 1, lg: 2, xl: 3 }} spacing={4}>
        {architectureInfo.projects.map((project, index) => {
          const projectPackages = config.selectedPackages?.[project.name] || [];
          const hasRecommendations =
            recommendedTemplates[project.name]?.length > 0;

          console.log(`🏗️ Rendering card for ${project.name}:`, {
            packagesCount: projectPackages.length,
            packages: projectPackages.map((p) => `${p.id}@${p.version}`),
            availableKeys: Object.keys(config.selectedPackages || {}),
            exactMatch: config.selectedPackages?.[project.name] !== undefined,
          });

          // Debug: Check if there are packages with similar names
          const similarKeys = Object.keys(config.selectedPackages || {}).filter(
            (key) =>
              key.includes(project.name.split(".")[0]) ||
              project.name.includes(key)
          );

          if (similarKeys.length > 0) {
            console.log(
              `🔍 Found similar keys for ${project.name}:`,
              similarKeys
            );
          }

          return (
            <Box key={`${project.name}-${index}-${projectPackages.length}`}>
              <ProjectStructureCard
                project={project}
                packages={projectPackages}
                hasRecommendations={hasRecommendations}
                onAddPackage={() => handleAddPackage(project.name)}
                onOpenTemplate={onTemplateOpen}
                onRemovePackage={(packageId) =>
                  removePackageFromProject(project.name, packageId)
                }
              />
            </Box>
          );
        })}
      </SimpleGrid>

      {/* Package Search Modal */}
      <PackageSearchModal
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        selectedProject={selectedProject}
        onAddPackage={addPackageToProject}
      />

      {/* Template Selection Modal */}
      <TemplateSelectionModal
        isOpen={isTemplateOpen}
        onClose={onTemplateClose}
        config={config}
        architectureInfo={architectureInfo}
        recommendedTemplates={recommendedTemplates}
        selectedTemplate={selectedTemplate}
        onTogglePackage={toggleTemplatePackage}
        onSelectAllForProject={selectAllForProject}
        onApplyTemplate={applyTemplate}
      />
    </VStack>
  );
};
