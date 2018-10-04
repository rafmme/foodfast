const ordersHolder = document.getElementById('orders-holder');
const token = sessionStorage.getItem('userToken');
const noOrderText = document.getElementById('no-orders-text');
const totalOrderStat = document.getElementById('total-order-stat');
const completeOrderStat = document.getElementById('complete-order-stat');
const newOrderStat = document.getElementById('new-order-stat');
const processedOrderStat = document.getElementById('processed-order-stat');
const modalsHolder = document.getElementById('modals-holder');

/**
 * @function
 * @description a function to handle fetching and displaying of all orders
 * @returns {undefined}
 */
const getAllOrders = async () => {
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
  if (!success && status === 401) {
    sessionStorage.removeItem('userToken');
    window.location = '../login.html';
    return;
  }
  if (status === 403) {
    window.location = '../index.html';
  }

  const newOrders = orders.filter(order => order.status === 'New');
  const completeOrders = orders.filter(order => order.status === 'Complete');
  const processedOrders = orders.filter(order => order.status === 'Processing');

  newOrderStat.innerText = newOrders.length;
  completeOrderStat.innerText = completeOrders.length;
  processedOrderStat.innerText = processedOrders.length;
  totalOrderStat.innerText = orders.length;

  let ordersCard = '';
  let modals = '';

  if (orders.length === 0) {
    noOrderText.style.display = 'block';
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
    switch (order.status) {
      case 'New':
        ordersCard += `<div class="order-card el-card bd-left-red" style="padding: 10px;" ondblclick="showModal('${order.orderId}')">
        <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${order.orderId}')"></i>
        <ul class="hide" id="menu_${order.orderId}">
            <li onclick="showModal('${order.orderId}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-info"></i>
                    View</a></li>
            <li onclick="showModal('update_${order.orderId}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-edit"></i>
                    Update</a></li>
        </ul>
        <div class="order-card-content">
            <p class="orderId-mg">OrderId: <span>${order.orderId.slice(0, 8)}</span></p>
            <p class="mg">Food:<span> ${order.food.title}</span></p>
            <p class="mg">Customer:<span> ${order.customer.email}</span></p>
            <div class="flex-row mg">
                <p class="mg">Qty:<span> ${order.quantity}</span></p>
                <p class="mg">Amount:<span> ₦${order.totalPrice}</span></p>
            </div>
            <p class="mg">Status:<span> ${order.status}</span></p>
            <p class="mg">Date: <span>${new Date(order.createdAt).toLocaleDateString()}</span></p>
        </div>
    </div>`;
        break;
      case 'Processing':
        ordersCard += `<div class="order-card el-card bd-left-orange" style="padding: 10px;" ondblclick="showModal('${order.orderId}')">
      <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${order.orderId}')"></i>
      <ul class="hide" id="menu_${order.orderId}">
          <li onclick="showModal('${order.orderId}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-info"></i>
                  View</a></li>
          <li onclick="showModal('update_${order.orderId}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-edit"></i>
                  Update</a></li>
      </ul>
      <div class="order-card-content">
          <p class="orderId-mg">OrderId: <span>${order.orderId.slice(0, 8)}</span></p>
          <p class="mg">Food:<span> ${order.food.title}</span></p>
          <p class="mg">Customer:<span> ${order.customer.email}</span></p>
          <div class="flex-row mg">
              <p class="mg">Qty:<span> ${order.quantity}</span></p>
              <p class="mg">Amount:<span> ₦${order.totalPrice}</span></p>
          </div>
          <p class="mg">Status:<span> ${order.status}</span></p>
          <p class="mg">Date: <span>${new Date(order.createdAt).toLocaleDateString()}</span></p>
      </div>
  </div>`;
        break;
      default:
        ordersCard += `<div class="order-card el-card bd-left-green" style="padding: 10px;" ondblclick="showModal('${order.orderId}')">
      <i class="fa fa-ellipsis-v icn" onclick="showMenu('menu_${order.orderId}')"></i>
      <ul class="hide" id="menu_${order.orderId}">
          <li onclick="showModal('${order.orderId}')"><a class="bg-green" href="javascript:void(0);"><i class="fa fa-info"></i>
                  View</a></li>
      </ul>
      <div class="order-card-content">
          <p class="orderId-mg">OrderId: <span>${order.orderId.slice(0, 8)}</span></p>
          <p class="mg">Food:<span> ${order.food.title}</span></p>
          <p class="mg">Customer:<span> ${order.customer.email}</span></p>
          <div class="flex-row mg">
              <p class="mg">Qty:<span> ${order.quantity}</span></p>
              <p class="mg">Amount:<span> ₦${order.totalPrice}</span></p>
          </div>
          <p class="mg">Status:<span> ${order.status}</span></p>
          <p class="mg">Date: <span>${new Date(order.createdAt).toLocaleDateString()}</span></p>
      </div>
  </div>`;
        break;
    }
  });
  ordersHolder.innerHTML = ordersCard;
  modalsHolder.innerHTML = modals;
};

  // invoke getAllOrders function when the window load
window.onload = getAllOrders();
