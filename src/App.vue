<script setup>
import Toast  from 'primevue/toast';
import  ConfirmDialog  from 'primevue/confirmdialog';
</script>

<template>
    <router-view />
    <Toast/>
    <ConfirmDialog/>
</template>

<style>
/* Estilos globales (opcional). 
  Al no tener 'scoped', esto afecta a toda la app.
  Es un buen lugar para resets o fuentes si no usaras Tailwind.
*/
body {
  background-color: #f8fafc; /* gris muy suave de fondo base */
  margin: 0;
  font-family: var(--font-family);
}
</style>