
import React, { useState } from 'react';
import { X, User, Calendar, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
  nationality: string;
  day: string;
  month: string;
  year: string;
  phone: string;
  phonePrefix: string;
}

interface PassengerDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  passengerCount: number;
  onContinueToPayment: (passengers: PassengerData[], flight: Flight) => void;
}

const PassengerDataModal = ({ isOpen, onClose, flight, passengerCount, onContinueToPayment }: PassengerDataModalProps) => {
  // Inicializar array de pasajeros basado en passengerCount
  const initializePassengers = () => {
    return Array.from({ length: passengerCount }, () => ({
      firstName: '',
      lastName: '',
      idType: 'CC',
      idNumber: '',
      birthDate: '',
      gender: 'M',
      nationality: 'CO',
      day: '',
      month: '',
      year: '',
      phone: '',
      phonePrefix: '+57'
    }));
  };

  const [passengers, setPassengers] = useState<PassengerData[]>(initializePassengers());
  const [saveForFuture, setSaveForFuture] = useState(false);
  const [reservationHolder, setReservationHolder] = useState(0);

  // Actualizar pasajeros cuando cambie passengerCount
  React.useEffect(() => {
    console.log('Passenger count changed to:', passengerCount);
    const newPassengers = Array.from({ length: passengerCount }, (_, index) => 
      passengers[index] || {
        firstName: '',
        lastName: '',
        idType: 'CC',
        idNumber: '',
        birthDate: '',
        gender: 'M',
        nationality: 'CO',
        day: '',
        month: '',
        year: '',
        phone: '',
        phonePrefix: '+57'
      }
    );
    setPassengers(newPassengers);
    
    // Ajustar reservationHolder si es necesario
    if (reservationHolder >= passengerCount) {
      setReservationHolder(0);
    }
  }, [passengerCount]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handlePassengerChange = (index: number, field: keyof PassengerData, value: string) => {
    console.log(`Updating passenger ${index}, field ${field}, value:`, value);
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    
    // Actualizar birthDate si es un campo de fecha
    if (field === 'day' || field === 'month' || field === 'year') {
      const passenger = updatedPassengers[index];
      if (passenger.day && passenger.month && passenger.year) {
        updatedPassengers[index].birthDate = `${passenger.year}-${passenger.month.padStart(2, '0')}-${passenger.day.padStart(2, '0')}`;
      }
    }
    
    setPassengers(updatedPassengers);
  };

  const isFormValid = () => {
    const allPassengersValid = passengers.every(passenger => 
      passenger.firstName.trim() !== '' && 
      passenger.lastName.trim() !== '' && 
      passenger.day !== '' && 
      passenger.month !== '' && 
      passenger.year !== '' &&
      passenger.nationality !== ''
    );
    
    // Verificar que el titular de la reserva tenga teléfono
    const holderHasPhone = passengers[reservationHolder]?.phone?.trim() !== '';
    
    console.log('Form validation:', { allPassengersValid, holderHasPhone, passengerCount: passengers.length });
    return allPassengersValid && holderHasPhone;
  };

  const handleContinue = () => {
    if (flight && isFormValid()) {
      console.log('Continuing with passengers:', passengers);
      onContinueToPayment(passengers, flight);
    } else {
      console.log('Form is not valid or flight is null');
      console.log('Flight:', flight);
      console.log('Form valid:', isFormValid());
      console.log('Passengers:', passengers);
    }
  };

  if (!isOpen || !flight) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-gray-50">
          <div className="flex items-center gap-4">
            <img src="/lovable-uploads/a561e099-194d-42a7-8a35-6a982e383bdf.png" alt="Avianca" className="h-8" />
            <div>
              <h2 className="text-lg font-bold text-gray-800">{flight.from} a {flight.to}</h2>
              <p className="text-sm text-gray-600">Paso 3 de 5 - {passengerCount} pasajero{passengerCount > 1 ? 's' : ''}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-lg font-bold">{formatPrice(flight.price * passengerCount)}</div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {/* Progress bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">Datos de {passengerCount} pasajero{passengerCount > 1 ? 's' : ''}</h2>
          <p className="text-gray-600 mb-6">
            Ingresa el primer nombre y primer apellido (de cada pasajero) tal y como aparecen en el pasaporte o documento de identidad.
          </p>

          {/* Checkbox para guardar información */}
          <div className="flex items-center gap-2 mb-6">
            <input
              type="checkbox"
              id="saveInfo"
              checked={saveForFuture}
              onChange={(e) => setSaveForFuture(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="saveInfo" className="text-sm text-gray-700">
              Guardar información para futuras compras
            </label>
          </div>

          {/* Formulario de pasajeros */}
          <div className="space-y-8">
            {passengers.map((passenger, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gray-50">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-semibold">
                    Pasajero {index + 1}:
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`gender-${index}`}>Género*</Label>
                    <select
                      id={`gender-${index}`}
                      value={passenger.gender}
                      onChange={(e) => handlePassengerChange(index, 'gender', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="M">Masculino</option>
                      <option value="F">Femenino</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor={`firstName-${index}`}>Nombre*</Label>
                    <Input
                      id={`firstName-${index}`}
                      value={passenger.firstName}
                      onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                      placeholder="Nombre"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`lastName-${index}`}>Apellido*</Label>
                    <Input
                      id={`lastName-${index}`}
                      value={passenger.lastName}
                      onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                      placeholder="Apellido"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <Label htmlFor={`birthDate-${index}`}>
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Fecha de nacimiento*
                    </Label>
                    <div className="grid grid-cols-3 gap-2">
                      <select 
                        value={passenger.day}
                        onChange={(e) => handlePassengerChange(index, 'day', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                      >
                        <option value="">Día</option>
                        {Array.from({ length: 31 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                      <select 
                        value={passenger.month}
                        onChange={(e) => handlePassengerChange(index, 'month', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                      >
                        <option value="">Mes</option>
                        {['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((month, i) => (
                          <option key={i} value={i + 1}>{month}</option>
                        ))}
                      </select>
                      <select 
                        value={passenger.year}
                        onChange={(e) => handlePassengerChange(index, 'year', e.target.value)}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-2 py-2 text-sm"
                      >
                        <option value="">Año</option>
                        {Array.from({ length: 100 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return <option key={year} value={year}>{year}</option>
                        })}
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`nationality-${index}`}>
                      <Globe className="w-4 h-4 inline mr-1" />
                      Nacionalidad de tu documento de viaje*
                    </Label>
                    <select
                      id={`nationality-${index}`}
                      value={passenger.nationality}
                      onChange={(e) => handlePassengerChange(index, 'nationality', e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="CO">Colombia</option>
                      <option value="US">Estados Unidos</option>
                      <option value="ES">España</option>
                      <option value="MX">México</option>
                      <option value="AR">Argentina</option>
                      <option value="PE">Perú</option>
                      <option value="EC">Ecuador</option>
                      <option value="BR">Brasil</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Titular de la reserva */}
          <div className="border rounded-lg p-6 mt-6 bg-blue-50">
            <h4 className="font-semibold mb-4">Titular de la reserva</h4>
            <p className="text-sm text-gray-600 mb-4">
              Será la persona que recibirá la confirmación de la reserva y la única autorizada para solicitar cambios o reembolsos.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Pasajero*</Label>
                <select 
                  value={reservationHolder}
                  onChange={(e) => setReservationHolder(parseInt(e.target.value))}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {passengers.map((_, index) => (
                    <option key={index} value={index}>Pasajero {index + 1}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label>Prefijo*</Label>
                <select 
                  value={passengers[reservationHolder]?.phonePrefix || '+57'}
                  onChange={(e) => handlePassengerChange(reservationHolder, 'phonePrefix', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="+57">+57 (Colombia)</option>
                  <option value="+1">+1 (Estados Unidos)</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Teléfono*</Label>
              <Input
                value={passengers[reservationHolder]?.phone || ''}
                onChange={(e) => handlePassengerChange(reservationHolder, 'phone', e.target.value)}
                placeholder="Número de teléfono"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleContinue}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3"
              disabled={!isFormValid()}
            >
              Continuar ({passengerCount} pasajero{passengerCount > 1 ? 's' : ''})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDataModal;
