import React, { useState } from 'react';
import 'primeflex/primeflex.css';
import './checkout-step3-pix.css';

import womanImage from '../../../../../Shared/imgs/image 2.svg';
import logoImage from '../../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../../Shared/imgs/Group 71.svg';

export default function CheckoutStep3Pix() {
    const [paymentMethod, setPaymentMethod] = useState<string>('pix');
    const [pixCode, setPixCode] = useState('');

    return (
        <div className="p-grid p-nogutter checkout-container">
            <div className="p-col-12 p-md-7 image-container">
                <img src={womanImage} alt="Woman smiling while giving her credit card" className="woman-image" />
            </div>
            <div className="p-col-12 p-md-5 form-container">
                <div className="logo-top-container">
                    <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                </div>
                <div className="form-content">
                    <div className="payment-method">
                        <label>Escolha um método de pagamento</label>
                        <div className="payment-option">
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
                        <div className="payment-option">
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
                    <div className="qr-code-container">
                        {/* QR code will be displayed here */}
                    </div>
                    <div className="p-field">
                        <label htmlFor="pixCode">PIX Copia e Cola</label>
                        <textarea id="pixCode" value={pixCode} onChange={(e) => setPixCode(e.target.value)} rows={4} className="custom-textarea"></textarea>
                    </div>
                    <p className="waiting-payment">Aguardando Pagamento...</p>
                    <div className="logo-bottom-container">
                        <img src={companyLogo} alt="Company Logo" className="company-logo" />
                    </div>
                </div>
            </div>
        </div>
    );
}
