const menuHolder = document.getElementById('menu-holder');
const token = sessionStorage.getItem('userToken');
const userAddress = localStorage.getItem('userAddress') || '';
const userPhoneNumber = localStorage.getItem('userPhoneNumber') || '';

/**
 * @function
 * @description a function to handle fetching the menu and displaying it to the user
 * @returns {undefined}
 */
const getMenu = async () => {
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
  if (!success && status === 401) {
    sessionStorage.removeItem('userToken');
    window.location = 'login.html';
    return;
  }
  let mealCards = '';
  menu.forEach((meal) => {
    mealCards += `<div class="meal-card m-card">
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
       <button type="button" style="margin-top: auto;" class="bg-green" onclick="placeOrder('${meal.id}')">Place Order</button>
   </form>
   </div>`;
  });
  menuHolder.innerHTML = mealCards;
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
  const orderData = JSON.stringify({
    quantity,
    phoneNumber,
    deliveryAddress: address,
    foodId: id
  });
  const validationResult = validateOrderInput(quantity, phoneNumber, address);
  if (Object.keys(validationResult).length > 0) {
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
    setTimeout(() => {
      successDiv.style.display = 'none';
      window.location = 'orders.html';
    }, 400);
    return;
  } if (!success) {
    showErrorMessages(error, errorDiv, errorMessage);
  }
};
