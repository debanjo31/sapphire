//FS - api for interacting with the file system

//read, write, delete, rename, and append files
// fs - file system

// const fs = require("fs");
import fs from "fs";
// import fs from "fs"

fs.readFile("./nodejs/data.txt", (err, data) => {
  if (err) throw err;
  console.log(data);
});
