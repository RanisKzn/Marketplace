import React from "react";
import { useNavigate } from "react-router-dom";
import { Toolbar, Tabs, Tab, Button, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";

const Header = ({ tabs, activeTabIndex, onTabChange }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth(); 

    const handleTabChange = (event, newValue) => {
        onTabChange(event, newValue);
        navigate(tabs[newValue].path);
    };

    const handleLogin = () => {
        onTabChange();
        navigate("/login");
    };

    const handleCart = () => {
        onTabChange();
        navigate("/cart");
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <Toolbar>
            {/* Левый блок - вкладки */}
            <Box sx={{ flexGrow: 1 }}>
                <Tabs value={activeTabIndex} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.name} />
                    ))}
                </Tabs>
            </Box>

            {/* Правый блок - кнопки аутентификации */}
            <Box>
                {user ? (
                    <>
                    <Button onClick={handleCart} color="secondary">КОРЗИНА</Button>
                    <Button
                        onClick={handleLogout}
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "darkviolet",
                            "&:hover": { backgroundColor: "purple" },
                            color: "white",
                        }}
                    >
                        ВЫЙТИ
                        </Button>
                    </>
                ) : (
                    <Button
                        onClick={handleLogin}
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: "darkviolet",
                            "&:hover": { backgroundColor: "purple" },
                            color: "white",
                        }}
                    >
                        ВОЙТИ
                        </Button>
                    
                )}
            </Box>
        </Toolbar>
    );
};

export default Header;