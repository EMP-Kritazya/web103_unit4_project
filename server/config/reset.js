import { pool } from './database.js'
import { calculatePrice } from './carOptions.js'

// Drops and recreates the cars table, then inserts a few sample cars.
// Run with:  cd server && node config/reset.js   (or: npm run reset from the repo root)

const createCarsTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS cars;

        CREATE TABLE IF NOT EXISTS cars (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            exterior VARCHAR(255) NOT NULL,
            roof VARCHAR(255) NOT NULL,
            wheels VARCHAR(255) NOT NULL,
            interior VARCHAR(255) NOT NULL,
            price INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    `

    await pool.query(createTableQuery)
    console.log('🎉 cars table created successfully')
}

const seedCarsTable = async () => {
    await createCarsTable()

    const sampleCars = [
        { name: 'Midnight Cruiser', exterior: 'Black', roof: 'Moonroof', wheels: '19" Black Alloy', interior: 'Black Leather' },
        { name: 'Track Star', exterior: 'Red', roof: 'Body Color', wheels: '20" Chrome', interior: 'White Leather' },
        { name: 'Weekend Roadster', exterior: 'Blue', roof: 'Convertible', wheels: '19" Black Alloy', interior: 'Black Leather' },
    ]

    for (const car of sampleCars) {
        const price = calculatePrice(car)

        const insertQuery = {
            text: `
                INSERT INTO cars (name, exterior, roof, wheels, interior, price)
                VALUES ($1, $2, $3, $4, $5, $6)
            `,
            values: [car.name, car.exterior, car.roof, car.wheels, car.interior, price],
        }

        await pool.query(insertQuery)
        console.log(`🌱 seeded car: ${car.name} ($${price.toLocaleString()})`)
    }
}

seedCarsTable()
    .then(() => {
        console.log('✅ database reset complete')
        pool.end()
    })
    .catch((err) => {
        console.error('❌ error resetting database:', err)
        pool.end()
    })
