import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar, Alert } from '@mui/material'; import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductCard = ({ product, onProductChange }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ ...product });
    const [cartSuccess, setCartSuccess] = useState(false);
    const { user } = useAuth(); 

    const handleClickOpenEdit = () => {
        setCurrentProduct({ ...product });
        setOpenEdit(true);
    };

    const handleCloseEdit = () => {
        setOpenEdit(false);
    };

    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleEditProduct = () => {
        axios.put(apiUrl+`/gateway/Products/${currentProduct.id}`, currentProduct, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                onProductChange(response.data);
                handleCloseEdit();
            })
            .catch(error => {
                console.error('Ошибка при редактировании продукта:', error);
            });
    };

    const handleDeleteProduct = () => {
        axios.delete(apiUrl+`/gateway/Products/${currentProduct.id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(() => {
                onProductChange(currentProduct.id);
                handleCloseDelete();
            })
            .catch(error => {
                console.error('Ошибка при удалении продукта:', error);
            });
    };

    // Добавление товара в корзину
    const handleAddToCart = () => {
        if (!user) return;

        axios.post(apiUrl + `/gateway/cart/`, { userId: user.id, productId: product.id, quantity: 1 }, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
            .then(() => {
                setCartSuccess(true); // Показ уведомления об успешном добавлении
            })
            .catch(error => {
                console.error('Ошибка при добавлении в корзину:', error);
            });
    };

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
                {user && user.roles.includes("Admin") &&  (
                    <CardActions>
                        <IconButton aria-label="edit" onClick={handleClickOpenEdit}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="delete" onClick={handleClickOpenDelete}>
                            <DeleteIcon />
                        </IconButton>
                    </CardActions>
                )}
                {user && (
                    <IconButton aria-label="add to cart" onClick={handleAddToCart} color="primary">
                        <ShoppingCartIcon />
                    </IconButton>
                )}
            </Card>
            <Dialog open={openEdit} onClose={handleCloseEdit}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        name="name"
                        label="Name"
                        value={currentProduct.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        value={currentProduct.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="price"
                        label="Price"
                        value={currentProduct.price}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="image"
                        label="Image URL"
                        value={currentProduct.image}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditProduct} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDelete} onClose={handleCloseDelete}>
                <DialogTitle>Delete Product</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteProduct} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={cartSuccess} autoHideDuration={3000} onClose={() => setCartSuccess(false)}>
                <Alert onClose={() => setCartSuccess(false)} severity="success">
                    Товар добавлен в корзину!
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProductCard;