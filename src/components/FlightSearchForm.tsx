import React, { useState } from 'react';
import { Calendar, Users, ArrowRightLeft, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import CityAutocomplete from './CityAutocomplete';
import LoadingTransition from './LoadingTransition';

interface Flight {
  id: number;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice: number;
  airline: string;
  image?: string;
  discount: string;
  direct: boolean;
  priceMultiplier: number;
}

interface FlightSearchFormProps {
  onFlightSelect?: (flight: Flight, passengers: number) => void;
}

const FlightSearchForm = ({ onFlightSelect }: FlightSearchFormProps) => {
  const [tripType, setTripType] = useState('roundtrip');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [passengers, setPassengers] = useState(1);
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [departDateOpen, setDepartDateOpen] = useState(false);
  const [returnDateOpen, setReturnDateOpen] = useState(false);

  // Base de datos actualizada de vuelos con todas las ciudades
  const mockFlights: Flight[] = [
    // Vuelos desde Bogotá
    {
      id: 1,
      from: 'Bogotá',
      to: 'Cartagena',
      departure: '08:30',
      arrival: '09:50',
      duration: '1h 20m',
      price: 140000,
      originalPrice: 280000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/d74feb2c-0904-45b2-a575-654ab0ddac5b.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 2,
      from: 'Bogotá',
      to: 'Medellín',
      departure: '10:00',
      arrival: '11:10',
      duration: '1h 10m',
      price: 110000,
      originalPrice: 220000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/a561e099-194d-42a7-8a35-6a982e383bdf.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 3,
      from: 'Bogotá',
      to: 'Cali',
      departure: '16:45',
      arrival: '17:55',
      duration: '1h 10m',
      price: 95000,
      originalPrice: 190000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/74f6f11b-1331-491d-96b8-865c26340c71.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 4,
      from: 'Bogotá',
      to: 'San Andrés',
      departure: '09:15',
      arrival: '11:30',
      duration: '2h 15m',
      price: 225000,
      originalPrice: 450000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/fe8b3496-e60b-4429-91b4-901b72e1c17c.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 5,
      from: 'Bogotá',
      to: 'Barranquilla',
      departure: '07:45',
      arrival: '09:20',
      duration: '1h 35m',
      price: 155000,
      originalPrice: 310000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/4f43ae2a-53c9-4095-95e9-502ded7113bd.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 6,
      from: 'Bogotá',
      to: 'Santa Marta',
      departure: '11:30',
      arrival: '13:15',
      duration: '1h 45m',
      price: 170000,
      originalPrice: 340000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/43ee0828-458a-4094-9d24-46c5eb26bb55.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 7,
      from: 'Bogotá',
      to: 'Bucaramanga',
      departure: '06:00',
      arrival: '07:10',
      duration: '1h 10m',
      price: 125000,
      originalPrice: 250000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/37bcd459-8cc6-445a-960d-1e8fbaf54e22.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 8,
      from: 'Bogotá',
      to: 'Armenia',
      departure: '08:00',
      arrival: '09:10',
      duration: '1h 10m',
      price: 120000,
      originalPrice: 240000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/c5dc81f4-ce4e-4a1c-9652-125ee0f614f3.png',
      direct: true,
      priceMultiplier: 1.0
    },
    {
      id: 9,
      from: 'Bogotá',
      to: 'Cúcuta',
      departure: '12:15',
      arrival: '13:35',
      duration: '1h 20m',
      price: 135000,
      originalPrice: 270000,
      airline: 'Avianca',
      discount: '50% OFF',
      image: '/lovable-uploads/d8a46f45-f75a-4291-b457-c3dcc8541832.png',
      direct: true,
      priceMultiplier: 1.0
    }
  ];

  // Ciudades disponibles con imágenes actualizadas
  const cityImages: { [key: string]: string } = {
    'Bogotá': '/lovable-uploads/08a3b509-ab32-4f1a-a970-3d690b3cbac3.png',
    'Cartagena': '/lovable-uploads/d74feb2c-0904-45b2-a575-654ab0ddac5b.png',
    'Medellín': '/lovable-uploads/800d6c22-1da3-4ab9-a3ea-f96d7de68822.png',
    'Cali': '/lovable-uploads/74f6f11b-1331-491d-96b8-865c26340c71.png',
    'San Andrés': '/lovable-uploads/fe8b3496-e60b-4429-91b4-901b72e1c17c.png',
    'Barranquilla': '/lovable-uploads/4f43ae2a-53c9-4095-95e9-502ded7113bd.png',
    'Santa Marta': '/lovable-uploads/43ee0828-458a-4094-9d24-46c5eb26bb55.png',
    'Bucaramanga': '/lovable-uploads/37bcd459-8cc6-445a-960d-1e8fbaf54e22.png',
    'Armenia': '/lovable-uploads/c5dc81f4-ce4e-4a1c-9652-125ee0f614f3.png',
    'Cúcuta': '/lovable-uploads/7562c7b3-7343-460a-8605-6f8c33d5064d.png'
  };

  // Días festivos colombianos 2024-2025
  const colombianHolidays = [
    // 2024
    new Date(2024, 0, 1),   // Año Nuevo
    new Date(2024, 0, 8),   // Reyes Magos
    new Date(2024, 2, 25),  // San José
    new Date(2024, 2, 24),  // Domingo de Ramos
    new Date(2024, 2, 28),  // Jueves Santo
    new Date(2024, 2, 29),  // Viernes Santo
    new Date(2024, 4, 1),   // Día del Trabajo
    new Date(2024, 4, 13),  // Ascensión
    new Date(2024, 5, 3),   // Corpus Christi
    new Date(2024, 5, 10),  // Sagrado Corazón
    new Date(2024, 6, 1),   // San Pedro y San Pablo
    new Date(2024, 6, 20),  // Grito de Independencia
    new Date(2024, 7, 7),   // Batalla de Boyacá
    new Date(2024, 7, 19),  // Asunción de la Virgen
    new Date(2024, 9, 14),  // Día de la Raza
    new Date(2024, 10, 4),  // Todos los Santos
    new Date(2024, 10, 11), // Independencia de Cartagena
    new Date(2024, 11, 8),  // Inmaculada Concepción
    new Date(2024, 11, 25), // Navidad
    // 2025
    new Date(2025, 0, 1),   // Año Nuevo
    new Date(2025, 0, 6),   // Reyes Magos
    new Date(2025, 2, 24),  // San José
    new Date(2025, 3, 13),  // Domingo de Ramos
    new Date(2025, 3, 17),  // Jueves Santo
    new Date(2025, 3, 18),  // Viernes Santo
    new Date(2025, 4, 1),   // Día del Trabajo
    new Date(2025, 5, 2),   // Ascensión
    new Date(2025, 5, 23),  // Corpus Christi
    new Date(2025, 5, 30),  // Sagrado Corazón
    new Date(2025, 5, 30),  // San Pedro y San Pablo
    new Date(2025, 6, 20),  // Grito de Independencia
    new Date(2025, 7, 7),   // Batalla de Boyacá
    new Date(2025, 7, 18),  // Asunción de la Virgen
    new Date(2025, 9, 13),  // Día de la Raza
    new Date(2025, 10, 3),  // Todos los Santos
    new Date(2025, 10, 17), // Independencia de Cartagena
    new Date(2025, 11, 8),  // Inmaculada Concepción
    new Date(2025, 11, 25), // Navidad
  ];

  // Temporadas altas (vacaciones escolares)
  const highSeasonPeriods = [
    // Vacaciones de fin de año
    { start: new Date(2024, 11, 15), end: new Date(2025, 0, 15) },
    { start: new Date(2025, 11, 15), end: new Date(2026, 0, 15) },
    // Semana Santa y vacaciones de mitad de año
    { start: new Date(2024, 2, 20), end: new Date(2024, 3, 5) },
    { start: new Date(2024, 5, 15), end: new Date(2024, 7, 15) },
    { start: new Date(2025, 2, 20), end: new Date(2025, 3, 5) },
    { start: new Date(2025, 5, 15), end: new Date(2025, 7, 15) },
  ];

  const isHoliday = (date: Date) => {
    return colombianHolidays.some(holiday =>
      holiday.getFullYear() === date.getFullYear() &&
      holiday.getMonth() === date.getMonth() &&
      holiday.getDate() === date.getDate()
    );
  };

  const isHighSeason = (date: Date) => {
    return highSeasonPeriods.some(period =>
      date >= period.start && date <= period.end
    );
  };

  // Función para calcular multiplicador de precio según la fecha
  const getPriceMultiplier = (selectedDate: Date) => {
    const today = new Date();
    const daysDifference = Math.floor((selectedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // Precios más altos para fechas cercanas y fines de semana
    const dayOfWeek = selectedDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let multiplier = 1.0;

    // Precio según anticipación de compra
    if (daysDifference <= 7) {
      multiplier += 0.1; // 10% más caro
    } else if (daysDifference <= 15) {
      multiplier += 0.05; // 5% más caro
    }

    // Precio por fin de semana (solo ligero aumento)
    if (isWeekend) {
      multiplier += 0.1; // 10% más caro
    }

    // Días festivos colombianos (incremento moderado)
    if (isHoliday(selectedDate)) {
      multiplier += 0.2; // 20% más caro
    }

    // Temporadas altas (vacaciones)
    if (isHighSeason(selectedDate)) {
      multiplier += 0.3; // 30% más caro
    }

    return multiplier;
  };

  const getPriceCategory = (date: Date) => {
    const multiplier = getPriceMultiplier(date);
    if (multiplier >= 1.3) return 'expensive'; // Rojo - muy costoso
    if (multiplier >= 1.15) return 'moderate';  // Naranja - moderado
    return 'cheap'; // Verde - precio base
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 100 + now.getMinutes();
  };

  const parseTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 100 + minutes;
  };

  const filterFlightsByTime = (flights: Flight[]) => {
    const currentTime = getCurrentTime();
    const today = new Date().toDateString();

    if (departDate && departDate.toDateString() === today) {
      return flights.filter(flight => parseTime(flight.departure) > currentTime);
    }

    return flights;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const extractCityName = (fullName: string) => {
    return fullName.split(',')[0].trim();
  };

  const generateDynamicFlights = (fromCity: string, toCity: string, selectedDate: Date): Flight[] => {
    const priceMultiplier = getPriceMultiplier(selectedDate);
    const baseOriginalPrice = Math.floor(Math.random() * 200000) + 180000;
    const flightTimes = [
      { departure: '06:30', arrival: '07:45' },
      { departure: '09:15', arrival: '10:30' },
      { departure: '12:00', arrival: '13:15' },
      { departure: '15:45', arrival: '17:00' },
      { departure: '18:30', arrival: '19:45' }
    ];

    return flightTimes.map((time, index) => {
      const originalPrice = Math.floor((baseOriginalPrice + (index * 20000)) * priceMultiplier);
      return {
        id: 1000 + index,
        from: fromCity,
        to: toCity,
        departure: time.departure,
        arrival: time.arrival,
        duration: '1h 15m',
        price: Math.floor(originalPrice / 2),
        originalPrice: originalPrice,
        airline: 'Avianca',
        discount: '50% OFF',
        image: cityImages[toCity] || '/lovable-uploads/08a3b509-ab32-4f1a-a970-3d690b3cbac3.png',
        direct: true,
        priceMultiplier: priceMultiplier
      };
    });
  };

  const handleSearch = async () => {
    console.log('Buscando vuelos...');

    if (!from || !to) {
      console.log('Origen y destino son requeridos');
      return;
    }

    if (!departDate) {
      console.log('Fecha de salida es requerida');
      return;
    }

    setIsLoading(true);
    setShowResults(false);
    setSelectedFlightId(null);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const fromCity = extractCityName(from);
    const toCity = extractCityName(to);
    const priceMultiplier = getPriceMultiplier(departDate);

    let filtered = mockFlights.filter(flight =>
      flight.from.toLowerCase() === fromCity.toLowerCase() &&
      flight.to.toLowerCase() === toCity.toLowerCase()
    );

    // Aplicar multiplicador de precio según fecha
    filtered = filtered.map(flight => ({
      ...flight,
      price: Math.floor(flight.price * priceMultiplier),
      originalPrice: Math.floor(flight.originalPrice * priceMultiplier),
      priceMultiplier: priceMultiplier,
      image: cityImages[toCity] || '/lovable-uploads/08a3b509-ab32-4f1a-a970-3d690b3cbac3.png'
    }));

    if (filtered.length === 0) {
      filtered = generateDynamicFlights(fromCity, toCity, departDate);
    }

    filtered = filterFlightsByTime(filtered);

    console.log(`Vuelos disponibles de ${fromCity} a ${toCity}:`, filtered);
    setSearchResults(filtered);
    setIsLoading(false);
    setShowResults(true);
  };

  const handleSwapCities = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  const handleFlightSelect = (flight: Flight) => {
    if (selectedFlightId === flight.id) {
      setSelectedFlightId(null);
    } else {
      setSelectedFlightId(flight.id);
    }
  };

  const handleClassSelect = (flight: Flight, classType: string, price: number) => {
    if (onFlightSelect) {
      onFlightSelect({ ...flight, price }, passengers);
    }
  };

  const renderFlightClasses = (flight: Flight) => {
    const classes = [
      {
        id: 'basic',
        name: 'Basic',
        color: 'red',
        priceMultiplier: 1.0,
        features: ['1 artículo personal', 'Sin cambios ni reembolsos']
      },
      {
        id: 'classic',
        name: 'Classic',
        color: 'purple',
        priceMultiplier: 1.2,
        features: ['1 artículo personal', '1 equipaje de mano (10kg)', '1 equipaje de bodega (23kg)']
      },
      {
        id: 'flex',
        name: 'Flex',
        color: 'orange',
        priceMultiplier: 1.4,
        features: ['Todo lo de Classic', 'Cambios sin costo', 'Asiento Plus']
      }
    ];

    return (
      <div className="mt-4 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
        <h4 className="text-xl font-semibold mb-6 text-gray-800 text-center">Elige tu clase de vuelo</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((classType) => (
            <div key={classType.id} className="border-2 border-gray-200 rounded-xl p-6 bg-white hover:shadow-lg transition-all hover:border-blue-300">
              <div className="text-center mb-4">
                <h5 className={`text-xl font-bold mb-2 ${classType.color === 'red' ? 'text-red-600' :
                  classType.color === 'purple' ? 'text-purple-600' :
                    'text-orange-600'
                  }`}>{classType.name}</h5>
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {formatPrice(Math.floor(flight.price * classType.priceMultiplier))}
                </div>
                <div className="text-sm text-gray-500">por pasajero</div>
              </div>
              <ul className="text-sm text-gray-600 mb-6 space-y-2 min-h-[120px]">
                {classType.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleClassSelect(flight, classType.id, Math.floor(flight.price * classType.priceMultiplier))}
                className={`w-full py-3 text-white font-semibold rounded-lg transition-colors ${classType.color === 'red' ? 'bg-red-600 hover:bg-red-700' :
                  classType.color === 'purple' ? 'bg-purple-600 hover:bg-purple-700' :
                    'bg-orange-600 hover:bg-orange-700'
                  }`}
              >
                Seleccionar {classType.name}
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <LoadingTransition message="Buscando vuelos" />;
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mx-auto -mt-10 relative z-10 w-full max-w-[1000px]">
      <div className="grid grid-cols-2 gap-2 w-full mb-6">
        <button
          type="button"
          onClick={() => setTripType('roundtrip')}
          className={cn(
            'w-full py-3 rounded-full text-base font-semibold transition',
            tripType === 'roundtrip'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Ida y vuelta
        </button>

        <button
          type="button"
          onClick={() => setTripType('oneway')}
          className={cn(
            'w-full py-3 rounded-full text-base font-semibold transition',
            tripType === 'oneway'
              ? 'bg-red-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
        >
          Solo ida
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <CityAutocomplete
          label="Origen"
          placeholder="¿Desde dónde viajas?"
          value={from}
          onChange={setFrom}
        />

        <div className="flex items-end justify-center md:order-2">
          <Button variant="ghost" size="sm" className="mb-2 rounded-xl" onClick={handleSwapCities}>
            <ArrowRightLeft className="w-4 h-4" />
          </Button>
        </div>

        <CityAutocomplete
          label="Destino"
          placeholder="¿A dónde quieres ir?"
          value={to}
          onChange={setTo}
          iconRotation="rotate-90"
        />

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de salida
            {departDate && (
              <span className="text-xs text-red-600 ml-2">
                ({getPriceCategory(departDate) === 'expensive' ? 'Muy costoso' :
                  getPriceCategory(departDate) === 'moderate' ? 'Moderado' : 'Precio base'})
              </span>
            )}
          </label>
          <Popover open={departDateOpen} onOpenChange={setDepartDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl",
                  !departDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departDate ? format(departDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={departDate}
                onSelect={(date) => {
                  setDepartDate(date);
                  setDepartDateOpen(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
                className="p-3 pointer-events-auto"
                modifiers={{
                  expensive: (date) => getPriceCategory(date) === 'expensive',
                  moderate: (date) => getPriceCategory(date) === 'moderate',
                  cheap: (date) => getPriceCategory(date) === 'cheap'
                }}
                modifiersStyles={{
                  expensive: { backgroundColor: '#fecaca', color: '#dc2626' },
                  moderate: { backgroundColor: '#fed7aa', color: '#ea580c' },
                  cheap: { backgroundColor: '#dcfce7', color: '#16a34a' }
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {tripType === 'roundtrip' && (
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de regreso
              {returnDate && (
                <span className="text-xs text-red-600 ml-2">
                  ({getPriceCategory(returnDate) === 'expensive' ? 'Muy costoso' :
                    getPriceCategory(returnDate) === 'moderate' ? 'Moderado' : 'Precio base'})
                </span>
              )}
            </label>
            <Popover open={returnDateOpen} onOpenChange={setReturnDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl",
                    !returnDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {returnDate ? format(returnDate, "PPP", { locale: es }) : <span>Selecciona fecha</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={returnDate}
                  onSelect={(date) => {
                    setReturnDate(date);
                    setReturnDateOpen(false);
                  }}
                  disabled={(date) => date < (departDate || new Date())}
                  initialFocus
                  className="p-3 pointer-events-auto"
                  modifiers={{
                    expensive: (date) => getPriceCategory(date) === 'expensive',
                    moderate: (date) => getPriceCategory(date) === 'moderate',
                    cheap: (date) => getPriceCategory(date) === 'cheap'
                  }}
                  modifiersStyles={{
                    expensive: { backgroundColor: '#fecaca', color: '#dc2626' },
                    moderate: { backgroundColor: '#fed7aa', color: '#ea580c' },
                    cheap: { backgroundColor: '#dcfce7', color: '#16a34a' }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pasajeros</label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              type="number"
              min="1"
              max="9"
              value={passengers}
              onChange={(e) => setPassengers(parseInt(e.target.value))}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-base md:text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition duration-300"
        >
          Buscar vuelos
        </Button>
      </div>

      {showResults && (
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">
              {extractCityName(from)} → {extractCityName(to)}
            </h3>
            <div className="text-sm text-gray-600">
              {departDate && format(departDate, "dd MMM yyyy", { locale: es })} • {passengers} pasajero{passengers > 1 ? 's' : ''}
            </div>
          </div>

          {searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay vuelos disponibles para el horario seleccionado.</p>
              <p className="text-sm text-gray-500 mt-2">Prueba con una fecha futura o un horario diferente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((flight) => (
                <div key={flight.id}>
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300" onClick={() => handleFlightSelect(flight)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{flight.departure}</div>
                              <div className="text-sm text-gray-500 font-medium">{flight.from.substring(0, 3).toUpperCase()}</div>
                            </div>

                            <div className="flex-1 text-center mx-8">
                              <div className="text-sm text-gray-500 mb-2">{flight.duration}</div>
                              <div className="relative">
                                <div className="h-0.5 bg-gray-300 w-full"></div>
                                <div className="absolute inset-0 flex justify-center">
                                  <div className="bg-white px-3">
                                    <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                                      {flight.direct ? 'Directo' : 'Escalas'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900">{flight.arrival}</div>
                              <div className="text-sm text-gray-500 font-medium">{flight.to.substring(0, 3).toUpperCase()}</div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-sm text-gray-600 mb-2">
                              Operado por {flight.airline}
                            </div>
                            <div className="flex justify-center gap-2">
                              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                                Mejor precio
                              </span>
                              {flight.priceMultiplier > 1.1 && (
                                <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">
                                  +{Math.round((flight.priceMultiplier - 1) * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className="text-center ml-8"
                        style={{ transform: 'translate(-28px, 10px)', fontSize: '11px' }}
                      >
                        <div className="text-gray-500 line-through mb-1">
                          {formatPrice(flight.originalPrice)}
                        </div>
                        <div className="font-bold text-red-600 mb-2">
                          {formatPrice(flight.price)}
                        </div>
                        <div className="text-gray-500 mb-4">por pasajero</div>
                        <div className="text-blue-600 font-medium">
                          {selectedFlightId === flight.id ? 'Ocultar clases ▲' : 'Ver clases ▼'}
                        </div>
                      </div>

                    </div>
                  </div>

                  {selectedFlightId === flight.id && renderFlightClasses(flight)}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearchForm;
