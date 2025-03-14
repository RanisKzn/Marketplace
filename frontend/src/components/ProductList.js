import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '' });


    useEffect(() => {
        axios.get('https://localhost:7055/gateway/Products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Ошибка при получении данных о продуктах:', error);
            });
    }, []);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewProduct({ name: '', description: '', price: '', image: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            "Id": "",
            [name]: value,
        }));
    };

    const handleAddProduct = () => {
        axios.post('https://localhost:7055/gateway/Products', newProduct,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setProducts([...products, response.data]);
            handleClose();
        })
        .catch(error => {
            console.error('Ошибка при добавлении продукта:', error);
        });
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Our Products
            </Typography>
            <Grid container spacing={4}>
                {products.map((product) => (
                    <Grid item key={product.id} xs={12} sm={6} md={4}>
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
                    </Grid>
                ))}
            </Grid>
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Button variant="contained" color="primary" onClick={handleClickOpen}>
                    Add Product
                </Button>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent>
                    <TextField
                        name="name"
                        label="Name"
                        value={newProduct.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="description"
                        label="Description"
                        value={newProduct.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="price"
                        label="Price"
                        value={newProduct.price}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="image"
                        label="Image URL"
                        value={newProduct.image}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddProduct} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProductList;