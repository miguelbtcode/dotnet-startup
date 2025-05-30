// src/components/dependencies/PackageVersionSelector.tsx
import React, { useState, useEffect } from "react";
import {
  Select,
  Spinner,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { AlertCircle, Download, Clock } from "lucide-react";
import { nugetService } from "../../services/NuGetService";

interface PackageVersion {
  version: string;
  downloads: number;
  published: string;
  isLatest: boolean;
  isPrerelease: boolean;
  isDeprecated: boolean;
}

interface PackageVersionSelectorProps {
  packageId: string;
  defaultVersion: string;
  dotnetVersion: string;
  onVersionChange: (version: string) => void;
  size?: "sm" | "md" | "lg";
  isDisabled?: boolean;
}

export const PackageVersionSelector: React.FC<PackageVersionSelectorProps> = ({
  packageId,
  defaultVersion,
  dotnetVersion,
  onVersionChange,
  size = "sm",
  isDisabled = false,
}) => {
  const [versions, setVersions] = useState<PackageVersion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState(defaultVersion);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchVersions();
  }, [packageId]);

  useEffect(() => {
    setSelectedVersion(defaultVersion);
  }, [defaultVersion]);

  const fetchVersions = async () => {
    if (!packageId) return;

    setLoading(true);
    setError(null);

    try {
      const packageVersions = await nugetService.getPackageVersions(packageId);

      // Filter and sort versions
      const filteredVersions = packageVersions
        .filter((v) => !v.isPrerelease) // Exclude prereleases by default
        .sort((a, b) => {
          // Sort by latest first, then by version number (descending)
          if (a.isLatest && !b.isLatest) return -1;
          if (!a.isLatest && b.isLatest) return 1;
          return compareVersions(b.version, a.version);
        })
        .slice(0, 10); // Limit to 10 most recent versions

      setVersions(filteredVersions);

      // If current version is not in the list, add it
      if (
        defaultVersion &&
        !filteredVersions.find((v) => v.version === defaultVersion)
      ) {
        const currentVersionInfo: PackageVersion = {
          version: defaultVersion,
          downloads: 0,
          published: "",
          isLatest: false,
          isPrerelease: false,
          isDeprecated: false,
        };
        setVersions([currentVersionInfo, ...filteredVersions]);
      }
    } catch (err) {
      console.error("Error fetching package versions:", err);
      setError("Failed to load versions");
      toast({
        title: "Error loading versions",
        description: `Could not fetch versions for ${packageId}`,
        status: "warning",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const compareVersions = (a: string, b: string): number => {
    const partsA = a.split(".").map(Number);
    const partsB = b.split(".").map(Number);

    for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
      const partA = partsA[i] || 0;
      const partB = partsB[i] || 0;

      if (partA !== partB) {
        return partA - partB;
      }
    }
    return 0;
  };

  const handleVersionChange = (newVersion: string) => {
    setSelectedVersion(newVersion);
    onVersionChange(newVersion);
  };

  const formatPublishedDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getVersionBadge = (version: PackageVersion) => {
    if (version.isLatest) return { text: "Latest", color: "green" };
    if (version.isPrerelease) return { text: "Pre", color: "orange" };
    if (version.isDeprecated) return { text: "Deprecated", color: "red" };
    return null;
  };

  if (loading) {
    return (
      <HStack spacing={2}>
        <Spinner size="xs" />
        <Text fontSize="xs" color="gray.500">
          Loading versions...
        </Text>
      </HStack>
    );
  }

  if (error) {
    return (
      <HStack spacing={2}>
        <Icon as={AlertCircle} size={12} color="orange.500" />
        <Badge colorScheme="orange" variant="outline" size="sm">
          v{defaultVersion}
        </Badge>
      </HStack>
    );
  }

  return (
    <VStack align="stretch" spacing={1}>
      <Select
        value={selectedVersion}
        onChange={(e) => handleVersionChange(e.target.value)}
        size={size}
        isDisabled={isDisabled || loading}
        variant="outline"
        borderRadius="md"
        _focus={{
          borderColor: "blue.500",
          boxShadow: "0 0 0 1px blue.500",
        }}
      >
        {versions.map((version) => (
          <option key={version.version} value={version.version}>
            v{version.version}
            {version.isLatest ? " (Latest)" : ""}
            {version.isDeprecated ? " (Deprecated)" : ""}
          </option>
        ))}
      </Select>

      {/* Version Info */}
      {selectedVersion && (
        <HStack spacing={2} justify="space-between" fontSize="xs">
          <HStack spacing={1}>
            {(() => {
              const versionInfo = versions.find(
                (v) => v.version === selectedVersion
              );
              const badge = versionInfo ? getVersionBadge(versionInfo) : null;

              return (
                <>
                  {badge && (
                    <Badge colorScheme={badge.color} size="xs" variant="subtle">
                      {badge.text}
                    </Badge>
                  )}
                  {versionInfo?.downloads ? (
                    <Tooltip
                      label={`${versionInfo.downloads.toLocaleString()} downloads`}
                    >
                      <HStack spacing={1}>
                        <Icon as={Download} size={10} color="gray.400" />
                        <Text color="gray.500">
                          {versionInfo.downloads > 1000000
                            ? `${(versionInfo.downloads / 1000000).toFixed(1)}M`
                            : versionInfo.downloads > 1000
                            ? `${(versionInfo.downloads / 1000).toFixed(1)}K`
                            : versionInfo.downloads.toString()}
                        </Text>
                      </HStack>
                    </Tooltip>
                  ) : null}
                </>
              );
            })()}
          </HStack>

          {(() => {
            const versionInfo = versions.find(
              (v) => v.version === selectedVersion
            );
            return versionInfo?.published ? (
              <Tooltip
                label={`Published: ${formatPublishedDate(
                  versionInfo.published
                )}`}
              >
                <HStack spacing={1}>
                  <Icon as={Clock} size={10} color="gray.400" />
                  <Text color="gray.500">
                    {formatPublishedDate(versionInfo.published)}
                  </Text>
                </HStack>
              </Tooltip>
            ) : null;
          })()}
        </HStack>
      )}
    </VStack>
  );
};
