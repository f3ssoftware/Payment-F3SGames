import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'primeflex/primeflex.css';
import './checkout-step3-pix.css';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCheckout } from '../../../../../context/CheckoutContext';

interface PaymentData {
    player_id: number;
    donation_value: number;
    customer: {
        name: string;
        email: string;
        cpf: string;
        phone: string;
    };
    address: {
        logradouro: string;
        numero: string;
        complemento?: string;
        bairro: string;
        municipio: string;
        estado: string;
        cep: string;
    };
    paymentMethod: string;
}

export default function CheckoutStep3Pix({ paymentData }: { paymentData: PaymentData }) {
    const [pixCode, setPixCode] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    useEffect(() => {
        const generatePixCode = async () => {
            try {
                const phoneNumber = paymentData.customer.phone.replace(/\D/g, '');
                const formattedPhone = {
                    country: '55', // Código do país do Brasil
                    area: phoneNumber.slice(0, 2), // Primeiros dois dígitos como DDD
                    number: phoneNumber.slice(2), // Restante como número do telefone
                    type: 'mobile',
                };

                const requestData = {
                    player_id: paymentData.player_id,
                    amount: paymentData.donation_value,
                    customer: {
                        name: paymentData.customer.name,
                        email: paymentData.customer.email,
                        tax_id: paymentData.customer.cpf,
                        phone: formattedPhone,
                    },
                    address: {
                        street: paymentData.address.logradouro,
                        number: paymentData.address.numero.toString(), // Certifica-se de que é uma string
                        complement: paymentData.address.complemento || 'N/A', // Valor padrão para complemento
                        locality: paymentData.address.bairro,
                        city: paymentData.address.municipio,
                        region_code: paymentData.address.estado,
                        postal_code: paymentData.address.cep,
                        country: 'BRA',
                    },
                };
                console.log('Sending payment data', requestData);
                const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/pix`, requestData);
                console.log('Response data', response.data);

                setPixCode(response.data.qr_codes[0].text);
                const qrCodeLink = response.data.qr_codes[0].links[0].href; // Obter o primeiro link do array
                setQrCodeUrl(qrCodeLink);
            } catch (error: any) {
                console.error('Error generating PIX code:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                }
            }
        };

        if (paymentData) {
            generatePixCode();
        } else {
            console.error('Payment data is incomplete:', paymentData);
        }
    }, [paymentData]);

    const handlePixCodeClick = () => {
        navigator.clipboard.writeText(pixCode).then(() => {
            toast.success('Código PIX copiado para a área de transferência');
        });
    };

    return (
        <div className="form-content">
            <div className="qr-code-container">
                {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" /> : <p>QR Code não encontrado.</p>}
            </div>
            <div className="p-field">
                <label htmlFor="pixCode">PIX Copia e Cola</label>
                <textarea
                    id="pixCode"
                    value={pixCode}
                    readOnly
                    rows={4}
                    className="custom-textarea"
                    onClick={handlePixCodeClick}
                ></textarea>
            </div>
            <div className="waiting-payment-container">
                <Oval
                    height={23}
                    width={23}
                    color="black"
                    ariaLabel="oval-loading"
                    secondaryColor="gray"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                />
                <p className="waiting-payment">Aguardando Pagamento...</p>
            </div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    );
}
