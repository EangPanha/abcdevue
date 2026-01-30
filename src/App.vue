<template>
  <div id="app">
    <router-view />
    <CompareLimitModal />
  </div>
</template>

<script setup>
import CompareLimitModal from './components/CompareLimitModal.vue';
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Khmer+OS:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Roboto', sans-serif;
}

body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  background-color: #f4f6f8;
  transition: font-family 0.2s ease-in-out;
}

/* Default English Font - Roboto */
:root {
  font-family: 'Roboto', sans-serif;
  --font-family: 'Roboto', sans-serif;
}

/* Khmer Language Font - use single Khmer OS to avoid font switching */
:root.khmer-language {
  --font-family: 'Khmer OS', serif;
  font-family: 'Khmer OS', serif;
}

:root.khmer-language body {
  font-family: 'Khmer OS', serif !important;
}

/* Apply Khmer font to text content but exclude icons */
:root.khmer-language p,
:root.khmer-language span:not(.badge),
:root.khmer-language h1,
:root.khmer-language h2,
:root.khmer-language h3,
:root.khmer-language h4,
:root.khmer-language h5,
:root.khmer-language h6,
:root.khmer-language button,
:root.khmer-language a,
:root.khmer-language label,
:root.khmer-language div:not([class*="icon"]),
:root.khmer-language input,
:root.khmer-language textarea {
  font-family: 'Khmer OS', serif !important;
}

/* Preserve Font Awesome icons - ALL variants */
:root.khmer-language .fa,
:root.khmer-language .fa-solid,
:root.khmer-language .fa-regular,
:root.khmer-language .fa-light,
:root.khmer-language .fa-thin,
:root.khmer-language .fa-duotone,
:root.khmer-language .fa-brands,
:root.khmer-language .fa-sharp,
:root.khmer-language i[class*="fa-"] {
  font-family: 'Font Awesome 6 Free', 'Font Awesome 6 Brands' !important;
}

/* Also preserve all elements with fa classes */
:root.khmer-language [class*="fa-"] {
  font-family: 'Font Awesome 6 Free', 'Font Awesome 6 Brands' !important;
}

/* Fixed-width font for code */
code, pre {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
}

.flying-img {
  pointer-events: none;
  box-shadow: 0 10px 20px rgba(0,0,0,0.2);
  border-radius: 8px;
  object-fit: contain;
  background: white;
}
</style>
