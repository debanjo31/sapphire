// // class is a blueprint for creating object with shared properties(data) and methods(functions)
// //into to object oriented programming

// //class can organize code for resuable template

// //car class

// class Car {
//   constructor(color, model, year, speed) {
//     this.color = color;
//     this.model = model;
//     this.year = year;
//     this.speed = speed;
//   }

//   start() {
//     console.log(`A ${this.year} car has been created`);
//   }
//     stop() {
//         console.log(`A ${this.year} car has been stopped`);
//     }

// }

// //class keyword is used to tell Javascript a class has been created
// //constructor - function that run when  you create an object
// // thia referes to the specific instance of class
// // methods - functions that belong to the class

// //creating an object

// let myNewCar = new Car("red", "Toyota", 2020, 120);
// let myNewCar2 = new Car("blue", "Honda", 2021, 130);
// let myNewCar3 = new Car("green", "Ford", 2022, 140);

// //

// let startYear = myNewCar.start();

class Student {
  constructor(name, cohort, course, category) {
    this.category = category;
    this.name = name;
    this.cohort = cohort;
    this.course = course;
  }

  createStudent() {
    console.log(`A student named ${this.name} has been created`);
    //database function
    // this.saveToDatabase();
  }

  updateStudentCategory(newCategory) {
    this.category = newCategory;
    console.log(`Student category has been updated to ${this.category}`);
  }

  deleteStudent() {
    console.log(`Student ${this.name} has been deleted`);
  }
}

let israel = new Student("Israel", "Cohort 1", "Frontend");

let chuka = new Student("Chuka", "Cohort 2", "Backend");

israel.createStudent();
chuka.createStudent();

function createStudent(name, cohort, course, category) {
  var age = 20;
  let name = "Israel";
}

//loop
for (let i = 0; i < 10; i++) {
  console.log(i);
}

for (let i = 0; i < 10; i++) {
  console.log(i);
}
for (let i = 0; i < 10; i++) {
  console.log(i);
}
for (let i = 0; i < 10; i++) {
  console.log(i);
}

student = 23;
let stude = 30;

// 10,000;

class Person {
  constructor(name) {
    this;
  }

  greeting() {
    console.log(`Hello, my name is ${this.name}`);
  }
}

let person1 = new Person("Mairam");
person1.greeting();

fetch("https://jsonplaceholder.typicode.com/posts")
  .then((response) => {})
  .catch((error) => {})
  .finally(() => {});

async function fetchData() {
  try {
    // const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  } catch (error) {
    // Handle error
  }
}
