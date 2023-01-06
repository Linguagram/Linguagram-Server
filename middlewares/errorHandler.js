"use strict";

const errorHandler2 = (err, req, res, next) => {
  let code = 500
  let message = 'Internal Server Error'
  console.log(err)
	
  if (err.name === 'SequelizeValidationError') {
    code = 400
    message = err.errors[0].message
  }
  else if(err.name === 'SequelizeUniqueConstraintError') {
    code = 400
    message = 'Email has already been registered'
  } 
  else if (err === 'Email is required' || err === 'Password is required') {
      code = 401
      message = err
    }
  else if (err === 'Invalid email/password') {
    code = 401
    message = err
  }
  else if (err === 'Invalid Link' || err === 'Your email address has been verified') {
    code = 401
    message = err
  }
  else if(err === 'Invalid token' || err.name === "JsonWebTokenError") {
    code = 401
    message = 'Invalid Token'
  }
  else if (err === 'Email address has not been verified!') {
    code = 401
    message = err
  }
  else if(err === 'Data not found') {
    code = 404
    message = err
  }
  else if (err === 'Forbidden') {
    code = 403
    message = 'Forbidden'
  } else if (err === 'This movie is already bookmarked') {
    code = 400
    message = err
  }

  res.status(code).json({message})
}

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if ([
    "SequelizeValidationError",
    "SequelizeUniqueConstraintError"
  ].includes(err.name)) {
    return res.status(400).json({
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
