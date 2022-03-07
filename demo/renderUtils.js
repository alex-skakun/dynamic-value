export function animationFrameCycle(callback) {
  requestAnimationFrame(() => {
    callback();
    animationFrameCycle(callback);
  });
}
