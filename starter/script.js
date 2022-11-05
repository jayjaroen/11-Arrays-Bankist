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

const displayMovements = function (movements) {
  containerMovements.innerHTML = ''; /// start with empty value
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
   <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
   <div class="movements__value">${mov}€</div>
 </div>
   `;
    containerMovements.insertAdjacentHTML('afterbegin', html); // take two agruments(the style and the thing that we want to insert)
  });
};

const calcPrintBalance = function (movements) {
  const balance = movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${balance} €`;
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

//////// Adding event listener ////////////////

let currentAccount; /// define outside of the function because you need to call it again

btnLogin.addEventListener('click', function (e) {
  //// prevent form from submiting
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
    ///// Display movements /////////////
    displayMovements(currentAccount.movements);
    ////// Display balance ///////////
    calcPrintBalance(currentAccount.movements);
    ///////Display summary ////////////////
    calcDisplaySummary(currentAccount);
  }
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
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

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
