import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as sns from "aws-cdk-lib/aws-sns";
import * as cdk from "aws-cdk-lib";

export interface BackendAssets {
    api_lambda: lambda.Function;
    lambda_api: apigateway.LambdaRestApi;
}

export interface StackProps extends cdk.StackProps {
    env?: {
        region: string;
        account?: string;
    };
}
