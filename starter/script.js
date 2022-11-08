'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; /// start with empty value
  //// need to use slice() method first, otherwise the sort method will sort the original array
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
   <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
   <div class="movements__value">${mov}€</div>
 </div>
   `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // take two agruments(the style and the thing that we want to insert)
  });
};

const calcPrintBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${income}€`;

  const withdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  // console.log(withdraw);
  labelSumOut.textContent = `${Math.abs(withdraw)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      return interest >= 1;
    })
    .reduce((acc, interest) => (acc += interest), 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = function (accounts) {
  accounts.forEach(function (account) {
    /// add username to the accounts array/ modified the array, not returning a new one
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(str => str[0])
      .join('');
  });
};
createUserNames(accounts);
// console.log(accounts);

//////// NOTE Adding event listener ////////////////

let currentAccount; /// define outside of the function because you need to call it again
const updateUI = function (acc) {
  ///// Display movements /////////////
  displayMovements(acc.movements);
  ////// Display balance ///////////
  calcPrintBalance(acc);
  ///////Display summary ////////////////
  calcDisplaySummary(acc);
};

btnLogin.addEventListener('click', function (e) {
  //// prevent form from submiting, it will reload the page
  e.preventDefault();
  console.log('login');
  /// reading the value out of the input field (.value)
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  ///// optional chaining '?' the pin will be read if the property exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log('login');
    ///// Display UI and messages /////////
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    ////// Clear Input field /////////
    ////NOTE "=" read from right to left ///////
    inputLoginUsername.value = inputLoginPin.value = '';
    //// blur the cursor in the input login field
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

////// Implementing Transfer ///////////
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);
  // console.log(amount, receiverAcc);
  // console.log(currentAccount.balance);
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //////// tranferring the money
    console.log('tranfer valid');
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    /////// updating the current account
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    /// add the movement
    currentAccount.movements.push(amount);

    /////update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    //// Delete account //////
    accounts.splice(index, 1); /// the second argument, the number of the deleted element
    ///splice methods mutate the original array
    ///// Hide UI ///////
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});

let sorted = false;
// state variable to see if we sorted the array or not
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted; // change the state,
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// //////////// Note from the lecture//////////////////
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// const arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice()); /// shadow copy?
// console.log([...arr]); /// same as slice
// console.log(arr.slice(1)); // taking the array starting from the index 1
// console.log(arr.slice(0, -2)); // the first parameter is the staring index, the second parameters is the ending ( doesn't include)
// console.log(arr.slice(-1));
// console.log(arr.slice(-2, -1));

// /////// splice -- change the orginal array/////
// console.log(arr.splice(2));
// console.log(arr);

// //// reverse //////////// change the original array as well
// const arr2 = ['z', 'x', 'y', 'w', 'i'];
// console.log(arr2.reverse());
// console.log(arr2);

// //// concat /////
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// ///// join/////
// console.log(letters.join('-'));

// const arr3 = [11, 12, 13];
// console.log(arr3[0]);
// console.log(arr3.at(0));

// ///// getting the last element of an array ////////
// console.log(arr3[arr3.length - 1]);
// console.log(arr3.at(-1));
// console.log(arr3.slice(-1)); /// result as an array
// console.log(arr3.slice(-1)[0]); /// take the value of an array

// //// at method also work for a string
// console.log('jay'.at(0));
// console.log('jay'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }

// console.log('\\\\\\\\\\\\\forEach////////////');

// /// argument of function in forEach - the first is current element , second is an index, third is an array
// movements.forEach(function (movement, i, array) {
//   if (movement > 0) {
//     console.log(`Movement${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement${i + 1}:You withdrew ${Math.abs(movement)}`);
//   }
// });

// const currencies1 = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// ///agrument -> the value come before key
// currencies1.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// const currencies2 = new Set(['USD', 'USD', 'EUR', 'EUR', 'GBP']);
// console.log(currencies2);

// currencies2.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// /// _ underscroll in JS means throw away variable

///// Coding Challenge 1 //////

////// 1. create a checkdog function ///////
// const juliaDog = [3, 5, 2, 12, 7];
// // data2: [9, 16, 6, 8, 3],

// const kateDog = [4, 1, 15, 8, 3];
// // data2: [10, 5, 6, 1, 4],
// const checkDogs = function (juliaDogs, kateDogs) {
//   const juliaCorrect = juliaDogs.slice(1, -2);
//   console.log(juliaCorrect);
//   const dogs = juliaCorrect.concat(kateDogs);
//   console.log(dogs);
//   dogs.forEach(function (value, index) {
//     value >= 3
//       ? console.log(
//           `Dog number ${index + 1} is an adult and is ${value} years old`
//         )
//       : console.log(
//           `Dog number ${index + 1} is an puppy and is ${value} years old`
//         );
//   });
// };
// checkDogs(juliaDog, kateDog);

// ///Data 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3] § Data 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
// ////////////////NOTEMap to array///////////
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;
// const usdMovements = movements.map(function (mov) {
//   return mov * euroToUsd;
// });
// const usdMovements1 = movements.map(mov => mov * euroToUsd);

// //// different paradigm from map method, map using the function to solve the problem
// const usdMovementFor = [];
// for (const mov of movements) usdMovementFor.push(mov * euroToUsd);
// console.log(usdMovementFor);

// console.log(usdMovements);
// console.log(usdMovements1);

// const movementsDescription = movements.map(
//   (mov, i) =>
//     `Movement${i + 1}: You ${mov > 0 ? 'deposit' : 'withdrew'} ${Math.abs(mov)}`
// );
// console.log(movementsDescription);

/////////NOTE filter function /////////////////////
// const deposit = movements.filter(function (mov) {
//   return mov > 0; /// if it's true pass into an array
// });

// const depositFor = [];
// for (const mov of movements) if (mov > 0) depositFor.push(mov);
// console.log(depositFor);

// const withdraw = movements.filter(mov => mov < 0);
// const withdrawFor = [];
// for (const mov of movements) if (mov < 0) withdrawFor.push(mov);
// console.log(withdrawFor);

// console.log(deposit);
// console.log(withdraw);
// ///////////////////////NOTE reduce method /////////////////////
// /////accomulator - snowballing of the current element

// const balance = movements.reduce(function (acc, mov, i, arr) {
//   console.log(`Movement ${i}: balance ${acc}`);
//   return acc + mov;
// }, 0);
// ///// second argument of the reduce method, 0 here is the initial value of the accumlator of the first loop iteration

// console.log(balance);

// const balanceArrow = movements.reduce((acc, mov) => acc + mov, 0);
// console.log(balanceArrow);

// let sum = 0;
// for (const mov of movements) sum += mov;
// console.log(sum);

// /////// reduce method to get a maximum value //////

// const maximumValue = movements.reduce(
//   (acc, mov) => (acc > mov ? acc : mov),
//   movements[0]
// );
// console.log(maximumValue);

///// Coding challenge 2 : practing map, fiter and reduce methods/////////
// const calcAverageHumanAge = function (dogAges) {
//   const humanAgeDog = dogAges.map(function (age) {
//     return age <= 2 ? age * 2 : 16 + age * 4;
//   });
//   console.log(humanAgeDog);
//   const adultDog = humanAgeDog.filter(age => age >= 18);
//   console.log(adultDog);
//   const averAdultDog =
//     // adultDog.reduce((acc, age) => (acc += age), 0) / adultDog.length;
//     /// NOTE alernative way of calculating average
//     /// (2 +3)/2 = 2.5 === 2/2+3/2= 2.5 same logic as below
//     adultDog.reduce((acc, age, i, arr) => (acc += age / arr.length), 0);
//   return averAdultDog;
// };
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// /////////// channing method ////////////////////////
// const euroToUsd = 1.1;
// const totalDeposit = movements
//   .filter(mov => mov > 0)
//   .map(
//     (mov, i, arr) =>
//       // console.log(arr);
//       mov * euroToUsd
//   )
//   // .map(mov => mov * euroToUsd)
//   .reduce((arr, mov) => (arr += mov), 0);
// console.log(totalDeposit);

// /////////////// coding challenge 3 - chaining method //////
// const calcAverageHumanAge2 = dogAges => {
//   const averAdultDog2 = dogAges
//     .map(age => (age <= 2 ? age * 2 : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => (acc += age / arr.length), 0);
//   return averAdultDog2;
// };
// console.log(calcAverageHumanAge2([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge2([16, 6, 10, 5, 6, 1, 4]));

// ////////////////// find method NOTE only take out one element int the array that satisfy the condition ////////////////
// ////// result of find method return Boolean
// ///// NOTE filter method return an array, while 'find' method result the element itself, not an array
// const withdrawal1 = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(withdrawal1);

// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Sarah Smith');
// console.log(account);

// const accountFor = [];
// for (const acc of accounts)
//   if (acc.owner === 'Sarah Smith') accountFor.push(acc.owner);
// console.log(accountFor);

// /// NOTE optional chaining ?

////NOTE some and every method
console.log(movements);
console.log(movements.includes(-130)); // equality

const anyDeposit1 = movements.some(mov => mov > 0); /// function
console.log(anyDeposit1);
/// return Boolean value

///// Every method - every element in the arry satify the condition
///// return a boolean value
console.log(account4.movements.every(mov => mov > 0));

//// separate callback function
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//// NOTE Flat and Flatmap method //////
///// introduced in ES2019 /////////

//Flat combine the nested array, can go deeper into one level -- default is at 1
//Flatmap can create a new map array and combine at only one level

console.log([2, 3, 4, 5, 6, [3, 4, 5]].flat());
console.log([2, [3, [4, 5], 6], [3, [4, 5]]].flat(2));

////flat method ////////
const totalBalanceAllAcc = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((accum, mov) => accum + mov, 0);
console.log(totalBalanceAllAcc);

////flatMap ///////////

const totalBalanceAllAcc2 = accounts
  .flatMap(acc => acc.movements) /// map method but in the end flatten the result
  .reduce((accum, mov) => accum + mov, 0);
console.log(totalBalanceAllAcc2);

/// quite common to use map and then flatten the operation is pretty common

///////////// Sort method ///////////////////
/// sort the string ////////
const friends = ['freen', 'becky', 'bonbon'];
console.log(friends.sort());
/// mutate the original array ////

/// compare callback function //////
///.sort(a,b) === current value, b === next value
//// if return < 0 / a,b (keep order)
///// if return > 0 / b,a (swith order)
//// ascending/////
movements.sort((a, b) => a - b); /// same as below
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
console.log(movements);

//// descending
movements.sort((a, b) => b - a);
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });

console.log(movements);
console.log([1, 2, 3, 4, 94, -3].sort((a, b) => b - a));

//////// Creating and filling the array ////////////

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
///// new Array(7) create
const arr1 = new Array(7);
console.log(arr1);
////// fill method to fill the array, it mutates the array.
////// the first argument is that value that you want to fill in
////// the second & third argument is the staring and end value
arr1.fill(1, 3, 5);
console.log(arr1);

//// Array.from (///.from using it on an array constructor / calling the from method on the array function)
const arr2 = Array.from({ length: 8 }, () => 2);
console.log(arr2);

const arr3 = Array.from({ length: 8 }, (_, i) => i + 1);
console.log(arr3);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
  /// Array from, can covert the text as a second function agrgument
  // console.log(movementsUI.map(el => Number(el.textContent.replace('€', ''))));
  /// can also do spread operator with the map method
  const movementsUI2 = [...document.querySelectorAll('.movements__value')];
  console.log(movementsUI2);
});

//////// Array practice ///////////
////Excercise 1
const bankDeposit = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, mov) => sum + mov, 0);

console.log(bankDeposit);
///// Excercise 2
// const countDeposit1000 = accounts
//   .flatMap(acc => acc.movements)
//   .filter(mov => mov >= 1000).length;
// console.log(countDeposit1000);

const countDeposit10002 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
// .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);
//// can use reduce method to count something in an array
console.log(countDeposit10002);

let a = 10;
console.log(a++); /// return 10 / return the before value
console.log(a); //// return 11
console.log(++a); /// return 12 /// prefix ++ operator

///// Exercise 3
const { deposit1, withdraw } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, mov) => {
      // mov > 0 ? (sums.deposit1 += mov) : (sums.withdraw += mov);
      sums[mov > 0 ? 'deposit1' : 'withdraw'] += mov;
      return sums;
    },
    { deposit1: 0, withdraw: 0 }
  );
console.log(deposit1, withdraw);

////// Excercise 4 //////
const convertTitleCase = function (title) {
  const exceptions = ['a', 'love', 'the', 'an', 'in'];
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const caseTitle = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(caseTitle);
};
console.log(convertTitleCase('I love coding in the garden'));

//////// Coding Challenge 4 ///////////
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// Q1 adding recommended food option into a dog array
// adding a property in to dog object
/// mutate the array
dogs.forEach(
  dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
);
console.log(dogs);

////// Q2 Find Sarah dog and see if her dog eat too much or too little
///NOTE what is the different between FIND & Filter
const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog.curFood);
console.log(
  `Sarah's dog is eating ${
    sarahDog.curFood > sarahDog.recommendedFood ? 'much' : 'little'
  }`
);
//// The below method works for filter ////////
// const see = sarahDog.forEach(key => {
//   console.log(key.curFood, key.recommendedFood);
//   if (
//     key.curFood > key.recommendedFood * 0.9 &&
//     key.curFood < key.recommendedFood * 1.1
//   ) {
//     console.log(`The dog dietary is balance`);
//   }
//   if (key.curFood > key.recommendedFood * 0.91) {
//     console.log(`The dog eats too much`);
//   }
//   if (key.curFood < key.recommendedFood * 1.2) {
//     console.log(`The dog eats too little`);
//   }
// });

///// Q3 Create an array for an owner of dogs that eat too much and dogs that eats too little
const ownerEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recommendedFood)
  .flatMap(dog => dog.owners);

console.log(ownerEatTooMuch);

const ownerEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recommendedFood)
  .flatMap(dog => dog.owners);
console.log(ownerEatTooLittle);

/////// Q4 log the array of the two owner in the the console //////
///replace()
console.log(`${ownerEatTooMuch.join(' and ')}'s dogs eat too much`);

console.log(
  `${ownerEatTooLittle
    .join(' ')
    .replaceAll(' ', ' and ')}'s dogs eat too little`
);

////////Q5 log to the console if there is any dog eat the same amount of the recommended food?
const sameAmount = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(sameAmount);

//////// Q6 log to the console if there is any dog eat an OK amount of food ///////
const okAmount = dog =>
  dog.curFood > dog.recommendedFood * 0.9 &&
  dog.curFood < dog.recommendedFood * 1.1;
/// save to the function
console.log(dogs.some(okAmount));

///////Q7 create an array of dogs that eat an OK amount
const dogOkAmount = dogs.filter(okAmount);
console.log(dogOkAmount);

///////Q8 create a shallow of copy of dogs and sort the recommendedfood in ascending order )
//// answer
const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsCopy);
