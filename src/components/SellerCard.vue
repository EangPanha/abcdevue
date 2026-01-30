<template>
    <div class="seller-card">
        <div class="card-image">
            <img :src="item.image" :alt="item.name" />

            <div v-if="item.discount" class="discount-badge">
                -{{ item.discount }}%
            </div>

            <div class="card-actions">
                <button class="action-btn heart-btn" :class="{ 'active': inWishlist }" @click.stop="toggleWishlist"
                    title="Add to Wishlist">
                    <i :class="inWishlist ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
                </button>

                <button class="action-btn compare-btn" :class="{ 'active': inCompare }" @click.stop="toggleCompare" title="Compare">
                    <i class="fa-solid fa-code-compare"></i>
                </button>

                <button class="action-btn cart-btn" @click.stop="$emit('click', item)" title="Quick View">
                    <i class="fa-solid fa-cart-shopping"></i>
                </button>
            </div>
        </div>

        <div class="card-info">
            <h3 class="product-name">{{ item.name }}</h3>

            <div class="rating">
                <i v-for="n in 5" :key="n" class="fa-solid fa-star" :class="{ 'active-star': n <= item.rating }"></i>
            </div>

            <div class="price-box">
                <span class="price">{{ formatPrice(item.price) }}</span>
                <span v-if="item.oldPrice" class="old-price">{{ formatPrice(item.oldPrice) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store/index.js';

/* eslint-disable no-undef */
const props = defineProps({
    item: Object
});
/* eslint-enable no-undef */

const formatPrice = (val) => store.methods.formatPrice(val);

// --- SAFE CHECK LOGIC ---
// We use ?. (optional chaining) to ensure it doesn't crash if the store list is empty
const inWishlist = computed(() => {
    return store.state.wishlist?.some(p => p.id === props.item.id) || false;
});

const inCompare = computed(() => {
    // Make sure your store uses 'compare', NOT 'compareList'
    return store.state.compare?.some(p => p.id === props.item.id) || false;
});

// --- TOGGLE ACTIONS ---
const toggleWishlist = () => {
    if (inWishlist.value) {
        store.methods.removeFromWishlist(props.item);
    } else {
        store.methods.addToWishlist(props.item);
    }
};

const toggleCompare = () => {
    if (inCompare.value) {
        store.methods.removeFromCompare(props.item);
    } else {
        store.methods.addToCompare(props.item);
    }
};
</script>

<style scoped>
.seller-card {
    width: 100%;
    background: white;
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: box-shadow 0.3s ease, transform 0.3s ease;
    cursor: pointer;
    position: relative;
}

.seller-card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px);
}

.card-image {
    position: relative;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background: #f9f9f9;
    overflow: hidden;
}

.card-image img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    transition: transform 0.3s;
}

.seller-card:hover .card-image img {
    transform: scale(1.05);
}

.discount-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background: #ff4d4f;
    color: white;
    font-size: 12px;
    font-weight: bold;
    padding: 2px 6px;
    border-radius: 4px;
}

/* --- HOVER ACTIONS --- */
.card-actions {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 0;
}

.action-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: none;
    background: white;
    color: #333;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    opacity: 0;
    transform: translateY(30px) scale(0.5);
}

.seller-card:hover .heart-btn {
    animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.05s;
}

.seller-card:hover .compare-btn {
    animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.15s;
}

.seller-card:hover .cart-btn {
    animation: popUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards 0.25s;
}

@keyframes popUp {
    0% {
        opacity: 0;
        transform: translateY(30px) scale(0.5);
    }
    100% {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

.action-btn:hover {
    background: #e6b34e;
    color: white;
    transform: scale(1.1);
}

.action-btn.active {
    background: #ff4d4f;
    color: white;
    /* Active Red Color */
}

.cart-btn {
    background: #333;
    color: white;
}

.cart-btn:hover {
    background: #e6b34e;
}

/* --- INFO SECTION --- */
.card-info {
    padding: 15px;
    text-align: center;
}

.product-name {
    font-size: 14px;
    color: #333;
    margin: 0 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.rating {
    font-size: 12px;
    margin-bottom: 8px;
    color: #ddd;
    /* Default star color */
}

.rating .active-star {
    color: #f1c40f;
    /* Gold for filled stars */
}

.price-box {
    display: flex;
    justify-content: center;
    gap: 10px;
    align-items: center;
}

.price {
    color: #e6b34e;
    font-weight: bold;
    font-size: 16px;
}

.old-price {
    color: #999;
    text-decoration: line-through;
    font-size: 13px;
}
</style>