<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { bienesService } from '@/services/bienesService';
import { useToast } from 'primevue/usetoast';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';


const toast = useToast();
const loading = ref(false);

const bienes = ref([])
const areas = ref([])
const conteoAreas = ref([])
const filters = ref({
    report_type: 'codigo',
    id_area: '',
    search: ''
})

const totalItems = ref(0)
const totalNuevos = ref(0)
const totalMantenimiento = ref(0)

onMounted(async () => {
    await loadCatalogos();
    await fetchBienes();
})

watch(() => [filters.value.id_area, filters.value.search], () => {
    setTimeout(fetchBienes, 300)
}, { deep: true })

async function loadCatalogos() {
    try {
        const data = await bienesService.getCatalogos();
        areas.value = data.areas;
    } catch (e) {
        console.error(e)
    }
}

async function fetchBienes() {
    loading.value = true;

    try {
        const activeFilters = {}
        if (filters.value.report_type === 'codigo') {
            activeFilters.search = filters.value.search
        } else if (filters.value.report_type === 'area_codigo') {
            activeFilters.id_area = filters.value.id_area
            activeFilters.search = filters.value.search
        } else if (filters.value.report_type === 'area') {
            activeFilters.id_area = filters.value.id_area
        }

        const data = await bienesService.getBienes(activeFilters)
        bienes.value = data
        if (filters.value.report_type === 'conteo') {
            generarConteoPorAreas(data)
        }

        calculateStats(data)
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el inventario' })
    } finally {
        loading.value = false;
    }
}

function generarConteoPorAreas(data) {
    const conteoMap = {}

    areas.value.forEach(a => {
        conteoMap[a.nombre] = {
            nombre: a.nombre, total: 0, responsable: a.responsable_nombre
        }
    })

    data.forEach(bien => {
        const nomreArea = bien.areas?.nombre
        if (nombreArea && conteoMap[nombreArea]) {
            conteoMap[nombreArea].total++
        }
    })

    conteoAreas.value = Object.value = Object.values(conteoMap).sort((a, b) => b.total - a.total)


}

function calculateStats(data) {
    totalItems.value = data.length
    totalNuevos.value = data.filter(b => b.estado === 'Nuevo' || b.estado === 'Bueno').length
    totalMantenimiento.value = data.filter(b => b.estado === 'Malo' || b.estado === 'Chatarra')
}

const reportTitle = computed(() => {
    switch (filters.value.report_type) {
        case 'codigo': return 'Búsqueda Directa (Patrimonial)';
        case 'area_codigo': return 'Búsqueda Cruzada (Área + Serie/Cód)';
        case 'area': return 'Inventario Detallado por Área';
        case 'conteo': return 'Consolidado General por Áreas';
        default: return 'Inventario General';
    }
})

</script>
<template>
    <div class="flex flex-col lg:flex-row gap-6 p-2 h-full">

        <aside class="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">

            <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-5">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-search text-primary text-xl"></i>
                    <h3 class="font-bold text-slate-800">Tipo de Búsqueda</h3>
                </div>
                <div class="flex flex-col gap-2">

                    <label class="group cursor-pointer">
                        <input v-model="filters.report_type" value="codigo" class="peer sr-only" type="radio" />
                        <div
                            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-red-50 peer-checked:bg-red-50 peer-checked:border-primary transition-all">
                            <span class="font-medium text-sm text-slate-700 peer-checked:text-primary">1. Por Cód.
                                Patrimonial</span>
                            <i
                                class="pi pi-check-circle text-primary opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                    </label>

                    <label class="group cursor-pointer">
                        <input v-model="filters.report_type" value="area_codigo" class="peer sr-only" type="radio" />
                        <div
                            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-red-50 peer-checked:bg-red-50 peer-checked:border-primary transition-all">
                            <span class="font-medium text-sm text-slate-700 peer-checked:text-primary">2. Por Área y
                                Cód/Serie</span>
                            <i
                                class="pi pi-check-circle text-primary opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                    </label>

                    <label class="group cursor-pointer">
                        <input v-model="filters.report_type" value="area" class="peer sr-only" type="radio" />
                        <div
                            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-red-50 peer-checked:bg-red-50 peer-checked:border-primary transition-all">
                            <span class="font-medium text-sm text-slate-700 peer-checked:text-primary">3. Detalle por
                                Área</span>
                            <i
                                class="pi pi-check-circle text-primary opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                    </label>

                    <label class="group cursor-pointer">
                        <input v-model="filters.report_type" value="conteo" class="peer sr-only" type="radio" />
                        <div
                            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-primary/50 hover:bg-red-50 peer-checked:bg-red-50 peer-checked:border-primary transition-all">
                            <span class="font-medium text-sm text-slate-700 peer-checked:text-primary">4. Conteo
                                Consolidado</span>
                            <i
                                class="pi pi-check-circle text-primary opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                        </div>
                    </label>

                </div>
            </div>

            <div class="bg-white rounded-xl shadow-soft border border-gray-100 p-5 flex-1">
                <div class="flex items-center gap-2 mb-4">
                    <i class="pi pi-sliders-v text-primary text-xl"></i>
                    <h3 class="font-bold text-slate-800">Parámetros</h3>
                </div>

                <div class="space-y-4">
                    <div v-if="filters.report_type === 'conteo'"
                        class="p-4 bg-gray-50 rounded border border-gray-200 text-sm text-gray-500 text-center">
                        <i class="pi pi-chart-pie text-2xl mb-2"></i>
                        <p>Mostrando el resumen total del sistema. No requiere filtros adicionales.</p>
                    </div>

                    <div v-if="filters.report_type === 'area_codigo' || filters.report_type === 'area'">
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Área /
                            Oficina</label>
                        <div class="relative">
                            <select v-model="filters.id_area"
                                class="block w-full rounded-lg border-gray-300 bg-gray-50 text-sm text-slate-700 focus:border-primary focus:ring-primary h-10 px-3 appearance-none">
                                <option value="">Seleccione un área...</option>
                                <option v-for="area in areas" :key="area.id" :value="area.id">{{ area.nombre }}</option>
                            </select>
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                <i class="pi pi-chevron-down text-xs"></i>
                            </div>
                        </div>
                    </div>

                    <div v-if="filters.report_type === 'codigo' || filters.report_type === 'area_codigo'">
                        <label class="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                            {{ filters.report_type === 'codigo' ? 'Código Patrimonial' : 'Código o N° Serie' }}
                        </label>
                        <div class="relative">
                            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                <i class="pi pi-search"></i>
                            </span>
                            <input v-model="filters.search"
                                class="block w-full rounded-lg border-gray-300 bg-gray-50 text-sm text-slate-700 pl-9 focus:border-primary focus:ring-primary h-10 px-3"
                                :placeholder="filters.report_type === 'codigo' ? 'Ej: 74080500-0001' : 'Buscar...'"
                                type="text" />
                        </div>
                    </div>

                    <hr class="border-gray-100 my-4" />

                    <button
                        class="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2.5 px-4 rounded-lg shadow-sm transition-all active:scale-[0.98]">
                        <i class="pi pi-download"></i>
                        <span>Exportar Resultado</span>
                    </button>
                </div>
            </div>
        </aside>

        <div class="flex-1 flex flex-col min-w-0">

            <div class="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div class="flex items-center gap-2">
                    <span class="text-sm font-semibold text-gray-500">Visualizando:</span>
                    <span
                        class="px-2.5 py-0.5 rounded-full bg-red-50 text-primary text-xs font-bold border border-primary/20 uppercase">
                        {{ reportTitle }}
                    </span>
                    <span class="text-xs text-gray-400">• {{ filters.report_type === 'conteo' ? conteoAreas.length :
                        totalItems }} resultados</span>
                </div>
                <div class="flex items-center gap-2">
                    <button @click="fetchBienes"
                        class="text-gray-400 hover:text-primary hover:bg-red-50 p-2 rounded transition-colors"
                        title="Actualizar">
                        <i class="pi pi-refresh text-lg"></i>
                    </button>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden flex flex-col flex-1">

                <DataTable v-if="filters.report_type !== 'conteo'" :value="bienes" paginator :rows="8"
                    :loading="loading" tableStyle="min-width: 50rem"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
                    class="p-datatable-sm custom-table">

                    <template #empty>
                        <div class="p-8 text-center text-gray-500">
                            <i class="pi pi-inbox text-4xl mb-2 opacity-50"></i>
                            <p>No hay registros que coincidan con la búsqueda.</p>
                        </div>
                    </template>

                    <Column field="codigo_patrimonial" header="CÓDIGO" sortable>
                        <template #body="slotProps">
                            <span class="font-mono font-bold text-slate-700">{{ slotProps.data.codigo_patrimonial
                            }}</span>
                            <div class="text-[10px] text-gray-400">S/N: {{ slotProps.data.numero_serie || 'N/A' }}</div>
                        </template>
                    </Column>

                    <Column field="cat_denominaciones.denominacion" header="DESCRIPCIÓN" sortable>
                        <template #body="slotProps">
                            <span class="font-medium text-slate-800">{{ slotProps.data.cat_denominaciones?.denominacion
                                || slotProps.data.denominacion }}</span>
                            <div class="text-xs text-gray-500">{{ slotProps.data.marca }} {{ slotProps.data.modelo }}
                            </div>
                        </template>
                    </Column>

                    <Column field="areas.nombre" header="UBICACIÓN" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <i class="pi pi-building text-gray-300"></i>
                                <span class="text-sm text-slate-600">{{ slotProps.data.areas?.nombre || 'Sin Asignar'
                                }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="estado" header="ESTADO" sortable>
                        <template #body="slotProps">
                            <span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold border"
                                :class="{
                                    'bg-green-100 text-green-800 border-green-200': slotProps.data.estado === 'Nuevo' || slotProps.data.estado === 'Bueno',
                                    'bg-yellow-100 text-yellow-800 border-yellow-200': slotProps.data.estado === 'Regular',
                                    'bg-red-100 text-red-800 border-red-200': slotProps.data.estado === 'Malo' || slotProps.data.estado === 'Chatarra'
                                }">
                                {{ slotProps.data.estado }}
                            </span>
                        </template>
                    </Column>
                </DataTable>

                <DataTable v-else :value="conteoAreas" paginator :rows="10" :loading="loading"
                    class="p-datatable-sm custom-table">

                    <Column field="nombre" header="DEPARTAMENTO / ÁREA" sortable>
                        <template #body="slotProps">
                            <div class="flex items-center gap-3">
                                <div
                                    class="w-8 h-8 rounded bg-gray-50 border border-gray-200 flex items-center justify-center">
                                    <i class="pi pi-briefcase text-gray-500"></i>
                                </div>
                                <span class="font-bold text-slate-700">{{ slotProps.data.nombre }}</span>
                            </div>
                        </template>
                    </Column>

                    <Column field="responsable" header="RESPONSABLE" sortable>
                        <template #body="slotProps">
                            <span class="text-sm text-gray-600">{{ slotProps.data.responsable }}</span>
                        </template>
                    </Column>

                    <Column field="total" header="CANTIDAD DE BIENES" sortable alignFrozen="right">
                        <template #body="slotProps">
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-black"
                                    :class="slotProps.data.total > 0 ? 'text-primary' : 'text-gray-300'">
                                    {{ slotProps.data.total }}
                                </span>
                                <span class="text-xs text-gray-400">ítems</span>
                            </div>
                        </template>
                    </Column>
                </DataTable>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <i class="pi pi-box text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-semibold">Total Bienes Consultados</p>
                        <p class="text-xl font-bold text-slate-800">{{ totalItems }}</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <i class="pi pi-check-circle text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-semibold">En Buen Estado</p>
                        <p class="text-xl font-bold text-slate-800">{{ totalNuevos }}</p>
                    </div>
                </div>
                <div class="bg-white rounded-lg border border-gray-100 p-4 shadow-sm flex items-center gap-4">
                    <div class="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <i class="pi pi-exclamation-triangle text-xl"></i>
                    </div>
                    <div>
                        <p class="text-xs text-gray-500 uppercase font-semibold">Requieren Revisión</p>
                        <p class="text-xl font-bold text-slate-800">{{ totalMantenimiento }}</p>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style>
.custom-table .p-datatable-header {
    background: transparent;
    border: none;
}

.custom-table .p-datatable-thead>tr>th {
    background: #f8fafc;
    color: #64748b;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
}

.custom-table .p-datatable-tbody>tr {
    transition: background-color 0.2s;
}

.custom-table .p-datatable-tbody>tr:hover {
    background-color: #fef2f2;
}

.custom-table .p-datatable-tbody>tr>td {
    padding: 1rem;
    border-bottom: 1px solid #f1f5f9;
}

.custom-table .p-paginator {
    border-top: 1px solid #e2e8f0;
    padding: 1rem;
}
</style>