import React from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia } from '@mui/material';

const products = [
    { id: 1, name: 'Product 1', description: 'Description of Product 1', price: '$10.00', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Product 2', description: 'Description of Product 2', price: '$20.00', image: 'https://via.placeholder.com/150' },
   
];

const ProductList = () => {
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
        </Container>
    );
};

export default ProductList;