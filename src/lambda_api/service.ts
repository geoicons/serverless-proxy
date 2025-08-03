// Setup the express service
import { app } from "./application";
import serverless from "serverless-http";

// Create an instance of the API Gateway event handler
const handler = serverless(app);

// Lambda function handler
export const main = async (event: any, context: any) => {
    // Call the Serverless Express event handler
    const result = await handler(event, context);

    // Return the result
    return result;
};
