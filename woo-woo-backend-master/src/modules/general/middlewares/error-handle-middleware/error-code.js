/**
 * This is the error code for error handling and sending message to client
 */
// const generateError = (code, msg) => {
//     return {
//         statusCode: code,
//         msg: msg
//     }
// }
// /**
//  * Common errors
//  */
// export const NOT_FOUND = 'Not found';
// export const BAD_REQUEST = 'Bad Request';
// export const UNAUTHORIZED = 'Unauthorized';

// /**
//  * Authentication related errors
//  */
// export const INVALID_PASSWORD = 'Invalid password';
// export const INVALID_EMAIL_PASSWORD = 'Invalid email or password';
// export const EXISTING_EMAIL = 'Email already exists in the system.';

export class GeneralError extends Error {
  constructor(message) {
    super();
    this.message = message;
  }

  getCode() {
    if (this instanceof BadRequest) {
      return 400;
    }
    if (this instanceof NotFound) {
      return 404;
    }
    if (this instanceof Unauthorized) {
      return 401;
    }
    if (this instanceof Forbidden) {
      return 403;
    }
    return 500;
  }
}

export class BadRequest extends GeneralError {
  constructor(message) {
    const errorMessage = message ? message : 'Bad Request';
    super(errorMessage);
  }
}
export class NotFound extends GeneralError {
  constructor(message) {
    const errorMessage = message ? message : 'Not Found';
    super(errorMessage);
  }
}

export class Unauthorized extends GeneralError {
  constructor(message) {
    const errorMessage = message ? message : 'Unauthorized';
    super(errorMessage);
  }
}

export class Forbidden extends GeneralError {
  constructor(message) {
    const errorMessage = message ? message : 'Forbidden';
    super(errorMessage);
  }
}

export default {
  GeneralError,
  BadRequest,
  NotFound,
  Unauthorized,
};
