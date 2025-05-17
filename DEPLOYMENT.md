# Deploying Metal-DB to AWS Elastic Beanstalk

This guide explains how to deploy the Metal-DB application.

## Authentication Architecture

The application uses a separated authentication architecture:

1. `src/lib/auth-client.ts` - Edge-compatible authentication for the frontend (deployed to Vercel)
2. `src/lib/auth-server.ts` - Node.js-specific authentication for the backend (deployed to AWS)

This separation ensures compatibility with Vercel's Edge Runtime.

## Frontend Deployment with Vercel

### 1. Preparing your frontend for deployment

1. Make sure your code is pushed to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create an account if you don't have one
3. Click "New Project" and import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `.` (or where your Next.js app is located)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. In the Environment Variables section, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.elasticbeanstalk.com
   ```
   (Note: You'll set this to your actual backend URL after deployment)
6. Click "Deploy"

### 2. After Vercel deployment

Note your frontend URL (e.g., `https://your-app.vercel.app`). You'll need this when deploying the backend to configure CORS.

## Backend Deployment with AWS Elastic Beanstalk

This guide explains how to deploy the Metal-DB backend to AWS Elastic Beanstalk.

## Prerequisites

Before deploying, you need:

1. An AWS account
2. AWS CLI and Elastic Beanstalk CLI installed and configured
3. A PostgreSQL database (Amazon RDS recommended)

## Deployment Steps

### 1. Setting up your AWS credentials

If you haven't already, configure your AWS credentials:

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, region (e.g., us-east-1), and output format (json).

### 2. Creating a PostgreSQL Database

Create a PostgreSQL database in Amazon RDS:

1. Go to the AWS RDS console
2. Click "Create database"
3. Select PostgreSQL as the engine
4. Choose a size appropriate for your needs (db.t3.micro for development)
5. Set a master username and password
6. Make sure the database is publicly accessible if you'll connect remotely
7. Create the database

Note the endpoint, port, username, password, and database name for the DATABASE_URL.

### 3. One-click Deployment

We've created a deployment script that handles everything for you:

```bash
./deploy.sh
```

This script will:
1. Build your application
2. Set up Elastic Beanstalk
3. Deploy your code
4. Prompt you for database credentials

### 4. Manual Deployment Steps

If you prefer to deploy manually:

1. Build the application:
   ```bash
   npm run deploy
   ```

2. Navigate to the dist directory:
   ```bash
   cd dist
   ```

3. Initialize Elastic Beanstalk:
   ```bash
   eb init metal-db --platform node.js --region us-east-1
   ```

4. Create an environment:
   ```bash
   eb create production --instance-type t3.micro --single
   ```

5. Set environment variables:
   ```bash
   eb setenv DATABASE_URL="postgresql://username:password@your-rds-endpoint:5432/metal_db" JWT_SECRET="your-secret-key"
   ```

6. Deploy the application:
   ```bash
   eb deploy
   ```

7. Run database migrations:
   ```bash
   eb ssh
   cd /var/app/current
   npx prisma migrate deploy
   ```

## Updating Your Deployment

To update your deployed application:

1. Make your changes to the codebase
2. Run the deployment script again:
   ```bash
   ./deploy.sh
   ```

## Monitoring Your Application

You can monitor your application through:

1. Elastic Beanstalk logs:
   ```bash
   eb logs
   ```

2. AWS CloudWatch in the AWS console

3. Checking the application health:
   ```bash
   eb health
   ```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Check that the security group allows inbound connections on port 5432
2. Verify your DATABASE_URL environment variable
3. Make sure your RDS instance is in the "Available" state

### Application Errors

Check the application logs:

```bash
eb logs
```

### Connection Refused Errors

If you see "Connection refused" errors, make sure:

1. Your environment variables are set correctly
2. Your database is running and accessible
3. Your security groups are configured correctly

## Cleaning Up

To avoid unwanted charges, delete your resources when not needed:

```bash
eb terminate production
```

And also delete your RDS instance from the AWS console. 