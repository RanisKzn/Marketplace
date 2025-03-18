import React, { useState } from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const ProductCard = ({ product, onProductChange }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [currentProduct, setCurrentProduct] = useState({ ...product });

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
        axios.put(`https://localhost:5001/gateway/Products/${currentProduct.id}`, currentProduct, {
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
        axios.delete(`https://localhost:7055/gateway/Products/${currentProduct.id}`, {
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
                <CardActions>
                    <IconButton aria-label="edit" onClick={handleClickOpenEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" onClick={handleClickOpenDelete}>
                        <DeleteIcon />
                    </IconButton>
                </CardActions>
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
        </>
    );
};

export default ProductCard;