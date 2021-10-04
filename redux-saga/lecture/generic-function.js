function* genA() {
  console.log("a");
  console.log("b");
}

const gA = genA();
gA.next();
// { value: undefined, done: true }

function* genB(i) {
  yield i;
  yield i + 10;
}

const gB = genB(5);
const aObj = gB.next();
// { value: 5, done: false }
const bObj = gB.next();
// { value: 15, done: false }
const cObj = gB.next();
// { value: undefined, done: true }

function* genC(i) {
  yield i;
  yield i + 10;
  return 25;
}
const gC = genC(5);
gC.next();
// { value: 5, done: false }
gC.next();
// { value: 15, done: false }
gC.next();
// { value: 25, done: true }
