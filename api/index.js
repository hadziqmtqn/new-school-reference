const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// 1. Get Provinces
app.get('/api/provinces', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, code FROM provinces ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get Cities by Province
app.get('/api/cities', async (req, res) => {
    const { province_id } = req.query;
    try {
        const result = await pool.query(
            'SELECT id, name, code FROM cities WHERE province_id = $1 ORDER BY name ASC',
            [province_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Get Districts by City
app.get('/api/districts', async (req, res) => {
    const { city_id } = req.query;
    try {
        const result = await pool.query(
            'SELECT id, name, code FROM districts WHERE city_id = $1 ORDER BY name ASC',
            [city_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get Villages by District (Unique from schools table)
app.get('/api/villages', async (req, res) => {
    const { district_id } = req.query;
    try {
        const result = await pool.query(
            'SELECT DISTINCT village as name FROM schools WHERE district_id = $1 AND village IS NOT NULL ORDER BY village ASC',
            [district_id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get Form of Education (School Groups)
app.get('/api/form-of-education', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, code FROM form_of_education ORDER BY name ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get Schools with Filters
app.get('/api/schools', async (req, res) => {
    const { province_id, city_id, district_id, form_id, village, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
        SELECT s.*, f.name as education_form_name, d.name as district_name 
        FROM schools s
        JOIN form_of_education f ON s.form_of_education_id = f.id
        JOIN districts d ON s.district_id = d.id
        JOIN cities c ON d.city_id = c.id
        WHERE 1=1
    `;
    const params = [];
    let paramIdx = 1;

    if (province_id) {
        query += ` AND c.province_id = $${paramIdx++}`;
        params.push(province_id);
    }
    if (city_id) {
        query += ` AND d.city_id = $${paramIdx++}`;
        params.push(city_id);
    }
    if (district_id) {
        query += ` AND s.district_id = $${paramIdx++}`;
        params.push(district_id);
    }
    if (form_id) {
        query += ` AND s.form_of_education_id = $${paramIdx++}`;
        params.push(form_id);
    }
    if (village) {
        query += ` AND s.village ILIKE $${paramIdx++}`;
        params.push(`%${village}%`);
    }
    if (search) {
        query += ` AND (s.name ILIKE $${paramIdx} OR s.npsn ILIKE $${paramIdx})`;
        params.push(`%${search}%`);
        paramIdx++;
    }

    // Count total for pagination
    const countQuery = `SELECT COUNT(*) FROM (${query}) as total`;
    const totalResult = await pool.query(countQuery, params);
    const total = parseInt(totalResult.rows[0].count);

    // Limit and Offset
    query += ` ORDER BY s.name ASC LIMIT $${paramIdx++} OFFSET $${paramIdx++}`;
    params.push(limit, offset);

    try {
        const result = await pool.query(query, params);
        res.json({
            data: result.rows,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                total_pages: Math.ceil(total / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
