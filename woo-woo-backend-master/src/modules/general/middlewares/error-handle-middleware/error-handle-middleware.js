import { GeneralError } from './error-code';

const handleErrors = (err, req, res, next) => {
  console.log(err);
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
    });
  }

  return res.status(400).json({
    status: 'error',
    message: err.message,
  });
};

export default handleErrors;
