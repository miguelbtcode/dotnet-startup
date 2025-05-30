import React from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Checkbox,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useProjectStore } from '../store/projectStore';
import { ProjectConfig } from '../types/project';

export const ProjectForm: React.FC = () => {
  const { config, setConfig } = useProjectStore();
  const toast = useToast();
  const { control, handleSubmit } = useForm<ProjectConfig>({
    defaultValues: config,
  });

  const onSubmit = (data: ProjectConfig) => {
    setConfig(data);
    toast({
      title: 'Configuration updated',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} p={6} bg="white" rounded="lg" shadow="md">
      <Stack spacing={4}>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'Project name is required' }}
          render={({ field, fieldState }) => (
            <FormControl isInvalid={!!fieldState.error}>
              <FormLabel>Project Name</FormLabel>
              <Input {...field} placeholder="MyAwesomeProject" />
            </FormControl>
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Project Type</FormLabel>
              <Select {...field}>
                <option value="webapi">Web API</option>
                <option value="mvc">MVC</option>
                <option value="blazor">Blazor</option>
                <option value="console">Console App</option>
                <option value="classlib">Class Library</option>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="dotnetVersion"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>.NET Version</FormLabel>
              <Select {...field}>
                <option value="6.0">.NET 6.0</option>
                <option value="7.0">.NET 7.0</option>
                <option value="8.0">.NET 8.0</option>
                <option value="9.0">.NET 9.0</option>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="architecture"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Architecture</FormLabel>
              <Select {...field}>
                <option value="default">Default</option>
                <option value="clean">Clean Architecture</option>
                <option value="ddd">DDD</option>
                <option value="hexagonal">Hexagonal</option>
                <option value="onion">Onion</option>
              </Select>
            </FormControl>
          )}
        />

        <Controller
          name="database"
          control={control}
          render={({ field }) => (
            <FormControl>
              <FormLabel>Database</FormLabel>
              <Select {...field}>
                <option value="sqlserver">SQL Server</option>
                <option value="postgresql">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
                <option value="inmemory">In Memory</option>
                <option value="none">None</option>
              </Select>
            </FormControl>
          )}
        />

        <FormControl>
          <FormLabel>Features</FormLabel>
          <VStack align="start" spacing={2}>
            <Controller
              name="features.jwt"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  JWT Authentication
                </Checkbox>
              )}
            />
            <Controller
              name="features.swagger"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  Swagger/OpenAPI
                </Checkbox>
              )}
            />
            <Controller
              name="features.docker"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  Docker Support
                </Checkbox>
              )}
            />
            <Controller
              name="features.testing"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  Unit Testing (xUnit)
                </Checkbox>
              )}
            />
            <Controller
              name="features.cors"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  CORS Policy
                </Checkbox>
              )}
            />
            <Controller
              name="features.logging"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  Structured Logging (Serilog)
                </Checkbox>
              )}
            />
            <Controller
              name="features.healthChecks"
              control={control}
              render={({ field }) => (
                <Checkbox {...field} isChecked={field.value}>
                  Health Checks
                </Checkbox>
              )}
            />
          </VStack>
        </FormControl>
      </Stack>
    </Box>
  );
};