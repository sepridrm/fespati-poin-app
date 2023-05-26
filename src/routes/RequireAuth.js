import { Navigate } from "react-router-dom"
import { UseAuth } from "./useAuth"

export const RequireAuth = ({ children }) => {
    const auth = UseAuth()

    if(!auth.user){
        return <Navigate to='/login' />
    }

    return children
}