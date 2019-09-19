const generateOrderContent = ({
  orderId,
  customer,
  food,
  quantity,
  totalPrice,
  deliveryAddress,
  phoneNumber,
  status,
  createdAt,
  updatedAt
}) => {
  const orderContent = `<div>
        <h2 class="text-center">Meal item Ordered</h2>
        <div class="order-detail-container">
            <img src="${food.imageUrl}" width="300px" height="300px" alt="Meal image">
            <div class="order-item">
                <p>Meal Name: <span class="span-text">${food.title}</span></p>
                <p>Meal Price: <span class="span-text">₦${food.price}</span></p>
                <p>Quantity ordered: <span class="span-text">${quantity}</span></p>
                <p>Order Total: <span class="span-text">₦${totalPrice}</span></p>
            </div>
        </div>
    </div>
    <div>
        <h2 class="text-center">Order & Shipping Info</h2>
        <div class="order-detail-container order-detail-data">
            <div class="order-detail">
                <h3>Order details</h3>
                <div class="order-item">
                    <p>Order reference: <span class="span-text">#${orderId.slice(0, 8)}</span></p>
                    <p>Order ID: <span class="span-text">${orderId}</span></p>
                    <p>Date placed: <span class="span-text">${new Date(createdAt).toDateString()} ${new Date(createdAt).toLocaleTimeString()}</span></p>
                    <p>Date updated: <span class="span-text">${new Date(updatedAt).toDateString()} ${new Date(updatedAt).toLocaleTimeString()}</span></p>
                    <p>Current status: <span class="span-text">${status}</span></p>
                </div>
            </div>
            <div class="shipping-detail">
                <h3>Shipping Address</h3>
                <div class="order-item">
                <p><i class="fa fa-user-circle-o" aria-hidden="true"></i> ${customer.fullname}</p>
                <p><i class="fa fa-envelope-o" aria-hidden="true"></i> Customer's email: <span class="span-text">${customer.email}</span></p>
                <p><i class="fa fa-address-card-o" aria-hidden="true"></i> Delivery address: <span class="span-text">${deliveryAddress}</span></p>
                <p><i class="fa fa-mobile-phone" aria-hidden="true"></i> Phone number: <span class="span-text">${phoneNumber}</span></p>
            </div>
        </div>
    </div>`;
  return orderContent;
};


const generateEmailHeaderText = (data) => {
  const {
    status,
    name,
    orderId
  } = data;
  let headerText = '';
  let messageBody = '';

  switch (status) {
    case 'New':
      headerText = `<h2 class="text-center header-text"><i class="fa fa-check-circle-o" aria-hidden="true"></i> Your Order was placed
    successfully
    </h2>`;
      messageBody = `<p>
    Hi <span class="span-text">${name}</span>, we are pleased to inform you that your order <span class="span-text">#${orderId.slice(0, 8)}</span>
    was placed successfully.
    </p>
    <p>
    We will update you soon on your order.
    </p>`;
      break;
    case 'Processing':
      headerText = `<h2 class="text-center header-text"><i class="fa fa-check-square-o" aria-hidden="true"></i> Your Order has been
    confirmed
    </h2>`;
      messageBody = ` <p>
    Hi <span class="span-text">${name}</span>, we are pleased to inform you that your order <span class="span-text">#${orderId.slice(0, 8)}</span>
    has been confirmed. Thanks for patronizing us.
    </p>`;
      break;
    case 'Cancelled':
      headerText = `<h2 class="text-center cancel-header-text"><i class="fa fa-remove" aria-hidden="true"></i> Your Order has been
    cancelled
    </h2>`;
      messageBody = `<p>
    Hi <span class="span-text">${name}</span>, we are sorry to inform you that we won't be processing your
    order <span class="span-text">#${orderId.slice(0, 8)}</span>
    at this time, we are sorry for any inconviniences this may cause.
    </p>`;
      break;
    case 'Complete':
      headerText = `<h2 class="text-center header-text"><i class="fa fa-check-square-o" aria-hidden="true"></i> Your Order has been
    marked as completed
    </h2>`;
      messageBody = `<p>
    Hi <span class="span-text">${name}</span>, this is to inform you that your order <span class="span-text">#${orderId.slice(0, 8)}</span>
    has been marked as completed. We look forward to more orders from you. Thanks for patronizing us.
    </p>`;
      break;
    default:
      break;
  }
  return {
    headerText,
    messageBody
  };
};

const generateEmailSubject = ({
  status,
  orderId
}) => {
  let emailSubject = '';

  switch (status) {
    case 'New':
      emailSubject = `Your Order #${orderId.slice(0, 8)} was placed successfully`;
      break;
    case 'Processing':
      emailSubject = `Your Order #${orderId.slice(0, 8)} has been confirmed`;
      break;
    case 'Cancelled':
      emailSubject = `Your Order #${orderId.slice(0, 8)} has been rejected`;
      break;
    case 'Complete':
      emailSubject = `Your Order #${orderId.slice(0, 8)} has been marked completed`;
      break;
    default:
      break;
  }
  return emailSubject;
};

export {
  generateEmailSubject,
  generateOrderContent,
  generateEmailHeaderText
};
