import React, { createContext, useState, ReactNode, useContext } from 'react';

interface CheckoutContextProps {
    paymentData: any;
    setPaymentData: (data: any) => void;
}

const CheckoutContext = createContext<CheckoutContextProps | undefined>(undefined);

export const CheckoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [paymentData, setPaymentData] = useState<any>(null);

    return (
        <CheckoutContext.Provider value={{ paymentData, setPaymentData }}>
            {children}
        </CheckoutContext.Provider>
    );
};

export const useCheckout = () => {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
};
