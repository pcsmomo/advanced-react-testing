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

const gB = gen(5);
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
const gB = gen(5);
gB.next();
// { value: 5, done: false }
gB.next();
// { value: 15, done: false }
gB.next();
// { value: 25, done: true }
