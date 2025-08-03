import * as cdk_stack from "./cdk_stack";
import * as cdk from "aws-cdk-lib";

// Get key parameters from the environment
const STAGE = process.env.STAGE || "test";
const REGION = process.env.REGION || "ap-southeast-2";
const MANAGEMENTAPIKEY = process.env.MANAGEMENTAPIKEY || "management-api-key";

// Create the stack name
const STACK_NAME = `geoicons-serverless-proxy-${STAGE}-stack`;
export class GEOServerlessStack extends cdk.Stack {
    constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new cdk_stack.GEOServerlessStack(this, STACK_NAME, STAGE, REGION, MANAGEMENTAPIKEY);
    }
}

const app = new cdk.App();
new GEOServerlessStack(app, STACK_NAME);
app.synth();
