#!/bin/bash

# Exit on error
set -e

echo "=== Building application for deployment ==="
npm run deploy

# Navigate to the dist folder
cd dist

# Check if eb CLI is installed
if ! command -v eb &> /dev/null; then
    echo "Elastic Beanstalk CLI is not installed. Installing..."
    pip install awsebcli --upgrade --user
fi

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Installing..."
    pip install awscli --upgrade --user
fi

echo "=== Setting up Elastic Beanstalk ==="

# Check if .elasticbeanstalk directory exists
if [ ! -d ".elasticbeanstalk" ]; then
    echo "Initializing Elastic Beanstalk application..."
    
    # Get app name (default to metal-db)
    read -p "Enter application name [metal-db]: " APP_NAME
    APP_NAME=${APP_NAME:-metal-db}
    
    # Initialize EB app
    eb init $APP_NAME --platform node.js --region $(aws configure get region)
    
    # Create environment
    read -p "Enter environment name [production]: " ENV_NAME
    ENV_NAME=${ENV_NAME:-production}
    
    echo "Creating Elastic Beanstalk environment..."
    eb create $ENV_NAME --instance-type t3.micro --single
    
    # Set environment variables
    echo "Setting up environment variables..."
    read -p "Enter PostgreSQL database URL: " DB_URL
    read -p "Enter JWT secret: " JWT_SECRET
    
    eb setenv DATABASE_URL="$DB_URL" JWT_SECRET="$JWT_SECRET"
fi

echo "=== Deploying application ==="
eb deploy

echo "=== Running database migrations ==="
echo "To run migrations after deployment, connect to your EB instance:"
echo "  eb ssh"
echo "  cd /var/app/current"
echo "  npx prisma migrate deploy"

echo "=== Deployment completed ==="
echo "Your application is now deployed and available at:"
eb status | grep CNAME

# Return to the project root
cd .. 