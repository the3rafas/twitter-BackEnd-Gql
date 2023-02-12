import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';


export const env = process.env.NODE_ENV === 'production' ? process.env : dotenv.parse(fs.readFileSync(path.join(process.cwd(), '.env')));
