import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UseTokenStore = {
    token: string
    setToken: (token: string) => void
}

const useTokenStore = create(
    persist<UseTokenStore>(
        (set) => ({
            token: "",
            setToken: (val) => set({ token: val })
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export default useTokenStore