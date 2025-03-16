# Goesnet

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Docker Compose](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://docs.docker.com/compose/)
[![Stars](https://img.shields.io/github/stars/tuo-username/social-network?style=social)](https://github.com/MaxKappa/goesnet)

Un semplice social network con **backend** sviluppato in **Go** e **frontend** in **React**.  
Il progetto include funzionalità per autenticazione, creazione e gestione di post, commenti, like, follow e notifiche, caricamento di immagini con AWS S3.

---

## Panoramica

Il progetto è diviso in due parti principali:

- **Backend:**  
  - Sviluppato in Go con il framework Gin.
  - Gestisce la logica di business, la comunicazione con il database MySQL e l'upload su AWS S3.
  - Include endpoint per utenti, post, commenti, like, follow e notifiche.
  - Protezione degli endpoint tramite JWT e middleware per CORS ed error handling.

- **Frontend:**  
  - Realizzato in React, offre un'interfaccia utente interattiva e responsive.
  - Utilizza React Router, Material UI e Tailwind CSS per una UX moderna.
  - Consuma le API fornite dal backend per operazioni social e autenticazione.

---

## Prerequisiti

- **Docker** per eseguire l'intero stack (backend, frontend, database).

- **Configurare:** il file `.env` per includere le seguenti variabili:
  
  ```dotenv
  DB_USER=root
  DB_PASSWORD=[redacted]
  DB_HOST=db
  DB_PORT=3306
  DB_NAME=goesnet_db
  JWT_SECRET=[redacted]
  AWS_ACCESS_KEY_ID=[redacted]
  AWS_SECRET_ACCESS_KEY=[redacted]
  AWS_REGION=
  S3_BUCKET=goesnetbucket

- **Node.js (per il frontend) e Go (per il backend):**
## Installazione e Avvio

- Clonare il repository:

```bash
git clone https://github.com/MaxKappa/goesnet.git
cd social-network
```
- Avviare l'intero stack con Docker Compose:

```bash
docker compose up --build
```
Il comando eseguirà:

- Il container MySQL con il database goesnet_db.
- Il backend sulla porta 8080.
- Il frontend sulla porta 3000.


## Licenza
Questo progetto è distribuito sotto la licenza MIT.
Vedi il file LICENSE per maggiori dettagli.

## Contatti
Per ulteriori informazioni o suggerimenti, sentiti libero di aprire un'issue o contattare @MaxKappa.

