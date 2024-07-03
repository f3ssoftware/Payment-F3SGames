import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { useNavigate } from 'react-router-dom';
import { useCheckout } from '../../../../../context/CheckoutContext';
import axios from 'axios';
import cardValidator from 'card-validator';
import { Toast } from 'primereact/toast';
import { ProgressSpinner } from 'primereact/progressspinner';

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
  const toast = React.useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

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
    cardNumber: Yup.string().test('test-number', 'Número do cartão é inválido', value => cardValidator.number(value || '').isValid).required('Número do cartão é obrigatório'),
    expMonth: Yup.string()
      .required('Mês Expiração é obrigatório')
      .matches(/^(0[1-9]|1[0-2])$/, 'Mês deve estar entre 01 e 12'),
    expYear: Yup.string()
      .required('Ano Expiração é obrigatório')
      .matches(/^\d{4}$/, 'Ano deve ter 4 dígitos')
      .test('test-future-date', 'Data de expiração inválida', function(value) {
        if (!value) return false;
        const { expMonth } = this.parent;
        const expDate = new Date(Number(value), Number(expMonth) - 1);
        const now = new Date();
        return expDate > now;
      }),
    cvv: Yup.string().required('CVV é obrigatório').matches(/^\d{3,4}$/, 'CVV deve ter 3 ou 4 dígitos'),
    cardCPF: Yup.string().required('CPF do titular do cartão é obrigatório').matches(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  });

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);

    console.log('Customer:', paymentData.customer);
    console.log('Address:', paymentData.address);
    console.log('Card Data:', values);

    const { customer, address, player_id, amount } = paymentData;

    if (!customer || !address) {
      console.error('Customer or address data is missing');
      setLoading(false);
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
        number: values.cardNumber.replace(/\s/g, ''), // Remove espaços da máscara
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
        const errorResponse = error.response.data;
        if (errorResponse.error && errorResponse.error.error_messages) {
          const errorMessage = errorResponse.error.error_messages.find(
            (msg: any) => msg.code === '40002' && msg.parameter_name === 'charges[0].payment_method.card.exp_year'
          );
          if (errorMessage) {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Ano de expiração inválido. Por favor, insira um ano válido.' });
          }
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    navigate('/checkout');
  };

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
      {() => (
        <Form className="form-content">
          <Toast ref={toast} />
          <div className="grid p-fluid">
            <div className="col-12" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputText} id="cardName" name="cardName" className="custom-step3-input" />
                <label htmlFor="cardName">Nome Impresso no cartão*</label>
              </span>
              <ErrorMessage name="cardName" component="div" className="error-message" />
            </div>
            <div className="col-12" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputMask} id="cardNumber" name="cardNumber" mask="9999-9999-9999-99?99" unmask className="custom-step3-input" />
                <label htmlFor="cardNumber">Número do cartão*</label>
              </span>
              <ErrorMessage name="cardNumber" component="div" className="error-message" />
            </div>
            <div className="col-12" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputMask} id="cardCPF" name="cardCPF" mask="999.999.999-99" unmask className="custom-step3-input" />
                <label htmlFor="cardCPF">CPF do titular do cartão*</label>
              </span>
              <ErrorMessage name="cardCPF" component="div" className="error-message" />
            </div>
            <div className="col-4" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputText} id="expMonth" name="expMonth" maxLength={2} className="custom-step3-input" />
                <label htmlFor="expMonth">Mês Expiração*</label>
              </span>
              <ErrorMessage name="expMonth" component="div" className="error-message" />
            </div>
            <div className="col-4" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputText} id="expYear" name="expYear" maxLength={4} className="custom-step3-input" />
                <label htmlFor="expYear">Ano Expiração*</label>
              </span>
              <ErrorMessage name="expYear" component="div" className="error-message" />
            </div>
            <div className="col-4" style={{ marginTop: '0.5rem' }}>
              <span className="p-float-label">
                <Field as={InputText} id="cvv" name="cvv" maxLength={4} className="custom-step3-input" />
                <label htmlFor="cvv">CVV*</label>
              </span>
              <ErrorMessage name="cvv" component="div" className="error-message" />
            </div>
          </div>
          {loading && (
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <ProgressSpinner style={{ width: '2.5rem', height: '2.5rem' }}/>
            </div>
          )}
          <div className="button-step3-container">
            <button className="custom-button secondary" type="button" onClick={handleCancelClick}>
              CANCELAR
            </button>
            <button className="custom-button primary" type="submit" disabled={loading}>
              PRÓXIMO
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutStep3CreditCard;
