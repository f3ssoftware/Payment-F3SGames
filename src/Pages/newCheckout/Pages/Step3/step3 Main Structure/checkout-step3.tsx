import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStep3Pix from '../pix/checkout-step3-pix';
import CheckoutStep3CreditCard from '../credit card/checkout-step3-creditcard';
import './checkout-step3.css'

import womanImage from '../../../../../Shared/imgs/image 2.svg';
import logoImage from '../../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../../Shared/imgs/Group 71.svg';

export default function CheckoutStep3() {
    const location = useLocation();
    const navigate = useNavigate();
    const initialPaymentMethod = new URLSearchParams(location.search).get('paymentMethod') || 'creditCard';
    const [paymentMethod, setPaymentMethod] = useState<string>(initialPaymentMethod);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('paymentMethod', paymentMethod);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [paymentMethod, location.pathname, navigate]);

    const renderContent = () => {
        switch (paymentMethod) {
            case 'pix':
                return <CheckoutStep3Pix />;
            case 'creditCard':
                return <CheckoutStep3CreditCard />;
            default:
                return null;
        }
    };

    return (
        <div className="p-grid p-nogutter checkout-container">
            <div className="p-col-12 p-md-7 image-container">
                <img src={womanImage} alt="Woman smiling while giving her credit card" className="woman-image" />
            </div>
            <div className="p-col-12 p-md-5 form-container">
                <div className="logo-top-container">
                    <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                </div>
                <div className="payment-step3-method">
                    <h3 className="step3-payment-title">Escolha um método de pagamento</h3>
                    <div className="grid">
                        <div className="col-4 md:col-3" />
                        <div className="payment-step3-options">
                            <div className="payment-step3-option">
                                <input
                                    type="radio"
                                    id="pix"
                                    name="paymentMethod"
                                    value="pix"
                                    checked={paymentMethod === 'pix'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="pix">Pix</label>
                            </div>
                            <div className="payment-step3-option">
                                <input
                                    type="radio"
                                    id="creditCard"
                                    name="paymentMethod"
                                    value="creditCard"
                                    checked={paymentMethod === 'creditCard'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <label htmlFor="creditCard">Cartão de Crédito</label>
                            </div>
                        </div>
                    </div>
                </div>
                {renderContent()}
                <div className="logo-bottom-container">
                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                </div>
            </div>
        </div>
    );
}
