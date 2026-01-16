# Azure Portal Context

This file contains context-specific information about your Azure subscription and resources.

## Subscription Information

- **Subscription Name**: [Your Subscription]
- **Subscription ID**: [Your Subscription ID]
- **Tenant ID**: [Your Tenant ID]
- **Primary Region**: [e.g., East US, West Europe]
- **Cost Center**: [If applicable]

## Resource Organization

### Resource Groups

#### rg-webapp-production
- **Purpose**: Production environment for WebApp
- **Location**: East US
- **Tags**:
  - Environment: Production
  - Application: WebApp
  - CostCenter: Engineering

**Resources**:
- `webapp-prod` - App Service (B2 tier)
- `webapp-sql-prod` - Azure SQL Database (S3)
- `webapp-storage-prod` - Storage Account (Standard_LRS)
- `webapp-keyvault-prod` - Key Vault
- `webapp-appinsights-prod` - Application Insights

#### rg-webapp-staging
- **Purpose**: Staging environment for testing
- **Location**: East US
- **Tags**:
  - Environment: Staging
  - Application: WebApp

**Resources**:
- `webapp-staging` - App Service (B1 tier)
- `webapp-sql-staging` - Azure SQL Database (S1)
- `webapp-storage-staging` - Storage Account (Standard_LRS)

#### rg-webapp-dev
- **Purpose**: Development environment
- **Location**: East US
- **Tags**:
  - Environment: Development
  - Application: WebApp

**Resources**:
- `webapp-dev` - App Service (F1 tier)
- `webapp-sql-dev` - Azure SQL Database (Basic)

#### rg-shared-services
- **Purpose**: Shared infrastructure and services
- **Location**: East US

**Resources**:
- `shared-acr` - Azure Container Registry
- `shared-logs` - Log Analytics Workspace
- `shared-monitoring` - Application Insights (shared)

## App Services

### Production App Service: webapp-prod

**Configuration**:
- **SKU**: B2 (2 cores, 3.5 GB RAM)
- **Runtime**: .NET 8.0
- **Always On**: Enabled
- **HTTPS Only**: Enabled
- **Custom Domain**: https://webapp.company.com
- **SSL Certificate**: App Service Managed Certificate

**App Settings** (non-sensitive):
- `ASPNETCORE_ENVIRONMENT`: Production
- `ApplicationInsights__InstrumentationKey`: [from Key Vault]
- `Database__ConnectionString`: [from Key Vault]

**Scaling**:
- **Auto-scale**: Enabled
- **Min Instances**: 2
- **Max Instances**: 10
- **Scale-out rule**: CPU > 70% for 5 minutes
- **Scale-in rule**: CPU < 30% for 10 minutes

### Staging App Service: webapp-staging

**Configuration**:
- **SKU**: B1 (1 core, 1.75 GB RAM)
- **Runtime**: .NET 8.0
- **Always On**: Enabled
- **HTTPS Only**: Enabled
- **Custom Domain**: https://staging.webapp.company.com

**Deployment Slots**:
- Production (main slot)
- Blue-Green (for zero-downtime deployments)

## Databases

### Production Database: webapp-sql-prod

**Configuration**:
- **Server**: webapp-sql-server.database.windows.net
- **Database**: webapp-db
- **Tier**: Standard S3 (100 DTUs)
- **Storage**: 250 GB
- **Backup Retention**: 35 days
- **Geo-Replication**: Enabled (secondary in West US)

**Security**:
- **Firewall**: Azure services allowed
- **Private Endpoint**: Configured
- **TDE**: Enabled
- **Auditing**: Enabled (logs to Log Analytics)

**Connection Strings**:
- Stored in Key Vault: `webapp-keyvault-prod`
- Key name: `DatabaseConnectionString`

## Storage Accounts

### webapp-storage-prod

**Configuration**:
- **Type**: StorageV2 (general purpose v2)
- **Replication**: Locally-redundant storage (LRS)
- **Performance**: Standard
- **Access Tier**: Hot

**Containers**:
- `uploads` - User-uploaded files
- `exports` - Generated reports and exports
- `backups` - Application backups

**Security**:
- **HTTPS Required**: Yes
- **Minimum TLS**: 1.2
- **Public Access**: Disabled (use SAS tokens)
- **Firewall**: Restricted to App Service VNet

## Key Vaults

### webapp-keyvault-prod

**Purpose**: Store application secrets and certificates

**Secrets**:
- `DatabaseConnectionString` - SQL connection string
- `ApplicationInsightsKey` - AI instrumentation key
- `ExternalApiKey` - Third-party API key
- `StorageAccountKey` - Storage account access key

**Access Policies**:
- `webapp-prod` - Get, List secrets
- `DevOps-ServicePrincipal` - Get, List, Set secrets (for deployments)
- `Admin-Group` - All permissions

**Monitoring**:
- Audit logs enabled
- Alerts on secret access patterns

## Networking

### Virtual Networks

#### vnet-webapp-prod
- **Address Space**: 10.0.0.0/16
- **Subnets**:
  - `subnet-webapp` (10.0.1.0/24) - App Services
  - `subnet-data` (10.0.2.0/24) - Databases
  - `subnet-gateway` (10.0.255.0/27) - VPN Gateway

**Network Security Groups**:
- Allow HTTPS (443) from Internet
- Allow SQL (1433) only from App Service subnet
- Block all other inbound traffic

## Monitoring and Alerts

### Application Insights: webapp-appinsights-prod

**Monitored Metrics**:
- Request rate and response time
- Failure rate
- Dependency calls (SQL, external APIs)
- Custom events and metrics

**Alert Rules**:
1. **High Response Time**
   - Condition: Avg response time > 3 seconds for 5 minutes
   - Action: Email DevOps team

2. **High Error Rate**
   - Condition: Failed requests > 5% for 5 minutes
   - Action: Create incident, page on-call

3. **Low Availability**
   - Condition: Availability < 99% for 15 minutes
   - Action: Email leadership, create incident

### Log Analytics: shared-logs

**Data Sources**:
- App Service logs
- SQL diagnostic logs
- Key Vault audit logs
- Activity logs (all subscriptions)

**Retention**: 90 days

## Cost Management

### Budget Alerts

- **Monthly Budget**: $5,000
- **Alert at**: 80% ($4,000), 90% ($4,500), 100% ($5,000)
- **Action**: Email finance team and engineering manager

### Cost Optimization Opportunities

1. **Right-size App Services**
   - Monitor CPU/memory usage
   - Scale down if underutilized

2. **SQL Database DTU optimization**
   - Review query performance
   - Consider elastic pools for multiple databases

3. **Storage lifecycle management**
   - Move old blobs to Cool tier after 30 days
   - Delete old backups after 90 days

## Disaster Recovery

### Backup Strategy

**App Services**:
- Daily backups to storage account
- Retention: 30 days
- Includes: Code, config, database

**Databases**:
- Automated backups: Daily
- Point-in-time restore: Up to 35 days
- Geo-replica: Active in West US

**Recovery Time Objective (RTO)**: 4 hours
**Recovery Point Objective (RPO)**: 1 hour

### Failover Procedure

1. Verify primary region is down
2. Initiate SQL geo-replication failover
3. Update DNS or Traffic Manager to point to secondary region
4. Verify application functionality
5. Communicate status to stakeholders

## Security and Compliance

### Azure AD Integration

- **Authentication**: Azure AD (OAuth 2.0)
- **App Registration**: webapp-prod-app
- **User Assignment**: Required
- **Authorized Users**: Company employees

### Compliance

- **Data Residency**: All data in US East
- **Encryption**: 
  - In transit: TLS 1.2+
  - At rest: Azure managed keys
- **Audit Logs**: Retained for 1 year
- **Access Reviews**: Quarterly

## Useful Azure CLI Commands

```bash
# List all resources in production resource group
az resource list --resource-group rg-webapp-production --output table

# Check App Service status
az webapp show --name webapp-prod --resource-group rg-webapp-production --query state

# View recent deployments
az webapp deployment list --name webapp-prod --resource-group rg-webapp-production

# Check database metrics
az sql db show --server webapp-sql-server --name webapp-db --resource-group rg-webapp-production

# List Key Vault secrets
az keyvault secret list --vault-name webapp-keyvault-prod --output table
```

## Useful Portal Links

- [Subscription Overview](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade)
- [Production Resource Group](https://portal.azure.com/#@[tenant]/resource/subscriptions/[sub-id]/resourceGroups/rg-webapp-production)
- [App Service](https://portal.azure.com/#resource/subscriptions/[sub-id]/resourceGroups/rg-webapp-production/providers/Microsoft.Web/sites/webapp-prod)
- [SQL Database](https://portal.azure.com/#resource/subscriptions/[sub-id]/resourceGroups/rg-webapp-production/providers/Microsoft.Sql/servers/webapp-sql-server/databases/webapp-db)
- [Application Insights](https://portal.azure.com/#resource/subscriptions/[sub-id]/resourceGroups/rg-webapp-production/providers/Microsoft.Insights/components/webapp-appinsights-prod)
- [Cost Analysis](https://portal.azure.com/#blade/Microsoft_Azure_CostManagement/Menu/costanalysis)

---

**Last Updated**: [Date]
**Maintained By**: [Team/Person]
