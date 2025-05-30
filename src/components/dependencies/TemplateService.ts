// src/services/TemplateService.ts

export interface TemplatePackage {
  id: string;
  description: string;
  version: string;
  category: string;
  essential: boolean;
}

export interface PackageTemplate {
  [projectName: string]: TemplatePackage[];
}

export class TemplateService {
  private static mockTemplates: { [key: string]: PackageTemplate } = {
    // =================== WEB API TEMPLATES ===================

    // Web API + Clean Architecture + .NET 8.0
    "webapi-clean-8.0": {
      Domain: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "MediatR.Contracts",
          description: "MediatR contracts",
          version: "2.0.1",
          category: "CQRS",
          essential: false,
        },
      ],
      Application: [
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "FluentValidation.DependencyInjectionExtensions",
          description: "FluentValidation DI extensions",
          version: "11.9.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "MediatR.Extensions.Microsoft.DependencyInjection",
          description: "MediatR DI extensions",
          version: "11.1.0",
          category: "CQRS",
          essential: true,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Microsoft.EntityFrameworkCore.Design",
          description: "EF Core design-time tools",
          version: "8.0.11",
          category: "Tools",
          essential: false,
        },
        {
          id: "Microsoft.EntityFrameworkCore.Tools",
          description: "EF Core Tools for Package Manager Console",
          version: "8.0.11",
          category: "Tools",
          essential: false,
        },
        {
          id: "Dapper",
          description: "Micro ORM for .NET",
          version: "2.1.35",
          category: "ORM",
          essential: false,
        },
        {
          id: "Polly",
          description: "Resilience and transient-fault library",
          version: "8.2.0",
          category: "Resilience",
          essential: true,
        },
        {
          id: "Serilog",
          description: "Structured logging library",
          version: "3.1.1",
          category: "Logging",
          essential: true,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "Serilog.Sinks.Console",
          description: "Serilog console sink",
          version: "5.0.1",
          category: "Logging",
          essential: false,
        },
        {
          id: "Serilog.Sinks.File",
          description: "Serilog file sink",
          version: "5.0.0",
          category: "Logging",
          essential: false,
        },
      ],
      API: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Cors",
          description: "CORS support",
          version: "2.2.0",
          category: "Security",
          essential: false,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.OpenApi",
          description: "OpenAPI support for ASP.NET Core",
          version: "8.0.11",
          category: "Documentation",
          essential: false,
        },
      ],
    },

    // Web API + DDD + .NET 8.0
    "webapi-ddd-8.0": {
      Domain: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "MediatR.Contracts",
          description: "MediatR contracts",
          version: "2.0.1",
          category: "CQRS",
          essential: false,
        },
      ],
      Application: [
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR.Extensions.Microsoft.DependencyInjection",
          description: "MediatR DI extensions",
          version: "11.1.0",
          category: "CQRS",
          essential: true,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Microsoft.EntityFrameworkCore.Tools",
          description: "EF Core Tools for Package Manager Console",
          version: "8.0.11",
          category: "Tools",
          essential: false,
        },
        {
          id: "MassTransit",
          description: "Distributed application framework",
          version: "8.1.3",
          category: "Messaging",
          essential: false,
        },
        {
          id: "MassTransit.RabbitMQ",
          description: "RabbitMQ transport for MassTransit",
          version: "8.1.3",
          category: "Messaging",
          essential: false,
        },
        {
          id: "Polly",
          description: "Resilience and transient-fault library",
          version: "8.2.0",
          category: "Resilience",
          essential: true,
        },
        {
          id: "Serilog",
          description: "Structured logging library",
          version: "3.1.1",
          category: "Logging",
          essential: true,
        },
        {
          id: "Serilog.Sinks.Console",
          description: "Serilog console sink",
          version: "5.0.1",
          category: "Logging",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
      ],
      API: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Carter",
          description: "Minimal API framework",
          version: "7.2.0",
          category: "Framework",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.OpenApi",
          description: "OpenAPI support for ASP.NET Core",
          version: "8.0.11",
          category: "Documentation",
          essential: false,
        },
      ],
      Shared: [
        {
          id: "MediatR.Contracts",
          description: "MediatR contracts",
          version: "2.0.1",
          category: "CQRS",
          essential: true,
        },
        {
          id: "FluentResults",
          description: "Result pattern implementation",
          version: "3.15.2",
          category: "Patterns",
          essential: false,
        },
        {
          id: "System.Text.Json",
          description: "High-performance JSON framework",
          version: "8.0.5",
          category: "Serialization",
          essential: false,
        },
      ],
    },

    // Web API + Hexagonal + .NET 8.0
    "webapi-hexagonal-8.0": {
      Core: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "FluentResults",
          description: "Result pattern implementation",
          version: "3.15.2",
          category: "Patterns",
          essential: false,
        },
      ],
      Adapters: [
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "Polly",
          description: "Resilience and transient-fault library",
          version: "8.2.0",
          category: "Resilience",
          essential: true,
        },
        {
          id: "Microsoft.Extensions.Http.Polly",
          description: "Polly integration for HttpClient",
          version: "8.0.11",
          category: "Resilience",
          essential: false,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "Microsoft.Extensions.Caching.StackExchangeRedis",
          description: "Redis cache provider",
          version: "8.0.11",
          category: "Caching",
          essential: false,
        },
      ],
      API: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "AutoMapper.Extensions.Microsoft.DependencyInjection",
          description: "AutoMapper DI extensions",
          version: "12.0.1",
          category: "Mapping",
          essential: false,
        },
      ],
    },

    // Web API + Onion + .NET 8.0
    "webapi-onion-8.0": {
      Core: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "System.ComponentModel.Annotations",
          description: "Data annotations",
          version: "5.0.0",
          category: "Validation",
          essential: false,
        },
      ],
      Services: [
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "FluentValidation.DependencyInjectionExtensions",
          description: "FluentValidation DI extensions",
          version: "11.9.0",
          category: "Validation",
          essential: false,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Microsoft.Extensions.Identity.Core",
          description: "Identity core functionality",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
      ],
      Web: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
      ],
    },

    // Web API + Default (Monolith) + .NET 8.0
    "webapi-default-8.0": {
      MonolithProject: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Microsoft.EntityFrameworkCore.InMemory",
          description: "In-memory database provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "BCrypt.Net-Next",
          description: "BCrypt hashing library",
          version: "4.0.3",
          category: "Security",
          essential: false,
        },
        {
          id: "System.IdentityModel.Tokens.Jwt",
          description: "JWT token handling",
          version: "8.1.2",
          category: "Security",
          essential: false,
        },
      ],
    },

    // =================== .NET 7.0 TEMPLATES ===================

    "webapi-clean-7.0": {
      Domain: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.8.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.1.1",
          category: "CQRS",
          essential: true,
        },
      ],
      Application: [
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.1.1",
          category: "CQRS",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.8.0",
          category: "Validation",
          essential: true,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "7.0.20",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "7.0.20",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "7.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "Polly",
          description: "Resilience and transient-fault library",
          version: "7.2.4",
          category: "Resilience",
          essential: true,
        },
      ],
      API: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Authentication.JwtBearer",
          description: "JWT Bearer authentication",
          version: "7.0.20",
          category: "Security",
          essential: false,
        },
      ],
    },

    "webapi-default-7.0": {
      MonolithProject: [
        {
          id: "Swashbuckle.AspNetCore",
          description: "Swagger tools for ASP.NET Core",
          version: "6.5.0",
          category: "Documentation",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "7.0.20",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "7.0.20",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "7.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: false,
        },
      ],
    },

    // =================== MVC TEMPLATES ===================

    "mvc-default-8.0": {
      MVCProject: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
          description: "Identity with EF Core",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Identity.UI",
          description: "Identity UI components",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: false,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "X.PagedList.Mvc.Core",
          description: "Paging library for MVC",
          version: "8.4.7",
          category: "UI",
          essential: false,
        },
      ],
    },

    "mvc-clean-8.0": {
      Domain: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
      ],
      Application: [
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
      ],
      Web: [
        {
          id: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
          description: "Identity with EF Core",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Identity.UI",
          description: "Identity UI components",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "FluentValidation.AspNetCore",
          description: "FluentValidation ASP.NET Core integration",
          version: "11.3.0",
          category: "Validation",
          essential: false,
        },
        {
          id: "X.PagedList.Mvc.Core",
          description: "Paging library for MVC",
          version: "8.4.7",
          category: "UI",
          essential: false,
        },
      ],
    },

    // =================== BLAZOR TEMPLATES ===================

    "blazor-default-8.0": {
      BlazorProject: [
        {
          id: "Microsoft.AspNetCore.Components.WebAssembly",
          description: "Blazor WebAssembly",
          version: "8.0.11",
          category: "Framework",
          essential: true,
        },
        {
          id: "Microsoft.AspNetCore.Components.WebAssembly.DevServer",
          description: "Blazor dev server",
          version: "8.0.11",
          category: "Tools",
          essential: false,
        },
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: false,
        },
        {
          id: "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
          description: "Identity with EF Core",
          version: "8.0.11",
          category: "Security",
          essential: false,
        },
        {
          id: "Blazored.LocalStorage",
          description: "Local storage for Blazor",
          version: "4.5.0",
          category: "Storage",
          essential: false,
        },
        {
          id: "Blazored.Toast",
          description: "Toast notifications for Blazor",
          version: "4.2.1",
          category: "UI",
          essential: false,
        },
        {
          id: "MudBlazor",
          description: "Material Design components for Blazor",
          version: "6.19.1",
          category: "UI",
          essential: false,
        },
      ],
    },

    "blazor-clean-8.0": {
      Domain: [
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
      ],
      Application: [
        {
          id: "MediatR",
          description: "Mediator pattern implementation",
          version: "12.2.0",
          category: "CQRS",
          essential: true,
        },
        {
          id: "AutoMapper",
          description: "Object-to-object mapping",
          version: "12.0.1",
          category: "Mapping",
          essential: true,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: true,
        },
      ],
      Infrastructure: [
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore.SqlServer",
          description: "SQL Server provider for EF Core",
          version: "8.0.11",
          category: "Database",
          essential: false,
        },
        {
          id: "Serilog.AspNetCore",
          description: "Serilog integration for ASP.NET Core",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
      ],
      Blazor: [
        {
          id: "Microsoft.AspNetCore.Components.WebAssembly",
          description: "Blazor WebAssembly",
          version: "8.0.11",
          category: "Framework",
          essential: true,
        },
        {
          id: "MudBlazor",
          description: "Material Design components for Blazor",
          version: "6.19.1",
          category: "UI",
          essential: false,
        },
        {
          id: "Blazored.LocalStorage",
          description: "Local storage for Blazor",
          version: "4.5.0",
          category: "Storage",
          essential: false,
        },
        {
          id: "FluentValidation.Blazor",
          description: "FluentValidation for Blazor",
          version: "2.1.0",
          category: "Validation",
          essential: false,
        },
      ],
    },

    // =================== CONSOLE APP TEMPLATES ===================

    "console-default-8.0": {
      ConsoleProject: [
        {
          id: "Microsoft.Extensions.Hosting",
          description: "Generic host for console apps",
          version: "8.0.11",
          category: "Framework",
          essential: true,
        },
        {
          id: "Microsoft.Extensions.DependencyInjection",
          description: "Dependency injection container",
          version: "8.0.11",
          category: "Framework",
          essential: true,
        },
        {
          id: "Microsoft.Extensions.Configuration",
          description: "Configuration framework",
          version: "8.0.11",
          category: "Configuration",
          essential: true,
        },
        {
          id: "Microsoft.Extensions.Configuration.Json",
          description: "JSON configuration provider",
          version: "8.0.11",
          category: "Configuration",
          essential: false,
        },
        {
          id: "Serilog.Extensions.Hosting",
          description: "Serilog integration for hosting",
          version: "8.0.0",
          category: "Logging",
          essential: true,
        },
        {
          id: "Serilog.Sinks.Console",
          description: "Serilog console sink",
          version: "5.0.1",
          category: "Logging",
          essential: true,
        },
        {
          id: "Microsoft.EntityFrameworkCore",
          description: "Entity Framework Core",
          version: "8.0.11",
          category: "ORM",
          essential: false,
        },
      ],
    },

    // =================== CLASS LIBRARY TEMPLATES ===================

    "classlib-default-8.0": {
      ClassLibrary: [
        {
          id: "Microsoft.Extensions.DependencyInjection.Abstractions",
          description: "DI abstractions",
          version: "8.0.11",
          category: "Framework",
          essential: false,
        },
        {
          id: "Microsoft.Extensions.Logging.Abstractions",
          description: "Logging abstractions",
          version: "8.0.11",
          category: "Logging",
          essential: false,
        },
        {
          id: "Microsoft.Extensions.Configuration.Abstractions",
          description: "Configuration abstractions",
          version: "8.0.11",
          category: "Configuration",
          essential: false,
        },
        {
          id: "System.Text.Json",
          description: "High-performance JSON framework",
          version: "8.0.5",
          category: "Serialization",
          essential: false,
        },
        {
          id: "FluentValidation",
          description: "Validation library for .NET",
          version: "11.9.0",
          category: "Validation",
          essential: false,
        },
      ],
    },
  };

  /**
   * Obtiene las plantillas recomendadas para un proyecto específico
   * En el futuro, esto será reemplazado por una llamada a la API del backend
   */
  static getRecommendedTemplates(
    projectType: string,
    architecture: string,
    dotnetVersion: string,
    database: string = "none"
  ): PackageTemplate {
    const key = `${projectType}-${architecture}-${dotnetVersion}`;
    const baseTemplate = this.mockTemplates[key];

    // Fallback logic for unsupported combinations
    if (!baseTemplate) {
      const fallbackKey = `${projectType}-default-${dotnetVersion}`;
      const fallbackTemplate = this.mockTemplates[fallbackKey] || {};
      return this.addDatabasePackages(
        fallbackTemplate,
        database,
        dotnetVersion
      );
    }

    return this.addDatabasePackages(baseTemplate, database, dotnetVersion);
  }

  /**
   * Agrega paquetes específicos de base de datos a las plantillas
   */
  private static addDatabasePackages(
    template: PackageTemplate,
    database: string,
    dotnetVersion: string
  ): PackageTemplate {
    if (database === "none") return template;

    const enhancedTemplate = JSON.parse(JSON.stringify(template)); // Deep clone
    const databasePackages = this.getDatabasePackages(database, dotnetVersion);

    // Agregar paquetes de BD a proyectos de infraestructura
    Object.keys(enhancedTemplate).forEach((projectName) => {
      const isInfrastructure =
        projectName.includes("Infrastructure") ||
        projectName.includes("MonolithProject") ||
        projectName.includes("Data");

      if (isInfrastructure) {
        enhancedTemplate[projectName] = [
          ...enhancedTemplate[projectName],
          ...databasePackages,
        ];
      }
    });

    return enhancedTemplate;
  }

  /**
   * Obtiene los paquetes específicos para cada base de datos
   */
  private static getDatabasePackages(
    database: string,
    dotnetVersion: string
  ): TemplatePackage[] {
    const databasePackages: {
      [key: string]: { [version: string]: TemplatePackage[] };
    } = {
      sqlserver: {
        "8.0": [
          {
            id: "Microsoft.EntityFrameworkCore.SqlServer",
            description: "SQL Server provider for EF Core",
            version: "8.0.11",
            category: "Database",
            essential: true,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "8.0.11",
            category: "Tools",
            essential: false,
          },
        ],
        "7.0": [
          {
            id: "Microsoft.EntityFrameworkCore.SqlServer",
            description: "SQL Server provider for EF Core",
            version: "7.0.20",
            category: "Database",
            essential: true,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "7.0.20",
            category: "Tools",
            essential: false,
          },
        ],
      },
      mysql: {
        "8.0": [
          {
            id: "Pomelo.EntityFrameworkCore.MySql",
            description: "MySQL provider for EF Core",
            version: "8.0.2",
            category: "Database",
            essential: true,
          },
          {
            id: "MySqlConnector",
            description: "High-performance MySQL connector",
            version: "2.3.5",
            category: "Database",
            essential: false,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "8.0.11",
            category: "Tools",
            essential: false,
          },
        ],
        "7.0": [
          {
            id: "Pomelo.EntityFrameworkCore.MySql",
            description: "MySQL provider for EF Core",
            version: "7.0.0",
            category: "Database",
            essential: true,
          },
          {
            id: "MySqlConnector",
            description: "High-performance MySQL connector",
            version: "2.3.5",
            category: "Database",
            essential: false,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "7.0.20",
            category: "Tools",
            essential: false,
          },
        ],
      },
      postgresql: {
        "8.0": [
          {
            id: "Npgsql.EntityFrameworkCore.PostgreSQL",
            description: "PostgreSQL provider for EF Core",
            version: "8.0.10",
            category: "Database",
            essential: true,
          },
          {
            id: "Npgsql",
            description: "PostgreSQL .NET data provider",
            version: "8.0.5",
            category: "Database",
            essential: false,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "8.0.11",
            category: "Tools",
            essential: false,
          },
        ],
        "7.0": [
          {
            id: "Npgsql.EntityFrameworkCore.PostgreSQL",
            description: "PostgreSQL provider for EF Core",
            version: "7.0.18",
            category: "Database",
            essential: true,
          },
          {
            id: "Npgsql",
            description: "PostgreSQL .NET data provider",
            version: "7.0.7",
            category: "Database",
            essential: false,
          },
          {
            id: "Microsoft.EntityFrameworkCore.Tools",
            description: "EF Core Tools for Package Manager Console",
            version: "7.0.20",
            category: "Tools",
            essential: false,
          },
        ],
      },
      mongodb: {
        "8.0": [
          {
            id: "MongoDB.Driver",
            description: "Official MongoDB C# driver",
            version: "2.28.0",
            category: "Database",
            essential: true,
          },
          {
            id: "MongoDB.Bson",
            description: "MongoDB BSON library",
            version: "2.28.0",
            category: "Database",
            essential: true,
          },
          {
            id: "MongoDB.Driver.GridFS",
            description: "MongoDB GridFS support",
            version: "2.28.0",
            category: "Database",
            essential: false,
          },
          {
            id: "MongoFramework",
            description: "Entity Framework-like interface for MongoDB",
            version: "0.30.0",
            category: "Database",
            essential: false,
          },
        ],
        "7.0": [
          {
            id: "MongoDB.Driver",
            description: "Official MongoDB C# driver",
            version: "2.25.0",
            category: "Database",
            essential: true,
          },
          {
            id: "MongoDB.Bson",
            description: "MongoDB BSON library",
            version: "2.25.0",
            category: "Database",
            essential: true,
          },
          {
            id: "MongoDB.Driver.GridFS",
            description: "MongoDB GridFS support",
            version: "2.25.0",
            category: "Database",
            essential: false,
          },
          {
            id: "MongoFramework",
            description: "Entity Framework-like interface for MongoDB",
            version: "0.30.0",
            category: "Database",
            essential: false,
          },
        ],
      },
    };

    const dbPackages = databasePackages[database];
    if (!dbPackages) return [];

    return dbPackages[dotnetVersion] || dbPackages["8.0"] || [];
  }

  /**
   * Obtiene las versiones disponibles para un paquete específico
   * Filtra por compatibilidad con la versión de .NET
   */
  static getCompatibleVersions(
    packageId: string,
    dotnetVersion: string
  ): string[] {
    const versionCompatibility: {
      [key: string]: { [version: string]: string[] };
    } = {
      "Microsoft.EntityFrameworkCore": {
        "8.0": ["8.0.11", "8.0.10", "8.0.8", "8.0.7"],
        "7.0": ["7.0.20", "7.0.18", "7.0.15", "7.0.14"],
        "6.0": ["6.0.33", "6.0.31", "6.0.28", "6.0.25"],
      },
      FluentValidation: {
        "8.0": ["11.9.0", "11.8.1", "11.8.0", "11.7.1"],
        "7.0": ["11.8.0", "11.7.1", "11.7.0", "11.6.0"],
        "6.0": ["11.7.1", "11.6.0", "11.5.2", "11.5.1"],
      },
      MediatR: {
        "8.0": ["12.2.0", "12.1.1", "12.1.0", "12.0.1"],
        "7.0": ["12.1.1", "12.1.0", "12.0.1", "11.1.0"],
        "6.0": ["12.0.1", "11.1.0", "11.0.0", "10.0.1"],
      },
      AutoMapper: {
        "8.0": ["12.0.1", "12.0.0", "11.0.1", "11.0.0"],
        "7.0": ["12.0.1", "12.0.0", "11.0.1", "11.0.0"],
        "6.0": ["12.0.1", "11.0.1", "11.0.0", "10.1.1"],
      },
      "Swashbuckle.AspNetCore": {
        "8.0": ["6.5.0", "6.4.0", "6.3.1", "6.3.0"],
        "7.0": ["6.5.0", "6.4.0", "6.3.1", "6.3.0"],
        "6.0": ["6.5.0", "6.4.0", "6.3.1", "6.2.3"],
      },
      "Serilog.AspNetCore": {
        "8.0": ["8.0.0", "7.0.0", "6.1.0", "6.0.1"],
        "7.0": ["7.0.0", "6.1.0", "6.0.1", "6.0.0"],
        "6.0": ["6.1.0", "6.0.1", "6.0.0", "5.0.0"],
      },
      Polly: {
        "8.0": ["8.2.0", "8.1.0", "8.0.0", "7.2.4"],
        "7.0": ["7.2.4", "7.2.3", "7.2.2", "7.2.1"],
        "6.0": ["7.2.4", "7.2.3", "7.2.2", "7.2.1"],
      },
      "Microsoft.AspNetCore.Authentication.JwtBearer": {
        "8.0": ["8.0.11", "8.0.10", "8.0.8", "8.0.7"],
        "7.0": ["7.0.20", "7.0.18", "7.0.15", "7.0.14"],
        "6.0": ["6.0.33", "6.0.31", "6.0.28", "6.0.25"],
      },
      "BCrypt.Net-Next": {
        "8.0": ["4.0.3", "4.0.2", "4.0.1", "4.0.0"],
        "7.0": ["4.0.3", "4.0.2", "4.0.1", "4.0.0"],
        "6.0": ["4.0.3", "4.0.2", "4.0.1", "4.0.0"],
      },
      MassTransit: {
        "8.0": ["8.1.3", "8.1.2", "8.1.1", "8.1.0"],
        "7.0": ["8.1.3", "8.1.2", "8.1.1", "8.0.16"],
        "6.0": ["8.0.16", "8.0.15", "8.0.14", "7.3.1"],
      },
      Dapper: {
        "8.0": ["2.1.35", "2.1.28", "2.1.24", "2.1.21"],
        "7.0": ["2.1.35", "2.1.28", "2.1.24", "2.1.21"],
        "6.0": ["2.1.35", "2.1.28", "2.1.24", "2.1.21"],
      },
      Carter: {
        "8.0": ["7.2.0", "7.1.0", "7.0.0", "6.2.0"],
        "7.0": ["7.2.0", "7.1.0", "7.0.0", "6.2.0"],
        "6.0": ["6.2.0", "6.1.0", "6.0.0", "5.4.0"],
      },
      FluentResults: {
        "8.0": ["3.15.2", "3.15.1", "3.15.0", "3.14.0"],
        "7.0": ["3.15.2", "3.15.1", "3.15.0", "3.14.0"],
        "6.0": ["3.15.2", "3.15.1", "3.15.0", "3.14.0"],
      },
      "Microsoft.AspNetCore.Components.WebAssembly": {
        "8.0": ["8.0.11", "8.0.10", "8.0.8", "8.0.7"],
        "7.0": ["7.0.20", "7.0.18", "7.0.15", "7.0.14"],
        "6.0": ["6.0.33", "6.0.31", "6.0.28", "6.0.25"],
      },
      MudBlazor: {
        "8.0": ["6.19.1", "6.18.0", "6.17.0", "6.16.0"],
        "7.0": ["6.19.1", "6.18.0", "6.17.0", "6.16.0"],
        "6.0": ["6.19.1", "6.18.0", "6.17.0", "6.16.0"],
      },
      "Blazored.LocalStorage": {
        "8.0": ["4.5.0", "4.4.0", "4.3.0", "4.2.0"],
        "7.0": ["4.5.0", "4.4.0", "4.3.0", "4.2.0"],
        "6.0": ["4.5.0", "4.4.0", "4.3.0", "4.2.0"],
      },
      "Microsoft.Extensions.Hosting": {
        "8.0": ["8.0.11", "8.0.10", "8.0.8", "8.0.7"],
        "7.0": ["7.0.20", "7.0.18", "7.0.15", "7.0.14"],
        "6.0": ["6.0.33", "6.0.31", "6.0.28", "6.0.25"],
      },
    };

    const packageVersions = versionCompatibility[packageId];
    if (!packageVersions) return [];

    return packageVersions[dotnetVersion] || [];
  }

  /**
   * Obtiene la versión más reciente compatible para un paquete y versión de .NET
   */
  static getLatestCompatibleVersion(
    packageId: string,
    dotnetVersion: string
  ): string | null {
    const versions = this.getCompatibleVersions(packageId, dotnetVersion);
    return versions.length > 0 ? versions[0] : null;
  }

  /**
   * Valida si una versión específica es compatible con la versión de .NET
   */
  static isVersionCompatible(
    packageId: string,
    packageVersion: string,
    dotnetVersion: string
  ): boolean {
    const compatibleVersions = this.getCompatibleVersions(
      packageId,
      dotnetVersion
    );
    return compatibleVersions.includes(packageVersion);
  }

  /**
   * Obtiene estadísticas de las plantillas disponibles
   */
  static getTemplateStats(): {
    totalTemplates: number;
    supportedProjectTypes: string[];
    supportedArchitectures: string[];
    supportedDotNetVersions: string[];
  } {
    const keys = Object.keys(this.mockTemplates);
    const projectTypes = new Set<string>();
    const architectures = new Set<string>();
    const dotnetVersions = new Set<string>();

    keys.forEach((key) => {
      const [projectType, architecture, version] = key.split("-");
      projectTypes.add(projectType);
      architectures.add(architecture);
      dotnetVersions.add(version);
    });

    return {
      totalTemplates: keys.length,
      supportedProjectTypes: Array.from(projectTypes),
      supportedArchitectures: Array.from(architectures),
      supportedDotNetVersions: Array.from(dotnetVersions),
    };
  }

  /**
   * Verifica si existe una plantilla para una combinación específica
   */
  static hasTemplate(
    projectType: string,
    architecture: string,
    dotnetVersion: string
  ): boolean {
    const key = `${projectType}-${architecture}-${dotnetVersion}`;
    return key in this.mockTemplates;
  }

  /**
   * Obtiene todas las plantillas disponibles (para debugging o admin)
   */
  static getAllTemplates(): { [key: string]: PackageTemplate } {
    return this.mockTemplates;
  }

  /**
   * Busca paquetes por categoría en todas las plantillas
   */
  static searchPackagesByCategory(category: string): TemplatePackage[] {
    const allPackages: TemplatePackage[] = [];
    const uniquePackages = new Map<string, TemplatePackage>();

    Object.values(this.mockTemplates).forEach((template) => {
      Object.values(template).forEach((packages) => {
        packages.forEach((pkg) => {
          if (pkg.category.toLowerCase().includes(category.toLowerCase())) {
            uniquePackages.set(pkg.id, pkg);
          }
        });
      });
    });

    return Array.from(uniquePackages.values());
  }

  /**
   * Obtiene paquetes recomendados por nivel de importancia
   */
  static getEssentialPackages(
    projectType: string,
    architecture: string,
    dotnetVersion: string
  ): TemplatePackage[] {
    const template = this.getRecommendedTemplates(
      projectType,
      architecture,
      dotnetVersion
    );
    const essentialPackages: TemplatePackage[] = [];

    Object.values(template).forEach((packages) => {
      packages.forEach((pkg) => {
        if (pkg.essential) {
          essentialPackages.push(pkg);
        }
      });
    });

    return essentialPackages;
  }

  /**
   * Actualiza las versiones de paquetes para compatibilidad
   * (Simulación de lo que haría el backend)
   */
  static updatePackageVersionsForCompatibility(
    packages: TemplatePackage[],
    dotnetVersion: string
  ): TemplatePackage[] {
    return packages.map((pkg) => {
      const latestCompatible = this.getLatestCompatibleVersion(
        pkg.id,
        dotnetVersion
      );
      return {
        ...pkg,
        version: latestCompatible || pkg.version,
      };
    });
  }
}

export const templateService = new TemplateService();
