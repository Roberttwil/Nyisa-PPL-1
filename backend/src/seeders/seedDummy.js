const { faker } = require('@faker-js/faker');
const { User, Users, Restaurant, Food, Transaction, Cart } = require('../models');
const sequelize = require('../config/db');

async function seed() {
    try {
        await sequelize.sync({ force: true }); // Reset database

        // Seed Users + Credentials
        const userList = [];
        for (let i = 0; i < 5; i++) {
            const username = faker.internet.username();
            const user = await User.create({
                name: faker.person.fullName(),
                phone: faker.phone.number('08##########'),
                email: faker.internet.email(),
                address: faker.location.streetAddress(),
                status: faker.number.int({ min: 0, max: 1 }),
                username: username
            });
            await Users.create({
                username: username,
                password: faker.internet.password()
            });
            userList.push(user);
        }

        // Seed Restaurants
        const restaurantList = [];
        for (let i = 0; i < 5; i++) {
            const restaurant = await Restaurant.create({
                name: faker.company.name(),
                address: faker.location.streetAddress(),
                phone: faker.phone.number('08##########'),
                email: faker.internet.email(),
                restaurant_type: faker.helpers.arrayElement(['Cafe', 'Resto', 'Warung', 'Kiosk']),
                photo: faker.image.url(),
                rating: faker.number.float({ min: 3, max: 5 }),
                longitude: faker.location.longitude(),
                latitude: faker.location.latitude()
            });
            restaurantList.push(restaurant);
        }

        // Seed Foods
        const foodList = [];
        for (let i = 0; i < 15; i++) {
            const restaurant = faker.helpers.arrayElement(restaurantList);
            const food = await Food.create({
                name: faker.commerce.productName(),
                type: faker.helpers.arrayElement(['Main Course', 'Snack', 'Drink']),
                price: faker.number.float({ min: 10_000, max: 100_000 }),
                photo: faker.image.url(),
                quantity: faker.number.int({ min: 1, max: 50 }),
                restaurant_id: restaurant.restaurant_id
            });
            foodList.push(food);
        }

        // Seed Cart
        for (let i = 0; i < 10; i++) {
            const user = faker.helpers.arrayElement(userList);
            const food = faker.helpers.arrayElement(foodList);

            await Cart.create({
                booking_code: faker.string.alphanumeric(10),
                user_id: user.user_id,
                restaurant_id: food.restaurant_id,
                food_id: food.food_id,
            });
        }

        // Seed Transactions
        for (let i = 0; i < 10; i++) {
            const user = faker.helpers.arrayElement(userList);
            const food = faker.helpers.arrayElement(foodList);

            await Transaction.create({
                booking_code: faker.string.alphanumeric(10),
                user_id: user.user_id,
                restaurant_id: food.restaurant_id,
                food_id: food.food_id,
                total: food.price * faker.number.int({ min: 1, max: 3 }),
                status: faker.number.int({ min: 0, max: 1 }),
                date: faker.date.recent()
            });
        }

        console.log('Dummy data berhasil dimasukkan!');
        process.exit();
    } catch (err) {
        console.error('Gagal insert data dummy:', err);
        process.exit(1);
    }
}

seed();
