<template>
  <div v-if="isOpen && invoice" class="invoice-overlay" @click.self="close">
    <div class="invoice-modal">
      <div class="invoice-header">
        <h2>{{ t('invoice.title') }}</h2>
        <div class="header-actions">
          <button class="download-btn pdf-btn" @click="downloadPDF" :title="t('invoice.downloadPDF')">
            <i class="fa-solid fa-file-pdf"></i> {{ t('invoice.downloadPDF') }}
          </button>
          <button class="download-btn png-btn" @click="downloadPNG" :title="t('invoice.downloadPNG')">
            <i class="fa-solid fa-image"></i> {{ t('invoice.downloadPNG') }}
          </button>
          <button class="close-btn" @click="close">&times;</button>
        </div>
      </div>

      <div class="invoice-body">
        <div ref="invoiceContent" class="invoice-content">
          <div class="invoice-company">
            <h1 class="company-name"><i class="fa-solid fa-store"></i> MarketPlace</h1>
            <p class="company-info">{{ t('invoiceExtra.thankYou') }}</p>
          </div>

          <div class="invoice-title-section">
            <div>
              <h2 class="invoice-title">{{ t('invoice.title') }}</h2>
              <p class="order-number">{{ t('invoice.invoiceNumber') }} {{ invoice.orderNumber }}</p>
            </div>
            <div class="invoice-date">
              <p><strong>{{ t('invoiceExtra.invoiceDate') }}</strong> {{ invoice.date }}</p>
            </div>
          </div>

          <div class="invoice-sections">
            <div class="invoice-section">
              <h3>{{ t('invoiceExtra.shippingTo') }}</h3>
              <p class="customer-name">{{ invoice.shippingInfo.firstName }} {{ invoice.shippingInfo.lastName }}</p>
              <p v-if="invoice.shippingInfo.address">{{ invoice.shippingInfo.address }}</p>
              <p v-if="invoice.shippingInfo.city">{{ invoice.shippingInfo.city }}</p>
              <p v-if="invoice.shippingInfo.country">{{ invoice.shippingInfo.country }}</p>
              <p v-if="invoice.shippingInfo.email"><strong>{{ t('auth.email') }}:</strong> {{ invoice.shippingInfo.email }}</p>
              <p v-if="invoice.shippingInfo.phone"><strong>{{ t('checkout.phone') }}:</strong> {{ invoice.shippingInfo.phone }}</p>
            </div>
          </div>

          <div class="invoice-items">
            <h3>{{ t('invoiceExtra.orderItems') }}</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>{{ t('invoice.items') || 'Item' }}</th>
                  <th>Qty</th>
                  <th>{{ t('invoice.subtotal') || 'Unit Price' }}</th>
                  <th>{{ t('invoice.total') || 'Total' }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in invoice.items" :key="item.id" class="item-row">
                  <td class="item-cell">
                    <div class="item-with-image">
                      <img :src="item.image" :alt="item.name" class="item-image" />
                      <span class="item-name">{{ item.name }}</span>
                    </div>
                  </td>
                  <td class="item-qty">{{ item.quantity }}</td>
                  <td class="item-price">{{ formatPrice(item.price) }}</td>
                  <td class="item-total">{{ formatPrice(item.price * item.quantity) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="invoice-summary">
            <div class="summary-row">
              <span>{{ t('invoice.subtotal') }}</span>
              <span>{{ formatPrice(invoice.subtotal) }}</span>
            </div>
            <div class="summary-row">
              <span>{{ t('invoice.shipping') }}</span>
              <span>{{ formatPrice(invoice.shipping) }}</span>
            </div>
            <div class="summary-row grand-total">
              <span>{{ t('invoice.total') }}</span>
              <span>{{ formatPrice(invoice.total) }}</span>
            </div>
          </div>

          <div class="invoice-footer">
            <p>{{ t('invoiceExtra.thankYou') }}</p>
            <p class="footer-contact">{{ t('invoiceExtra.supportContact') }}</p>
          </div>
        </div>
      </div>

      <div class="invoice-actions">
        <button class="continue-btn" @click="close">
          <i class="fa-solid fa-check"></i> {{ t('invoiceExtra.continue') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { ref, computed } from 'vue';
import store from '../store/index.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useI18n } from 'vue-i18n';


const props = defineProps({ isOpen: Boolean });
const emit = defineEmits(['close']);
const isOpen = computed(() => props.isOpen);

const { t } = useI18n();
const invoiceContent = ref(null);
const invoice = computed(() => store.state.invoice || null);

const formatPrice = (val) => store.methods.formatPrice(val);

const close = () => emit('close');

const inlineImages = async (rootEl) => {
  if (!rootEl) return;
  const imgs = Array.from(rootEl.querySelectorAll('img'));
  for (const img of imgs) {
    try {
      if (!img.src || img.src.startsWith('data:')) continue;
      img.crossOrigin = 'anonymous';
      const res = await fetch(img.src, { mode: 'cors' });
      if (!res.ok) throw new Error('Fetch failed');
      const blob = await res.blob();
      await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          img.src = reader.result;
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (err) {
      continue;
    }
  }
};

const downloadPDF = async () => {
  try {
    const element = invoiceContent.value;
    await inlineImages(element);
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', useCORS: true, imageTimeout: 15000 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Invoice-${invoice.value.orderNumber}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert(t('invoice.downloadError') || 'Failed to download PDF');
  }
};

const downloadPNG = async () => {
  try {
    const element = invoiceContent.value;
    await inlineImages(element);
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff', useCORS: true, imageTimeout: 15000 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Invoice-${invoice.value.orderNumber}.png`;
    link.click();
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert(t('invoice.downloadError') || 'Failed to download PNG');
  }
};
</script>

<style scoped>
.invoice-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1100; padding:20px; }
.invoice-modal { background: #fff; border-radius:12px; width:100%; max-width:820px; max-height:90vh; display:flex; flex-direction:column; box-shadow:0 10px 40px rgba(0,0,0,0.3); }
.invoice-header{ padding:18px 24px; border-bottom:2px solid #e6b34e; display:flex; justify-content:space-between; align-items:center; }
.header-actions{ display:flex; gap:8px; align-items:center; }
.download-btn{ padding:8px 12px; border:none; border-radius:6px; cursor:pointer; color:#fff; font-weight:600; display:flex; align-items:center; gap:8px; }
.pdf-btn{ background:#d9534f }
.png-btn{ background:#5cb85c }
.close-btn{ background:none; border:none; font-size:28px; cursor:pointer; color:#666 }
.invoice-body{ padding:20px; overflow:auto; }
.invoice-content{ background:#fff; padding:22px; border-radius:8px; border:1px solid #eee }
.company-name{ margin:0 0 8px; font-size:20px }
.items-table{ width:100%; border-collapse:collapse; margin-top:12px }
.items-table th,.items-table td{ padding:8px 10px; border-bottom:1px solid #f0f0f0; text-align:left }
.item-image{ width:60px; height:60px; object-fit:contain; border-radius:4px }
.item-with-image{ display:flex; align-items:center; gap:12px }
.invoice-summary{ margin-top:16px }
.summary-row{ display:flex; justify-content:space-between; padding:6px 0 }
.grand-total{ font-weight:700; color:#e6b34e }
.invoice-actions{ padding:12px 18px; border-top:1px solid #eee; display:flex; justify-content:flex-end }
.continue-btn{ background:#e6b34e; color:#fff; border:none; padding:10px 14px; border-radius:6px; cursor:pointer }
.service-img{ width:80px; height:40px; object-fit:contain; margin-right:12px }
.service-display{ display:flex; align-items:center; gap:8px }
.footer-contact{ color:#666; font-size:13px }
</style>
