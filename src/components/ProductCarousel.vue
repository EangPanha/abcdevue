<template>
    <div class="product-section">
        <div class="section-header">
            <h2>{{ title }}</h2>
            <a href="#" class="view-more">View More >></a>
        </div>

        <div class="carousel-wrapper" @mouseenter="pauseAutoPlay" @mouseleave="startAutoPlay">
            <button class="nav-btn prev" @click="scroll('left')">
                <i class="fa-solid fa-chevron-left"></i>
            </button>

            <div class="carousel-track-container" ref="trackContainer">
                <div class="carousel-track" :class="{ 'no-transition': !isTransitioning }" :style="{
                    transform: `translateX(-${scrollPosition}px)`,
                    display: 'flex',
                    flexWrap: 'nowrap',
                    width: 'max-content'
                }">
                    <div v-for="(item, index) in extendedProducts" :key="index + '-' + item.id" class="carousel-item"
                        style="flex: 0 0 auto;">
                        <SellerCard :item="item" @click="emit('item-click', item)" />
                    </div>
                </div>
            </div>

            <button class="nav-btn next" @click="scroll('right')">
                <i class="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import SellerCard from './SellerCard.vue';

/* eslint-disable no-undef */
const props = defineProps({
    title: String,
    products: {
        type: Array,
        default: () => []
    }
});

// Define Emits so parent knows when clicked
const emit = defineEmits(['item-click']);
/* eslint-enable no-undef */

// --- YOUR MANUAL CAROUSEL LOGIC ---
const extendedProducts = computed(() => {
    if (!props.products) return [];
    return [...props.products, ...props.products];
});

const scrollPosition = ref(0);
const isTransitioning = ref(true);
const isScrolling = ref(false);
const trackContainer = ref(null);

let autoPlayInterval = null;
const scrollAmount = 280;

const scroll = (direction) => {
    if (!trackContainer.value || isScrolling.value) return;
    isScrolling.value = true;

    const maxOriginalScroll = props.products.length * scrollAmount;

    if (direction === 'right') {
        isTransitioning.value = true;
        scrollPosition.value += scrollAmount;

        if (scrollPosition.value >= maxOriginalScroll) {
            setTimeout(() => {
                isTransitioning.value = false;
                scrollPosition.value -= maxOriginalScroll;
                isScrolling.value = false;
            }, 500);
        } else {
            setTimeout(() => { isScrolling.value = false; }, 500);
        }
    } else {
        if (scrollPosition.value <= 0) {
            isTransitioning.value = false;
            scrollPosition.value = maxOriginalScroll;
            setTimeout(() => {
                isTransitioning.value = true;
                scrollPosition.value -= scrollAmount;
                setTimeout(() => { isScrolling.value = false; }, 500);
            }, 20);
        } else {
            isTransitioning.value = true;
            scrollPosition.value -= scrollAmount;
            setTimeout(() => { isScrolling.value = false; }, 500);
        }
    }
};

const startAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        scroll('right');
    }, 3000);
};

const pauseAutoPlay = () => {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
};

onMounted(() => {
    startAutoPlay();
});

onUnmounted(() => {
    pauseAutoPlay();
});
</script>

<style scoped>
.product-section {
    background: white;
    padding: 20px;
    margin-bottom: 30px;
    border-radius: 8px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #e6b34e;
    padding-bottom: 10px;
}

.section-header h2 {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    margin: 0;
    border-bottom: 3px solid #e6b34e;
    display: inline-block;
    margin-bottom: -12px;
    padding-bottom: 10px;
}

.view-more {
    color: #e6b34e;
    text-decoration: none;
    font-size: 13px;
}

.carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.carousel-track-container {
    overflow: hidden;
    width: 100%;
    padding: 10px 0;
}

.carousel-track {
    display: flex;
    gap: 20px;
    transition: transform 0.5s ease-in-out;
}

.no-transition {
    transition: none !important;
}

.carousel-item {
    min-width: 260px;
    max-width: 260px;
}

.nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #ddd;
    background: white;
    color: #888;
    cursor: pointer;
    z-index: 2;
    position: absolute;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    top: 50%;
    transform: translateY(-50%);
    margin-top: -30px;
}

.nav-btn:hover {
    background: #e6b34e;
    color: white;
    border-color: #e6b34e;
}

.prev {
    left: -10px;
}

.next {
    right: -10px;
}
</style>