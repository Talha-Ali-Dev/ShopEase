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
let productGrid = document.querySelector(".product-grid");

products.forEach((product) => {

    productGrid.insertAdjacentHTML("beforeend",
        `
                <div
                class="relative overflow-hidden p-10 border border-border bg-surface rounded-xl hover:border-electric transition duration-400 group">

                <!-- glow: inside the card, behind the text -->
                <div
                    class="pointer-events-none absolute -top-10 -right-10 size-50 rounded-full bg-orb1 opacity-0 blur-2xl group-hover:opacity-20 transition duration-400">
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

                    <button
                        class="bg-blue text-text cursor-pointer rounded-sm border border-border px-6 py-2 font-medium "
                        id="add-card-btn">Add to cart</button>
                </div>

            </div> 
        `

    )

})

// CartBtn 
let addToCartBtn = document.querySelectorAll("#add-card-btn");
let cartCount = document.querySelector("#cart-count");

let count = 0;

addToCartBtn?.forEach((cartBtn) => {

    cartBtn.addEventListener("click", () => {

        count++;
        cartCount.innerText = count

    });

})







