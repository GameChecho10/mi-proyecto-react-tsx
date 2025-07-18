import React, { useState } from 'react';
import { Check, Luggage, Utensils, Plane, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlightType {
  id: string;
  name: string;
  color: string;
  priceMultiplier: number;
  features: Array<{
    icon: React.ReactNode;
    text: string;
    included: boolean;
  }>;
  isRecommended?: boolean;
}

interface FlightTypeSelectionProps {
  basePrice: number;
  onSelect: (flightType: FlightType & { price: number }) => void;
}

const FlightTypeSelection = ({ basePrice, onSelect }: FlightTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<string>('classic');

  const flightTypes: FlightType[] = [
    {
      id: 'basic',
      name: 'Basic',
      color: 'red',
      priceMultiplier: 1.0, // Sin incremento
      features: [
        { icon: <Luggage className="w-4 h-4" />, text: '1 artículo personal (bolso)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: 'Acumula 3 lifemiles por cada USD', included: true },
        { icon: <Utensils className="w-4 h-4" />, text: 'No incluye servicios adicionales', included: false },
        { icon: <Utensils className="w-4 h-4" />, text: 'Menú a bordo', included: false },
        { icon: <CreditCard className="w-4 h-4" />, text: 'Cambios (antes del vuelo)', included: false },
        { icon: <CreditCard className="w-4 h-4" />, text: 'Reembolso', included: false },
      ]
    },
    {
      id: 'classic',
      name: 'Classic',
      color: 'purple',
      priceMultiplier: 1.2, // 20% de incremento
      isRecommended: true,
      features: [
        { icon: <Luggage className="w-4 h-4" />, text: '1 artículo personal (bolso)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: '1 equipaje de mano (10 kg)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: '1 equipaje de bodega (23 kg)', included: true },
        { icon: <Plane className="w-4 h-4" />, text: 'Check-in en aeropuerto', included: true },
        { icon: <Plane className="w-4 h-4" />, text: 'Asiento Economy incluido', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: 'Acumula 6 lifemiles por cada USD', included: true },
      ]
    },
    {
      id: 'flex',
      name: 'Flex',
      color: 'orange',
      priceMultiplier: 1.4, // 40% de incremento
      features: [
        { icon: <Luggage className="w-4 h-4" />, text: '1 artículo personal (bolso)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: '1 equipaje de mano (10 kg)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: '1 equipaje de bodega (23 kg)', included: true },
        { icon: <Plane className="w-4 h-4" />, text: 'Check-in en aeropuerto', included: true },
        { icon: <Plane className="w-4 h-4" />, text: 'Asiento Plus (sujeto a disponibilidad)', included: true },
        { icon: <Luggage className="w-4 h-4" />, text: 'Acumula 8 lifemiles por cada USD', included: true },
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculatePrice = (multiplier: number) => {
    return Math.round(basePrice * multiplier);
  };

  const getCardClass = (type: FlightType) => {
    const baseClass = "relative border-2 rounded-lg p-6 cursor-pointer transition-all ";
    
    if (selectedType === type.id) {
      return baseClass + `border-${type.color}-500 bg-${type.color}-50`;
    }
    
    return baseClass + "border-gray-200 hover:border-gray-300";
  };

  const getButtonClass = (type: FlightType) => {
    if (type.color === 'red') return "bg-red-600 hover:bg-red-700 text-white";
    if (type.color === 'purple') return "bg-purple-600 hover:bg-purple-700 text-white";
    if (type.color === 'orange') return "bg-orange-600 hover:bg-orange-700 text-white";
    return "bg-gray-600 hover:bg-gray-700 text-white";
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-sky-50 to-blue-50 min-h-screen">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <span>06:00</span>
            <div className="mx-4 flex-1 border-t-2 border-dotted border-gray-300 relative">
              <Plane className="w-4 h-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-gray-600" />
            </div>
            <span>07:41</span>
          </div>
        </div>
        <div className="text-sm text-gray-600 mb-2">BOG → BAQ</div>
        <div className="text-sm text-gray-500 mb-4">Operado por Avianca</div>
        
        <h2 className="text-3xl font-bold mb-4 text-gray-800">Elige cómo quieres volar</h2>
        <div className="flex justify-center">
          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">Mejor precio garantizado</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {flightTypes.map((type) => (
          <div key={type.id} className={getCardClass(type)} onClick={() => setSelectedType(type.id)}>
            {type.isRecommended && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Recomendada
                </span>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold text-${type.color}-600`}>{type.name}</h3>
              <div className="flex gap-2">
                {type.color === 'red' && <div className="w-6 h-6 bg-red-600 rounded"></div>}
                {type.color === 'purple' && (
                  <>
                    <div className="w-6 h-6 bg-purple-600 rounded"></div>
                    <div className="w-6 h-6 bg-purple-400 rounded"></div>
                    <div className="w-6 h-6 bg-purple-300 rounded"></div>
                  </>
                )}
                {type.color === 'orange' && (
                  <>
                    <div className="w-6 h-6 bg-orange-600 rounded"></div>
                    <div className="w-6 h-6 bg-orange-400 rounded"></div>
                    <div className="w-6 h-6 bg-orange-300 rounded"></div>
                    <div className="w-6 h-6 bg-orange-200 rounded"></div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {type.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`text-${type.color}-600`}>
                    {feature.icon}
                  </div>
                  <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400'}`}>
                    {feature.text}
                  </span>
                  {feature.included ? (
                    <Check className="w-4 h-4 text-green-500 ml-auto" />
                  ) : (
                    <span className="w-4 h-4 text-red-500 ml-auto">×</span>
                  )}
                </div>
              ))}
            </div>

            <Button className={`w-full ${getButtonClass(type)} text-lg font-semibold py-3`}>
              {formatPrice(calculatePrice(type.priceMultiplier))}
            </Button>
            <p className="text-center text-sm text-gray-500 mt-2">Precio por pasajero</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={() => {
            const selected = flightTypes.find(type => type.id === selectedType);
            if (selected) {
              const price = calculatePrice(selected.priceMultiplier);
              onSelect({ ...selected, price });
            }
          }}
          className="bg-red-600 hover:bg-red-700 px-10 py-4 text-lg font-semibold rounded-xl shadow-lg"
        >
          Continuar con {flightTypes.find(type => type.id === selectedType)?.name}
        </Button>
      </div>
    </div>
  );
};

export default FlightTypeSelection;
