import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import OldCheckout from '../Pages/oldCheckout';
import CheckoutStep1 from '../Pages/newCheckout/Pages/Step1/checkout-step1'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/old-checkout' element={<OldCheckout />} />
        <Route path='/checkout-step1' element={<CheckoutStep1 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;