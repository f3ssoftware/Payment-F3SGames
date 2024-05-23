import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import Checkout from '../Pages/oldCheckout';
import OldCheckout from '../Pages/oldCheckout';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/checkout' element={<OldCheckout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;