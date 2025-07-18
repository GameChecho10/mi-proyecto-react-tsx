
import React from 'react';
import { Button } from '@/components/ui/button';

interface FlightOffer {
  id: number;
  destination: string;
  origin: string;
  price: number;
  duration: string;
  departure: string;
  airline: string;
  image: string;
  originalPrice: number;
  discountPercentage: number;
}

interface FlightOffersEnhancedProps {
  onBookFlight: (offer: FlightOffer, passengers: number) => void;
}

const FlightOffersEnhanced = ({ onBookFlight }: FlightOffersEnhancedProps) => {
  const generateDynamicPrice = (id: number) => {
    const today = new Date().toDateString();
    const seed = today + id;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const normalizedHash = Math.abs(hash) / 2147483647;
    return Math.floor(89990 + (normalizedHash * 30000));
  };

  const generateDynamicDiscount = (id: number) => {
    const today = new Date().toDateString();
    const seed = today + id + 'discount';
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const normalizedHash = Math.abs(hash) / 2147483647;
    return Math.floor(70 + (normalizedHash * 5));
  };

  const flightOffers: FlightOffer[] = [
    {
      id: 1,
      destination: "Barranquilla",
      origin: "Bogotá",
      price: generateDynamicPrice(1),
      duration: "1h 41m",
      departure: "06:00",
      airline: "Avianca",
      image: "/lovable-uploads/4f43ae2a-53c9-4095-95e9-502ded7113bd.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(1)
    },
    {
      id: 2,
      destination: "Santa Marta",
      origin: "Bogotá", 
      price: generateDynamicPrice(2),
      duration: "1h 55m",
      departure: "07:30",
      airline: "Avianca",
      image: "/lovable-uploads/43ee0828-458a-4094-9d24-46c5eb26bb55.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(2)
    },
    {
      id: 3,
      destination: "Cartagena",
      origin: "Bogotá",
      price: generateDynamicPrice(3),
      duration: "1h 50m", 
      departure: "09:15",
      airline: "Avianca",
      image: "/lovable-uploads/d74feb2c-0904-45b2-a575-654ab0ddac5b.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(3)
    },
    {
      id: 4,
      destination: "Bucaramanga",
      origin: "Bogotá",
      price: generateDynamicPrice(4),
      duration: "1h 15m",
      departure: "08:45",
      airline: "Avianca", 
      image: "/lovable-uploads/37bcd459-8cc6-445a-960d-1e8fbaf54e22.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(4)
    },
    {
      id: 5,
      destination: "Armenia",
      origin: "Bogotá",
      price: generateDynamicPrice(5),
      duration: "1h 10m",
      departure: "10:20",
      airline: "Avianca",
      image: "/lovable-uploads/c5dc81f4-ce4e-4a1c-9652-125ee0f614f3.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(5)
    },
    {
      id: 6,
      destination: "San Andrés",
      origin: "Bogotá",
      price: generateDynamicPrice(6),
      duration: "2h 20m",
      departure: "11:30",
      airline: "Avianca",
      image: "/lovable-uploads/fe8b3496-e60b-4429-91b4-901b72e1c17c.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(6)
    },
    {
      id: 7,
      destination: "Medellín",
      origin: "Bogotá",
      price: generateDynamicPrice(7),
      duration: "1h 10m",
      departure: "10:00",
      airline: "Avianca",
      image: "/lovable-uploads/800d6c22-1da3-4ab9-a3ea-f96d7de68822.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(7)
    },
    {
      id: 8,
      destination: "Cali",
      origin: "Bogotá",
      price: generateDynamicPrice(8),
      duration: "1h 10m",
      departure: "16:45",
      airline: "Avianca",
      image: "/lovable-uploads/74f6f11b-1331-491d-96b8-865c26340c71.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(8)
    },
    {
      id: 9,
      destination: "Cúcuta",
      origin: "Bogotá",
      price: generateDynamicPrice(9),
      duration: "1h 20m",
      departure: "12:15",
      airline: "Avianca",
      image: "/lovable-uploads/7562c7b3-7343-460a-8605-6f8c33d5064d.png",
      originalPrice: 0,
      discountPercentage: generateDynamicDiscount(9)
    }
  ];

  flightOffers.forEach(offer => {
    offer.originalPrice = Math.floor(offer.price / (1 - offer.discountPercentage / 100));
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Destinos populares desde Bogotá
          </h2>
          <p className="text-gray-600 text-lg">
            Descubre los mejores precios para tus destinos favoritos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {flightOffers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="relative h-48 md:h-56">
                <img 
                  src={offer.image} 
                  alt={offer.destination}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  {offer.discountPercentage}% DESCUENTO
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{offer.destination}</h3>
                </div>
              </div>
              
              <div className="p-4 md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-gray-600 text-sm md:text-base">Por trayecto desde</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl md:text-2xl font-bold text-red-600">
                      {formatPrice(offer.price)}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 line-through">
                      {formatPrice(offer.originalPrice)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Salida:</span>
                    <span className="font-medium">{offer.departure}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duración:</span>
                    <span className="font-medium">{offer.duration}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Aerolínea:</span>
                    <span className="font-medium">{offer.airline}</span>
                  </div>
                </div>

                <Button 
                  onClick={() => onBookFlight(offer, 1)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Reservar vuelo
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightOffersEnhanced;
