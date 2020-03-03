const menuBtn = document.querySelector(".menu-btn"),
  menuNav = document.querySelector("nav");

let menuIsOpen = false;

menuBtn.addEventListener("click", function() {
  if (!menuIsOpen) {
    menuNav.classList.add("open");
    menuBtn.classList.add("open");
    menuIsOpen = true;
  } else {
    menuNav.classList.remove("open");
    menuBtn.classList.remove("open");
    menuIsOpen = false;
  }

  console.log("hello");
});
