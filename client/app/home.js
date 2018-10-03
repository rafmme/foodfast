const menuHolder = document.getElementById('menu-holder');

/**
 * @function
 * @description a function to handle fetching the menu and displaying it to the user
 * @returns {undefined}
 */
const getMenu = async () => {
  const url = 'api/v1/menu';
  const token = sessionStorage.getItem('userToken');

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
    mealCards += `<div class="meal-card m-card" id="${meal.id}">
    <img src=${meal.imageUrl} alt="Avatar" style="width:100%; height: 120px;">
    <div class="container">
        <h4 style="margin-top: 20px">
            <b>${meal.title.slice(0, 19)}</b>
        </h4>
        <p class="min-p">${meal.description}</p>
        <p class="price"><b>₦ ${meal.price}</b></p>
        <button id="${meal.id}" class="bg-green" onclick="showModal('make-order')">Order</button>
    </div>
   </div>`;
  });
  menuHolder.innerHTML = mealCards;
};

// invoke getMenu function when the window load
window.onload = getMenu();
