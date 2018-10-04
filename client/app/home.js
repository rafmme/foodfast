const searchMessage = document.getElementById('search-message');
const offerMessage = document.getElementById('offer-message');
const searchField = document.getElementById('search-box');
const pagination = document.getElementById('pagination');
const menuHolder = document.getElementById('menu-holder');
const btnNext = document.getElementById('btn_next');
const btnPrev = document.getElementById('btn_prev');
const pageSpan = document.getElementById('page');
const token = localStorage.getItem('userToken');
const userAddress = localStorage.getItem('userAddress') || '';
const userPhoneNumber = localStorage.getItem('userPhoneNumber') || '';
let menuArray, newMenuArray;
let currentPage = 1;
const recordsPerPage = 8;

const numPages = contentArray => Math.ceil(contentArray.length / recordsPerPage);

const changePage = (page, contentArray) => {
  if (contentArray.length === 0 || undefined) {
    return;
  }
  if (page < 1) page = 1;
  if (page > numPages(contentArray)) page = numPages(contentArray);

  menuHolder.innerHTML = '';
  menuHolder.style.display = 'flex';
  pagination.style.display = 'flex';

  for (
    let i = (page - 1) * recordsPerPage;
    i < (page * recordsPerPage)
        && i < contentArray.length; i += 1
  ) {
    const meal = contentArray[i];
    menuHolder.innerHTML += `<div class="meal-card m-card">
      <img src=${meal.imageUrl} alt="Avatar" style="width:100%; height: 120px;">
      <div class="container">
          <h4 style="margin-top: 20px">
              <b>${meal.title.slice(0, 19)}</b>
          </h4>
          <p class="min-p">${meal.description}</p>
          <p class="price"><b>₦ ${meal.price}</b></p>
          <button class="bg-green" onclick="showModal('${meal.id}')">Order</button>
      </div>
     </div>
     <div id="${meal.id}" class="modal">
     <form class="container modal-content animate" id="form_${meal.id}">
         <div class="imgcontainer">
             <span style="margin-top: -15px;" onclick="closeModal('${meal.id}')" class="close" title="Close Modal">&times;</span>
         </div>
         <h3>Place Order</h3>
         <div class="alert" id="orderFailAlert_${meal.id}" style="display: none">
          <p id="orderMsg_${meal.id}" style="margin-top: 10px"></p>
         </div>
         <div class="alert bg-green text-center" id="orderSuccessAlert_${meal.id}" style="display: none">
         <i class="fa fa-check"></i> Order was placed successfully
         </div>
         <label for="title">Food Name</label>
         <input type="text" name="" id="title_${meal.id}" value="${meal.title}" disabled>
         <label for="qty">Quantity</label>
         <input type="number" value="1" name="" id="qty_${meal.id}" required oninput="calculateOrder('${meal.id}', 'price_${meal.id}', '${meal.price}')">
         <label for="phone">Phone Number</label>
         <input type="tel" name="" id="phone_${meal.id}" value="${userPhoneNumber}" required placeholder="Phone Number">
         <label for="address">Delivery Address</label>
         <input type="text" name="" id="address_${meal.id}" value="${userAddress}" required placeholder="Delivery Location">
         <label for="price">Total Price (₦)</label>
         <input type="text" value="${meal.price}" name="" id="price_${meal.id}" disabled>
         <button type="button" style="margin-top: auto; background: #019875" onclick="placeOrder('${meal.id}')" id="ord_${meal.id}">Place Order</button>
     </form>
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
 * @description a function to handle fetching the menu and displaying it to the user
 * @returns {undefined}
 */
const getMenu = async () => {
  searchMessage.style.display = 'none';
  const spinner = document.getElementById('loader');
  const wrapper = document.getElementById('content-wrapper');
  wrapper.style.opacity = 0;
  const url = 'api/v1/menu';
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
    window.location = 'infopage.html';
    return;
  }
  menuArray = menu.reverse();
  newMenuArray = menu.slice(0);
  changePage(1, menuArray);
};

/**
 * @description a function to validate order data
 * @param {String} quantity
 * @param {String} phoneNumber
 * @param {address} address
 * @returns {Object} an objects containing the error messages
 */
const validateOrderInput = (quantity, phoneNumber, address) => {
  const errors = {};
  if (phoneNumber.trim() === '') {
    errors.phoneNumber = 'Phone Number field can\'t be empty';
  }
  if (phoneNumber.trim() !== '' && phoneNumber.length !== 11) {
    errors.phoneNumber = 'Phone Number should be of 11 characters';
  }
  if (address.trim() === '') {
    errors.address = 'Delivery Address field can\'t be empty';
  }
  if (address.trim() !== '' && address.length < 3) {
    errors.address = 'Delivery Address field is empty';
  }
  if (Number.isNaN(quantity)) {
    errors.quantity = 'Quantity of food to order should be a number';
  }
  if (`${quantity}`[0] === '-' || quantity === 0) {
    errors.quantity = 'Quantity of food to order is invalid';
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

// invoke getMenu function when the window load
window.onload = getMenu();

/**
 * @function
 * @description a funtion to calculate the total price of order
 * @param {*} id
 * @param {Object} totalPriceInputElement an HTML input
 * @param {*} price
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const calculateOrder = (id, totalPriceInputElementID, price) => {
  const qty = Number.parseInt(document.getElementById(`qty_${id}`).value, 10);
  const foodPrice = Number.parseInt(price, 10);
  const totalPrice = qty * foodPrice;
  document.getElementById(totalPriceInputElementID).value = totalPrice;
};

/**
 * @function
 * @description a funtion that handles the placing of orders by a user
 * @param {*} id
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const placeOrder = async (id) => {
  const errorDiv = document.getElementById(`orderFailAlert_${id}`);
  const errorMessage = document.getElementById(`orderMsg_${id}`);
  const successDiv = document.getElementById(`orderSuccessAlert_${id}`);
  const quantity = Number.parseInt(document.getElementById(`qty_${id}`).value, 10);
  const phoneNumber = document.getElementById(`phone_${id}`).value;
  const address = document.getElementById(`address_${id}`).value;
  const orderBtn = document.getElementById(`ord_${id}`);
  orderBtn.style.background = 'darkgray';
  orderBtn.style.color = 'white';
  orderBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Placing your order...';
  orderBtn.disabled = true;
  const orderData = JSON.stringify({
    quantity,
    phoneNumber,
    deliveryAddress: address,
    foodId: id
  });
  const validationResult = validateOrderInput(quantity, phoneNumber, address);
  if (Object.keys(validationResult).length > 0) {
    orderBtn.style.background = '#019875';
    orderBtn.style.color = 'white';
    orderBtn.innerText = 'Place Order';
    orderBtn.disabled = false;
    showErrorMessages(validationResult, errorDiv, errorMessage);
    return;
  }

  const url = 'api/v1/orders';
  const resp = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    }),
    body: orderData
  });

  const result = await resp.json();
  const {
    status,
    success,
    order,
    error
  } = result;
  if (status === 201 && success && order) {
    localStorage.setItem('userAddress', address);
    localStorage.setItem('userPhoneNumber', phoneNumber);
    successDiv.style.display = 'block';
    orderBtn.innerText = 'Place Order';
    orderBtn.disabled = true;
    setTimeout(() => {
      successDiv.style.display = 'none';
      window.location = 'orders.html';
    }, 1200);
    return;
  } if (!success) {
    orderBtn.style.background = '#019875';
    orderBtn.style.color = 'white';
    orderBtn.innerText = 'Place Order';
    orderBtn.disabled = false;
    showErrorMessages(error, errorDiv, errorMessage);
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
  offerMessage.style.display = 'none';
  const searchQuery = document.getElementById('search-box').value.trim();
  currentPage = 1;

  if (searchQuery === '') {
    offerMessage.style.display = 'block';
    searchMessage.style.display = 'none';
    menuArray = newMenuArray;
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
    menuHolder.style.display = 'none';
    pagination.style.display = 'none';
    return;
  }

  searchMessage.innerText = `Search results for "${searchQuery}"`;
  searchMessage.style.display = 'block';
  menuArray = searchResult;
  changePage(1, menuArray);
};

searchField.addEventListener('input', searchMenu);
