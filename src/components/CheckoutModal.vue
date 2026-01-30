<template>
    <div v-if="isOpen" class="checkout-overlay" @click.self="close">
        <div class="checkout-modal">
            <!-- Header -->
            <div class="checkout-header">
                <h2>{{ $t('checkout.title') }}</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>

            <!-- Body -->
            <div class="checkout-body">
                <form @submit.prevent="submitOrder" class="checkout-form">
                    <!-- Shipping Information Section -->
                    <section class="form-section">
                        <h3><i class="fa-solid fa-truck"></i> {{ $t('checkout.shippingInfo') }}</h3>
                        <div class="form-group">
                            <div class="form-row">
                                <input 
                                    v-model="formData.firstName" 
                                    type="text" 
                                    :placeholder="$t('checkout.firstName')" 
                                    required 
                                    class="khmer-text"
                                />
                                <input 
                                    v-model="formData.lastName" 
                                    type="text" 
                                    :placeholder="$t('checkout.lastName')" 
                                    required 
                                    class="khmer-text"
                                />
                            </div>
                            <input 
                                v-model="formData.email" 
                                type="email" 
                                :placeholder="$t('checkout.email')" 
                                class="khmer-text"
                            />
                            <input 
                                v-model="formData.address" 
                                type="text" 
                                :placeholder="$t('checkout.address')" 
                                required 
                                class="khmer-text"
                            />
                            <select v-model="formData.country" required class="khmer-text">
                                <option value="">{{ $t('checkout.country') }}</option>
                                <option value="KH">{{ $t('checkout.cambodia') }}</option>
                            </select>
                            <input 
                                v-model="formData.phone" 
                                type="tel" 
                                :placeholder="$t('checkout.phone')" 
                                required 
                                class="khmer-text"
                            />
                        </div>

                        <!-- Delivery Service Selection -->
                        <div class="delivery-service">
                            <h4><i class="fa-solid fa-box"></i> {{ $t('checkout.deliveryService') }}</h4>
                            <div class="service-options">
                                <label class="service-radio">
                                    <input 
                                        v-model="formData.deliveryService" 
                                        type="radio" 
                                        value="virak"
                                    />
                                    <div class="service-card">
                                        <img 
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL7uLQ8no4kZGCIWb9ArbMjtUULyLXJMHi5A&sg" 
                                            alt="Virak Buntha"
                                            class="service-logo"
                                        />
                                        <span class="service-name">{{ $t('checkout.virak') }}</span>
                                    </div>
                                </label>
                                <label class="service-radio">
                                    <input 
                                        v-model="formData.deliveryService" 
                                        type="radio" 
                                        value="jne"
                                    />
                                    <div class="service-card">
                                        <img 
                                            src="https://hrincjobs-pro.s3.amazonaws.com/media/public/filer_public/b7/98/b7980ddd-e5a3-4064-9959-a2108d91f09c/photo_2024-04-25_17-12-03.jpg" 
                                            alt="JN Express"
                                            class="service-logo"
                                        />
                                        <span class="service-name">{{ $t('checkout.jne') }}</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <!-- QR Code Verification Section -->
                        <div class="qr-section">
                            <h4><i class="fa-solid fa-qrcode"></i> {{ $t('checkout.qrScan') }}</h4>
                            <div class="qr-container">
                                <img 
                                    :src="qrCodeUrl" 
                                    alt="QR Code" 
                                    class="qr-code"
                                />
                                <div class="qr-status" :class="{ verified: qrVerified, error: qrError }">
                                    <i 
                                        :class="qrVerified ? 'fa-solid fa-check-circle' : qrError ? 'fa-solid fa-times-circle' : 'fa-solid fa-qrcode'"
                                    ></i>
                                    <span>
                                        {{ qrVerified ? $t('checkout.qrVerify') : qrError ? $t('checkout.qrError') : $t('checkout.qrScan') }}
                                    </span>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                @click="verifyQRCode" 
                                class="verify-btn"
                                :disabled="qrVerified"
                            >
                                <i class="fa-solid fa-check"></i> Verify QR
                            </button>
                        </div>
                    </section>

                    <!-- Order Summary -->
                    <section class="form-section">
                        <h3><i class="fa-solid fa-receipt"></i> {{ $t('checkout.orderSummary') }}</h3>
                        <div class="order-summary">
                            <div v-for="item in cartItems" :key="item.id" class="summary-item">
                                <img :src="item.image" :alt="item.name" />
                                <div class="item-details">
                                    <h4>{{ item.name }}</h4>
                                    <p>{{ item.quantity }} x {{ formatPrice(item.price) }}</p>
                                </div>
                                <span class="item-total">{{ formatPrice(item.price * item.quantity) }}</span>
                            </div>
                        </div>

                        <!-- Total -->
                        <div class="order-total">
                            <div class="total-row">
                                <span>{{ $t('checkout.subtotal') }}</span>
                                <span>{{ formatPrice(subtotal) }}</span>
                            </div>
                            <div class="total-row">
                                <span>{{ $t('checkout.shipping') }}</span>
                                <span>{{ formatPrice(shippingCost) }}</span>
                            </div>
                            <div class="total-row grand-total">
                                <span>{{ $t('checkout.total') }}</span>
                                <span>{{ formatPrice(grandTotal) }}</span>
                            </div>
                        </div>
                    </section>

                    <!-- Submit Button -->
                    <button 
                        type="submit" 
                        class="place-order-btn"
                        :disabled="!qrVerified"
                    >
                        <i class="fa-solid fa-check-circle"></i> {{ $t('checkout.placeOrder') }}
                    </button>
                </form>
            </div>
        </div>
    </div>

    <!-- Loading Modal -->
    <div v-if="isLoading" class="loading-overlay">
        <div class="loading-modal">
            <div class="loader-spinner"></div>
            <h2>{{ $t('checkout.placeOrder') }}</h2>
            <p>Thank you for your order! 🙏</p>
            <p class="loading-text">Processing your order...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import store from '../store/index.js';

/* eslint-disable no-undef */
const props = defineProps({
    isOpen: Boolean
});

const emit = defineEmits(['close']);
/* eslint-enable no-undef */

const formData = ref({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: 'KH',
    phone: '',
    deliveryService: 'virak'
});

const shippingCost = ref(5.00);
const qrVerified = ref(false);
const qrError = ref(false);
const qrCodeUrl = ref('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=');
const isLoading = ref(false);

const cartItems = computed(() => store.getters.cartItems.value);
const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const grandTotal = computed(() => subtotal.value + shippingCost.value);

const formatPrice = (val) => store.methods.formatPrice(val);

// Auto-fill user info if logged in
watch(() => props.isOpen, (newVal) => {
    if (newVal && store.state.isLoggedIn && store.state.user) {
        const user = store.state.user;
        formData.value = {
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            address: user.address || '',
            country: 'KH',
            phone: user.phone || '',
            deliveryService: 'virak'
        };
    } else {
        // Reset form if not logged in
        formData.value = {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            city: '',
            state: '',
            country: 'KH',
            phone: '',
            deliveryService: 'virak'
        };
    }
}, { immediate: true });

// Generate fake QR code with order data
const generateQRCode = () => {
    const qrData = JSON.stringify({
        firstName: formData.value.firstName,
        lastName: formData.value.lastName,
        email: formData.value.email,
        phone: formData.value.phone,
        total: grandTotal.value,
        timestamp: new Date().toISOString()
    });
    qrCodeUrl.value = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
};

// Verify QR code (fake verification for testing)
const verifyQRCode = () => {
    // Simulate QR code scanning with random success
    const randomSuccess = Math.random() > 0.2; // 80% success rate
    
    if (randomSuccess) {
        qrVerified.value = true;
        qrError.value = false;
        setTimeout(() => {
            generateQRCode();
        }, 500);
    } else {
        qrError.value = true;
        setTimeout(() => {
            qrError.value = false;
        }, 2000);
    }
};

const close = () => {
    qrVerified.value = false;
    qrError.value = false;
    emit('close');
};

const submitOrder = async () => {
    if (!qrVerified.value) {
        alert('Please verify QR code before placing order!');
        return;
    }

    isLoading.value = true;

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate invoice
    const orderNumber = 'ORD-' + Date.now();
    const invoiceData = {
        orderNumber,
        date: new Date().toLocaleDateString(),
        shippingInfo: { ...formData.value },
        items: cartItems.value,
        subtotal: subtotal.value,
        shipping: shippingCost.value,
        total: grandTotal.value
    };

    // Save to store
    store.state.invoice = invoiceData;
    store.state.orderNumber = orderNumber;

    // Show invoice modal
    store.state.showCheckout = false;
    store.state.activeModal = 'invoice';

    // Clear cart
    store.state.cart = [];
    
    // Close this modal and stop loading
    isLoading.value = false;
    close();
};

// Generate initial QR code when form data is ready
watch(formData, () => {
    generateQRCode();
}, { deep: true });
</script>

<style scoped>
.checkout-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    padding: 20px;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.checkout-modal {
    background: white;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.checkout-header {
    padding: 20px 30px;
    border-bottom: 2px solid #e6b34e;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #f8f8f8 0%, #fff 100%);
}

.checkout-header h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 32px;
    color: #666;
    cursor: pointer;
    transition: color 0.2s;
}

.close-btn:hover {
    color: #333;
}

.checkout-body {
    flex: 1;
    overflow-y: auto;
    padding: 30px;
}

.checkout-form {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-section h3 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 2px solid #e6b34e;
    padding-bottom: 10px;
}

.form-section h3 i {
    color: #e6b34e;
}

.form-section h4 {
    margin: 0 0 10px 0;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

input,
select {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    transition: border 0.2s;
}

input.khmer-text,
select.khmer-text {
    font-family: 'Khmer OS', serif;
}

input:focus,
select:focus {
    outline: none;
    border-color: #e6b34e;
    box-shadow: 0 0 0 3px rgba(230, 179, 78, 0.1);
}

/* Delivery Service Section */
.delivery-service {
    background: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 15px;
    margin-top: 15px;
}

.delivery-service h4 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.delivery-service h4 i {
    color: #e6b34e;
}

.service-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.service-radio {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 12px;
    background: white;
    border: 2px solid #ddd;
    border-radius: 6px;
    transition: all 0.2s;
}

.service-radio:hover {
    border-color: #e6b34e;
    background: #fffbf0;
}

.service-radio input[type="radio"] {
    margin: 0;
    cursor: pointer;
    width: 18px;
    height: 18px;
    flex-shrink: 0;
}

.service-card {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-left: 12px;
    flex: 1;
}

.service-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    background: white;
    border-radius: 4px;
    padding: 4px;
}

.service-name {
    font-size: 14px;
    color: #333;
    font-weight: 500;
}

.service-radio input[type="radio"]:checked + .service-card {
    color: #e6b34e;
    font-weight: bold;
}

/* QR Code Section */
.qr-section {
    background: #fffbf0;
    border: 2px solid #e6b34e;
    border-radius: 8px;
    padding: 15px;
    margin-top: 10px;
}

.qr-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: white;
    border-radius: 6px;
    margin-bottom: 10px;
}

.qr-code {
    width: 150px;
    height: 150px;
    border: 2px solid #ddd;
    border-radius: 6px;
    padding: 5px;
    background: white;
}

.qr-status {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #666;
    transition: all 0.3s;
}

.qr-status.verified {
    color: #4caf50;
    font-weight: bold;
}

.qr-status.error {
    color: #f44336;
    font-weight: bold;
}

.verify-btn {
    width: 100%;
    background: #e6b34e;
    color: white;
    border: none;
    padding: 10px;
    border-radius: 4px;
    font-size: 13px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.verify-btn:hover:not(:disabled) {
    background: #d6a23e;
}

.verify-btn:disabled {
    background: #4caf50;
    cursor: not-allowed;
}

/* Order Summary */
.order-summary {
    max-height: 250px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 6px;
    padding: 10px;
    background: #f9f9f9;
}

.summary-item {
    display: flex;
    gap: 12px;
    padding: 10px;
    align-items: center;
    border-bottom: 1px solid #eee;
}

.summary-item:last-child {
    border-bottom: none;
}

.summary-item img {
    width: 50px;
    height: 50px;
    object-fit: contain;
    border-radius: 4px;
}

.item-details {
    flex: 1;
}

.item-details h4 {
    margin: 0;
    font-size: 13px;
    color: #333;
}

.item-details p {
    margin: 4px 0 0;
    font-size: 12px;
    color: #999;
}

.item-total {
    font-weight: bold;
    color: #e6b34e;
    font-size: 13px;
}

/* Order Total */
.order-total {
    background: #fffbf0;
    border: 2px solid #e6b34e;
    border-radius: 6px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.total-row {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #333;
    font-family: 'Khmer OS', serif;
}

.total-row span:last-child {
    font-weight: bold;
}

.grand-total {
    border-top: 2px solid #e6b34e;
    padding-top: 10px;
    font-size: 16px;
    color: #e6b34e;
}

/* Place Order Button */
.place-order-btn {
    background: #e6b34e;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 6px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    margin-top: 10px;
}

.place-order-btn:hover:not(:disabled) {
    background: #d6a23e;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(230, 179, 78, 0.3);
}

.place-order-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

/* Loading Modal */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
}

.loading-modal {
    background: white;
    border-radius: 16px;
    padding: 50px 40px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 400px;
}

.loader-spinner {
    width: 60px;
    height: 60px;
    border: 5px solid #f0f0f0;
    border-top-color: #e6b34e;
    border-radius: 50%;
    margin: 0 auto 30px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-modal h2 {
    margin: 20px 0 10px;
    color: #e6b34e;
    font-size: 24px;
}

.loading-modal p {
    color: #666;
    font-size: 16px;
    margin: 8px 0;
}

.loading-text {
    color: #999;
    font-size: 14px;
    font-style: italic;
}

/* Responsive */
@media (max-width: 768px) {
    .checkout-modal {
        max-width: 95vw;
    }

    .checkout-body {
        padding: 20px;
    }

    .form-row {
        grid-template-columns: 1fr;
    }

    .checkout-header h2 {
        font-size: 18px;
    }
}
</style>
