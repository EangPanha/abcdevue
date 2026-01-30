<template>
    <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="modal-content">
            <button class="close-btn" @click="close">&times;</button>

            <div class="modal-body">

                <div class="gallery-container">
                    <div class="thumbnails">
                        <div class="thumb active" @mouseenter="currentImage = product.image">
                            <img :src="product.image" alt="thumb" />
                        </div>
                        <div class="thumb" @mouseenter="currentImage = product.image">
                            <img :src="product.image" alt="thumb" />
                        </div>
                        <div class="thumb" @mouseenter="currentImage = product.image">
                            <img :src="product.image" alt="thumb" />
                        </div>
                    </div>

                    <div class="main-image-wrapper">
                        <div class="zoom-container">
                            <img :src="currentImage || product.image" :alt="product.name" class="zoom-img" />
                        </div>
                    </div>
                </div>

                <div class="product-info">

                    <div class="header-info">
                        <h2 class="title">{{ product.name }}</h2>
                    </div>

                    <div class="info-row border-bottom">
                        <span class="label">Price:</span>
                        <div class="price-box">
                            <span class="big-price">{{ formatPrice(product.price) }}</span>
                            <span class="unit">/1Pcs</span>
                        </div>
                    </div>

                    <div class="info-row border-bottom">
                        <span class="label">Quantity:</span>
                        <div class="qty-control">
                            <button class="qty-btn" @click="decreaseQty">-</button>
                            <input type="text" v-model="quantity" readonly />
                            <button class="qty-btn" @click="increaseQty">+</button>
                        </div>
                        <span class="stock-text">(49 available)</span>
                    </div>

                    <div class="info-row">
                        <span class="label">Total Price:</span>
                        <span class="big-price total-highlight">{{ formatPrice(totalPrice) }}</span>
                    </div>

                    <button class="add-to-cart-btn" @click="addToCart" ref="addToCartBtn">
                        <i class="fa-solid fa-cart-shopping"></i> Add to cart
                    </button>

                </div>
            </div>
        </div>

        <!-- Fireworks Container -->
        <div v-for="(particle, index) in particles" :key="index" class="fireworks-particle" 
            :style="{ 
                left: particle.x + 'px', 
                top: particle.y + 'px', 
                '--tx': particle.tx + 'px', 
                '--ty': particle.ty + 'px', 
                backgroundColor: particle.color,
                width: particle.size + 'px',
                height: particle.size + 'px',
                '--rotation': particle.rotation + 'deg',
                '--duration': particle.duration + 'ms',
                opacity: particle.life
            }">
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import store from '../store/index.js';

/* eslint-disable no-undef */
const props = defineProps({
    isOpen: Boolean,
    product: Object
});
const emit = defineEmits(['close']);
/* eslint-enable no-undef */

const quantity = ref(1);
const currentImage = ref('');
const particles = ref([]);
const addToCartBtn = ref(null);

// Reset state when product opens
watch(() => props.product, (newVal) => {
    if (newVal) {
        quantity.value = 1;
        currentImage.value = newVal.image;
    }
});

const totalPrice = computed(() => {
    return (props.product?.price || 0) * quantity.value;
});

const formatPrice = (val) => store.methods.formatPrice(val);
const increaseQty = () => quantity.value++;
const decreaseQty = () => { if (quantity.value > 1) quantity.value--; };

// Fireworks effect
const createFireworks = (event) => {
    const colors = [
        '#FF1744', '#F50057', '#D500F9', '#651FFF', // Reds & Purples
        '#2979F3', '#00B0FF', '#00E5FF', '#1DE9B6', // Blues & Cyans
        '#00E676', '#76FF03', '#FFEA00', '#FFC400', // Greens & Yellows
        '#FF9100', '#FF3D00', '#FF6E40', '#FF5252', // Oranges & Reds
        '#FFD740', '#69F0AE', '#00E676', '#00BCD4'  // More vibrant colors
    ];
    
    const rect = event.target.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    
    particles.value = [];
    
    // Create 60-80 particles for more impressive effect
    for (let i = 0; i < 70; i++) {
        const angle = (Math.PI * 2 * i) / 70;
        const velocity = 4 + Math.random() * 12;
        const distance = 80 + Math.random() * 120;
        const tx = Math.cos(angle) * velocity * distance;
        const ty = Math.sin(angle) * velocity * distance - Math.random() * 100; // More upward bias
        
        const size = 6 + Math.random() * 10; // Variable sizes
        const duration = 800 + Math.random() * 600; // Variable duration
        
        particles.value.push({
            x: startX,
            y: startY,
            tx: tx,
            ty: ty,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: size,
            rotation: Math.random() * 360,
            duration: duration,
            life: 1,
            decay: 0.01 + Math.random() * 0.02
        });
    }
    
    // Animate particles with physics
    let frame = 0;
    const animateParticles = setInterval(() => {
        frame++;
        particles.value.forEach(p => {
            p.life -= p.decay;
            p.ty += 0.5; // gravity effect
        });
        
        if (frame > 150) {
            clearInterval(animateParticles);
            particles.value = [];
        }
    }, 16);
};

const addToCart = (event) => {
    createFireworks(event);
    store.methods.addToCart({ ...props.product, quantity: quantity.value });
    setTimeout(() => close(), 800);
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
/* --- MODAL WRAPPER --- */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    width: 900px;
    max-width: 95%;
    border-radius: 4px;
    padding: 40px;
    position: relative;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 24px;
    color: #aaa;
    background: none;
    border: none;
    cursor: pointer;
    transition: 0.2s;
}

.close-btn:hover {
    color: #333;
}

.modal-body {
    display: flex;
    gap: 40px;
}

/* --- LEFT: GALLERY --- */
.gallery-container {
    display: flex;
    gap: 15px;
    width: 55%;
}

/* Vertical Thumbnails */
.thumbnails {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.thumb {
    width: 60px;
    height: 60px;
    border: 1px solid #ddd;
    padding: 2px;
    cursor: pointer;
    transition: 0.2s;
}

.thumb:hover,
.thumb.active {
    border-color: #e6b34e;
    box-shadow: 0 0 5px rgba(230, 179, 78, 0.3);
}

.thumb img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Main Image + Zoom Effect */
.main-image-wrapper {
    flex: 1;
    height: 400px;
    /* Fixed height for nice layout */
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: #f8f8f8; */
}

.zoom-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    /* Important for zoom */
    display: flex;
    align-items: center;
    justify-content: center;
}

.zoom-img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    /* Smooth zoom */
}

/* 🌟 HOVER ZOOM EFFECT 🌟 */
.zoom-container:hover .zoom-img {
    transform: scale(1.4);
    /* Zooms in 40% */
    cursor: zoom-in;
}

/* --- RIGHT: PRODUCT INFO --- */
.product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.title {
    font-size: 22px;
    font-weight: 700;
    color: #333;
    margin: 0 0 25px 0;
    line-height: 1.4;
    text-transform: uppercase;
}

.info-row {
    display: flex;
    align-items: center;
    padding: 20px 0;
}

.border-bottom {
    border-bottom: 1px solid #eee;
}

.label {
    width: 100px;
    color: #999;
    font-size: 14px;
}

/* Price Styles */
.price-box {
    display: flex;
    align-items: baseline;
    gap: 5px;
}

.big-price {
    font-size: 32px;
    color: #e6b34e;
    /* Gold Color */
    font-weight: 800;
    font-family: 'Arial', sans-serif;
}

.unit {
    color: #999;
    font-size: 14px;
}

.total-highlight {
    color: #e6b34e;
}

/* Qty Control */
.qty-control {
    display: flex;
    align-items: center;
    margin-right: 15px;
}

.qty-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    /* Circle Buttons */
    border: none;
    background: #f0f0f0;
    color: #555;
    font-size: 16px;
    cursor: pointer;
    transition: 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.qty-btn:hover {
    background: #e0e0e0;
}

.qty-control input {
    width: 40px;
    text-align: center;
    border: none;
    font-size: 16px;
    font-weight: bold;
    color: #333;
}

.stock-text {
    color: #999;
    font-size: 13px;
}

/* Add to Cart Button */
.add-to-cart-btn {
    margin-top: 10px;
    background-color: #e6b34e;
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 15px;
    font-weight: bold;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    transition: background 0.2s;
}

.add-to-cart-btn:hover {
    background-color: #d6a23e;
}

/* Fireworks Effect */
@keyframes fireworks-burst {
    0% {
        transform: translate(0, 0) rotate(0deg) scale(1);
        opacity: 1;
        filter: brightness(1.5);
    }
    50% {
        filter: brightness(1.2);
    }
    100% {
        transform: translate(var(--tx), var(--ty)) rotate(var(--rotation)) scale(0);
        opacity: 0;
        filter: brightness(0.8);
    }
}

.fireworks-particle {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    animation: fireworks-burst var(--duration, 1s) ease-out forwards;
    box-shadow: 0 0 20px currentColor, 0 0 40px currentColor, inset 0 0 8px rgba(255, 255, 255, 0.6);
    filter: drop-shadow(0 0 4px currentColor);
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .modal-body {
        flex-direction: column;
        gap: 20px;
    }

    .gallery-container {
        width: 100%;
        height: auto;
        flex-direction: column-reverse;
    }

    .thumbnails {
        flex-direction: row;
        justify-content: center;
    }

    .main-image-wrapper {
        height: 250px;
    }

    .title {
        font-size: 18px;
        margin-bottom: 10px;
    }

    .big-price {
        font-size: 24px;
    }
}
</style>