<template>
    <div class="page-wrapper">
        <AppHeader />

        <main class="main-content">

            <div class="container">

                <div class="hero-carousel" @mouseenter="pauseBanner" @mouseleave="startBanner">

                    <div class="banner-track" :style="{ transform: `translateX(-${currentBanner * 100}%)` }">
                        <div v-for="(banner, index) in banners" :key="index" class="banner-slide"
                            :style="{ backgroundImage: `url(${banner.image})` }">
                            <div class="banner-content">
                                <h2>{{ banner.title }}</h2>
                                <p>{{ banner.subtitle }}</p>
                                <button class="shop-now-btn">Shop Now</button>
                            </div>
                            <div class="overlay"></div>
                        </div>
                    </div>

                    <div class="carousel-dots-container">
                        <div class="carousel-dots">
                            <span v-for="(banner, index) in banners" :key="index" class="dot"
                                :class="{ active: currentBanner === index }" @click="setBanner(index)"></span>
                        </div>
                    </div>

                    <button class="arrow prev" @click="prevBanner"><i class="fa-solid fa-chevron-left"></i></button>
                    <button class="arrow next" @click="nextBanner"><i class="fa-solid fa-chevron-right"></i></button>

                </div>

                <div class="section-header">
                    <h1>Hot Deals & Discounts</h1>
                    <p>Limited time offers on our best selling books.</p>
                </div>

                <div class="product-grid">
                    <div v-for="product in products" :key="product.id" class="grid-item">
                        <SellerCard :item="product" @click="openProductModal" />
                    </div>
                </div>

            </div>
        </main>

        <ProductQuickView :isOpen="showModal" :product="selectedProduct" @close="showModal = false" />

        <AppFooter />
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import SellerCard from '../components/SellerCard.vue';
import ProductQuickView from '../components/ProductQuickView.vue';

// --- BANNER LOGIC ---
const currentBanner = ref(0);
let bannerInterval = null;

const banners = ref([
    {
        id: 1,
        title: 'Huge Summer Sale',
        subtitle: 'Get up to 50% OFF on all Fiction books.',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 2,
        title: 'Back to School',
        subtitle: 'Textbooks and stationary at unbeatable prices.',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    },
    {
        id: 3,
        title: 'New Arrivals',
        subtitle: 'Check out the latest bestsellers of the month.',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
    }
]);

const nextBanner = () => {
    currentBanner.value = (currentBanner.value + 1) % banners.value.length;
};

const prevBanner = () => {
    currentBanner.value = (currentBanner.value - 1 + banners.value.length) % banners.value.length;
};

const setBanner = (index) => {
    currentBanner.value = index;
};

const startBanner = () => {
    if (bannerInterval) clearInterval(bannerInterval);
    bannerInterval = setInterval(nextBanner, 4000);
};

const pauseBanner = () => {
    if (bannerInterval) clearInterval(bannerInterval);
};

// --- QUICK VIEW MODAL ---
const showModal = ref(false);
const selectedProduct = ref(null);

// --- PRODUCT GRID DATA ---
const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const products = ref([
    { id: 201, name: 'Huge Sale Item 1', price: 10.00, oldPrice: 20.00, discount: 50, rating: 4, image: getImg(8259443) },
    { id: 202, name: 'Clearance Book', price: 5.50, oldPrice: 12.00, discount: 55, rating: 3, image: getImg(10522304) },
    { id: 203, name: 'Discounted Set', price: 15.00, oldPrice: 18.00, discount: 15, rating: 5, image: getImg(12556708) },
    { id: 204, name: 'Special Offer', price: 8.99, oldPrice: 10.99, discount: 20, rating: 4, image: getImg(12693952) },
    { id: 205, name: 'Bundle Deal', price: 25.00, oldPrice: 35.00, discount: 30, rating: 5, image: getImg(8231856) },
    { id: 206, name: 'Flash Sale Item', price: 4.50, oldPrice: 9.00, discount: 50, rating: 2, image: getImg(8375621) },
]);

const openProductModal = (product) => {
    selectedProduct.value = product;
    showModal.value = true;
};

onMounted(() => {
    startBanner();
});


onMounted(() => {
    startBanner();
});

onUnmounted(() => {
    pauseBanner();
});
</script>

<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f4f6f8;
}

.main-content {
    flex: 1;
    padding: 30px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

/* --- BANNER STYLES --- */
.hero-carousel {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
    margin-bottom: 40px;
    border-radius: 12px;
    /* Added rounded corners for better "Container" look */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.banner-track {
    display: flex;
    width: 100%;
    height: 100%;
    transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    /* Smoother slide */
}

.banner-slide {
    min-width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1;
}

.banner-content {
    position: relative;
    z-index: 2;
    color: white;
    max-width: 600px;
    padding: 20px;
    animation: fadeIn 1s ease;
}

.banner-content h2 {
    font-size: 48px;
    font-weight: 800;
    margin-bottom: 10px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner-content p {
    font-size: 20px;
    margin-bottom: 25px;
    opacity: 0.9;
}

.shop-now-btn {
    background: #e6b34e;
    color: white;
    border: none;
    padding: 12px 30px;
    font-size: 16px;
    font-weight: bold;
    border-radius: 30px;
    cursor: pointer;
    transition: 0.3s;
}

.shop-now-btn:hover {
    background: #d4952b;
    transform: scale(1.05);
}

/* --- CONTROLS --- */
.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3;
    transition: 0.3s;
    backdrop-filter: blur(5px);
}

.arrow:hover {
    background: rgba(255, 255, 255, 0.6);
    color: #333;
}

.prev {
    left: 20px;
}

.next {
    right: 20px;
}

/* --- NEW DOT STYLES (PILL SHAPE) --- */
.carousel-dots-container {
    position: absolute;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 3;
}

.carousel-dots {
    /* Optional: Background pill container like your image */
    background: rgba(0, 0, 0, 0.3);
    padding: 8px 12px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    backdrop-filter: blur(4px);
}

.dot {
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* THE ACTIVE PILL STYLE */
.dot.active {
    width: 30px;
    /* Stretch width */
    border-radius: 5px;
    /* Pill shape corners */
    background: #e6b34e;
    /* Yellow color */
}

/* --- GRID STYLES --- */
.section-header {
    text-align: center;
    margin-bottom: 30px;
    margin-top: 10px;
}

.section-header h1 {
    font-size: 28px;
    color: #333;
    margin-bottom: 5px;
}

.section-header p {
    color: #666;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 25px;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>