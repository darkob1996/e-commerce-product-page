class App {
  // STATE
  _state = {
    name: "Fall Limited Edition Sneakers",
    price: 125,
    quantity: 0,
    cartEmpty: true,
  };

  // MENU
  _menu = document.querySelector(".menu");
  _menuOpen = document.querySelector(".header__menu-icon");
  _menuClose = document.querySelector(".menu__close-icon");
  _overlay = document.querySelector(".overlay");
  _cart = document.querySelector(".cart");
  _cartIcon = document.querySelector(".header__cta--cart-icon");

  // MAIN
  _main = document.querySelector(".main");
  _galleryThumbnails = document.querySelectorAll(".main__gallery--product");
  _galleryThumbnailsContainer = document.querySelector(
    ".main__gallery--all-products"
  );
  _mainGalleryImg = document.querySelector(".main__gallery--main-img");
  _cta = document.querySelector(".main__content--cta");
  _submit = document.querySelector(".main__content--submit");

  // MODAL
  _modal = document.querySelector(".modal");
  _modalContainer = document.querySelector(".modal__container");
  _modalMain = document.querySelector(".modal__main");
  _modalMainImgs = this._modalMain.querySelectorAll("div");
  _modalGallery = document.querySelector(".modal__gallery");
  _modalGalleryItems = document.querySelectorAll(".modal__gallery--item");
  _nextButton = document.querySelector(".button-next");
  _previousButton = document.querySelector(".button-previous");
  _closeIcon = document.querySelector(".icon-close");
  _curSlide = 0;
  _curSlideMobile = 0;

  // MOBILE GALLERY SLIDER
  _mainGalleryMobileImgs = document.querySelectorAll(
    ".main__gallery--mobile-img"
  );
  _mainGalleryNextBtn = document.querySelector(
    ".main__gallery--mobile-btn-next"
  );
  _mainGalleryPreviousBtn = document.querySelector(
    ".main__gallery--mobile-btn-previous"
  );

  constructor() {
    // MENU
    this._menuOpen.addEventListener("click", this._openMenu.bind(this));
    this._menuClose.addEventListener("click", this._closeMenu.bind(this));

    // CART
    this._cartIcon.addEventListener("click", this._toggleCart.bind(this));
    // this._cartDelete.addEventListener("click", function () {});

    // MAIN
    this._galleryThumbnailsContainer.addEventListener(
      "click",
      this._changeMainProduct.bind(this)
    );
    this._nextButton.addEventListener("click", this._nextSlide.bind(this));
    this._previousButton.addEventListener(
      "click",
      this._previousSlide.bind(this)
    );
    this._setDataThumbnail();
    this._cta.addEventListener("click", this._controlCart.bind(this));
    this._submit.addEventListener("click", this._submitProduct.bind(this));

    // MODAL
    this._modalGallery.addEventListener(
      "click",
      this._changeOnModalClick.bind(this)
    );
    this._mainGalleryImg.addEventListener("click", this._openModal.bind(this));
    window.addEventListener("keydown", this._closeModalOnEscape.bind(this));
    this._closeIcon.addEventListener(
      "click",
      this._closeModalOnClick.bind(this)
    );
    this._setInitialModal();
    this._setDataModal();

    // MOBILE SLIDER
    this._mainGalleryNextBtn.addEventListener(
      "click",
      this._nextSlideMobile.bind(this)
    );
    this._mainGalleryPreviousBtn.addEventListener(
      "click",
      this._previousSlideMobile.bind(this)
    );
    this._setMobileGalleryItemsPosition();
  }

  // MOBILE GALLERY SLIDER
  _nextSlideMobile() {
    this._curSlideMobile++;
    if (this._curSlideMobile > 3) this._curSlideMobile = 0;
    this._goToSlide(this._curSlideMobile, this._mainGalleryMobileImgs);
  }

  _previousSlideMobile() {
    this._curSlideMobile--;
    if (this._curSlideMobile < 0)
      this._curSlideMobile = this._mainGalleryMobileImgs.length - 1;
    this._goToSlide(this._curSlideMobile, this._mainGalleryMobileImgs);
  }

  // HEADER
  _openMenu() {
    [this._overlay, this._menu].forEach((el) => {
      el.classList.remove("hidden");
    });
  }

  _closeMenu() {
    [this._overlay, this._menu].forEach((el) => {
      el.classList.add("hidden");
    });
  }

  _toggleCart() {
    this._cart.classList.toggle("hidden");
  }

  // MAIN
  _renderCartItems() {
    const html = `
        <div class="cart__item">
            <img
              src="./images/image-product-1-thumbnail.jpg"
              alt="Product 1 thumbnail"
              class="cart__item--img"
            />

            <div class="cart__item--description">
              <p class="cart__item--name">${this._state.name}</p>
              <p class="cart__item--price">
                <span id="price">$${this._state.price.toFixed(
                  2
                )}</span> x <span id="quantity">${this._state.quantity}</span>
                <span id="total">$${(
                  this._state.price * this._state.quantity
                ).toFixed(2)}</span>
              </p>
            </div>

            <img
              src="./images/icon-delete.svg"
              alt="Delete icon"
              class="cart__item--delete"
            />
        </div>

        <button class="cart__item--submit">Checkout</button>
    `;

    if (!this._state.cartEmpty) {
      document
        .querySelectorAll(".cart__item")
        .forEach((cartItem) => (cartItem.style.display = "none"));
    }

    this._state.cartEmpty = false;
    document.querySelector(".cart__main").style.display = "none";
    this._cart.insertAdjacentHTML("beforeend", html);

    const curCartItem = Array.from(
      document.querySelectorAll(".cart__item")
    ).find((item) => item.style.display !== "none");

    const deleteItem = function (e) {
      const deleteButton = e.target.closest(".cart__item--delete");

      if (!deleteButton) return;

      // 1. Set state quantity to quantity - 1
      this._state.quantity = this._state.quantity - 1;

      // 2. Change cart icon number
      if (this._state.quantity > 0) {
        document.querySelector(
          ".header__cta--cart-notification"
        ).textContent = `${this._state.quantity}`;

        this._renderCartItems();
      }

      if (this._state.quantity === 0) {
        document
          .querySelector(".header__cta--cart-notification")
          .classList.add("hidden");
        Array.from(document.querySelectorAll(".cart__item")).forEach((item) => {
          item.style.display = "none";
        });
        Array.from(document.querySelectorAll(".cart__item--submit")).forEach(
          (item) => {
            item.style.display = "none";
          }
        );
        document.querySelector(".cart__main").style.display = "block";
      }
    };

    curCartItem.addEventListener("click", deleteItem.bind(this));
  }

  _submitProduct() {
    if (this._state.quantity !== 0) {
      document.querySelector(
        ".header__cta--cart-notification"
      ).textContent = `${this._state.quantity}`;

      document
        .querySelector(".header__cta--cart-notification")
        .classList.remove("hidden");
    }

    document.querySelector("#product-quantity").textContent = 0;

    this._renderCartItems();
  }

  _controlCart(e) {
    const btn = e.target.closest("img");
    if (!btn) return;

    if (btn.classList[0] === "plus") {
      this._updateStateQuantity();

      const productQuantity = document.querySelector("#product-quantity");

      productQuantity.textContent = `${+productQuantity.textContent + 1}`;
    }

    if (btn.classList[0] === "minus") {
      const productQuantity = document.querySelector("#product-quantity");
      if (+productQuantity.textContent > 0) {
        this._updateStateQuantity(false);

        productQuantity.textContent = `${+productQuantity.textContent - 1}`;
      }
    }
  }

  _updateStateQuantity(positive = true) {
    if (!positive) {
      this._state.quantity = this._state.quantity - 1;
    } else {
      this._state.quantity = this._state.quantity + 1;
    }
  }

  _setMobileGalleryItemsPosition() {
    this._mainGalleryMobileImgs.forEach((img, i) => {
      img.style.transform = `translateX(${i * 100}%)`;
    });
  }

  _setDataThumbnail() {
    this._galleryThumbnails.forEach((thumb, i) =>
      thumb.setAttribute("data-thumbnail", i + 1)
    );
  }

  _changeMainProduct(e) {
    const targetThumbnail = e.target.closest(".main__gallery--product");
    if (!targetThumbnail) return;

    this._galleryThumbnails.forEach((thumb) =>
      thumb.classList.remove("main__gallery--product-active")
    );
    targetThumbnail.classList.add("main__gallery--product-active");

    const thumbNum = +targetThumbnail.dataset.thumbnail;
    const src = `./images/image-product-${thumbNum}.jpg`;
    this._mainGalleryImg.querySelector("img").src = `${src}`;
  }

  // MODAL
  _closeModalOnClick() {
    this._modal.classList.add("hidden");
  }

  _closeModalOnEscape(e) {
    if (e.key === "Escape") this._modal.classList.add("hidden");
  }

  _openModal() {
    this._modal.classList.remove("hidden");
  }

  _changeOnModalClick(e) {
    const modalGalleryItem = e.target.closest(".modal__gallery--item");
    if (!modalGalleryItem) return;

    const thumbNumber = +modalGalleryItem.dataset.thumbnail;

    this._curSlide = thumbNumber;
    this._goToSlide(this._curSlide, this._modalMainImgs);
    this._changeActiveModalThumbnail(this._curSlide);
  }

  _setInitialModal() {
    this._modalMainImgs.forEach((img, i) => {
      img.style.transform = `translateX(${i * 100}%)`;
    });
  }

  _setDataModal() {
    this._modalGalleryItems.forEach((item, i) => {
      item.setAttribute("data-thumbnail", i);
    });
  }

  _changeActiveModalThumbnail(slide) {
    this._modalGalleryItems.forEach((item) =>
      item.classList.remove("modal__gallery--item-active")
    );

    document
      .querySelector(`.modal__gallery--item-${slide + 1}`)
      .classList.add("modal__gallery--item-active");
  }

  _goToSlide(slide, el) {
    el.forEach((img, i) => {
      img.style.transform = `translateX(${(i - slide) * 100}%)`;
    });
  }

  _nextSlide() {
    this._curSlide++;
    if (this._curSlide === this._modalMainImgs.length) this._curSlide = 0;
    this._changeActiveModalThumbnail(this._curSlide);
    this._goToSlide(this._curSlide, this._modalMainImgs);
  }

  _previousSlide() {
    this._curSlide--;
    if (this._curSlide < 0) this._curSlide = this._modalMainImgs.length - 1;
    this._changeActiveModalThumbnail(this._curSlide);
    this._goToSlide(this._curSlide, this._modalMainImgs);
  }
}

const app = new App();
