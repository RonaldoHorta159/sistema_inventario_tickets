import { createClient } from '@supabase/supabase-js'

// Imprime esto para depurar si el error persiste
// console.log('URL:', import.meta.env.VITE_SUPABASE_URL); 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Las credenciales de Supabase no están definidas en el archivo .env");
}

export const supabase = createClient(supabaseUrl, supabaseKey)