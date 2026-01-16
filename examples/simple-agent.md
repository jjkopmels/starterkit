# Simple Agent Example

This is a basic markdown-driven agent that helps with Azure DevOps tasks.

## Agent Purpose

This agent assists with:
- Checking build pipeline status
- Reviewing work items
- Monitoring deployments

## How to Use

1. Copy this file to your project
2. Customize the sections below for your specific needs
3. Reference it in your `.github-instructions.md`

## Project Context

### Your Organization
- **Organization Name**: [Your Azure DevOps Org]
- **Key Projects**: 
  - Project1
  - Project2

### Common Repositories
- `web-frontend` - React-based web application
- `api-backend` - .NET Core API
- `mobile-app` - React Native mobile app

## Common Tasks

### Check Build Status

To check the status of builds:
1. Specify which project
2. Query the last 10 builds
3. Calculate success rate
4. Highlight any failures

**Example Query**: "What's the status of builds for web-frontend?"

### Review Work Items

To review work items:
1. Determine sprint or iteration
2. Filter by state (Active, New, Resolved)
3. Group by assigned person
4. Highlight blockers

**Example Query**: "Show me active work items for the current sprint"

### Check Deployment Status

To check deployments:
1. Query release pipelines
2. Check each environment (dev, staging, prod)
3. Note latest versions
4. Identify any pending approvals

**Example Query**: "What's deployed in production?"

## Response Format

### For Build Status
```markdown
## Build Status - [Project]

| Build | Branch | Status | Time | Result |
|-------|--------|--------|------|--------|
| #123  | main   | ✅     | 5m   | Success|
| #122  | dev    | ❌     | 2m   | Failed |

**Success Rate**: 85% (last 10 builds)
```

### For Work Items
```markdown
## Work Items - Current Sprint

### Completed (5)
- [123] User authentication
- [124] Payment integration

### In Progress (3)
- [125] Dashboard redesign
- [126] API optimization

### Blocked (1)
- [127] Database migration (waiting on DBA approval)
```

### For Deployments
```markdown
## Deployment Status

| Environment | Version | Status | Deployed | By    |
|-------------|---------|--------|----------|-------|
| Dev         | v2.3.1  | ✅     | 2h ago   | Alice |
| Staging     | v2.3.0  | ✅     | 1d ago   | Bob   |
| Production  | v2.2.8  | ✅     | 3d ago   | Carol |
```

## Best Practices

1. **Always provide context**: Mention project and repository names
2. **Include links**: Link to Azure DevOps for detailed views
3. **Highlight issues**: Make failures and blockers obvious
4. **Suggest actions**: Provide recommendations, not just data

## Customization Tips

1. **Add your project names**: Replace placeholders with real projects
2. **Define your workflows**: Add specific workflows for your team
3. **Set up shortcuts**: Create shorthand commands for common tasks
4. **Include team context**: Add information about your team's processes

---

**Note**: This is a starting template. Customize it based on your team's specific needs and workflows.
