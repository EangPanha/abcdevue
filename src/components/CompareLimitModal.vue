<template>
  <div v-if="visible" class="compare-limit-overlay">
    <div class="compare-limit-modal">
        <h3>{{ title }}</h3>
        <p v-html="message"></p>
      <div class="actions">
        <button @click="close" class="btn btn-primary">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from '../store';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const visible = computed(() => store.state.showCompareLimitModal);
const title = computed(() => t('compare.limitTitle') || t('compare.title') || t('compareLimit') || 'Compare Limit');
const message = computed(() => t('compare.limitWarning'));
function close() {
  store.methods.hideCompareLimit();
}
</script>

<style scoped>
.compare-limit-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
}
.compare-limit-modal {
  background: #fff;
  padding: 20px 22px;
  border-radius: 10px;
  max-width: 420px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
}
.compare-limit-modal h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
}
.compare-limit-modal p {
  margin: 0 0 16px 0;
  color: #555;
}
.actions {
  display: flex;
  justify-content: center;
}
.btn {
  padding: 8px 14px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.btn-primary {
  background: #e6b34e;
  color: #fff;
}
</style>
