import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    const login = (data) => {
        setUser(data);
        navigate("/admin", { replace: true });
    };

    const logout = () => {
        setUser(null);
        navigate("/login", { replace: true });
    };

    return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const UseAuth = () => {
    return useContext(AuthContext); 
};
