const uToken = localStorage.getItem('userToken');
const loginLink = document.getElementById('login-link');
const signUpLink = document.getElementById('signup-link');
const getStartedBtn = document.getElementById('showcase-btn');

/**
 * @function
 * @description a function to logout a user
 * @returns {undefined}
 */
// eslint-disable-next-line no-unused-vars
const logout = () => {
  localStorage.removeItem('userToken');
  window.location = '../../infopage.html';
};

if (uToken !== null) {
  if (
    loginLink !== null
        && signUpLink !== null
        && getStartedBtn !== null
  ) {
    loginLink.style.display = 'none';
    signUpLink.style.display = 'none';
    getStartedBtn.style.display = 'none';
  }
}
const toggleBtn = () => {
  const x = document.getElementById('myTopnav');
  if (x.className === 'topnav') {
    x.className += ' responsive';
  } else {
    x.className = 'topnav';
  }
};

const closeModalForm = (elemID) => {
  const modal = document.getElementById(elemID);
  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };
};

const closeModal = (elemID) => {
  document.getElementById(elemID).style.display = 'none';
};

const showModal = (elemID) => {
  if (document.getElementById(elemID) !== null) {
    document.getElementById(elemID).style.display = 'block';
    closeModalForm(elemID);
  }
};

const close = document.getElementsByClassName('closebtn');
let i;
for (i = 0; i < close.length; i += 1) {
  close[i].onclick = () => {
    const div = this.parentElement;
    div.style.opacity = '0';
    setTimeout(() => { div.style.display = 'none'; }, 600);
  };
}


function initMap() {
  const locale = { lat: 6.5538235, lng: 3.3664734 };
  const map = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: locale });
  const marker = new google.maps.Marker({
    position: locale,
    map
  });

  const infoWindow = new google.maps.InfoWindow({
    content: '<p style="font-weight: bolder; color: #333;">Fast Food Fast Restaurant Building</p> <br> <p>Opens 8:30AM - 10:30PM everyday</p>'
  });
  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
}

const showMenu = (elemID) => {
  const menuItem = document.getElementById(elemID);
  if (menuItem !== null) {
    menuItem.classList.toggle('hide');
  }
};
