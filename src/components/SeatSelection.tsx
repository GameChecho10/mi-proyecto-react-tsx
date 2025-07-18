import React, { useState } from 'react';
import { X, Plane, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SeatSelectionProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (selectedSeats: string[]) => void;
  passengerCount: number;
}

const SeatSelection = ({ isOpen, onClose, onContinue, passengerCount }: SeatSelectionProps) => {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const generateSeats = () => {
    const seats = [];
    const rows = 26;
    const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let row = 1; row <= rows; row++) {
      for (let seatLetter of seatsPerRow) {
        const seatId = `${row}${seatLetter}`;
        const isUnavailable = Math.random() < 0.3;
        const isPremium = row <= 5;
        const isEmergency = row === 12 || row === 13;
        
        seats.push({
          id: seatId,
          row,
          letter: seatLetter,
          isUnavailable,
          isPremium,
          isEmergency,
          price: isPremium ? 86000 : isEmergency ? 47000 : 22000
        });
      }
    }
    return seats;
  };

  const seats = generateSeats();

  const handleSeatClick = (seatId: string, isUnavailable: boolean) => {
    if (isUnavailable) return;
    
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(seat => seat !== seatId));
    } else if (selectedSeats.length < passengerCount) {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const getSeatClass = (seat: any) => {
    let baseClass = "w-10 h-10 rounded-lg border-2 cursor-pointer flex items-center justify-center text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md ";
    
    if (seat.isUnavailable) {
      return baseClass + "bg-gray-400 border-gray-500 cursor-not-allowed text-white";
    }
    
    if (selectedSeats.includes(seat.id)) {
      return baseClass + "bg-green-500 border-green-600 text-white scale-110 shadow-lg";
    }
    
    if (seat.isPremium) {
      return baseClass + "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-400 text-purple-800 hover:from-purple-200 hover:to-purple-300";
    }
    
    if (seat.isEmergency) {
      return baseClass + "bg-gradient-to-br from-orange-100 to-orange-200 border-orange-400 text-orange-800 hover:from-orange-200 hover:to-orange-300";
    }
    
    return baseClass + "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 text-blue-800 hover:from-blue-100 hover:to-blue-200";
  };

  const totalPrice = selectedSeats.reduce((total, seatId) => {
    const seat = seats.find(s => s.id === seatId);
    return total + (seat ? seat.price : 0);
  }, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-8 border-b bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl">
          <div>
            <h2 className="text-2xl font-bold">Selecciona tus asientos</h2>
            <p className="text-red-100 flex items-center gap-2 mt-1">
              <Plane className="w-4 h-4" />
              BOG - BAQ | Economy
            </p>
          </div>
          <button onClick={onClose} className="text-white hover:text-red-200 transition-colors">
            <X className="w-8 h-8" />
          </button>
        </div>

        <div className="p-8">
          <div className="flex gap-10">
            {/* Leyenda mejorada */}
            <div className="w-80">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg border">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Leyenda de asientos
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-green-500 rounded-lg border-2 border-green-600 shadow-md"></div>
                    <span className="text-sm font-medium">Asiento seleccionado</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gray-400 rounded-lg border-2 border-gray-500 shadow-md"></div>
                    <span className="text-sm">Asiento no disponible</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg border-2 border-purple-400 shadow-md"></div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Premium</span>
                      <div className="text-xs text-purple-600 font-semibold">{formatPrice(86000)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg border-2 border-orange-400 shadow-md"></div>
                    <div className="flex-1">
                      <span className="text-sm font-medium">Salida de emergencia</span>
                      <div className="text-xs text-orange-600 font-semibold">{formatPrice(47000)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-300 shadow-md"></div>
                    <div className="flex-1">
                      <span className="text-sm">Economy</span>
                      <div className="text-xs text-blue-600 font-semibold">{formatPrice(22000)}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">Resumen de selección</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    Asientos seleccionados: {selectedSeats.length}/{passengerCount}
                  </p>
                  <p className="text-sm font-semibold text-blue-800 mt-1">
                    Total asientos: {formatPrice(totalPrice)}
                  </p>
                </div>
              </div>
            </div>

            {/* Mapa de asientos mejorado */}
            <div className="flex-1">
              <div className="bg-gradient-to-b from-sky-50 to-white rounded-2xl p-8 shadow-lg border">
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl shadow-lg">
                    <Plane className="w-8 h-8 mx-auto mb-1" />
                    <div className="text-xs font-semibold">AVIANCA</div>
                  </div>
                </div>
                
                <div className="grid gap-2 max-w-md mx-auto">
                  {Array.from({ length: 26 }, (_, rowIndex) => (
                    <div key={rowIndex + 1} className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-600 w-8 text-center bg-gray-100 rounded-md py-1">
                        {rowIndex + 1}
                      </span>
                      <div className="flex gap-2">
                        {['A', 'B', 'C'].map(letter => {
                          const seat = seats.find(s => s.row === rowIndex + 1 && s.letter === letter);
                          return seat ? (
                            <button
                              key={seat.id}
                              className={getSeatClass(seat)}
                              onClick={() => handleSeatClick(seat.id, seat.isUnavailable)}
                              disabled={seat.isUnavailable}
                              title={`Asiento ${seat.id} - ${seat.isPremium ? 'Premium' : seat.isEmergency ? 'Emergencia' : 'Economy'} - ${formatPrice(seat.price)}`}
                            >
                              {seat.isUnavailable ? '×' : seat.letter}
                            </button>
                          ) : null;
                        })}
                      </div>
                      <div className="w-8 bg-gray-200 h-6 rounded flex items-center justify-center">
                        <div className="w-4 h-0.5 bg-gray-400"></div>
                      </div>
                      <div className="flex gap-2">
                        {['D', 'E', 'F'].map(letter => {
                          const seat = seats.find(s => s.row === rowIndex + 1 && s.letter === letter);
                          return seat ? (
                            <button
                              key={seat.id}
                              className={getSeatClass(seat)}
                              onClick={() => handleSeatClick(seat.id, seat.isUnavailable)}
                              disabled={seat.isUnavailable}
                              title={`Asiento ${seat.id} - ${seat.isPremium ? 'Premium' : seat.isEmergency ? 'Emergencia' : 'Economy'} - ${formatPrice(seat.price)}`}
                            >
                              {seat.isUnavailable ? '×' : seat.letter}
                            </button>
                          ) : null;
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-center bg-gray-50 p-6 rounded-xl">
            <Button onClick={onClose} variant="outline" className="px-8 py-3">
              Atrás
            </Button>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                Total asientos: {formatPrice(totalPrice)}
              </p>
              <Button 
                onClick={() => onContinue(selectedSeats)}
                className="bg-red-600 hover:bg-red-700 mt-3 px-8 py-3 text-lg font-semibold rounded-xl"
                disabled={selectedSeats.length !== passengerCount}
              >
                Continuar ({selectedSeats.length}/{passengerCount} asientos)
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
