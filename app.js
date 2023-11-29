const cartContainer = document.querySelector(".cart-container");
const productList = document.querySelector(".product-list");
const cartList = document.querySelector(".cart-list");
const cartTotalValue = document.getElementById("cart-total-value");
const cartCountInfo = document.getElementById("cart-count-info");
let cartItemID = 1;

function eventListeners() {
  const navbarToggler = document.querySelector(".navbar-toggler");
  const cartButton = document.getElementById("cart-btn");

  if (navbarToggler) {
    navbarToggler.addEventListener("click", () => {
      document
        .querySelector(".navbar-collapse")
        .classList.toggle("show-navbar");
    });
  }

  if (cartButton) {
    cartButton.addEventListener("click", () => {
      document
        .querySelector(".cart-container")
        .classList.toggle("show-cart-container");
    });
  }

  document
    .querySelector(".product-list")
    .addEventListener("click", purchaseProduct);

  document.querySelector(".cart-list").addEventListener("click", deleteProduct);
}

// Call the function after the DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  eventListeners();
  loadJSON();
  loadCart();
  updateCartInfo();
});

function loadJSON() {
  fetch("furniture.json")
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      data.forEach((product) => {
        html += `
                    <div class="product-item">
                        <div class="product-img">
                            <img src="${product.imgSrc}" alt="product image">
                            <button type="button" class="add-to-cart-btn">
                                <i class="fas fa-shopping-cart"></i>Add To Cart
                            </button>
                        </div>
                        <div class="product-content">
                            <h3 class="product-name">${product.name}</h3>
                            <span class="product-category">${product.category}</span>
                            <p class="product-price">$${product.price}</p>
                        </div>
                    </div>
                `;
      });
      document.querySelector(".product-list").innerHTML = html;
    })
    .catch((error) => {
      alert(`User live server or local server`);
      //URL scheme must be "http" or "https" for CORS request. You need to be serving your index.html locally or have your site hosted on a live server somewhere for the Fetch API to work properly.
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadJSON();
});

//purchase product
function purchaseProduct(e) {
  if (e.target.classList.contains("add-to-cart-btn")) {
    let product = e.target.parentElement.parentElement;
    getProductInfo(product);
  }
}

//update cart info
function updateCartInfo() {
  const cartCountInfo = document.getElementById("cart-count-info");
  const cartTotalValue = document.getElementById("cart-total-value");
  let cartInfo = findCartInfo();
  console.log(cartInfo);
  cartCountInfo.textContent = cartInfo.productCount;
  cartTotalValue.textContent = cartInfo.total;
}

//get product info after add to cart button click
function getProductInfo(product) {
  let productInfo = {
    id: cartItemID,
    imgSrc: product.querySelector(".product-img img").src,
    name: product.querySelector(".product-name").textContent,
    category: product.querySelector(".product-category").textContent,
    price: product.querySelector(".product-price").textContent,
  };
  cartItemID++;
  // console.log(productInfo);
  addToCartList(productInfo);
  saveProductInStorage(productInfo);
}

//add the selected product ot cart list
function addToCartList(product) {
  const cartItem = document.createElement("div");
  cartItem.classList.add("cart-item");
  cartItem.setAttribute("data-id", `${product.id}`);
  cartItem.innerHTML = `
  
    <img src="${product.imgSrc}" alt="product image">
    <div class="cart-item-info">
      <h3 class="cart-item-name">${product.name}</h3>
      <span class="cart-item-category">${product.category}</span>
      <span class="cart-item-price">${product.price}</span>
    </div>
             
    <button type="button" class="cart-item-del-btn">
      <i class="fas fa-times"></i>
    </button>
          
  `;
  document.querySelector(".cart-list").appendChild(cartItem);
}

//save the product in local storage
function saveProductInStorage(item) {
  let products = getProductFromStorage();
  products.push(item);
  localStorage.setItem("products", JSON.stringify(products));

  updateCartInfo();
}

//get all the products info if there is any in the local storage
function getProductFromStorage() {
  return localStorage.getItem("products")
    ? JSON.parse(localStorage.getItem("products"))
    : []; //returns empty array if there isnt any productinfo
  // console.log("Products retrieved from storage:", products);
}

//load carts product
function loadCart() {
  let products = getProductFromStorage();
  if (products.length < 1) {
    cartItemID = 1; //if there is no product in local storage
  } else {
    cartItemID = products[products.length - 1].id;
    cartItemID++;
  } //else get id of latest product and increment it by 1

  products.forEach((product) => addToCartList(product));
}

//calculate total price of the cart and other info
function findCartInfo() {
  let products = getProductFromStorage();
  console.log(products);
  let total = products.reduce((acc, product) => {
    let price = parseFloat(product.price.substr(1)); //removing dollar sign
    return (acc += price);
  }, 0); //adding all the prices
  console.log(total);
  return {
    total: total.toFixed(2),
    productCount: products.length,
  };
}
findCartInfo();

// delete product from cart list and local storage
function deleteProduct(e) {
  let cartItem;
  if (e.target.tagName === "BUTTON") {
    cartItem = e.target.parentElement;
    cartItem.remove(); // this removes from the DOM only
  } else if (e.target.tagName === "I") {
    cartItem = e.target.parentElement.parentElement;
    cartItem.remove(); // this removes from the DOM only
  }

  let products = getProductFromStorage();
  let updatedProducts = products.filter((product) => {
    return product.id !== parseInt(cartItem.dataset.id);
  });
  localStorage.setItem("products", JSON.stringify(updatedProducts)); // updating the product list after the deletion
  updateCartInfo();
}
