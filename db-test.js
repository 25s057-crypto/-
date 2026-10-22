
const mysql = require('mysql2/promise');

async function testConnection() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        ssl: {
            rejectUnauthorized: true
        }
    });

    try {
        const [rows] = await connection.query(
            'SELECT 1 + 2 AS result'
        );

        console.log('DB 연결 성공!');
        console.log(rows);
    } finally {
        await connection.end();
    }
}

testConnection().catch((err) => {
    console.error('DB 연결 실패:', err.message);
});
