import 'modern-normalize/modern-normalize.css';

import { fetchAndShowDetails } from '../partials/modal/modal';
import { renderQuote } from '../partials/quote/quote';

export const FAVORITES_KEY = 'yourEnergyFavorites';

const PER_PAGE = window.screen.width < 768 ? 8 : 6;

document.addEventListener('DOMContentLoaded', () => {
  renderQuote();
  renderFavorites();
});

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1) + '...';
}

function capitalizeFirstLetter(string) {
  if (string && string.charAt(0)) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    return string;
  }
}

function renderFavorites(page = 1) {
  const data = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const start = (page - 1) * PER_PAGE;
  const currentPageItems = data.slice(start, start + PER_PAGE);
  const notFound = document.getElementById('favorites-notfound');
  const list = document.getElementById('favorites-list');
  const pagination = document.getElementById('pagination');

  if (data.length === 0) {
    notFound.style.display = 'block';
    list.innerHTML = '';
    pagination.innerHTML = '';
    return;
  }

  notFound.style.display = 'none';
  list.innerHTML = currentPageItems
    .map(
      ex => `
    <li class="exercise-card">
    <div class="exercise-card-header">
   
<div class="exercise-card-workout-box">
      <p class="exercise-card-workout-text">WORKOUT</p>
   
    <button class="exercise-card-workout-button" workout-id="${ex._id}">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10.6667 4.00004V3.46671C10.6667 2.71997 10.6667 2.3466 10.5213 2.06139C10.3935 1.8105 10.1895 1.60653 9.93865 1.4787C9.65344 1.33337 9.28007 1.33337 8.53333 1.33337H7.46667C6.71993 1.33337 6.34656 1.33337 6.06135 1.4787C5.81046 1.60653 5.60649 1.8105 5.47866 2.06139C5.33333 2.3466 5.33333 2.71997 5.33333 3.46671V4.00004M6.66667 7.66671V11M9.33333 7.66671V11M2 4.00004H14M12.6667 4.00004V11.4667C12.6667 12.5868 12.6667 13.1469 12.4487 13.5747C12.2569 13.951 11.951 14.257 11.5746 14.4487C11.1468 14.6667 10.5868 14.6667 9.46667 14.6667H6.53333C5.41323 14.6667 4.85318 14.6667 4.42535 14.4487C4.04903 14.257 3.74307 13.951 3.55132 13.5747C3.33333 13.1469 3.33333 12.5868 3.33333 11.4667V4.00004" stroke="#242424" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    </div>
    <button class="exercise-card-workout-start"  workout-id="${ex._id}">
<span>Start</span>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M7.5 14L14 7.5M14 7.5L7.5 1M14 7.5H1" stroke="#242424" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    </button>
    </div>
    
    <div class="exercise-card-title">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <circle cx="12" cy="12" r="12" fill="#242424"/>
  <path d="M18.8234 8.72544C18.6138 8.47504 18.2403 8.44212 17.9899 8.65092L16.349 10.0294L15.5943 8.15967C15.5675 8.08949 15.5267 8.03057 15.4799 7.97859C15.3257 7.63549 15.058 7.34091 14.6889 7.17023C14.5286 7.09745 14.3631 7.05846 14.1977 7.0394C14.1613 7.02034 14.1283 6.99521 14.0868 6.98222L11.199 6.17732C11.037 6.13314 10.8741 6.16173 10.7407 6.2397C10.5821 6.29342 10.4461 6.40865 10.3811 6.57587L9.29378 9.37178C9.17594 9.67589 9.3267 10.019 9.63168 10.1386C9.93492 10.2564 10.2789 10.1048 10.3976 9.79978L11.316 7.43882L12.6312 7.80444C12.5991 7.85643 12.5645 7.90495 12.5385 7.9604L10.8524 11.6149C10.8282 11.6686 10.8152 11.7232 10.7979 11.7787L8.7488 15.214L5.31955 16.3611C4.9314 16.6514 4.84909 17.1981 5.13587 17.5862C5.42439 17.9752 5.97282 18.0575 6.36011 17.7708L9.86907 16.5621C9.97651 16.4841 10.0545 16.3819 10.1134 16.2719C10.1576 16.2251 10.2078 16.1878 10.2416 16.1298L11.4633 14.0816L13.6319 15.9296L11.3116 18.5445C10.9919 18.9049 11.024 19.4603 11.3862 19.7791C11.7474 20.1005 12.3011 20.0667 12.6225 19.7046L15.5181 16.4426C15.6082 16.342 15.6619 16.2259 15.6983 16.1047C15.7199 16.0388 15.7199 15.9704 15.7251 15.9019C15.7251 15.8673 15.7381 15.8361 15.7355 15.804C15.7277 15.5649 15.6307 15.3327 15.4349 15.1672L13.4395 13.4656C13.5834 13.3287 13.7055 13.1658 13.7939 12.9743L15.0866 10.1749L15.5007 11.2779C15.5181 11.3758 15.551 11.472 15.6203 11.5525C15.6827 11.627 15.7624 11.6764 15.8473 11.7111C15.856 11.7154 15.8664 11.7163 15.8768 11.7189C15.9305 11.7379 15.9851 11.7561 16.0414 11.7587C16.1081 11.7648 16.1757 11.7561 16.2441 11.7371C16.2459 11.7362 16.2467 11.7362 16.2467 11.7362C16.2649 11.7319 16.2831 11.7353 16.3013 11.7275C16.3975 11.6912 16.4711 11.6296 16.5344 11.5577L18.8893 9.55892C19.1397 9.34838 19.034 8.97583 18.8234 8.72544Z" fill="#F4F4F4"/>
  <path d="M15.8448 7.30102C16.7564 7.30102 17.4954 6.56206 17.4954 5.65051C17.4954 4.73896 16.7564 4 15.8448 4C14.9333 4 14.1943 4.73896 14.1943 5.65051C14.1943 6.56206 14.9333 7.30102 15.8448 7.30102Z" fill="#F4F4F4"/>
</svg>
     <h3>${ex.name}</h3>
    </div>
     
<div class="exercise-card-info">
 <p><span>Burned calories:</span> ${truncateText(capitalizeFirstLetter(ex.burnedCalories + ' / 3 min'), 7)}</p> 
 <p><span>Body part:</span> ${truncateText(capitalizeFirstLetter(ex.bodyPart), 5)}</p>
 <p><span>Target:</span>${truncateText(capitalizeFirstLetter(ex.target), 3)}</p>
</div>

    </li>`,
    )
    .join('');

  // add onclick functions

  const buttonsStart = document.querySelectorAll('.exercise-card-workout-start');

  buttonsStart.forEach(button => {
    button.addEventListener('click', () => {
      const workoutId = button.getAttribute('workout-id');
      fetchAndShowDetails(workoutId);
    });
  });

  const buttonsDelete = document.querySelectorAll('.exercise-card-workout-button');

  buttonsDelete.forEach(button => {
    button.addEventListener('click', () => {
      const workoutId = button.getAttribute('workout-id');
      removeFromFavorites(workoutId);
    });
  });

  const totalPages = Math.ceil(data.length / PER_PAGE);

  if (totalPages > 3) {
    pagination.innerHTML = `
    <div class="pagination-group">
    <button class="nav-btn" data-action="first" ${page === 1 ? 'disabled' : ''}><svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.83289 12.5917C9.75478 12.5142 9.69279 12.4221 9.65048 12.3205C9.60817 12.219 9.58639 12.11 9.58639 12C9.58639 11.89 9.60817 11.7811 9.65048 11.6795C9.69279 11.578 9.75478 11.4858 9.83289 11.4084L13.6579 7.59168C13.736 7.51421 13.798 7.42204 13.8403 7.32049C13.8826 7.21894 13.9044 7.11002 13.9044 7.00001C13.9044 6.89 13.8826 6.78108 13.8403 6.67953C13.798 6.57798 13.736 6.48581 13.6579 6.40834C13.5018 6.25313 13.2905 6.16602 13.0704 6.16602C12.8502 6.16602 12.639 6.25313 12.4829 6.40834L8.65789 10.2334C8.18972 10.7021 7.92676 11.3375 7.92676 12C7.92676 12.6625 8.18972 13.2979 8.65789 13.7667L12.4829 17.5917C12.6381 17.7457 12.8476 17.8324 13.0662 17.8334C13.1759 17.834 13.2846 17.813 13.3861 17.7715C13.4877 17.73 13.58 17.6689 13.6579 17.5917C13.736 17.5142 13.798 17.4221 13.8403 17.3205C13.8826 17.219 13.9044 17.11 13.9044 17C13.9044 16.89 13.8826 16.7811 13.8403 16.6795C13.798 16.578 13.736 16.4858 13.6579 16.4084L9.83289 12.5917Z" fill="#242424" fill-opacity="0.5"/>
<path d="M16.8329 12.5917C16.7548 12.5142 16.6928 12.4221 16.6505 12.3205C16.6082 12.219 16.5864 12.11 16.5864 12C16.5864 11.89 16.6082 11.7811 16.6505 11.6795C16.6928 11.578 16.7548 11.4858 16.8329 11.4084L20.6579 7.59168C20.736 7.51421 20.798 7.42204 20.8403 7.32049C20.8826 7.21894 20.9044 7.11002 20.9044 7.00001C20.9044 6.89 20.8826 6.78108 20.8403 6.67953C20.798 6.57798 20.736 6.48581 20.6579 6.40834C20.5018 6.25313 20.2905 6.16602 20.0704 6.16602C19.8502 6.16602 19.639 6.25313 19.4829 6.40834L15.6579 10.2334C15.1897 10.7021 14.9268 11.3375 14.9268 12C14.9268 12.6625 15.1897 13.2979 15.6579 13.7667L19.4829 17.5917C19.6381 17.7457 19.8476 17.8324 20.0662 17.8334C20.1759 17.834 20.2846 17.813 20.3861 17.7715C20.4877 17.73 20.58 17.6689 20.6579 17.5917C20.736 17.5142 20.798 17.4221 20.8403 17.3205C20.8826 17.219 20.9044 17.11 20.9044 17C20.9044 16.89 20.8826 16.7811 20.8403 16.6795C20.798 16.578 20.736 16.4858 20.6579 16.4084L16.8329 12.5917Z" fill="#242424" fill-opacity="0.5"/>
</svg>
</button>
    <button class="nav-btn" data-action="prev" ${page === 1 ? 'disabled' : ''}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M8.83289 10.5917C8.75478 10.5142 8.69279 10.4221 8.65048 10.3205C8.60817 10.219 8.58639 10.11 8.58639 10C8.58639 9.89001 8.60817 9.78109 8.65048 9.67954C8.69279 9.57799 8.75478 9.48582 8.83289 9.40835L12.6579 5.59168C12.736 5.51421 12.798 5.42204 12.8403 5.32049C12.8826 5.21894 12.9044 5.11002 12.9044 5.00001C12.9044 4.89 12.8826 4.78108 12.8403 4.67953C12.798 4.57798 12.736 4.48581 12.6579 4.40834C12.5018 4.25313 12.2905 4.16602 12.0704 4.16602C11.8502 4.16602 11.639 4.25313 11.4829 4.40834L7.65789 8.23335C7.18972 8.7021 6.92676 9.33752 6.92676 10C6.92676 10.6625 7.18972 11.2979 7.65789 11.7667L11.4829 15.5917C11.6381 15.7457 11.8476 15.8324 12.0662 15.8334C12.1759 15.834 12.2846 15.813 12.3861 15.7715C12.4877 15.73 12.58 15.6689 12.6579 15.5917C12.736 15.5142 12.798 15.4221 12.8403 15.3205C12.8826 15.219 12.9044 15.11 12.9044 15C12.9044 14.89 12.8826 14.7811 12.8403 14.6795C12.798 14.578 12.736 14.4858 12.6579 14.4084L8.83289 10.5917Z" fill="#242424" fill-opacity="0.5"/>
</svg></button>
    </div>
    
    <span class="page-numbers"></span>
     <div class="pagination-group">
    <button class="nav-btn" data-action="next" ${page === totalPages ? 'disabled' : ''}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M11.1671 10.5917C11.2452 10.5142 11.3072 10.4221 11.3495 10.3205C11.3918 10.219 11.4136 10.11 11.4136 10C11.4136 9.89001 11.3918 9.78109 11.3495 9.67954C11.3072 9.57799 11.2452 9.48582 11.1671 9.40835L7.34211 5.59168C7.264 5.51421 7.20201 5.42204 7.1597 5.32049C7.11739 5.21894 7.09561 5.11002 7.09561 5.00001C7.09561 4.89 7.11739 4.78108 7.1597 4.67953C7.20201 4.57798 7.264 4.48581 7.34211 4.40834C7.49824 4.25313 7.70945 4.16602 7.92961 4.16602C8.14976 4.16602 8.36097 4.25313 8.51711 4.40834L12.3421 8.23335C12.8103 8.7021 13.0732 9.33752 13.0732 10C13.0732 10.6625 12.8103 11.2979 12.3421 11.7667L8.51711 15.5917C8.36189 15.7457 8.15239 15.8324 7.93377 15.8334C7.8241 15.834 7.71538 15.813 7.61385 15.7715C7.51232 15.73 7.41997 15.6689 7.34211 15.5917C7.264 15.5142 7.20201 15.4221 7.1597 15.3205C7.11739 15.219 7.09561 15.11 7.09561 15C7.09561 14.89 7.11739 14.7811 7.1597 14.6795C7.20201 14.578 7.264 14.4858 7.34211 14.4084L11.1671 10.5917Z" fill="#242424"/>
</svg></button>
    <button class="nav-btn" data-action="last" ${page === totalPages ? 'disabled' : ''}><svg width="31" height="24" viewBox="0 0 31 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.1671 12.5917C21.2452 12.5142 21.3072 12.4221 21.3495 12.3205C21.3918 12.219 21.4136 12.11 21.4136 12C21.4136 11.89 21.3918 11.7811 21.3495 11.6795C21.3072 11.578 21.2452 11.4858 21.1671 11.4084L17.3421 7.59168C17.264 7.51421 17.202 7.42204 17.1597 7.32049C17.1174 7.21894 17.0956 7.11002 17.0956 7.00001C17.0956 6.89 17.1174 6.78108 17.1597 6.67953C17.202 6.57798 17.264 6.48581 17.3421 6.40834C17.4982 6.25313 17.7095 6.16602 17.9296 6.16602C18.1498 6.16602 18.361 6.25313 18.5171 6.40834L22.3421 10.2334C22.8103 10.7021 23.0732 11.3375 23.0732 12C23.0732 12.6625 22.8103 13.2979 22.3421 13.7667L18.5171 17.5917C18.3619 17.7457 18.1524 17.8324 17.9338 17.8334C17.8241 17.834 17.7154 17.813 17.6139 17.7715C17.5123 17.73 17.42 17.6689 17.3421 17.5917C17.264 17.5142 17.202 17.4221 17.1597 17.3205C17.1174 17.219 17.0956 17.11 17.0956 17C17.0956 16.89 17.1174 16.7811 17.1597 16.6795C17.202 16.578 17.264 16.4858 17.3421 16.4084L21.1671 12.5917Z" fill="#242424"/>
<path d="M14.1671 12.5917C14.2452 12.5142 14.3072 12.4221 14.3495 12.3205C14.3918 12.219 14.4136 12.11 14.4136 12C14.4136 11.89 14.3918 11.7811 14.3495 11.6795C14.3072 11.578 14.2452 11.4858 14.1671 11.4084L10.3421 7.59168C10.264 7.51421 10.202 7.42204 10.1597 7.32049C10.1174 7.21894 10.0956 7.11002 10.0956 7.00001C10.0956 6.89 10.1174 6.78108 10.1597 6.67953C10.202 6.57798 10.264 6.48581 10.3421 6.40834C10.4982 6.25313 10.7095 6.16602 10.9296 6.16602C11.1498 6.16602 11.361 6.25313 11.5171 6.40834L15.3421 10.2334C15.8103 10.7021 16.0732 11.3375 16.0732 12C16.0732 12.6625 15.8103 13.2979 15.3421 13.7667L11.5171 17.5917C11.3619 17.7457 11.1524 17.8324 10.9338 17.8334C10.8241 17.834 10.7154 17.813 10.6139 17.7715C10.5123 17.73 10.42 17.6689 10.3421 17.5917C10.264 17.5142 10.202 17.4221 10.1597 17.3205C10.1174 17.219 10.0956 17.11 10.0956 17C10.0956 16.89 10.1174 16.7811 10.1597 16.6795C10.202 16.578 10.264 16.4858 10.3421 16.4084L14.1671 12.5917Z" fill="#242424"/>
</svg>
</button>
     </div>
  `;
  } else {
    pagination.innerHTML = `
   
    <span class="page-numbers"></span>
   
  `;
  }

  const pageNumbersEl = pagination.querySelector('.page-numbers');
  if (totalPages > 3) {
    for (let i = Math.max(page - 1, 1); i <= Math.min(totalPages, Math.max(page - 1, 1) + 2); i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      if (i === page) btn.classList.add('active');
      btn.addEventListener('click', () => renderFavorites(i));
      pageNumbersEl.appendChild(btn);
    }
  } else {
    for (let i = 1; i <= Math.min(totalPages, 3); i++) {
      const btn = document.createElement('button');
      btn.className = 'page-btn';
      btn.textContent = i;
      if (i === page) btn.classList.add('active');
      btn.addEventListener('click', () => renderFavorites(i));
      pageNumbersEl.appendChild(btn);
    }
  }

  if (totalPages - page > 1 && totalPages > 3) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.className = 'dots';
    dots.style.padding = '0 6px';
    pageNumbersEl.appendChild(dots);
  }

  // навігаційні кнопки
  if (totalPages > 3) {
    pagination.querySelector('[data-action="first"]').addEventListener('click', () => renderFavorites(1));
    pagination.querySelector('[data-action="prev"]').addEventListener('click', () => renderFavorites(page - 1));
    pagination.querySelector('[data-action="next"]').addEventListener('click', () => renderFavorites(page + 1));
    pagination.querySelector('[data-action="last"]').addEventListener('click', () => renderFavorites(totalPages));
  }
}

function removeFromFavorites(id) {
  const data = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  const updated = data.filter(ex => ex._id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  renderFavorites(1);
}

//fetchAndShowDetails('64f389465ae26083f39b17b7');
