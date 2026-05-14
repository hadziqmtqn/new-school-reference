const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { parse } = require('csv-parse/sync');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const IMPORT_ORDER = [
    { table: 'education_units', file: 'education_units.csv' },
    { table: 'form_of_education', file: 'form_of_education.csv' },
    { table: 'provinces', file: 'provinces.csv' },
    { table: 'cities', file: 'cities.csv' },
    { table: 'districts', file: 'districts.csv' },
    { table: 'schools', pattern: 'schools_part_*.csv' }
];

async function importCSV(tableName, filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}, skipping...`);
        return;
    }

    console.log(`Importing ${tableName} from ${path.basename(filePath)}...`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    if (records.length === 0) return;

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const columns = Object.keys(records[0]);
        const queryText = `
            INSERT INTO ${tableName} (${columns.join(', ')})
            VALUES (${columns.map((_, i) => `$${i + 1}`).join(', ')})
            ON CONFLICT (id) DO NOTHING
        `;

        let importedCount = 0;
        for (const record of records) {
            const values = columns.map(col => {
                const val = record[col];
                if (val === '' || val === 'NULL' || val === undefined) return null;
                
                if (col === 'created_at' || col === 'updated_at') {
                    return val ? new Date(val).toISOString() : null;
                }
                return val;
            });
            const res = await client.query(queryText, values);
            if (res.rowCount > 0) importedCount++;
        }

        await client.query('COMMIT');
        console.log(`Finished: ${importedCount} new records imported, ${records.length - importedCount} skipped.`);
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(`Error importing ${tableName}:`, err.message);
        throw err;
    } finally {
        client.release();
    }
}

async function run() {
    try {
        const exportsDir = path.join(__dirname, '../data/exports');
        const targetFile = process.argv[2]; // Contoh: node import-to-neon.js schools_part_1.csv

        if (targetFile) {
            // Mode Impor File Spesifik
            const tableName = targetFile.startsWith('schools_') ? 'schools' : targetFile.replace('.csv', '');
            await importCSV(tableName, path.join(exportsDir, targetFile));
        } else {
            // Mode Impor Otomatis Semua
            for (const item of IMPORT_ORDER) {
                if (item.file) {
                    await importCSV(item.table, path.join(exportsDir, item.file));
                } else if (item.pattern) {
                    const files = fs.readdirSync(exportsDir)
                        .filter(f => f.startsWith('schools_part_') && f.endsWith('.csv'))
                        .sort((a, b) => {
                            const numA = parseInt(a.match(/\d+/)[0]);
                            const numB = parseInt(b.match(/\d+/)[0]);
                            return numA - numB;
                        });
                    
                    for (const file of files) {
                        await importCSV(item.table, path.join(exportsDir, file));
                    }
                }
            }
        }
        console.log('Done!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

run();
