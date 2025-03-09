import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, Tabs, Tab } from '@mui/material';

const Header = ({ tabs, activeTabIndex, onTabChange }) => {
    const navigate = useNavigate();

    const handleTabChange = (event, newValue) => {
        onTabChange(event, newValue);
        navigate(tabs[newValue].path); 
    };
  return (
      <Toolbar>
          <Tabs value={activeTabIndex} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
          {tabs.map((tab, index) => (
              <Tab key={index} label={tab.name}/>
          ))}
        </Tabs>
      </Toolbar>
  );
};

export default Header;