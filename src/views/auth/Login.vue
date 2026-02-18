<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth';


const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');

const loading = ref(false)
const showPassword = ref(false)

const handleLogin = async () => {
    if (!email.value || !password.value) {
        toast.add({
            severity: 'warn', summary: 'Atencion', detail: 'Ingrese usuario y contraseña', life: 3000
        })
        return;
    }
    loading.value = true;

    try {
        await authStore.login(email.value, password.value)

        toast.add({
            severity: 'success',
            summary: `Bienvenido ${authStore.user?.user_metadata?.name || 'Usuario'}`,
            life: 3000
        })

        setTimeout(() => {
            router.push('/app/dashboard')
        }, 1000)
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error de acceso',
            detail: 'Usuario o contraseña no encontrados',
            life: 3000
        })
    } finally {
        loading.value = false
    }

}


</script>


<template>
    <div class="flex flex-col lg:flex-row min-h-screen w-full overflow-hidden font-sans text-slate-900 bg-bg-light">

        <div
            class="relative w-full lg:w-5/12 xl:w-1/2 flex flex-col justify-between p-8 lg:p-12 xl:p-16 text-white overflow-hidden order-first">

            <div class="absolute inset-0 pointer-events-none"
                style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEpYL3ZL0678dhyKq9LiF4h4HJ8GRV3adHvOr2AYV76aJXAYSMLpbQhL0R1-1FQM8HfWhlICHvdc2dDqmCgwcPG4NqdR-h8ZGvElEdq-ipF6Gp3VTQK3yaxVBUCMcvOYRe4WoYwlHoEezcv-cGpAHmEzxDHPRW_muJDNuWcdKKokcIx24d3p4cP6Jh-ZuhqyWSvK4ulocCGai1y32Kl3lxVzETz8WIokUwUHsozGPG1Zf3iX22OsqRXZuwFkAbl9gjAFktj1aplg'); background-size: cover; background-position: center;">
            </div>

            <div class="absolute inset-0 bg-black/40 pointer-events-none"></div>

            <div class="absolute inset-0 bg-gradient-to-br from-primary/60 to-primary-dark/60 pointer-events-none">
            </div>

            <div class="relative z-10 flex items-center gap-3">
                <div
                    class="w-10 h-10 bg-white rounded flex items-center justify-center text-primary font-black text-xl shadow-md">
                    S
                </div>
                <span class="font-bold text-lg tracking-wider opacity-90">SGIP</span>
            </div>

            <div class="relative z-10 flex flex-col gap-6 my-auto py-12 lg:py-0">
                <h1 class="text-4xl lg:text-5xl xl:text-6xl font-extrabold leading-tight tracking-tight">
                    Sistema de Gestión de <br class="hidden lg:block" />Inventario Patrimonial
                </h1>
                <div class="h-1 w-20 bg-white/30 rounded-full"></div>
                <p class="text-lg lg:text-xl text-white/80 font-medium max-w-lg leading-relaxed">
                    Gestión eficiente, transparente y segura para la administración de los recursos institucionales.
                </p>
            </div>

            <div class="relative z-10 text-sm text-white/50 font-medium">
                © 2026 Tramusa Service. Todos los derechos reservados.
            </div>
        </div>

        <div class="w-full lg:w-7/12 xl:w-1/2 bg-white flex flex-col items-center justify-center p-6 lg:p-12 relative">

            <div class="absolute top-0 right-0 p-8 hidden lg:block">
                <div class="flex gap-4 text-sm font-medium text-slate-400">
                    <a class="hover:text-primary transition-colors" href="#">Ayuda</a>
                    <a class="hover:text-primary transition-colors" href="#">Soporte</a>
                </div>
            </div>

            <div class="w-full max-w-[480px] flex flex-col gap-8">

                <div class="flex flex-col gap-2">
                    <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Bienvenido</h2>
                    <p class="text-slate-500 text-base">Ingrese sus credenciales para acceder al panel.</p>
                </div>

                <div
                    class="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 flex flex-col gap-6">

                    <form @submit.prevent="handleLogin" class="flex flex-col gap-5">

                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-semibold text-slate-700 ml-1" for="username">Usuario /
                                Correo</label>
                            <div class="relative group">
                                <span
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">person</span>
                                <input id="username" v-model="email" type="email"
                                    class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    placeholder="nombre@tramusa.com" required />
                            </div>
                        </div>

                        <div class="flex flex-col gap-1.5">
                            <label class="text-sm font-semibold text-slate-700 ml-1" for="password">Contraseña</label>
                            <div class="relative group">
                                <span
                                    class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors material-symbols-outlined text-[20px]">lock</span>
                                <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'"
                                    class="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium"
                                    placeholder="••••••••" required />

                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer flex items-center justify-center">
                                    <span class="material-symbols-outlined text-[20px]"> {{ showPassword ?
                                        'visibility_off' : 'visibility' }}
                                    </span>
                                </button>
                            </div>

                            <div class="flex justify-end mt-1">
                                <a class="text-sm font-semibold text-primary hover:text-primary-dark transition-colors hover:underline decoration-2 underline-offset-2"
                                    href="#">¿Olvidó su contraseña?</a>
                            </div>
                        </div>

                        <button type="submit" :disabled="loading"
                            class="mt-4 w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed">
                            <span v-if="loading" class="material-symbols-outlined animate-spin">progress_activity</span>
                            <span v-else>Ingresar al Sistema</span>
                            <span v-if="!loading"
                                class="material-symbols-outlined group-hover:translate-x-1 transition-transform text-[18px]">arrow_forward</span>
                        </button>

                    </form>
                </div>

                <div class="text-center">
                    <p class="text-xs text-slate-400">
                        Al ingresar, usted acepta nuestros <a class="underline hover:text-primary" href="#">Términos de
                            Servicio</a> y <a class="underline hover:text-primary" href="#">Política de Privacidad</a>.
                    </p>
                </div>

                <div
                    class="flex items-center justify-center gap-2 py-2 px-4 bg-slate-50 rounded-full border border-slate-100 self-center">
                    <span class="material-symbols-outlined text-green-600 text-[16px]">lock</span> <span
                        class="text-xs font-medium text-slate-500">Conexión Segura SSL 256-bit</span>
                </div>

            </div>
        </div>
    </div>
</template>