import http from "http";
import url from "url";

// const server = http.createServer((req, res) => {
//   //   res.writeHead(200, { "Content-Type": "text/plain" });
//   //   res.end("Bye bye!\n");
//   //   res.writeHead(200, { "Content-Type": "text/html" });
//   //   res.end("<body><h1>Hello World!</h1></body></html>");

//   res.writeHead(200, { "Content-Type": "text/json" });
//   res.end('{"message": "Hello World!"}\n');
// });

//GET, POST, PUT, PATCH, DELETE are HTTP methods used to perform actions on resources

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "johndoe@gmail.com",
    password: "123456",
    age: 30,
    isMarried: false,
    address: "123 Main St, Anytown, USA",
    hobbies: ["reading", "traveling", "coding"],
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@gmail.com",
    password: "122456",
    age: 25,
    isMarried: true,
    address: "456 Elm St, Anytown, USA",
    hobbies: ["cooking", "hiking", "painting"],
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bobdjon@gmail.com",
    password: "12992s56",
    age: 40,
    isMarried: false,
    address: "789 Oak St, Anytown, USA",
    hobbies: ["gaming", "photography", "music"],
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alicebrown@gmail.com",
    password: "1222256",
    age: 35,
    isMarried: true,
    address: "101 Pine St, Anytown, USA",
    hobbies: ["writing", "traveling", "yoga"],
  },
  {
    id: 5,
    name: "Charlie Davis",
    email: "charlie@gmail.com",
    password: "122456",
    age: 28,
    isMarried: false,
    address: "202 Maple St, Anytown, USA",
    hobbies: ["sports", "cooking", "reading"],
  },
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  const parselUrl = url.parse(req.url, true);
  const pathname = parselUrl.pathname;
  const query = parselUrl.query;
  console.log("Request URL:", req.url);
  if (req.url === "/" && req.method === "GET") {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Sever Alive" }));
  } else if (req.url === "/users" && req.method === "GET") {
    console.log(req);
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "All Users is here", users }));
  } else if (req.method === "GET" && pathname.startsWith("/users/")) {
    const userId = pathname.split("/")[2];
    const user = users.find((user) => user.id == parseInt(userId));
    if (user) {
      res.statusCode = 200;
      res.end(JSON.stringify({ message: "User found", user }));
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "User not found" }));
    }
  } else if (req.method === "GET" && pathname.startsWith("/users")) {
    console.log(query);
    if (query) {
      const searchQuery = query.name.toLowerCase();
      console.log("Search Query:", searchQuery);
      const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchQuery);
      });
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          message: "Filtered Users",
          length: filteredUsers.length,
          users: filteredUsers,
        })
      );
    } else {
      res.statusCode = 404;
      res.end(JSON.stringify({ error: "Not Found" }));
    }
  } else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

//http.createServer is a method that creates an HTTP server and listen for request
// res.writeHead is used to set the response status code and headers
// res.end is used to send the response back to the client
// sever.listen is used to start the server and listen on a specific port

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
