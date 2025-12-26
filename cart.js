document.addEventListener('DOMContentLoaded', function() {
    const quantityControls = document.querySelectorAll('.quantity-selector');
    const removeButtons = document.querySelectorAll('.remove-btn');
    const discountApplyBtn = document.querySelector('.discount-apply-btn');

    quantityControls.forEach(control => {
        const decreaseBtn = control.querySelector('.qty-decrease');
        const increaseBtn = control.querySelector('.qty-increase');
        const input = control.querySelector('.qty-input');

        decreaseBtn.addEventListener('click', function() {
            let value = parseInt(input.value);
            if (value > 1) {
                input.value = value - 1;
                updateCartTotals();
            }
        });

        increaseBtn.addEventListener('click', function() {
            let value = parseInt(input.value);
            input.value = value + 1;
            updateCartTotals();
        });
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-20px)';

            setTimeout(() => {
                cartItem.remove();
                updateCartCount();
                updateCartTotals();
            }, 300);
        });
    });

    if (discountApplyBtn) {
        discountApplyBtn.addEventListener('click', function() {
            const input = document.querySelector('.discount-input');
            const code = input.value.trim().toUpperCase();

            if (code === 'SAVE10') {
                alert('Discount applied! 10% off');
            } else if (code) {
                alert('Invalid discount code');
            }
        });
    }

    function updateCartCount() {
        const cartItems = document.querySelectorAll('.cart-item');
        const count = cartItems.length;
        const cartCountElement = document.querySelector('.cart-count');
        const itemCountElement = document.querySelector('.item-count');

        if (cartCountElement) {
            cartCountElement.textContent = count;
        }

        if (itemCountElement) {
            itemCountElement.textContent = `(${count} Item${count !== 1 ? 's' : ''})`;
        }
    }

    function updateCartTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        cartItems.forEach(item => {
            const priceText = item.querySelector('.cart-item-price .price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const quantity = parseInt(item.querySelector('.qty-input').value);
            subtotal += price * quantity;
        });

        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        const subtotalElement = document.getElementById('subtotal');
        const taxElement = document.getElementById('tax');
        const totalElement = document.getElementById('total');

        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }
        if (taxElement) {
            taxElement.textContent = `$${tax.toFixed(2)}`;
        }
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
});
