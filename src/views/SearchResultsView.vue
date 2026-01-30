<template>
    <div class="page-wrapper">
        <AppHeader />

        <main class="main-content">
            <div class="container">

                <div class="search-header">
                    <h1>Search Results</h1>
                    <p v-if="searchQuery">
                        Showing results for: <span class="highlight">"{{ searchQuery }}"</span>
                    </p>
                </div>

                <div v-if="filteredProducts.length === 0" class="no-results">
                    <i class="fa-solid fa-magnifying-glass-minus"></i>
                    <h2>No products found</h2>
                    <p>Try searching for "Book", "Cream", "Harry Potter", or "Care".</p>
                    <router-link to="/" class="back-btn">Go Back Home</router-link>
                </div>

                <div v-else class="product-grid">
                    <div v-for="product in filteredProducts" :key="product.id" class="grid-item">
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
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';
import SellerCard from '../components/SellerCard.vue';
import ProductQuickView from '../components/ProductQuickView.vue';

const route = useRoute();
const searchQuery = ref('');
const showModal = ref(false);
const selectedProduct = ref(null);

// Helper for images
const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

// --- MOCK DATABASE (All your products combined) ---
const allProducts = [
    { id: 1, name: 'L3D Bop Bags Age 3+', price: 3.59, rating: 4, image: getImg(8392888) },
    { id: 2, name: 'Klen-ANTI Dandruff Shampoo', price: 3.00, rating: 0, image: getImg(10584485) },
    { id: 3, name: 'Flower A003', price: 15.00, oldPrice: 17.65, rating: 5, image: getImg(12693952) },
    { id: 4, name: 'Baby Head to toe wash', price: 4.60, rating: 4, image: getImg(8259905) },
    { id: 101, name: 'Dragon Balm 50g', price: 1.50, rating: 5, image: getImg(8231856) },
    { id: 102, name: 'Herbal Essence Oil', price: 8.53, rating: 4, image: getImg(8375621) },
    { id: 201, name: 'Atomic Habits', price: 18.00, rating: 5, image: getImg(14553185) },
    { id: 202, name: 'Deep Work', price: 14.50, rating: 4, image: getImg(8259201) },
    { id: 203, name: 'The Psychology of Money', price: 16.00, rating: 5, image: getImg(10520202) },
    { id: 401, name: 'Harry Potter', price: 20.00, rating: 5, image: getImg(8259300) },
    { id: 301, name: 'Pride and Prejudice', price: 8.00, rating: 5, image: getImg(8259400) },
    { id: 302, name: '1984', price: 9.50, rating: 5, image: getImg(7249200) },
];

// --- FILTER LOGIC ---
const filteredProducts = computed(() => {
    if (!searchQuery.value) return [];
    const lowerQuery = searchQuery.value.toLowerCase();

    return allProducts.filter(item =>
        item.name.toLowerCase().includes(lowerQuery)
    );
});

// Update query when URL changes
const updateSearch = () => {
    searchQuery.value = route.query.q || '';
};

onMounted(updateSearch);
watch(() => route.query.q, updateSearch);

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

.search-header {
    margin-bottom: 30px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 20px;
}

.search-header h1 {
    font-size: 24px;
    color: #333;
    margin: 0 0 10px 0;
}

.highlight {
    color: #e6b34e;
    font-weight: bold;
    font-style: italic;
}

.no-results {
    text-align: center;
    padding: 60px 0;
    color: #666;
}

.no-results i {
    font-size: 50px;
    color: #ccc;
    margin-bottom: 20px;
}

.no-results h2 {
    font-size: 20px;
    color: #333;
}

.back-btn {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 20px;
    background: #e6b34e;
    color: white;
    text-decoration: none;
    border-radius: 4px;
    font-weight: bold;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 25px;
}
</style>