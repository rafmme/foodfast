const signUpForm = document.getElementById('signUpForm');
const errorDiv = document.getElementById('signUpErrorDiv');
const errorMessage = document.getElementById('signUpErrorMessage');

/**
 * @description a function to validate sign up data
 * @param {String} fullname
 * @param {String} password
 * @returns {Object} an objects containing the error messages
 */
const validateSignUpInput = (fullname, password) => {
  const errors = {};
  if (fullname.trim() === '') {
    errors.fullname = 'Full Name field can\'t be empty';
  }
  if (fullname.trim() !== '' && fullname.length < 3 && fullname.length > 300) {
    errors.fullname = 'Fullname should be within the range of 3 - 300 characters';
  }
  if (password.trim() === '') {
    errors.password = 'Password field is empty';
  }
  const checkPassword = password.trim() !== '' && (password.length < 8 || password.length > 20);
  if (checkPassword) {
    errors.password = 'Password should be within the range of 8 - 30 characters';
  }
  return errors;
};

/**
 * @description a function to handle the display of error messages
 * @param {Object} errorsObject an Object containing errors
 * @param {Object} divHolder a div tag that houses the error P tag
 * @param {Object} pHolder a P tag that contains the error message
 * @returns {undefined}
 */
const showErrorMessages = (errorsObject, divHolder, pHolder) => {
  let err = '<b><i class="fa fa-warning"></i> Error!!!</b><br>';
  Object.values(errorsObject).forEach((e) => {
    err = `${err + e}<br>`;
  });
  pHolder.innerHTML = err;
  divHolder.style.opacity = '1';
  divHolder.style.display = 'block';
  setTimeout(() => {
    divHolder.style.display = 'none';
  }, 5000);
};

/**
 * @description a function to handle the signing up of user on the app
 * @param {Object} evt
 * @returns {undefined}
 */
const signUp = async (evt) => {
  evt.preventDefault();
  const fullname = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const signUpBtn = document.getElementById('signUp-btn');
  signUpBtn.style.background = 'darkgray';
  signUpBtn.style.color = 'white';
  signUpBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Signing you up...';
  signUpBtn.disabled = true;
  const signUpData = JSON.stringify({
    fullname,
    password,
    email
  });
  const validationResult = validateSignUpInput(fullname, password);
  if (Object.keys(validationResult).length > 0) {
    signUpBtn.style.background = '#d64541';
    signUpBtn.innerText = 'Create account';
    signUpBtn.disabled = false;
    showErrorMessages(validationResult, errorDiv, errorMessage);
    return;
  }

  const url = 'api/v1/auth/signup';
  const resp = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: signUpData
  });

  const result = await resp.json();
  const {
    status,
    success,
    token,
    error
  } = result;
  if (status === 201 && success && token) {
    localStorage.setItem('userToken', token);
    window.location = 'index.html';
    return;
  } if (!success) {
    signUpBtn.style.background = '#d64541';
    signUpBtn.innerText = 'Create account';
    signUpBtn.disabled = false;
    showErrorMessages(error, errorDiv, errorMessage);
  }
};

window.onload = () => {
  if (localStorage.getItem('userToken')) {
    window.location = 'index.html';
  }
};

signUpForm.addEventListener('submit', signUp);
