import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, CircularProgress } from '@mui/material';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:5001/gateway/cart/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems(response.data);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await axios.delete(`http://localhost:5001/gateway/cart/${user.id}/${productId}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems(cartItems.filter(item => item.id !== productId));
        } catch (error) {
            console.error('Ошибка при удалении товара из корзины:', error);
        }
    };

    const handleClearCart = async () => {
        try {
            await axios.delete(`http://localhost:5001/gateway/cart/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setCartItems([]);
        } catch (error) {
            console.error('Ошибка при очистке корзины:', error);
        }
    };

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
                            <ProductCard
                                product={product}
                                onRemove={() => handleRemoveItem(product.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            {cartItems.length > 0 && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleClearCart}
                    sx={{ marginTop: 3 }}
                >
                    Очистить корзину
                </Button>
            )}
        </Container>
    );
};

export default CartPage;