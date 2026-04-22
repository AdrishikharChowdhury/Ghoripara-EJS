const BASE_URL = `/images`;
const images = [`woat1.webp`, `woat2.webp`, `woat3.webp`];
let index = 0;

let watchImg = document.querySelector("#watch-img");

const slideshow = () => {
  const current = images[index];
  index = (index + 1) % images.length;
  return current;
};

watchImg.src = `${BASE_URL}/${slideshow()}`;
watchImg.classList.add('animate-fade-in');

setInterval(() => {
  watchImg.style.transition = 'opacity 0.4s ease-out';
  watchImg.style.opacity = '0';
  
  setTimeout(() => {
    watchImg.src = `${BASE_URL}/${slideshow()}`;
    watchImg.style.transition = 'opacity 0.6s ease-in';
    watchImg.style.opacity = '1';
  }, 500);
}, 5000);
