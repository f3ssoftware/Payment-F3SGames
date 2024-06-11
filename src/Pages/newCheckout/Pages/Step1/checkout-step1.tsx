import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'primeflex/primeflex.css';
import './checkout-step1.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCheckout } from '../../../../context/CheckoutContext'; 
import { Dialog } from 'primereact/dialog';
import womanImage from '../../../../Shared/imgs/beautiful_druid_shop 1.svg';
import logoImage from '../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../Shared/imgs/Group 71.svg';

console.log('API URL:', process.env.REACT_APP_API_URL);

const CheckoutStep1: React.FC = () => {
    const [convertedCoin, setConvertedCoin] = useState<number>(0);
    const [donationValue, setDonationValue] = useState<number>(0);
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [playerData, setPlayerData] = useState<any>(null);
    const navigate = useNavigate();
    const { setPaymentData } = useCheckout();

    const initialValues = {
        name: '',
        value: 0,
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Nome do Personagem é obrigatório'),
        value: Yup.number().min(1, 'Valor da Doação deve ser maior que zero').required('Valor da Doação é obrigatório'),
    });

    const handleSubmit = async (values: typeof initialValues) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/players/${values.name}`);
            if (response.data) {
                setPlayerData(response.data);
                setPaymentData({
                    player_id: response.data.id, 
                    player_name: response.data.name,
                    player_level: response.data.level,
                    donation_value: values.value
                });
                setShowConfirmation(true);
            }
        } catch (error) {
            toast.error('Nome do personagem não encontrado. Por favor, verifique e tente novamente.');
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
                                                setDonationValue(e.value ?? 0);
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
            <Dialog header="Confirme seu personagem" visible={showConfirmation} onHide={() => setShowConfirmation(false)} modal>
                {playerData && (
                    <div>
                        <p><strong>Nome:</strong> {playerData.name}</p>
                        <p><strong>Level:</strong> {playerData.level}</p>
                        <button onClick={confirmPlayer} className="custom-button">CONFIRMAR</button>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default CheckoutStep1;
