import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App';
import OldCheckout from '../Pages/oldCheckout';
import CheckoutStep1 from '../Pages/newCheckout/Pages/Step1/checkout-step1'
import CheckoutStep3Pix from '../Pages/newCheckout/Pages/Step3/pix/checkout-step3-pix'
import CheckoutStep2 from '../Pages/newCheckout/Pages/Step2/checkout-step2'

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<App />} />
        <Route path='/old-checkout' element={<OldCheckout />} />
        <Route path='/checkout-step1' element={<CheckoutStep1 />} />
        <Route path ='/checkout-step2' element={<CheckoutStep2/>}/>
        <Route path ='/checkout-pix' element={<CheckoutStep3Pix/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;