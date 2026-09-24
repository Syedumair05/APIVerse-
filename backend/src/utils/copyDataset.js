import fs from 'fs';
import path from 'path';

const srcDataPath = path.join(__dirname, '../../../src/data/countriesData.json');
const destDataPath = path.join(__dirname, '../data/countriesData.json');

if (fs.existsSync(srcDataPath)) {
  fs.mkdirSync(path.dirname(destDataPath), { recursive: true });
  fs.copyFileSync(srcDataPath, destDataPath);
}
