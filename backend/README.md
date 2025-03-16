# Goesnet backend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Go Version](https://img.shields.io/badge/Go-1.17+-blue.svg)](https://golang.org)
[![Docker](https://img.shields.io/badge/Docker-ready-blue.svg)](https://www.docker.com)

Il backend del progetto è stato sviluppato in **Go** utilizzando il framework **Gin**.  
Gestisce autenticazione JWT, operazioni CRUD per post, commenti, like, follow, notifiche e l'upload di immagini su **AWS S3**.  
Il database è gestito con **MySQL** e **GORM**.

---

## Caratteristiche

- **Autenticazione & Sicurezza:**  
  Gestione degli utenti con registrazione, login e token JWT per proteggere gli endpoint.
  
- **Gestione dei Contenuti:**  
  Creazione, aggiornamento e recupero di post, commenti, like e interazioni social (follow/unfollow).

- **Notifiche:**  
  Sistema di notifiche per commenti, like e nuovi follower.

- **Upload su S3:**  
  Supporto per l'upload di immagini dei profili direttamente su AWS S3.

- **Configurazione tramite Docker Compose:**  
  Orchestrazione dei container per il database, il backend e il frontend.
- **Reverse proxy per le richieste:**
  Nginx per la gestione delle richieste al router React.
---

## Tecnologie
- **Nginx**
- **Go** (Golang)
- **Gin Web Framework**
- **GORM** per l'ORM
- **MySQL 8.0**
- **AWS S3** (con AWS SDK v2)
- **JWT** per la sicurezza

---

Il backend verrà eseguito sulla porta 8080.

## Struttura della directory
- /config: Configurazioni iniziali e inizializzazione del database.
- /controllers: Endpoint HTTP che collegano le richieste al business logic.
- /middleware: Gestione di CORS, autenticazione JWT e error handling.
- /models: Definizione delle entità (User, Post, Comment, Like, Follow, Notification).
- /routes: Definizione delle rotte e dei gruppi di API.
- /services: Logica di business e interazioni con il database, incluso l'upload su S3.

---
