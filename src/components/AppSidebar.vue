<template>
  <div>
    <div class="sidebar-overlay" :class="{ open: isOpen }" @click="$emit('close')"></div>

    <div class="sidebar" :class="{ open: isOpen }">
      <div class="sidebar-header">
        <h3>{{ title }}</h3>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="sidebar-body">
        <div v-if="items.length === 0" class="empty-msg">
          {{ $t('sidebar.empty') }}
        </div>

        <div v-else class="item-list">
          <div v-for="(item, index) in items" :key="index" class="sidebar-item">
            <img :src="item.image" alt="Product" />
            
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p class="price">{{ formatPrice(item.price) }}</p>

              <div v-if="title === $t('sidebar.cartTitle') || title === 'Shopping Cart'" class="qty-control">
                <button class="qty-btn" @click="decrease(item)">-</button>
                <span>{{ item.quantity }}</span>
                <button class="qty-btn" @click="increase(item)">+</button>
              </div>
            </div>

            <button class="remove-btn" @click="$emit('remove', item)">&times;</button>
          </div>
        </div>
      </div>

      <div class="sidebar-footer" v-if="items.length > 0">
        <div v-if="title === $t('sidebar.cartTitle') || title === 'Shopping Cart'" class="total-row">
          <span>{{ $t('sidebar.total') }}</span>
          <span class="total-price">{{ formattedCartTotal }}</span>
        </div>
        <button class="checkout-btn" @click="goToCheckout">{{ $t('sidebar.checkout') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import store from '../store/index.js';

/* eslint-disable no-undef */
const props = defineProps({
  isOpen: Boolean,
  title: String,
  items: Array
});

// --- HELPER: Format Price ---
// This makes the formatPrice method available in the HTML template above
const formatPrice = (value) => {
    return store.methods.formatPrice(value);
};

// --- CALCULATE TOTAL ---
const { t } = useI18n();

const formattedCartTotal = computed(() => {
  // Only calculate when the sidebar is the Shopping Cart (supports translations)
  if (props.title !== t('sidebar.cartTitle') && props.title !== 'Shopping Cart') {
    return store.methods.formatPrice(0);
  }

  // 1. Calculate the raw number (Sum of Price x Quantity)
  const rawTotal = props.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
  }, 0);

  // 2. Convert that number using the Store (handles Exchange Rate + Symbol)
  return store.methods.formatPrice(rawTotal);
});

// Helper Functions for Buttons
const increase = (item) => store.methods.increaseQty(item);
const decrease = (item) => store.methods.decreaseQty(item);
const goToCheckout = () => {
  store.state.showCheckout = true;
  store.methods.closeSidebar();
};
</script>

<style scoped>
.sidebar-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); z-index: 998;
  opacity: 0; visibility: hidden; transition: 0.3s;
}
.sidebar-overlay.open { opacity: 1; visibility: visible; }

.sidebar {
  position: fixed; top: 0; right: -350px; width: 320px; height: 100%;
  background: white; z-index: 999;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  transition: 0.3s ease-in-out;
  display: flex; flex-direction: column;
}
.sidebar.open { right: 0; }

.sidebar-header {
  padding: 15px; border-bottom: 1px solid #eee;
  display: flex; justify-content: space-between; align-items: center;
  background: #f8f8f8;
}
.sidebar-header h3 { margin: 0; font-size: 16px; color: #333; }
.close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #666; }

.sidebar-body { flex: 1; overflow-y: auto; padding: 15px; }
.empty-msg { text-align: center; color: #999; margin-top: 50px; }

.sidebar-item { display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px; position: relative; }
.sidebar-item img { width: 60px; height: 60px; object-fit: cover; border-radius: 4px; }
.item-info { flex: 1; }
.item-info h4 { margin: 0 0 5px; font-size: 13px; color: #333; line-height: 1.4; }
.price { margin: 0; color: #e6b34e; font-weight: bold; font-size: 14px; }

/* QUANTITY CONTROLS */
.qty-control {
  display: flex; align-items: center; gap: 10px; margin-top: 5px;
}
.qty-btn {
  width: 24px; height: 24px;
  background: #f0f0f0; border: none;
  border-radius: 4px; cursor: pointer;
  font-weight: bold; color: #555;
}
.qty-btn:hover { background: #e0e0e0; }

.remove-btn { position: absolute; right: 0; top: 0; border: none; background: none; color: #999; cursor: pointer; font-size: 18px; }

.sidebar-footer { padding: 15px; border-top: 1px solid #eee; background: #fff; }
.total-row {
  display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; color: #333;
}
.total-price { color: #e6b34e; font-size: 18px; }

.checkout-btn { width: 100%; background: #e6b34e; color: white; border: none; padding: 12px; font-weight: bold; cursor: pointer; border-radius: 4px; }
.checkout-btn:hover { background: #d6a23e; }
</style>