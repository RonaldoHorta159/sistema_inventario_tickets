import { supabase } from "@/supabase";

export const authService = {

    /**
     * Inicia ssion con correo y contraseña
     * @param {string} email
     * @param {string} password
     * @returns { Object } {data, error}
     */

    async sigIn(email, password) {
        const response = await supabase.auth.signInWithPassword({
            email,
            password
        });

        return response;
    },

    /**
     * @param { string} email
     * @param { string} password
     * @param {Object} metadata- datos adicionales (Nombre , Cargo , etc)
     */

    async signUp(email, password, metadata) {
        const response = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        })
        return response;
    },

    /**
     * Cierra sesion
     * @returns { Object } {data, error}
     */
    async sigOut() {
        return await supabase.auth.signOut();
    },

    /**
     * Obtiene la sesion actual del usuario
     */

    async getCurrentUser() {
        const {
            data: { user }
        } = await supabase.auth.getUser();
        return user;
    }
}