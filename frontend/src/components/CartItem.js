import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material'; import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const CartItem = ({ product, onProductChange }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ ...product });
    const [cartSuccess, setCartSuccess] = useState(false);
    const { user } = useAuth();


    return (
        <>
            <Card>
                <CardMedia
                    component="img"
                    height="140"
                    image={product.image}
                    alt={product.name}
                />
                <CardContent>
                    <Typography variant="h5" component="div">
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.description}
                    </Typography>
                    <Typography variant="h6" component="div">
                        {product.price}
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
};

export default CartItem;