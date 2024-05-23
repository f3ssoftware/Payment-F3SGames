import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import 'primeflex/primeflex.css';
import './checkout-step1.css'; // Assuming you have some custom styles

import womanImage from '../../../../Shared/imgs/image 2.svg';
import logoImage from '../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../Shared/imgs/Group 71.svg';

const CheckoutStep1: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [value, setValue] = useState<number | null>(null);
    const [convertedCoin, setConvertedCoin] = useState<number>(0);

    useEffect(() => {
        if (value !== null) {
            setConvertedCoin(Math.round(value / 0.08));
        }
    }, [value]);

    const handleValueChange = (e: { value: number | null }) => {
        setValue(e.value);
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
                <div className="form-content">
                    <div className="p-field">
                        <span className="p-float-label">
                            <InputText id="characterName" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%' }} className="custom-input" />
                            <label htmlFor="characterName">Nome do Personagem*</label>
                        </span>
                    </div>
                    <div className="p-field">
                        <span className="p-float-label">
                            <InputNumber id="donationValue" value={value} onChange={handleValueChange} mode="currency" currency="BRL" style={{ width: '100%' }} className="custom-input" />
                            <label htmlFor="donationValue">Valor da Doação*</label>
                        </span>
                    </div>
                    <p className="description">
                        Agradecemos a sua doação! Com o valor de R$ {value ?? 0},00 você está ajudando o White Kingdom Otserv com os custos de manutenção, infraestrutura, equipe de programadores e outros gastos.
                        A fim de retribuir o seu gesto, com esse valor estaremos disponibilizando a quantia de <span className="highlight">{convertedCoin}</span> Coins para seu personagem usufruir de bônus especiais dentro do jogo.
                    </p>
                </div>
                <div className="logo-bottom-container">
                    <img src={companyLogo} alt="Company Logo" className="company-logo" />
                </div>
            </div>
        </div>
    );
};

export default CheckoutStep1;
