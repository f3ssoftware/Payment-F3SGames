import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step1.css';

import womanImage from '../../../../Shared/imgs/image 2.svg';
import logoImage from '../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../Shared/imgs/Group 71.svg';

const CheckoutStep1: React.FC = () => {
    const [convertedCoin, setConvertedCoin] = useState<number>(0);
    const [donationValue, setDonationValue] = useState<number>(0);
    const navigate = useNavigate();

    const initialValues = {
        name: '',
        value: 0,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Nome do Personagem é obrigatório'),
        value: Yup.number().min(1, 'Valor da Doação deve ser maior que zero').required('Valor da Doação é obrigatório'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        navigate('/checkout/requirements');
    };

    useEffect(() => {
        setConvertedCoin(Math.round(donationValue / 0.08));
    }, [donationValue]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
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
                                        <label htmlFor="characterName">Nome do Personagem*</label>
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
                                                setDonationValue(e.value ?? 0); // Atualiza o estado local de donationValue
                                            }}
                                            mode="currency"
                                            currency="BRL"
                                            style={{ width: '100%' }}
                                            className="custom-input"
                                        />
                                        <label htmlFor="donationValue">Valor da Doação*</label>
                                    </span>
                                    <ErrorMessage name="value" component="div" className="error-message" />
                                </div>
                                <p className="description">
                                    Agradecemos a sua doação! Com o valor de {formatCurrency(values.value ?? 0)} você está ajudando o White Kingdom Otserv com os custos de manutenção, infraestrutura, equipe de programadores e outros gastos.
                                    A fim de retribuir o seu gesto, com esse valor estaremos disponibilizando a quantia de <span className="highlight">{convertedCoin}</span> Coins para seu personagem usufruir de bônus especiais dentro do jogo.
                                </p>
                            </div>
                            <div className="button-container">
                                <button type="submit" className="custom-button">PRÓXIMO</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="logo-bottom-container">
                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                </div>
            </div>
        </div>
    );
};

export default CheckoutStep1;
