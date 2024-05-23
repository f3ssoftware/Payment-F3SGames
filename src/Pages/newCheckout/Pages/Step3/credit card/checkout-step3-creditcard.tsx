import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Calendar } from 'primereact/calendar';
import 'primeflex/primeflex.css';
import './checkout-step3-creditcard.css';

import womanImage from '../../../../../Shared/imgs/image 2.svg';
import logoImage from '../../../../../Shared/imgs/image 1.svg';
import companyLogo from '../../../../../Shared/imgs/Group 71.svg';

export default function CheckoutStep3CreditCard() {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [cpf, setCpf] = useState<string>('');
    const [birthdate, setBirthdate] = useState<Date | null>(null);
    const [cep, setCep] = useState<string>('');
    const [municipio, setMunicipio] = useState<string>('');
    const [bairro, setBairro] = useState<string>('');
    const [logradouro, setLogradouro] = useState<string>('');
    const [numero, setNumero] = useState<string>('');
    const [sexo, setSexo] = useState<string>('');

    return (
        <div className="p-grid p-nogutter checkout-creditcard-container">
            <div className="p-col-12 p-md-7 image-creditcard-container">
                <img src={womanImage} alt="Woman smiling while giving her credit card" className="woman-image" />
            </div>
            <div className="p-col-12 p-md-5 form-creditcard-container">
                <div className="logo-top-creditcard-container">
                    <img src={logoImage} alt="White Kingdom Logo" className="logo-image" />
                </div>
                <div className="payment-creditcard-method">
                    <h3>Escolha um método de pagamento</h3>
                    <div className="payment-creditcard-option">
                        <input type="radio" id="pix" name="paymentMethod" value="Pix" />
                        <label htmlFor="pix">Pix</label>
                    </div>
                    <div className="payment-creditcard-option">
                        <input type="radio" id="creditCard" name="paymentMethod" value="Cartão de Crédito" />
                        <label htmlFor="creditCard">Cartão de Crédito</label>
                    </div>
                </div>
                <div className="form-creditcard-content">
                    <div className="p-grid p-fluid">
                        <div className="p-col-12 p-md-7">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="name" value={name} onChange={(e) => setName(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="name">Nome Completo*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-5">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="email">Email*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputMask id="phone" mask="(99) 99999-9999" unmask value={phone} onChange={(e) => setPhone(e.value)} className="custom-creditcard-input" />
                                    <label htmlFor="phone">Telefone*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputMask id="cpf" mask="999.999.999-99" unmask value={cpf} onChange={(e) => setCpf(e.value)} className="custom-creditcard-input" />
                                    <label htmlFor="cpf">CPF*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <Calendar id="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.value as Date)} className="custom-creditcard-input" />
                                    <label htmlFor="birthdate">Nascimento</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputMask id="cep" mask="99999-999" unmask value={cep} onChange={(e) => setCep(e.value)} className="custom-creditcard-input" />
                                    <label htmlFor="cep">CEP*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="municipio" value={municipio} onChange={(e) => setMunicipio(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="municipio">Município*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="bairro" value={bairro} onChange={(e) => setBairro(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="bairro">Bairro*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="logradouro" value={logradouro} onChange={(e) => setLogradouro(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="logradouro">Logradouro*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-2">
                            <div className="p-field">
                                <span className="p-float-label">
                                    <InputText id="numero" value={numero} onChange={(e) => setNumero(e.target.value)} className="custom-creditcard-input" />
                                    <label htmlFor="numero">Número*</label>
                                </span>
                            </div>
                        </div>
                        <div className="p-col-12 p-md-4">
                            <div className="gender-creditcard-selection">
                                <label>Sexo</label>
                                <div className="p-formgroup-inline">
                                    <div className="p-field-radiobutton">
                                        <input type="radio" id="male" name="gender" value="Masculino" onChange={(e) => setSexo(e.target.value)} />
                                        <label htmlFor="male">Masculino</label>
                                    </div>
                                    <div className="p-field-radiobutton">
                                        <input type="radio" id="female" name="gender" value="Feminino" onChange={(e) => setSexo(e.target.value)} />
                                        <label htmlFor="female">Feminino</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="button-creditcard-container">
                        <button className="p-button p-component p-button-outlined p-button-secondary">CANCELAR</button>
                        <button className="p-button p-component p-button-outlined p-button-primary">PRÓXIMO</button>
                    </div>
                    <div className="logo-creditcard-bottom-container">
                        <img src={companyLogo} alt="Company Logo" className="company-creditcard-logo" />
                    </div>
                </div>
            </div>
        </div >
    );
}
