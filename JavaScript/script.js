// import { products } from "./data";

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

})

cartCloseBtn?.forEach((btn) => {
    btn?.addEventListener("click", () => {

        cart?.classList.add("translate-x-100")

    })
})



