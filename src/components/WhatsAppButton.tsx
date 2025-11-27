"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { generateWhatsAppLink, isValidPeruvianPhone } from "@/lib/phone-utils";

interface WhatsAppButtonProps {
  phone?: string;
  engineerName?: string;
  message?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg";
  fullWidth?: boolean;
  className?: string;
}

export default function WhatsAppButton({
  phone,
  engineerName = "Ingeniero",
  message,
  variant = "default",
  size = "default",
  fullWidth = false,
  className = "",
}: WhatsAppButtonProps) {
  if (!phone || !isValidPeruvianPhone(phone)) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Teléfono no disponible
      </Button>
    );
  }

  const defaultMessage = `Hola ${engineerName}, me gustaría contactarte a través de IngWork.`;
  const whatsappLink = generateWhatsAppLink(phone, message || defaultMessage);

  if (!whatsappLink) {
    return (
      <Button
        disabled
        variant="outline"
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${className}`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Número inválido
      </Button>
    );
  }

  return (
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-block">
      <Button
        variant={variant}
        size={size}
        className={`${fullWidth ? "w-full" : ""} ${className} bg-green-600 hover:bg-green-700 text-white`}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Contactar por WhatsApp
      </Button>
    </a>
  );
}
