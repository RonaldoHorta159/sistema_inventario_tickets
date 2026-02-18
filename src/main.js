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
import { updatePrimaryPalette } from '@primeuix/themes';


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
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
