const mealsHolder = document.getElementById('meals-holder');
const token = sessionStorage.getItem('userToken');

/**
 * @function
 * @description a function to handle fetching and displaying of all meals
 * @returns {undefined}
 */
const getAllMeals = async () => {
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
  if (!success && status === 401) {
    sessionStorage.removeItem('userToken');
    window.location = '../login.html';
    return;
  }

  let mealsCard = '';

  menu.forEach((meal) => {
    mealsCard += `<div class="meal-card adm-card text-left">
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
  });
  mealsHolder.innerHTML = mealsCard;
};

// invoke getAllMeals function when the window load
window.onload = getAllMeals();
