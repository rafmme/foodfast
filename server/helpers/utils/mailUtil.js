import {
  generateEmailHeaderText,
  generateOrderContent
} from './mailContentGenerator';

const createHTMLEmail = (orderData) => {
  const orderDivContent = generateOrderContent(orderData);
  const { headerText, messageBody } = generateEmailHeaderText({
    name: orderData.customer.fullname,
    orderId: orderData.orderId,
    status: orderData.status
  });

  const emailTemplate = `<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>FOODFAST - ORDER EMAIL</title>
    <link rel="stylesheet " href="https://fonts.googleapis.com/css?family=Arimo:300,400,700">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:300,400,700">
    <link rel="stylesheet " href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css ">
    <style>
* {
    box-sizing: border-box;
}

*::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    width: 6px;
    height: 6px;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
}

*::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.08);
}


html {
    font-family: "Arimo", 'Lato', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    height: 100%;
}

body {
    margin: 0px;
    height: 100%;
}

.text-center {
    text-align: center;
}

.header-text {
    color: #019875;
}

.cancel-header-text {
    color: #d64541;
    ;
}

.enquires-text {
    font-style: italic;
    font-size: 1.3rem;
    color: #d64541;
}

#brand {
    font-weight: bolder;
    margin-top: -5px;
}

.brand-name {
    font-size: 25px;
    color: #d64541;
}

.brand-container {
    position: relative;
    text-align: center;
    margin: 24px 0 12px 0;
}

.brand-container a {
    text-decoration: none;
}

.container {
    position: relative;
    min-height: 100%;
    margin: 20px 90px 10px 90px;
}

.span-text {
    font-style: oblique;
}

.order-item {
    font-size: 1.2rem;
}

.order-detail-container {
    display: flex;
    flex-direction: row;
    padding: 0px 20% 0px 20%;
    justify-content: space-evenly;
}

.order-detail-data {
    padding: 0px !important;
}

.order-detail-container img {
    width: 350px;
    height: 300px;
}

.email-desc {
    margin-top: auto;
    font-size: 1.2rem;
}

.email-desc p:nth-child(2) {
    margin-top: -15px;
}

.email-body {
    display: flex;
    flex-direction: column;
}

footer {
    position: absolute;
    margin-top: 10px;
    width: 100%;
    background: lightgray;
    color: #d64541;
    font-weight: bold;
}

@media screen and (max-width: 874px) {
    .order-detail-container {
        flex-direction: column;
        padding: 0px;
    }

    .container {
        margin: 20px 30px 10px 30px;
    }

    .order-detail-container img {
        width: 300px;
        height: 300px;
    }
}
</style>
</head>

<body>
    <div class="container">
        <div class="brand-container">
            <a href="https://foodie21.herokuapp.com" target="_blank"><img src="https://foodie21.herokuapp.com/assets/images/icons8_Food_Service_48px_3.png"
                    alt=""></a>
            <a href="https://foodie21.herokuapp.com" target="_blank"><h3 class="brand-name" id="brand">FoodFast</h3></a>
        </div>
        <div class="email-body">
            ${headerText}
            <div class="email-desc text-center">
               ${messageBody}
            </div>
            ${orderDivContent}
        </div>
        <div>
            <p class="text-center enquires-text">
                Got any complaints, mail us at customercare@foodfast.com or call us on 080-FOOD-FAST. Your satisfaction is our concern.
            </p>
        </div>
    </div>
    <footer>
        <p class="text-center">&copy; ${new Date().getFullYear()} FoodFast</p>
    </footer>
</body>
</html>`;
  return emailTemplate;
};

export default createHTMLEmail;
