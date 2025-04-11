// app/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "Account Setup": "Account Setup",
      "Allow Notifications": "Allow Notifications",
      "Enable Dark Mode": "Enable Dark Mode",
      "Enable High Contrast": "Enable High Contrast",
      Language: "Language",
      "Preferred Resources": "Preferred Resources",
      Save: "Save",
      "Log Out": "Log Out",
      Success: "Success",
      "Preferences saved!": "Preferences saved!",
      "Selected Resources": "Selected Resources",
      Error: "Error",
      "Failed to save preferences. Try again.":
        "Failed to save preferences. Try again.",
      "Mental Health": "Mental Health",
      "Financial Tips": "Financial Tips",
      "Career Advice": "Career Advice",
      "Physical Well-Being": "Physical Well-Being",
    },
  },
  es: {
    translation: {
      "Account Setup": "Configuración de Cuenta",
      "Allow Notifications": "Permitir Notificaciones",
      "Enable Dark Mode": "Activar Modo Oscuro",
      "Enable High Contrast": "Activar Alto Contraste",
      Language: "Idioma",
      "Preferred Resources": "Recursos Preferidos",
      Save: "Guardar",
      "Log Out": "Cerrar sesión",
      Success: "Éxito",
      "Preferences saved!": "¡Preferencias guardadas!",
      "Selected Resources": "Recursos Seleccionados",
      Error: "Error",
      "Failed to save preferences. Try again.":
        "Error al guardar preferencias. Inténtalo de nuevo.",
      "Mental Health": "Salud Mental",
      "Financial Tips": "Consejos Financieros",
      "Career Advice": "Consejos Profesionales",
      "Physical Well-Being": "Bienestar Físico",
    },
  },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
