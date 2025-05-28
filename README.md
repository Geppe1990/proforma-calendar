# Proforma Calendar

## 1. Crea un progetto su Google Cloud Console
   - Vai su [Google Cloud Console](https://console.cloud.google.com/)
   - Clicca su Select a project > New Project
   - Dai un nome al progetto e crea il progetto

## 2. Abilita API Calendar
   - Nel progetto appena creato, vai su API & Services > Library
   - Cerca e abilita l’API Google Calendar API

## 3. Configura le credenziali OAuth 2.0
   - Creare un OAuth Client ID
   - Scegli il tipo di applicazione: Web application
   - Inserisci gli Authorized JavaScript origins
   - Ad esempio: http://localhost:5173 (per sviluppo locale)
   - Cliccare su **Pubblico** e aggiungere la vostra mail in **Utenti di prova** 

## 4. Settaggi App 
   - Crea le credenziali e inserisci il **Client ID** all'interno di **VITE_CLIENT_ID** dentro **.env.example**
   - Rinominare **.env.example** in **.env**
   - Modificare il file **settings.ts** con i propri dati 
