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
                        id="add-card-btn" data-id="${product.id}">Add to cart</button>
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
            if (existingProduct.quantiy >= selectedProduct.stock) return

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

    if (subTotal >= 100) {

        shipping = 0

    }

    shippingCost.innerText = `$${shipping}`;

    let totalCost = subTotal + shipping + tax;

    totalOfProducts.innerText = `$${totalCost}`

}











