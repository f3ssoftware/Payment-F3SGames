import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';

import CheckoutStep1 from '../Pages/newCheckout/Pages/Step1/checkout-step1';
import CheckoutStep2 from '../Pages/newCheckout/Pages/Step2/checkout-step2';
import CheckoutStep3Pix from '../Pages/newCheckout/Pages/Step3/pix/checkout-step3-pix';

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/checkout' element={<CheckoutStep1 />} />
        <Route path='/checkout/requirements' element={<CheckoutStep2 />} />
        <Route path='/checkout/payment' element={<CheckoutStep3Pix />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
