const loginForm = document.getElementById('loginForm');
const formError = document.getElementById('formError');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  formError.textContent = '';

  if (!emailInput.validity.valid) {
    formError.textContent = 'Introduce un correo electrónico válido.';
    emailInput.focus();
    return;
  }

  if (!passwordInput.validity.valid) {
    formError.textContent = 'La contraseña debe tener al menos 4 caracteres.';
    passwordInput.focus();
    return;
  }

  sessionStorage.setItem('ritualSession', 'active');
  window.location.href = 'index.html';
});
