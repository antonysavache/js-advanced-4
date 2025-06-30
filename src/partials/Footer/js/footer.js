import { YourEnergyAPI } from '../../../api/index.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  footerInputEl: document.querySelector('.js-registration-input'),
  footerFormBtn: document.querySelector('.js-form'),
};

const submitRegistrationForm = event => {
  event.preventDefault();
  
  const formValue = refs.footerInputEl.value;
  YourEnergyAPI.subscribe(formValue)
    .then(() => {
      iziToast.success({
        title: '',
        message: 'Subscription successful',
        position: 'topRight',
      });
    })
    .catch(error => {
      const message = error?.message || '';
      const status = error?.response?.status;

      if (status === 409 || message.includes('409')) {
        iziToast.error({
          title: '',
          message: 'This email has already been registered.',
          position: 'topRight',
        });
      } else {
        iziToast.error({
          title: '',
          message: `Subscription request: ${message}`,
          position: 'topRight',
        });
      }
    });

    refs.footerFormBtn.reset();
    document.activeElement.blur();
};

refs.footerFormBtn.addEventListener('submit', submitRegistrationForm);
