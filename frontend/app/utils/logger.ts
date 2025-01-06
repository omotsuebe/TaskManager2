export class Logger {

    static error(error: Error, message: string="Error details"): void {
        const errorDetails = this.formatError(error);

        if (process.env.NODE_ENV === "development") {
            console.error(message+":", errorDetails);
        } else if (process.env.NODE_ENV === "production") {
            //this.logToFile(errorDetails);
        } else {
            // Fallback for other environments (e.g., testing)
            console.warn("Unhandled NODE_ENV setting, error:", errorDetails);
        }
    }

    static log(data: unknown = null) {
        if (process.env.NODE_ENV === 'development') {
            console.log(data);
        }
    }

    static trace(error: unknown, message: string = "Trace Info: ") {
        if (process.env.NODE_ENV === 'development') {
            console.trace(message, error);
        }
    }

    private static formatError(error: Error): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] ${error.name}: ${error.message}\nStack: ${error.stack}\n`;
    }
}

export class AppError extends Error {
    status: number;

    constructor(message: string, status: number = 500) {
        super(message);
        this.name = this.constructor.name;
        this.status = status;
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
    }
}

export class ValidationError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = "ValidationError";
        this.status = status;
    }
}

