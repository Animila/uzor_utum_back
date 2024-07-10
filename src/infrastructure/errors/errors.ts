export class CustomError extends Error {
    public readonly statusCode: number;
    public readonly errorMessage: string;

    constructor(statusCode: number, errorMessage: string) {
        super(errorMessage);
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.errorMessage,
        };
    }
}

export class ValidationError extends CustomError {
    constructor(message: string) {
        super(400, message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}