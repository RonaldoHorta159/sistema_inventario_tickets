import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { authService } from "@/services/authSerive";



export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const router = useRouter()

  const initializeAuth = async () => {
    const currentUser = await authService.getCurrentUser()
    if (currentUser) {
      user.value = currentUser
    }
  }

  const login = async (email, password) => {
    const { data, error } = await authService.sigIn(email, password)
    if (error) throw error

    if (data.user) {
      user.value = data.user
    }
    return data
  }

  const logOut = async () => {
    await authService.sigOut()
    user.value = null
    router.push({ name: 'login' })
  }

  const isAuthenticated = () => !!user.value

  return {
    user,
    initializeAuth,
    login,
    logOut,
    isAuthenticated
  }
})