// 设置html根元素的font-size
module.exports = (function () {
  function autoRootFontSize() {
    document.documentElement.style.fontSize = Math.min(screen.width, document.documentElement.getBoundingClientRect().width) / 375 * 16 + 'px';
  }
  window.addEventListener('resize', autoRootFontSize);
  autoRootFontSize();
})()