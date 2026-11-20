import { products } from "./data.js";

// Theme Change 

const html = document.documentElement;

let themeBtn = document.querySelector("#theme-btn");

const darkIcon = document.querySelector(".sun");

const lightIcon = document.querySelector(".moon");

function updateThemeIcons() {

    if (html.dataset.theme === "dark") {

        darkIcon?.classList.remove("hidden")

        lightIcon?.classList.add("hidden")

    }

    else {

        darkIcon?.classList.add("hidden")

        lightIcon?.classList.remove("hidden")

    }

};

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark" || savedTheme === "light") {

    html.dataset.theme = savedTheme

};

updateThemeIcons();

themeBtn?.addEventListener("click", () => {

    if (html.dataset.theme === "dark") {

        html.dataset.theme = "light"

    }

    else {

        html.dataset.theme = "dark"

    }

    localStorage.setItem("theme", html.dataset.theme)

    updateThemeIcons()

});

// Cart open & close 

let cartBtn = document.querySelector(".cart-open-btn");

let cartCloseBtn = document.querySelectorAll(".close-btn");

let cart = document.querySelector(".cart");

cartBtn?.addEventListener("click", () => {

    cart?.classList.remove("translate-x-100")

});

cartCloseBtn?.forEach((btn) => {

    btn?.addEventListener("click", () => {

        cart?.classList.add("translate-x-100")

    })

});

// Displaying products 

let allProductGrid = document.querySelector(".all-product-grid");

products.forEach((product) => {

    allProductGrid.insertAdjacentHTML("beforeend",

        `

 <div

 class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

 <!-- glow: inside the card, behind the text -->

 <div

 class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">

 </div>

<div
    class="absolute top-2 right-2 bg-electric/20 rounded-md flex justify-center items-center transition duration-400 cursor-pointer py-2 px-4 text-xs font-medium">
    ${product.stock} in stock
</div>

<!-- content: positioned so it paints above the glow -->

 <div class="relative flex flex-col gap-6">

 <span class="text-electric text-xs font-medium">${product.id} / ${product.category}</span>

 <h3 class="text-text text-xl font-medium">

 ${product.name}

 </h3>

 <div class="mask-b-from-50%">

 <img src="${product.image}" alt="" class="h-60 w-full object-cover">

 </div>

 <div class="flex justify-between mt-2">

 <p class="productName">${product.name}</p>

 <p class="productPrice">$${product.price}</p>

 </div>

<p class="text-muted text-sm font-normal">

 ${product.description}

 </p>

 <div>
 <button

 class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full"

 id="add-card-btn" data-id="${product.id}">Add to cart</button>
 <button

 class="bg-surface text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full mt-2"

 id="show-product" data-id="${product.id}">Show product</button>

 </div>

 </div>

 </div> 

 `

    )

})

// CartBtn 

let addToCartBtn = document.querySelectorAll("#add-card-btn");

let cartCount = document.querySelector("#cart-count");

let totalCount = Number(localStorage.getItem("count")) || 0;

cartCount.innerText = totalCount;

let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

let count = cartItems.reduce((total, item) => {

    return total += item.quantity

}, 0);

if (cartCount) {

    cartCount.innerText = count

}

addToCartBtn?.forEach((cartBtn) => {

    cartBtn.addEventListener("click", () => {

        let productId = Number(cartBtn.dataset.id);

        let selectedProduct = products.find((product) => {

            return product.id === productId

        })

        if (!selectedProduct || selectedProduct.stock <= 0) return

        let existingProduct = cartItems.find((item) => {

            return item.id === productId

        })

        if (existingProduct) {

            if (existingProduct.quantity >= selectedProduct.stock) return

            existingProduct.quantity++;

        }

        else {

            cartItems.push({

                id: selectedProduct.id,

                category: selectedProduct.category,

                name: selectedProduct.name,

                price: selectedProduct.price,

                quantity: 1

            });

        };

        count = cartItems.reduce((total, item) => {

            return total += item.quantity

        }, 0);

        if (cartCount) cartCount.innerText = count;

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

    });

});

// Updating cartItems 

let cartCollection = document.querySelector(".cart-collection");

cartItems.map((item) => {

    cartCollection.insertAdjacentHTML("beforeend", `

 <div class="product-info bg-bg border border-border rounded-md p-4 flex flex-col gap-2">

   <span class="text-electric text-xs font-medium">${item.id} / ${item.category}</span>

 <div class="flex justify-between">

 <div>

   <h3 class="text-text text-xl font-medium mb-2" id="product-name">

 ${item.name}

  </h3>

  <div class="count-block flex justify-start gap-2">

    <span

  class="size-6 border border-border rounded-full flex justify-center items-center text-[16px] bg-surface hover:border-electric cursor-pointer"

    id="count-increase">

    +</span>

    <span class="count-num">${item.quantity}</span>

  <span

  class="size-6 border border-border rounded-full flex justify-center items-center text-[16px] bg-surface hover:border-electric cursor-pointer"

  id="count-decrease">

   -</span>

   </div>

   </div>

   <div>

  <p class="productPrice">$${item.price}</p>

 <button class="productRemove hover:underline text-muted cursor-pointer text-sm" data-id="${item.id}">Remove</button>

 </div>

 </div>

 </div>

 `)

})

// Remove Products form cart 

let removeItemCart = document.querySelectorAll(".productRemove");

removeItemCart.forEach((remove) => {

    remove.addEventListener("click", () => {

        let productId = Number(remove.dataset.id);

        cartItems = cartItems.filter((item) => {

            return item.id !== productId;

        });

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        remove.closest(".product-info").remove();

        count = cartItems.reduce((total, item) => {

            return total + item.quantity;

        }, 0);

        if (cartCount) {

            cartCount.innerText = count;

        }

    });

});

// Calculations 

let cartSubTotal = document.querySelector("#subtotal");

let shippingCost = document.querySelector("#shipping");

let totalOfProducts = document.querySelector("#total-of-products")

let subTotal = cartItems.reduce((total, item) => {

    return total + (item.quantity * item.price)

}, 0);

cartSubTotal.innerText = `$${subTotal}`;

if (cartItems.length > 0) {

    let shipping = 20;

    let tax = 10;

    let discount = 0;

    if (subTotal >= 100) {

        shipping = 0

    }

    shippingCost.innerText = `$${shipping}`;

    let totalCost = subTotal + shipping + tax - discount;

    totalOfProducts.innerText = `$${totalCost}`

    // discount applier 

    let discountCode = "siraura"
    let discountCode2 = "zakugreataura"

    let promoCodeForm = document.querySelector("#promo-code-form");

    let promoCodeInput = document.querySelector("#promo-input");

    promoCodeForm?.addEventListener("submit", (e) => {

        e.preventDefault();

        let value = promoCodeInput.value.trim().replace(/[^a-zA-Z]/g, "");

        if (value === discountCode) {

            discount = 20;

            totalCost = subTotal + shipping + tax - discount;

            totalOfProducts.innerText = `$${totalCost}`;

        }

        if (value === discountCode2) {

            discount = 100;

            totalCost = subTotal + shipping + tax - discount;

            totalOfProducts.innerText = `$${totalCost}`;

        }

        promoCodeForm.reset();

    })

}

// Filtering Products
let filterBtn = document.querySelectorAll(".filter-btn");

filterBtn?.forEach((btn) => {

    btn?.addEventListener("click", () => {

        filterBtn.forEach((b) => {

            b?.classList.remove("bg-blue")
            b?.classList.add("bg-surface")
            document.getElementById(b.dataset.target)?.classList.add("hidden");

        })

        btn?.classList.add("bg-blue")
        btn?.classList.remove("bg-surface")
        document.getElementById(btn.dataset.target)?.classList.remove("hidden")
    })

})

// Filtered Products 
let electronicProducts = document.querySelector(".electronics-product-grid");
let accessoriesProducts = document.querySelector(".accessories-product-grid");
let clothingProducts = document.querySelector(".clothing-product-grid");
let homeApplicancesProducts = document.querySelector(".home-appliances-product-grid");

// Electronics 
products.forEach((product) => {

    if (product.category === "Electronics") {
        electronicProducts.insertAdjacentHTML("beforeend",

            `

 <div

 class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

 <!-- glow: inside the card, behind the text -->

 <div

 class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">

 </div>

  <div
        class="absolute top-2 right-2 bg-electric/20 rounded-md flex justify-center items-center transition duration-400 cursor-pointer py-2 px-4 text-xs font-medium">
        ${product.stock} in stock
    </div>

<!-- content: positioned so it paints above the glow -->

 <div class="relative flex flex-col gap-6">

 <span class="text-electric text-xs font-medium">${product.id} / ${product.category}</span>

 <h3 class="text-text text-xl font-medium">

 ${product.name}

 </h3>

 <div class="mask-b-from-50%">

 <img src="${product.image}" alt="" class="h-60 w-full object-cover">

 </div>

 <div class="flex justify-between mt-2">

 <p class="productName">${product.name}</p>

 <p class="productPrice">$${product.price}</p>

 </div>

<p class="text-muted text-sm font-normal">

 ${product.description}

 </p>

 <div>
 <button

 class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full"

 id="add-card-btn" data-id="${product.id}">Add to cart</button>
 <button

 class="bg-surface text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full mt-2"

 id="show-product" data-id="${product.id}">Show product</button>

 </div>

 </div>

 </div> 

 `

        )
    }


})

// Accessories 
products.forEach((product) => {

    if (product.category === "Accessories") {
        accessoriesProducts.insertAdjacentHTML("beforeend",

            `

 <div

 class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

 <!-- glow: inside the card, behind the text -->

 <div

 class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">

 </div>

  <div
        class="absolute top-2 right-2 bg-electric/20 rounded-md flex justify-center items-center transition duration-400 cursor-pointer py-2 px-4 text-xs font-medium">
        ${product.stock} in stock
    </div>

<!-- content: positioned so it paints above the glow -->

 <div class="relative flex flex-col gap-6">

 <span class="text-electric text-xs font-medium">${product.id} / ${product.category}</span>

 <h3 class="text-text text-xl font-medium">

 ${product.name}

 </h3>

 <div class="mask-b-from-50%">

 <img src="${product.image}" alt="" class="h-60 w-full object-cover">

 </div>

 <div class="flex justify-between mt-2">

 <p class="productName">${product.name}</p>

 <p class="productPrice">$${product.price}</p>

 </div>

<p class="text-muted text-sm font-normal">

 ${product.description}

 </p>

 <div>
 <button

 class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full"

 id="add-card-btn" data-id="${product.id}">Add to cart</button>
 <button

 class="bg-surface text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full mt-2"

 id="show-product" data-id="${product.id}">Show product</button>

 </div>

 </div>

 </div> 

 `

        )
    }


})

//Clothing
products.forEach((product) => {

    if (product.category === "Clothing") {
        clothingProducts.insertAdjacentHTML("beforeend",

            `

 <div

 class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

 <!-- glow: inside the card, behind the text -->

 <div

 class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">

 </div>

  <div
        class="absolute top-2 right-2 bg-electric/20 rounded-md flex justify-center items-center transition duration-400 cursor-pointer py-2 px-4 text-xs font-medium">
        ${product.stock} in stock
    </div>

<!-- content: positioned so it paints above the glow -->

 <div class="relative flex flex-col gap-6">

 <span class="text-electric text-xs font-medium">${product.id} / ${product.category}</span>

 <h3 class="text-text text-xl font-medium">

 ${product.name}

 </h3>

 <div class="mask-b-from-50%">

 <img src="${product.image}" alt="" class="h-60 w-full object-cover">

 </div>

 <div class="flex justify-between mt-2">

 <p class="productName">${product.name}</p>

 <p class="productPrice">$${product.price}</p>

 </div>

<p class="text-muted text-sm font-normal">

 ${product.description}

 </p>

 <div>
 <button

 class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full"

 id="add-card-btn" data-id="${product.id}">Add to cart</button>
 <button

 class="bg-surface text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full mt-2"

 id="show-product" data-id="${product.id}">Show product</button>

 </div>

 </div>

 </div> 

 `

        )
    }


})

// Home Appliances 
products.forEach((product) => {

    if (product.category === "Home Appliances") {
        homeApplicancesProducts.insertAdjacentHTML("beforeend",

            `

 <div

 class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

 <!-- glow: inside the card, behind the text -->

 <div

 class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">

 </div>

  <div
        class="absolute top-2 right-2 bg-electric/20 rounded-md flex justify-center items-center transition duration-400 cursor-pointer py-2 px-4 text-xs font-medium">
        ${product.stock} in stock
    </div>

<!-- content: positioned so it paints above the glow -->

 <div class="relative flex flex-col gap-6">

 <span class="text-electric text-xs font-medium">${product.id} / ${product.category}</span>

 <h3 class="text-text text-xl font-medium">

 ${product.name}

 </h3>

 <div class="mask-b-from-50%">

 <img src="${product.image}" alt="" class="h-60 w-full object-cover">

 </div>

 <div class="flex justify-between mt-2">

 <p class="productName">${product.name}</p>

 <p class="productPrice">$${product.price}</p>

 </div>

<p class="text-muted text-sm font-normal">

 ${product.description}

 </p>

  <div>
 <button

 class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full"

 id="add-card-btn" data-id="${product.id}">Add to cart</button>
 <button

 class="bg-surface text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium w-full mt-2"

 id="show-product" data-id="${product.id}">Show product</button>

 </div>

 </div>

 </div> 

 `

        )
    }


})

// Opening product popup
let productPopup = document.querySelector("#product-info-popup");
let productPopupOpener = document.querySelectorAll("#show-product");
// let productPopupCloser = document.querySelectorAll(".product-info-popup-close");

productPopupOpener?.forEach((productBtn) => {

    productBtn.addEventListener("click", () => {

        productPopup.classList.remove("hidden")

        let productId = Number(productBtn.dataset.id);

        let selectedProduct = products.find((product) => {

            return product.id === productId

        })

        if (selectedProduct) {

            productPopup.innerHTML = `
                
                              <div
            class="w-150 h-auto border border-border hover:border-electric rounded-md bg-surface p-0 backdrop-blur-3xl min-h-100 flex flex-col justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

            <div
                class="absolute top-2 right-2 text-muted size-6 rounded-full border border-border hover:border-electric flex justify-center items-center product-info-popup-close cursor-pointer z-10">
                x</div>

            <div class="product-info-popup-image">
            <img src="${selectedProduct.image}" class="z-1 w-full h-100 object-cover">
            </div>

            <div class="product-info-popup-info flex justify-between p-6">

                <div>
                    <span class="text-electric text-xs font-medium">${selectedProduct.id} / ${selectedProduct.category}</span>
                    <h3 class="text-text text-2xl font-medium">${selectedProduct.name}</h3>
                </div>

                <div>
                    <p class="text-muted text-sm font-medium">

                      $${selectedProduct.price}

                    </p>
                </div>

            </div>

        </div>
                `

            let productPopupCloser = productPopup.querySelector(".product-info-popup-close");

            productPopupCloser.addEventListener("click", () => {

                console.log("clicked");

                productPopup.classList.add("hidden");

            });

        }

    });

});

// productPopupCloser.forEach((closer) => {

//     closer.addEventListener("click", () => {

//         // productPopup.classList.toggle("hidden")

//         console.log("clicked")

//     })

// })

