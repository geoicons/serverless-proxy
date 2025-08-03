import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import { Duration } from "aws-cdk-lib";
import { append_prefix } from "./utilities";

export function createLambdaApi(scope: Construct, prefix: string, sharedEnvironment: any) {
    // Add Backend Parameters to sharedEnvironment
    let apiEnvironment = {};
    apiEnvironment = { ...sharedEnvironment, ...apiEnvironment };

    let backendLambdaConfig = {
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("src/lambda_api"),
        handler: "service.main",
        timeout: Duration.seconds(60),
        architecture: lambda.Architecture.ARM_64,
        memorySize: 512,
        environment: apiEnvironment,
        functionName: append_prefix("lambda_api", prefix),
    };
    const api_lambda = new lambda.Function(scope, append_prefix("lambda_api", prefix), backendLambdaConfig);

    // Create the API gateway and link its handler
    const lambda_api = new apigateway.LambdaRestApi(scope, append_prefix("lambda-api", prefix), {
        handler: api_lambda,
        proxy: false,
        deployOptions: { stageName: sharedEnvironment.STAGE },
        binaryMediaTypes: ["*/*"],
        restApiName: append_prefix("lambda-api", prefix),
    });

    lambda_api.root.addProxy({
        defaultIntegration: new apigateway.LambdaIntegration(api_lambda),
        anyMethod: true,
    });

    return {
        api_lambda,
        lambda_api,
    };
}
