﻿import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import CartItem from '../components/CartItem';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from "../config";

const CartPage = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiUrl +`/gateway/Cart/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems(response.data.products);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            setCartItems(cartItems.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины:', error);
        }
    };
    const handleUpdateItem = async (productId, newQuantity) => {
        try {
            setCartItems(prevCartItems =>
                prevCartItems.map(item =>
                    item.id === productId ? { ...item, quantity: item.quantity + newQuantity } : item
                )
            );
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await axios.delete(apiUrl +`/gateway/cart/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems([]);
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
        }
    };
    const handleCheckout = () => {
        if (!user) return;

        const orderDtos = cartItems.map(item => ({
            ProductId: item.id,
            Quantity: item.quantity,
            Price: item.price
        }));

        axios.post(apiUrl + `/gateway/orders/${user.id}`, orderDtos , {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(() => {
                handleClearCart(); // Очистить корзину после заказа
                setOrderSuccess(true); 
            })
            .catch(error => {
                console.error('Ошибка при оформлении заказа:', error);
            });
    };
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Ваша корзина</Typography>
            {loading ? (
                <CircularProgress />
            ) : cartItems.length === 0 ? (
                <Typography variant="h6">Корзина пуста</Typography>
            ) : (
                <Grid container spacing={4}>
                    {cartItems.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <CartItem product={product} onUpdate={handleUpdateItem} onRemove={handleRemoveItem} />
                        </Grid>
                    ))}
                </Grid>
            )}
            {cartItems.length > 0 && (
                <Grid container justifyContent="space-between" alignItems="center" spacing={2} sx={{ mt: 3 }}>
                    <Grid item>
                        <Button variant="contained" color="secondary" onClick={handleClearCart}>
                            Очистить корзину
                        </Button>
                    </Grid>
                    <Grid item>
                        <Typography variant="h5" align="center">
                            Общая сумма: <strong>{totalPrice} ₽</strong>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button variant="contained" color="primary" onClick={handleCheckout}>
                            Оформить заказ
                        </Button>
                    </Grid>
                </Grid>
            )}
            <Snackbar open={orderSuccess} autoHideDuration={3000} onClose={() => setOrderSuccess(false)}>
                <Alert onClose={() => setOrderSuccess(false)} severity="success">
                    Заказ успешно оформлен!
                </Alert>
            </Snackbar>
        </Container>

    );
};

export default CartPage;