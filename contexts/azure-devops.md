# Azure DevOps Context

This file contains context-specific information about your Azure DevOps setup.

## Organization Information

- **Organization URL**: https://dev.azure.com/[your-org]
- **Main Contact**: [Name/Email]
- **Region**: [Azure Region]

## Projects

### Project 1: WebApp
- **Description**: Main customer-facing web application
- **Tech Stack**: React, .NET Core, PostgreSQL
- **Team Size**: 8 developers
- **Sprint Length**: 2 weeks

**Key Repositories**:
- `webapp-frontend` - React frontend
- `webapp-api` - .NET Core API
- `webapp-infrastructure` - Terraform configs

**Build Pipelines**:
- `WebApp-CI` (ID: 123) - Continuous integration
- `WebApp-PR` (ID: 124) - Pull request validation

**Release Pipelines**:
- `WebApp-CD` (ID: 456) - Continuous deployment
  - Stages: Dev → Staging → Production

### Project 2: MobileApp
- **Description**: iOS and Android mobile applications
- **Tech Stack**: React Native, Node.js backend
- **Team Size**: 5 developers
- **Sprint Length**: 2 weeks

**Key Repositories**:
- `mobile-app` - React Native app
- `mobile-api` - Node.js API

## Team Structure

### Development Team
- **Team Area Path**: WebApp\\Development
- **Current Sprint**: Sprint 24
- **Sprint Dates**: [Start Date] - [End Date]

### QA Team
- **Team Area Path**: WebApp\\QA
- **Focus Areas**: Automated testing, performance testing

## Common WIQL Queries

### Active Bugs in Current Sprint
```wiql
SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo]
FROM WorkItems
WHERE [System.WorkItemType] = 'Bug'
  AND [System.State] <> 'Closed'
  AND [System.IterationPath] = @currentIteration
  AND [System.AreaPath] UNDER 'WebApp\\Development'
ORDER BY [System.Priority] ASC
```

### User Stories Not Started
```wiql
SELECT [System.Id], [System.Title], [System.State]
FROM WorkItems
WHERE [System.WorkItemType] = 'User Story'
  AND [System.State] = 'New'
  AND [System.IterationPath] = @currentIteration
ORDER BY [System.Priority] ASC
```

### My Active Work Items
```wiql
SELECT [System.Id], [System.Title], [System.State]
FROM WorkItems
WHERE [System.AssignedTo] = @me
  AND [System.State] <> 'Closed'
ORDER BY [System.ChangedDate] DESC
```

## Build Configuration

### Build Triggers
- **CI Builds**: Trigger on commits to `main`, `develop` branches
- **PR Builds**: Trigger on all pull requests
- **Scheduled Builds**: Nightly at 2 AM UTC

### Build Agents
- **Pool**: Azure Pipelines (Microsoft-hosted)
- **Agent Specification**: ubuntu-latest for most builds
- **Windows Pool**: Windows-2022 for .NET Framework builds

### Build Artifacts
- Published to: Azure Artifacts feed `webapp-packages`
- Retention: 30 days for successful builds, 7 days for failed builds

## Release Configuration

### Environments

#### Development
- **URL**: https://dev.webapp.company.com
- **Auto-deploy**: Yes (on successful CI build)
- **Approval**: None required

#### Staging
- **URL**: https://staging.webapp.company.com
- **Auto-deploy**: No
- **Approval**: Required (any team member)
- **Pre-deployment gates**: 
  - Check for active incidents
  - Verify smoke tests passed

#### Production
- **URL**: https://webapp.company.com
- **Auto-deploy**: No
- **Approval**: Required (2 approvers from senior team)
- **Pre-deployment gates**:
  - Check for active incidents
  - Verify staging deployment success
  - Business hours check (deploy only 9 AM - 5 PM EST)
- **Post-deployment gates**:
  - Health check
  - Monitor for exceptions (15-minute observation)

## Monitoring and Alerts

### Application Insights
- **Resource Name**: webapp-appinsights-prod
- **Key Metrics**: Response time, failure rate, availability

### Alert Rules
- Build failure for `main` branch → Notify team in Slack
- Production deployment → Post to #deployments channel
- Critical bug created → Email team lead

## Branch Policies

### Main Branch
- ✅ Require pull request
- ✅ Require minimum 2 reviewers
- ✅ Check for linked work items
- ✅ Check for comment resolution
- ✅ Require build validation

### Develop Branch
- ✅ Require pull request
- ✅ Require minimum 1 reviewer
- ✅ Require build validation

## Work Item Workflow

### User Story States
1. **New** → Work item created
2. **Active** → Development started
3. **Resolved** → Development complete, ready for testing
4. **Closed** → Testing complete, deployed to production

### Bug States
1. **New** → Bug reported
2. **Active** → Investigation/fix in progress
3. **Resolved** → Fix implemented, ready for verification
4. **Closed** → Verified fixed in production

## Integration Points

### External Services
- **Slack**: Notifications via webhook
- **Email**: Alerts to team distribution list
- **Azure Monitor**: Application performance monitoring

### Service Connections
- **Azure Subscription**: webapp-production
- **Container Registry**: webappacr.azurecr.io
- **Key Vault**: webapp-keyvault-prod

## Useful Links

- [Organization Homepage](https://dev.azure.com/[your-org])
- [WebApp Project](https://dev.azure.com/[your-org]/WebApp)
- [Team Wiki](https://dev.azure.com/[your-org]/WebApp/_wiki)
- [Build Definitions](https://dev.azure.com/[your-org]/WebApp/_build)
- [Release Definitions](https://dev.azure.com/[your-org]/WebApp/_release)

---

**Last Updated**: [Date]
**Maintained By**: [Team/Person]
