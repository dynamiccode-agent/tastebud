#!/bin/bash
# TasteBud — Menu image generation via Higgsfield Nano Banana Pro
# Style: Uber Eats commercial food photography

OUTPUT_DIR="/Users/dynamiccode/tastebud/public/menu"
mkdir -p "$OUTPUT_DIR"

# Consistent Uber Eats style anchor appended to every prompt
STYLE="overhead flat lay shot, clean white marble surface, perfect plating, bright studio lighting, commercial restaurant food photography, appetising, high resolution, isolated on clean background, no logos, no text, no branding"

generate() {
  local slug="$1"
  local prompt="$2"
  local outfile="$OUTPUT_DIR/${slug}.jpg"

  if [ -f "$outfile" ]; then
    echo "✓ skip  $slug"
    return 0
  fi

  echo -n "→ $slug ... "
  url=$(higgsfield generate create nano_banana_2 \
    --prompt "$prompt, $STYLE" \
    --aspect_ratio 1:1 \
    --resolution 2k \
    --wait 2>/dev/null | grep -oE 'https://[^ ]+' | head -1)

  if [ -n "$url" ]; then
    curl -sL "$url" -o "$outfile" && echo "✓" || echo "✗ download failed"
  else
    echo "✗ no URL returned"
  fi
}

# ── DRINKS ──────────────────────────────────────────────────────────────────
generate "flat-white" \
  "Flat white coffee in a white ceramic cup on a saucer, perfect latte art rosette, steam rising gently"

generate "fresh-orange-juice" \
  "Fresh squeezed orange juice in a tall glass with ice, floating orange slice, condensation droplets on glass"

generate "soft-drink" \
  "Ice cold cola in a glass with ice cubes and straw, bubbles rising, refreshing"

generate "sparkling-water" \
  "Sparkling mineral water in a tall glass with lemon slice and ice cubes, fine bubbles, minimalist clean"

# ── BEER ────────────────────────────────────────────────────────────────────
generate "carlton-draught-pot" \
  "Carlton Draught Australian lager in a pot glass, perfect golden pour, thick white foam head, condensation on glass"

generate "carlton-draught-schooner" \
  "Carlton Draught Australian lager in a tall schooner glass, golden amber beer, creamy foam head, condensation droplets"

generate "coopers-pale-ale" \
  "Coopers Pale Ale craft beer poured in a glass, hazy amber colour, frothy head, Coopers bottle beside it"

generate "great-northern-original" \
  "Great Northern Original Australian lager in a pint glass, pale golden, crisp white foam, fresh summer vibes"

generate "stone-wood-pacific-ale" \
  "Stone and Wood Pacific Ale hazy golden craft beer in a glass, thick frothy head, tropical hops aroma"

# ── WINE ────────────────────────────────────────────────────────────────────
generate "house-red-glass" \
  "House red wine in a large wine glass, deep ruby red cabernet colour, beautiful light refraction, elegant"

generate "house-white-glass" \
  "House white wine in a wine glass, pale golden chardonnay, condensation on glass, elegant and crisp"

generate "prosecco-glass" \
  "Prosecco in a champagne flute, fine bubbles streaming upward, pale golden straw colour, celebratory"

generate "sauvignon-blanc-glass" \
  "Sauvignon blanc white wine in a wine glass, crisp pale green-gold colour, fresh herbs garnish beside it"

# ── COCKTAILS ───────────────────────────────────────────────────────────────
generate "aperol-spritz" \
  "Aperol Spritz cocktail in a large balloon wine glass, vivid orange colour, ice cubes, prosecco bubbles, orange slice and rosemary sprig garnish"

generate "classic-espresso-martini" \
  "Classic espresso martini in a chilled martini glass, dark coffee colour with smooth velvety foam top, three coffee beans garnish"

generate "gin-and-tonic" \
  "Premium gin and tonic in a large balloon glass with cucumber ribbon, lime wedge, ice, fresh botanicals, crystal clear"

generate "margarita" \
  "Classic margarita cocktail in a salt-rimmed glass, pale lime green, lime wheel garnish, crushed ice"

# ── STARTERS ────────────────────────────────────────────────────────────────
generate "arancini" \
  "Three golden arancini rice balls on a white plate, crispy exterior, small bowl of aioli dipping sauce, fresh basil garnish"

generate "calamari-rings" \
  "Golden fried calamari rings on a white plate, perfectly crispy battered, lemon wedge, tartare sauce, fresh parsley"

generate "garlic-bread" \
  "Toasted garlic bread slices on a wooden board, golden brown with melted herb butter, steam rising, Italian herbs"

generate "loaded-potato-skins" \
  "Loaded crispy potato skins on a plate, melted cheddar cheese, crispy bacon bits, sour cream and chives"

# ── MAINS ───────────────────────────────────────────────────────────────────
# angus-beef-burger already done from test

generate "beer-battered-fish-chips" \
  "Beer battered fish and chips on a plate, golden crispy batter on thick fish fillet, chunky chips, lemon wedge, tartare sauce"

generate "scotch-fillet" \
  "300g scotch fillet steak cooked medium rare on a plate, perfect sear marks, pink juicy centre, compound herb butter melting, thick-cut chips"

generate "chicken-parma" \
  "Classic Australian chicken parma on a plate, golden crumbed schnitzel topped with napoli sauce, melted ham and cheese, chips and garden salad"

generate "mushroom-risotto" \
  "Creamy mushroom risotto in a wide bowl, mixed wild mushrooms, shaved parmesan, fresh thyme sprig, drizzle of truffle oil"

# ── SIDES ───────────────────────────────────────────────────────────────────
generate "coleslaw" \
  "Fresh creamy coleslaw in a small white bowl, shredded cabbage and carrot, creamy dressing, garnished with fresh herbs"

generate "garden-salad" \
  "Garden salad in a white bowl, mixed greens, cherry tomatoes, cucumber slices, red onion, dressing on the side"

generate "sweet-potato-fries" \
  "Crispy sweet potato fries in a small wire basket, golden edges, dusted with sea salt, small pot of aioli dipping sauce"

generate "thick-cut-chips" \
  "Thick-cut golden potato chips in a small metal basket, crispy exterior, sea salt flakes, tomato sauce on the side"

# ── DESSERTS ────────────────────────────────────────────────────────────────
generate "cheese-board" \
  "Australian cheese board with three cheese varieties, crackers, quince paste, red grapes, walnuts, honey, on a dark slate board"

generate "pavlova" \
  "Individual pavlova on a white plate, crisp white meringue, whipped cream, fresh strawberries, kiwi slices, passionfruit drizzle"

generate "sticky-date-pudding" \
  "Warm sticky date pudding on a plate, rich toffee butterscotch sauce poured over, vanilla ice cream melting beside it"

generate "chocolate-lava-cake" \
  "Warm chocolate fondant lava cake on a plate, dark chocolate flowing from centre, dusted with icing sugar, vanilla ice cream, fresh berries"

# ── SPECIALS ────────────────────────────────────────────────────────────────
generate "catch-of-the-day" \
  "Pan-seared fresh fish fillet on a plate, golden crispy skin, seasonal roasted vegetables, lemon beurre blanc sauce, microgreens"

generate "lamb-shoulder-roast" \
  "Slow roasted lamb shoulder on a serving board, fall-apart tender meat, fresh rosemary, roasted root vegetables, red wine jus"

generate "surf-and-turf" \
  "Surf and turf on a plate, juicy sirloin steak beside tiger prawns in garlic butter sauce, thick-cut chips, lemon wedge"

echo ""
echo "✅ Done! Total: $(ls "$OUTPUT_DIR" | wc -l | tr -d ' ') images"
