import { setupVideoPosts } from './video-posts-control.js';
window.onload = () => {
  addSearchField(setupVideoPosts);
  startDarkModeFunctionality(addDarkModeButton());
  activateMenu();
  handleContactForm();
};
function handleContactForm() {
  emailjs.init("user_i4mTPF2ENuhqRVXN69p8L");
  var form = document.forms['contact-form'];
  var nameInput = form[0];
  var emailInput = form[1];
  var messageInput = form[2];
  var hiddenInput = form[3];
  var submitButton = form[4];
  form.addEventListener('submit', e => {
    e.preventDefault();
    var valid = true;
    for (var name in data) {
      var value = data[name].trim();
      var pattern = form[name].pattern;
      if (pattern && value.match(new RegExp(pattern)) === null || name === 'message' && value.length < 30) {
        form[name].nextElementSibling.textContent = form[name].title;
        form[name].classList.add('has-error');
        valid = false;
        break;
      }
    }
    if (valid && hiddenInput.value.length === 0) {
      doOnProductionOnly(() => gtag('event', 'contact-form-attempt', {
        'event_category': 'contact',
        'event_label': 'contact form filled and submitted'
      }));
      grecaptcha.execute();
    }
  });
  var onValueChanged = e => {
    data[e.target.name] = e.target.value;
    e.target.nextElementSibling.textContent = '';
    e.target.classList.remove('has-error');
    if (Object.values(data).every(val => val.trim().length > 0)) {
      submitButton.removeAttribute('disabled');
    } else {
      submitButton.setAttribute('disabled', 'disabled');
    }
  };
  [nameInput, emailInput, messageInput].forEach(input => {
    data[input.name] = '';
    input.addEventListener('input', onValueChanged);
    input.addEventListener('change', onValueChanged);
  });
}