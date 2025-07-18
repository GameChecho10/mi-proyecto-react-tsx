
import React, { useState, useRef, useEffect } from 'react';
import { Plane } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface City {
  code: string;
  name: string;
  fullName: string;
}

interface CityAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  iconRotation?: string;
}

const CityAutocomplete = ({ label, placeholder, value, onChange, iconRotation = "" }: CityAutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const colombianCities: City[] = [
    { code: 'BOG', name: 'Bogotá', fullName: 'Bogotá, Colombia' },
    { code: 'MDE', name: 'Medellín', fullName: 'Medellín, Colombia' },
    { code: 'CTG', name: 'Cartagena', fullName: 'Cartagena, Colombia' },
    { code: 'CLO', name: 'Cali', fullName: 'Cali, Colombia' },
    { code: 'SMR', name: 'Santa Marta', fullName: 'Santa Marta, Colombia' },
    { code: 'BAQ', name: 'Barranquilla', fullName: 'Barranquilla, Colombia' },
    { code: 'ADZ', name: 'San Andrés', fullName: 'San Andrés, Colombia' },
    { code: 'BGA', name: 'Bucaramanga', fullName: 'Bucaramanga, Colombia' },
    { code: 'PEI', name: 'Pereira', fullName: 'Pereira, Colombia' },
    { code: 'CUC', name: 'Cúcuta', fullName: 'Cúcuta, Colombia' },
    { code: 'IBE', name: 'Ibagué', fullName: 'Ibagué, Colombia' },
    { code: 'VVC', name: 'Villavicencio', fullName: 'Villavicencio, Colombia' },
    { code: 'MZL', name: 'Manizales', fullName: 'Manizales, Colombia' },
    { code: 'ARM', name: 'Armenia', fullName: 'Armenia, Colombia' },
    { code: 'NVA', name: 'Neiva', fullName: 'Neiva, Colombia' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue);
    
    if (inputValue.length >= 2) {
      const filtered = colombianCities.filter(city =>
        city.name.toLowerCase().includes(inputValue.toLowerCase()) ||
        city.code.toLowerCase().includes(inputValue.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleCitySelect = (city: City) => {
    onChange(city.fullName);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    if (value.length >= 2) {
      const filtered = colombianCities.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase()) ||
        city.code.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setIsOpen(true);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <Plane className={`absolute left-3 top-3 w-4 h-4 text-gray-400 ${iconRotation}`} />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleInputFocus}
          className="pl-10"
          autoComplete="off"
        />
      </div>
      
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city) => (
            <div
              key={city.code}
              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
              onClick={() => handleCitySelect(city)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{city.name}</div>
                  <div className="text-sm text-gray-500">{city.fullName}</div>
                </div>
                <div className="text-sm font-medium text-gray-600">{city.code}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
