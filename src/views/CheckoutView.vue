<template>
    <div class="checkout-page">
        <AppHeader />

        <main class="checkout-container">
            <div class="container">
                <h1>Checkout</h1>

                <div class="checkout-wrapper">
                    <!-- Left: Form Section -->
                    <div class="checkout-form">
                        <!-- Step 1: Shipping Information -->
                        <section class="checkout-section">
                            <div class="section-header">
                                <span class="step-number">1</span>
                                <h2>Shipping Information</h2>
                            </div>
                            <form class="form-group">
                                <div class="form-row">
                                    <input type="text" placeholder="First Name" required />
                                    <input type="text" placeholder="Last Name" required />
                                </div>
                                <input type="email" placeholder="Email Address" required />
                                <input type="text" placeholder="Street Address" required />
                                <div class="form-row">
                                    <input type="text" placeholder="City" required />
                                    <input type="text" placeholder="State/Province" required />
                                </div>
                                <div class="form-row">
                                    <input type="text" placeholder="Postal Code" required />
                                    <select required>
                                        <option value="">Select Country</option>
                                        <option value="US">United States</option>
                                        <option value="KH">Cambodia</option>
                                        <option value="TH">Thailand</option>
                                        <option value="VN">Vietnam</option>
                                        <option value="LA">Laos</option>
                                    </select>
                                </div>
                                <input type="tel" placeholder="Phone Number" required />
                            </form>
                        </section>

                        <!-- Step 2: Shipping Method -->
                        <section class="checkout-section">
                            <div class="section-header">
                                <span class="step-number">2</span>
                                <h2>Shipping Method</h2>
                            </div>
                            <div class="shipping-options">
                                <label class="shipping-option">
                                    <input type="radio" name="shipping" value="standard" v-model="shippingMethod" />
                                    <span class="option-info">
                                        <strong>Standard Shipping</strong>
                                        <p>Delivery in 5-7 business days</p>
                                    </span>
                                    <span class="option-price">Free</span>
                                </label>

                                <label class="shipping-option">
                                    <input type="radio" name="shipping" value="express" v-model="shippingMethod" />
                                    <span class="option-info">
                                        <strong>Express Shipping</strong>
                                        <p>Delivery in 2-3 business days</p>
                                    </span>
                                    <span class="option-price">{{ expressShippingCost }}</span>
                                </label>

                                <label class="shipping-option">
                                    <input type="radio" name="shipping" value="overnight" v-model="shippingMethod" />
                                    <span class="option-info">
                                        <strong>Overnight Shipping</strong>
                                        <p>Next business day delivery</p>
                                    </span>
                                    <span class="option-price">{{ overnightShippingCost }}</span>
                                </label>
                            </div>
                        </section>

                        <!-- Step 3: Payment Method -->
                        <section class="checkout-section">
                            <div class="section-header">
                                <span class="step-number">3</span>
                                <h2>Payment Method</h2>
                            </div>
                            <div class="payment-options">
                                <label class="payment-option">
                                    <input type="radio" name="payment" value="card" v-model="paymentMethod" />
                                    <i class="fa-solid fa-credit-card"></i>
                                    <span>Credit/Debit Card</span>
                                </label>

                                <label class="payment-option">
                                    <input type="radio" name="payment" value="paypal" v-model="paymentMethod" />
                                    <i class="fa-brands fa-paypal"></i>
                                    <span>PayPal</span>
                                </label>

                                <label class="payment-option">
                                    <input type="radio" name="payment" value="bank" v-model="paymentMethod" />
                                    <i class="fa-solid fa-bank"></i>
                                    <span>Bank Transfer</span>
                                </label>

                                <label class="payment-option">
                                    <input type="radio" name="payment" value="cod" v-model="paymentMethod" />
                                    <i class="fa-solid fa-money-bill"></i>
                                    <span>Cash on Delivery</span>
                                </label>
                            </div>

                            <!-- Card Payment Form -->
                            <div v-if="paymentMethod === 'card'" class="card-form">
                                <input type="text" placeholder="Card Holder Name" required />
                                <input type="text" placeholder="Card Number (16 digits)" required />
                                <div class="form-row">
                                    <input type="text" placeholder="MM/YY" required />
                                    <input type="text" placeholder="CVV" required />
                                </div>
                            </div>
                        </section>

                        <!-- Promo Code -->
                        <section class="checkout-section promo-section">
                            <input type="text" placeholder="Enter promo code (optional)" v-model="promoCode" />
                            <button class="apply-btn" @click="applyPromo">Apply</button>
                        </section>
                    </div>

                    <!-- Right: Order Summary -->
                    <aside class="order-summary">
                        <h3>Order Summary</h3>

                        <div class="summary-items">
                            <div v-for="item in cartItems" :key="item.id" class="summary-item">
                                <img :src="item.image" :alt="item.name" />
                                <div class="item-details">
                                    <p class="item-name">{{ item.name }}</p>
                                    <p class="item-qty">Qty: {{ item.quantity }}</p>
                                </div>
                                <p class="item-price">{{ formatPrice(item.price * item.quantity) }}</p>
                            </div>
                        </div>

                        <div class="summary-divider"></div>

                        <div class="summary-row">
                            <span>Subtotal:</span>
                            <span>{{ subtotal }}</span>
                        </div>

                        <div class="summary-row">
                            <span>Shipping:</span>
                            <span>{{ shippingCost }}</span>
                        </div>

                        <div v-if="discountAmount" class="summary-row discount">
                            <span>Discount:</span>
                            <span>-{{ discountAmount }}</span>
                        </div>

                        <div class="summary-divider"></div>

                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>{{ finalTotal }}</span>
                        </div>

                        <button class="place-order-btn" @click="placeOrder">
                            <i class="fa-solid fa-check-circle"></i> Place Order
                        </button>

                        <router-link to="/" class="continue-shopping">
                            <i class="fa-solid fa-arrow-left"></i> Continue Shopping
                        </router-link>
                    </aside>
                </div>
            </div>
        </main>

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import store from '../store/index.js';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

const router = useRouter();

// State
const shippingMethod = ref('standard');
const paymentMethod = ref('card');
const promoCode = ref('');
const discountPercent = ref(0);

// Get cart items from store
const cartItems = computed(() => store.state.cart);

// Shipping costs
const expressShippingCost = computed(() => store.methods.formatPrice(15));
const overnightShippingCost = computed(() => store.methods.formatPrice(30));

// Calculate costs
const subtotal = computed(() => {
    const raw = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    return store.methods.formatPrice(raw);
});

const shippingCost = computed(() => {
    if (shippingMethod.value === 'standard') return 'Free';
    if (shippingMethod.value === 'express') return store.methods.formatPrice(15);
    if (shippingMethod.value === 'overnight') return store.methods.formatPrice(30);
    return 'Free';
});

const discountAmount = computed(() => {
    if (discountPercent.value === 0) return '';
    const raw = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = raw * (discountPercent.value / 100);
    return store.methods.formatPrice(discount);
});

const finalTotal = computed(() => {
    const raw = cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    let shippingAdd = 0;
    if (shippingMethod.value === 'express') shippingAdd = 15;
    if (shippingMethod.value === 'overnight') shippingAdd = 30;
    
    let discountAmount = 0;
    if (discountPercent.value > 0) {
        discountAmount = raw * (discountPercent.value / 100);
    }
    
    const total = raw + shippingAdd - discountAmount;
    return store.methods.formatPrice(total);
});

// Methods
const formatPrice = (value) => store.methods.formatPrice(value);

const applyPromo = () => {
    // Simple promo codes
    const promos = {
        'SAVE10': 10,
        'SAVE20': 20,
        'WELCOME': 15,
        'SUMMER50': 50
    };
    
    const code = promoCode.value.toUpperCase();
    if (promos[code]) {
        discountPercent.value = promos[code];
        alert(`✓ Promo code applied! ${promos[code]}% discount`);
    } else {
        alert('Invalid promo code');
    }
};

const placeOrder = () => {
    if (cartItems.value.length === 0) {
        alert('Your cart is empty');
        return;
    }
    
    alert('✓ Order placed successfully!\n\nOrder Number: #' + Date.now() + '\n\nThank you for your purchase!');
    store.state.cart = [];
    router.push('/');
};
</script>

<style scoped>
.checkout-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f6f8;
}

.checkout-container {
    flex: 1;
    padding: 40px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.checkout-page h1 {
    font-size: 32px;
    margin-bottom: 40px;
    color: #333;
}

.checkout-wrapper {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 30px;
}

/* Form Sections */
.checkout-form {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.checkout-section {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
}

.step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: #e6b34e;
    color: white;
    border-radius: 50%;
    font-weight: bold;
    font-size: 16px;
}

.section-header h2 {
    font-size: 18px;
    color: #333;
    margin: 0;
}

/* Forms */
.form-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-group input,
.form-group select {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: #e6b34e;
    box-shadow: 0 0 8px rgba(230, 179, 78, 0.2);
}

/* Shipping Options */
.shipping-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.shipping-option {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 15px;
    padding: 15px;
    border: 2px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.shipping-option:hover {
    border-color: #e6b34e;
    background: #fffbf0;
}

.shipping-option input[type="radio"] {
    cursor: pointer;
    width: 20px;
    height: 20px;
    accent-color: #e6b34e;
}

.shipping-option input[type="radio"]:checked + .option-info {
    color: #e6b34e;
}

.option-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.option-info strong {
    color: #333;
}

.option-info p {
    font-size: 12px;
    color: #999;
    margin: 0;
}

.option-price {
    font-weight: bold;
    color: #e6b34e;
}

/* Payment Options */
.payment-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 20px;
}

.payment-option {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px;
    border: 2px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}

.payment-option:hover {
    border-color: #e6b34e;
    background: #fffbf0;
}

.payment-option input[type="radio"] {
    cursor: pointer;
    width: 18px;
    height: 18px;
    accent-color: #e6b34e;
}

.payment-option i {
    font-size: 20px;
    color: #e6b34e;
}

.payment-option span {
    font-size: 13px;
    color: #333;
    font-weight: 500;
}

.card-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.card-form input {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.card-form input:focus {
    outline: none;
    border-color: #e6b34e;
    box-shadow: 0 0 8px rgba(230, 179, 78, 0.2);
}

/* Promo Section */
.promo-section {
    display: flex;
    gap: 10px;
}

.promo-section input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.apply-btn {
    padding: 12px 25px;
    background: #e6b34e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.3s;
}

.apply-btn:hover {
    background: #d6a23e;
}

/* Order Summary */
.order-summary {
    background: white;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    height: fit-content;
    position: sticky;
    top: 20px;
}

.order-summary h3 {
    font-size: 18px;
    margin-bottom: 20px;
    color: #333;
}

.summary-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 15px;
    max-height: 300px;
    overflow-y: auto;
}

.summary-item {
    display: grid;
    grid-template-columns: 50px 1fr 60px;
    gap: 10px;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #eee;
}

.summary-item img {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 4px;
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.item-name {
    font-size: 12px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

.item-qty {
    font-size: 11px;
    color: #999;
    margin: 0;
}

.item-price {
    font-size: 13px;
    font-weight: bold;
    color: #e6b34e;
    margin: 0;
}

.summary-divider {
    height: 1px;
    background: #eee;
    margin: 15px 0;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 14px;
    color: #666;
}

.summary-row.discount {
    color: #27ae60;
    font-weight: 600;
}

.summary-row.total {
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-top: 15px;
}

.place-order-btn {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #e6b34e 0%, #d6a23e 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 20px;
    transition: transform 0.2s;
}

.place-order-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(230, 179, 78, 0.3);
}

.continue-shopping {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
    padding: 12px;
    color: #666;
    text-decoration: none;
    border: 1px solid #eee;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s;
}

.continue-shopping:hover {
    color: #e6b34e;
    border-color: #e6b34e;
}

/* Responsive */
@media (max-width: 768px) {
    .checkout-wrapper {
        grid-template-columns: 1fr;
    }

    .order-summary {
        position: static;
    }

    .payment-options {
        grid-template-columns: 1fr;
    }

    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>
