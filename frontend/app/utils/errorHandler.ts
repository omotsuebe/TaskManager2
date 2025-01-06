
export function processError(error: unknown): string[] {
    if (error instanceof Error) {
        // If it's a standard JavaScript error, split its message into an array
        return error.message.split('. ').filter((msg) => msg);
    } else {
        // Return a generic error message if it's not an instance of Error
        return ['An unknown error occurred'];
    }
}
