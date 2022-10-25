import { DataTypes } from 'sequelize';
import sequelize from './config.mjs';

// DEFINE MODEL
const Book = sequelize.define(
    'Book', {
    title: {
        type: DataTypes.TEXT,
        primaryKey: true,
        unique: true
    },
    author: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

const User = sequelize.define(
    'User', {
    name: {
        type: DataTypes.TEXT,
        primaryKey: true,
    },
    password: { type: DataTypes.TEXT },
});

const BookUser = sequelize.define('BookUser', {
    comment: {
        type: DataTypes.TEXT,
    }
});

Book.belongsToMany(User, { through: BookUser })
User.belongsToMany(Book, { through: BookUser })

await sequelize.sync({ alter: true }); // recreate all tables in the database if they don't exist or if they don't match the model, otherwise do nothing

export { User, Book }