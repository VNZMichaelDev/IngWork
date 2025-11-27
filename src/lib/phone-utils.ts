/**
 * Utilidades para validación y manejo de teléfonos peruanos
 */

/**
 * Valida si un número de teléfono es peruano válido
 * Formatos aceptados:
 * - +51 9XX XXX XXXX
 * - +51 9XXXXXXXX
 * - 9XX XXX XXXX
 * - 9XXXXXXXX
 */
export function isValidPeruvianPhone(phone: string): boolean {
  if (!phone) return false;

  // Remover espacios y caracteres especiales
  const cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Validar formato: debe empezar con +51 o 9, y tener 9 dígitos después del código de país
  const peruPattern = /^(\+51)?9\d{8}$/;
  return peruPattern.test(cleaned);
}

/**
 * Normaliza un número de teléfono peruano al formato internacional
 * Retorna: +51XXXXXXXXX
 */
export function normalizePeruvianPhone(phone: string): string | null {
  if (!isValidPeruvianPhone(phone)) return null;

  // Remover espacios y caracteres especiales
  let cleaned = phone.replace(/[\s\-\(\)]/g, "");

  // Si no tiene +51, agregarlo
  if (!cleaned.startsWith("+51")) {
    if (cleaned.startsWith("51")) {
      cleaned = "+" + cleaned;
    } else {
      cleaned = "+51" + cleaned;
    }
  }

  return cleaned;
}

/**
 * Genera un enlace de WhatsApp para un número peruano
 * Retorna: https://wa.me/51XXXXXXXXX
 */
export function generateWhatsAppLink(phone: string, message?: string): string | null {
  const normalized = normalizePeruvianPhone(phone);
  if (!normalized) return null;

  // Remover el + del número
  const phoneNumber = normalized.replace("+", "");

  let url = `https://wa.me/${phoneNumber}`;

  if (message) {
    // Codificar el mensaje para URL
    const encodedMessage = encodeURIComponent(message);
    url += `?text=${encodedMessage}`;
  }

  return url;
}

/**
 * Extrae solo los dígitos de un número de teléfono
 */
export function extractPhoneDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

/**
 * Formatea un número de teléfono peruano para visualización
 * Entrada: 9XXXXXXXX o +51XXXXXXXXX
 * Salida: +51 9XX XXX XXXX
 */
export function formatPeruvianPhoneForDisplay(phone: string): string {
  const normalized = normalizePeruvianPhone(phone);
  if (!normalized) return phone;

  // Formato: +51 9XX XXX XXXX
  const match = normalized.match(/^(\+51)(\d{1})(\d{2})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]} ${match[2]}${match[3]} ${match[4]} ${match[5]}`;
  }

  return normalized;
}
