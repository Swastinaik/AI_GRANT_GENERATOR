import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface User {
    username: string;
    email: string;
    password?: string;
}

interface AuthState{
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (formdata:any) => Promise<{success: boolean; message?:string}>;
    register: (formdata: any) => Promise<{success: boolean; message?: string}>;
    logout: () => void;
    checkAuth: ()=> Promise<boolean>;
    templateStyle: string| null;
    selectTemplate:(style:string|null)=> void;
}


const AuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            
            user: null,
            isLoading: false,
            isAuthenticated: false,
            register: async (formdata: any)=>{
                set({isLoading: true})
                try {
                    
                    await axios.post(`api/register`, formdata);
                    set({isLoading: false})
                    return { success: true}
                } catch (error) {
                   const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                   set({  user: null, isLoading: false,isAuthenticated: false });
                   
                   return { success: false, message: errorMessage}
                }
            },
            
            
             logout: async () =>{
                try {
                    await axios.post('api/logout',{},{
                        withCredentials: true
                    })
                } catch (error) {
                    console.log("Logout error",error)
                } finally{
                    set({isAuthenticated: false, user: null})
                }
             },
               
            
            login: async (formdata: any) => {
               set({isLoading: true})
                try {
                    const url = 'api/'
                    const formData = new FormData()
                    formData.append('username', formdata.email);
                    formData.append('password', formdata.password);
                    const response = await axios.post(`${url}token`,formData,{
                                            headers: {
                                              'Content-Type': 'application/x-www-form-urlencoded', 
                                            },
                                            withCredentials: true});
                    if(!response.data?.user){
                        throw new Error("Invalid response from server")
                    }
                    
                    set({  isAuthenticated: true,  user: response.data.user, isLoading: false });
                    
                    return { success : true, message: 'Login successfull'}
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                    return { success: false, message: errorMessage}
                }
            },
            checkAuth: async ()=>{
                try {
                    const response = await axios.post('/api/me/',{},{
                        withCredentials: true
                    })
                    console.log('response data',response)
                    if(response.data.username){
                        console.log('from authstore', response.data.username)
                        set({
                            isAuthenticated: true,
                            user: response.data
                        })
                        return true
                    }
                    else{
                        set({
                            isAuthenticated: false,
                            user: null
                        })
                        return false
                    }
                } catch (error: any) {
                    console.log(error)
                    set({
                        isAuthenticated: false,
                        user: null
                    })
                    return false
                }
            },
            templateStyle: null,
            selectTemplate:(template)=>{
                set({templateStyle: template})
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state)=>({
                templateStyle: state.templateStyle
            })
        }
    )
)

export default AuthStore;
