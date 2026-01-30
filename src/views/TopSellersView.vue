<template>
    <div class="page-wrapper">
        <AppHeader />
        <main class="main-content">
            <div class="container">
                <div class="page-header">
                    <h1>Top Sellers</h1>
                    <p>Our most popular items this month.</p>
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

const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const products = ref([
    { id: 401, name: 'Best Seller 1', price: 10.00, rating: 5, image: getImg(200) },
    { id: 402, name: 'Best Seller 2', price: 25.50, rating: 5, image: getImg(201) },
    { id: 403, name: 'Popular Item', price: 15.00, rating: 4, image: getImg(202) },
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

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 25px;
}
</style>