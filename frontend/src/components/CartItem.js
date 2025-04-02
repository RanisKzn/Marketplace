import React from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, CardActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config";

const CartItem = ({ product, onUpdate, onRemove }) => {
    const { user } = useAuth();

    const handleUpdateQuantity = (newQuantity) => {
        if (!user) return;

        axios.post(apiUrl + `/gateway/cart/`, {
            userid: user.id,
            productId: product.id,
            quantity: newQuantity
        }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            onUpdate(product.id, newQuantity);
        })
        .catch(error => {
            console.error('Ошибка при обновлении количества:', error);
        });
    };

    const handleRemoveFromCart = () => {
        if (!user) return;
        
        axios.delete(apiUrl + `/gateway/cart/${user.id}/${product.id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        .then(() => {
            onRemove(product.id);
        })
        .catch(error => {
            console.error('Ошибка при удалении товара из корзины:', error);
        })
    
    };

    return (
        <Card>
            <CardMedia
                component="img"
                height="140"
                image={product.image}
                alt={product.name}
            />
            <CardContent>
                <Typography variant="h5">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="h6">
                    {product.price} ₽ × {product.quantity} = <strong>{product.price * product.quantity} ₽</strong>
                </Typography>
            </CardContent>
            <CardActions>
                <IconButton aria-label="decrease" onClick={() => handleUpdateQuantity(-1)} color="primary">
                    <RemoveIcon />
                </IconButton>
                <Typography>{product.quantity}</Typography>
                <IconButton aria-label="increase" onClick={() => handleUpdateQuantity(1)} color="primary">
                    <AddIcon />
                </IconButton>
                <IconButton aria-label="remove from cart" onClick={handleRemoveFromCart} color="secondary">
                    <DeleteIcon />
                </IconButton>
            </CardActions>

        </Card>
    );
};

export default CartItem;