## Setup Instructions


**Technologies Used** : NodeJs , Express , MySQL
Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/nipunaroraE2E/IRCTC.git
   cd IRCTC


2. **Set Up Environment**

    ```bash
    # For Python projects
    python -m venv venv
    source venv/bin/activate  # On macOS/Linux
    .\venv\Scripts\activate   # On Windows

3. **Install Dependencies**

    ```bash
    npm install

4. **Run Application**

    ```bash
    npx ts-node app.ts



## Database Setup

This project uses a MySQL database set up on your local computer.

- **Database Name**: `IRCTC`
- **Tables**: `users`, `Train`, `Bookings`

### Creating Tables

After starting your MySQL server, you can create the required tables using the following commands:

#### Users Table

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




### Train Table

CREATE TABLE Train (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trainName VARCHAR(100) NOT NULL,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    totalSeats INT NOT NULL,
    availableSeats INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


### Bookings Table 


CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    train_id INT NOT NULL,
    booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    seats_booked INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (train_id) REFERENCES Train(id) ON DELETE CASCADE
);

```


## Postman API Collection

You can use the following Postman API collection to run and test the APIs:

[IRCTC Personal Project API Collection](https://www.postman.com/node-api-team/irctc-workindia-public/collection/65z1jup/irctc-personal-project)

### Configuration

Before running the APIs, make sure to set the following environment variables in Postman:

- **ADMIN_TOKEN**: Change this token to set the admin; otherwise, access will be denied.
- **JWT_Token**: Set this token as per your needs.

### Environment Variables
```plaintext
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=IRCTC
JWT_SECRET="WorkIndia IRCTC"  
ADMIN_TOKEN="Insert Token"
