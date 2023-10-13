import { ErrorCode, HttpException } from "./root";

export class BadRequestsException extends HttpException {
    constructor(message: string, errorCode:ErrorCode, errors?:any) {
        super(message, errorCode, 400, errors);
    }
}