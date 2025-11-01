import AuthContext from "@/components/AuthContext";
import { useContext } from "react";

const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (context === undefined) throw new Error("useAuthContext must be inside of AuthProviderContext")
    return context
}

export default useAuthContext