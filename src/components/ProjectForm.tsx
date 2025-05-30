import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  VStack,
  useToast,
  Button,
  Text,
  HStack,
  Icon,
  Badge,
  Tooltip,
  Divider,
  InputGroup,
  InputLeftElement,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useProjectStore } from "../store/projectStore";
import { ProjectConfig } from "../types/project";
import {
  Rocket,
  Code,
  Layers,
  Zap,
  CheckCircle,
  AlertCircle,
  Database as DatabaseIcon,
} from "lucide-react";

export const ProjectForm: React.FC = () => {
  const { config, setConfig, saveConfiguration } = useProjectStore();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ProjectConfig>({
    defaultValues: config,
    mode: "onChange",
  });

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Update store when form values change
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change" && value && name) {
        // Prevent infinite loops by checking if the value actually changed
        const currentValue = config[name as keyof ProjectConfig];
        const newValue = value[name as keyof ProjectConfig];

        if (currentValue !== newValue) {
          const fieldUpdate = { [name]: newValue };
          setConfig(fieldUpdate as Partial<ProjectConfig>);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]); // Removed setConfig from dependencies to prevent re-subscription

  // Reset form when config changes externally (only on mount and when config.name changes)
  useEffect(() => {
    reset(config);
  }, [config.name, reset]); // Only reset when project name changes, not on every config change

  const onSubmit = (data: ProjectConfig) => {
    setConfig(data);
    saveConfiguration();

    toast({
      title: "Configuration saved successfully!",
      description:
        "Your project configuration has been saved. You can now proceed to the next steps.",
      status: "success",
      duration: 4000,
      position: "top-right",
    });
  };

  const getArchitectureInfo = (arch: string) => {
    switch (arch) {
      case "clean":
        return {
          description: "Separation of concerns with dependency inversion",
          complexity: "Intermediate",
          projects: 4,
          color: "blue",
        };
      case "ddd":
        return {
          description: "Rich domain modeling with bounded contexts",
          complexity: "Advanced",
          projects: 5,
          color: "purple",
        };
      case "hexagonal":
        return {
          description:
            "Ports and adapters pattern for business logic isolation",
          complexity: "Advanced",
          projects: 4,
          color: "green",
        };
      case "onion":
        return {
          description: "Layered architecture with dependencies pointing inward",
          complexity: "Intermediate",
          projects: 4,
          color: "orange",
        };
      default:
        return {
          description: "Simple monolithic structure for rapid development",
          complexity: "Beginner",
          projects: 1,
          color: "gray",
        };
    }
  };

  const getDatabaseInfo = (db: string) => {
    switch (db) {
      case "sqlserver":
        return {
          name: "SQL Server",
          icon: "🔷",
          description: "Microsoft's enterprise-grade relational database",
          color: "blue",
        };
      case "mysql":
        return {
          name: "MySQL",
          icon: "🐬",
          description: "Popular open-source relational database",
          color: "orange",
        };
      case "postgresql":
        return {
          name: "PostgreSQL",
          icon: "🐘",
          description: "Advanced open-source object-relational database",
          color: "blue",
        };
      case "mongodb":
        return {
          name: "MongoDB",
          icon: "🍃",
          description: "Document-oriented NoSQL database",
          color: "green",
        };
      default:
        return {
          name: "No Database",
          icon: "🚫",
          description: "No database provider selected",
          color: "gray",
        };
    }
  };

  const watchedValues = watch();
  const selectedArchInfo = getArchitectureInfo(watchedValues.architecture);
  const selectedDbInfo = getDatabaseInfo(watchedValues.database);

  return (
    <Box
      bg={cardBg}
      p={8}
      rounded="2xl"
      shadow="xl"
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Decorative background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="4px"
        bgGradient="linear(to-r, blue.400, purple.500, pink.400)"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <VStack spacing={3} align="center">
            <HStack spacing={3}>
              <Icon as={Rocket} boxSize={8} color="blue.500" />
              <Text
                fontSize="2xl"
                fontWeight="bold"
                bgGradient="linear(to-r, blue.400, purple.500)"
                bgClip="text"
              >
                Project Configuration
              </Text>
            </HStack>
            <Text color="gray.500" textAlign="center">
              Set up your .NET project structure and architecture
            </Text>
          </VStack>

          <Divider />

          {/* Basic Configuration */}
          <VStack spacing={6} align="stretch">
            <HStack spacing={2}>
              <Icon as={Code} color="blue.500" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Basic Configuration
              </Text>
            </HStack>

            <Stack spacing={5}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Project name is required",
                  minLength: {
                    value: 2,
                    message: "Project name must be at least 2 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z0-9]*$/,
                    message:
                      "Project name must start with a letter and contain only letters and numbers",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormControl isInvalid={!!fieldState.error}>
                    <FormLabel fontWeight="medium">
                      Project Name
                      <Text as="span" color="red.500">
                        {" "}
                        *
                      </Text>
                    </FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={Rocket} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        {...field}
                        placeholder="MyAwesomeProject"
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                      />
                    </InputGroup>
                    {fieldState.error && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {fieldState.error.message}
                      </Text>
                    )}
                  </FormControl>
                )}
              />

              <HStack spacing={4} align="start">
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl flex="1">
                      <FormLabel fontWeight="medium">Project Type</FormLabel>
                      <Select
                        {...field}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                      >
                        <option value="webapi">🌐 Web API</option>
                        <option value="mvc">🎭 MVC</option>
                        <option value="blazor">⚡ Blazor</option>
                        <option value="console">💻 Console App</option>
                        <option value="classlib">📚 Class Library</option>
                      </Select>
                    </FormControl>
                  )}
                />

                <Controller
                  name="dotnetVersion"
                  control={control}
                  render={({ field }) => (
                    <FormControl flex="1">
                      <FormLabel fontWeight="medium">.NET Version</FormLabel>
                      <Select
                        {...field}
                        size="lg"
                        borderRadius="lg"
                        _focus={{
                          borderColor: "blue.500",
                          boxShadow: "0 0 0 1px blue.500",
                        }}
                      >
                        <option value="6.0">📦 .NET 6.0 (LTS)</option>
                        <option value="7.0">🚀 .NET 7.0</option>
                        <option value="8.0">⭐ .NET 8.0 (LTS)</option>
                        <option value="9.0">🔥 .NET 9.0 (Latest)</option>
                      </Select>
                    </FormControl>
                  )}
                />
              </HStack>
            </Stack>
          </VStack>

          <Divider />

          {/* Architecture Selection */}
          <VStack spacing={6} align="stretch">
            <HStack spacing={2}>
              <Icon as={Layers} color="purple.500" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Architecture Pattern
              </Text>
            </HStack>

            <Controller
              name="architecture"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <Select
                    {...field}
                    size="lg"
                    borderRadius="lg"
                    _focus={{
                      borderColor: "purple.500",
                      boxShadow: "0 0 0 1px purple.500",
                    }}
                  >
                    <option value="default">🏠 Default (Monolithic)</option>
                    <option value="clean">🎯 Clean Architecture</option>
                    <option value="ddd">🏛️ Domain Driven Design (DDD)</option>
                    <option value="hexagonal">
                      ⬡ Hexagonal (Ports & Adapters)
                    </option>
                    <option value="onion">🧅 Onion Architecture</option>
                  </Select>
                </FormControl>
              )}
            />

            {/* Architecture Info Card */}
            <Box
              p={5}
              bg={`${selectedArchInfo.color}.50`}
              borderWidth="1px"
              borderColor={`${selectedArchInfo.color}.200`}
              borderRadius="xl"
              borderLeftWidth="4px"
              borderLeftColor={`${selectedArchInfo.color}.400`}
            >
              <VStack align="stretch" spacing={3}>
                <HStack justify="space-between">
                  <HStack spacing={2}>
                    <Text
                      fontWeight="bold"
                      color={`${selectedArchInfo.color}.700`}
                    >
                      {watchedValues.architecture.charAt(0).toUpperCase() +
                        watchedValues.architecture.slice(1)}{" "}
                      Architecture
                    </Text>
                    <Badge
                      colorScheme={selectedArchInfo.color}
                      variant="subtle"
                    >
                      {selectedArchInfo.complexity}
                    </Badge>
                  </HStack>
                  <Badge colorScheme={selectedArchInfo.color} variant="outline">
                    {selectedArchInfo.projects} project
                    {selectedArchInfo.projects > 1 ? "s" : ""}
                  </Badge>
                </HStack>

                <Text
                  fontSize="sm"
                  color={`${selectedArchInfo.color}.600`}
                  lineHeight="1.5"
                >
                  {selectedArchInfo.description}
                </Text>
              </VStack>
            </Box>
          </VStack>

          <Divider />

          {/* Database Selection */}
          <VStack spacing={6} align="stretch">
            <HStack spacing={2}>
              <Icon as={DatabaseIcon} color="green.500" />
              <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                Database Provider
              </Text>
            </HStack>

            <Controller
              name="database"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <Select
                    {...field}
                    size="lg"
                    borderRadius="lg"
                    _focus={{
                      borderColor: "green.500",
                      boxShadow: "0 0 0 1px green.500",
                    }}
                  >
                    <option value="none">🚫 None (No Database)</option>
                    <option value="sqlserver">🔷 SQL Server</option>
                    <option value="mysql">🐬 MySQL</option>
                    <option value="postgresql">🐘 PostgreSQL</option>
                    <option value="mongodb">🍃 MongoDB</option>
                  </Select>
                </FormControl>
              )}
            />

            {/* Database Info Card */}
            {watchedValues.database && watchedValues.database !== "none" && (
              <Box
                p={4}
                bg={`${selectedDbInfo.color}.50`}
                borderWidth="1px"
                borderColor={`${selectedDbInfo.color}.200`}
                borderRadius="lg"
                borderLeftWidth="4px"
                borderLeftColor={`${selectedDbInfo.color}.400`}
              >
                <HStack spacing={3}>
                  <Text fontSize="lg">{selectedDbInfo.icon}</Text>
                  <VStack align="start" spacing={1}>
                    <Text
                      fontWeight="bold"
                      color={`${selectedDbInfo.color}.700`}
                    >
                      {selectedDbInfo.name} Selected
                    </Text>
                    <Text fontSize="sm" color={`${selectedDbInfo.color}.600`}>
                      {selectedDbInfo.description}
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            )}
          </VStack>

          <Divider />

          {/* Configuration Status */}
          <Box
            p={5}
            bg={isValid ? "green.50" : "orange.50"}
            borderWidth="1px"
            borderColor={isValid ? "green.200" : "orange.200"}
            borderRadius="xl"
            borderLeftWidth="4px"
            borderLeftColor={isValid ? "green.400" : "orange.400"}
          >
            <HStack spacing={3}>
              <Icon
                as={isValid ? CheckCircle : AlertCircle}
                color={isValid ? "green.500" : "orange.500"}
                boxSize={5}
              />
              <VStack align="start" spacing={1}>
                <Text
                  fontWeight="medium"
                  color={isValid ? "green.700" : "orange.700"}
                >
                  {isValid
                    ? "Configuration Ready!"
                    : "Configuration Incomplete"}
                </Text>
                <Text
                  fontSize="sm"
                  color={isValid ? "green.600" : "orange.600"}
                >
                  {isValid
                    ? "Your project configuration is complete and ready for the next step."
                    : "Please complete all required fields to proceed."}
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Save Button */}
          <Button
            type="submit"
            size="lg"
            bgGradient="linear(to-r, blue.400, purple.500)"
            color="white"
            borderRadius="xl"
            leftIcon={<Icon as={Zap} />}
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
              transform: "translateY(-2px)",
              shadow: "lg",
            }}
            _active={{
              transform: "translateY(0)",
            }}
            transition="all 0.2s"
            fontWeight="bold"
            letterSpacing="wide"
          >
            Save Configuration
          </Button>
        </VStack>
      </form>
    </Box>
  );
};
