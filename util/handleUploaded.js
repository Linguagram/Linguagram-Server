"use strict";

const { readFileSync, unlinkSync } = require("fs");
const { imagekit } = require("./imagekit");
const { Media } = require("../models")

const handleUploaded = async (reqFile) => {
  // =============== Begin upload processing

  console.log(reqFile);

  const { mimetype, filename, path } = reqFile;

  // read uploaded file
  const file = readFileSync(path);

  console.log("Uploading to imagekit");
  const ikRes = await imagekit.upload({
    file : file,
    fileName : filename,
  });

  console.log(ikRes);

  console.log("Deleting uploaded file from server");
  unlinkSync(path);

  // save to database
  const createMedia = {
    name: ikRes.name,
    url: ikRes.url,
    format: mimetype,
  }

  return Media.create(createMedia);

  // =============== End upload processing
}

module.exports = handleUploaded;
