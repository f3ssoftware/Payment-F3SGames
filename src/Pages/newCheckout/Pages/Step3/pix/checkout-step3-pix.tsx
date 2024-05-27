import React, { useState } from 'react';
import 'primeflex/primeflex.css';
import './checkout-step3-pix.css';

export default function CheckoutStep3Pix() {
    const [pixCode, setPixCode] = useState('');

    return (
        <div className="form-content">
            <div className="qr-code-container">
                {/* QR code will be displayed here */}
            </div>
            <div className="p-field">
                <label htmlFor="pixCode">PIX Copia e Cola</label>
                <textarea id="pixCode" value={pixCode} onChange={(e) => setPixCode(e.target.value)} rows={4} className="custom-textarea"></textarea>
            </div>
            <p className="waiting-payment">Aguardando Pagamento...</p>
        </div>
    );
}
