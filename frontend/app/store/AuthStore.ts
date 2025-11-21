import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';



interface AuthState{
    accessToken?: string;
    setAccessToken: (token: string | null) => void;
    templateStyle: string| null;
    selectTemplate:(style:string|null)=> void;
}


const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            setAccessToken: (token) => {
                if (token) {
                    set({ accessToken: token });
                } else {
                    set({ accessToken: undefined });
                }
            },
            templateStyle: null,
            selectTemplate:(template)=>{
                set({templateStyle: template})
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state)=>({
                templateStyle: state.templateStyle,
                accessToken: state.accessToken,
            })
        }
    )
)

export default useAuthStore;
