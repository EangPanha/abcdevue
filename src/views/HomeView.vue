<template>
    <div class="home-page">
        <AppHeader />

        <main class="main-content">
            <div class="container">
                <ProductCarousel :title="$t('home.bestSelling')" :products="bestSelling"
                    @item-click="openProductModal" />
                <ProductCarousel :title="$t('home.personalCare')" :products="personalCare"
                    @item-click="openProductModal" />
                <ProductCarousel :title="$t('home.trending')" :products="trending" @item-click="openProductModal" />
                <ProductCarousel :title="$t('home.classics')" :products="classics" @item-click="openProductModal" />
                <ProductCarousel :title="$t('home.children')" :products="children" @item-click="openProductModal" />
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
import ProductCarousel from '../components/ProductCarousel.vue';
import ProductQuickView from '../components/ProductQuickView.vue'; // ✅ CORRECT (Looks in components)

const showModal = ref(false);
const selectedProduct = ref(null);

// Create a function to open the modal
const openProductModal = (product) => {
    selectedProduct.value = product;
    showModal.value = true;
};

// Helper to get image
const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

// 1. Data for "Best Selling"
const bestSelling = ref([
    { id: 1, name: 'L3D Bop Bags Age 3+', price: 3.59, rating: 4, image: getImg(8392888), discount: 0 },
    { id: 2, name: 'Klen-ANTI Dandruff Hair Shampoo', price: 3.00, rating: 0, image: getImg(10584485), discount: 0 },
    { id: 3, name: 'Flower A003', price: 15.00, oldPrice: 17.65, rating: 5, image: getImg(12693952), discount: 15 },
    { id: 4, name: 'Baby Head to toe wash 500ml', price: 4.60, rating: 4, image: getImg(8259905), discount: 0 },
    { id: 5, name: 'KORENO Spicy Hot Pot Jumbo 100g', price: 4.50, rating: 3, image: getImg(10467812), discount: 0 },
    { id: 6, name: 'FLOOR CLEANER ANTI-BACTERIAL', price: 13.75, rating: 5, image: getImg(8259443), discount: 0 },
    { id: 7, name: 'Extra Item 1', price: 10.00, rating: 4, image: getImg(10522304), discount: 0 },
    { id: 8, name: 'Extra Item 2', price: 20.00, rating: 5, image: getImg(12556708), discount: 0 },
]);

// 2. Data for "Personal Care"
const personalCare = ref([
    { id: 101, name: 'Dragon Balm 50g', price: 1.50, rating: 5, image: getImg(8231856) },
    { id: 102, name: 'Herbal Essence Oil', price: 8.53, rating: 4, image: getImg(8375621) },
    { id: 103, name: 'Traumatic Pain Relief', price: 15.36, rating: 4, image: getImg(12629631) },
    { id: 104, name: 'Clarissa Facial Wash', price: 26.00, rating: 0, image: getImg(8422522) },
    { id: 105, name: 'Clarissa Toner', price: 22.00, rating: 0, image: getImg(12030270) },
    { id: 106, name: 'Yellow Balm Large', price: 4.50, rating: 5, image: getImg(10843634) },
    { id: 107, name: 'Extra Care Item', price: 9.99, rating: 3, image: getImg(10171329) },
]);

// 3. NEW: Data for "Trending Now" (7 Items)
const trending = ref([
    { id: 201, name: 'Atomic Habits', price: 18.00, rating: 5, image: getImg(14553185) },
    { id: 202, name: 'Deep Work', price: 14.50, rating: 4, image: getImg(8259201) },
    { id: 203, name: 'The Psychology of Money', price: 16.00, rating: 5, image: getImg(10520202) },
    { id: 204, name: 'Rich Dad Poor Dad', price: 12.99, rating: 4, image: getImg(8375633) },
    { id: 205, name: 'Zero to One', price: 15.00, rating: 4, image: getImg(8259203) },
    { id: 206, name: 'Thinking, Fast and Slow', price: 13.50, rating: 5, image: getImg(7324328) },
    { id: 207, name: 'Clean Code', price: 35.00, rating: 5, image: getImg(8324311) },
]);

// 4. NEW: Data for "Classic Literature" (7 Items)
const classics = ref([
    { id: 301, name: 'Pride and Prejudice', price: 8.00, rating: 5, image: getImg(8259400) },
    { id: 302, name: '1984', price: 9.50, rating: 5, image: getImg(7249200) },
    { id: 303, name: 'The Great Gatsby', price: 10.00, rating: 4, image: getImg(8259222) },
    { id: 304, name: 'Moby Dick', price: 11.50, rating: 3, image: getImg(6259200) },
    { id: 305, name: 'War and Peace', price: 15.00, rating: 5, image: getImg(8159201) },
    { id: 306, name: 'Hamlet', price: 7.50, rating: 5, image: getImg(5259200) },
    { id: 307, name: 'The Odyssey', price: 12.00, rating: 4, image: getImg(4259200) },
]);

// 5. NEW: Data for "Children's Books" (7 Items)
const children = ref([
    { id: 401, name: 'Harry Potter', price: 20.00, rating: 5, image: getImg(8259300) },
    { id: 402, name: 'The Hobbit', price: 18.00, rating: 5, image: getImg(8259301) },
    { id: 403, name: 'Charlotte\'s Web', price: 8.50, rating: 5, image: getImg(8259302) },
    { id: 404, name: 'Matilda', price: 9.00, rating: 4, image: getImg(8259303) },
    { id: 405, name: 'The Cat in the Hat', price: 6.00, rating: 4, image: getImg(8259304) },
    { id: 406, name: 'Green Eggs and Ham', price: 6.50, rating: 5, image: getImg(8259305) },
    { id: 407, name: 'The Giving Tree', price: 10.00, rating: 5, image: getImg(8259306) },
]);
</script>

<style scoped>
.home-page {
    background-color: #f4f6f8;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
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
</style>