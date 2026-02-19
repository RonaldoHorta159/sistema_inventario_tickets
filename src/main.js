import { createApp } from 'vue'
import './assets/main.css';
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { definePreset, updatePrimaryPalette } from '@primeuix/themes';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '#fff5f5',
            100: '#ffe3e3',
            200: '#ffc9c9',
            300: '#ffa8a8',
            400: '#ff8787',
            500: '#c50118', // TU COLOR PRINCIPAL AQUÍ
            600: '#fa5252',
            700: '#f03e3e',
            800: '#e03131',
            900: '#c92a2a',
            950: '#a32020'
        }
    }
});
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: '.dark',
        }
    }
});

updatePrimaryPalette({

})

app.use(ToastService);
app.use(ConfirmationService);
app.mount('#app')
