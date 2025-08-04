"use strict";
import axios from "axios";
// Import the common type utility - simiplifying and standardising type definitions
import { expressResponseType } from "../utilities/interfaces";

// This method is used to Put
export async function get(request: any) {
    console.log("inside put");

    let response: expressResponseType = {
        status: 400,
        message: "Proxy request received",
    };

    // append the path
    let path = request.path;
    // strip the proxy prefix from the path
    path = path.replace("/proxy/", "");
    let url = `https://dog.ceo/api/${path}`;

    // dogs api
    let axiosConfig = {
        method: "GET",
        url: url,
        headers: {
            "Content-Type": "application/json",
        },
    };

    console.log(axiosConfig);
    response = await axios(axiosConfig);
    console.log(response);

    return response;
}

// This method is used to Put
export async function post(request: any) {
    console.log("inside put");

    let response: expressResponseType = {
        status: 400,
        message: "Proxy request received",
    };

    return response;
}

// This method is used to delete
export async function del(request: any) {
    console.log("inside delete");

    let response: expressResponseType = {
        status: 200,
        message: "Proxy request received",
    };

    return response;
}
