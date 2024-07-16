import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step1.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCheckout } from '../../../../context/CheckoutContext';
import { Dialog } from 'primereact/dialog';
import womanImage from '../../../../Shared/imgs/beautiful_druid_shop 1.svg';
import logoImage from '../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../Shared/imgs/Group 71.svg';
import brazilFlag from '../../../../Shared/imgs/Flag_of_Brazil.svg';
import usFlag from '../../../../Shared/imgs/Flag_of_the_United_States.svg';
import spainFlag from '../../../../Shared/imgs/Flag_of_Spain.svg';
import { useTranslation, Trans } from 'react-i18next';

console.log('API URL:', process.env.REACT_APP_API_URL);

const CheckoutStep1: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [convertedCoin, setConvertedCoin] = useState<number>(0);
    const [donationValue, setDonationValue] = useState<number>(0);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [playerData, setPlayerData] = useState<any>(null);
    const navigate = useNavigate();
    const { setPaymentData } = useCheckout();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const initialValues = {
        name: '',
        value: 0,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t('CharacterNameRequired')),
        value: Yup.number()
            .min(2, t('DonationValueMin'))
            .max(99998, t('DonationValueMax'))
            .required(t('DonationValueRequired')),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/players/${values.name}`);
            if (response.data) {
                console.log(response.data);
                setPlayerData(response.data);
                setPaymentData({
                    player_id: response.data.id,
                    player_name: response.data.name,
                    player_level: response.data.level,
                    donation_value: values.value,
                    amount: Math.round(values.value),
                });
                setShowConfirmation(true);
            }
        } catch (error) {
            toast.error(t('CharacterNameNotFound'));
        }
    };

    useEffect(() => {
        setConvertedCoin(Math.round(donationValue / 0.08));
    }, [donationValue]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const confirmPlayer = () => {
        setShowConfirmation(false);
        navigate('/checkout/requirements');
    };

    return (
        <div className="p-grid p-nogutter checkout-container">
            <div className="p-col-12 p-md-7 image-container">
                <img src={womanImage} alt="Druid doing business" className="woman-image" />
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
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="form-content">
                            <div className="form-group">
                                <div className="p-field">
                                    <span className="p-float-label">
                                        <Field as={InputText} id="characterName" name="name" className="custom-input" style={{ width: '100%' }} />
                                        <label htmlFor="characterName">{t('CharacterName')}*</label>
                                    </span>
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>
                                <div className="p-field">
                                    <span className="p-float-label">
                                        <InputNumber
                                            id="donationValue"
                                            value={values.value}
                                            onValueChange={(e) => {
                                                setFieldValue('value', e.value);
                                                setDonationValue(e.value ?? 0);
                                            }}
                                            mode="currency"
                                            currency="BRL"
                                            style={{ width: '100%' }}
                                            className="custom-input"
                                        />
                                        <label htmlFor="donationValue">{t('DonationValue')}*</label>
                                    </span>
                                    <ErrorMessage name="value" component="div" className="error-message" />
                                </div>
                                <p className="description">
                                    <Trans 
                                        i18nKey="DonationMessage"
                                        values={{ amount: formatCurrency(values.value ?? 0), coins: convertedCoin }}
                                        components={{ span: <span className="highlight" /> }}
                                    />
                                </p>
                            </div>
                            <div className="button-container">
                                <button type="submit" className="custom-button">{t('Next')}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="logo-bottom-container">
                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                </div>
            </div>
            <Dialog header={t('ConfirmCharacter')} visible={showConfirmation} onHide={() => setShowConfirmation(false)} modal>
                {playerData && (
                    <div>
                        <p><strong>{t('Name')}:</strong> {playerData.name}</p>
                        <p><strong>{t('Level')}:</strong> {playerData.level}</p>
                        <button onClick={confirmPlayer} className="custom-button">{t('Confirm')}</button>
                    </div>
                )}
            </Dialog>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeOnClick pauseOnHover />
        </div>
    );
};

export default CheckoutStep1;
