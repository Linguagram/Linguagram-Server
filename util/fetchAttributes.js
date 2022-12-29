"use strict";

const userFetchAttributes = (Media) => {
  return {
    attributes: [
      "id",
      "username",
      "email",
      "country",
      "status",
      "phoneNumber",
      "verified",
      "AvatarId",
    ],
    include: [
      {
	model: Media,
	as: "Avatar",
	},
    ],
  }
}

module.exports = {
  userFetchAttributes,
}
