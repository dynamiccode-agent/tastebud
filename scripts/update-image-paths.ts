import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { menuItems } from '../src/db/schema'
import { eq } from 'drizzle-orm'
import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

const imageMap: Record<string, string> = {
  '56f92836-4cde-4d62-8a1b-0eff2cc2f089': '/menu/flat-white.jpg',
  '02b5cf8a-4d08-4408-8d34-58b58526b3d4': '/menu/fresh-orange-juice.jpg',
  '221433b7-86c6-4c8c-a2aa-f7a0f62e46c6': '/menu/soft-drink.jpg',
  '64b1f4e2-5812-4db0-b0a8-abd4dfe51096': '/menu/sparkling-water.jpg',
  '7878f2ad-203f-4fe2-8fad-3eedca765ead': '/menu/carlton-draught-pot.jpg',
  'dcd94359-1e33-458d-b307-4ef42a32c113': '/menu/carlton-draught-schooner.jpg',
  '581ae7f3-559f-4473-92f1-604603ab3696': '/menu/coopers-pale-ale.jpg',
  'f30b6be3-e368-48f9-b25a-e7ccecc1ec30': '/menu/great-northern-original.jpg',
  '218f5a49-37d7-4b22-803d-739686c4a96a': '/menu/stone-wood-pacific-ale.jpg',
  'de1473ed-d2a5-4d7a-82ac-16ecb0cfca43': '/menu/house-red-glass.jpg',
  'ae30214f-738b-4260-aa12-a5a251f631ec': '/menu/house-white-glass.jpg',
  'ccdf8f7d-a36b-48f3-b783-c2eff86ac43b': '/menu/prosecco-glass.jpg',
  'a626aeb2-b0a7-4fab-9c53-a4cddbf69980': '/menu/sauvignon-blanc-glass.jpg',
  'c8d0351f-ef57-44f7-bf78-1197aa36baa8': '/menu/aperol-spritz.jpg',
  '7189eb0c-71f7-4762-86a3-550fb27856dd': '/menu/classic-espresso-martini.jpg',
  '156e37be-2a3e-4e82-a7aa-2aa0e4ddc449': '/menu/gin-and-tonic.jpg',
  '000607d3-ec36-44b1-87ee-c408e55781c6': '/menu/margarita.jpg',
  '40efe891-57bb-440e-920d-ad663f1a616c': '/menu/arancini.jpg',
  'acc34f91-3a1c-4d89-88af-9a259d06b178': '/menu/calamari-rings.jpg',
  'e01bc969-c918-4d3c-a0e4-542c2bd1510e': '/menu/garlic-bread.jpg',
  '37dfcca7-0195-4ac8-b320-f0fc03c6ee51': '/menu/loaded-potato-skins.jpg',
  'ce94c8cc-98f8-420f-8980-e692d19914fb': '/menu/scotch-fillet.jpg',
  'e49a1bf9-fcb4-43c0-97d0-c1b7aa8b3eac': '/menu/angus-beef-burger.jpg',
  '9f31af8d-5a3b-42f0-9697-495336049dec': '/menu/beer-battered-fish-chips.jpg',
  '0685cdbf-ff0a-4f96-9ed2-8ae0fe0ce0ca': '/menu/chicken-parma.jpg',
  'c49872c4-178f-4657-b763-84610f95a9ed': '/menu/mushroom-risotto.jpg',
  '3575bf94-fa54-4193-abe5-2d14396140c6': '/menu/coleslaw.jpg',
  '98c42747-bb0a-4b81-86cd-7918460e40c0': '/menu/garden-salad.jpg',
  'ea222000-8312-4a5f-b81b-cb8b96dbce14': '/menu/sweet-potato-fries.jpg',
  '654edccd-7715-4943-93be-3bef55579bfd': '/menu/thick-cut-chips.jpg',
  '251e9139-b98f-4106-9623-2bae766cd583': '/menu/cheese-board.jpg',
  '623bfd06-7a0e-40de-a05f-89212e5bb333': '/menu/pavlova.jpg',
  '926e8e36-77a2-43ae-9212-e8938ce7d279': '/menu/sticky-date-pudding.jpg',
  '3901f1a5-0375-4d46-abab-b02b7e452a53': '/menu/chocolate-lava-cake.jpg',
  'f8b82ac6-0694-4979-9e6d-0c37d4e2edaf': '/menu/catch-of-the-day.jpg',
  '2cc16f8e-512b-4e4f-8930-966b658b0b5e': '/menu/lamb-shoulder-roast.jpg',
  'fcea365b-9c8a-4cb6-a70d-939e8c885c94': '/menu/surf-and-turf.jpg',
}

async function main() {
  console.log(`Updating ${Object.keys(imageMap).length} menu item images...`)
  for (const [id, imagePath] of Object.entries(imageMap)) {
    await db.update(menuItems).set({ image: imagePath }).where(eq(menuItems.id, id))
    process.stdout.write('.')
  }
  console.log('\nDone!')
}

main().catch(e => { console.error(e); process.exit(1) })
