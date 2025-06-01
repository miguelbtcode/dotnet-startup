// src/data/enhancedFeatures.ts
import { FeatureGroup } from "../types/features";

export const enhancedFeatureGroups: FeatureGroup[] = [
  // Security & Authentication
  {
    id: "authentication",
    title: "Authentication & Authorization",
    description: "Configure user authentication and authorization mechanisms",
    icon: "Shield",
    category: "security",
    allowMultiple: false,
    options: [
      {
        id: "none",
        title: "No Authentication",
        description: "No authentication system",
        complexity: "Beginner",
        category: "security",
        pros: ["Simple setup", "No additional dependencies"],
        cons: ["No security", "Not suitable for production"],
        nugetPackages: [],
        configFiles: [],
      },
      {
        id: "jwt",
        title: "JWT Bearer Authentication",
        description: "JSON Web Token based authentication with Bearer tokens",
        complexity: "Intermediate",
        category: "security",
        pros: [
          "Stateless authentication",
          "Scalable across services",
          "Industry standard",
          "Mobile-friendly",
        ],
        cons: [
          "Token management complexity",
          "Need secure token storage",
          "Logout handling challenges",
        ],
        isRecommended: true,
        nugetPackages: [
          "Microsoft.AspNetCore.Authentication.JwtBearer",
          "System.IdentityModel.Tokens.Jwt",
          "Microsoft.IdentityModel.Tokens",
        ],
        configFiles: ["appsettings.json", "JwtSettings.cs"],
        codeExamples: [
          {
            title: "JWT Configuration",
            language: "csharp",
            filename: "Program.cs",
            code: `builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });`,
          },
          {
            title: "JWT Settings",
            language: "json",
            filename: "appsettings.json",
            code: `{
  "Jwt": {
    "Key": "your-secret-key-here-should-be-at-least-256-bits",
    "Issuer": "your-app-name",
    "Audience": "your-app-users",
    "ExpirationInMinutes": 60
  }
}`,
          },
        ],
      },
      {
        id: "identity",
        title: "ASP.NET Core Identity",
        description: "Full-featured identity system with user management",
        complexity: "Advanced",
        category: "security",
        pros: [
          "Complete user management",
          "Built-in UI components",
          "Role-based authorization",
          "Two-factor authentication support",
        ],
        cons: [
          "More complex setup",
          "Database dependency",
          "Less flexibility for custom requirements",
        ],
        nugetPackages: [
          "Microsoft.AspNetCore.Identity.EntityFrameworkCore",
          "Microsoft.AspNetCore.Identity.UI",
        ],
        configFiles: ["IdentityDbContext.cs", "IdentityConfiguration.cs"],
        architectureRestrictions: ["default"], // Not recommended for microservices
      },
    ],
  },

  // API Documentation
  {
    id: "documentation",
    title: "API Documentation",
    description: "Interactive API documentation and testing interfaces",
    icon: "FileText",
    category: "documentation",
    allowMultiple: true,
    options: [
      {
        id: "swagger",
        title: "Swagger/OpenAPI (Basic)",
        description: "Standard Swagger UI with basic OpenAPI specification",
        complexity: "Beginner",
        category: "documentation",
        pros: [
          "Industry standard",
          "Easy to implement",
          "Good browser support",
          "Automatic schema generation",
        ],
        cons: [
          "Basic UI design",
          "Limited customization",
          "Can be slow with large APIs",
        ],
        isRecommended: true,
        nugetPackages: [
          "Swashbuckle.AspNetCore",
          "Microsoft.AspNetCore.OpenApi",
        ],
        configFiles: ["SwaggerConfiguration.cs"],
        codeExamples: [
          {
            title: "Basic Swagger Setup",
            language: "csharp",
            filename: "Program.cs",
            code: `builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "My API", 
        Version = "v1",
        Description = "API documentation for my application"
    });
});

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty; // Serve at root
    });
}`,
          },
        ],
      },
      {
        id: "swagger_extended",
        title: "Swagger/OpenAPI (Extended)",
        description:
          "Enhanced Swagger with authentication, XML comments, and custom themes",
        complexity: "Intermediate",
        category: "documentation",
        pros: [
          "Rich documentation features",
          "Authentication integration",
          "XML comments support",
          "Custom themes available",
        ],
        cons: [
          "More configuration required",
          "Larger bundle size",
          "More maintenance overhead",
        ],
        nugetPackages: [
          "Swashbuckle.AspNetCore",
          "Swashbuckle.AspNetCore.Annotations",
          "Swashbuckle.AspNetCore.Filters",
        ],
        configFiles: ["SwaggerConfiguration.cs", "SwaggerFilters.cs"],
        dependencies: ["authentication"],
      },
      {
        id: "scalar",
        title: "Scalar Documentation",
        description: "Modern, fast API documentation with beautiful UI",
        complexity: "Intermediate",
        category: "documentation",
        pros: [
          "Modern and beautiful UI",
          "Excellent performance",
          "Better user experience",
          "Advanced search capabilities",
        ],
        cons: [
          "Newer technology",
          "Less widespread adoption",
          "Fewer community resources",
        ],
        nugetPackages: ["Scalar.AspNetCore"],
        configFiles: ["ScalarConfiguration.cs"],
        codeExamples: [
          {
            title: "Scalar Setup",
            language: "csharp",
            filename: "Program.cs",
            code: `builder.Services.AddOpenApi();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference(options =>
    {
        options.WithTitle("My API Documentation")
               .WithTheme(ScalarTheme.Purple)
               .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
    });
}`,
          },
        ],
      },
    ],
  },

  // Architecture Patterns
  {
    id: "cqrs",
    title: "CQRS Implementation",
    description:
      "Command Query Responsibility Segregation pattern implementation",
    icon: "GitBranch",
    category: "patterns",
    allowMultiple: false,
    showWhen: (selectedFeatures, architecture) => {
      return ["clean", "ddd", "hexagonal", "onion"].includes(architecture);
    },
    options: [
      {
        id: "mediatr",
        title: "MediatR",
        description:
          "Simple mediator pattern implementation with pipeline behaviors",
        complexity: "Intermediate",
        category: "patterns",
        pros: [
          "Simple and clean implementation",
          "Pipeline behaviors support",
          "Great community support",
          "Easy testing",
        ],
        cons: [
          "Additional abstraction layer",
          "Performance overhead",
          "Learning curve for beginners",
        ],
        isRecommended: true,
        nugetPackages: [
          "MediatR",
          "MediatR.Extensions.Microsoft.DependencyInjection",
        ],
        configFiles: ["MediatRConfiguration.cs"],
        codeExamples: [
          {
            title: "Command Handler Example",
            language: "csharp",
            filename: "CreateOrderHandler.cs",
            code: `public record CreateOrderCommand(string CustomerId, decimal Amount) : IRequest<int>;

public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, int>
{
    private readonly IOrderRepository _orderRepository;
    
    public CreateOrderHandler(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }
    
    public async Task<int> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        var order = new Order
        {
            CustomerId = request.CustomerId,
            Amount = request.Amount,
            CreatedAt = DateTime.UtcNow
        };
        
        return await _orderRepository.CreateAsync(order, cancellationToken);
    }
}`,
          },
        ],
      },
      {
        id: "decorators",
        title: "Manual with Decorators",
        description:
          "Custom CQRS implementation with decorator pattern for cross-cutting concerns",
        complexity: "Advanced",
        category: "patterns",
        pros: [
          "Full control over implementation",
          "Custom optimization possible",
          "No external dependencies",
          "Better performance",
        ],
        cons: [
          "More boilerplate code",
          "Need to maintain infrastructure",
          "Higher development time",
          "More testing required",
        ],
        nugetPackages: [],
        configFiles: [
          "CommandDispatcher.cs",
          "QueryDispatcher.cs",
          "Decorators/",
        ],
        codeExamples: [
          {
            title: "Command Dispatcher",
            language: "csharp",
            filename: "CommandDispatcher.cs",
            code: `public interface ICommandDispatcher
{
    Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default);
}

public class CommandDispatcher : ICommandDispatcher
{
    private readonly IServiceProvider _serviceProvider;
    
    public CommandDispatcher(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }
    
    public async Task<TResult> DispatchAsync<TResult>(ICommand<TResult> command, CancellationToken cancellationToken = default)
    {
        var handlerType = typeof(ICommandHandler<,>).MakeGenericType(command.GetType(), typeof(TResult));
        var handler = _serviceProvider.GetRequiredService(handlerType);
        
        var method = handlerType.GetMethod("HandleAsync");
        var result = method.Invoke(handler, new object[] { command, cancellationToken });
        
        return await (Task<TResult>)result;
    }
}`,
          },
        ],
      },
    ],
  },

  // Logging
  {
    id: "logging",
    title: "Structured Logging",
    description: "Advanced logging configuration with structured output",
    icon: "Activity",
    category: "logging",
    allowMultiple: false,
    options: [
      {
        id: "default",
        title: "Default Logging",
        description: "Built-in ASP.NET Core logging",
        complexity: "Beginner",
        category: "logging",
        pros: [
          "Built-in framework support",
          "No additional dependencies",
          "Simple configuration",
        ],
        cons: [
          "Limited structured logging",
          "Basic output formatting",
          "No advanced sinks",
        ],
        nugetPackages: [],
        configFiles: [],
      },
      {
        id: "serilog",
        title: "Serilog",
        description:
          "Structured logging with rich sinks and formatting options",
        complexity: "Intermediate",
        category: "logging",
        pros: [
          "Excellent structured logging",
          "Many sink options",
          "Rich formatting capabilities",
          "Great performance",
        ],
        cons: [
          "Additional dependency",
          "Configuration complexity",
          "Learning curve",
        ],
        isRecommended: true,
        nugetPackages: [
          "Serilog.AspNetCore",
          "Serilog.Sinks.Console",
          "Serilog.Sinks.File",
          "Serilog.Formatting.Compact",
        ],
        configFiles: ["SerilogConfiguration.cs"],
        codeExamples: [
          {
            title: "Serilog Configuration",
            language: "csharp",
            filename: "Program.cs",
            code: `builder.Host.UseSerilog((context, configuration) =>
{
    configuration
        .ReadFrom.Configuration(context.Configuration)
        .Enrich.FromLogContext()
        .Enrich.WithMachineName()
        .WriteTo.Console(new CompactJsonFormatter())
        .WriteTo.File("logs/log-.txt", 
            rollingInterval: RollingInterval.Day,
            retainedFileCountLimit: 30,
            formatter: new CompactJsonFormatter());
});`,
          },
          {
            title: "Serilog Settings",
            language: "json",
            filename: "appsettings.json",
            code: `{
  "Serilog": {
    "Using": ["Serilog.Sinks.Console", "Serilog.Sinks.File"],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "System": "Warning"
      }
    },
    "WriteTo": [
      { "Name": "Console" },
      { 
        "Name": "File", 
        "Args": { 
          "path": "logs/log-.txt",
          "rollingInterval": "Day"
        } 
      }
    ],
    "Enrich": ["FromLogContext", "WithMachineName"]
  }
}`,
          },
        ],
      },
    ],
  },

  // Error Handling
  {
    id: "error_handling",
    title: "Error & Result Patterns",
    description: "Standardized error handling and result patterns",
    icon: "AlertTriangle",
    category: "patterns",
    allowMultiple: false,
    options: [
      {
        id: "exceptions",
        title: "Exception-based",
        description:
          "Traditional exception handling with global exception middleware",
        complexity: "Beginner",
        category: "patterns",
        pros: [
          "Familiar pattern",
          "Built-in language support",
          "Simple implementation",
        ],
        cons: [
          "Performance overhead",
          "Can mask business logic",
          "Difficult to handle expected errors",
        ],
        nugetPackages: [],
        configFiles: ["GlobalExceptionMiddleware.cs"],
      },
      {
        id: "result_pattern",
        title: "Result Pattern",
        description: "Functional approach with Result<T> and Error types",
        complexity: "Intermediate",
        category: "patterns",
        pros: [
          "Explicit error handling",
          "Better performance",
          "Functional programming approach",
          "Composable operations",
        ],
        cons: [
          "Learning curve",
          "More verbose code",
          "Need to handle every result",
        ],
        isRecommended: true,
        nugetPackages: ["FluentResults", "ErrorOr"],
        configFiles: ["ResultExtensions.cs", "ErrorTypes.cs"],
        codeExamples: [
          {
            title: "Result Pattern Usage",
            language: "csharp",
            filename: "OrderService.cs",
            code: `public async Task<Result<Order>> CreateOrderAsync(CreateOrderCommand command)
{
    var validationResult = await _validator.ValidateAsync(command);
    if (!validationResult.IsValid)
    {
        return Result.Fail(validationResult.Errors.Select(e => e.ErrorMessage));
    }
    
    var customer = await _customerRepository.GetByIdAsync(command.CustomerId);
    if (customer is null)
    {
        return Result.Fail($"Customer with ID {command.CustomerId} not found");
    }
    
    var order = new Order(command.CustomerId, command.Amount);
    await _orderRepository.AddAsync(order);
    
    return Result.Ok(order);
}`,
          },
        ],
      },
    ],
  },

  // Infrastructure
  {
    id: "containerization",
    title: "Containerization",
    description: "Docker containerization and orchestration setup",
    icon: "Package",
    category: "infrastructure",
    allowMultiple: true,
    options: [
      {
        id: "dockerfile",
        title: "Dockerfile",
        description:
          "Basic Docker containerization with optimized multi-stage build",
        complexity: "Intermediate",
        category: "infrastructure",
        pros: [
          "Consistent deployments",
          "Environment isolation",
          "Easy scaling",
          "Cloud-ready",
        ],
        cons: [
          "Additional complexity",
          "Learning curve",
          "Build time overhead",
        ],
        isRecommended: true,
        nugetPackages: [],
        configFiles: ["Dockerfile", ".dockerignore"],
        codeExamples: [
          {
            title: "Optimized Dockerfile",
            language: "dockerfile",
            filename: "Dockerfile",
            code: `FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copy project files and restore dependencies
COPY ["src/YourProject.API/YourProject.API.csproj", "src/YourProject.API/"]
COPY ["src/YourProject.Application/YourProject.Application.csproj", "src/YourProject.Application/"]
COPY ["src/YourProject.Domain/YourProject.Domain.csproj", "src/YourProject.Domain/"]
COPY ["src/YourProject.Infrastructure/YourProject.Infrastructure.csproj", "src/YourProject.Infrastructure/"]
RUN dotnet restore "src/YourProject.API/YourProject.API.csproj"

# Copy everything else and build
COPY . .
WORKDIR "/src/src/YourProject.API"
RUN dotnet build "YourProject.API.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "YourProject.API.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "YourProject.API.dll"]`,
          },
        ],
      },
      {
        id: "docker_compose",
        title: "Docker Compose",
        description: "Multi-container application with database and services",
        complexity: "Advanced",
        category: "infrastructure",
        pros: [
          "Multi-service orchestration",
          "Easy local development",
          "Service networking",
          "Volume management",
        ],
        cons: [
          "Complex configuration",
          "Resource intensive",
          "Production limitations",
        ],
        dependencies: ["dockerfile"],
        nugetPackages: [],
        configFiles: ["docker-compose.yml", "docker-compose.override.yml"],
        codeExamples: [
          {
            title: "Docker Compose Configuration",
            language: "yaml",
            filename: "docker-compose.yml",
            code: `version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8080:8080"
      - "8081:8081"
    depends_on:
      - database
    environment:
      - ASPNETCORE_ENVIRONMENT=Development
      - ConnectionStrings__DefaultConnection=Server=database;Database=YourProjectDb;User=sa;Password=YourPassword123!;TrustServerCertificate=true
    networks:
      - app-network

  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourPassword123!
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  sqlserver_data:`,
          },
        ],
      },
    ],
  },

  // Events and Messaging
  {
    id: "events",
    title: "Event-Driven Architecture",
    description: "Domain events and messaging infrastructure",
    icon: "Radio",
    category: "messaging",
    allowMultiple: false,
    showWhen: (selectedFeatures, architecture) => {
      return ["ddd", "clean"].includes(architecture);
    },
    options: [
      {
        id: "domain_events",
        title: "Domain Events Only",
        description: "In-memory domain events without external messaging",
        complexity: "Intermediate",
        category: "messaging",
        pros: [
          "Simple implementation",
          "No external dependencies",
          "Good for monolithic applications",
          "Easy testing",
        ],
        cons: [
          "Not suitable for distributed systems",
          "Events lost on application restart",
          "No replay capability",
        ],
        nugetPackages: [],
        configFiles: ["DomainEvents/", "EventDispatcher.cs"],
        codeExamples: [
          {
            title: "Domain Event",
            language: "csharp",
            filename: "OrderCreatedEvent.cs",
            code: `public record OrderCreatedEvent(
    Guid OrderId,
    string CustomerId,
    decimal Amount,
    DateTime CreatedAt
) : IDomainEvent;

public interface IDomainEvent
{
    DateTime OccurredOn => DateTime.UtcNow;
}`,
          },
        ],
      },
      {
        id: "rabbitmq",
        title: "RabbitMQ Integration",
        description: "Message bus with RabbitMQ for reliable messaging",
        complexity: "Advanced",
        category: "messaging",
        pros: [
          "Reliable message delivery",
          "Message persistence",
          "Flexible routing",
          "Good tooling and monitoring",
        ],
        cons: [
          "Infrastructure complexity",
          "Additional service dependency",
          "Learning curve",
          "Operational overhead",
        ],
        nugetPackages: ["MassTransit", "MassTransit.RabbitMQ"],
        configFiles: ["MessageBusConfiguration.cs", "Consumers/"],
        dependencies: ["domain_events"],
        codeExamples: [
          {
            title: "RabbitMQ Configuration",
            language: "csharp",
            filename: "Program.cs",
            code: `builder.Services.AddMassTransit(x =>
{
    x.AddConsumersFromNamespaceContaining<OrderCreatedConsumer>();
    
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration.GetConnectionString("RabbitMQ"));
        cfg.ConfigureEndpoints(context);
    });
});`,
          },
        ],
      },
      {
        id: "kafka",
        title: "Apache Kafka Integration",
        description: "High-throughput event streaming with Apache Kafka",
        complexity: "Advanced",
        category: "messaging",
        pros: [
          "High throughput",
          "Event sourcing capabilities",
          "Horizontal scaling",
          "Event replay functionality",
        ],
        cons: [
          "Complex setup and configuration",
          "High resource requirements",
          "Steep learning curve",
          "Operational complexity",
        ],
        isEnterprise: true,
        nugetPackages: ["Confluent.Kafka", "KafkaFlow"],
        configFiles: ["KafkaConfiguration.cs", "EventHandlers/"],
        dependencies: ["domain_events"],
      },
    ],
  },
];
