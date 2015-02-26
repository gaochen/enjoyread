function* generator() {
    yield 'hehe';
    yield 'xixi';
}

var a = generator();

console.log(a.next().value);
console.log(a.next().value);
console.log(a.next().value);
