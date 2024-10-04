function computerCount(num) {
  const result = num + " компьютер";
  let add;
  if (num % 10 === 1 && num % 100 !== 11 && num !== 11) {
    add = "";
  } else if (
    (num % 10 === 2 || num % 10 === 3 || num % 10 === 4) &&
    num % 100 !== 12 &&
    num !== 12 &&
    num % 100 !== 13 &&
    num !== 13 &&
    num % 100 !== 14 &&
    num !== 14
  ) {
    add = "а";
  } else {
    add = "ов";
  }
  return result + add;
}
// console.log(foo(1));
// console.log(foo(12));
// console.log(foo(13));
// console.log(foo(14));
// console.log(foo(11));
// console.log(foo(41));
// console.log(foo(33));
// console.log(foo(6));
// console.log(foo(66));
// console.log(foo(22));
// console.log(foo(2211));
// console.log(foo(2212));

function delArr(arr) {
  const result = [];

  for (let i = 2; i < Math.max(...arr) / 2 + 1; i++) {
    let check = false;

    for (let el of arr) {
      if (el % i !== 0) check = true;
    }

    if (!check) result.push(i);
  }
  return result;
}

// console.log(delArr([42, 12, 18]));

function simpleNums(start, end) {
  const result = [];

  for (let i = start; i <= end; i++) {
    let check = false;

    for (let j = 2; j < i / 2 + 1; j++) {
      if (i % j === 0) {
        check = true;
        break;
      }
    }

    if (!check && i > 1) result.push(i);
  }
  return result;
}

// console.log(simpleNums(1, 29));

function multiTable(num) {
  for (let i = 0; i <= num; i++) {
    let row = "";
    for (let j = 0; j <= num; j++) {
      if (i === 0) {
        row += j === 0 ? " " : (1 * j).toString().padStart(4, " ");
        continue;
      }
      row += j === 0 ? i : (i * j).toString().padStart(4, " ");
    }
    console.log(row);
  }
}

multiTable(3);
