<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { bienesService } from '@/services/bienesService';
import Select from 'primevue/select';

const toast = useToast();

// --- ESTADO DEL FORMULARIO ---
const loading = ref(false);
const areas = ref([]);

// Formulario reactivo con los campos solicitados
const form = ref({
    codigo_patrimonial: '',  // Código (agregado por el usuario)
    codigo_interno: '',      // Código Interno
    denominacion: '',        // Denominación (agregado por el usuario)
    caracteristicas: '',     // Características
    marca: '',               // Marca
    modelo: '',              // Modelo
    numero_serie: '',        // Número de Serie
    color: '',               // Color
    estado: 'Bueno',         // Requerido por la DB
    id_area: null,           // Área (Select)
    observaciones: ''        // Opcional
});

const estadosOptions = ref([
    { label: 'Nuevo', value: 'Nuevo' },
    { label: 'Bueno', value: 'Bueno' },
    { label: 'Regular', value: 'Regular' },
    { label: 'Malo', value: 'Malo' },
    { label: 'Obsoleto', value: 'Obsoleto' },
])

// --- CARGA DE DATOS ---
onMounted(async () => {
    try {
        const data = await bienesService.getCatalogos();
        areas.value = data.areas;
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las áreas' });
    }
});

// --- LÓGICA DE ÁREA SELECCIONADA ---
// Busca el área seleccionada para mostrar Responsable, Cargo y DNI
const areaSeleccionada = computed(() => {
    return areas.value.find(a => a.id === form.value.id_area) || null;
});

// --- GUARDADO ---
const handleSave = async () => {
    // Validaciones básicas
    if (!form.value.codigo_patrimonial || !form.value.denominacion || !form.value.id_area) {
        toast.add({ severity: 'warn', summary: 'Atención', detail: 'Complete los campos obligatorios (*)' });
        return;
    }

    loading.value = true;
    try {
        await bienesService.createBien({
            codigo_patrimonial: form.value.codigo_patrimonial,
            codigo_interno: form.value.codigo_interno,
            // Nota: En la DB 'id_denominacion' es FK. 
            // Si el usuario agrega el texto manual, el servicio debe manejar la inserción de la denominación o usar un ID genérico.
            marca: form.value.marca,
            modelo: form.value.modelo,
            numero_serie: form.value.numero_serie,
            color: form.value.color,
            caracteristicas: form.value.caracteristicas,
            estado: form.value.estado,
            id_area: form.value.id_area,
            observaciones: form.value.observaciones
        });

        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Bien registrado correctamente' });
        resetForm();
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message });
    } finally {
        loading.value = false;
    }
};

const resetForm = () => {
    form.value = {
        codigo_patrimonial: '',
        codigo_interno: '',
        denominacion: '',
        caracteristicas: '',
        marca: '',
        modelo: '',
        numero_serie: '',
        color: '',
        estado: 'Bueno',
        id_area: null,
        observaciones: ''
    };
};
</script>

<template>
    <div class="max-w-5xl mx-auto pb-10">
        <div class="bg-white rounded-xl border border-gray-200 shadow-soft overflow-hidden">

            <div class="bg-gray-50 px-8 py-4 border-b border-gray-200 flex items-center gap-3">
                <i class="pi pi-file-edit text-primary text-xl"></i>
                <h2 class="text-lg font-bold text-slate-800 uppercase tracking-wide">Módulo Registrar Bien</h2>
            </div>

            <div class="p-8">
                <form @submit.prevent="handleSave" class="space-y-8">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div class="space-y-4">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Código <span
                                        class="text-primary">*</span></label>
                                <input v-model="form.codigo_patrimonial" type="text"
                                    placeholder="Ingrese código patrimonial"
                                    class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Denominación <span
                                        class="text-primary">*</span></label>
                                <input v-model="form.denominacion" type="text"
                                    placeholder="Nombre o descripción del bien"
                                    class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-bold text-slate-700">Marca</label>
                                    <input v-model="form.marca" type="text" placeholder="Ej: HP"
                                        class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-bold text-slate-700">Modelo</label>
                                    <input v-model="form.modelo" type="text" placeholder="Ej: ProBook 450"
                                        class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Características</label>
                                <textarea v-model="form.caracteristicas" rows="3" placeholder="Detalles técnicos..."
                                    class="w-full rounded-md border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary shadow-sm"></textarea>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Código Interno</label>
                                <input v-model="form.codigo_interno" type="text" placeholder="Opcional"
                                    class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Número de Serie</label>
                                <input v-model="form.numero_serie" type="text" placeholder="S/N del fabricante"
                                    class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-bold text-slate-700">Color</label>
                                    <input v-model="form.color" type="text" placeholder="Ej: Negro"
                                        class="w-full rounded-md border-gray-300 h-10 text-sm focus:border-primary focus:ring-primary shadow-sm" />
                                </div>
                                <div class="flex flex-col gap-1.5">
                                    <label class="text-sm font-bold text-slate-700">Estado</label>
                                    <!-- <select v-model="form.estado"
                                        class="w-full rounded-md border-gray-300 h-10 text-sm shadow-sm">
                                        <option>Nuevo</option>
                                        <option>Bueno</option>
                                        <option>Regular</option>
                                        <option>Malo</option>
                                        <option>Chatarra</option>
                                    </select> -->
                                    <Select v-model="form.estado" :options="estadosOptions" optionLabel="label"
                                        optionValue="value" placeholder="Seleccione estado" />
                                </div>
                            </div>

                            <div class="flex flex-col gap-1.5">
                                <label class="text-sm font-bold text-slate-700">Observaciones (Opcional)</label>
                                <textarea v-model="form.observaciones" rows="3" placeholder="Notas adicionales..."
                                    class="w-full rounded-md border-gray-300 p-3 text-sm focus:border-primary focus:ring-primary shadow-sm"></textarea>
                            </div>
                        </div>
                    </div>

                    <div class="pt-6 border-t border-gray-100">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm font-bold text-slate-700">Área / Oficina <span
                                        class="text-primary">*</span></label>
                                <div class="relative w-full">
                                    <i
                                        class="pi pi-map-marker absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"></i>
                                    <!-- <select v-model="form.id_area"
                                        class="w-full rounded-md border-gray-300 h-12 pl-10 text-sm focus:border-primary focus:ring-primary shadow-sm">
                                        <option :value="null" disabled>Seleccione una ubicación...</option>
                                        <option v-for="area in areas" :key="area.id" :value="area.id">
                                            {{ area.nombre }}
                                        </option>
                                    </select> -->
                                    <Select v-model="form.id_area" :options="areas" optionLabel="nombre"
                                        optionValue="id" placeholder="Seleccione un area" filter
                                        class="w-full h-12 flex items-center pl-8 border-gray-300 shadow-sm" />
                                </div>
                            </div>

                            <div v-if="areaSeleccionada"
                                class="bg-blue-50/50 p-5 rounded-lg border border-blue-100 flex flex-col gap-1 animate-fade">
                                <p class="text-[11px] font-black text-blue-600 uppercase tracking-widest mb-1">
                                    Información del Responsable</p>
                                <div class="flex flex-col gap-0.5">
                                    <p class="text-sm text-slate-700"><strong>Responsable:</strong> {{
                                        areaSeleccionada.responsable_nombre }}</p>
                                    <p class="text-sm text-slate-700"><strong>Cargo:</strong> {{
                                        areaSeleccionada.responsable_cargo }}</p>
                                    <p class="text-sm text-slate-700"><strong>DNI:</strong> {{
                                        areaSeleccionada.responsable_dni }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end pt-6 border-t border-gray-100">
                        <button type="submit" :disabled="loading"
                            class="w-full md:w-auto px-10 py-3.5 rounded-lg bg-primary text-white font-bold text-sm hover:bg-red-700 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                            <i v-if="loading" class="pi pi-spin pi-spinner"></i>
                            <i v-else class="pi pi-check-circle"></i>
                            Registrar Bien
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<style scoped>
.animate-fade {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(5px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>