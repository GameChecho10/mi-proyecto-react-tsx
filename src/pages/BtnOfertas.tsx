import React from 'react'
import '../styles.css'
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



const btnOfertas = () => {
   return (
    
    <div>
      
      <header>
        <div className="container-header">
          <div className="logo">
            <img src= {avianca} alt="logo-avianca" />
          </div>

          {/* burger menu */}
          <div className="menu-burger">
            <div className="navbar">
              <div className="dropdown">
                <button className="dropbtn">
                  <img src= {burgerLogo} alt="navegacion burger icono" />
                  <i className="fa fa-caret-down"></i>
                </button>
                <div className="dropdown-content">
                  <a href="#">El programa</a>
                  <a href="#">Inscripción</a>
                </div>
              </div>
            </div>
          </div>

          {/* menú normal */}
          <div className="menu">
            <a href="index.html">El programa</a>
            <a href="vuelos.html">Inscripción</a>
          </div>
        </div>
      </header>

      <section className="splash">
        <img src= {banner} alt="banner" />
        <div className="container-splash">
          <div className="container-splash-caption">
            <p>Volamos para que tú puedas volar.</p>
            <p>
              Avianca Corporate organiza todo<br />
              lo que necesitas para tu viaje.
            </p>
            <div className="caption-cta">
              <button className="boton-vuelos">Participa en la rifa</button>
            </div>
          </div>
        </div>
      </section>
        {/* SECTION 1 */}
      <section className="section-1">
        <div className="container-field">
          <div className="field">
            <h1>Busca tu vuelo</h1>
            <form className="labels">
              <p className="eep">
                <input type="radio" id="test1" name="radio-group" defaultChecked />
                <label htmlFor="test1">Ida y Regreso</label>
              </p>
              <p className="eep">
                <input type="radio" id="test2" name="radio-group" />
                <label htmlFor="test2">Solo ida</label>
              </p>
              <p className="eep">
                <input type="radio" id="test3" name="radio-group" />
                <label htmlFor="test3">Varias ciudades</label>
              </p>
            </form>
            <div className="field-columnas-1">
              <div className="inputs-containers">
                <p className="inputs-tittles">Desde</p>
                <input className="inputs-vuelos-fechas" type="text" placeholder="Bogotá D.C. (BOG)" />
              </div>
              <div className="recuadro-intercambio">
                <img src= {flechaDerecha} alt="derecha" />
                <img src= {flechaIzquierda} alt="izquierda" />
              </div>
              <div className="inputs-containers">
                <p className="inputs-tittles">Destino</p>
                <input className="inputs-vuelos-fechas" type="text" placeholder="Dallas (DFW)" />
              </div>
              <div className="inputs-containers">
                <p className="inputs-tittles">Pasajeros y Clase</p>
                <select>
                  <option>1 adulto, economica</option>
                  <option>2 adultos, economica</option>
                  <option>3 adultos, economica</option>
                  <option>4 adultos, economica</option>
                  <option>5 adultos, economica</option>
                  <option>6 adultos o más</option>
                </select>
              </div>
            </div>
            <div className="field-columnas-2">
              <div className="inputs-containers">
                <p className="inputs-tittles">Fecha de Salida</p>
                <input type="datetime-local" defaultValue="2021-03-16T19:30" />
              </div>
              <div className="recuadro-intercambio">
                <img src={flechaDerecha} alt="derecha" />
                <img src= {flechaIzquierda} alt="izquierda" />
              </div>
              <div className="inputs-containers">
                <p className="inputs-tittles">Fecha de Regreso</p>
                <input type="datetime-local" defaultValue="2021-04-14T19:30" />
              </div>
              <div className="inputs-containers">
                <div className="codigo-promo">
                  <img src= {iconoMas} alt="cupon" />
                  <a href="#">Tengo un código promocional</a>
                </div>
              </div>
            </div>
            <div className="boton-cta-compra">
              <button className="boton-vuelos">Buscar vuelos</button>
            </div>
          </div>
        </div>
      </section>
        {/* Sección 2: Recomendaciones */}
      <section className="section-2">
        <div className="container-recomendaciones">
          <h2>Recomendaciones para ti</h2>
          <a href=""><span>Configura tus recomendaciones</span></a>
          <a href=""><img src= {lupa} alt="lupa" /></a>
        </div>
        <div className="container-cards">
          {[1, 2, 3].map((_, index) => (
            <div className="cards-destinos" key={index}>
              <img
                className="destinos-imag"
                src= {destinoCard1}
                alt="foto destino"
                style={{ width: '100%' }}
              />
              <div className="container-fromto">
                <div className="inicio-trayecto">
                  <p>Bogotá</p>
                  <p>BOG</p>
                </div>
                <div className="change-destinos">
                  <img className="intercambio-dest" src={interArrows} alt="flechas intercambio" />
                </div>
                <div className="destino-trayecto">
                  <p>{index === 0 ? 'Nueva York' : index === 1 ? 'Sao Paulo' : 'Santiago'}</p>
                  <p className={index === 1 ? 'iniciales-1' : index === 2 ? 'iniciales-2' : ''}>
                    {index === 0 ? 'JKF' : index === 1 ? 'GRU' : 'SCL'}
                  </p>
                </div>
              </div>
              <div className="container-precio">
                <p>Desde:</p>
                <p className="nomina-precio">
                  $879, 890 <span className="moneda-span">COP</span>
                </p>
                <div className="mini-detalles">
                  <img className="detalles-avion" src= {avion} alt="avion logo" />
                  <p>Directo | Jun. 12 - Jun. 24 | 12 días</p>
                </div>
                <button className="boton-vuelos">Buscar vuelos</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección 3: Accesos directos */}
      <section className="section-3">
        <div className="container-acceso">
          <h2>Accesos directos</h2>

          {[
            {
              img: avion,
              title: 'Conozca sobre el programa',
              desc: 'Avianca Corporate ofrece beneficios y precios especiales para empresas con viajes frecuentes.',
              link: 'Más sobre el programa'
            },
            {
              img: lupa,
              title: 'Cómo pertenecer al programa',
              desc: 'Conoce los requerimientos mínimos para que accedas a los beneficios que ofrece Avianca Corporate',
              link: 'Conoce más del programa'
            },
            {
              img: start,
              title: 'Obtenga su contraseña web',
              desc: 'Si aún no recibe su contraseña, o la olvidó, la puede solicitar de nuevo aquí.',
              link: 'Solicitar contraseña'
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
                  <img src={lupa} alt="lupa" />
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
          <h2>Ten en cuenta</h2>

          <div className="cuenta-recuadros">
            <h3>Restricciones de Viajes</h3>
            <p>
              Revisa si tu destino tiene restricciones de viaje o exigencias de<br />
              Pruebas de Covid-19, que pueden impactar tu viaje.
            </p>
            <button className="boton-restricciones">Conocer las restricciones de viajes</button>
          </div>

          <div className="cuenta-recuadros">
            <h3>Habla con un Ejecutivo Comercial</h3>
            <p>
              Si ya tienes tienes una Cuenta Corporativa, puedes hablar<br />
              directamente con nuestros Ejecutivos Comerciales.
            </p>
            <button className="boton-restricciones">Conocer las restricciones de viajes</button>
          </div>

          <div className="cuenta-recuadro-grande">
            <h3>Prueba PCR (Covid-19) incluida en tu tarifa </h3>
            <p>
              Si uno de los destinos a los que viajes exige una prueba PCR para el Covid-19, nosotros te hacemos la
              vida más fácil. Nos aliamos con SynLab para<br />
              que viajes tranquilo, descubre todos los beneficios que trae tu talla.
            </p>
            <button className="boton-restricciones">Conocer las restricciones de viajes</button>
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
        {[{ img: twitter, alt: 'Twitter' }, { img: facebook, alt: 'Facebook' }, { img: youtube, alt: 'YouTube' }, { img: instagram, alt: 'Instagram' }].map((media, i) => (
          <a href="#" key={i}>
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
      </div>

      <div className="vr"></div>

      <div className="footer-media-security">
        <img src={sitioSeguro} alt="Logo Candado" />
        <img src={vigilado} alt="Logo seguridad transporte" />
        <img src={aerona} alt="Aeronautica Logo" />
      </div>
    </div>

    <hr />

    <div className="container-wianca">
      <img src={avianca} alt="Avianca Logo" />
      <img src={alianza} alt="Alliance logo" />
      <p>
        Avianca S.A. - 2020 Copyright © Todos los derechos reservados.
        NIT 890.100.577-6. RNT 20175
      </p>
    </div>
  </div>
</footer>

      {/* Agrega las demás secciones aquí... */}
    </div>
  );
};

export default btnOfertas