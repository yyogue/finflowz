import pool from '../config/db.js';

const testDBConnection = async () => {
    try {
        const res = await pool.query('SELECT NOW()');
        console.log('✅ Database Connected Successfully:', res.rows[0]);
    } catch (err) {
        console.error('❌ Database Connection Error:', err);
    }
};

testDBConnection();
