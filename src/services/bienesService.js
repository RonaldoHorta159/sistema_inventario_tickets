import { supabase } from "@/supabase";

export const bienesService = {
    async getBienes() {
        const { data, error } = await supabase.from('bienes').select(`*, areas (nombre, responsable_nombre), cat_denominaciones(denominacion, codigo_sbn)`).order('created_at', { ascending: false });

        if (error) throw error

        return data
    },

    async getCatalogos() {
        const [areasResponse, categoriasResponse] = await Promise.all([
            supabase.from('areas').select('*').order('nombre', { ascending: true }),
            supabase.from('cat_denominaciones').select('*').order('denominacion', { ascending: true })
        ]);

        if (areasResponse.error) throw areasResponse.error;
        if (categoriasResponse.error) throw categoriasResponse.error;

        return {
            areas: areasResponse.data,
            categorias: categoriasResponse.data
        }
    },

    async createBien(bien) {
        const {
            data, error
        } = await supabase.from('bienes').insert([bien]).select()

        if (error) throw error;

        return data
    }
}