import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

// Создаем контекст
const AuthContext = createContext(null);

// Хук для удобного использования контекста
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }
    return context;
};

// Провайдер контекста
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Проверяем токен при загрузке страницы
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({
                    username: decoded.sub,
                    roles: decoded.actort ? (Array.isArray(decoded.actort) ? decoded.actort : [decoded.actort]) : [],
                    id: decoded.unique_name,
                });
            } catch (error) {
                console.error("Ошибка декодирования токена:", error);
                localStorage.removeItem("token");
            }
        }
    }, []);

    // Функция входа
    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem("token", token);
            setUser({
                username: decoded.sub,
                roles: decoded.role ? (Array.isArray(decoded.role) ? decoded.role : [decoded.role]) : [],
            });
        } catch (error) {
            console.error("Ошибка декодирования токена при входе:", error);
        }
    };

    // Функция выхода
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};