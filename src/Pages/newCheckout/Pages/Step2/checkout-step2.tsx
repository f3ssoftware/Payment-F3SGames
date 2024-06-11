import React from 'react';
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
import { useCheckout } from '../../../../context/CheckoutContext';
import { BrazilState } from '../../../../Shared/enums/BrazilState';
import axios from 'axios';

const brazilStatesOptions = Object.keys(BrazilState).map((key) => ({
    label: BrazilState[key as keyof typeof BrazilState],
    value: BrazilState[key as keyof typeof BrazilState],
}));

export default function CheckoutStep2() {
    const navigate = useNavigate();
    const { setPaymentData } = useCheckout();

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
        name: Yup.string().required('Nome Completo é obrigatório'),
        email: Yup.string().email('Email inválido').required('Email é obrigatório'),
        phone: Yup.string().required('Telefone é obrigatório'),
        cpf: Yup.string().required('CPF é obrigatório'),
        birthdate: Yup.date().nullable().required('Nascimento é obrigatório').typeError('Data de Nascimento inválida'),
        cep: Yup.string().required('CEP é obrigatório'),
        estado: Yup.string().required('Estado é obrigatório'),
        municipio: Yup.string().required('Município é obrigatório'),
        bairro: Yup.string().required('Bairro é obrigatório'),
        logradouro: Yup.string().required('Logradouro é obrigatório'),
        numero: Yup.number().typeError('Número deve ser um valor numérico').required('Número é obrigatório'),
        complemento: Yup.string(),
        sexo: Yup.string().required('Sexo é obrigatório'),
        paymentMethod: Yup.string().required('Método de pagamento é obrigatório'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        setPaymentData((prevData: any) => ({
            ...prevData,
            customer: {
                name: values.name,
                email: values.email,
                phone: values.phone,
                cpf: values.cpf,
                birthdate: values.birthdate,
            },
            address: {
                logradouro: values.logradouro,
                numero: values.numero,
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
                <div className="logo-top-step2-container">
                    <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                </div>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ setFieldValue, values }) => (
                        <Form className="step-2-form">
                            <div className="payment-step2-method">
                                <h3>Escolha um método de pagamento</h3>
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
                                            <label htmlFor="creditCard">Cartão de Crédito</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="grid p-fluid">
                                <div className="col-12 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="name" name="name" className="custom-step2-input" />
                                        <label htmlFor="name">Nome Completo*</label>
                                    </span>
                                    <ErrorMessage name="name" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="email" name="email" className="custom-step2-input" />
                                        <label htmlFor="email">Email*</label>
                                    </span>
                                    <ErrorMessage name="email" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-5" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask id="phone" mask="(99) 99999-9999" unmask value={values.phone} onChange={(e) => setFieldValue('phone', e.value)} className="custom-step2-input" />
                                        <label htmlFor="phone">Telefone*</label>
                                    </span>
                                    <ErrorMessage name="phone" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask id="cpf" mask="999.999.999-99" unmask value={values.cpf} onChange={(e) => setFieldValue('cpf', e.value)} className="custom-step2-input" />
                                        <label htmlFor="cpf">CPF*</label>
                                    </span>
                                    <ErrorMessage name="cpf" component="div" className="error-message" />
                                </div>
                                <div className="col-6 md:col-3" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Calendar id="birthdate" value={values.birthdate} onChange={(e) => setFieldValue('birthdate', e.value)} className="custom-step2-input" dateFormat="dd/mm/yy" />
                                        <label htmlFor="birthdate">Nascimento*</label>
                                    </span>
                                    <ErrorMessage name="birthdate" component="div" className="error-message" />
                                </div>
                                <div className="col-6 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <InputMask id="cep" mask="99999-999" unmask value={values.cep} onChange={(e) => setFieldValue('cep', e.value)} onBlur={(e) => handleCepBlur(e, setFieldValue)} className="custom-step2-input" />
                                        <label htmlFor="cep">CEP*</label>
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
                                            panelStyle={{ width: '100%' }} 
                                        />
                                        <label htmlFor="estado">Estado*</label>
                                    </span>
                                    <ErrorMessage name="estado" component="div" className="error-message" />
                                </div>

                                <div className="col-6 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="municipio" name="municipio" className="custom-step2-input" />
                                        <label htmlFor="municipio">Município*</label>
                                    </span>
                                    <ErrorMessage name="municipio" component="div" className="error-message" />
                                </div>
                                <div className="col-4 md:col-5" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="bairro" name="bairro" className="custom-step2-input" />
                                        <label htmlFor="bairro">Bairro*</label>
                                    </span>
                                    <ErrorMessage name="bairro" component="div" className="error-message" />
                                </div>
                                <div className="col-8 md:col-7" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="logradouro" name="logradouro" className="custom-step2-input" />
                                        <label htmlFor="logradouro">Logradouro*</label>
                                    </span>
                                    <ErrorMessage name="logradouro" component="div" className="error-message" />
                                </div>
                                <div className="col-4 md:col-2" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="numero" name="numero" type="number" className="custom-step2-input" />
                                        <label htmlFor="numero">Número*</label>
                                    </span>
                                    <ErrorMessage name="numero" component="div" className="error-message" />
                                </div>
                                <div className="col-8 md:col-6" style={{ marginTop: "0.5rem" }}>
                                    <span className="p-float-label">
                                        <Field as={InputText} id="complemento" name="complemento" className="custom-step2-input" />
                                        <label htmlFor="complemento">Complemento</label>
                                    </span>
                                    <ErrorMessage name="complemento" component="div" className="error-message" />
                                </div>
                                <div className="col-12 md:col-4" style={{ marginTop: "0.5rem" }}>
                                    <div className="gender-label-container">
                                        <label className="gender-label">Sexo*</label>
                                    </div>
                                    <div className="gender-options-container">
                                        <div className="p-formgroup-inline custom-radio-group">
                                            <div className="p-field-radiobutton">
                                                <Field type="radio" id="male" name="sexo" value="Masculino" />
                                                <label htmlFor="male">Masculino</label>
                                            </div>
                                            <div className="p-field-radiobutton">
                                                <Field type="radio" id="female" name="sexo" value="Feminino" />
                                                <label htmlFor="female">Feminino</label>
                                            </div>
                                        </div>
                                    </div>
                                    <ErrorMessage name="sexo" component="div" className="error-message" />
                                </div>
                            </div>
                            <div className="button-step2-container">
                                <button className="custom-button secondary" type="button" onClick={handleCancelClick}>CANCELAR</button>
                                <button className="custom-button primary" type="submit">PRÓXIMO</button>
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
