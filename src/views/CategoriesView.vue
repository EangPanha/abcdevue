<template>
    <div class="page-wrapper">
        <AppHeader />
        <main class="main-content">
            <div class="container">

                <div class="page-header">
                    <h1>Explore by Category</h1>
                    <p>Dive into your favorite genres and discover new worlds.</p>
                </div>

                <div class="category-grid">
                    <div v-for="cat in categories" :key="cat.id" class="cat-card">

                        <div class="card-bg" :style="{ backgroundImage: `url(${cat.image})` }"></div>

                        <div class="card-overlay"></div>

                        <div class="card-content">
                            <div class="icon-box">
                                <i :class="cat.icon"></i>
                            </div>
                            <h3>{{ cat.name }}</h3>
                            <p>{{ cat.count }} items</p>
                            <span class="explore-btn">Explore <i class="fa-solid fa-arrow-right"></i></span>
                        </div>

                    </div>
                </div>

            </div>
        </main>
        <AppFooter />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import AppHeader from '../components/AppHeader.vue';
import AppFooter from '../components/AppFooter.vue';

// Helper for background images (Using book covers as textures)
const getImg = (id) => `https://covers.openlibrary.org/b/id/${id}-L.jpg`;

const categories = ref([
    {
        id: 1,
        name: 'Fiction & Fantasy',
        icon: 'fa-solid fa-dragon',
        image: getImg(8259301), // The Hobbit
        count: '1.2k'
    },
    {
        id: 2,
        name: 'Business & Finance',
        icon: 'fa-solid fa-chart-line',
        image: getImg(8375633), // Rich Dad Poor Dad
        count: '850'
    },
    {
        id: 3,
        name: 'Science & Tech',
        icon: 'fa-solid fa-microchip',
        image: getImg(8324311), // Clean Code
        count: '540'
    },
    {
        id: 4,
        name: 'History & Culture',
        icon: 'fa-solid fa-landmark',
        image: getImg(8259201), // Sapiens (or similar)
        count: '320'
    },
    {
        id: 5,
        name: 'Biographies',
        icon: 'fa-solid fa-user-pen',
        image: getImg(8159201), // War and Peace (Classic portrait feel)
        count: '210'
    },
    {
        id: 6,
        name: 'Kids & Family',
        icon: 'fa-solid fa-shapes',
        image: getImg(8259304), // Cat in the Hat
        count: '400+'
    },
    {
        id: 7,
        name: 'Romance',
        icon: 'fa-solid fa-heart',
        image: getImg(8259400), // Pride and Prejudice
        count: '600+'
    },
    {
        id: 8,
        name: 'Health & Wellness',
        icon: 'fa-solid fa-leaf',
        image: getImg(12629631), // Medical/Health
        count: '150'
    }
]);
</script>

<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f8f9fa;
}

.main-content {
    flex: 1;
    padding: 50px 0;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header */
.page-header {
    text-align: center;
    margin-bottom: 50px;
}

.page-header h1 {
    font-size: 36px;
    color: #2c3e50;
    margin-bottom: 10px;
    font-weight: 800;
}

.page-header p {
    color: #7f8c8d;
    font-size: 18px;
}

/* Grid Layout */
.category-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 30px;
}

/* --- THE CARD DESIGN --- */
.cat-card {
    position: relative;
    height: 220px;
    border-radius: 16px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.4s ease, box-shadow 0.4s ease;
}

/* 1. Background Image Zoom Effect */
.card-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    transition: transform 0.6s ease;
    z-index: 1;
}

/* 2. Dark Overlay (Gradient) */
.card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 100%);
    z-index: 2;
    transition: background 0.4s ease;
}

/* 3. Text & Content */
.card-content {
    position: relative;
    z-index: 3;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* Align text to bottom */
    padding: 25px;
    color: white;
}

.icon-box {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cat-card h3 {
    font-size: 22px;
    margin: 0 0 5px;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.cat-card p {
    margin: 0;
    font-size: 14px;
    opacity: 0.8;
}

.explore-btn {
    margin-top: 15px;
    font-size: 13px;
    font-weight: bold;
    color: #e6b34e;
    opacity: 0;
    /* Hidden by default */
    transform: translateY(10px);
    transition: all 0.4s ease;
}

/* --- HOVER EFFECTS --- */
.cat-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

.cat-card:hover .card-bg {
    transform: scale(1.15);
    /* Zoom in image */
}

.cat-card:hover .card-overlay {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(230, 179, 78, 0.2) 100%);
}

.cat-card:hover .icon-box {
    transform: scale(1.2) rotate(10deg);
    background: #e6b34e;
    color: white;
}

.cat-card:hover .explore-btn {
    opacity: 1;
    transform: translateY(0);
}
</style>