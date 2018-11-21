const mealsHolder = document.getElementById('meals-holder');
const modalsHolder = document.getElementById('modals-holder');
const btnNext = document.getElementById('btn_next');
const btnPrev = document.getElementById('btn_prev');
const searchMessage = document.getElementById('search-message');
const searchField = document.getElementById('order-search-box');
const pageSpan = document.getElementById('page');
const pagination = document.getElementById('pagination');
const imageUpload = document.getElementById('image');
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/faray/upload';
const CLOUDINARY_PRESET = 'ourphxep';
const token = localStorage.getItem('userToken');
let menuArray;
let newMenuArray;
let currentPage = 1;
const recordsPerPage = 8;

const numPages = contentArray => Math.ceil(contentArray.length / recordsPerPage);

const changePage = (page, contentArray) => {
  if (contentArray.length === 0 || undefined) {
    return;
  }
  if (page < 1) page = 1;
  if (page > numPages(contentArray)) page = numPages(contentArray);

  mealsHolder.style.display = 'flex';
  mealsHolder.innerHTML = '';
  pagination.style.display = 'flex';

  for (
    let i = (page - 1) * recordsPerPage;
    i < (page * recordsPerPage)
        && i < contentArray.length; i += 1
  ) {
    const meal = contentArray[i];
    mealsHolder.innerHTML += `<div class="meal-card adm-card text-left" ondblclick="showModal('meal_${meal.id}')">
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
  }
  pageSpan.innerText = `Page ${page} of ${numPages(contentArray)}`;

  if (page === 1) {
    btnPrev.style.display = 'none';
  } else {
    btnPrev.style.display = 'block';
  }

  if (page === numPages(contentArray)) {
    btnNext.style.display = 'none';
  } else {
    btnNext.style.display = 'block';
  }
};

// eslint-disable-next-line no-unused-vars
const prevPage = () => {
  if (currentPage > 1) {
    currentPage -= 1;
    changePage(currentPage, menuArray);
  }
};

// eslint-disable-next-line no-unused-vars
const nextPage = () => {
  if (currentPage < numPages(menuArray)) {
    currentPage += 1;
    changePage(currentPage, menuArray);
  }
};


/**
 * @function
 * @description a function to handle fetching and displaying of all meals
 * @returns {undefined}
 */
const getAllMeals = async () => {
  searchMessage.style.display = 'none';
  const spinner = document.getElementById('loader');
  const wrapper = document.getElementById('content-wrapper');
  wrapper.style.opacity = 0;
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
  if (result) {
    spinner.style.display = 'none';
    wrapper.style.opacity = 1;
  }
  if (!success && status === 401) {
    localStorage.removeItem('userToken');
    window.location = '../login.html';
    return;
  }

  menuArray = menu.slice(0).reverse();
  newMenuArray = menu;
  let modals = '';

  menuArray.forEach((meal) => {
    modals += `<div id="meal_${meal.id}" class="modal">
    <form class="container modal-content animate">
        <div class="imgcontainer">
            <span style="margin-top: -15px;" onclick="closeModal('meal_${meal.id}')" class="close" title="Close Modal">&times;</span>
        </div>
        <h3>Meal Information</h3>
        <img src="${meal.imageUrl}" alt="" class="modal-image">
        <label for="f_title">Food Name</label>
        <input type="text" name="" id="f_title" value="${meal.title}" disabled>
        <label for="f_desc">Description</label>
        <textarea style="height: 70px;" name="" id="f_desc" cols="30" rows="10" disabled>${meal.description}</textarea>
        <label for="f_price">Price (₦)</label>
        <input type="number" name="" id="f_price" value="${meal.price}" disabled>
    </form>
</div>
`;
  });
  modalsHolder.innerHTML = modals;
  changePage(1, menuArray);
};

// invoke getAllMeals function when the window load
window.onload = getAllMeals();

/**
 * @description a function to validate new meal data input
 * @param {String} title
 * @param {String} description
 * @param {String} price
 * @param {Object} image
 * @returns {Object} an objects containing the error messages
 */
const validateMealInput = (title, description, price, image) => {
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
  if (image.files.length === 0) {
    errors.image = 'Image upload field is empty';
  }
  if (image.files.length === 1) {
    if (image.files[0].size && image.files[0].size > 5000000) {
      errors.image = 'Image size should not be more than 5MB';
    }
    if (image.files[0].type && (image.files[0].type !== 'image/png'
           && image.files[0].type !== 'image/jpeg'
           && image.files[0].type !== 'image/gif')) {
      errors.image = 'You are trying to upload an invalid image type';
    }
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
  * @description a funtion that handles the adding of new meal to menu
  * @param {*} id
  * @returns {undefined}
  */
// eslint-disable-next-line no-unused-vars
const addMeal = async () => {
  const errorDiv = document.getElementById('failAlert');
  const errorMessage = document.getElementById('mealMsg');
  const successDiv = document.getElementById('mealSuccessAlert');
  const addMealBtn = document.getElementById('addMealBtn');
  addMealBtn.style.background = 'darkgray';
  addMealBtn.style.color = 'white';
  addMealBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Adding meal...';
  addMealBtn.disabled = true;

  const price = Number.parseInt(document.getElementById('price').value, 10);
  const description = document.getElementById('desc').value;
  const title = document.getElementById('title').value;
  let uploadedImageUrl;

  const validationResult = validateMealInput(title, description, price, imageUpload);
  if (Object.keys(validationResult).length > 0) {
    addMealBtn.innerText = 'Add New Meal';
    addMealBtn.style.background = '#d64541';
    addMealBtn.style.color = 'white';
    addMealBtn.disabled = false;
    showErrorMessages(validationResult, errorDiv, errorMessage);
    return;
  }

  const file = imageUpload.files[0];
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);
  axios({
    url: CLOUDINARY_URL,
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
    }),
    data: formData
  }).then(async (imgResp) => {
    uploadedImageUrl = imgResp.data.secure_url;
    const url = '../api/v1/menu';
    const resp = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }),
      body: JSON.stringify({
        title,
        price,
        description,
        imageUrl: uploadedImageUrl
      })
    });

    const result = await resp.json();
    const {
      status,
      success,
      meal,
      error
    } = result;
    if (status === 201 && success && meal) {
      addMealBtn.style.background = '#d64541';
      addMealBtn.innerText = 'Add New Meal';
      addMealBtn.style.color = 'white';
      addMealBtn.disabled = true;
      successDiv.style.display = 'block';
      setTimeout(() => {
        successDiv.style.display = 'none';
        window.location = 'foods.html';
      }, 1500);
      return;
    } if (!success) {
      addMealBtn.innerText = 'Add New Meal';
      addMealBtn.style.background = '#d64541';
      addMealBtn.style.color = 'white';
      addMealBtn.disabled = false;
      showErrorMessages(error, errorDiv, errorMessage);
    }
  });
};

// eslint-disable-next-line no-unused-vars
const filterMenu = () => {
  searchMessage.style.display = 'none';
  searchField.value = '';
  const option = document.getElementById('filter-field').value;
  switch (option) {
    case 'oldest':
      currentPage = 1;
      menuArray = newMenuArray.slice(0);
      changePage(1, menuArray);
      break;

    default:
      currentPage = 1;
      menuArray = newMenuArray.slice(0).reverse();
      changePage(1, menuArray);
      break;
  }
};

/**
 * @function
 * @description a function to handle the search of a meals on the menu
 * @param {Object} evt
 * @returns {undefined}
 */
const searchMenu = (evt) => {
  evt.preventDefault();
  const searchQuery = document.getElementById('order-search-box').value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    searchMessage.style.display = 'none';
    menuArray = newMenuArray.slice(0).reverse();
    changePage(1, menuArray);
    return;
  }

  const searchResult = newMenuArray.filter((meal) => {
    const price = `${meal.price}`;
    return meal.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    || meal.description.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    || price.indexOf(searchQuery.toLowerCase()) > -1;
  });

  if (searchResult.length < 1) {
    searchMessage.innerText = `No match found for "${searchQuery}"`;
    searchMessage.style.display = 'block';
    mealsHolder.style.display = 'none';
    pagination.style.display = 'none';
    return;
  }

  searchMessage.innerText = `Search results for "${searchQuery}"`;
  searchMessage.style.display = 'block';
  menuArray = searchResult;
  changePage(1, menuArray);
};

searchField.addEventListener('input', searchMenu);
