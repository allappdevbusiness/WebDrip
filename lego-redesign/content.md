# LEGO homepage source content

Source: https://www.lego.com/en-us · captured 2026-10-04 · US / English / USD.
Scope: homepage only. This is a reference snapshot, not a statement of future pricing, availability, or endorsement. Prices must be rechecked before publication if production happens on another date. Do not add ratings, stock claims, savings, sales results, or product specifications that were not captured.

## Collection method

Opened the real homepage in Chromium through Playwright at **1440 × 900**, device scale 1. Selected the ordinary **Continue** shopping entry and **Reject All** cookie preference. No login, captcha, or access block appeared. Scrolled the 5,397px page in 600px increments with 450ms pauses, waited for images, then inspected the full page. Enumerated 74 `img` elements, their `picture/source` and `srcset` candidates, and computed CSS backgrounds including pseudo-elements. The 105 background occurrences resolved to two distinct icon URLs; both were excluded. Repeated carousel images, logo files, utility artwork and small quick-link graphics were excluded.

Kept 14 content images (12 distinct compositions plus 2 responsive hero/campaign alternatives). Downloaded the largest declared source candidate for each selected desktop/mobile composition, including 3× candidates for product cards; no URL enlargement was invented. Small rendered cards were retained only where the declared source actually delivered ≥300px width. Encoded WebP at quality 82, capped width at 2400px, preserving alpha. Total asset bytes: **2,257,404**. `assets.json` records delivered and source dimensions, exact original URLs and descriptions. All assets came from this homepage, including its already-present carousel/tab content; no product pages or social posts supplied assets.

## Fair homepage assessment

**What works well:** immediate recognition through the yellow navigation, excellent product/lifestyle photography, a prominent new-arrivals campaign, clear product prices and age/piece information, and multiple paths into a very large assortment. The lifestyle grid shows how sets look in real spaces. The existing navigation already includes interests; this concept does not claim to invent interest-based shopping for LEGO.

**Three opportunities for this particular concept:**

1. The opening hero promotes one new release, followed by eight quick links. Bring a small interest selector directly into the opening experience so a visitor can explore a narrower selection in place. Preserve an obvious “All” reset and never hide the broad assortment behind a compulsory quiz.
2. “Find the perfect set” contains a long horizontal assortment. Give the selected interest a short, fully visible set grid with stable product-name/price/quick-view placement. This makes the interaction easier to demonstrate and may reduce browsing effort; no conversion improvement is claimed.
3. Campaign, product and inspiration areas currently use several different compositions. Connect the redesign with a consistent card rhythm, restrained snap-in motion and the same selection state on mobile. Preserve readable static states and reduced-motion behavior.

## Main hero

- Eyebrow badges: **New**, **Exclusives**.
- Headline: **Press play to discover new arrivals**.
- Subheadline: **Check out our latest releases, including the new LEGO® PlayStation™ set.**
- CTAs: **Buy now**, **Shop all new**.
- Image: PlayStation set and controller on an orange table; desktop and square mobile variants saved.

## Navigation observed

- Main: **SHOP**, **DISCOVER**, **HELP**, **NEW**.
- Utility: **PLAY ZONE**, **Sign In**, **Join LEGO® Insiders**, **Search**, **My Wishlist**, **My Bag**.
- Homepage quick-link tabs: **What’s new**, **Gifting**, **Themes**.
- Visible quick links: **All new sets**, **Exclusives**, **Offers**, **Star Wars™**, **Seasonal**, **Icons**, **Bestsellers**, **SMART Play™ sets**.
- Product tabs: **Featured**, **Popular**.
- Spotlight tabs: **Shop all sets**, **SMART Play™ Sets**, **Adults Welcome**.
- Footer utility: **United States**, **Gift cards**, **Sitemap**, **Find inspiration**, **LEGO catalogs**, **Find a LEGO store**.
- Footer groups: **ABOUT US**, **SUPPORT**, **ATTRACTIONS**, **MORE FROM US**, **FOLLOW US**; legal links include Privacy policy, Cookies, Legal notice, Terms of use, Digital wellbeing, Accessibility, Cookie Settings and Do not sell/share my personal information.

Do not build other pages or replicate account/cart systems. The brief specifies the smaller in-page navigation for the concept.

## Section copy

| Section | Supporting text / actions |
|---|---|
| Find the perfect set | Featured / Popular; product cards use “Add to Bag”. |
| See what everyone's building | “Take on a new building adventure with these inspirational LEGO® sets.” |
| This week's spotlight | “A closer look at LEGO® moments worth discovering – from seasonal fun to special moments.” |
| Small bricks. Huge selection | “Explore the widest assortment of bricks, including seasonal items and sets you can't find anywhere else.” / Shop now |
| You're the Trainer now | “Unlock interactive fun with new LEGO® Pokémon™ SMART Play™ All-in-One sets that react to how kids move and play.” / Shop now / Learn more |
| GIFTS THAT AWAKEN THEIR JOY | “Show how well you know them with LEGO® sets that turn their passions into display-worthy creations.” / Shop now / Learn more |
| Discover more — Get gifting | “Shop ideas by occasion, age and price. Plus Gift Cards too!” / Shop now |
| Discover more — Read all about it! | “See our library of articles for ideas and inspiration.” / Discover |
| Discover more — Membership perks at your fingertips | “Shop new sets, stack up points and unlock rewards with our app.” / Learn more |
| Membership | “Join our loyalty program and unlock member benefits right away!” / Become a member / Log in |
| Loyalty Points | “Earn redeemable points when you buy or register set you own.” [Source wording preserved.] |
| Member-only rewards | “LEGO gear, special discounts, LEGOLAND tickets and more.” |
| Limited-time gifts | “Get more of what you love - gifts available with selected sets.” |

Some spotlight panels are alternate tab content, not simultaneously visible. Do not treat the three panels as three different homepage visits.

## Featured names and prices observed

USD as captured; not invented demo pricing.

| Product | Price |
|---|---:|
| Downton Abbey | $349.99 |
| Bookstore: Book Nook | $149.99 |
| Iconic Trainer Moments Poké Ball | $299.99 |
| Executor Super Star Destroyer™ | $799.99 |
| Holiday House | $119.99 |
| Santa's Holiday Countdown | $59.99 |
| Up-Scaled Mrs. Claus Minifigure | $59.99 |
| Buddy the Elf | $39.99 |
| Santa's Holiday Sleigh Adventure | $29.99 |
| Christmas Stocking | $34.99 |
| Up-Scaled Red Minifigure | $79.99 |
| Batman Returns™ Batmobile™ | $229.99 |
| Nevermore Academy | $69.99 |
| The X-Files | $199.99 |
| Mayor Manor | $119.99 |
| La Catrina | $139.99 |
| Halloween Skull Candle | $19.99 |
| Mario Kart™ – Mario & Standard Kart | $169.99 |
| Game Boy™ | $59.99 |
| Gremlins Gizmo™ and Stripe Figures | $24.99 |
| Hanging Golden Pothos | $59.99 |
| LEGO® Ideas Home Alone | $299.99 |
| SpongeBob SquarePants: Bikini Bottom | $219.99 |
| Wednesday Backpack | $44.99 |

The hero's PlayStation product price was not captured; do not invent one. Only the eight products with assigned assets in the brief belong in the concept's product grid.

## Observed color tokens

Sampled computed CSS on the homepage, rather than assumed brand-guide values:

| Role for concept | Hex | Observed RGB |
|---|---|---|
| Primary / navigation yellow | #FFD502 | 255, 213, 2 |
| Secondary / link blue | #006DB7 | 0, 109, 183 |
| Accent / purchase orange | #F47D20 | 244, 125, 32 |
| Background | #FFFFFF | 255, 255, 255 |
| Text | #141414 | 20, 20, 20 |
| Neutral panel | #F2F2F2 | 242, 242, 242 |
| Secondary text | #2C2C2C | 44, 44, 44 |

Use dark text on yellow and orange. The concept's plain text “LEGO” is not a recreation of the logo.

## Attribution and editorial additions

Every concept/video/caption must say: **Unofficial concept redesign. Not affiliated with LEGO.** Images and original product/campaign content remain attributable to their respective owners. This snapshot does not imply LEGO commissioned WebDrip. The concept interest labels, quick-view behavior and new hero headline in the brief are WebDrip editorial choices, not original homepage copy.
