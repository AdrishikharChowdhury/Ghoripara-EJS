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

setInterval(() => {
  watchImg.src = `${BASE_URL}/${slideshow()}`;
}, 5000);
