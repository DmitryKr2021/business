import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import App from "./App";
import ru from './locales/ru';

const i18n = i18next.createInstance();
  await i18n.use(initReactI18next).init({
    resources: { ru },
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n} defaultNS="translation">
      <App />
    </I18nextProvider>
  </React.StrictMode>,
);
