import { Architecture, ArchitectureInfo } from '../types/project';

export const getArchitectureInfo = (architecture: Architecture, projectName: string): ArchitectureInfo => {
  const architectures: Record<Architecture, ArchitectureInfo> = {
    default: {
      description: 'Simple monolithic structure for rapid development',
      projects: [{
        name: projectName,
        description: 'Monolithic application containing all functionality',
        folders: ['Controllers', 'Models', 'Services', 'Data']
      }]
    },
    clean: {
      description: 'Separation of concerns with dependency inversion',
      projects: [
        {
          name: `${projectName}.Domain`,
          description: 'Core business entities and interfaces',
          folders: ['Entities', 'ValueObjects', 'Interfaces'],
          dependencies: []
        },
        {
          name: `${projectName}.Application`,
          description: 'Application business rules and use cases',
          folders: ['Services', 'DTOs', 'Interfaces'],
          dependencies: [`${projectName}.Domain`]
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'External concerns and implementations',
          folders: ['Data', 'Repositories', 'Services'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`]
        },
        {
          name: `${projectName}.API`,
          description: 'API endpoints and configuration',
          folders: ['Controllers', 'Middleware', 'Extensions'],
          dependencies: [`${projectName}.Application`]
        }
      ]
    },
    ddd: {
      description: 'Rich domain modeling with bounded contexts',
      projects: [
        {
          name: `${projectName}.Domain`,
          description: 'Core domain models and business rules',
          folders: ['Aggregates', 'Entities', 'ValueObjects', 'DomainServices'],
          dependencies: []
        },
        {
          name: `${projectName}.Application`,
          description: 'Application services and use cases',
          folders: ['Commands', 'Queries', 'EventHandlers'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Shared`]
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Technical implementations and external services',
          folders: ['Persistence', 'ExternalServices', 'Messaging'],
          dependencies: [`${projectName}.Domain`, `${projectName}.Application`]
        },
        {
          name: `${projectName}.API`,
          description: 'API layer and controllers',
          folders: ['Controllers', 'DTOs', 'Filters'],
          dependencies: [`${projectName}.Application`]
        },
        {
          name: `${projectName}.Shared`,
          description: 'Shared kernel and common components',
          folders: ['Common', 'Interfaces', 'Events'],
          dependencies: []
        }
      ]
    },
    hexagonal: {
      description: 'Ports and adapters pattern for business logic isolation',
      projects: [
        {
          name: `${projectName}.Core`,
          description: 'Core business logic and ports',
          folders: ['Domain', 'Ports', 'UseCases'],
          dependencies: []
        },
        {
          name: `${projectName}.Adapters`,
          description: 'Implementation of ports (adapters)',
          folders: ['Primary', 'Secondary', 'Persistence'],
          dependencies: [`${projectName}.Core`]
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Technical infrastructure and external services',
          folders: ['Database', 'ExternalAPIs', 'FileSystem'],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`]
        },
        {
          name: `${projectName}.API`,
          description: 'Web API and DTOs',
          folders: ['Controllers', 'DTOs', 'Mappers'],
          dependencies: [`${projectName}.Core`, `${projectName}.Adapters`]
        }
      ]
    },
    onion: {
      description: 'Layered architecture with dependencies pointing inward',
      projects: [
        {
          name: `${projectName}.Core`,
          description: 'Core domain models and interfaces',
          folders: ['Entities', 'Interfaces', 'ValueObjects'],
          dependencies: []
        },
        {
          name: `${projectName}.Services`,
          description: 'Business logic and application services',
          folders: ['Services', 'Behaviors', 'DomainServices'],
          dependencies: [`${projectName}.Core`]
        },
        {
          name: `${projectName}.Infrastructure`,
          description: 'Data access and external services',
          folders: ['Data', 'ExternalServices', 'Repositories'],
          dependencies: [`${projectName}.Core`, `${projectName}.Services`]
        },
        {
          name: `${projectName}.Web`,
          description: 'Web layer and UI logic',
          folders: ['Controllers', 'ViewModels', 'Filters'],
          dependencies: [`${projectName}.Services`]
        }
      ]
    }
  };

  return architectures[architecture];
};