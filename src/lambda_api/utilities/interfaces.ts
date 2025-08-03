export interface expressResponseType {
    status: number;
    headers?: any;
    type?: string | null;
    cache?: string;
    message?: string;
    data?: any;
}
