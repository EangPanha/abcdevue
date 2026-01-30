<template>
    <div v-if="isOpen" class="compare-overlay" @click.self="close">
        <div class="compare-modal">
            <div class="compare-header">
                <h2>{{ $t('sidebar.compareTitle') }}</h2>
                <button class="close-btn" @click="close">&times;</button>
            </div>

            <div class="compare-body">
                <div v-if="items.length === 0" class="empty-message">
                    <i class="fa-solid fa-code-compare"></i>
                    <p>{{ $t('sidebar.empty') }}</p>
                </div>

                <div v-else class="comparison-table-wrapper">
                    <div class="comparison-table">
                        
                        <div class="compare-grid-row header-row" :style="dynamicGridStyle">
                            <div class="row-label empty-label"></div>
                            
                            <div v-for="product in items" :key="product.id" class="product-col">
                                <div class="product-card">
                                    
                                    <button class="remove-btn" @click="removeItem(product)" title="Remove">
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>

                                    <div class="product-image-container">
                                        <img :src="product.image" :alt="product.name" />
                                    </div>
                                    <h4>{{ product.name }}</h4>
                                    
                                </div>
                            </div>
                        </div>

                        <div class="compare-grid-row" :style="dynamicGridStyle">
                            <div class="row-label">Price</div>
                            <div v-for="product in items" :key="'price-' + product.id" class="row-value">
                                <span class="price-highlight">{{ formatPrice(product.price) }}</span>
                            </div>
                        </div>

                        <div class="compare-grid-row" :style="dynamicGridStyle">
                            <div class="row-label">Original Price</div>
                            <div v-for="product in items" :key="'oldprice-' + product.id" class="row-value">
                                <span v-if="product.oldPrice" class="old-price">{{ formatPrice(product.oldPrice) }}</span>
                                <span v-else class="no-value">-</span>
                            </div>
                        </div>

                        <div class="compare-grid-row" :style="dynamicGridStyle">
                            <div class="row-label">Discount</div>
                            <div v-for="product in items" :key="'discount-' + product.id" class="row-value">
                                <span v-if="product.discount" class="discount-badge">-{{ product.discount }}%</span>
                                <span v-else class="no-discount">-</span>
                            </div>
                        </div>

                        <div class="compare-grid-row" :style="dynamicGridStyle">
                            <div class="row-label">Rating</div>
                            <div v-for="product in items" :key="'rating-' + product.id" class="row-value">
                                <div class="stars">
                                    <i v-for="n in 5" :key="n" class="fa-solid fa-star" 
                                       :class="{ 'active-star': n <= product.rating }"></i>
                                </div>
                                <span class="rating-score">({{ product.rating }}/5)</span>
                            </div>
                        </div>

                        <div class="compare-grid-row action-row" :style="dynamicGridStyle">
                            <div class="row-label">Action</div>
                            <div v-for="product in items" :key="'action-' + product.id" class="row-value">
                                <button class="add-to-cart-btn" @click="addToCart(product)">
                                    <i class="fa-solid fa-cart-shopping"></i> Add
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div class="compare-footer">
                <p class="items-count">{{ items.length }} items selected</p>
                <button class="close-modal-btn" @click="close">Close Comparison</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import store from '../store/index.js';

/* eslint-disable no-undef */
const props = defineProps({
    isOpen: Boolean,
    items: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['close']);
/* eslint-enable no-undef */

const dynamicGridStyle = computed(() => {
    const count = props.items.length;
    return {
        gridTemplateColumns: `180px repeat(${count}, minmax(220px, 1fr))`
    };
});

const formatPrice = (val) => store.methods.formatPrice(val);

const removeItem = (product) => {
    store.methods.removeFromCompare(product);
};

const addToCart = (product) => {
    store.methods.addToCart(product);
};

const close = () => {
    emit('close');
};
</script>

<style scoped>
/* --- SAME OVERLAY STYLES --- */
.compare-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;
    z-index: 1000; padding: 20px; animation: fadeIn 0.3s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.compare-modal {
    background: white; border-radius: 12px;
    width: 100%; max-width: 1200px; max-height: 90vh;
    display: flex; flex-direction: column;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); overflow: hidden;
}

.compare-header {
    padding: 20px 30px; border-bottom: 2px solid #e6b34e;
    display: flex; justify-content: space-between; align-items: center;
    background: #fcfcfc; flex-shrink: 0;
}
.compare-header h2 { margin: 0; color: #333; font-size: 24px; }
.close-btn { background: none; border: none; font-size: 32px; color: #666; cursor: pointer; }

.compare-body {
    flex: 1; overflow: hidden; display: flex; flex-direction: column;
}
.empty-message {
    flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
    color: #999; text-align: center; padding: 50px;
}
.empty-message i { font-size: 60px; margin-bottom: 15px; color: #ddd; }
.comparison-table-wrapper { flex: 1; overflow: auto; padding: 20px 30px; }
.comparison-table { display: flex; flex-direction: column; min-width: 100%; width: fit-content; }
.compare-grid-row {
    display: grid; gap: 15px; padding: 15px 0; border-bottom: 1px solid #eee; align-items: center;
}
.compare-grid-row:last-child { border-bottom: none; }
.header-row { align-items: end; border-bottom: 3px solid #e6b34e; padding-bottom: 20px; }

/* Labels & Values */
.row-label {
    font-weight: 600; color: #333; padding: 12px; background: #f8f8f8;
    border-radius: 6px; text-align: right; display: flex; align-items: center;
    justify-content: flex-end; height: 100%; min-height: 50px;
}
.empty-label { background: transparent; }
.row-value {
    text-align: center; padding: 10px; background: white; border-radius: 4px;
    min-height: 50px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 5px;
}
.price-highlight { font-size: 20px; font-weight: bold; color: #e6b34e; }
.old-price { color: #999; text-decoration: line-through; font-size: 13px; }
.discount-badge { background: #ff4d4f; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; }
.stars .active-star { color: #f1c40f; }

/* --- PRODUCT CARD & REMOVE BUTTON --- */
.product-card {
    border: 1px solid #eee;
    border-radius: 8px; padding: 15px;
    text-align: center; background: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    transition: transform 0.2s;
    display: flex; flex-direction: column; align-items: center;
    
    /* Important for absolute positioning the button */
    position: relative;
}
.product-card:hover { transform: translateY(-3px); border-color: #e6b34e; }

/* 👇 NEW STYLE FOR TOP-RIGHT REMOVE BUTTON 👇 */
.remove-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #fff;
    border: 1px solid #ff4d4f;
    color: #ff4d4f;
    font-size: 13px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    transition: all 0.2s ease;
    z-index: 10;
}

.remove-btn:hover {
    background: #ff4d4f;
    color: white;
    transform: scale(1.1);
}

.product-image-container {
    width: 100%; height: 120px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 10px; margin-top: 10px; /* Added margin top to clear button */
}
.product-card img { max-width: 100%; max-height: 100%; object-fit: contain; }
.product-card h4 { font-size: 14px; margin: 0; min-height: 40px; display: flex; align-items: center; }

.add-to-cart-btn {
    background: #e6b34e; color: white; border: none; padding: 8px 20px;
    border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 13px;
    display: flex; align-items: center; gap: 6px;
}
.add-to-cart-btn:hover { background: #d6a23e; }

.compare-footer {
    padding: 15px 30px; border-top: 1px solid #eee;
    display: flex; justify-content: space-between; align-items: center;
    background: #f8f8f8; flex-shrink: 0;
}
.close-modal-btn {
    background: #333; color: white; border: none; padding: 10px 20px;
    border-radius: 4px; cursor: pointer;
}
.close-modal-btn:hover { background: #555; }

/* Mobile */
@media (max-width: 768px) {
    .compare-modal { max-width: 100%; max-height: 100%; border-radius: 0; }
    .compare-grid-row { gap: 10px; }
}
</style>