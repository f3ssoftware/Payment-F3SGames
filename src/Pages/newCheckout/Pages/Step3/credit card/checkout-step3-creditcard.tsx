import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step3-creditcard.css';
import { useNavigate } from 'react-router-dom';

export default function CheckoutStep3CreditCard() {
    const navigate = useNavigate();
    
    const initialValues = {
        cardName: '',
        cardNumber: '',
        expMonth: '',
        expYear: '',
        cvv: '',
    };

    const validationSchema = Yup.object({
        cardName: Yup.string().required('Nome Impresso no cartão é obrigatório'),
        cardNumber: Yup.string().required('Número do cartão é obrigatório'),
        expMonth: Yup.string().required('Mês Expiração é obrigatório'),
        expYear: Yup.string().required('Ano Expiração é obrigatório'),
        cvv: Yup.string().required('CVV é obrigatório'),
    });

    const handleSubmit = (values: typeof initialValues) => {
        console.log(values);
        // This logic should be implemented after we have an API or something to send to the Pagbank API.
    };
    const handleCancelClick = () => {
        navigate('/checkout'); 
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form className="form-content">
                    <div className="grid p-fluid">
                        <div className="col-12" style={{ marginTop: "0.5rem" }}>
                            <span className="p-float-label">
                                <Field as="input" id="cardName" name="cardName" className="custom-step3-input" />
                                <label htmlFor="cardName">Nome Impresso no cartão*</label>
                            </span>
                            <ErrorMessage name="cardName" component="div" className="error-message" />
                        </div>
                        <div className="col-12" style={{ marginTop: "0.5rem" }}>
                            <span className="p-float-label">
                                <Field as="input" id="cardNumber" name="cardNumber" className="custom-step3-input" />
                                <label htmlFor="cardNumber">Número do cartão*</label>
                            </span>
                            <ErrorMessage name="cardNumber" component="div" className="error-message" />
                        </div>
                        <div className="col-4" style={{ marginTop: "0.5rem" }}>
                            <span className="p-float-label">
                                <Field as="input" id="expMonth" name="expMonth" className="custom-step3-input" />
                                <label htmlFor="expMonth">Mês Expiração*</label>
                            </span>
                            <ErrorMessage name="expMonth" component="div" className="error-message" />
                        </div>
                        <div className="col-4" style={{ marginTop: "0.5rem" }}>
                            <span className="p-float-label">
                                <Field as="input" id="expYear" name="expYear" className="custom-step3-input" />
                                <label htmlFor="expYear">Ano Expiração*</label>
                            </span>
                            <ErrorMessage name="expYear" component="div" className="error-message" />
                        </div>
                        <div className="col-4" style={{ marginTop: "0.5rem" }}>
                            <span className="p-float-label">
                                <Field as="input" id="cvv" name="cvv" className="custom-step3-input" />
                                <label htmlFor="cvv">CVV*</label>
                            </span>
                            <ErrorMessage name="cvv" component="div" className="error-message" />
                        </div>
                    </div>
                    <div className="button-step3-container">
                        <button className="custom-button secondary" type="button" onClick={handleCancelClick}>CANCELAR</button>
                        <button className="custom-button primary" type="submit">PRÓXIMO</button>
                    </div>
                </Form>
            )}
        </Formik>
    );
}
