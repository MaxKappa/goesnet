# Goesnet frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-17+-blue.svg)](https://reactjs.org)
[![Material UI](https://img.shields.io/badge/Material%20UI-v5-blue.svg)](https://mui.com)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com)

Il frontend di goesnet è sviluppato in **React** e offre un'interfaccia utente minimal.  
Utilizza **React Router** per la navigazione, **Material UI** per componenti stilizzati e **Tailwind CSS** per lo styling personalizzato.

---

## Caratteristiche

- **Navigazione fluida:**  
  Utilizzo di React Router per gestire le pagine (Home, Login, Register, Profilo, ecc.).

- **Componenti Interattivi:**  
  Componenti come **Navbar**, **Post**, **LikeButton**, **NotificationDropdown** e **UserItem** per una user experience completa.

- **Gestione degli Errori:**  
  Feedback tramite componenti come **ErrorAlert** e notifiche toast per segnalare errori e successi.

- **Responsive Design:**  
  Progettato per essere usato sia su desktop che su dispositivi mobili.

---

## Tecnologie

- **React**
- **React Router**
- **Material UI**
- **Tailwind CSS**
- **Axios** 
- **React Toastify** per notifiche

---

## Requisiti

- Node.js e npm/yarn installati

Il frontend sarà disponibile sulla porta 3000.

## Struttura della directory
- /components: Componenti riutilizzabili (Navbar, Post, LikeButton, NotificationDropdown, ecc.).
- /pages: Pagine principali dell'applicazione (Home, Login, Register, Profile, NotFound, Landing, ecc.).
- /context: Gestione dello stato globale (es. autenticazione).
- /utils: Moduli di utilità, ad esempio per le chiamate API.
- /styles: File CSS o configurazioni di Tailwind CSS.


