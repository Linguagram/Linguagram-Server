"use strict";

const validateGroupId = (groupId) => {
  const retGroupId = Number(groupId);
  if (isNaN(retGroupId)) {
    console.error("Invalid groupId:", groupId);
    throw {
      status: 400,
      message: "Invalid groupId",
    };
  }

  return retGroupId;
}

module.exports = {
  validateGroupId,
}
