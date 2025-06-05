//FS - api for interacting with the file system

//read, write, delete, rename, and append files
// fs - file system

// const fs = require("fs");
import fs from "fs";
// import fs from "fs"

// console.log("File System");
// fs.readFile("./nodejs/data.txt", "utf8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

// const data = fs.readFileSync("./nodejs/data.txt", "utf8");
// console.log(data);
// console.log("File read successfully");
// fs.writeFile("./nodejs/data.txt", "Backend File", (err) => {
//   if (err) throw err;
//   console.log("File written successfully");
// });

// fs.writeFile("./nodejs/new.txt", "Backend File", (err) => {
//   if (err) throw err;
//   console.log("File written successfully");
// });

//If the file is available, it will be overwritten
// If the file is not available, it will be created, and then written

//Append to a file - append data to a file

// const updateDate = "He came Nigeria for Asylum";
// fs.appendFile("./nodejs/data.txt", updateDate, (err) => {
//   if (err) throw err;
//   console.log("File appended successfully");
// });

fs.ReadStream("./nodejs/data.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// fs.unlink("./nodejs/new.txt", (err) => {
//   if (err) throw err;
//   console.log("File deleted successfully");
// });

// const dir = new fs.Dir("./nodejs", (err, files) => {
//   if (err) throw err;
//   console.log(files);
// });

// console.log(dir);

// fs.mkdir("./nodejs/sapphire", (err) => {
//   if (err) throw err;
//   console.log("Directory created successfully");
// });

fs.stat("./nodejs/all_job_links.json", (err, stats) => {
  if (err) throw err;
  console.log(stats);
});
//fs.readFile
//fs.readFileSync
//

fs.chmod("./nodejs/data.txt", 0o777, (err) => {
//fs.writeFile
//fs.writeFileSync
