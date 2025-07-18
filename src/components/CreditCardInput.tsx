import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Lock } from 'lucide-react';

interface CreditCardInputProps {
  onCardChange: (cardData: {
    number: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
    cardType: string;
  }) => void;
}

const CreditCardInput = ({ onCardChange }: CreditCardInputProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardType, setCardType] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const cardTypeConfigs = {
    visa: { digits: 16, cvvLength: 3, prefix: /^4/ },
    mastercard: { digits: 16, cvvLength: 3, prefix: /^5[1-5]|^2[2-7]/ },
    amex: { digits: 15, cvvLength: 4, prefix: /^3[47]/ }
  };

  const detectCardType = (number: string) => {
    const cleanNumber = number.replace(/\s/g, '');
    
    if (cardTypeConfigs.visa.prefix.test(cleanNumber)) {
      return 'visa';
    } else if (cardTypeConfigs.mastercard.prefix.test(cleanNumber)) {
      return 'mastercard';
    } else if (cardTypeConfigs.amex.prefix.test(cleanNumber)) {
      return 'amex';
    }
    return '';
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const type = detectCardType(v);
    const maxDigits = type ? cardTypeConfigs[type as keyof typeof cardTypeConfigs].digits : 16;
    
    const truncated = v.substring(0, maxDigits);
    const parts = [];

    if (type === 'amex') {
      // Amex format: XXXX XXXXXX XXXXX
      for (let i = 0; i < truncated.length; i += (i === 0 ? 4 : i === 4 ? 6 : 5)) {
        const partLength = i === 0 ? 4 : i === 4 ? 6 : 5;
        parts.push(truncated.substring(i, i + partLength));
      }
    } else {
      // Visa/Mastercard format: XXXX XXXX XXXX XXXX
      for (let i = 0; i < truncated.length; i += 4) {
        parts.push(truncated.substring(i, i + 4));
      }
    }

    return parts.join(' ');
  };

  const isCardExpired = (month: string, year: string) => {
    if (!month || !year || month.length !== 2 || year.length !== 4) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expYear = parseInt(year);
    const expMonth = parseInt(month);
    
    if (expYear < currentYear) return true;
    if (expYear === currentYear && expMonth < currentMonth) return true;
    
    return false;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatCardNumber(value);
    const type = detectCardType(formattedValue);
    
    // Validar longitud específica por tipo de tarjeta
    const cleanNumber = formattedValue.replace(/\s/g, '');
    let error = '';
    
    if (type && cleanNumber.length > 0) {
      const expectedLength = cardTypeConfigs[type as keyof typeof cardTypeConfigs].digits;
      if (cleanNumber.length < expectedLength) {
        error = `La tarjeta ${type.toUpperCase()} debe tener ${expectedLength} dígitos`;
      }
    } else if (cleanNumber.length > 0 && !type) {
      error = 'Tipo de tarjeta no válido';
    }
    
    setCardNumber(formattedValue);
    setCardType(type);
    setErrors(prev => ({ ...prev, cardNumber: error }));
    
    onCardChange({
      number: formattedValue,
      expiryMonth,
      expiryYear,
      cvv,
      cardType: type
    });
  };

  const handleExpiryMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12 && value.length <= 2)) {
      const formattedMonth = value.length === 1 && parseInt(value) > 1 ? '0' + value : value;
      setExpiryMonth(formattedMonth);
      
      // Validar si está vencida
      let error = '';
      if (formattedMonth.length === 2 && expiryYear.length === 4) {
        if (isCardExpired(formattedMonth, expiryYear)) {
          error = 'La tarjeta está vencida';
        }
      }
      
      setErrors(prev => ({ ...prev, expiry: error }));
      
      onCardChange({
        number: cardNumber,
        expiryMonth: formattedMonth,
        expiryYear,
        cvv,
        cardType
      });
    }
  };

  const handleExpiryYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 4) {
      setExpiryYear(value);
      
      // Validar si está vencida
      let error = '';
      if (value.length === 4 && expiryMonth.length === 2) {
        if (isCardExpired(expiryMonth, value)) {
          error = 'La tarjeta está vencida';
        }
      }
      
      setErrors(prev => ({ ...prev, expiry: error }));
      
      onCardChange({
        number: cardNumber,
        expiryMonth,
        expiryYear: value,
        cvv,
        cardType
      });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const maxLength = cardType === 'amex' ? 4 : 3;
    
    if (value.length <= maxLength) {
      setCvv(value);
      onCardChange({
        number: cardNumber,
        expiryMonth,
        expiryYear,
        cvv: value,
        cardType
      });
    }
  };

  const getCardIcon = () => {
    switch (cardType) {
      case 'visa':
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-bold rounded-md shadow-md">
            VISA
          </div>
        );
      case 'mastercard':
        return (
          <div className="flex items-center justify-center w-12 h-8 rounded-md shadow-md overflow-hidden">
            <div className="w-6 h-6 bg-red-500 rounded-full opacity-90"></div>
            <div className="w-6 h-6 bg-yellow-400 rounded-full -ml-3 opacity-90"></div>
          </div>
        );
      case 'amex':
        return (
          <div className="flex items-center justify-center w-12 h-8 bg-gradient-to-r from-green-600 to-green-700 text-white text-xs font-bold rounded-md shadow-md">
            AMEX
          </div>
        );
      default:
        return (
          <div className="w-12 h-8 bg-gray-200 rounded-md flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-gray-400" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Información de la tarjeta</h3>
        <p className="text-sm text-gray-600">Ingresa los datos de tu tarjeta de crédito de forma segura</p>
      </div>

      <div>
        <Label htmlFor="cardNumber" className="text-sm font-medium text-gray-700">Número de tarjeta*</Label>
        <div className="relative mt-1">
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            maxLength={cardType === 'amex' ? 17 : 19}
            className={`pr-16 h-12 text-lg ${errors.cardNumber ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getCardIcon()}
          </div>
        </div>
        {errors.cardNumber && (
          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
            <span className="w-4 h-4 text-red-500">⚠</span>
            {errors.cardNumber}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="expiryMonth" className="text-sm font-medium text-gray-700">Mes de vencimiento*</Label>
          <Input
            id="expiryMonth"
            value={expiryMonth}
            onChange={handleExpiryMonthChange}
            placeholder="MM"
            maxLength={2}
            className={`mt-1 h-12 text-lg ${errors.expiry ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
        </div>
        <div>
          <Label htmlFor="expiryYear" className="text-sm font-medium text-gray-700">Año de vencimiento*</Label>
          <Input
            id="expiryYear"
            value={expiryYear}
            onChange={handleExpiryYearChange}
            placeholder="YYYY"
            maxLength={4}
            className={`mt-1 h-12 text-lg ${errors.expiry ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
          />
        </div>
      </div>
      {errors.expiry && (
        <p className="text-red-500 text-sm flex items-center gap-1">
          <span className="w-4 h-4 text-red-500">⚠</span>
          {errors.expiry}
        </p>
      )}

      <div>
        <Label htmlFor="cvv" className="text-sm font-medium text-gray-700">CVV*</Label>
        <Input
          id="cvv"
          value={cvv}
          onChange={handleCvvChange}
          placeholder={cardType === 'amex' ? '1234' : '123'}
          maxLength={cardType === 'amex' ? 4 : 3}
          className="w-32 mt-1 h-12 text-lg focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <Lock className="w-3 h-3" />
          {cardType === 'amex' ? '4 dígitos en el frente de la tarjeta' : '3 dígitos en el reverso de la tarjeta'}
        </p>
      </div>
    </div>
  );
};

export default CreditCardInput;
