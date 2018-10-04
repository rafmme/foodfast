const btnNext = document.getElementById('btn_next');
const btnPrev = document.getElementById('btn_prev');
const pageSpan = document.getElementById('page');
const totalOrderStat = document.getElementById('total-order-stat');
const completeOrderStat = document.getElementById('complete-order-stat');
const newOrderStat = document.getElementById('new-order-stat');
const processedOrderStat = document.getElementById('processed-order-stat');
const orderTableBody = document.getElementById('order-table-body');
const modalsHolder = document.getElementById('modals-holder');
const noOrderText = document.getElementById('no-orders-text');
const token = localStorage.getItem('userToken');
const searchField = document.getElementById('order-search-box');
const searchMessage = document.getElementById('search-message');
const pagination = document.getElementById('pagination');
let allOrders, newOrders, completeOrders,
  processedOrders, cancelledOrders;
let paginationArray;

if (!token) {
  window.location = 'login.html';
}

let currentPage = 1;
const recordsPerPage = 10;

const numPages = contentArray => Math.ceil(contentArray.length / recordsPerPage);

const changePage = (page, contentArray) => {
  if (page < 1) page = 1;
  if (page > numPages(contentArray)) page = numPages(contentArray);

  orderTableBody.innerHTML = '';
  pagination.style.display = 'flex';

  for (
    let i = (page - 1) * recordsPerPage;
    i < (page * recordsPerPage)
        && i < contentArray.length; i += 1
  ) {
    const order = contentArray[i];
    orderTableBody.innerHTML += `<tr onclick="showModal('${order.orderId}')">
    <td data-label="OrderID">${order.orderId.slice(0, 8)}</td>
    <td data-label="Food Item">${order.food.title}</td>
    <td data-label="Qty">${order.quantity}</td>
    <td data-label="Amount">₦ ${order.totalPrice}</td>
    <td data-label="Date">${new Date(order.createdAt).toDateString()}</td>
    <td data-label="Status">${order.status}</td>
    </tr>`;
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
const prevPage = (contentArray) => {
  if (currentPage > 1) {
    currentPage -= 1;
    changePage(currentPage, contentArray);
  }
};

// eslint-disable-next-line no-unused-vars
const nextPage = (contentArray) => {
  if (currentPage < numPages(contentArray)) {
    currentPage += 1;
    changePage(currentPage, contentArray);
  }
};

/**
 * @function
 * @description a function to handle fetching and displaying of a user's order history
 * @returns {undefined}
 */
const getUserOrders = async () => {
  searchMessage.style.display = 'none';
  const spinner = document.getElementById('loader');
  const wrapper = document.getElementById('content-wrapper');
  wrapper.style.opacity = 0;
  const { userId } = jwt_decode(token);
  const url = `api/v1/users/${userId}/orders`;
  const resp = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: new Headers({
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`
    })
  });
  const result = await resp.json();
  const { status, success, orders } = result;
  if (result) {
    spinner.style.display = 'none';
    wrapper.style.opacity = 1;
  }
  if (!success && status === 401) {
    localStorage.removeItem('userToken');
    window.location = 'login.html';
    return;
  }
  allOrders = orders.reverse();
  newOrders = orders.filter(order => order.status === 'New');
  completeOrders = orders.filter(order => order.status === 'Complete');
  processedOrders = orders.filter(order => order.status === 'Processing');
  cancelledOrders = orders.filter(order => order.status === 'Cancelled');

  newOrderStat.innerText = newOrders.length;
  completeOrderStat.innerText = completeOrders.length;
  processedOrderStat.innerText = processedOrders.length;
  totalOrderStat.innerText = orders.length;
  let modals = '';

  if (orders.length === 0) {
    noOrderText.style.display = 'block';
    document.getElementById('orders-table').style.display = 'none';
    document.getElementById('pagination').style.display = 'none';
    return;
  }

  paginationArray = allOrders;
  changePage(1, paginationArray);
  orders.forEach((order) => {
    modals += `<div id="${order.orderId}" class="modal">
    <div class="container modal-content animate">
        <div class="imgcontainer">
            <span style="margin-top: -15px;" onclick="closeModal('${order.orderId}')" class="close" title="Close Modal">&times;</span>
        </div>
        <h3>Order Information</h3>
        <div class="row">
            <div class="col-2">
                <label for="orderID">Order ID</label>
                <input type="text" name="" id="orderID" value="${order.orderId}" disabled>
            </div>
            <div class="col-2">
                <div class="mg-left-10">
                    <label for="customer">Customer</label>
                    <input type="text" name="" id="customer" value="${order.customer.email}" disabled>
                </div>
            </div>
        </div>
        <label for="title">Food Item</label>
        <input type="text" name="" id="title" value="${order.food.title}" disabled>
        <img src="${order.food.imageUrl}" alt="" class="modal-image">
        <div class="row">
            <div class="col-2"> <label for="qty">Quantity</label>
                <input type="number" value="${order.quantity}" name="" id="qty" disabled>
            </div>
            <div class="col-2">
                <div class="mg-left-10">
                    <label for="price">Total Price</label>
                    <input type="text" value="₦ ${order.totalPrice}" name="" id="price" disabled>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-2">
                <label for="phone">Phone Number</label>
                <input type="tel" name="" id="phone" value="${order.phoneNumber}" disabled placeholder="Phone Number">
            </div>
            <div class="col-2">
                <div class="mg-left-10">
                    <label for="address">Delivery Address</label>
                    <input type="text" name="" id="address" value="${order.deliveryAddress}" disabled placeholder="Delivery Location">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-2"><label for="date">Date & Time Placed</label>
                <input type="text" name="" id="date" value="${new Date(order.createdAt).toDateString()}" disabled placeholder="Date of Order">
            </div>
            <div class="col-2">
                <div class="mg-left-10">
                    <label for="status">Order Status</label>
                    <input type="text" name="" id="status" value="${order.status}" disabled>
                </div>
            </div>
        </div>
    </div>
  </div>`;
  });
  modalsHolder.innerHTML = modals;
};

// invoke getUserOrders function when the window load
window.onload = getUserOrders();

/**
 * @function
 * @description a function to populate the orders table with filtered data
 * @param {String} action the chosen select field option
 * @returns {undefined}
 */
const populateTableWithFilteredOrders = (action) => {
  switch (action) {
    case 'New':
      if (newOrders.length > 0) {
        currentPage = 1;
        paginationArray = newOrders;
        changePage(1, paginationArray);
      }
      break;
    case 'Cancelled':
      if (cancelledOrders.length > 0) {
        currentPage = 1;
        paginationArray = cancelledOrders;
        changePage(1, paginationArray);
      }
      break;
    case 'Complete':
      if (completeOrders.length > 0) {
        currentPage = 1;
        paginationArray = completeOrders;
        changePage(1, paginationArray);
      }
      break;
    case 'Processing':
      if (processedOrders.length > 0) {
        currentPage = 1;
        paginationArray = processedOrders;
        changePage(1, paginationArray);
      }
      break;
    default:
      currentPage = 1;
      paginationArray = allOrders;
      changePage(1, paginationArray);
      break;
  }
};

/**
 * @function
 * @description a function to filter user's orders according to the status
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const filterUserOrders = () => {
  searchMessage.style.display = 'none';
  searchField.value = '';
  const orderFilterField = document.getElementById('order-filter');
  populateTableWithFilteredOrders(orderFilterField.value);
};

/**
 * @function
 * @description a function to handle the search of orders
 * @param {Object} evt
 * @returns {undefined}
 */
const searchMenu = (evt) => {
  evt.preventDefault();
  const searchQuery = document.getElementById('order-search-box').value.trim();
  currentPage = 1;

  if (noOrderText.style.display === 'block') {
    return;
  }

  if (searchQuery === '') {
    searchMessage.style.display = 'none';
    paginationArray = allOrders;
    changePage(1, paginationArray);
    return;
  }

  const searchResult = allOrders.filter((order) => {
    const {
      createdAt,
      status,
      food,
      customer
    } = order;
    const orderDate = `${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}`;
    const orderId = `#${order.orderId}`;
    return orderId.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        || customer.email.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        || food.title.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        || status.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
        || orderDate.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;
  });

  if (searchResult.length < 1) {
    searchMessage.innerText = `No match found for "${searchQuery}"`;
    searchMessage.style.display = 'block';
    orderTableBody.innerHTML = '';
    pagination.style.display = 'none';
    return;
  }

  searchMessage.innerText = `Search results for "${searchQuery}"`;
  searchMessage.style.display = 'block';
  paginationArray = searchResult;
  changePage(1, paginationArray);
};

searchField.addEventListener('input', searchMenu);
