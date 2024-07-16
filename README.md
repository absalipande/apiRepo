# Geolocation Web Application

## Overview

This is a sample web application built with ReactJS (frontend) and Node.js (backend) that fetches and displays geolocation information for given IP addresses or ASN (Autonomous System Numbers). The application includes a login screen, a home screen with IP search functionality, and search history management.

## Features

- **Login Screen**
  - Simple login form that validates credentials from the database.
  - User Seeder included to create a default user for login.

- **Home Screen**
  - Displays the IP & geolocation information of the logged-in user.
  - Allows entering a new IP address or ASN and displays the geolocation information.
  - Adds each search as a history entry in the database.
  - Displays an error for invalid IP addresses or ASN.
  - Lists search history and allows re-fetching geolocation information by clicking on history entries.
  - Includes a checkbox on the history list for deleting multiple history entries.

## Technologies Used

- **Frontend**
  - ReactJS
  - Axios
  - TailwindCSS
  - React Icons
  - react-hot-toast

- **Backend**
  - Node.js
  - Express
  - PostgreSQL
  - bcryptjs
  - dotenv
  - axios

## Getting Started

### Prerequisites

- Node.js
- PostgreSQL


### Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/absalipande/apiRepo.git
   cd apiRepo

2. **Backend Setup:**

  - cd backend    
  - npm install

  - Create a `.env` file in the `backend` directory with the following content:

```PORT=3000
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3001
IPINFO_TOKEN=your_ipinfo_token
```
