import express, { Request, Response, NextFunction, RequestHandler } from "express";
import cors from "cors";
import bodyParser from "body-parser";

export const app = express();

// Use body-parser to parse JSON bodies into JS objects
app.use(bodyParser.json({ limit: "6mb" }));
app.use(bodyParser.urlencoded({ limit: "6mb", extended: true }));

// Middleware function for global logging of all requests.
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// CORS options
const corsOptions = {
    origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
        callback(null, true);
    },
    credentials: true, // Required to allow sending cookies in cross-origin requests
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

const codepath = "application";

app.all("/proxy/*", async (req: Request, res: Response, next: NextFunction) => {
    const endpoint = req.path.split("/")[1];
    await handleEndpoint(req, res, endpoint);
});

// Generic endpoint handler
async function handleEndpoint(req: Request, res: Response, endpoint: string) {
    logRequests(req);

    try {
        console.log(`API request to ${endpoint}`);
        const module = await import(`./${codepath}/${endpoint}`);

        let response;
        switch (req.method) {
            case "GET":
                response = await module.get(req);
                break;
            case "POST":
                response = await module.post(req);
                break;
            case "DELETE":
                response = await module.del(req);
                break;
            default:
                res.status(405).json({
                    status: 405,
                    message: "Method not allowed",
                });
                return;
        }

        // Handle response
        if (response.status === 204) {
            res.status(204).end();
        } else {
            response = removeSomeHeaders(response, true);
            if (response.headers) res.set(response.headers);
            if (response.type) res.type(response.type);
            if (response.cache) res.set("Cache-Control", response.cache);
            res.status(response.status).json(response);
        }
    } catch (error: any) {
        console.error(`Error handling ${endpoint} request:`, error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            errors: [error.message || "Unknown error occurred"],
        });
    }
}

// Catch-all route to handle unsupported requests
// Note we need /.*/ instead of /* because Express v 5.0.0+ changed how it handles regex
app.all("/*", async (req: Request, res: Response) => {
    logRequests(req);
    console.log("Unsupported request");
    res.status(404).json({
        status: 404,
        message: "Endpoint not found",
    });
});

// Logging utility to track all requests.
function logRequests(request: Request): boolean {
    console.log("Parameters: ", request.params);
    console.log("Headers: ", request.headers);
    console.log("Body: ", request.body);
    console.log("Query: ", request.query);
    console.log("Path: ", request.path);
    console.log("URL: ", request.url);
    console.log("Method: ", request.method);

    return true;
}

// we dont want certain headers from the backend being sent to the requestor.
function removeSomeHeaders(response: any, all: boolean) {
    const headersToRemove = [
        "accept",
        "accept-language",
        "accept-encoding",
        "access-control-allow-origin",
        "cache-control",
        "host",
        "connection",
        "pragma",
        "sec-fetch-dest",
        "sec-fetch-mode",
        "sec-fetch-site",
        "sec-ch-ua",
        "sec-ch-ua-mobile",
        "sec-ch-ua-platform",
        "user-agent",
        "upgrade-insecure-requests",
        "x-forwarded-for",
        "x-forwarded-proto",
        "x-forwarded-port",
        "x-amzn-trace-id",
        "x-amzn-requestid",
        "x-amzn-remapped-content-length",
        "x-amz-apigw-id",
        "x-powered-by",
        "x-cache",
        "x-amz-cf-pop",
        "x-amz-cf-id",
    ];

    if (all) {
        delete response.headers;
    } else {
        headersToRemove.forEach((header) => {
            if (response.headers?.[header]) {
                delete response.headers[header];
            }
        });
    }

    return response;
}
