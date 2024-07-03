import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step3-creditcard.css';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../../../../context/CheckoutContext';
import axios from 'axios';

interface FormValues {
  cardName: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
  cardCPF: string;
}

const CheckoutStep3CreditCard = () => {
  const navigate = useNavigate();
  const { paymentData } = useCheckout();

  const initialValues: FormValues = {
    cardName: '',
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvv: '',
    cardCPF: '',
  };

  const validationSchema = Yup.object({
    cardName: Yup.string().required('Nome Impresso no cartão é obrigatório'),
    cardNumber: Yup.string().required('Número do cartão é obrigatório'),
    expMonth: Yup.string().required('Mês Expiração é obrigatório'),
    expYear: Yup.string().required('Ano Expiração é obrigatório'),
    cvv: Yup.string().required('CVV é obrigatório'),
    cardCPF: Yup.string().required('CPF do titular do cartão é obrigatório').matches(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  });

  const handleSubmit = async (values: FormValues) => {
    console.log('Customer:', paymentData.customer);
    console.log('Address:', paymentData.address);
    console.log('Card Data:', values);

    const { customer, address, player_id, amount } = paymentData;

    if (!customer || !address) {
        console.error('Customer or address data is missing');
        return;
    }

    const phoneNumber = customer.phone.replace(/\D/g, '');
    const formattedPhone = {
        type: 'MOBILE',
        country: '55',
        area: phoneNumber.slice(0, 2),
        number: phoneNumber.slice(2),
    };

    const requestData = {
        player_id,
        amount,
        customer: {
            name: customer.name,
            email: customer.email,
            tax_id: customer.cpf,
            phones: [formattedPhone],
        },
        address: {
            street: address.logradouro,
            number: address.numero.toString(),
            complement: address.complemento || 'N/A',
            locality: address.bairro,
            city: address.municipio,
            region_code: address.estado,
            country: 'BRA',
            postal_code: address.cep,
        },
        card: {
            number: values.cardNumber,
            exp_month: values.expMonth,
            exp_year: values.expYear,
            security_code: values.cvv,
            holder: {
                name: values.cardName,
                tax_id: values.cardCPF,
            },
        },
    };

    console.log('Sending payment data', requestData);

    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/payments/credit_card`, requestData);
        console.log('Response data', response.data);
    } catch (error) {
        console.error('Error generating credit card payment:', error);
        if (axios.isAxiosError(error) && error.response) {
            console.error('Response data:', error.response.data);
        }
    }
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
            <div className="col-12" style={{ marginTop: "0.5rem" }}>
              <span className="p-float-label">
                <Field as="input" id="cardCPF" name="cardCPF" className="custom-step3-input" />
                <label htmlFor="cardCPF">CPF do titular do cartão*</label>
              </span>
              <ErrorMessage name="cardCPF" component="div" className="error-message" />
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
};

export default CheckoutStep3CreditCard;
