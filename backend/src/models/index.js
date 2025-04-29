const User = require('./User');
const Users = require('./Users');
const Restaurant = require('./Restaurant');
const Food = require('./Food');
const Transaction = require('./Transaction');
const Cart = require('./Cart');

User.hasOne(Users, { foreignKey: 'username' , sourceKey: 'username' , as: 'user' });
Users.belongsTo(User, { foreignKey: 'username', targetKey: 'username', as: 'user' });

User.hasMany(Transaction, { foreignKey: 'user_id' , sourceKey: 'user_id' , as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'user_id', targetKey: 'user_id', as: 'user' });

Restaurant.hasMany(Food, { foreignKey: 'restaurant_id' , sourceKey: 'restaurant_id' , as: 'foods' });
Food.belongsTo(Restaurant, { foreignKey: 'restaurant_id', targetKey: 'restaurant_id', as: 'restaurant' });

Transaction.hasOne(Food, { foreignKey: 'food_id' , sourceKey: 'food_id' , as: 'food' });
Food.belongsTo(Transaction, { foreignKey: 'food_id', targetKey: 'food_id', as: 'transaction' });

Transaction.hasOne(Restaurant, { foreignKey: 'restaurant_id' , sourceKey: 'restaurant_id' , as: 'restaurant' });
Restaurant.belongsTo(Transaction, { foreignKey: 'restaurant_id', targetKey: 'restaurant_id', as: 'transaction' });

Cart.belongsTo(Food, { foreignKey: 'food_id', as: 'food' });

module.exports = {
    User,
    Users,
    Restaurant,
    Food,
    Transaction,
    Cart
}