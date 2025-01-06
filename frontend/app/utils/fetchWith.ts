import {AppError, Logger, ValidationError} from "~/utils/logger";

export interface RetryOptions {
    retries: number; // Number of retry attempts
    delay?: number; // Delay between retries in milliseconds
}

export type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface FetchOptions<T = unknown> {
    method?: FetchMethod;
    headers?: Record<string, string>;
    body?: T;
    token?: string; // Optional Bearer Token
}

interface ValidationData {
    type: string;
    msg: string;
    path: string;
    location: string;
}

interface ValidationModel {
    status: string;
    message: string;
    data: ValidationData | ValidationData[]; // Support both single and array
}

export function handleApiErrors(errorData: ValidationModel): never {
    if (errorData?.data) {
        if (Array.isArray(errorData.data)) {
            // Extract and join all error messages from the `data` array
            const messages = errorData.data.map((err: ValidationData) => err).join(', ');
            Logger.log(`Validation Error Array (400): ${messages || errorData.message || 'An unknown error occurred.'}`);
            throw new ValidationError(messages || errorData.message || 'Validation error occurred.', 400);
        } else {
            const message = errorData.data.msg || errorData.message;
            Logger.log(`Validation Error (400): ${message}`);
            throw new ValidationError(message || 'Validation error occurred.', 400);
        }
    } else if (errorData?.message) {
        Logger.log(`Validation Error (400): ${errorData.message}`);
        throw new ValidationError(errorData.message, 400);
    } else {
        Logger.log('Validation Error (400): An unknown error occurred.');
        throw new ValidationError('An unknown error occurred.', 400);
    }
}

export const fetchWith = async <T = unknown, B = unknown>(
    url: string,
    options: FetchOptions<B> = {},
    retryOptions?: RetryOptions
): Promise<T> => {
    const {
        method = "GET",
        headers = {},
        body,
        token,
    } = options;

    const config: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        ...(body && { body: JSON.stringify(body) }),
    };

    const attemptFetch = async (retryCount: number): Promise<T> => {
        try {
            const response = await fetch(url, config);

            if (!response.ok) {
                const errorData: ValidationModel = await response.json();
                handleApiErrors(errorData);
            }

            return await response.json();
        } catch (error) {
            if (retryCount > 0) {
                Logger.log(`Retrying... Attempts left: ${retryCount}`);
                if (retryOptions?.delay) {
                    await new Promise((resolve) => setTimeout(resolve, retryOptions.delay));
                }
                return attemptFetch(retryCount - 1);
            }

            if (error instanceof ValidationError) {
                Logger.log(error.message);
                throw error;
            } else if (error instanceof AppError) {
                Logger.error(error, "FetchWith: An unexpected error occurred.");
                throw new Error(error.message);
            }
            throw new Error("An unexpected error occurred.");
        }
    };

    return attemptFetch(retryOptions?.retries ?? 0);
};
