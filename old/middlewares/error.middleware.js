function errorMiddleware(error, req, res, next) {
  console.error(error);
  if (res.headersSent) {
    return next(error);
  }

  const axiosStatus = error?.response?.status;
  const explicitStatus = error?.status;

  let status = explicitStatus || axiosStatus || 500;

  if (!status && ["ECONNREFUSED", "ENOTFOUND", "ETIMEDOUT", "EAI_AGAIN"].includes(error?.code)) {
    status = 503;
  }

  const payload = {
    message: error.message || "Internal server error"
  };

  if (error?.response?.data) {
    payload.details = error.response.data;
  }

  if (error?.code) {
    payload.code = error.code;
  }

  return res.status(status).json(payload);
}

module.exports = errorMiddleware;