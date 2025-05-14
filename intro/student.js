const student = {
  name: "",
  age: 0,
  isMarried: false,
  address: null,
  hobbies: [],
  gender: "male",
  isEmployed: false,
  isStudent: true,
};

student.name = "John Doe";
student.age = 30;
student.isMarried = false;
student.address = "123 Main St, Anytown, USA";
student.hobbies = ["reading", "traveling", "coding"];

student.hobbies.push("gaming");
student.isEmployed = true;

console.log(student);
