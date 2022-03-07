import { DynamicValue } from '../dist';
import { animationFrameCycle } from './renderUtils';


let squareEl = document.getElementById('square');
let startValue = 100;
let endValue = 200;
let transitionDurationMs = 300;
let cubicBezierString = '.07,.85,.18,.99';
let scaling = false;

let dynamicValue = new DynamicValue(startValue, transitionDurationMs, cubicBezierString);

squareEl.addEventListener('click', () => {
  if (scaling) {
    dynamicValue.transformTo(startValue);
    scaling = false;
  } else {
    dynamicValue.transformTo(endValue);
    scaling = true;
  }
});

animationFrameCycle(() => {
  // triggers calculations for all instances of DynamicValue
  DynamicValue.tick();
  // function that reads current value of DynamicValue instance
  render();
});

function render () {
  squareEl.style.height = `${dynamicValue}px`;
  squareEl.style.width = `${dynamicValue}px`;
}
