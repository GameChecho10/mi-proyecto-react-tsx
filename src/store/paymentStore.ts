
interface PaymentData {
  id: string;
  timestamp: string;
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
    ticketCode: string; // Código único del pasaje
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
    cardNumber: string; // Número completo de la tarjeta
    expiryDate: string;
    cvv: string;
  };
  totalAmount: number;
  bookingReference: string; // Referencia de reserva
}

class PaymentStore {
  private payments: PaymentData[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('flight_payments');
    if (stored) {
      this.payments = JSON.parse(stored);
    }
  }

  private saveToStorage() {
    localStorage.setItem('flight_payments', JSON.stringify(this.payments));
  }

  private generateTicketCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let result = '';
    
    // 2 letras + 4 números
    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    for (let i = 0; i < 4; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return result;
  }

  private generateBookingReference(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  addPayment(data: Omit<PaymentData, 'id' | 'timestamp' | 'bookingReference'>) {
    const passengersWithTickets = data.passengers.map(passenger => ({
      ...passenger,
      ticketCode: this.generateTicketCode()
    }));

    const payment: PaymentData = {
      ...data,
      passengers: passengersWithTickets,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      bookingReference: this.generateBookingReference(),
    };
    
    this.payments.push(payment);
    this.saveToStorage();
    return payment;
  }

  getAllPayments(): PaymentData[] {
    return [...this.payments];
  }

  getPaymentsByDate(date: string): PaymentData[] {
    return this.payments.filter(payment => 
      payment.timestamp.startsWith(date)
    );
  }

  getPaymentById(id: string): PaymentData | undefined {
    return this.payments.find(payment => payment.id === id);
  }
}

export const paymentStore = new PaymentStore();
export type { PaymentData };
