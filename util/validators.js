"use strict";

const validateNumber = (num, errorMessage, toThrow) => {
  const retNum = Number(num);
  if (isNaN(retNum)) {
    console.error("[VALIDATOR NUMBER]", errorMessage + ":", num);
    throw toThrow;
  }

  return retNum;
}

const restValidator = (type, value, errorMessage, status = 400) => {
  switch(type) {
    case "number": return validateNumber(value, errorMessage, {
      status: status,
      message: errorMessage,
    });
  }
}

const wsValidator = (type, value, errorMessage) => {
  switch(type) {
    case "number": return validateNumber(value, errorMessage, new TypeError(errorMessage));
  }
}

const validateGroupId = (id) => {
  return restValidator("number", id, "Invalid groupId");
}

const validateUserId = (id) => {
  return restValidator("number", id, "Invalid userId");
}

const validateMessageId = (id) => {
  return restValidator("number", id, "Invalid messageId");
}

module.exports = {
  validateNumber,
  restValidator,
  wsValidator,
  validateGroupId,
  validateUserId,
  validateMessageId,
}
