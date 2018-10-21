const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('loginErrorDiv');
const errorMessage = document.getElementById('loginErrorMessage');

/**
 * @description a function to validate sign in data
 * @param {String} password
 * @returns {Object} an objects containing the error messages
 */
const validateLoginInput = (password) => {
  const errors = {};
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
    err = `${err + e};<br>`;
  });
  pHolder.innerHTML = err;
  divHolder.style.opacity = '1';
  divHolder.style.display = 'block';
  setTimeout(() => {
    divHolder.style.display = 'none';
  }, 5000);
};

/**
 * @description a function to handle the logging in of user into their account on the app
 * @param {Object} evt
 * @returns {undefined}
 */
const login = async (evt) => {
  evt.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const loginBtn = document.getElementById('login-btn');
  loginBtn.style.background = 'darkgray';
  loginBtn.style.color = 'white';
  loginBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Logging you in...';
  loginBtn.disabled = true;
  const loginData = JSON.stringify({
    password,
    email
  });
  const validationResult = validateLoginInput(password);
  if (Object.keys(validationResult).length > 0) {
    loginBtn.style.background = '#d64541';
    loginBtn.innerText = 'Login';
    loginBtn.disabled = false;
    showErrorMessages(validationResult, errorDiv, errorMessage);
    return;
  }

  const url = 'api/v1/auth/login';
  const resp = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: loginData
  });

  const result = await resp.json();
  const {
    status,
    success,
    token,
    user
  } = result;
  if (status === 200 && success && token) {
    if (user.isAdmin === true) {
      localStorage.setItem('userToken', token);
      window.location = 'admin/index.html';
      return;
    }
    localStorage.setItem('userToken', token);
    window.location = 'index.html';
  } if (!success) {
    showErrorMessages(result.error, errorDiv, errorMessage);
    loginBtn.style.background = '#d64541';
    loginBtn.innerText = 'Login';
    loginBtn.disabled = false;
  }
};

loginForm.addEventListener('submit', login);

window.onload = () => {
  if (localStorage.getItem('userToken')) {
    window.location = 'index.html';
  }
};
