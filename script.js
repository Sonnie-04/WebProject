document.addEventListener('DOMContentLoaded', () => {
    // --- SELECTORS ---
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');
    const loadingOverlay = document.getElementById('loading-overlay');
    const loginFormContainer = document.getElementById('login-form-container');
    const signupFormContainer = document.getElementById('signup-form-container');
    const showSignupLink = document.getElementById('show-signup-link');
    const showLoginLink = document.getElementById('show-login-link');
    const consumerView = document.getElementById('consumer-view');
    const adminView = document.getElementById('admin-view');
    const landingView = document.getElementById('landing-view');
    const allViews = [landingView, consumerView, adminView];

    const searchForm = document.querySelector('.search-form');
    const shoppingCart = document.querySelector('.shopping-cart');
    const userProfile = document.querySelector('.user-profile');
    const searchBtn = document.querySelector('#search-btn');
    const cartBtn = document.querySelector('#cart-btn');
    const userBtn = document.querySelector('#user-btn');

    const cartItemsContainer = document.querySelector('.cart-items-container');
    const productContainer = document.querySelector('.products .box-container');
    const cartTotalElement = document.querySelector('.shopping-cart .total');

    const checkoutBtn = document.querySelector(".checkout-btn");
    const paymentForm = document.getElementById("payment-form");
    const cancelBtn = document.querySelector(".cancel-btn");
    const checkoutForm = document.getElementById("checkout-form");

    function showView(view) {
        allViews.forEach(v => v.classList.remove('active'));
        if (view) view.classList.add('active');
    }

    function navigateToDashboard(role) {
        if (role === 'consumer') {
            showView(consumerView);
        } else if (role === 'admin') {
            showView(adminView);
        } else {
            alert("Unauthorized role.");
            showView(landingView);
        }
    }

    // --- SIGNUP FORM HANDLING (AJAX) ---
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(signupForm);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm_password');

            if (password !== confirmPassword) {
                alert("Passwords do not match!");
                return;
            }

            loadingOverlay.classList.add('active');

            fetch('signup.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.text())
            .then(response => {
                loadingOverlay.classList.remove('active');
                alert(response.trim());
                signupForm.reset();
                showLoginLink.click(); // Go back to login form
            })
            .catch(error => {
                loadingOverlay.classList.remove('active');
                console.error("Signup Error:", error);
                alert("Signup failed. Check your connection or try again.");
            });
        });
    }

    // --- LOGIN FORM HANDLING (AJAX) ---
    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(loginForm);
            loadingOverlay.classList.add('active');

            fetch('login.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                loadingOverlay.classList.remove('active');
                if (response.success) {
                    alert("Login successful!");
                    navigateToDashboard(response.role);
                    loginForm.reset();
                } else {
                    alert(response.message || "Login failed.");
                }
            })
            .catch(error => {
                loadingOverlay.classList.remove('active');
                console.error("Login Error:", error);
                alert("Login failed. Check your connection or try again.");
            });
        });
    }

    // --- TOGGLE BETWEEN LOGIN & SIGNUP FORMS ---
    if (showSignupLink) {
        showSignupLink.onclick = (e) => {
            e.preventDefault();
            loginFormContainer.classList.remove('active');
            signupFormContainer.classList.add('active');
        };
    }

    if (showLoginLink) {
        showLoginLink.onclick = (e) => {
            e.preventDefault();
            signupFormContainer.classList.remove('active');
            loginFormContainer.classList.add('active');
        };
    }

    // --- LOGOUT ---
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            loadingOverlay.classList.add('active');
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
                showView(landingView);
                loginFormContainer.classList.add('active');
                signupFormContainer.classList.remove('active');
                loginForm?.reset();
                signupForm?.reset();
            }, 500);
        };
    });

    // --- SEARCH, CART, USER TOGGLES ---
    if (searchBtn) searchBtn.onclick = () => toggleUI(searchForm);
    if (cartBtn) cartBtn.onclick = () => toggleUI(shoppingCart);
    if (userBtn) userBtn.onclick = () => toggleUI(userProfile);

    function toggleUI(element) {
        element.classList.toggle('active');
        [searchForm, shoppingCart, userProfile].forEach(el => {
            if (el !== element) el.classList.remove('active');
        });
    }

    // --- ADD TO CART ---
    if (productContainer) {
        productContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productBox = e.target.closest('.box');
                const id = productBox.dataset.productId;
                const title = productBox.querySelector('h3').textContent;
                const price = productBox.querySelector('.price').textContent;
                addItemToCart(id, title, price);
            }
        });
    }

    function addItemToCart(id, title, price) {
        if (!cartItemsContainer) return;
        const existingCartItem = cartItemsContainer.querySelector(`.cart-item[data-product-id="${id}"]`);
        const emptyMsg = cartItemsContainer.querySelector('.empty-message');
        if (emptyMsg) emptyMsg.remove();

        if (existingCartItem) {
            const quantityElement = existingCartItem.querySelector('.quantity-display');
            let quantity = parseInt(quantityElement.textContent.replace('x ', '')) + 1;
            quantityElement.textContent = `x ${quantity}`;
        } else {
            const cartRow = document.createElement('div');
            cartRow.classList.add('cart-item');
            cartRow.dataset.productId = id;
            cartRow.innerHTML = `
                <i class="fas fa-trash"></i>
                <div class="content">
                    <h3>${title}</h3>
                    <div class="price">${price}</div>
                    <div class="quantity-display">x 1</div>
                </div>`;
            cartItemsContainer.appendChild(cartRow);
            cartRow.querySelector('.fa-trash').addEventListener('click', removeCartItem);
        }

        // ✅ Show the cart immediately
        shoppingCart.classList.add('active');

        // Optional auto-hide after 5 seconds
        setTimeout(() => {
            shoppingCart.classList.remove('active');
        }, 5000);

        updateCartTotal();
    }

    function removeCartItem(event) {
        event.target.closest('.cart-item').remove();
        updateCartTotal();
    }

    function updateCartTotal() {
        if (!cartItemsContainer || !cartTotalElement) return;
        const cartItems = cartItemsContainer.getElementsByClassName('cart-item');
        let total = 0;

        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        } else {
            for (let item of cartItems) {
                const price = parseFloat(item.querySelector('.price').innerText.replace(/[^0-9.]/g, ''));
                const quantity = parseInt(item.querySelector('.quantity-display').textContent.replace('x ', '')) || 1;
                total += price * quantity;
            }
        }
        cartTotalElement.innerText = `Total: Ksh.${total.toFixed(2)}`;
    }
    updateCartTotal();

    // --- CHECKOUT & PAYMENT ---
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function (e) {
            e.preventDefault();
            if (cartItemsContainer.children.length === 0 || cartItemsContainer.querySelector('.empty-message')) {
                alert("Your cart is empty.");
                return;
            }
            paymentForm.classList.remove("hidden");
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", function () {
            paymentForm.classList.add("hidden");
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener("submit", function (e) {
            e.preventDefault();
            alert("Payment processed successfully!");
            paymentForm.classList.add("hidden");
            clearCart();
        });
    }

    function clearCart() {
        cartItemsContainer.innerHTML = `<p class="empty-message">Your cart is empty.</p>`;
        updateCartTotal();
    }

    // --- PRODUCT VERIFICATION ---
    document.getElementById('verify-btn').addEventListener('click', () => {
        const code = document.getElementById('verification-code').value.trim();
        const result = document.getElementById('verification-result');
        const productMap = {
            'P001': 'Organic Apples', 'P002': 'Organic Onions', 'P003': 'Fresh Carrots',
            'P004': 'Fresh PawPaws', 'P005': 'Organic Avocados', 'P006': 'Fresh Bananas',
            'P007': 'Organic Potatoes', 'P008': 'Organic Tomatoes', 'P009': 'Fresh Oranges',
            'P010': 'Fresh Pepper', 'P011': 'Fresh Cabbage', 'P012': 'Sweet Pears',
            'P013': 'Juicy Strawberries', 'P014': 'Organic Garlic', 'P015': 'Organic Cucumber',
            'P016': 'Organic Maize', 'P017': 'Organic Peas', 'P018': 'Yellow Beans',
            'P019': 'Fresh Watermelon', 'P020': 'Fresh Coriander', 'P021': 'Fresh Cauliflower',
        };

        if (code === '') {
            result.style.color = 'orange';
            result.textContent = 'Please enter a product code.';
        } else if (productMap[code]) {
            result.style.color = 'green';
            result.textContent = `✅ Code verified: ${productMap[code]}`;
        } else {
            result.style.color = 'red';
            result.textContent = '❌ Invalid product code.';
        }
    });

    // --- FARMER REGISTRATION ---
    const registerForm = document.getElementById('register-farmer-form');
    const addProductForm = document.getElementById('add-product-form');
    const registerMsg = document.getElementById('farmer-register-message');

    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(registerForm);
            fetch('register_farmer.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                registerMsg.textContent = response.message;
                if (response.success) {
                    registerForm.reset();
                }
            })
            .catch(error => {
                console.error("Registration Error:", error);
                registerMsg.textContent = "Registration failed. Please try again.";
            });
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(addProductForm);
            fetch('add_product.php', {
                method: 'POST',
                body: formData
            })
            .then(res => res.json())
            .then(response => {
                alert(response.message);
                if (response.success) {
                    addProductForm.reset();
                }
            })
            .catch(error => {
                console.error("Add Product Error:", error);
                alert("Failed to add product. Please try again.");
            });
        });
    }
});

// --- OUTSIDE DOMContentLoaded --- 
function toggleDistributorDetails() {
    const box = document.getElementById('distributor-details-box');
    box.classList.toggle('hidden');

    if (!box.classList.contains('loaded')) {
        fetch('fetch_distributor_data.php')
            .then(response => response.json())
            .then(data => {
                const farmerList = document.getElementById('farmer-network-list');
                const shipmentList = document.getElementById('shipment-list');

                if (data.farmers.length === 0 && data.shipments.length === 0) {
                    alert("No data found.");
                }

                data.farmers.forEach(f => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${f.name}</strong> - ${f.county} - ${f.status}`;
                    farmerList.appendChild(li);
                });

                data.shipments.forEach(s => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${s.order_id}</strong>: ${s.product_name} - ${s.quantity}kg → <em>${s.status}</em>`;
                    shipmentList.appendChild(li);
                });

                box.classList.add('loaded');
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert("Failed to fetch data.");
            });
    }
}

function toggleMessages() {
    const chatBox = document.getElementById('chat-box');
    chatBox.classList.toggle('hidden');

    if (!chatBox.classList.contains('hidden')) {
        fetchMessages();
    }
}

function fetchMessages() {
    fetch('get_messages.php')
        .then(response => response.json())
        .then(data => {
            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            data.forEach(msg => {
                const div = document.createElement('div');
                div.classList.add('chat-message');
                div.innerHTML = `<strong>${msg.sender}:</strong> ${msg.message}`;
                chatBox.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error fetching messages:', error);
        });
}

document.getElementById("view-products-btn").addEventListener("click", function () {
    fetch("get_farmer_products.php")
        .then(response => response.json())
        .then(products => {
            const tableBody = document.getElementById("products-table-body");
            tableBody.innerHTML = "";

            if (products.length > 0) {
                products.forEach(product => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.stock_quantity} Kg</td>
                        <td>${product.price}</td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                tableBody.innerHTML = `<tr><td colspan="4">No products found.</td></tr>`;
            }

            document.getElementById("farmer-products-view").classList.remove("hidden");
        })
        .catch(error => {
            console.error("Error fetching products:", error);
            alert("Failed to load products. Check server connection.");
        });
});
