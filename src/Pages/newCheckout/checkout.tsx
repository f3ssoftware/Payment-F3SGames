import { useEffect, useState } from 'react'
import './Checkout.css'
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { BrazilState } from '../../enums/BrazilState';
import { Dropdown } from 'primereact/dropdown';
import axios from 'axios';
import { Button } from 'primereact/button';
import React from 'react';

export default function Checkout() {

    const [fulano, setFulano] = useState('Fulano');
    const [billingValue, setBillingValue] = useState<number | null>(null)
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [bDay, setBDay] = useState('');
    const [cpf, setCpf] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [printedName, setPrintedName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [validity, setValidity] = useState('');
    const [cvv, setCvv] = useState<number>();
    const [installments, setInstallments] = useState('')
    const brazilStates: BrazilState[] = Object.values(BrazilState);
    const [isFormFilled, setIsFormFilled] = useState<boolean>(false)

    const checkPostalCode = async (e: any) => {
        e.preventDefault();

        try {
            const result = await axios.get(
                "https://viacep.com.br/ws/" + postalCode + "/json/"
            );
            setState(result.data.uf);
            setNeighborhood(result.data.bairro);
            setAddress(result.data.logradouro);
            setCity(result.data.localidade)
        } catch (err) {
            alert(err);
        }

    };

    const verificarFormularioPreenchido = () => {
       
        if (
            email.trim() !== '' &&
            phone.trim() !== '' &&
            bDay.trim() !== '' &&
            cpf.trim() !== '' &&
            postalCode.trim() !== '' &&
            address.trim() !== '' &&
            number.trim() !== '' &&
            neighborhood.trim() !== '' &&
            city.trim() !== '' &&
            state.trim() !== '' &&
            country.trim() !== '' &&
            printedName.trim() !== '' &&
            cardNumber.trim() !== '' &&
            validity.trim() !== '' &&
            cvv !== null 
            // && installments.trim() !== ''
            
        ) {
            // Se todos os campos estiverem preenchidos, atualize isFormFilled para true
            setIsFormFilled(true);
        } else {
            // Caso contrário, atualize isFormFilled para false
            setIsFormFilled(false);
        }
    };
    
    
    useEffect(() => {
        verificarFormularioPreenchido();
    }, [email, phone, bDay, cpf, postalCode, address, number, neighborhood, city, state, country, printedName, cardNumber, validity, cvv, installments]);

    
    return (
        <div className="fullpage" style={{ backgroundColor: '#d4d4d4' }}>
            <div className="grid">
                <div className="col-0 md:col-4" style={{ background: '#d4d4d4', height: '105vh' }} />
                <div className="col-12 md:col-4" style={{ background: 'white' }}>
                    <div className="formStyle">
                        <div className='grid'>
                            <div className='col-12'>
                                <h1>Pagamento com Cartão de Crédito</h1>
                            </div>
                            <div className='col-12'>
                                <h3>Você está pagando para {fulano}</h3>
                            </div>
                        </div>

                        <div className='grid' style={{ marginBottom: '2%' }}>
                            <div className='col-4'>
                                <h4>Valor</h4>
                            </div>
                            <div className='col-4'>
                                <h4>R$ {billingValue}</h4>
                            </div>
                        </div>

                        <form>
                            <div className='grid' style={{ margin: '2%' }}>
                                <div className='title' style={{ width: '100%' }}>
                                    <div className='grid'>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '1%' }}> <i className="pi pi-user" style={{ color: '#0088FF' }} /></div>
                                        <div className='col md:col-11'><h3>Informações Pessoais</h3></div>
                                    </div>
                                </div>

                                <div className='grid' style={{ width: '100%' }}>
                                    <div className='col-12 md:col-8' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >

                                            <InputText value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                                            <label htmlFor="email">E-mail</label>
                                        </span>
                                    </div>
                                    <div className='col-5 md:col-4' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputMask value={phone} unmask onChange={(e) => { setPhone(e.target.value!) }} mask="(99) 99999-9999" />
                                            <label htmlFor="phone">Celular</label>
                                        </span>
                                    </div>
                                    <div className='col-7 md:col-4' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >

                                            <InputMask value={bDay} unmask onChange={(e) => { setBDay(e.target.value!) }} mask="99/99/9999" />
                                            <label htmlFor="bDay">Data de nasc.</label>
                                        </span>
                                    </div>
                                    <div className='col-12 md:col-8' style={{ marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputMask value={cpf} unmask onChange={(e) => { setCpf(e.target.value!) }} mask="999.999.999-99" />
                                            <label htmlFor="cpf">CPF do titular</label>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='grid' style={{ margin: '2%' }}>
                                <div className='title' style={{ width: '100%' }}>
                                    <div className='grid'>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '1%' }}> <i className="pi pi-map-marker" style={{ color: '#0088FF' }} /></div>
                                        <div className='col md:col-11'><h3>Endereço</h3></div>
                                    </div>
                                </div>
                                <div className='grid' style={{ width: '100%' }}>

                                    <div className='col-10 md:col-4' style={{ margin: 0, marginTop: '2%' }}>

                                        <span className="p-float-label" >
                                            <InputMask value={postalCode} unmask onChange={(e) => { setPostalCode(e.target.value!) }} mask="99999-999" />
                                            <label htmlFor="postalCode">CEP</label>
                                        </span>
                                    </div>
                                    <div className='col-2 md:col-1' style={{ display: 'flex', alignItems: 'center', marginTop: '2%', justifyContent: 'center' }}>
                                        <Button icon="pi pi-search" style={{ background: 'white', color: '#0088FF', border: 0 }} onClick={(e) => checkPostalCode(e)} />
                                        {/* <i className="pi pi-search" style={{ color: '#0088FF' }} /> */}

                                    </div>
                                    <div className='col-12 md:col-7' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={address} onChange={(e) => setAddress(e.target.value)} />
                                            <label htmlFor="address">Endereço</label>
                                        </span>
                                    </div>

                                    <div className='col-6 md:col-3' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={number} onChange={(e) => setNumber(e.target.value)} />
                                            <label htmlFor="number">Número</label>
                                        </span>
                                    </div>
                                    <div className='col-6 md:col-4' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={complement} onChange={(e) => setComplement(e.target.value)} />
                                            <label htmlFor="complement">Complemento</label>
                                        </span>
                                    </div>
                                    <div className='col-12 md:col-5' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
                                            <label htmlFor="neighborhood">Bairro</label>
                                        </span>
                                    </div>

                                    <div className='col-12 md:col-3' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={city} onChange={(e) => setCity(e.target.value)} />
                                            <label htmlFor="city">Cidade</label>
                                        </span>
                                    </div>
                                    <div className='col-6 md:col-4' style={{ margin: 0, marginTop: '2%', height: '100%' }}>
                                        <span className="p-float-label" >
                                            <Dropdown value={state} id="state" onChange={(e) => { setState(e.target.value) }} options={brazilStates} style={{ minHeight: '100%' }}
                                            />
                                            <label htmlFor="state">Estado</label>
                                        </span>
                                    </div>
                                    <div className='col-6 md:col-5' style={{ margin: 0, marginTop: '2%' }}>
                                        <span className="p-float-label" >
                                            <InputText value={country} onChange={(e) => setCountry(e.target.value)} style={{ minHeight: '100%' }} />
                                            <label htmlFor="country">País</label>
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className='grid' style={{ margin: '2%' }}>

                                <div className='title' style={{ width: '100%' }}>
                                    <div className='grid'>
                                        <div style={{ display: 'flex', alignItems: 'center', padding: '1%' }}> <i className="pi pi-credit-card" style={{ color: '#0088FF' }} /></div>
                                        <div className='col md:col-11'><h3>Cartão de Crédito</h3></div>
                                    </div>
                                </div>
                                <div className='grid' style={{ width: '100%' }}>
                                    <div className='col-12 md:col-6' style={{ margin: 0, marginTop: '2%' }}>

                                        <span className="p-float-label" >
                                            <InputText value={printedName} onChange={(e) => setPrintedName(e.target.value)} style={{ minHeight: '100%' }} />
                                            <label htmlFor="printedName">Nome impresso no cartão</label>
                                        </span>
                                    </div>
                                    <div className='col-12 md:col-6' style={{ margin: 0, marginTop: '2%' }}>

                                        <span className="p-float-label" >
                                            <InputMask value={cardNumber} unmask onChange={(e) => { setCardNumber(e.target.value!) }} mask="9999 9999 9999 9999" />
                                            <label htmlFor="cardNumber">Nº do cartão</label>
                                        </span>
                                    </div>
                                    <div className='col-6 md:col-3' style={{ margin: 0, marginTop: '2%' }}>

                                        <span className="p-float-label" >
                                            <InputMask value={validity} unmask onChange={(e) => { setValidity(e.target.value!) }} mask="99/99" />
                                            <label htmlFor="validity">Validade</label>
                                        </span>
                                    </div>
                                    <div className='col-6 md:col-3' style={{ margin: 0, marginTop: '2%' }}>

                                        <span className="p-float-label" >
                                            <InputNumber value={cvv} onValueChange={(e) => setCvv(e.value!)} placeholder='123' useGrouping={false} maxLength={5} />
                                            <label htmlFor="cvv">CVV</label>
                                        </span>
                                    </div>
                                    <div className='col-12 md:col-6' style={{ margin: 0, marginTop: '2%', height: '100%' }}>
                                        <span className="p-float-label" >
                                            <Dropdown value={installments} id="installment" onChange={(e) => { setInstallments(e.target.value) }} style={{ minHeight: '100%' }}
                                            />
                                            <label htmlFor="installments">Nº de parcelas</label>
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <div className='grid' style={{   width: '100%' }}>

                                <div className='col md:col-4' />

                                <div className='col-12 md:col-4'>
                                    <Button label="Confirmar pagamento" disabled={!isFormFilled} style={{borderRadius: '60px', width: '100%', backgroundColor: isFormFilled ? '' : 'gray', border: isFormFilled ? '' : 0}} />
                                </div>

                                <div className='col md:col-4' />

                            </div>
                        </form>
                    </div>
                </div>


                <div className="col-0 md:col-3" style={{ background: '#d4d4d4' }} />
            </div>
        </div>
    )


}