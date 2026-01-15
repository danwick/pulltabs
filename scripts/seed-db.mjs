import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the seed data
const seedPath = path.join(__dirname, '../../data/seed/sites_seed.json');
const seedData = JSON.parse(fs.readFileSync(seedPath, 'utf-8'));

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function insertSite(site) {
  const siteName = site.site_name;
  const orgName = site.organization_name;
  const manager = site.gambling_manager;
  const street = site.address.street;
  const city = site.address.city;
  const state = site.address.state;
  const zip = String(site.address.zip);
  const lat = site.location?.lat ?? null;
  const lng = site.location?.lng ?? null;
  const license = String(site.license_number);
  const gamblingTypes = site.gambling_types.join(', ');
  const gross = site.financial?.gross_receipts ?? null;
  const net = site.financial?.net_receipts ?? null;
  const fiscal = site.financial?.fiscal_year ?? null;

  await sql`
    INSERT INTO sites (
      site_name, organization_name, gambling_manager, street_address,
      city, state, zip_code, latitude, longitude, license_number,
      gambling_types_inferred, gross_receipts, net_receipts, fiscal_year
    ) VALUES (
      ${siteName}, ${orgName}, ${manager}, ${street},
      ${city}, ${state}, ${zip}, ${lat}, ${lng}, ${license},
      ${gamblingTypes}, ${gross}, ${net}, ${fiscal}
    )
  `;
}

async function seed() {
  console.log(`Seeding ${seedData.stats.total_sites} sites...`);

  const sites = seedData.sites;
  let inserted = 0;
  const startTime = Date.now();

  // Process in parallel batches for speed
  const batchSize = 50;

  for (let i = 0; i < sites.length; i += batchSize) {
    const batch = sites.slice(i, i + batchSize);
    await Promise.all(batch.map(site => insertSite(site)));
    inserted += batch.length;

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    const rate = (inserted / parseFloat(elapsed)).toFixed(0);
    console.log(`Inserted ${inserted}/${sites.length} sites (${rate}/sec)`);
  }

  console.log('Seeding complete!');

  // Verify count
  const result = await sql`SELECT COUNT(*) as total FROM sites`;
  console.log(`Total sites in database: ${result[0].total}`);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
