const btnNext = document.getElementById('btn_next');
const btnPrev = document.getElementById('btn_prev');
const pageSpan = document.getElementById('page');
const ordersHolder = document.getElementById('orders-holder');
const token = localStorage.getItem('userToken');
const noOrderText = document.getElementById('no-orders-text');
const totalOrderStat = document.getElementById('total-order-stat');
const completeOrderStat = document.getElementById('complete-order-stat');
const newOrderStat = document.getElementById('new-order-stat');
const processedOrderStat = document.getElementById('processed-order-stat');
const modalsHolder = document.getElementById('modals-holder');
const searchField = document.getElementById('order-search-box');
const searchMessage = document.getElementById('search-message');
const pagination = document.getElementById('pagination');
let allOrders, newOrders, completeOrders,
  processedOrders, cancelledOrders;
let paginationArray;
let currentPage = 1;
const recordsPerPage = 7;

const createOrderCard = (order) => {
  let orderCard = '';
  const {
    orderId,
    customer,
    status,
    createdAt,
    food,
    quantity,
    totalPrice
  } = order;
  switch (status) {
    case 'New':
      orderCard = `<div class="order-card el-card" ondblclick="showModal('${orderId}')">
        <div class="mg">
            <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${orderId}')"></i>
            <ul class="hide" id="menu_${orderId}">
                <li class="el-card" onclick="showModal('${orderId}')"><a class="bg-green"><i class="fa fa-info"></i>
                        View</a></li>
                <li class="el-card" onclick="processNewOrder('Processing', '${orderId}')"><a id="accept_${orderId.slice(0, 8)}" class="bg-green"><i class="fa fa-check"></i>
                        Accept</a></li>
                <li class="el-card" onclick="processNewOrder('Cancelled', '${orderId}')"><a id="reject_${orderId.slice(0, 8)}" class="bg-red"><i class="fa fa-trash-o"></i>
                        Reject</a></li>
            </ul>
        </div>
        <div class="order-history-header">
            <h3>#${orderId.slice(0, 8)}</h3>
            <h3>${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}</h3>
        </div>
        <hr>
        <div>
            <p><span><i class="fa fa-user"> ${customer.email}</i></span>&nbsp; - &nbsp;${food.title}&nbsp; - &nbsp;${quantity} pcs</p>
        </div>
        <div class="order-history-footer">
            <h3 class="text-primary-color">₦${totalPrice}</h3>
            <h3>Status: <span class="text-orange">${status}</span></h3>
        </div>
    </div>`;
      break;
    case 'Processing':
      orderCard = `<div class="order-card el-card" ondblclick="showModal('${orderId}')">
      <div class="mg">
          <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${orderId}')"></i>
          <ul class="hide" id="menu_${orderId}">
              <li class="el-card" onclick="showModal('${orderId}')"><a class="bg-green"><i class="fa fa-info"></i>
                      View</a></li>
              <li class="el-card" onclick="showModal('update_${orderId}')"><a class="bg-green"><i class="fa fa-edit"></i>
                      Update</a></li>
          </ul>
      </div>
      <div class="order-history-header">
          <h3>#${orderId.slice(0, 8)}</h3>
          <h3>${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}</h3>
      </div>
      <hr>
      <div>
      <p><span><i class="fa fa-user"> ${customer.email}</i></span>&nbsp; - &nbsp;${food.title}&nbsp; - &nbsp;${quantity} pcs</p>
      </div>
      <div class="order-history-footer">
          <h3 class="text-primary-color">₦${totalPrice}</h3>
          <h3>Status: <span class="text-orange">${status}</span></h3>
      </div>
  </div>`;
      break;
    case 'Cancelled':
      orderCard = `<div class="order-card el-card" ondblclick="showModal('${orderId}')">
      <div class="mg">
          <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${orderId}')"></i>
          <ul class="hide" id="menu_${orderId}">
              <li class="el-card" onclick="showModal('${orderId}')"><a class="bg-green"><i class="fa fa-info"></i>
                      View</a></li>
          </ul>
      </div>
      <div class="order-history-header">
          <h3>#${orderId.slice(0, 8)}</h3>
          <h3>${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}</h3>
      </div>
      <hr>
      <div>
      <p><span><i class="fa fa-user"> ${customer.email}</i></span>&nbsp; - &nbsp;${food.title}&nbsp; - &nbsp;${quantity} pcs</p>
      </div>
      <div class="order-history-footer">
          <h3 class="text-primary-color">₦${totalPrice}</h3>
          <h3>Status: <span class="text-primary-color">${status}</span></h3>
      </div>
  </div>`;
      break;
    case 'Complete':
      orderCard = `<div class="order-card el-card" ondblclick="showModal('${orderId}')">
      <div class="mg">
          <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${orderId}')"></i>
          <ul class="hide" id="menu_${orderId}">
              <li class="el-card" onclick="showModal('${orderId}')"><a class="bg-green"><i class="fa fa-info"></i>
                      View</a></li>
          </ul>
      </div>
      <div class="order-history-header">
          <h3>#${orderId.slice(0, 8)}</h3>
          <h3>${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}</h3>
      </div>
      <hr>
      <div>
      <p><span><i class="fa fa-user"> ${customer.email}</i></span>&nbsp; - &nbsp;${food.title}&nbsp; - &nbsp;${quantity} pcs</p>
      </div>
      <div class="order-history-footer">
          <h3 class="text-primary-color">₦${totalPrice}</h3>
          <h3>Status: <span class="text-primary-green">${status}</span></h3>
      </div>
  </div>`;
      break;
    default:
      break;
  }
  return orderCard;
};

const numPages = contentArray => Math.ceil(contentArray.length / recordsPerPage);

const changePage = (page, contentArray) => {
  if (contentArray.length === 0 || undefined) {
    return;
  }
  if (page < 1) page = 1;
  if (page > numPages(contentArray)) page = numPages(contentArray);

  ordersHolder.innerHTML = '';
  ordersHolder.style.display = 'flex';
  pagination.style.display = 'flex';

  for (
    let i = (page - 1) * recordsPerPage;
    i < (page * recordsPerPage)
        && i < contentArray.length; i += 1
  ) {
    const order = contentArray[i];
    ordersHolder.innerHTML += createOrderCard(order);
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
 * @description a function to handle fetching and displaying of all orders
 * @returns {undefined}
 */
const getAllOrders = async () => {
  searchMessage.style.display = 'none';
  const spinner = document.getElementById('loader');
  const wrapper = document.getElementById('content-wrapper');
  wrapper.style.opacity = 0;
  const url = '../api/v1/orders';
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
    window.location = '../login.html';
    return;
  }
  if (status === 403) {
    window.location = '../index.html';
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
  paginationArray = allOrders;

  if (orders.length === 0) {
    noOrderText.style.display = 'block';
    document.getElementById('pagination').style.display = 'none';
    return;
  }

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
    if (order.status === 'Processing') {
      modals += `<div id="update_${order.orderId}" class="modal">
      <form class="container modal-content animate" id="update-form">
          <div class="imgcontainer">
              <span style="margin-top: -15px;" onclick="closeModal('update_${order.orderId}')" class="close" title="Close Modal">&times;</span>
          </div>
          <h3>Update Order</h3>
          <div class="alert" id="orderFailAlert_${order.orderId}" style="display: none">
          <p id="orderMsg_${order.orderId}" style="margin-top: 10px"></p>
         </div>
         <div class="alert bg-green text-center" id="orderSuccessAlert_${order.orderId}" style="display: none">
         <i class="fa fa-check"></i> Order was updated successfully
         </div>
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
          <label for="title">Food</label>
          <input type="text" name="" id="title" disabled value="${order.food.title}">
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
          <label for="Status">Order Status</label>
          <select name="" id="status_${order.orderId}" required>
              <option value=""></option>
              <option value="Complete">Complete</option>
          </select>
          <button id="ordBtn_${order.orderId}" onclick="updateOrder('${order.orderId}')" style="margin-top: auto;" type="button">Update Order Status</button>
      </form>
      </div>`;
    }
  });
  modalsHolder.innerHTML = modals;
  changePage(1, paginationArray);
};

  // invoke getAllOrders function when the window load
window.onload = getAllOrders();

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
 * @description a funtion that handles the updating of an order status
 * @param {*} id
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const processNewOrder = (newOrderStatus, id) => {
  const spinner = document.getElementById('loader');
  const wrapper = document.getElementById('content-wrapper');
  wrapper.style.opacity = 0;
  const processOrder = async () => {
    const url = `../api/v1/orders/${id}`;
    const resp = await fetch(url, {
      method: 'PUT',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`
      }),
      body: JSON.stringify({
        status: newOrderStatus
      })
    });

    const result = await resp.json();
    const {
      status,
      success,
      order
    } = result;
    if (result) {
      spinner.style.display = 'none';
      wrapper.style.opacity = 1;
    }
    if (status === 200 && success && order) {
      const alertBox = document.getElementById('order-alert-div');
      const alertBoxMessageElement = document.getElementById('order-alert-p');
      const { orderId } = order;
      switch (order.status) {
        case 'Cancelled':
          message = `<span><i class="fa fa-remove" aria-hidden="true"></i></span>
           Order #${orderId.slice(0, 8)} has been cancelled`;
          alertBox.style.display = 'block';
          alertBoxMessageElement.innerHTML = message;
          setTimeout(() => {
            alertBox.style.display = 'none';
            window.location = 'index.html';
          }, 1800);
          break;

        case 'Processing':
          message = `<span><i class="fa fa-check-square-o" aria-hidden="true"></i></span>
           Order #${orderId.slice(0, 8)} has been accepted`;
          alertBox.style.display = 'block';
          alertBoxMessageElement.innerHTML = message;
          setTimeout(() => {
            alertBox.style.display = 'none';
            window.location = 'index.html';
          }, 1800);
          break;

        default:
          alertBox.style.display = 'none';
          window.location = 'index.html';
          break;
      }
    }
  };

  if (newOrderStatus === 'Processing') {
    const processOrdBtn = document.getElementById(`accept_${id.slice(0, 8)}`);
    processOrdBtn.classList.remove(['bg-green']);
    processOrdBtn.style.background = 'darkgray';
    processOrder();
  } else if (newOrderStatus === 'Cancelled') {
    const processOrdBtn = document.getElementById(`reject_${id.slice(0, 8)}`);
    processOrdBtn.classList.remove(['bg-red']);
    processOrdBtn.style.background = 'darkgray';
    processOrdBtn.disabled = true;
    processOrder();
  }
};


/**
 * @function
 * @description a funtion that handles the updating of an order status
 * @param {*} id
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const updateOrder = async (id) => {
  const errorDiv = document.getElementById(`orderFailAlert_${id}`);
  const errorMessage = document.getElementById(`orderMsg_${id}`);
  const successDiv = document.getElementById(`orderSuccessAlert_${id}`);
  const orderStatus = document.getElementById(`status_${id}`).value;
  const updateOrdBtn = document.getElementById(`ordBtn_${id}`);
  updateOrdBtn.style.background = 'darkgray';
  updateOrdBtn.style.color = 'white';
  updateOrdBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Updating Order...';
  updateOrdBtn.disabled = true;
  const orderData = JSON.stringify({
    status: orderStatus
  });

  const url = `../api/v1/orders/${id}`;
  const resp = await fetch(url, {
    method: 'PUT',
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
  if (status === 200 && success && order) {
    successDiv.style.display = 'block';
    updateOrdBtn.innerText = 'Update Order Status';
    updateOrdBtn.disabled = true;
    setTimeout(() => {
      successDiv.style.display = 'none';
      window.location = 'index.html';
    }, 1500);
    return;
  } if (!success) {
    updateOrdBtn.style.background = '#019875';
    updateOrdBtn.style.color = 'white';
    updateOrdBtn.innerText = 'Update Order Status';
    updateOrdBtn.disabled = false;
    showErrorMessages(error, errorDiv, errorMessage);
  }
};

/**
 * @function
 * @description a function to populate the orders with filtered data
 * @param {String} action the chosen select field option
 * @returns {undefined}
 */
const populateFilteredOrders = (action) => {
  switch (action) {
    case 'New':
      if (newOrders.length > 0) {
        currentPage = 1;
        paginationArray = newOrders;
        changePage(1, newOrders);
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
   * @description a function to filter orders according to the status
   * @returns {undefined}
   */
  // eslint-disable-next-line no-unused-vars
const filterUserOrders = () => {
  searchMessage.style.display = 'none';
  searchField.value = '';
  ordersHolder.style.display = 'flex';
  const orderFilterField = document.getElementById('order-filter');
  populateFilteredOrders(orderFilterField.value);
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
    ordersHolder.style.display = 'flex';
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
    ordersHolder.style.display = 'none';
    pagination.style.display = 'none';
    return;
  }

  searchMessage.innerText = `Search results for "${searchQuery}"`;
  searchMessage.style.display = 'block';
  ordersHolder.style.display = 'flex';
  paginationArray = searchResult;
  changePage(1, paginationArray);
};

searchField.addEventListener('input', searchMenu);
