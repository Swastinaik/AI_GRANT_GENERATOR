import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';



interface AuthState{
    accessToken?: string;
    setAccessToken: (token: string | null) => void;
    templateStyle: string| null;
    selectTemplate:(style:string|null)=> void;
    fundersDetail?: string;
    setFundersDetail: (detail: string) => void
}


const useAuthStore = create<AuthState>()(
    persist(
        (set, get) =>({
            templateStyle: null,
            setAccessToken: (token) => {
                if (token) {
                    set({ accessToken: token });
                } else {
                    set({ accessToken: undefined });
                }
            },
            selectTemplate:(template)=>{
                set({templateStyle: template})
            },
            setFundersDetail: (detail) => {
                set({fundersDetail: detail})
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => sessionStorage),
            partialize: (state)=>({
                templateStyle: state.templateStyle,
                accessToken: state.accessToken,
                fundersDetail: state.fundersDetail
            })
        }
    )
)

export default useAuthStore;
