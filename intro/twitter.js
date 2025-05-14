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

//id - unique identifier for each user

// const userid = 3;
// const userProfile = users.find((user) => user.id === userid);
// console.log(userProfile);

//find all user whose name has john
// const searchQuery = "john";
// const filteredUser = users.filter((user) => {
//   return user.name.toLowerCase().includes(searchQuery.toLowerCase());
// });

// console.log(filteredUser);

// const newUser = {
//   name: "David Wilson",
//   email: "davidwilson@gmail.com",
//   password: "1222256",
//   age: 32,
//   isMarried: true,
//   address: "303 Birch St, Anytown, USA",
//   hobbies: ["running", "swimming", "reading"],
// };

// const newUserId = users.length + 1;

//spread operator
// const newUserWithId = {
//   id: newUserId,
//   ...newUser,
// };

// console.log(newUserWithId);

//check if user with email already exists
// const userExists = users.find((user) => user.email === newUserWithId.email);

// if (userExists) {
//   console.log("User with this email already exists");
// } else {
//   users.push(newUserWithId);
//   console.log("User added successfully");
// }

// const loginDetails = {
//   email: "bobdjon@gmail.com",
//   password: "12992s56",
// };

// // check if user with email and password exists
// const userLoginExist = users.find((user) => {
//   return (
//     user.email === loginDetails.email && user.password === loginDetails.password
//   );
// });

// if (userLoginExist) {
//   console.log("Login successful");
//   console.log(userLoginExist);
// } else {
//   console.log("Invalid email or password");
// }

const userUpdate = {
  id: 3,
  name: "Adebanjo Olaoluwa",
};

const userExists = users.find((user) => user.id === userUpdate.id);

if (userExists) {
  const userIndex = users.indexOf(userExists);
  users[userIndex] = {
    ...userExists,
    ...userUpdate,
  };
  console.log(users[userIndex]);
  console.log("User updated successfully");
} else {
  console.log("User not found");
}

const number = [1, 2, 3, 4, 5];

number[1] = 10;

console.log(number);
