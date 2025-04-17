import { faceContents } from './data.js';

export function updateContent(faceIndex) {
  const header = document.getElementById('header');
  const description = document.getElementById('description');
  const cta = document.getElementById('cta');

  header.classList.remove('active');
  description.classList.remove('active');
  cta.classList.remove('active');

  setTimeout(() => {
    header.textContent = faceContents[faceIndex].header;
    description.textContent = faceContents[faceIndex].description;
    cta.href = faceContents[faceIndex].cta;
    cta.textContent = "Learn More";

    header.classList.add('active');
    description.classList.add('active');
    cta.classList.add('active');
  }, 150);
}
