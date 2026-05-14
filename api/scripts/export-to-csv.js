const mysql = require('mysql2/promise');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TABLES_TO_EXPORT = [
    { name: 'education_units', split: false },
    { name: 'form_of_education', split: false },
    { name: 'provinces', split: false },
    { name: 'cities', split: false },
    { name: 'districts', split: false },
    { name: 'schools', split: true, chunkSize: 50000 }
];

async function exportTable(connection, tableName, split = false, chunkSize = 50000) {
    console.log(`Exporting table: ${tableName}...`);
    
    const exportDir = path.join(__dirname, '../data/exports');
    if (!fs.existsSync(exportDir)) {
        fs.mkdirSync(exportDir, { recursive: true });
    }

    if (!split) {
        const [rows] = await connection.execute(`SELECT * FROM ${tableName}`);
        if (rows.length === 0) {
            console.log(`Table ${tableName} is empty.`);
            return;
        }

        const headers = Object.keys(rows[0]).map(key => ({ id: key, title: key }));
        const csvWriter = createCsvWriter({
            path: path.join(exportDir, `${tableName}.csv`),
            header: headers
        });

        await csvWriter.writeRecords(rows);
        console.log(`Successfully exported ${rows.length} rows to ${tableName}.csv`);
    } else {
        const [countResult] = await connection.execute(`SELECT COUNT(*) as total FROM ${tableName}`);
        const totalRows = countResult[0].total;
        console.log(`Total rows in ${tableName}: ${totalRows}`);

        if (totalRows === 0) return;

        let offset = 0;
        let part = 1;

        while (offset < totalRows) {
            console.log(`Fetching ${tableName} part ${part} (offset: ${offset})...`);
            const [rows] = await connection.execute(`SELECT * FROM ${tableName} LIMIT ${chunkSize} OFFSET ${offset}`);
            
            if (rows.length === 0) break;

            const headers = Object.keys(rows[0]).map(key => ({ id: key, title: key }));
            const filePath = path.join(exportDir, `${tableName}_part_${part}.csv`);
            const csvWriter = createCsvWriter({
                path: filePath,
                header: headers
            });

            await csvWriter.writeRecords(rows);
            console.log(`Part ${part} exported (${rows.length} rows) to ${path.basename(filePath)}`);

            offset += chunkSize;
            part++;
        }
    }
}

async function run() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });

        for (const table of TABLES_TO_EXPORT) {
            await exportTable(connection, table.name, table.split, table.chunkSize);
        }

        console.log('Migration to CSV completed successfully.');
    } catch (error) {
        console.error('Error during export:', error);
    } finally {
        if (connection) await connection.end();
    }
}

run();
