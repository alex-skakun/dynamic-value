Dynamic value
=============

# Usage
```javascript
let value = new DynamicValue(5, 200, '.17,.67,.83,.67');

console.log(value); // prints 5

function render () {
    requestAnimationFrame(() => {
        DynamicValue.tick();
        render();
    });
}

value.transformTo(15); // enables dynamic change from 5 to 15
render();

let interval = setInterval(() => {
    console.log(value); // prints value in range 5..15
    // use == instead of === to compare values or use value.current() === 15
    if (value == 15) {
        value.reset(30); // sets 30 as new start value instead of 15
        clearInterval(interval);
    }
}, 15);





```
