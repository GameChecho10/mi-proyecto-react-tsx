import React, { useState } from 'react';
import '../styles.css'
import Header from '@/components/Header';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightOffersEnhanced from '@/components/FlightOffersEnhanced';
import PassengerDataModal from '@/components/PassengerDataModal';
import PaymentModal from '@/components/PaymentModal';
import SeatSelection from '@/components/SeatSelection';
import FlightTypeSelection from '@/components/FlightTypeSelection';
import LoadingTransition from '@/components/LoadingTransition';
// Imágenes
import avianca from '../images/avianca_airlines_logo.svg';
import alianza from '../images/alliance_logo.svg';
import aerona from '../images/aeronautica.svg';
import avionBoletos from '../images/avion_boletos.svg'; // Importa las imágenes que necesites
import vectorArrow from '../images/vector_arrow.svg'; // Importa las imágenes que necesites
import avion from '../images/avion.svg';
import banner from '../images/banner.svg';
import burgerLogo from '../images/burger-logo.svg';
import destinoCard1 from '../images/destino_card1.svg';
import facebook from '../images/facebook.svg';
import flechaDerecha from '../images/flecha-derecha.svg';
import flechaIzquierda from '../images/flecha-izquierda.svg';
import iconoMas from '../images/icono-mas.svg';
import instagram from '../images/instagram.svg';
import interArrows from '../images/inter_arrows.svg';
import lupa from '../images/lupa.svg';
import sitioSeguro from '../images/sitioseguro.svg';
import start from '../images/start.svg';
import twitter from '../images/twitter.svg';
import vigilado from '../images/vigilado.svg';
import youtube from '../images/youtube.svg';
import logo_avianca from '../images/logo_avianca.svg'

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

interface FlightOffer {
  id: number;
  destination: string;
  origin: string;
  price: number;
  duration: string;
  departure: string;
  airline: string;
  image: string;
}

interface PassengerData {
  firstName: string;
  lastName: string;
  idType: string;
  idNumber: string;
  birthDate: string;
  gender: string;
  nationality: string;
}

const Index = () => {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedFlightOffer, setSelectedFlightOffer] = useState<FlightOffer | null>(null);
  const [currentStep, setCurrentStep] = useState<'search' | 'flightType' | 'seats' | 'passengers' | 'payment'>('search');
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [passengerCount, setPassengerCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const showLoadingTransition = (message: string, callback: () => void) => {
    setIsTransitioning(true);
    setTimeout(() => {
      callback();
      setIsTransitioning(false);
    }, 2000);
  };

  const handleFlightSelect = (flight: Flight, passengers: number = 1) => {
    showLoadingTransition("Preparando opciones de vuelo", () => {
      setSelectedFlight(flight);
      setPassengerCount(passengers);
      setCurrentStep('flightType');
    });
  };

  const handleBookFlight = (offer: FlightOffer, passengers: number = 1) => {
    showLoadingTransition("Preparando opciones de vuelo", () => {
      const flight: Flight = {
        id: offer.id,
        from: offer.origin,
        to: offer.destination,
        departure: offer.departure,
        arrival: '10:30',
        duration: offer.duration,
        price: offer.price,
        airline: offer.airline
      };
      setSelectedFlight(flight);
      setPassengerCount(passengers);
      setCurrentStep('flightType');
    });
  };

  const handleFlightTypeSelect = (flightType: any) => {
    showLoadingTransition("Preparando selección de asientos", () => {
      if (selectedFlight) {
        setSelectedFlight({
          ...selectedFlight,
          price: flightType.price
        });
      }
      setCurrentStep('seats');
    });
  };

  const handleSeatsSelect = (seats: string[]) => {
    showLoadingTransition("Preparando formulario de pasajeros", () => {
      setSelectedSeats(seats);
      setCurrentStep('passengers');
    });
  };

  const handleContinueToPayment = (passengersData: PassengerData[], flight: Flight) => {
    showLoadingTransition("Preparando pago", () => {
      setPassengers(passengersData);
      setSelectedFlight(flight);
      setCurrentStep('payment');
    });
  };

  const handlePaymentSuccess = () => {
    setTimeout(() => {
      setCurrentStep('search');
      setSelectedFlight(null);
      setPassengers([]);
      setPassengerCount(1);
      setSelectedSeats([]);
    }, 1000);
  };

  const handleCloseModal = () => {
    setCurrentStep('search');
    setSelectedFlight(null);
    setPassengers([]);
    setSelectedSeats([]);
  };

  if (isTransitioning) {
    return <LoadingTransition />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />

      {currentStep === 'search' && (
        <>
          <div
            className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-800 py-16 md:py-20 overflow-hidden"
            style={{
              backgroundImage: `url(${banner})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
              zIndex: 1
            }}
          >
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative z-10 container mx-auto px-4">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  Encuentra tu próximo destino
                </h1>
                <p className="text-xl md:text-2xl text-red-100 max-w-2xl mx-auto leading-relaxed">
                  Descubre el mundo con las mejores ofertas de vuelos de Avianca
                </p>
                <div className="mt-8 flex justify-center">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-6 py-3">
                    <span className="text-white font-semibold">✈️ Más de 100 destinos disponibles</span>
                  </div>
                </div>
              </div>
              <FlightSearchForm onFlightSelect={handleFlightSelect} />
            </div>

            {/* Decorative elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-2xl"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-300 bg-opacity-20 rounded-full blur-lg"></div>
          </div>

          <FlightOffersEnhanced onBookFlight={handleBookFlight} />
        </>
      )}

      {currentStep === 'flightType' && selectedFlight && (
        <div className="py-8">
          <FlightTypeSelection
            basePrice={selectedFlight.price}
            onSelect={handleFlightTypeSelect}
          />
        </div>
      )}

      <SeatSelection
        isOpen={currentStep === 'seats'}
        onClose={handleCloseModal}
        onContinue={handleSeatsSelect}
        passengerCount={passengerCount}
      />

      <PassengerDataModal
        isOpen={currentStep === 'passengers'}
        onClose={handleCloseModal}
        flight={selectedFlight}
        passengerCount={passengerCount}
        onContinueToPayment={handleContinueToPayment}
      />

      <PaymentModal
        isOpen={currentStep === 'payment'}
        onClose={handleCloseModal}
        flight={selectedFlight}
        passengers={passengers}
        onPaymentSuccess={handlePaymentSuccess}
      />
      {/* Sección 3: Accesos directos */}
      <section className="section-3">
        <div className="container-acceso">
          <h2 className='titulo'>Accesos directos</h2>

          {[
            {
              img: avion,
              title: 'Conozca sobre el programa',
              desc: 'Avianca Corporate ofrece beneficios y precios especiales para empresas con viajes frecuentes.',
              link: 'Más sobre el programa',
              url: 'https://ayuda.avianca.com/hc/es/sections/12994143912603-Documentaci%C3%B3n'
            },
            {
              img: lupa,
              title: 'Cómo pertenecer al programa',
              desc: 'Conoce los requerimientos mínimos para que accedas a los beneficios que ofrece Avianca Corporate',
              link: 'Conoce más del programa',
              url: 'https://ayuda.avianca.com/hc/es/sections/12994143912603-Documentaci%C3%B3n'
            },
            {
              img: start,
              title: 'Obtenga su contraseña web',
              desc: 'Si aún no recibe su contraseña, o la olvidó, la puede solicitar de nuevo aquí.',
              link: 'Solicitar contraseña',
              url: 'https://ayuda.avianca.com/hc/es/sections/12994143912603-Documentaci%C3%B3n'
            }
          ].map((card, idx) => (
            <React.Fragment key={idx}>
              <div className="acceso-cards">
                <div className="cards-acceso-header">
                  <img src={card.img} alt={card.title} />
                  <p>{card.title}</p>
                </div>
                <div className="cards-acceso-body">
                  <p>{card.desc}</p>
                </div>
                <div className="cards-acceso-footer">
                  <a href="">{card.link}</a>
                  <img src={vectorArrow} alt="Flecha" />
                </div>
              </div>
              {idx < 2 && <div className="separador"></div>}
            </React.Fragment>
          ))}
        </div>
      </section>
      {/* Sección 4: Ten en cuenta */}
      <section className="section-4">
        <div className="container-cuenta">
          <h2 className='titulo'>Ten en cuenta</h2>

          <div className="contenedor-cuenta-recuadros">
            <div className="cuenta-recuadros">
              <h3>Restricciones de Viajes</h3>
              <p>Revisa si tu destino tiene restricciones de viaje o exigencias de Pruebas de Covid-19, que pueden impactar tu viaje.</p>
              <a href="https://www.avianca.com/es/sobre-nosotros/contactanos/"
                target="_blank"
                rel="noopener noreferrer"> <button className="boton-restricciones">Conocer las restricciones de viajes</button> </a>
            </div>

            <div className="cuenta-recuadros">
              <h3>Habla con un Ejecutivo Comercial</h3>
              <p>Si ya tienes una Cuenta Corporativa, puedes hablar directamente con nuestros Ejecutivos Comerciales.</p>
              <a href="https://www.avianca.com/es/sobre-nosotros/contactanos/"
                target="_blank"
                rel="noopener noreferrer"> <button className="boton-restricciones">Conocer las restricciones de viajes</button> </a>
            </div>
          </div>

          <div className="cuenta-recuadro-grande">
            <h3>Prueba PCR (Covid-19) incluida en tu tarifa </h3>
            <p>
              Si uno de los destinos a los que viajes exige una prueba PCR para el Covid-19, nosotros te hacemos la
              vida más fácil. Nos aliamos con SynLab para
              que viajes tranquilo, descubre todos los beneficios que trae tu talla.
            </p>
            <a href="https://www.avianca.com/es/sobre-nosotros/contactanos/"
              target="_blank"
              rel="noopener noreferrer"> <button className="boton-restricciones">Conocer las restricciones de viajes</button> </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container-menu-footer">
          {[
            {
              title: 'Avianca Corporate',
              links: [
                'El programa Corporate',
                'Inscripción',
                'Otras soluciones empresariales',
                'Direct Connect',
                'Servicios de viaje',
                'Cómo pertenecer al programa',
                'Obtenga su contraseña web',
                'Solicite su PIN'
              ]
            },
            {
              title: 'Conócenos',
              links: [
                'Sobre nosotros',
                'Contáctanos',
                'Alianzas y beneficios',
                'Direct Connect',
                'Nuestra red de servicios',
                'Relación con inversionistas',
                'Mapa del Sitio',
                'Avianca Express'
              ]
            },
            {
              title: 'Legales',
              links: [
                'Términos y condiciones',
                'Política de privacidad',
                'Política de cookies',
                'Cargos por servicios opcionales',
                'Contrato de transporte',
                'Plan de contingencia'
              ]
            }
          ].map((section, idx) => (
            <div className="menu-footer-cards" key={idx}>
              <p className="titulos-menu-footer">{section.title}</p>
              <ul className="lista-links-footer">
                {section.links.map((link, i) => (
                  <li key={i}><a href="#">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <p className="titulos-media-footer">Síguenos</p>

          <div className="container-media-footer">
            <div className="footer-media-links">
              {[
                {
                  img: twitter,
                  alt: 'Twitter',
                  href: 'https://x.com/avianca?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor'
                },
                {
                  img: facebook,
                  alt: 'Facebook',
                  href: 'https://www.facebook.com/aviancaglobal/?locale=es_LA'
                },
                {
                  img: youtube,
                  alt: 'YouTube',
                  href: 'https://www.youtube.com/watch?v=feDjdS-tXqU'
                },
                {
                  img: instagram,
                  alt: 'Instagram',
                  href: 'https://www.instagram.com/avianca/?hl=es-la'
                }
              ].map((media, i) => (
                <a
                  href={media.href}
                  key={i}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={media.img} alt={media.alt} /> {media.alt}
                </a>
              ))}
            </div>


            <div className="footer-media-links-2">
              {[twitter, facebook, youtube, instagram].map((img, i) => (
                <a href="#" key={i}>
                  <img className="links2" src={img} alt={`media-${i}`} />
                </a>
              ))}

              <img src={avianca} alt="Avianca Logo" />
            </div>

            <div className="vr"></div>

            <div className="footer-media-security">
              <a href="https://www.avianca.com/" target="_blank" rel="noopener noreferrer">
                <img src={sitioSeguro} alt="Logo Candado" />
              </a>
              <a href="https://www.avianca.com/es/informacion-legal/politica-seguridad-informacion-ciberseguridad/" target="_blank" rel="noopener noreferrer">
                <img src={vigilado} alt="Logo seguridad transporte" />
              </a>
              <a href="https://www.avianca.com/es/sobre-nosotros/somos-avianca/" target="_blank" rel="noopener noreferrer">
                <img src={aerona} alt="Aeronautica Logo" />
              </a>
            </div>
          </div>

          <hr className="hr-azul" />

          <div className="container-wianca">
            <img
              src="/lovable-uploads/6e9dc7bc-ac85-40d6-9e30-3e25368598c4.png"
              alt="Avianca"
              style={{
                height: '28px',     // equivalente a h-12
                width: 'auto',
                transform: 'translateY(30px)', // o cualquier otro valor
              }}
            />
            <img src={alianza} alt="Alliance logo" />
            <p>
              Avianca S.A. - 2020 Copyright © Todos los derechos reservados.
              NIT 890.100.577-6. RNT 20175
            </p>
          </div>
        </div>
      </footer>

    </div>

  );
};

export default Index;
