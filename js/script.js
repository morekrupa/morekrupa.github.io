document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle")
  const nav = document.querySelector("nav")

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active")
      menuToggle.classList.toggle("active")
    })
  }

  // Authentication Forms Toggle
  const loginTab = document.getElementById("login-tab")
  const signupTab = document.getElementById("signup-tab")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const redirectToSignup = document.getElementById("redirect-to-signup")
  const redirectToLogin = document.getElementById("redirect-to-login")

  if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active")
      signupTab.classList.remove("active")
      loginForm.classList.add("active")
      signupForm.classList.remove("active")
    })

    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active")
      loginTab.classList.remove("active")
      signupForm.classList.add("active")
      loginForm.classList.remove("active")
    })

    redirectToSignup.addEventListener("click", (e) => {
      e.preventDefault()
      signupTab.click()
    })

    redirectToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      loginTab.click()
    })

    // Form Validation
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true
      const email = document.getElementById("login-email")
      const password = document.getElementById("login-password")
      const emailError = document.getElementById("login-email-error")
      const passwordError = document.getElementById("login-password-error")

      // Reset error messages
      emailError.textContent = ""
      passwordError.textContent = ""

      // Email validation
      if (!email.value.trim()) {
        emailError.textContent = "Email is required"
        isValid = false
      } else if (!isValidEmail(email.value)) {
        emailError.textContent = "Please enter a valid email"
        isValid = false
      }

      // Password validation
      if (!password.value.trim()) {
        passwordError.textContent = "Password is required"
        isValid = false
      }

      if (isValid) {
        alert("Login successful! Redirecting to dashboard...")
        // In a real application, you would submit the form or make an API call here
        window.location.href = "index.html"
      }
    })

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()

      let isValid = true
      const name = document.getElementById("signup-name")
      const email = document.getElementById("signup-email")
      const password = document.getElementById("signup-password")
      const confirmPassword = document.getElementById("signup-confirm-password")
      const terms = document.getElementById("terms")

      const nameError = document.getElementById("signup-name-error")
      const emailError = document.getElementById("signup-email-error")
      const passwordError = document.getElementById("signup-password-error")
      const confirmPasswordError = document.getElementById("signup-confirm-password-error")
      const termsError = document.getElementById("terms-error")

      // Reset error messages
      nameError.textContent = ""
      emailError.textContent = ""
      passwordError.textContent = ""
      confirmPasswordError.textContent = ""
      termsError.textContent = ""

      // Name validation
      if (!name.value.trim()) {
        nameError.textContent = "Name is required"
        isValid = false
      }

      // Email validation
      if (!email.value.trim()) {
        emailError.textContent = "Email is required"
        isValid = false
      } else if (!isValidEmail(email.value)) {
        emailError.textContent = "Please enter a valid email"
        isValid = false
      }

      // Password validation
      if (!password.value.trim()) {
        passwordError.textContent = "Password is required"
        isValid = false
      } else if (password.value.length < 6) {
        passwordError.textContent = "Password must be at least 6 characters"
        isValid = false
      }

      // Confirm password validation
      if (!confirmPassword.value.trim()) {
        confirmPasswordError.textContent = "Please confirm your password"
        isValid = false
      } else if (password.value !== confirmPassword.value) {
        confirmPasswordError.textContent = "Passwords do not match"
        isValid = false
      }

      // Call the function to validate password match
      if (!validatePasswordMatch()) {
        isValid = false
      }

      if (isValid) {
        alert("Sign up successful! Redirecting to dashboard...")
        
        window.location.href = "index.html"
      }
    })
  }

  // Menu Filtering
  const filterBtns = document.querySelectorAll(".filter-btn")
  const menuItems = document.querySelectorAll(".menu-item")

  if (filterBtns.length > 0 && menuItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Remove active class from all buttons
        filterBtns.forEach((btn) => btn.classList.remove("active"))
        // Add active class to clicked button
        this.classList.add("active")

        const filter = this.getAttribute("data-filter")

        menuItems.forEach((item) => {
          if (filter === "all" || item.getAttribute("data-category") === filter) {
            item.style.display = "block"
          } else {
            item.style.display = "none"
          }
        })
      })
    })
  }

  // Shopping Cart Functionality
  const addToCartBtns = document.querySelectorAll(".add-to-cart-btn")
  const cart = document.getElementById("cart")
  const cartOverlay = document.getElementById("cart-overlay")
  const closeCart = document.getElementById("close-cart")
  const cartItems = document.getElementById("cart-items")
  const cartTotalPrice = document.getElementById("cart-total-price")
  const checkoutBtn = document.getElementById("checkout-btn")

  // Cart data
  let cartData = []

  if (addToCartBtns.length > 0 && cart && cartOverlay && closeCart && cartItems && cartTotalPrice && checkoutBtn) {
    // Add to cart
    addToCartBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const id = this.getAttribute("data-id")
        const name = this.getAttribute("data-name")
        const price = Number.parseFloat(this.getAttribute("data-price"))

        // Check if item already exists in cart
        const existingItem = cartData.find((item) => item.id === id)

        if (existingItem) {
          existingItem.quantity++
        } else {
          cartData.push({
            id,
            name,
            price,
            quantity: 1,
          })
        }

        // Update cart UI
        updateCart()

        // Open cart
        openCart()
      })
    })

    // Open cart function
    function openCart() {
      cart.classList.add("open")
      cartOverlay.classList.add("open")
    }

    // Close cart
    closeCart.addEventListener("click", () => {
      cart.classList.remove("open")
      cartOverlay.classList.remove("open")
    })

    cartOverlay.addEventListener("click", () => {
      cart.classList.remove("open")
      cartOverlay.classList.remove("open")
    })

    // Update cart UI
    function updateCart() {
      // Clear cart items
      cartItems.innerHTML = ""

      if (cartData.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>'
        cartTotalPrice.textContent = "₹0.00"
        return
      }

      let total = 0

      // Add items to cart
      cartData.forEach((item) => {
        const itemTotal = item.price * item.quantity
        total += itemTotal

        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"
        cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <p class="cart-item-price">₹${item.price.toFixed(2)}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" readonly>
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">Remove</button>
                    </div>
                `

        cartItems.appendChild(cartItem)
      })

      // Update total price
      cartTotalPrice.textContent = `₹${total.toFixed(2)}`

      // Add event listeners to quantity buttons and remove buttons
      const decreaseBtns = document.querySelectorAll(".quantity-btn.decrease")
      const increaseBtns = document.querySelectorAll(".quantity-btn.increase")
      const removeBtns = document.querySelectorAll(".cart-item-remove")

      decreaseBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id")
          const item = cartData.find((item) => item.id === id)

          if (item.quantity > 1) {
            item.quantity--
            updateCart()
          }
        })
      })

      increaseBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id")
          const item = cartData.find((item) => item.id === id)

          item.quantity++
          updateCart()
        })
      })

      removeBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          const id = this.getAttribute("data-id")
          cartData = cartData.filter((item) => item.id !== id)
          updateCart()
        })
      })
    }

    // Checkout
    checkoutBtn.addEventListener("click", () => {
      if (cartData.length === 0) {
        alert("Your cart is empty")
        return
      }

      alert("Thank you for your order! Redirecting to checkout...")
      // In a real application, you would redirect to a checkout page or process the order
      cartData = []
      updateCart()
      cart.classList.remove("open")
      cartOverlay.classList.remove("open")
    })
  }
})


// Helper function to validate email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Function to validate password and confirm password
function validatePasswordMatch() {
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const errorMessage = document.getElementById('signup-confirm-password-error');

    if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match.";
        return false; // Prevent form submission
    } else {
        errorMessage.textContent = ""; // Clear error message if passwords match
        return true;
    }
}

document.addEventListener("mousemove", (e) => {
  let trail = document.createElement("div");
  trail.className = "cursor-trail";
  trail.style.left = `${e.pageX}px`;
  trail.style.top = `${e.pageY}px`;
  document.body.appendChild(trail);

  setTimeout(() => {
      trail.remove();
  }, 300);
});



