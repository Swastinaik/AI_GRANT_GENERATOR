import AuthStore from "../AuthStore"

const useAuthStore = ()=> {
    const { 
        user,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
        selectTemplate,
        templateStyle,
        isLoading
        
    } = AuthStore.getState()

    return {
        user,
        isAuthenticated,
        login,
        register,
        logout,
        checkAuth,
        selectTemplate,
        templateStyle,
        isLoading
    }
}

export default useAuthStore