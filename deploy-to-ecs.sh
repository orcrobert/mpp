#!/bin/bash
set -e

# Configuration
AWS_REGION=eu-north-1
ECR_REPOSITORY_NAME=metal-db
ECS_CLUSTER_NAME=metal-db-cluster
ECS_SERVICE_NAME=metal-db-service

# Ensure AWS CLI is installed and configured
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please install it first."
    exit 1
fi

# Log in to ECR
echo "Logging in to Amazon ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repository if it doesn't exist
echo "Checking if ECR repository exists..."
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION &> /dev/null; then
    echo "Creating ECR repository..."
    aws ecr create-repository --repository-name $ECR_REPOSITORY_NAME --region $AWS_REGION
fi

# Get the ECR repository URI
ECR_REPOSITORY_URI=$(aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)
echo "ECR Repository URI: $ECR_REPOSITORY_URI"

# Build and push the Docker image
echo "Building and pushing Docker image..."
export ECR_REPOSITORY_URI=$ECR_REPOSITORY_URI
docker-compose build
docker tag metal-db-web:latest $ECR_REPOSITORY_URI:latest
docker push $ECR_REPOSITORY_URI:latest

# Update ECS task definition
echo "Updating ECS task definition..."
# Replace variables in the task definition
export ECS_EXECUTION_ROLE_ARN=$(aws iam get-role --role-name ecsTaskExecutionRole --query 'Role.Arn' --output text)
export ECS_TASK_ROLE_ARN=$(aws iam get-role --role-name ecsTaskRole --query 'Role.Arn' --output text)
export EFS_FILE_SYSTEM_ID=$(aws efs describe-file-systems --query 'FileSystems[0].FileSystemId' --output text)

# Use envsubst to replace environment variables in the task definition
envsubst < ecs-task-definition.json > ecs-task-definition-updated.json

# Register the new task definition
NEW_TASK_DEFINITION_ARN=$(aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json --region $AWS_REGION --query 'taskDefinition.taskDefinitionArn' --output text)
echo "New task definition registered: $NEW_TASK_DEFINITION_ARN"

# Update the ECS service with the new task definition
echo "Updating ECS service..."
aws ecs update-service --cluster $ECS_CLUSTER_NAME --service $ECS_SERVICE_NAME --task-definition $NEW_TASK_DEFINITION_ARN --region $AWS_REGION

echo "Deployment completed successfully!" 