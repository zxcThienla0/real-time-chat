module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
        this.name = 'ApiError';
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static UnathorizedError() {
        return new ApiError(401, 'Пользователь не авторизован')
    }

    static BadRequestError(message, error = []) {
        return new ApiError(400, message, error)
    }
}