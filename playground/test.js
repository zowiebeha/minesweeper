function Obj1() {
  let overrideMe = 2;
  this.test = overrideMe;
}

function Obj2() {
  let overrideMe = 3;
}

Object.setPrototypeOf(Obj2, Obj1);

const newObj2 = new Obj2();
console.log(newObj2.test);
console.log('hi');