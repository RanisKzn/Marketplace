import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Container, Typography, Grid, Button, Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Pagination, CircularProgress, Select, MenuItem
} from '@mui/material';
import ProductCard from './ProductCard';
import { useAuth } from "../context/AuthContext";
import { apiUrl } from "../config";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        sortBy: 'price',
        order: 'desc'
    });
    const [openAdd, setOpenAdd] = useState(false);
    const [newProduct, setNewProduct] = useState({ id: '', name: '', description: '', price: '', image: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const productsPerPage = 9;
    const { user } = useAuth();
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, [filters, currentPage]);

    const fetchProducts = () => {
        setLoading(true);
        const query = new URLSearchParams({
            search: filters.search,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            sortBy: filters.sortBy,
            order: filters.order,
            page: currentPage,
            limit: productsPerPage
        }).toString();

        axios.get(`${apiUrl}/gateway/Products?${query}`)
            .then(response => {
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

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleResetFilters = () => {
        setFilters({
            search: '',
            minPrice: '',
            maxPrice: '',
            sortBy: 'price',
            order: 'desc'
        });
        setCurrentPage(1);
    };

    const handleAddProduct = async () => {
        try {
            let imageUrl = newProduct.image;

            // Проверка на наличие файла изображения
            if (imageFile) {
                const formData = new FormData();
                formData.append('file', imageFile);

                const uploadRes = await axios.post(`${apiUrl}/gateway/Products/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                imageUrl = uploadRes.data.imageUrl;
            }

            // Отправка данных продукта
            const res = await axios.post(`${apiUrl}/gateway/Products`, {
                ...newProduct,
                image: imageUrl,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Обновление состояния и закрытие формы
            setProducts([...products, res.data]);
            handleCloseAdd();

        } catch (err) {
            console.error('Ошибка при добавлении продукта:', err);
            // Можно добавить уведомление для пользователя об ошибке
        }
    };

    const handleClickOpenAdd = () => {
        setOpenAdd(true);
    };

    const handleCloseAdd = () => {
        setOpenAdd(false);
        setNewProduct({ name: '', description: '', price: '', image: '' });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    

    return (
        <Container>
            <Typography variant="h4" gutterBottom>Наши товары</Typography>

            {/* Фильтры */}
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: "20px" }}>
                <Grid item xs={12} sm={12}>
                    <TextField
                        name="search"
                        label="Поиск"
                        value={filters.search}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TextField
                        name="minPrice"
                        label="Мин. цена"
                        type="number"
                        value={filters.minPrice}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={2}>
                    <TextField
                        name="maxPrice"
                        label="Макс. цена"
                        type="number"
                        value={filters.maxPrice}
                        onChange={handleFilterChange}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} fullWidth>
                        <MenuItem value="price">Цена</MenuItem>
                        <MenuItem value="name">Название</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6} sm={2}>
                    <Select name="order" value={filters.order} onChange={handleFilterChange} fullWidth>
                        <MenuItem value="asc">По возрастанию</MenuItem>
                        <MenuItem value="desc">По убыванию</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button variant="contained" color="primary" onClick={handleResetFilters} fullWidth>Сбросить</Button>
                </Grid>
            </Grid>

            {/* Товары */}
            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={4} >
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <ProductCard product={product} />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Кнопка "Добавить товар" */}
            {user && user.roles.includes("Admin")  && (
                <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleClickOpenAdd}
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: 'darkviolet',
                            '&:hover': { backgroundColor: 'purple' },
                            color: 'white'
                        }}
                    >
                        Добавить товар
                    </Button>
                </Grid>
            )}

            {/* Форма добавления товара */}
            <Dialog open={openAdd} onClose={handleCloseAdd}>
                <DialogTitle>Добавить товар</DialogTitle>
                <DialogContent>
                    <TextField name="name" label="Название" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} fullWidth />
                    <TextField name="description" label="Описание" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} fullWidth />
                    <TextField name="price" label="Цена" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} fullWidth />
                    <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: '1rem' }} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAdd} color="primary">Отмена</Button>
                    <Button onClick={handleAddProduct} color="primary">Добавить</Button>
                </DialogActions>
            </Dialog>

            {/* Пагинация */}
            <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} shape="rounded" color="secondary" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} />
        </Container>
    );
};

export default ProductList;
