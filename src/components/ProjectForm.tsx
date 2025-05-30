import React, { useEffect } from 'react';
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
  Button,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { useProjectStore } from '../store/projectStore';
import { ProjectConfig } from '../types/project';

export const ProjectForm: React.FC = () => {
  const { config, setConfig } = useProjectStore();
  const toast = useToast();
  const { control, handleSubmit, watch, reset } = useForm<ProjectConfig>({
    defaultValues: config,
  });

  // Update store when form values change (but not on initial render)
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === 'change' && value) {
        // Only update specific field that changed instead of the entire value object
        if (name) {
          const fieldUpdate = {};
          fieldUpdate[name] = value[name];
          setConfig(fieldUpdate as Partial<ProjectConfig>);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setConfig]);

  // Reset form when config changes externally
  useEffect(() => {
    reset(config);
  }, [config, reset]);

  const onSubmit = (data: ProjectConfig) => {
    setConfig(data);
    toast({
      title: 'Configuration saved',
      status: 'success',
      duration: 2000,
    });
  };

  return (
    <Box bg="white" p={6} rounded="lg" shadow="md">
      <form onSubmit={handleSubmit(onSubmit)}>
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
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    JWT Authentication
                  </Checkbox>
                )}
              />
              <Controller
                name="features.swagger"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Swagger/OpenAPI
                  </Checkbox>
                )}
              />
              <Controller
                name="features.docker"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Docker Support
                  </Checkbox>
                )}
              />
              <Controller
                name="features.testing"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Unit Testing (xUnit)
                  </Checkbox>
                )}
              />
              <Controller
                name="features.cors"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    CORS Policy
                  </Checkbox>
                )}
              />
              <Controller
                name="features.logging"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Structured Logging (Serilog)
                  </Checkbox>
                )}
              />
              <Controller
                name="features.healthChecks"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox 
                    isChecked={value}
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Health Checks
                  </Checkbox>
                )}
              />
            </VStack>
          </FormControl>

          <Button 
            type="submit" 
            colorScheme="blue" 
            size="lg" 
            bgGradient="linear(to-r, blue.400, purple.500)"
            _hover={{
              bgGradient: "linear(to-r, blue.500, purple.600)",
            }}
          >
            Save Configuration
          </Button>
        </Stack>
      </form>
    </Box>
  );
};