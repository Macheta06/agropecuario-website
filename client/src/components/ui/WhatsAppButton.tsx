/**
 * @file components/ui/WhatsAppButton.tsx
 * @description Botón flotante global de contacto por WhatsApp.
 * Posición fija en la esquina inferior derecha, siempre visible.
 */
import { getGeneralWhatsAppUrl } from '../../utils/whatsapp';

export const WhatsAppButton = () => (
  <a
    href={getGeneralWhatsAppUrl()}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Contactar por WhatsApp"
    className="fixed bottom-6 right-5 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-2xl transition-transform duration-200 hover:scale-110 active:scale-95 animate-pulse-wa"
    style={{ backgroundColor: '#25d366' }}
  >
    {/* WhatsApp official icon SVG */}
    <svg
      viewBox="0 0 32 32"
      className="w-8 h-8 fill-white"
      aria-hidden="true"
    >
      <path d="M16.002 2C8.268 2 2 8.267 2 16c0 2.49.657 4.83 1.804 6.855L2 30l7.332-1.777A13.94 13.94 0 0016.002 30C23.732 30 30 23.733 30 16S23.732 2 16.002 2zm0 25.6a11.55 11.55 0 01-5.87-1.602l-.42-.25-4.35 1.054 1.094-4.22-.277-.435A11.55 11.55 0 014.4 16c0-6.396 5.206-11.6 11.602-11.6S27.6 9.604 27.6 16 22.398 27.6 16.002 27.6zm6.36-8.676c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.103 1.364-.202.232-.406.26-.754.086-.348-.174-1.47-.54-2.8-1.726-1.033-.924-1.73-2.064-1.933-2.41-.203-.346-.022-.534.152-.707.157-.155.348-.406.522-.61.174-.203.232-.347.348-.578.116-.232.058-.434-.028-.61-.087-.174-.784-1.89-1.073-2.588-.283-.68-.57-.587-.784-.598l-.667-.012a1.278 1.278 0 00-.927.434c-.319.348-1.218 1.19-1.218 2.9s1.247 3.363 1.42 3.596c.174.232 2.454 3.744 5.946 5.25.83.357 1.48.57 1.985.73.833.264 1.592.226 2.192.137.668-.1 2.06-.84 2.35-1.652.29-.81.29-1.506.202-1.652-.086-.145-.32-.23-.667-.406z" />
    </svg>
  </a>
);
