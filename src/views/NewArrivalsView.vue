<template>
    <div class="page-wrapper">
        <AppHeader />
        <main class="main-content">
            <div class="container">
                <div class="page-header">
                    <h1>New Arrivals</h1>
                    <p>Check out the latest books and products.</p>
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
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import SellerCard from '../components/SellerCard.vue';
import ProductQuickView from '../components/ProductQuickView.vue';

// Helper to get dummy images
const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const products = ref([
    { id: 301, name: 'New Book 1', price: 12.00, rating: 5, image: getImg(100) },
    { id: 302, name: 'New Book 2', price: 15.50, rating: 4, image: getImg(101) },
    { id: 303, name: 'Fresh Arrival', price: 9.99, rating: 0, image: getImg(102) },
    { id: 304, name: 'Just In', price: 22.00, rating: 5, image: getImg(103) },
]);

const showModal = ref(false);
const selectedProduct = ref(null);

const openProductModal = (product) => {
    selectedProduct.value = product;
    showModal.value = true;
};
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
    padding: 40px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

.page-header {
    margin-bottom: 30px;
    text-align: center;
}

.page-header h1 {
    color: #333;
    font-size: 28px;
    margin-bottom: 10px;
}

/* Grid Layout */
.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 25px;
}
</style>