import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckoutStep3Pix from '../pix/checkout-step3-pix';
import CheckoutStep3CreditCard from '../credit card/checkout-step3-creditcard';
import './checkout-step3.css';
import womanImage from '../../../../../Shared/imgs/beautiful_druid_shop 1.svg';
import logoImage from '../../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../../Shared/imgs/Group 71.svg';
import brazilFlag from '../../../../../Shared/imgs/Flag_of_Brazil.svg';
import usFlag from '../../../../../Shared/imgs/Flag_of_the_United_States.svg';
import spainFlag from '../../../../../Shared/imgs/Flag_of_Spain.svg';
import { useTranslation } from 'react-i18next';
import { useCheckout } from '../../../../../context/CheckoutContext';

export default function CheckoutStep3() {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentData } = useCheckout();
    const { t, i18n } = useTranslation();
    const initialPaymentMethod = new URLSearchParams(location.search).get('paymentMethod') || 'creditCard';
    const [paymentMethod, setPaymentMethod] = useState<string>(initialPaymentMethod);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('paymentMethod', paymentMethod);
        navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    }, [paymentMethod, location.pathname, navigate]);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const renderContent = () => {
        switch (paymentMethod) {
            case 'pix':
                return <CheckoutStep3Pix paymentData={paymentData} />;
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
                <div className="top-container">
                    <div className="flags-container">
                        <img src={brazilFlag} alt="Português" className="flag-icon" onClick={() => changeLanguage('pt')} />
                        <img src={usFlag} alt="English" className="flag-icon" onClick={() => changeLanguage('en')} />
                        <img src={spainFlag} alt="Español" className="flag-icon" onClick={() => changeLanguage('es')} />
                    </div>
                    <div className="logo-top-container">
                        <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                    </div>
                </div>
                <div className="payment-step3-method">
                    <h3 className="step3-payment-title">{t('ChoosePaymentMethod')}</h3>
                    <div className="grid">
                        <div className="col-3" />
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
                                <label htmlFor="creditCard">{t('CreditCard')}</label>
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
