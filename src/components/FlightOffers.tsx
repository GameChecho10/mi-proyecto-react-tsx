
import React from 'react';
import { Plane, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlightOffer {
  id: number;
  destination: string;
  origin: string;
  price: number;
  originalPrice?: number;
  image: string;
  duration: string;
  departure: string;
  airline: string;
  discount?: string;
}

const FlightOffers = ({ onBookFlight }: { onBookFlight: (offer: FlightOffer) => void }) => {
  const offers: FlightOffer[] = [
    {
      id: 1,
      destination: 'Cartagena',
      origin: 'Bogotá',
      price: 280000,
      originalPrice: 350000,
      image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=400&h=300&fit=crop',
      duration: '1h 20m',
      departure: '2024-07-15',
      airline: 'Avianca',
      discount: '20% OFF'
    },
    {
      id: 2,
      destination: 'Medellín',
      origin: 'Bogotá',
      price: 220000,
      originalPrice: 280000,
      image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=300&fit=crop',
      duration: '1h 10m',
      departure: '2024-07-20',
      airline: 'Avianca',
      discount: '21% OFF'
    },
    {
      id: 3,
      destination: 'Cali',
      origin: 'Bogotá',
      price: 240000,
      originalPrice: 300000,
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
      duration: '1h 25m',
      departure: '2024-07-25',
      airline: 'Avianca',
      discount: '20% OFF'
    },
    {
      id: 4,
      destination: 'Santa Marta',
      origin: 'Medellín',
      price: 320000,
      originalPrice: 400000,
      image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=400&h=300&fit=crop',
      duration: '1h 45m',
      departure: '2024-08-01',
      airline: 'Avianca',
      discount: '20% OFF'
    },
    {
      id: 5,
      destination: 'Barranquilla',
      origin: 'Cali',
      price: 350000,
      originalPrice: 450000,
      image: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop',
      duration: '1h 55m',
      departure: '2024-08-05',
      airline: 'Avianca',
      discount: '22% OFF'
    },
    {
      id: 6,
      destination: 'San Andrés',
      origin: 'Bogotá',
      price: 450000,
      originalPrice: 580000,
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
      duration: '2h 15m',
      departure: '2024-08-10',
      airline: 'Avianca',
      discount: '22% OFF'
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

  return (
    <div className="py-12 bg-gradient-to-b from-gray-50 to-red-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ofertas de vuelos nacionales</h2>
          <p className="text-gray-600">Descubre los mejores destinos colombianos con precios increíbles</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div key={offer.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-red-600">
              <div className="relative">
                <img 
                  src={offer.image} 
                  alt={offer.destination}
                  className="w-full h-48 object-cover"
                />
                {offer.discount && (
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    {offer.discount}
                  </div>
                )}
                <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 px-3 py-1 rounded-full text-sm font-bold text-red-600">
                  {offer.airline}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-800">{offer.destination}</h3>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2 bg-red-50 p-2 rounded">
                  <Plane className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm font-medium">{offer.origin} → {offer.destination}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-2 bg-gray-50 p-2 rounded">
                  <Clock className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm">Duración: {offer.duration}</span>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4 bg-gray-50 p-2 rounded">
                  <Calendar className="w-4 h-4 mr-2 text-red-600" />
                  <span className="text-sm">Salida: {offer.departure}</span>
                </div>
                
                <div className="flex items-center justify-between mb-4 bg-red-50 p-3 rounded-lg">
                  <div>
                    {offer.originalPrice && (
                      <span className="text-gray-400 line-through text-sm">{formatPrice(offer.originalPrice)}</span>
                    )}
                    <div className="text-2xl font-bold text-red-600">{formatPrice(offer.price)}</div>
                    <span className="text-sm text-gray-500">por persona</span>
                  </div>
                </div>
                
                <Button 
                  onClick={() => onBookFlight(offer)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Reservar ahora
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightOffers;
