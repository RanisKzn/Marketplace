
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import OrderList from "./components/OrderList";
import Login from "./components/Login";
import Register from "./components/Register";
import { Box } from "@mui/material";
import CartPage from "./components/CartPage";
import { useAuth } from "../src/context/AuthContext";

function App() {
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const { user } = useAuth();

    const tabs = [
        { name: "PRODUCTS", path: "/products", component: <ProductList /> },
        ...(user ? [{ name: "ORDERS", path: "/orders", component: <OrderList /> }] : [])
    ];



    const handleTabChange = (event, newValue) => {
        setActiveTabIndex(newValue);
    };

    return (
        <Box
            sx={{
                bgcolor: "white",
                width: "70%",
                margin: "20px auto",
                borderRadius: "16px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                padding: "20px",
            }}
        >
            <Router>
                <Header
                    tabs={tabs}
                    activeTabIndex={activeTabIndex}
                    onTabChange={handleTabChange}
                />
                <Box
                    sx={{
                        p: "10px 10px 5px",
                        bgcolor: "white",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <Routes>
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/orders" element={<OrderList />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/products" />} />
                    </Routes>
                </Box>
            </Router>
        </Box>
    );
}

export default App;