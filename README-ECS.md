# Deploying Metal-DB to Amazon ECS

This guide walks through deploying the Metal-DB application to Amazon ECS using Docker Compose.

## Prerequisites

1. Docker and Docker Compose installed locally
2. AWS CLI installed and configured with appropriate credentials
3. An AWS account with permissions for:
   - Amazon ECR (Elastic Container Registry)
   - Amazon ECS (Elastic Container Service)
   - Amazon EFS (Elastic File System)
   - IAM roles
   - Amazon RDS or AWS-managed PostgreSQL database (optional)

## Initial Setup

### 1. Create Required AWS Resources

Before deploying, you need to set up:

1. An ECS cluster:
   ```bash
   aws ecs create-cluster --cluster-name metal-db-cluster
   ```

2. An EFS file system for persistent storage:
   ```bash
   aws efs create-file-system --performance-mode generalPurpose --throughput-mode bursting
   ```

3. Required IAM roles (if they don't exist):
   ```bash
   # ECS task execution role
   aws iam create-role --role-name ecsTaskExecutionRole --assume-role-policy-document file://ecs-task-execution-role.json
   
   # ECS task role
   aws iam create-role --role-name ecsTaskRole --assume-role-policy-document file://ecs-task-role.json
   ```

4. ECR repository for your Docker images:
   ```bash
   aws ecr create-repository --repository-name metal-db
   ```

### 2. Setup Environment Variables

Copy the environment template and fill in with your values:

```bash
cp env.ecs.template .env.ecs
```

Edit `.env.ecs` with actual values for your environment.

## Deployment

### 1. Prepare for Deployment

```bash
chmod +x deploy-to-ecs.sh
```

### 2. Deploy to ECS

```bash
./deploy-to-ecs.sh
```

This script will:
1. Build and push your Docker image to Amazon ECR
2. Update the ECS task definition
3. Update the ECS service with the new definition

## Monitoring and Maintenance

### View Application Logs

```bash
aws logs get-log-events --log-group-name /ecs/metal-db --log-stream-name web/your-log-stream
```

### Update Your Deployment

To update your deployment, make changes to your code and run the `deploy-to-ecs.sh` script again.

## Cleaning Up

To remove all AWS resources:

```bash
# Delete ECS service
aws ecs delete-service --cluster metal-db-cluster --service metal-db-service --force

# Delete ECS cluster
aws ecs delete-cluster --cluster metal-db-cluster

# Delete ECR repository
aws ecr delete-repository --repository-name metal-db --force

# Delete EFS file system
aws efs delete-file-system --file-system-id YOUR_EFS_ID
```

## Troubleshooting

### Common Issues

1. **Task failing to start**: Check CloudWatch logs for error messages
2. **Connection to database fails**: Verify security groups and networking
3. **Images not updating**: Check ECR repository and image tagging

For any issue, check the ECS service events and task logs in CloudWatch. 