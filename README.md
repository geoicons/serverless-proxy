# GEOICONS - SERVERLESS PROXY

A serverless HTTP proxy service built with AWS CDK that provides a scalable, secure middleware layer for API routing and request processing. This application creates a Lambda-backed API Gateway that can route requests to different handler modules dynamically.

## 🏗️ Architecture

This application consists of:

-   **AWS Lambda Function**: Node.js 18.x runtime with Express.js handling HTTP requests
-   **API Gateway**: RESTful API with proxy integration and CORS support
-   **AWS CDK**: Infrastructure as Code for deployment and management
-   **TypeScript**: Strongly typed development with build process

### Key Features

-   🔄 **Dynamic Module Loading**: Routes requests to different handlers based on endpoint paths
-   🌐 **CORS Enabled**: Cross-origin request support with configurable policies
-   📝 **Request Logging**: Comprehensive request/response logging for debugging
-   🔒 **Header Sanitization**: Automatic filtering of sensitive headers
-   📊 **Multi-format Support**: Handles JSON, binary data, and various media types
-   🚀 **Serverless**: Auto-scaling with pay-per-use pricing model

## 🚀 Getting Started

### Prerequisites

-   Node.js 18.x or higher
-   Yarn package manager
-   AWS CLI configured with appropriate permissions
-   AWS CDK CLI installed globally

### Project Structure

```
serverless-proxy/
├── src/
│   ├── app.ts                    # CDK app entry point
│   ├── cdk_stack.ts             # Main CDK stack definition
│   ├── lambda_api/              # Lambda function source
│   │   ├── application.ts       # Express.js application setup
│   │   ├── service.ts          # Lambda handler entry point
│   │   ├── application/        # Route handlers
│   │   │   └── proxy.ts        # Proxy endpoint handlers
│   │   └── utilities/          # Shared interfaces and utilities
│   └── stack/                  # CDK infrastructure modules
└── .github/workflows/          # CI/CD pipeline definitions
```

### Installation

1. **Install all dependencies:**

    ```bash
    yarn installall
    ```

2. **Build the project:**
    ```bash
    yarn buildall
    ```

## 💻 Development

### Local Development

The application uses a modular architecture where each endpoint corresponds to a module in the `application/` directory.

### Adding New Endpoints

1. Create a new TypeScript file in `src/lambda_api/application/`
2. Export `get`, `post`, and/or `del` functions as needed
3. Each function should return an `expressResponseType` object

**Example endpoint handler:**

```typescript
import { expressResponseType } from "../utilities/interfaces";

export async function get(request: any) {
    const response: expressResponseType = {
        status: 200,
        message: "Success",
        data: { result: "Your data here" },
    };
    return response;
}

export async function post(request: any) {
    // Handle POST requests
    // Access request.body, request.params, request.query
}
```

### Request Routing

Requests to `/proxy/:path` are automatically routed to the corresponding module:

-   `/proxy/myendpoint` → `application/myendpoint.ts`
-   HTTP methods are mapped to exported functions (`get`, `post`, `del`)

### Testing

```bash
# Run tests for the main project
yarn test

# Run tests for the Lambda API
yarn --cwd src/lambda_api test
```

### Environment Variables

The Lambda function has access to these environment variables:

-   `RESOURCEREGION`: AWS region where resources are deployed
-   `STAGE`: Deployment stage (dev/qas/prod)
-   `MANAGEMENTAPIKEY`: Management API key for secure operations

## 🚀 Deployment

### Automated Deployment (Recommended)

The project uses GitHub Actions for CI/CD:

1. **Development**: Push to any branch

    ```bash
    git push origin feature/my-feature
    ```

2. **Quality Assurance**: Push to `qas` branch

    ```bash
    git push origin qas
    ```

3. **Production**: Push to `main` branch
    ```bash
    git push origin main
    ```

### Manual Deployment

For local deployment or testing:

```bash
# Deploy to development environment
cdk deploy --profile your-aws-profile

# Deploy with specific parameters
cdk deploy -c stage=dev -c region=us-east-1
```

### GitHub Actions Workflows

-   **PR Checks**: Automated build and CDK synth on pull requests to main
-   **Auto Deploy**: Deployment triggered on merge to main/qas/prod branches
-   **Required Secrets**:
    -   `AWS_ACCESS_KEY_ID`
    -   `AWS_SECRET_ACCESS_KEY`

## 🔧 Configuration

### CDK Context

Configure deployment settings in `cdk.json` or via command line:

-   `stage`: Deployment environment (dev/qas/prod)
-   `region`: AWS region for deployment
-   `managementApiKey`: API key for management operations

### CORS Configuration

CORS is configured to allow all origins by default. Modify in `src/lambda_api/application.ts`:

```typescript
const corsOptions = {
    origin: function (origin: string | undefined, callback: Function) {
        // Add your origin validation logic here
        callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
```

## 📊 Monitoring and Logging

### Request Logging

All requests are automatically logged with:

-   Request method and URL
-   Headers, body, query parameters
-   Response status and timing

### AWS CloudWatch

Monitor your application through:

-   Lambda function logs
-   API Gateway access logs
-   CloudWatch metrics and alarms

## 🔐 Security

-   Headers are automatically sanitized to remove sensitive AWS-specific headers
-   CORS policies can be customized for production environments
-   API Gateway provides built-in DDoS protection and throttling

## 🛠️ Available Scripts

| Command                 | Description                           |
| ----------------------- | ------------------------------------- |
| `yarn installall`       | Install dependencies for all packages |
| `yarn buildall`         | Build all TypeScript projects         |
| `yarn test`             | Run tests for the main project        |
| `yarn build`            | Build only the CDK project            |
| `yarn build_lambda_api` | Build only the Lambda API             |

## 📚 API Reference

### Base URL

After deployment, your API will be available at:

```
https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/
```

### Endpoints

-   `GET /proxy/{endpoint}` - Route to corresponding handler module
-   `POST /proxy/{endpoint}` - Route to corresponding handler module
-   `DELETE /proxy/{endpoint}` - Route to corresponding handler module

### Response Format

All responses follow the `expressResponseType` interface:

```typescript
{
    status: number;
    message?: string;
    data?: any;
    headers?: any;
    type?: string;
    cache?: string;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.
