import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        schema: 'booklist',
        dialect: 'postgres',
        username: 'booklistuser',
        password: 'booklistuser',
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });

export default sequelize