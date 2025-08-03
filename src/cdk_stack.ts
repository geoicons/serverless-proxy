import { CfnOutput, Duration, RemovalPolicy, Stack, SecretValue } from "aws-cdk-lib";
import { Construct } from "constructs";
import { append_prefix } from "./stack/utilities";
import { createLambdaApi } from "./stack/lambda_api";

export class GEOServerlessStack extends Construct {
    constructor(scope: Construct, stack_name: string, stage: string, region: string, managementApiKey: string) {
        super(scope, stack_name);

        console.log("stack_name from app.ts:", stack_name);
        console.log("stage from app.ts:", stage);
        console.log("region from app.ts:", region);

        // =====================================================================================
        // Global Parameters
        // =====================================================================================
        // Prefix for all resources - prevents collisions in the same account / regions
        const prefix = `${stack_name}-${region}`;

        // =====================================================================================
        // Set shared environment variables for all Lambdas
        // =====================================================================================
        let sharedEnvironment: any = {
            RESOURCEREGION: region,
            STAGE: stage,
            MANAGEMENTAPIKEY: managementApiKey,
        };

        // =====================================================================================
        // Create a Lambda Function that serves the LAMBDA_API
        // ====================================================================================
        const { api_lambda, lambda_api } = createLambdaApi(this, prefix, sharedEnvironment);

        // Add an output to the stack
        let exportName: string;
        exportName = append_prefix("URL", prefix);
        const backEndUrl: string = `${lambda_api.url}`;
        const backEndUrlOutput = new CfnOutput(this, "APIURL", {
            exportName: exportName,
            value: backEndUrl,
        });
    }
}
