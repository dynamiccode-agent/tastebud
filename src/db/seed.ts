import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const VENUE_ID = '11111111-1111-1111-1111-111111111111'

async function main() {
  console.log('Seeding database...')

  // Insert venue
  await db.insert(schema.venues).values({
    id: VENUE_ID,
    name: 'The Grand Hotel',
    logo: null,
    primaryColor: '#ea580c',
  }).onConflictDoNothing()

  console.log('Inserted venue')

  // Insert tables
  const tableData = [
    { venueId: VENUE_ID, tableNumber: '1', label: 'Table 1 - Window Seat' },
    { venueId: VENUE_ID, tableNumber: '2', label: 'Table 2 - Bar Area' },
    { venueId: VENUE_ID, tableNumber: '3', label: 'Table 3 - Beer Garden' },
    { venueId: VENUE_ID, tableNumber: '4', label: 'Table 4 - Main Floor' },
    { venueId: VENUE_ID, tableNumber: '5', label: 'Table 5 - Booth' },
  ]
  await db.insert(schema.tables).values(tableData).onConflictDoNothing()

  console.log('Inserted tables')

  // Insert categories
  const categoryData = [
    { venueId: VENUE_ID, name: 'Drinks', sortOrder: 1 },
    { venueId: VENUE_ID, name: 'Beer', sortOrder: 2 },
    { venueId: VENUE_ID, name: 'Wine', sortOrder: 3 },
    { venueId: VENUE_ID, name: 'Cocktails', sortOrder: 4 },
    { venueId: VENUE_ID, name: 'Starters', sortOrder: 5 },
    { venueId: VENUE_ID, name: 'Mains', sortOrder: 6 },
    { venueId: VENUE_ID, name: 'Sides', sortOrder: 7 },
    { venueId: VENUE_ID, name: 'Desserts', sortOrder: 8 },
    { venueId: VENUE_ID, name: 'Specials', sortOrder: 9 },
  ]

  const insertedCategories = await db.insert(schema.categories).values(categoryData).returning()
  console.log('Inserted categories')

  const catMap: Record<string, string> = {}
  for (const cat of insertedCategories) {
    catMap[cat.name] = cat.id
  }

  // Insert menu items
  const menuItemData = [
    // --- Drinks ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Drinks'],
      name: 'Soft Drink',
      description: 'Coke, Diet Coke, Sprite, Lemonade, or Ginger Beer. Served over ice.',
      price: '4.50',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['ice'],
        addExtras: [{ name: 'Extra ice', price: 0 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Drinks'],
      name: 'Fresh Orange Juice',
      description: 'Freshly squeezed orange juice. Full of vitamins to balance out your parma.',
      price: '6.00',
      isAlcohol: false,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Drinks'],
      name: 'Sparkling Water',
      description: 'San Pellegrino sparkling mineral water 500ml.',
      price: '5.00',
      isAlcohol: false,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Drinks'],
      name: 'Flat White',
      description: 'Double shot espresso with velvety steamed milk. Made with locally roasted beans.',
      price: '5.50',
      isAlcohol: false,
      customisationOptions: {
        addExtras: [
          { name: 'Extra shot', price: 0.5 },
          { name: 'Oat milk', price: 0.8 },
          { name: 'Almond milk', price: 0.8 },
        ],
      },
    },

    // --- Beer ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Beer'],
      name: 'Carlton Draught – Pot',
      description: 'Classic Victorian lager. Crisp, refreshing and ice cold on tap. 285ml.',
      price: '6.50',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Beer'],
      name: 'Carlton Draught – Schooner',
      description: 'Classic Victorian lager on tap. 425ml. A good honest Aussie beer.',
      price: '9.00',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Beer'],
      name: 'Great Northern Original',
      description: 'Easy drinking mid-strength lager. Light golden colour with a clean, crisp finish. 375ml bottle.',
      price: '8.50',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Beer'],
      name: 'Coopers Pale Ale',
      description: 'South Australian craft ale with a distinct hoppy bitterness and fruity aroma. 375ml bottle.',
      price: '9.00',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Beer'],
      name: 'Stone & Wood Pacific Ale',
      description: 'Byron Bay craft ale brewed with Galaxy hops. Tropical fruit aromas, hazy golden colour. 330ml.',
      price: '10.50',
      isAlcohol: true,
    },

    // --- Wine ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Wine'],
      name: 'House White – Glass',
      description: 'Chardonnay from the Yarra Valley. Crisp and citrusy with a clean finish. 150ml.',
      price: '10.00',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Wine'],
      name: 'House Red – Glass',
      description: 'Shiraz from the Barossa Valley. Rich, full-bodied with hints of dark berry and spice. 150ml.',
      price: '10.00',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Wine'],
      name: 'Sauvignon Blanc – Glass',
      description: 'Marlborough Sauvignon Blanc. Vibrant tropical notes with a zesty, refreshing finish. 150ml.',
      price: '12.00',
      isAlcohol: true,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Wine'],
      name: 'Prosecco – Glass',
      description: 'King Valley Prosecco. Light and effervescent with green apple and pear notes. 150ml.',
      price: '12.00',
      isAlcohol: true,
    },

    // --- Cocktails ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Cocktails'],
      name: 'Classic Espresso Martini',
      description: 'Vodka, Kahlúa and a double shot of fresh espresso. Shaken hard over ice.',
      price: '18.00',
      isAlcohol: true,
      customisationOptions: {
        removeOptions: ['coffee beans garnish'],
        addExtras: [
          { name: 'Extra shot', price: 2.0 },
          { name: 'Vanilla syrup', price: 1.0 },
          { name: 'Baileys float', price: 3.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Cocktails'],
      name: 'Aperol Spritz',
      description: 'Aperol, Prosecco and a splash of soda water. Served over ice with an orange slice.',
      price: '16.00',
      isAlcohol: true,
      customisationOptions: {
        removeOptions: ['orange slice'],
        addExtras: [
          { name: 'Extra Aperol', price: 2.0 },
          { name: 'Lychee liqueur', price: 2.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Cocktails'],
      name: 'Margarita',
      description: 'Tequila, triple sec and fresh lime juice. Served salted rim on the rocks or frozen.',
      price: '17.00',
      isAlcohol: true,
      customisationOptions: {
        removeOptions: ['salt rim'],
        addExtras: [
          { name: 'Frozen blended', price: 0 },
          { name: 'Extra tequila shot', price: 4.0 },
          { name: 'Chilli salt rim', price: 1.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Cocktails'],
      name: 'Gin & Tonic',
      description: 'Four Pillars Rare Dry Gin with Fever-Tree tonic, fresh lime and cucumber. Tall glass.',
      price: '16.00',
      isAlcohol: true,
      customisationOptions: {
        removeOptions: ['cucumber', 'lime'],
        addExtras: [
          { name: 'Double gin', price: 5.0 },
          { name: 'Elderflower tonic', price: 1.0 },
        ],
      },
    },

    // --- Starters ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Starters'],
      name: 'Garlic Bread',
      description: 'Toasted sourdough with house-made garlic butter and fresh parsley.',
      price: '8.00',
      isAlcohol: false,
      customisationOptions: {
        addExtras: [
          { name: 'Cheese topping', price: 2.0 },
          { name: 'Bacon bits', price: 2.5 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Starters'],
      name: 'Loaded Potato Skins',
      description: 'Crispy potato skins loaded with melted cheddar, sour cream, chives and bacon bits.',
      price: '14.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['bacon', 'sour cream', 'chives'],
        addExtras: [{ name: 'Extra cheese', price: 1.5 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Starters'],
      name: 'Calamari Rings',
      description: 'Golden fried calamari rings served with lemon aioli and a side salad.',
      price: '16.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['aioli', 'side salad'],
        addExtras: [{ name: 'Extra aioli', price: 1.0 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Starters'],
      name: 'Arancini (3 pcs)',
      description: 'House-made risotto balls filled with roast pumpkin and feta, crumbed and fried. Served with napolitana sauce.',
      price: '15.00',
      isAlcohol: false,
    },

    // --- Mains ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Mains'],
      name: 'Classic Chicken Parma',
      description: 'Crumbed chicken breast topped with house napolitana sauce and melted mozzarella. Served with chips and salad.',
      price: '26.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['napolitana sauce', 'salad', 'chips'],
        addExtras: [
          { name: 'Ham topping', price: 2.0 },
          { name: 'Mushroom sauce', price: 3.0 },
          { name: 'Bacon topping', price: 3.0 },
          { name: 'Upgrade to sweet potato fries', price: 3.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Mains'],
      name: '300g Scotch Fillet',
      description: 'Grain-fed Scotch fillet cooked to your liking. Served with chips, salad and your choice of sauce.',
      price: '38.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['salad'],
        addExtras: [
          { name: 'Pepper sauce', price: 0 },
          { name: 'Mushroom sauce', price: 0 },
          { name: 'Diane sauce', price: 0 },
          { name: 'Garlic butter', price: 0 },
          { name: 'Extra chips', price: 4.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Mains'],
      name: 'Beer Battered Fish & Chips',
      description: 'Two pieces of golden beer-battered barramundi served with thick-cut chips, tartare sauce and lemon.',
      price: '24.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['tartare sauce', 'lemon'],
        addExtras: [
          { name: 'Extra piece of fish', price: 8.0 },
          { name: 'Extra tartare', price: 1.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Mains'],
      name: 'Angus Beef Burger',
      description: 'Hand-pressed Angus beef patty with lettuce, tomato, pickles, caramelised onion, cheese and house burger sauce on a toasted brioche bun.',
      price: '22.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['tomato', 'pickles', 'caramelised onion', 'lettuce', 'cheese'],
        addExtras: [
          { name: 'Extra patty', price: 5.0 },
          { name: 'Bacon', price: 3.0 },
          { name: 'Fried egg', price: 2.0 },
          { name: 'Chips instead of salad', price: 2.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Mains'],
      name: 'Mushroom Risotto (V)',
      description: 'Creamy arborio rice with mixed wild mushrooms, thyme, white wine and parmesan. Finished with truffle oil.',
      price: '24.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['parmesan', 'truffle oil'],
        addExtras: [
          { name: 'Add chicken', price: 5.0 },
          { name: 'Add prawns', price: 7.0 },
        ],
      },
    },

    // --- Sides ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Sides'],
      name: 'Thick-Cut Chips',
      description: 'Golden thick-cut chips seasoned with sea salt. Served with tomato sauce.',
      price: '8.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['tomato sauce'],
        addExtras: [
          { name: 'Aioli', price: 1.0 },
          { name: 'Gravy', price: 1.5 },
          { name: 'Cheese sauce', price: 1.5 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Sides'],
      name: 'Sweet Potato Fries',
      description: 'Crispy sweet potato fries with a smoky chipotle aioli dipping sauce.',
      price: '10.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['chipotle aioli'],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Sides'],
      name: 'Garden Salad',
      description: 'Mixed leaves, cherry tomatoes, cucumber, red onion and balsamic dressing.',
      price: '8.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['red onion', 'tomato', 'balsamic dressing'],
        addExtras: [
          { name: 'Caesar dressing', price: 0 },
          { name: 'Add feta', price: 2.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Sides'],
      name: 'Coleslaw',
      description: 'Creamy house-made coleslaw with cabbage, carrot and spring onion.',
      price: '6.00',
      isAlcohol: false,
    },

    // --- Desserts ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Desserts'],
      name: 'Warm Chocolate Lava Cake',
      description: 'Rich dark chocolate fondant with a molten centre. Served with vanilla bean ice cream and raspberry coulis.',
      price: '14.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['raspberry coulis', 'ice cream'],
        addExtras: [
          { name: 'Extra scoop of ice cream', price: 3.0 },
          { name: 'Double cream instead', price: 1.0 },
        ],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Desserts'],
      name: 'Sticky Date Pudding',
      description: 'Classic warm sticky date pudding smothered in butterscotch sauce with vanilla ice cream.',
      price: '13.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['ice cream'],
        addExtras: [{ name: 'Extra butterscotch sauce', price: 1.5 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Desserts'],
      name: 'Pavlova',
      description: 'House-made meringue topped with fresh whipped cream, seasonal berries and passionfruit curd.',
      price: '13.00',
      isAlcohol: false,
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Desserts'],
      name: 'Cheese Board',
      description: 'Selection of Australian cheeses with lavosh crackers, quince paste and seasonal fruit.',
      price: '22.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['quince paste', 'fruit'],
      },
    },

    // --- Specials ---
    {
      venueId: VENUE_ID,
      categoryId: catMap['Specials'],
      name: "Chef's Catch of the Day",
      description: "Today's freshest fish fillet pan-fried with lemon and herb butter. Ask staff for today's fish. Served with seasonal veg and chips.",
      price: '29.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['chips', 'seasonal veg'],
        addExtras: [{ name: 'Extra lemon butter sauce', price: 2.0 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Specials'],
      name: 'Lamb Shoulder Roast',
      description: 'Slow-roasted lamb shoulder with rosemary jus, roasted potatoes and seasonal greens. Available Sundays only.',
      price: '32.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['rosemary jus', 'seasonal greens'],
        addExtras: [{ name: 'Extra roast potatoes', price: 4.0 }],
      },
    },
    {
      venueId: VENUE_ID,
      categoryId: catMap['Specials'],
      name: 'Surf & Turf',
      description: '200g eye fillet topped with garlic prawns. Served with chips, salad and your choice of sauce.',
      price: '42.00',
      isAlcohol: false,
      customisationOptions: {
        removeOptions: ['salad'],
        addExtras: [
          { name: 'Pepper sauce', price: 0 },
          { name: 'Mushroom sauce', price: 0 },
          { name: 'Extra prawns', price: 6.0 },
        ],
      },
    },
  ]

  await db.insert(schema.menuItems).values(menuItemData).onConflictDoNothing()

  console.log(`Inserted ${menuItemData.length} menu items`)
  console.log('Seeding complete!')
}

main().then(() => { console.log('Seeded!'); process.exit(0) }).catch(e => { console.error(e); process.exit(1) })
