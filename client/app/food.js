const mealsHolder = document.getElementById('meals-holder');
const token = sessionStorage.getItem('userToken');

/**
 * @function
 * @description a function to handle fetching and displaying of all meals
 * @returns {undefined}
 */
const getAllMeals = async () => {
  const url = '../api/v1/menu';
  const resp = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    })
  });
  const result = await resp.json();
  const { status, success, menu } = result;
  if (!success && status === 401) {
    sessionStorage.removeItem('userToken');
    window.location = '../login.html';
    return;
  }

  let mealsCard = '';

  menu.forEach((meal) => {
    mealsCard += `<div class="meal-card adm-card text-left">
<div class="img-frame">
    <img src="${meal.imageUrl}" alt="Avatar" style="width:100%">
</div>
<div class="icon-div" onclick="showMenu('menu_${meal.id}')">
    <i class="fa fa-ellipsis-v text-primary-green" style="font-size: 1.5em"></i>
</div>
<ul class="hide" id="menu_${meal.id}">
    <li onclick="showModal('edit_${meal.id}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-edit"></i>
            Edit</a></li>
    <li onclick="showModal('del_${meal.id}')"><a class="bg-red" href="javascript:void(0);"><i class="fa fa-trash-o"></i>
            Delete</a></li>
</ul>
<div class="container">
    <h4 class="foodname-mg">
        <b>${meal.title.slice(0, 19)}</b>
    </h4>
    <p class="min-p">${meal.description}</p>
    <p class="price">₦ ${meal.price}</p>
</div>
</div>`;
  });
  mealsHolder.innerHTML = mealsCard;
};

// invoke getAllMeals function when the window load
window.onload = getAllMeals();

/**
 * @description a function to validate new meal data input
 * @param {String} title
 * @param {String} description
 * @param {String} price
 * @returns {Object} an objects containing the error messages
 */
const validateMealInput = (title, description, price) => {
  const errors = {};
  if (title.trim() === '') {
    errors.title = 'Food item title field can\'t be empty';
  }
  if (title.trim() !== '' && (title.length < 3 || title.length > 150)) {
    errors.title = 'Food item title field should be within the range of 3 - 150 characters';
  }
  if (description.trim() === '') {
    errors.description = 'Description field can\'t be empty';
  }
  if (description.trim() !== '' && (description.length < 3 || description.length > 300)) {
    errors.description = 'Description field should be within the range of 3 - 300 characters';
  }
  if (Number.isNaN(price)) {
    errors.price = 'Price of food item should be a number';
  }
  if (`${price}`[0] === '-' || price === 0) {
    errors.price = 'Price of food item is invalid';
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
 * @function
 * @description a function to generate Image link
 * @returns {String} imgUrl
 */
const genImgUrl = () => {
  const randNum = Math.floor(Math.random() * Math.floor(6));
  const imgUrlArrays = [
    'https://res.cloudinary.com/faray/image/upload/v1538654131/f8.jpg',
    'https://res.cloudinary.com/faray/image/upload/v1538654131/f10.jpg',
    'https://res.cloudinary.com/faray/image/upload/v1538654130/f7.jpg',
    'https://res.cloudinary.com/faray/image/upload/v1538654129/f6.jpg',
    'https://res.cloudinary.com/faray/image/upload/v1538654128/f3.jpg',
    'https://res.cloudinary.com/faray/image/upload/v1538654058/f4.jpg',
  ];
  const imgUrl = imgUrlArrays[randNum];
  return imgUrl;
};

/**
  * @function
  * @description a funtion that handles the adding of new meal to menu
  * @param {*} id
  * @returns {undefined}
  */
// eslint-disable-next-line no-unused-vars
const addMeal = async () => {
  const errorDiv = document.getElementById('failAlert');
  const errorMessage = document.getElementById('mealMsg');
  const successDiv = document.getElementById('mealSuccessAlert');
  const price = Number.parseInt(document.getElementById('price').value, 10);
  const description = document.getElementById('desc').value;
  const title = document.getElementById('title').value;
  const mealData = JSON.stringify({
    title,
    price,
    description,
    imageUrl: genImgUrl()
  });
  const validationResult = validateMealInput(title, description, price);
  if (Object.keys(validationResult).length > 0) {
    showErrorMessages(validationResult, errorDiv, errorMessage);
    return;
  }

  const url = '../api/v1/menu';
  const resp = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }),
    body: mealData
  });

  const result = await resp.json();
  const {
    status,
    success,
    meal,
    error
  } = result;
  if (status === 201 && success && meal) {
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
      window.location = 'foods.html';
    }, 1000);
    return;
  } if (!success) {
    showErrorMessages(error, errorDiv, errorMessage);
  }
};
