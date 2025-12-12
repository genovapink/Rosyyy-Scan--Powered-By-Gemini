import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface BankSampah {
  id: number;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  phone?: string;
}

const bankSampahLocations: BankSampah[] = [
  {
    id: 1,
    name: 'Bank Sampah Induk Jakarta Pusat',
    address: 'Jl. Rawasari Selatan No. 35, RT 016 / RW 002, Kel. Cempaka Putih Timur, Kec. Cempaka Putih',
    city: 'Jakarta Pusat',
    lat: -6.1841,
    lng: 106.8677,
  },
  {
    id: 2,
    name: 'Bank Sampah Bina Cerdas Mandiri',
    address: 'RT 07 / RW 04, Kelurahan Pancoran, Kecamatan Pancoran',
    city: 'Jakarta Selatan',
    lat: -6.2565,
    lng: 106.8449,
  },
  {
    id: 3,
    name: 'Bank Sampah Induk Surabaya',
    address: 'Jl. Raya Menur No. 31-A, Manyar Sabrangan, Kecamatan Mulyorejo',
    city: 'Surabaya',
    lat: -7.2822,
    lng: 112.7609,
  },
  {
    id: 4,
    name: 'Bank Sampah Induk Kota Bandung (BSI Resik)',
    address: 'Jl. Babakan Sari I No. 64, Kecamatan Kiaracondong',
    city: 'Bandung',
    lat: -6.9366,
    lng: 107.6513,
  },
  {
    id: 5,
    name: 'Bank Sampah Hijau Lestari',
    address: 'Jl. Sadang Tengah No. 4, Kecamatan Coblong / Sekeloa',
    city: 'Bandung',
    lat: -6.8951,
    lng: 107.6118,
  },
];

export default function MapScreen() {
  const [selectedBank, setSelectedBank] = useState<BankSampah>(bankSampahLocations[0]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const handleGetDirections = (bank: BankSampah) => {
    const origin = userLocation ? `${userLocation.lat},${userLocation.lng}` : '';
    const destination = `${bank.lat},${bank.lng}`;
    const url = origin
      ? `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    window.open(url, '_blank');
  };

  const handleOpenInMaps = (bank: BankSampah) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${bank.lat},${bank.lng}`;
    window.open(url, '_blank');
  };

  // Create markers string for Google Maps embed
  const markersString = bankSampahLocations
    .map((bank) => `markers=color:green%7Clabel:${bank.id}%7C${bank.lat},${bank.lng}`)
    .join('&');

  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${selectedBank.lat},${selectedBank.lng}&zoom=15`;

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 z-10">
        <h1 className="text-emerald-600 text-center mb-1">Waste Banks</h1>
        <p className="text-gray-600 text-center">Find nearby waste banks</p>
      </div>

      {/* Map */}
      <div className="flex-1 relative bg-gray-100">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        />
      </div>

      {/* Bank List */}
      <div className="bg-white border-t border-gray-200 p-4 max-h-72 overflow-y-auto">
        <h2 className="mb-3 text-gray-700">Waste Bank List</h2>
        <div className="space-y-2">
          {bankSampahLocations.map((bank) => (
            <Card
              key={bank.id}
              className={`p-3 cursor-pointer transition-all ${
                selectedBank?.id === bank.id
                  ? 'border-2 border-emerald-500 bg-emerald-50'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => setSelectedBank(bank)}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  {bank.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 mb-1">{bank.name}</p>
                  <p className="text-gray-600 line-clamp-2">{bank.address}</p>
                  <p className="text-emerald-600 mt-1">{bank.city}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenInMaps(bank);
                    }}
                    title="Open in Google Maps"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGetDirections(bank);
                    }}
                    className="bg-emerald-500 hover:bg-emerald-600"
                    title="Get directions"
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}