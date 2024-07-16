import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'primeflex/primeflex.css';
import './checkout-step3-pix.css';
import { Oval } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';

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
}

interface QRCodeLink {
  rel: string;
  href: string;
  media: string;
  type: string;
}

export default function CheckoutStep3Pix({ paymentData }: { paymentData: PaymentData }) {
  const { t } = useTranslation();
  const [pixCode, setPixCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const generatePixCode = async () => {
      setLoading(true);
      try {
        const phoneNumber = paymentData.customer.phone.replace(/\D/g, '');
        const formattedPhone = {
          type: 'MOBILE',
          country: '55',
          area: phoneNumber.slice(0, 2),
          number: phoneNumber.slice(2),
        };

        const requestData = {
          player_id: paymentData.player_id,
          amount: paymentData.donation_value,
          customer: {
            name: paymentData.customer.name,
            email: paymentData.customer.email,
            tax_id: paymentData.customer.cpf,
            phones: [formattedPhone],
          },
          address: {
            street: paymentData.address.logradouro,
            number: paymentData.address.numero.toString(),
            complement: paymentData.address.complemento || 'N/A',
            locality: paymentData.address.bairro,
            city: paymentData.address.municipio,
            region_code: paymentData.address.estado,
            postal_code: paymentData.address.cep,
            country: 'BRA',
          },

        };

        console.log('Dados que serão enviados:', JSON.stringify(requestData));

        const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/pix`, requestData);
        console.log('Response data', response.data);

        if (response.data.qr_codes && response.data.qr_codes.length > 0) {
          setPixCode(response.data.qr_codes[0].text);
          const qrCodeLink = response.data.qr_codes[0].links.find((link: QRCodeLink) => link.rel === 'QRCODE.PNG')?.href;
          if (qrCodeLink) {
            setQrCodeUrl(qrCodeLink);
          } else {
            throw new Error('QR code link not found');
          }
        } else {
          throw new Error('Invalid response: Missing qr_codes');
        }
      } catch (error: unknown) {
        console.error('Error generating PIX code:', error);
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('Response data:', error.response.data);
          }
        } else {
          console.error('Unexpected error:', error);
        }
      } finally {
        setLoading(false);
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
      toast.success(t('PixCodeCopied'));
    });
  };

  const handleBackClick = () => {
    setShowConfirmation(true);
  };

  const confirmCancel = () => {
    setShowConfirmation(false);
    navigate('/checkout');
  };

  const cancelCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="form-content">
      <button className="back-button" onClick={handleBackClick}>
        <i className="pi pi-arrow-left" style={{ fontSize: '1.2rem', marginTop: '5rem' }}></i>
      </button>
      <div className="qr-code-container">
        {loading ? (
          <Oval height={50} width={50} color="#4fa94d" />
        ) : qrCodeUrl ? (
          <img src={qrCodeUrl} alt="QR Code" />
        ) : (
          <p>{t('QRCodeNotFound')}</p>
        )}
      </div>
      <div className="p-field">
        <label htmlFor="pixCode">{t('PixCopyPaste')}</label>
        <textarea
          id="pixCode"
          value={pixCode}
          readOnly
          rows={4}
          className="custom-textarea"
          onClick={handlePixCodeClick}
        ></textarea>
      </div>
      {(qrCodeUrl || pixCode) && (
        <div className="waiting-payment-container">
          <Oval
            height={20}
            width={20}
            color="black"
            ariaLabel="oval-loading"
            secondaryColor="gray"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <p className="waiting-payment">{t('WaitingPayment')}</p>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
      <Dialog header={t('CancelDonation')} visible={showConfirmation} onHide={cancelCancel} modal>
        <p>{t('CancelDonationConfirmation')}</p>
        <div className="confirmation-buttons" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <Button label={t('Yes')} icon="pi pi-check" onClick={confirmCancel} style={{ background: 'white', color: 'black', border: '1px solid black' }} />
          <Button label={t('No')} icon="pi pi-times" onClick={cancelCancel} autoFocus className="p-button-secondary" style={{ background: 'black' }} />
        </div>
      </Dialog>
    </div>
  );
}
