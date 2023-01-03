import mysql2 from 'mysql2';

// export const db = mysql2.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'inkorrect',
//     database: 'blog'
// })

export const db = mysql2.createConnection({
    host: 'containers-us-west-174.railway.app',
    user: 'root',
    password: 'wNMyNMqdiXD1B1iDzz9x',
    database: 'railway',
    port: 7897
})


