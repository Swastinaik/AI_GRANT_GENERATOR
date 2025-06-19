import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface User {
    username: string;
    email: string;
    password: string;
}

interface AuthState{
    user: User | null;
    isAuthenticated: boolean;
    login: (formdata:any) => Promise<{success: boolean}>;
    register: (formdata: any) => Promise<{success: boolean}>;
    logout: () => void;
}


const AuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            
            user: null,
            
            isAuthenticated: false,
            register: async (formdata: any)=>{
                
                try {
                    await axios.post('/register', formdata);
                    return { success: true}
                } catch (error) {
                   const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                   set({  user: null });
                   return { success: false}
                }
            },
            
            
             logout: () =>{
                set({  isAuthenticated: false, user: null}); // Clear persisted state
             },
               
            
            login: async (formdata: any) => {
               
                try {
                    const formData = new FormData()
                    formData.append('username', formdata.email);
                    formData.append('password', formdata.password);
                    const response = await axios.post('/token',formData,{
                                            headers: {
                                              'Content-Type': 'application/x-www-form-urlencoded', 
                                            },
                                            withCredentials: true});
                    if(!response.data){
                        throw new Error("Error while login")
                    }
                    
                    set({  isAuthenticated: true,  user: null });
                    return { success : true}
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
                    return { success: false}
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            
        }
    )
)

export default AuthStore;