document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;
    const categoryChips = document.querySelectorAll('.chip');
    const productCards = document.querySelectorAll('.product-card');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    const searchInput = document.querySelector('.search-input');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartDrawerClose = document.getElementById('cartDrawerClose');
    const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
    const cartDrawerItems = document.getElementById('cartDrawerItems');
    const cartDrawerTotal = document.getElementById('cartDrawerTotal');
    const cartDrawerContinue = document.getElementById('cartDrawerContinue');
    const cartBtn = document.querySelector('.cart-btn');
    const cartBadge = document.querySelector('.cart-badge');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark');
        updateThemeIcon();
    }

    updateCartUI();

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark');
        const currentTheme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
        updateThemeIcon();
    });

    function updateThemeIcon() {
        const icon = themeToggle.querySelector('.material-symbols-outlined');
        if (body.classList.contains('dark')) {
            icon.textContent = 'light_mode';
        } else {
            icon.textContent = 'dark_mode';
        }
    }

    categoryChips.forEach(chip => {
        chip.addEventListener('click', function() {
            categoryChips.forEach(c => c.classList.remove('chip-active'));
            this.classList.add('chip-active');
            const category = this.getAttribute('data-category');
            filterProducts(category);
        });
    });

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'all') {
                card.classList.remove('hidden');
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                const cardCategory = card.getAttribute('data-category');
                if (cardCategory === category) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            }
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('.product-image').style.backgroundImage;

            const originalText = this.innerHTML;
            this.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Added!';
            this.style.backgroundColor = '#10b981';
            this.style.color = 'white';

            setTimeout(() => {
                this.innerHTML = originalText;
                this.style.backgroundColor = '';
                this.style.color = '';
            }, 2000);

            addToCart({
                title: productTitle,
                price: productPrice,
                image: productImage,
                quantity: 1
            });

            openCartDrawer();
        });
    });

    function addToCart(product) {
        const existingProduct = cart.find(item => item.title === product.title);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function removeFromCart(title) {
        cart = cart.filter(item => item.title !== title);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        if (cart.length === 0) {
            cartDrawerItems.innerHTML = `
                <div class="cart-drawer-empty">
                    <span class="material-symbols-outlined empty-cart-icon">shopping_cart</span>
                    <p>Your cart is empty</p>
                </div>
            `;
            cartBadge.style.display = 'none';
        } else {
            cartBadge.style.display = 'flex';
            cartDrawerItems.innerHTML = cart.map(item => `
                <div class="cart-drawer-item">
                    <div class="cart-drawer-item-image" style="background-image: ${item.image}"></div>
                    <div class="cart-drawer-item-info">
                        <div class="cart-drawer-item-title">${item.title}</div>
                        <div class="cart-drawer-item-price">${item.price}</div>
                        <div class="cart-drawer-item-qty">Qty: ${item.quantity}</div>
                    </div>
                    <button class="cart-drawer-item-remove" data-title="${item.title}">
                        <span class="material-symbols-outlined">close</span>
                    </button>
                </div>
            `).join('');

            const removeButtons = cartDrawerItems.querySelectorAll('.cart-drawer-item-remove');
            removeButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    const title = this.getAttribute('data-title');
                    removeFromCart(title);
                });
            });
        }

        const total = cart.reduce((sum, item) => {
            const price = parseFloat(item.price.replace('$', ''));
            return sum + (price * item.quantity);
        }, 0);

        cartDrawerTotal.textContent = `$${total.toFixed(2)}`;
    }

    function openCartDrawer() {
        cartDrawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeCartDrawer() {
        cartDrawer.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', openCartDrawer);
    }

    if (cartDrawerClose) {
        cartDrawerClose.addEventListener('click', closeCartDrawer);
    }

    if (cartDrawerOverlay) {
        cartDrawerOverlay.addEventListener('click', closeCartDrawer);
    }

    if (cartDrawerContinue) {
        cartDrawerContinue.addEventListener('click', closeCartDrawer);
    }

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('favorited');

            const icon = this.querySelector('.material-symbols-outlined');
            if (this.classList.contains('favorited')) {
                icon.style.fontVariationSettings = "'FILL' 1";
                this.style.color = '#ef4444';
            } else {
                icon.style.fontVariationSettings = "'FILL' 0";
                this.style.color = '#374151';
            }
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();

            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.classList.remove('hidden');
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });

            if (searchTerm === '') {
                const activeChip = document.querySelector('.chip-active');
                const activeCategory = activeChip ? activeChip.getAttribute('data-category') : 'all';
                filterProducts(activeCategory);
            }
        });
    }

    productCards.forEach(card => {
        card.style.transition = 'opacity 0.3s, transform 0.3s';
    });
});
