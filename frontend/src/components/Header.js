import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Tabs, Tab, Button, Box } from '@mui/material';

const Header = ({ tabs, activeTabIndex, onTabChange }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleTabChange = (event, newValue) => {
        onTabChange(event, newValue);
        navigate(tabs[newValue].path);
    };

    const handleLogin = () => {
        onTabChange();
        navigate('/login');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        navigate('/');
    };
    return (
        <Toolbar>
            <Box sx={{ flexGrow: 1 }}>
                <Tabs value={activeTabIndex} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
                    {tabs.map((tab, index) => (
                        <Tab key={index} label={tab.name} />
                    ))}
                </Tabs>
            </Box>
            <Box>
                {isAuthenticated ? (
                    <Button
                        onClick={handleLogout}
                        variant="contained"
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
                        LOG OUT
                    </Button>
                ) : (
                    <Button
                        onClick={handleLogin}
                        variant="contained"
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
                        LOG IN
                    </Button>
                )}
            </Box>
        </Toolbar>

    );
    
};

export default Header;