import 'dotenv/config'
import { Sequelize } from 'sequelize';



const sequelize = new Sequelize(
    {
        // host: process.env.POSTGRES_HOST,
        host: 'localhost',
        // port: 5432,
        port: 15432,
        database: 'postgres',
        schema: 'booklist',
        dialect: 'postgres',
        username: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        logging: false,
        define: {
            timestamps: false,
            freezeTableName: true
        }
    });

export default sequelize