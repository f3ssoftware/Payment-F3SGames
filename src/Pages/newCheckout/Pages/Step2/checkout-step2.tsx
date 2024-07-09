import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step2.css';
import womanImage from '../../../../Shared/imgs/beautiful_druid_shop 1.svg';
import logoImage from '../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../Shared/imgs/Group 71.svg';
import brazilFlag from '../../../../Shared/imgs/Flag_of_Brazil.svg';
import usFlag from '../../../../Shared/imgs/Flag_of_the_United_States.svg';
import spainFlag from '../../../../Shared/imgs/Flag_of_Spain.svg';
import { useCheckout } from '../../../../context/CheckoutContext';
import { BrazilState } from '../../../../Shared/enums/BrazilState';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const brazilStatesOptions = Object.keys(BrazilState).map((key) => ({
    label: BrazilState[key as keyof typeof BrazilState],
    value: BrazilState[key as keyof typeof BrazilState],
}));

export default function CheckoutStep2() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { setPaymentData } = useCheckout();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const [localPhone, setLocalPhone] = useState('');
    const [localCpf, setLocalCpf] = useState('');
    const [localCep, setLocalCep] = useState('');

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        cpf: '',
        birthdate: null,
        cep: '',
        estado: '',
        municipio: '',
        bairro: '',
        logradouro: '',
        numero: '',
        complemento: '',
        sexo: '',
        paymentMethod: 'pix',
    };

    const validationSchema = Yup.object({
        name: Yup.string().required(t('FullNameRequired')),
        email: Yup.string().email(t('InvalidEmail')).required(t('EmailRequired')),
        phone: Yup.string().required(t('PhoneRequired')),
        cpf: Yup.string().required(t('CPFRequired')).matches(/^\d{11}$/, t('CPFInvalid')),
        birthdate: Yup.date().nullable().required(t('BirthdateRequired')).typeError(t('BirthdateInvalid')),
        cep: Yup.string().required(t('CEPRequired')),
        estado: Yup.string().required(t('StateRequired')),
        municipio: Yup.string().required(t('MunicipioRequired')),
        bairro: Yup.string().required(t('BairroRequired')),
        logradouro: Yup.string().required(t('LogradouroRequired')),
        numero: Yup.number().typeError(t('NumeroMustBeNumber')).required(t('NumeroRequired')),
        complemento: Yup.string(),
        sexo: Yup.string().required(t('SexoRequired')),
        paymentMethod: Yup.string().required(t('PaymentMethodRequired')),
    });

    const handleSubmit = (values: typeof initialValues) => {
        const formattedCpf = localCpf.toString();
        console.log('Formatted CPF:', formattedCpf);
        setPaymentData((prevData: any) => ({
            ...prevData,
            customer: {
                name: values.name,
                email: values.email,
                phone: values.phone,
                cpf: formattedCpf,
                birthdate: values.birthdate,
            },
            address: {
                logradouro: values.logradouro,
                numero: values.numero.toString(),
                complemento: values.complemento || '',
                bairro: values.bairro,
                municipio: values.municipio,
                estado: values.estado,
                cep: values.cep,
            },
            paymentMethod: values.paymentMethod,
        }));
        navigate(`/checkout/payment?paymentMethod=${values.paymentMethod}`);
    };

    const handleCancelClick = () => {
        navigate('/checkout');
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>, setFieldValue: any) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                const data = response.data;
                console.log('CEP data:', data);

                if (data && !data.erro) {
                    setFieldValue('logradouro', data.logradouro);
                    setFieldValue('bairro', data.bairro);
                    setFieldValue('municipio', data.localidade);
                    setFieldValue('estado', data.uf);
                } else {
                    console.error('CEP não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar o CEP:', error);
            }
        }
    };

    return (
        <div className="checkout-step2-container">
            <div className="p-col-12 p-md-7 image-step2-container">
                <img src={womanImage} alt="Woman smiling while giving her credit card" className="woman-image" />
            </div>
            <div className="p-col-12 p-md-5 form-step2-container">
                <div className="top-container">
                    <div className="flags-container">
                        <img src={brazilFlag} alt="Português" className="flag-icon" onClick={() => changeLanguage('pt')} />
                        <img src={usFlag} alt="English" className="flag-icon" onClick={() => changeLanguage('en')} />
                        <img src={spainFlag} alt="Español" className="flag-icon" onClick={() => changeLanguage('es')} />
                    </div>
                    <div className="logo-top-step2-container">
                        <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                    </div>
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values, errors, touched }) => (
                        <Form className="step-2-form">
                            <div className="payment-step2-method">
                                <h3>{t('ChoosePaymentMethod')}</h3>
                                <div className="grid">
                                    <div className="col-4 md:col-3" />
                                    <div className="payment-step2-options">
                                        <div className="payment-step2-option">
                                            <input
                                                type="radio"
                                                id="pix"
                                                name="paymentMethod"
                                                value="pix"
                                                checked={values.paymentMethod === 'pix'}
                                                onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                                            />
                                            <label htmlFor="pix">Pix</label>
                                        </div>
                                        <div className="payment-step2-option">
                                            <input
                                                type="radio"
                                                id="creditCard"
                                                name="paymentMethod"
                                                value="creditCard"
                                                checked={values.paymentMethod === 'creditCard'}
                                                onChange={(e) => setFieldValue('paymentMethod', e.target.value)}
                                            />
                                            <label htmlFor="creditCard">{t('CreditCard')}</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid p-fluid">
                                <div className="col-12 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="name" name="name" className="custom-step2-input" />
                                        <label htmlFor="name">{t('FullName')}*</label>
                                    </span>
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="email" name="email" className="custom-step2-input" />
                                        <label htmlFor="email">{t('Email')}*</label>
                                    </span>
                                    <ErrorMessage name="email" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-5" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask
                                            id="phone"
                                            mask="(99) 99999-9999"
                                            unmask
                                            value={localPhone}
                                            onChange={(e) => setLocalPhone(e.value)}
                                            onBlur={() => setFieldValue('phone', localPhone)}
                                            className={`custom-step2-input ${errors.phone && touched.phone ? 'p-invalid' : ''}`}
                                        />
                                        <label htmlFor="phone">{t('Phone')}*</label>
                                    </span>
                                    <ErrorMessage name="phone" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask
                                            id="cpf"
                                            mask="999.999.999-99"
                                            unmask
                                            value={localCpf}
                                            onChange={(e) => setLocalCpf(e.value)}
                                            onBlur={() => setFieldValue('cpf', localCpf)}
                                            className={`custom-step2-input ${errors.cpf && touched.cpf ? 'p-invalid' : ''}`}
                                        />
                                        <label htmlFor="cpf">{t('CPF')}*</label>
                                    </span>
                                    <ErrorMessage name="cpf" component="div" className="error-message" />
                                </div>
                                <div className="col-6 md:col-3" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Calendar
                                            id="birthdate"
                                            value={values.birthdate}
                                            viewDate={new Date(2000, 0, 1)}
                                            onChange={(e) => setFieldValue('birthdate', e.value)}
                                            className="custom-step2-input"
                                            dateFormat="dd/mm/yy"
                                        />
                                        <label htmlFor="birthdate">{t('Birthdate')}*</label>
                                    </span>
                                    <ErrorMessage name="birthdate" component="div" className="error-message" />
                                </div>
                                <div className="col-6 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask
                                            id="cep"
                                            mask="99999-999"
                                            unmask
                                            value={localCep}
                                            onChange={(e) => setLocalCep(e.value)}
                                            onBlur={(e) => {
                                                setFieldValue('cep', localCep);
                                                handleCepBlur(e, setFieldValue);
                                            }}
                                            className={`custom-step2-input ${errors.cep && touched.cep ? 'p-invalid' : ''}`}
                                        />
                                        <label htmlFor="cep">{t('CEP')}*</label>
                                    </span>
                                    <ErrorMessage name="cep" component="div" className="error-message" />
                                </div>
                                <div className="col-6 md:col-4" style={{ marginTop: "0.5rem" }}>    
                                    <span className="p-float-label">
                                        <Dropdown 
                                            id="estado" 
                                            name="estado" 
                                            value={values.estado} 
                                            options={brazilStatesOptions} 
                                            onChange={(e) => setFieldValue('estado', e.value)} 
                                            className="custom-step2-input" 
                                            style={{ width: '100%' }} 
                                        />
                                        <label htmlFor="estado">{t('State')}*</label>
                                    </span>
                                    <ErrorMessage name="estado" component="div" className="error-message" />
                                </div>

                                <div className="col-6 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="municipio" name="municipio" className="custom-step2-input" />
                                        <label htmlFor="municipio">{t('Municipio')}*</label>
                                    </span>
                                    <ErrorMessage name="municipio" component="div" className="error-message" />
                                </div>
                                <div className="col-4 md:col-5" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="bairro" name="bairro" className="custom-step2-input" />
                                        <label htmlFor="bairro">{t('Bairro')}*</label>
                                    </span>
                                    <ErrorMessage name="bairro" component="div" className="error-message" />
                                </div>
                                <div className="col-8 md:col-7" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="logradouro" name="logradouro" className="custom-step2-input" />
                                        <label htmlFor="logradouro">{t('Logradouro')}*</label>
                                    </span>
                                    <ErrorMessage name="logradouro" component="div" className="error-message" />
                                </div>
                                <div className="col-4 md:col-2" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="numero" name="numero" type="number" className="custom-step2-input" />
                                        <label htmlFor="numero">{t('Numero')}*</label>
                                    </span>
                                    <ErrorMessage name="numero" component="div" className="error-message" />
                                </div>
                                <div className="col-8 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="complemento" name="complemento" className="custom-step2-input" />
                                        <label htmlFor="complemento">{t('Complemento')}</label>
                                    </span>
                                    <ErrorMessage name="complemento" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <div className="gender-label-container">
                                        <label className="gender-label">{t('Sexo')}*</label>
                                    </div>
                                    <div className="gender-options-container">
                                        <div className="p-formgroup-inline custom-radio-group">
                                            <div className="p-field-radiobutton">
                                                <Field type="radio" id="male" name="sexo" value="Masculino" />
                                                <label htmlFor="male">{t('Male')}</label>
                                            </div>
                                            <div className="p-field-radiobutton">
                                                <Field type="radio" id="female" name="sexo" value="Feminino" />
                                                <label htmlFor="female">{t('Female')}</label>
                                            </div>
                                        </div>
                                    </div>
                                    <ErrorMessage name="sexo" component="div" className="error-message" />
                                </div>
                            </div>
                            <div className="button-step2-container">
                                <button className="custom-button secondary" type="button" onClick={handleCancelClick}>{t('Cancel')}</button>
                                <button className="custom-button primary" type="submit">{t('Next')}</button>
                            </div>
                        </Form>
                    )}
                </Formik>
                <div className="logo-step2-bottom-container">
                    <img src={companyLogo} alt="Company Logo" className="company-step2-logo" />
                </div>
            </div>
        </div>
    );
}
