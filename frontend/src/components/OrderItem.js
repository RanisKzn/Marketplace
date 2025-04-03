import React from 'react';
import { Card, CardContent, Typography, Chip } from '@mui/material';

const OrderItem = ({ order }) => {
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('ru-RU', options).format(date);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>
                    Заказ №{order.id.slice(-6).toUpperCase()}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                    Дата заказа: {formatDate( order.orderDate)}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Статус: <Chip label={order.status} color={order.status === "Created" ? "success" : "warning"} />
                </Typography>

                {/* Список товаров */}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Кол-во товаров:{order.items.length}
                </Typography>

                {/* Общая сумма */}
                <Typography variant="h6" align="right" sx={{ mt: 2 }}>
                    Общая сумма: <strong>{order.totalPrice} ₽</strong>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default OrderItem;