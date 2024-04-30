import HTTP_STATUS_CODE from "http-status-codes";

export class HttpException {
  constructor(status: number, message: string | string[]) {
    this.status = status;
    this.message = message;
  }

  status: number;

  message: string | string[];
}

export class UnauthorizedException extends HttpException {
  constructor(message = "Unauthorized") {
    super(HTTP_STATUS_CODE.UNAUTHORIZED, message);
  }
}

export class BadRequestException extends HttpException {
  constructor(message: string | string[] = "Bad Request") {
    super(HTTP_STATUS_CODE.BAD_REQUEST, message);
  }
}

export class InternalServerErrorException extends HttpException {
  constructor(message = "Internal Server Error") {
    super(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, message);
  }
}

export class NotFoundException extends HttpException {
  constructor(message = "Not Found") {
    super(HTTP_STATUS_CODE.NOT_FOUND, message);
  }
}

export class ForbiddenException extends HttpException {
  constructor(message = "Forbidden") {
    super(HTTP_STATUS_CODE.FORBIDDEN, message);
  }
}
