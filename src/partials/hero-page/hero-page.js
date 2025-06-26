const icon = document.querySelector('.hero__icon');

icon.addEventListener('mouseenter', () => {
  icon.style.transition = 'transform 0.6s ease';
  icon.style.transform = 'rotate(360deg)';
});

icon.addEventListener('mouseleave', () => {
  icon.style.transform = 'rotate(0deg)';
});