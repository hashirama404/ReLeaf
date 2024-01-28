// Documents
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navClose = document.querySelector(".nav-close");
const closeNav = document.querySelector(".close");
const navLink = document.querySelectorAll(".nav-link");
const shadow1 = document.querySelector(".shadow1");
const overlay = document.querySelector(".overlay");
const rewardBtns = document.querySelectorAll('.reward-btn');
const bookmarkContainer = document.querySelector('.bookmark');
const bookmarkSvg = document.querySelector('.bookmark-svg');
const bookmarkButton = document.querySelector('.bookmark-btn');
const backProject = document.querySelector('.back_button');
const closeModal = document.querySelector('.close_modal');
const selection = document.querySelector(".selection");
const checkbox = document.querySelectorAll(".project_wrapper");
const success = document.querySelector(".container_3");
const content = document.querySelector(".container");
const numInputs = document.querySelectorAll('input[type=number]');
const continueBtns = document.querySelectorAll('.button_continue');
const gotItBtn = document.querySelector('.got-it-btn');
const amountRaised = document.getElementById('amont');
const backers = document.getElementById('num-of-backers');
const progressBar = document.querySelector('.progress-bar-filled');
const timerElement = document.querySelector(".timer");
var valueToStore = "your_value_here";
    localStorage.setItem("valuee", valueToStore);
    console.log(localStorage.getItem("valuee"));
let bookmarked;
const dataObj = JSON.parse(localStorage.getItem('data')) || {};

// Functions
backProject.addEventListener('click', redirectToProjectPage);

function redirectToProjectPage() {
  // Assuming valueToStore is the data you want to pass
  const valueToStore = "Hong Kong Flood Relief Starknet Payment Portal+0x01C21fbdbD54452B6d4d7350FF4ebf252dD216f297f6F526B8b81423e02C26dF";

    
  // Encode the data to be URL-safe
  const encodedValue = encodeURIComponent(valueToStore);

  // Change the URL to the desired page with the data in the query parameter
  window.location.href = `http://localhost:3000/?data=${encodedValue}`;
}
// Hamburger menu
function mobileMenu() {
  navMenu.classList.toggle("active");
  navClose.classList.toggle("active");
  hamburger.classList.add("hide");
  shadow1.classList.add("active");
}

function closeMenu() {
  hamburger.classList.remove("hide");
  navClose.classList.remove("active");
  navMenu.classList.remove("active");
  shadow1.classList.remove("active");
}

// Eventlisteners
hamburger.addEventListener("click", mobileMenu);
closeNav.addEventListener("click", closeMenu);
navLink.forEach((n) => n.addEventListener("click", closeMenu));

// Overlay toggle
function displayOverlay() {
  overlay.classList.remove('overlay-hidden');
  document.body.style.overflow = 'hide';
};

function hideOverlay() {
  overlay.classList.add('overlay-hidden');
  document.body.style.overflow = 'scroll';
};

// Eventlistener
bookmarkContainer.addEventListener('click', bookmarkToggle);

// Selection modal
function displayRewardSelected(e) {
  e.preventDefault();
  if(e.target.classList.contains('out-of-stock-bg')) return;

  const id = e.target.getAttribute('href');
  const dataNum = e.target.dataset.reward;
  const reward = document.querySelector(id);

  displaySelectionModal();
  reward.scrollIntoView({behavior: 'smooth'});
  reward.querySelector(`.input--${dataNum}`).checked = true;
};

function displaySelectionModal() {
  content.classList.add("hide");
  selection.classList.remove("hide");
  displayOverlay();
};

function closeSelectionModal() {
  hideOverlay();
  selection.classList.add("hide");
  content.classList.remove("hide");
  // resetPledge();
};

function getInput() {
  if (this.classList.contains("active")) {
  } else {
    const activeCheckbox = document.getElementsByClassName("project_wrapper active");
    for (let j = 0; j < activeCheckbox.length; j++) {
      activeCheckbox[j].classList.remove("active");
    }
    this.classList.add("active");
  }
}

function restrictNumInput() {
  this.value = this.valueAsNumber;
  if(this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);
};

function updateBackers() {
  let currentBackers = backers.textContent.replaceAll(',', '');
  const numOfBackers = ++currentBackers;
  const formattedNum = new Intl.NumberFormat(navigator.language, {style: 'decimal'}).format(numOfBackers);
  backers.textContent = `${formattedNum}`;
  dataObj.formattedNumOfBackers = formattedNum,
  localStorage.setItem('data', JSON.stringify(dataObj));
};

function updateAmountRaised(input) {
  let currentAmountRaised = amountRaised.textContent.replaceAll(',', '');
  const inputAmount = +input.value
  const updatedAmount =  +currentAmountRaised + inputAmount;
  const formattedAmount = new Intl.NumberFormat(navigator.language, {style: 'decimal'}).format(updatedAmount);
  
  amountRaised.textContent = `${formattedAmount}`;
  dataObj.formattedAmountRaised = formattedAmount;
  localStorage.setItem('data', JSON.stringify(dataObj));
};

function updateProgressBar() {
  const data = JSON.parse(localStorage.getItem('data'));
  const figureRaised = data?.formattedAmountRaised || amountRaised.textContent.replaceAll(',', '');
  const formattedFigureRaised = figureRaised.replaceAll(',', '');
  const percent = (+formattedFigureRaised / 100000) * 100;
  progressBar.style.flexBasis = `${20}%`;
};

function updateProgress(e) {
  const parentEl = e.target.closest('.pledging');
  const input = document.querySelector(`.pledge-input--${e.target.dataset.tab}`);

  if(input?.value == null) {
      closeSelectionModal();
      displayThanksModal();
      updateBackers();
      input.value = "";
  };
  if(input?.value != null) {
      if(input.value === '' || +input.value < +input.min || +input.value > +input.max) {
          const html = `<p class="margin-top error-msg">Your pledge should be between ${input.min} and ${input.max}</p>`
          if(parentEl.querySelector('.error-msg') != null) return;
          parentEl.insertAdjacentHTML('beforeend', html);
          setTimeout(() => parentEl.querySelector('p').remove(), 3000);  
      };
      if(+input.value >= input.min && +input.value <= +input.max) {
          updateBackers();
          updateAmountRaised(input);
          updateProgressBar();
          closeSelectionModal();
          displayThanksModal();
          input.value = "";
      };
  };
};



