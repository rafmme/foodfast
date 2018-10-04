const totalOrderStat = document.getElementById('total-order-stat');
const completeOrderStat = document.getElementById('complete-order-stat');
const newOrderStat = document.getElementById('new-order-stat');
const processedOrderStat = document.getElementById('processed-order-stat');
const orderTableBody = document.getElementById('order-table-body');
const modalsHolder = document.getElementById('modals-holder');
const noOrderText = document.getElementById('no-orders-text');
const token = sessionStorage.getItem('userToken');

if (!token) {
  window.location = 'login.html';
}

/**
 * @function
 * @description a function to handle fetching and displaying of a user's order history
 * @returns {undefined}
 */
const getUserOrders = async () => {
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
  if (!success && status === 401) {
    sessionStorage.removeItem('userToken');
    window.location = 'login.html';
    return;
  }
  const newOrders = orders.filter(order => order.status === 'New');
  const completeOrders = orders.filter(order => order.status === 'Complete');
  const processedOrders = orders.filter(order => order.status === 'Processing');

  newOrderStat.innerText = newOrders.length;
  completeOrderStat.innerText = completeOrders.length;
  processedOrderStat.innerText = processedOrders.length;
  totalOrderStat.innerText = orders.length;
  let tableRows = '';
  let modals = '';

  if (orders.length === 0) {
    noOrderText.style.display = 'block';
    document.getElementById('orders-table').style.display = 'none';
  }

  orders.forEach((order) => {
    tableRows += `<tr onclick="showModal('${order.orderId}')">
        <td data-label="OrderID">${order.orderId.slice(0, 8)}</td>
        <td data-label="Food Item">${order.food.title}</td>
        <td data-label="Qty">${order.quantity}</td>
        <td data-label="Amount">₦ ${order.totalPrice}</td>
        <td data-label="Date">${new Date(order.createdAt).toDateString()}</td>
        <td data-label="Status">${order.status}</td>
        </tr>`;

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
  orderTableBody.innerHTML = tableRows;
  modalsHolder.innerHTML = modals;
};

// invoke getUserOrders function when the window load
window.onload = getUserOrders();
