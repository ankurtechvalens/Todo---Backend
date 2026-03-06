//////////////////////////         closure examples
// let count = 0;
// function outer(){

import { log } from "console";

//     return function inner(){
//         return count++;
//     }
// }

// let getOuter = outer();
// console.log(getOuter());
// console.log(getOuter());
// console.log(getOuter());

//////////////////////////         closure examples - encapsultation means private variable

// function Person(name){
//     let score = 0;
//      return {
//         getName: () => name,
//         getScore: () => score,
//         increaseScoreBy: (n) => score=score+n
//      }
// }

// const person1 = Person("Ankur")

// console.log(person1.getName())
// console.log(person1.getScore())
// console.log(person1.increaseScoreBy(5))
// console.log(person1.getScore())
// console.log(person1.score) // score is not accessible directly


//////////////////////////         closure examples - reusable logics

// function multplyBy(x){
//     return function(y){
//         return x*y;
//     }
// }

// const one = multplyBy(1)
// const two = multplyBy(2)
// const three = multplyBy(3)

// console.log(one(2))
// console.log(two(5))
// console.log(three(10))



//////////////////////////         closure examples - settimeOut problem

// for (var i = 1; i <= 3; i++) {
//     setTimeout(() => {
//         console.log(i);
//     }, 1000);
// }

// for (var i = 1; i <= 3; i++) {
//     function current(i) {
//         setTimeout(() => {
//            console.log(i);
//         }, 1000);
//     };
//     current(i);
// }
//////////////////////
// const obj = {
//     value: undefined,
//     normal: function() {
//         console.log("from normal function: ", this.value);

//         return () => console.log("from inner arrow: ", this.value)
//     },
//     arrow:  () => console.log(this)
// };

// const get = obj.normal(); // 10
// get();


////////////////////


// const myPromiseOne = new Promise((resolve,reject) => {
//     if(true){
//         resolve("Promise Resolveed... one");
//     }else{
//         reject("Promise Rejected..!!! one");
//     }
// })

// const myPromiseTwo = new Promise((resolve,reject) => {
//     if(true){
//         resolve("Promise Resolveed... two");
//     }else{
//         reject("Promise Rejected..!!! two");
//     }
// })

// const myPromiseThree = new Promise((resolve,reject) => {
//     if(false){
//         resolve("Promise Resolveed... three");
//     }else{
//         reject("Promise Rejected..!!! three");
//     }
// })

// const testFunc= async () => {

//     try{
//         const [promiseOne, promiseTwo,promiseThree] = await Promise.allSettled([myPromiseOne, myPromiseTwo,myPromiseThree])
//         console.log("Promise One:", promiseOne);
//         console.log("Promise Two:", promiseTwo);
//         console.log("Promise Three:", promiseThree);
        
//     }catch(err){
//         console.log(err);
//     }
// }

// testFunc();

////////////////////////////////////////////////
// const obj = {
//     name: "Ankur",
//     address: {
//         city: "Indore",
//         pincode: "213456"
//     }
// }

// const copyObj = structuredClone(obj);
// copyObj.name = "Yuvi"
// copyObj.address.city = "Punjab"
// console.log(copyObj.address.city);
// console.log(obj.address.city);
// console.log(copyObj.name);
/////////////////////////////////////////////////////////
// function Person(name) {
//   this.name = name;
// }

// Person.prototype.sayHello = function () {
//   console.log("Hello", this.name);
// };

// Person.prototype.access = function(){
//     console.log("access done", this.name);
// }
// const p1 = new Person("Ankur");

// p1.sayHello();
// p1.access();

// const person = {
//   name: "Ankur"
// };

// function greet(age, city) {
//   console.log(`Hi, I'm ${this.name}, age ${age}, from ${city}`);
// }

// const boundGreet = greet.bind(person, 25, "Delhi");
// boundGreet();

////////////////////////////////////////// created custom event listners in nodejs
// import EventEmitter from "events";
// class MyEmitter extends EventEmitter{};

// const myEventEmit = new MyEmitter();

// myEventEmit.on("greet", (name) => {
//     console.log("Hello, Welcome,,,,,", name);
   
// });
// myEventEmit.on("exit", (name) => {
//     console.log("Byee, See you soon,,,,,", name);
   
// });

// myEventEmit.emit("greet", "ankur");
// myEventEmit.emit("exit", "ankur");


// ===============================
// POLYFILL FOR Promise.all
// ===============================

if (!Promise.myAll) {
  Promise.myAll = function (promises) {
    return new Promise((resolve, reject) => {

      if (!Array.isArray(promises)) {
        return reject(new TypeError("Argument must be an array"));
      }

      let results = [];
      let completedCount = 0;

      if (promises.length === 0) {
        return resolve([]);
      }

      promises.forEach((promise, index) => {

        Promise.resolve(promise)
          .then((value) => {
            results[index] = value;   // maintain order
            completedCount++;

            if (completedCount === promises.length) {
              resolve(results);
            }
          })
          .catch((error) => {
            reject(error); // fail fast
          });

      });

    });
  };
}


// ===============================
// TEST CASES
// ===============================

console.log("Test 1: All Success");

Promise.myAll([
  Promise.resolve(1),
  new Promise(res => setTimeout(() => res(2), 1000)),
  3
])
.then(result => console.log("Success:", result))
.catch(error => console.log("Error:", error));


// ------------------------------

setTimeout(() => {
  console.log("\nTest 2: One Failure");

  Promise.myAll([
    Promise.resolve("A"),
    Promise.reject("Something went wrong"),
    Promise.resolve("C")
  ])
  .then(result => console.log("Success:", result))
  .catch(error => console.log("Error:", error));

}, 2000);


// ------------------------------

setTimeout(() => {
  console.log("\nTest 3: Empty Array");

  Promise.myAll([])
    .then(result => console.log("Success:", result))
    .catch(error => console.log("Error:", error));

}, 3000);


// ------------------------------

setTimeout(() => {
  console.log("\nTest 4: Mixed Values");

  Promise.myAll([
    10,
    Promise.resolve(20),
    new Promise(res => setTimeout(() => res(30), 500))
  ])
  .then(result => console.log("Success:", result))
  .catch(error => console.log("Error:", error));

}, 4000);