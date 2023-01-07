"use strict";


const errorHandler = (err, req, res, next) => {
  console.error(err,"<<error");

  if ([
    "SequelizeValidationError",
    "SequelizeUniqueConstraintError"
  ].includes(err.name)) {
    return res.status(400).json({
      error: true,
      message: err.errors[0]?.message || "Bad Request",
    });
  }

  else if ([
    'SequelizeForeignKeyConstraintError',
    'SequelizeDatabaseError',
  ].includes(err.name)) {
    return res.status(400).json({
      error: true,
      message: 'Bad Request',
    });
  }

  else if (["JsonWebTokenError"].includes(err.name)) {
    return res.status(401).json({
      error: true,
      message: 'Invalid Token',
    });
  }

  if (!isNaN(err.status) && typeof err.message === "string") {
    return res.status(err.status).json({
      error: true,
      message: err.message,
    });
  }

  console.error("[STATUS] UNHANDLED ERROR: 500");
  res.status(500).json({
    error: true,
    message: "Internal Server Error",
  });
}

module.exports = {errorHandler}
