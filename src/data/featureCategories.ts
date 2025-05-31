// src/data/featureCategories.ts
import { FeatureCategory } from '../types/features';
import {
  Command,
  CheckSquare,
  Repeat,
  FileText,
  Key,
  Database,
  BookOpen,
  AlertTriangle,
  Zap,
  Clock
} from 'lucide-react';

export const featureCategories: FeatureCategory[] = [
  {
    id: 'cqrs',
    title: 'CQRS & Patterns',
    description: 'Command Query Responsibility Segregation implementation',
    icon: Command.name,
    options: [
      {
        id: 'mediatr',
        title: 'MediatR',
        description: 'Use MediatR for CQRS implementation',
        complexity: 'Intermediate',
        pros: [
          'Clean separation of commands and queries',
          'Built-in pipeline behaviors',
          'Widely adopted in .NET community'
        ],
        cons: [
          'Additional abstraction layer',
          'Learning curve for beginners'
        ],
        codeExamples: [
          {
            title: 'Command Handler',
            language: 'csharp',
            code: `public class CreateOrderHandler : IRequestHandler<CreateOrderCommand, int>
{
    public async Task<int> Handle(CreateOrderCommand command, CancellationToken token)
    {
        // Implementation
    }
}`
          }
        ],
        isRecommended: true
      },
      {
        id: 'manual',
        title: 'Manual Implementation',
        description: 'Implement CQRS patterns manually',
        complexity: 'Advanced',
        pros: [
          'Full control over implementation',
          'No external dependencies',
          'Custom optimization possibilities'
        ],
        cons: [
          'More boilerplate code',
          'Need to maintain own infrastructure',
          'Higher chance of inconsistencies'
        ],
        codeExamples: [
          {
            title: 'Manual Command Handler',
            language: 'csharp',
            code: `public interface ICommandHandler<TCommand, TResult>
{
    Task<TResult> HandleAsync(TCommand command);
}`
          }
        ]
      }
    ]
  },
  {
    id: 'validation',
    title: 'Validation',
    description: 'Input validation strategy',
    icon: CheckSquare.name,
    options: [
      {
        id: 'fluent',
        title: 'FluentValidation',
        description: 'Fluent validation library with rich features',
        complexity: 'Intermediate',
        pros: [
          'Fluent and readable syntax',
          'Rich validation rules',
          'Great integration with ASP.NET Core'
        ],
        cons: [
          'Additional package dependency',
          'Slight performance overhead'
        ],
        codeExamples: [
          {
            title: 'Validator Example',
            language: 'csharp',
            code: `public class OrderValidator : AbstractValidator<Order>
{
    public OrderValidator()
    {
        RuleFor(x => x.CustomerId).NotEmpty();
        RuleFor(x => x.Amount).GreaterThan(0);
    }
}`
          }
        ],
        isRecommended: true
      }
    ]
  }
  // Additional categories will be added similarly
];