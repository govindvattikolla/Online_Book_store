// DOM elements
const formOpenBtn = document.querySelector("#login-btn");
const home = document.querySelector(".home1"),
      formContainer = document.querySelector(".form_container"),
      formCloseBtn = document.querySelector(".form_close"),
      signupBtn = document.querySelector("#signup"),
      loginBtn = document.querySelector("#login"),
      pwShowHide = document.querySelectorAll(".pw_hide"),
      searchForm = document.querySelector('.search-form'),
      searchBox = document.getElementById("search-box"),
      landingPg = document.getElementById("landing-pg"),
      booksPg = document.getElementById("books-wrapper"),
      bookListContainer = document.getElementById('book-list'),
      homepage = document.getElementById("home-pg");
      heading1=document.getElementById("heading1");
      
      


// Swiper instances
let swiperBooks, swiperFeatured, swiperArrivals, swiperReviews, swiperBlogs;

// Event listeners for login form
formOpenBtn.addEventListener("click", e => { home.classList.toggle("show"); e.preventDefault(); });
formCloseBtn.addEventListener("click", e => { home.classList.remove("show"); formContainer.classList.remove("active"); e.preventDefault(); });
signupBtn.addEventListener("click", e => { e.preventDefault(); formContainer.classList.add("active"); });
loginBtn.addEventListener("click", e => { e.preventDefault(); formContainer.classList.remove("active"); });

// Toggle password visibility
pwShowHide.forEach(icon => {
  icon.addEventListener("click", () => {
    const input = icon.parentElement.querySelector("input");
    input.type = input.type === "password" ? "text" : "password";
    icon.classList.toggle("uil-eye-slash");
    icon.classList.toggle("uil-eye");
  });
});

// Toggle search form visibility
document.querySelector('#search-btn').onclick = () => searchForm.classList.toggle('active');

// Scroll behavior
window.onscroll = () => {
  searchForm.classList.remove('active');
  document.querySelector('.header .header-2').classList.toggle('active', window.scrollY > 80);
};

// Loader functionality
window.onload = () => { document.querySelector('.header .header-2').classList.toggle('active', window.scrollY > 80); fadeOut(); };
function loader() { document.querySelector('.loader-container').classList.add('active'); }
function fadeOut() { setTimeout(loader, 3000); }

// Swiper initialization function
function initializeSwipers() {
  const swiperSettings = {
    loop: true,
    centeredSlides: true,
    autoplay: { delay: 4500, disableOnInteraction: false },
    breakpoints: { 0: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  };

  swiperBooks = new Swiper(".books-slider", swiperSettings);
  swiperFeatured = new Swiper(".featured-slider", { ...swiperSettings, navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" } });
  swiperArrivals = new Swiper(".arrivals-slider", swiperSettings);
  swiperReviews = new Swiper(".reviews-slider", { ...swiperSettings, grabCursor: true });
  swiperBlogs = new Swiper(".blogs-slider", { ...swiperSettings, grabCursor: true });
}

// Fetch and display books
let alldata = [];
async function fetchBooks() {
  try {
    const response = await fetch("http://localhost:3000/books");
    alldata = await response.json();
    localStorage.setItem("alldata", JSON.stringify(alldata));
    displayBooks(alldata);
  } catch (err) { console.log(err); }
}

// Display books dynamically

function displayBooks(books) {
  bookListContainer.innerHTML = ""; // Clear the existing book list

  // Check if there are any books
  books.forEach(book => {
    let bookCard = document.createElement('div');
    bookCard.classList.add('book-card');
    
    bookCard.innerHTML = `
    <img src="${book.cover_image_url}" alt="${book.title}">
    <h3>${book.title}</h3>
    <p>By: ${book.author}</p>
    <h4>Price: ₹${book.price}</h4>
    <button id="cartbtn">Add to Cart</button>`;
    
    bookListContainer.appendChild(bookCard);
    
    bookCard.querySelector("#cartbtn").addEventListener("click",()=>{
      addToCart(book)
    })
    
    
  });
  if (books.length === 0) {
    const noBooksMessage = document.createElement('div');
    noBooksMessage.classList.add('no-books-message');
    noBooksMessage.innerHTML = "No books found";
    bookListContainer.appendChild(noBooksMessage); // Add the message to the container
    return;
  } 
  

  // Reinitialize Swipers (if necessary)
  reinitializeSwiper();
}

// Search functionality
searchBox.addEventListener("focus", () => { landingPg.style.display = "none"; booksPg.style.display = ""; initializeSwipers();  });
function visibility() { booksPg.style.display = "none"; landingPg.style.display = "block";  reinitializeSwiper(); }
let shopNow=document.getElementById("shopnow");
shopNow.addEventListener("click",()=>{
  landingPg.style.display = "none"; booksPg.style.display = "";})

searchBox.addEventListener("input", () => {
  const keyword = searchBox.value.toLowerCase().trim();
  heading1.innerHTML=`searching for " ${searchBox.value}"`;
  const filteredBooks = alldata.filter(book => 
    book.title.toLowerCase().includes(keyword) || 
    book.author.toLowerCase().includes(keyword) || 
    book.category.toLowerCase().includes(keyword)
  );
  displayBooks(filteredBooks.length ? filteredBooks : []); // Display the filtered books or empty array
   
});

// Reinitialize all Swiper instances after content change
function reinitializeSwiper() {
  // Destroy existing Swipers if initialized
  if (swiperBooks && swiperBooks.destroy) swiperBooks.destroy(true, true);
  if (swiperFeatured && swiperFeatured.destroy) swiperFeatured.destroy(true, true);
  if (swiperArrivals && swiperArrivals.destroy) swiperArrivals.destroy(true, true);
  if (swiperReviews && swiperReviews.destroy) swiperReviews.destroy(true, true);
  if (swiperBlogs && swiperBlogs.destroy) swiperBlogs.destroy(true, true);

  // Reinitialize Swipers after destroying
  initializeSwipers();
}

// Initialize
fetchBooks();
initializeSwipers();
 
//add to cart process
function addToCart(item) {
  let cartData = JSON.parse(localStorage.getItem("cart")) || []; // Load cart from localStorage 
  let exists = cartData.find(x => x.title === item.title);
  if(!exists){
    cartData.push(item);
    alert(`${item.title} has been added to your cart!`);
    localStorage.setItem("cart", JSON.stringify(cartData));   // Save cart to localStorage
  }
  else {
   alert(`${item.title} is already in your cart!`);
 }
}

// View cart process
function viewCart() {
  if (localStorage.getItem("logedin") === "true") {
    window.location.href = "./cart.html"; // Redirect to cart page
  } else {
    alert("Please login to view your cart.");
    home.classList.toggle("show"); e.preventDefault();
  }
}

//login functionality
const loginSubmit=document.getElementById("login-submit");
const signupSubmit=document.getElementById("singup-submit");

loginSubmit.addEventListener("click",(event)=>{
  handleLogin(event)
  // console.log("login")
});
signupSubmit.addEventListener("click", (event) => {
  createUser(event); 
  // console.log("signup")
});

function handleLogin(event){
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  //checking if the user in the local storage aren't
  const storedUser=localStorage.getItem(username);
  if(storedUser){
    const storedPw=JSON.parse(storedUser).password;
    if(storedPw==password){
      alert("login successfull");
      localStorage.setItem("logedin","true")
      window.location.href="./cart.html";
    }
    else{
      alert("Invalid Password")
    }
  }
    else{
      alert("User Doesn't exist")
    }
}
// function to create a newUser and store in local storage
function createUser(event){
  event.preventDefault();
  const username=document.getElementById("newUser").value;
  const password=document.getElementById("newPw").value;
  const confirmPw=document.getElementById("confirmPw").value;
  if(password==confirmPw){
  if(username && password){
    localStorage.setItem(username,JSON.stringify({username:username,password:password}));
    alert("User created successfully");
    event.preventDefault(); formContainer.classList.remove("active");
  }
  else{
    alert("please enter a username and password")
  }
}
else{
  alert("confirm password should be matched with password")
}
}

// logout functionality
const logoutOption = document.getElementById("logout-option");
const logoutBtn = document.getElementById("logout-btn");

if (localStorage.getItem("logedin") === "true") {
  // Show logout option when mouseover on the icon
  formOpenBtn.addEventListener("mouseover", () => {
    logoutOption.style.display = "block";
  });

  // Hide logout option when mouse leaves both the icon and the logout option
  formOpenBtn.addEventListener("mouseleave", () => {
    // Use a setTimeout to prevent immediate hiding before the user hovers over the logout button
    setTimeout(() => {
      if (!logoutOption.matches(':hover')) {
        logoutOption.style.display = "none";
      }
    }, 100);
  });

  // Show logout option when mouseover on the logout option itself
  logoutOption.addEventListener("mouseover", () => {
    logoutOption.style.display = "block";
  });

  // Hide logout option when mouse leaves the logout option
  logoutOption.addEventListener("mouseleave", () => {
    logoutOption.style.display = "none";
  });


// Handle the logout action
logoutBtn.addEventListener("click", () => {
  handleLogout();
});

function handleLogout() {
  // Remove the 'logedin' status from localStorage
  localStorage.removeItem("logedin");
  alert("do you want to logout");

  // Optionally, redirect the user to the login page
  logoutOption.style.display = "none"; // Hide logout option
  // home.classList.toggle("show"); e.preventDefault();
}
}

