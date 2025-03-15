import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Pagination, CircularProgress } from '@mui/material';
import ProductCard from './ProductCard';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [openAdd, setOpenAdd] = useState(false);
    const [newProduct, setNewProduct] = useState({ Id: '', name: '', description: '', price: '', image: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 9;

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = (page) => {
        setLoading(true);
        axios.get(`https://localhost:7055/gateway/Products?page=${page}&limit=${productsPerPage}`)
            .then(response => {
                console.log('Server response:', response.data); 
                const { items, totalPages } = response.data;
                setProducts(items);
                setTotalPages(totalPages);
            })
            .catch(error => {
                console.error('Ошибка при получении данных о продуктах:', error);
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
        setNewProduct({ Id: '', name: '', description: '', price: '', image: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProduct((prevProduct) => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleAddProduct = () => {
        axios.post('https://localhost:7055/gateway/Products', newProduct, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                setProducts([...products, response.data]);
                handleCloseAdd();
            })
            .catch(error => {
                console.error('Ошибка при добавлении продукта:', error);
            });
    };

    const handleProductChange = (updatedProductOrId) => {
        if (updatedProductOrId) {
            if (typeof updatedProductOrId === 'object') {
                setProducts(products.map(product => product.id === updatedProductOrId.id ? updatedProductOrId : product));
            } else {
                setProducts(products.filter(product => product.id !== updatedProductOrId));
            }
        }
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                Our Products
            </Typography>
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <ProductCard
                                product={product}
                                onProductChange={handleProductChange}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleClickOpenAdd}
                    sx={{
                        mt: 3,
                        mb: 2,
                        backgroundColor: 'darkviolet',
                        '&:hover': {
                            backgroundColor: 'purple',
                        },
                        color: 'white'
                    }}
                >
                    Add Product
                </Button>
            </Grid>
            <Dialog open={openAdd} onClose={handleCloseAdd}>
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
                    <Button onClick={handleCloseAdd} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddProduct} color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="secondary"
                style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}
            />
        </Container>
    );
};

export default ProductList;
