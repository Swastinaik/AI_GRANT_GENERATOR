import AuthStore from "../AuthStore"

const useAuthStore = ()=> {
    const { 
        accessToken,
        setAccessToken,
        selectTemplate,
        templateStyle,
       
        
    } = AuthStore.getState()

    return {
       accessToken,
        setAccessToken,
        selectTemplate,
        templateStyle,
        
    }
}

export default useAuthStore