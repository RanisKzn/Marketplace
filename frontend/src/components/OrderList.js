import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import OrderItem from '../components/OrderItem';
import { useAuth } from '../context/AuthContext';
import { apiUrl } from "../config";

const OrderList = () => {
    const { user } = useAuth();
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchCart();
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get(apiUrl + `/gateway/orders/${user.id}`, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.data === null) {
                setOrderItems([]);
            }
            else {
                setOrderItems(response.data);
            }
            
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Вашм заказы</Typography>
            {loading ? (
                <CircularProgress />
            ) : orderItems.length === 0 ? (
                <Typography variant="h6">Нет заказов</Typography>
            ) : (
                <Grid container spacing={4}>
                        {orderItems.map((order) => (
                            <Grid item key={order.id} xs={12} sm={6} md={4}>
                                <OrderItem order ={order}  />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>

    );
};

export default OrderList;