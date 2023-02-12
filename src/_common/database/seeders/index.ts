import { Sequelize } from 'sequelize-typescript';
import { models } from '../database.models.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import {env} from 'src/_common/utils/env'

export interface ISeedArgs {
  truncate: boolean;
  count: number;
}
// ? YOU CAN USE THIS SEEDER ON TERMINAL LIKE: `yarn seed user --count=50 --truncate`
// * File name is required. count and truncate are optional

async function Seed() {
  // Connect to db
  new Sequelize({
    dialect: 'postgres',
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USER,
    password: env.DB_PASS,
    database: env.DB_NAME,
    logging: false,
    models
  });

  // Get npm remaining args like >> yarn seed users
  const args = process.argv.slice(2);

  if (!args || !args.length) {
    console.log('ERROR: Specify a model for seeding.');
    process.exit(1);
  }

  // Get file name
  const seedList = [args[0]];
  let config: ISeedArgs = { truncate: false, count: 25 };

  const countArg = args.find(arg => arg.includes('--count='));
  const truncateArg = args.find(arg => arg.includes('--truncate'));

  if (truncateArg) config.truncate = true;
  if (countArg) {
    const c = countArg.split('=')[1];
    if (Number.isInteger(parseInt(c))) config.count = Number(c);
  }

  const seeds = seedList.reduce((prev, file) => {
    return prev.then(async () => {
      if (file === 'all') {
        const seds: { name: string; records: string }[] = [];
        const files = readdirSync(join(__dirname));
        console.log('Seeding Status : ');
        console.log('-----------------------------------');
        for (let fileName of files) {
          if (fileName.endsWith('.js') && fileName !== 'index.js') {
            const seeding = require(`./${fileName}`);
            console.log(`Seeding : ${fileName.split('.js')[0]}`);
            const seedRecords = await seeding.seed(config);
            const records = await seedRecords;
            seds.push({
              name: `${fileName.split('.js')[0]}`,
              records: records?.length || 'unknown'
            });
          }
        }
        console.log('-----------------------------------');
        seds.forEach(sed => {
          console.log(`Seeded ${sed.name} : ${sed.records} records.`);
        });
        console.log('-----------------------------------');
        console.log('Seeding Done Successfully');
        return;
      }
      const seeder = require(`./${file}`);
      console.log(`Seeding: ${file}`);
      return seeder.seed(config).then(records => {
        console.log(`Seeded ${file}: ${records?.length} records.`);
      });
    });
  }, Promise.resolve(true));

  // Wait for all seeders to finish.
  await seeds;

  // Exit with success
  process.exit(0);
}

Seed().catch(e => {
  console.error(e);
  process.exit(1); // Exit with fail
});
