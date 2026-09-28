import "reflect-metadata"
import { appDataSource } from "../database/connect.db"
import { Product } from "../database/Entity/product.entity"
import { ITEM_CATEGORY } from "../enum/enums"

/**
 * Dev-phase bulk product seeder.
 *
 * Pulls real product data (names, prices, descriptions and real image URLs) from the
 * public DummyJSON dataset and maps it onto our schema, so the catalogue is populated
 * without adding products by hand. Image URLs are stored verbatim — resolveImageUrl on
 * the frontend passes https:// URLs straight through, so no uploads are needed.
 *
 * Default run is additive + idempotent by product_name (safe to re-run, never duplicates,
 * never touches existing orders/cart items). Pass `--fresh` to wipe products first.
 *
 *   npm run seed            # add up to 70 products, skipping ones that already exist
 *   npm run seed -- --fresh # wipe the products table first, then seed
 *
 * NOTE (--fresh): Order.product and ShopCartItem.product_item use onDelete:"CASCADE",
 * so wiping products also removes any orders / cart items that reference them.
 */

const TARGET_COUNT = 70
const USD_TO_NPR = 130 // DummyJSON prices are USD; scale to realistic Rs. integers
const DUMMYJSON_URL =
    "https://dummyjson.com/products?limit=0&select=title,price,description,category,thumbnail,stock"

// DummyJSON category slug -> our ITEM_CATEGORY (anything unmapped falls back to OTHER)
const CATEGORY_MAP: Record<string, ITEM_CATEGORY> = {
    beauty: ITEM_CATEGORY.BEAUTY,
    fragrances: ITEM_CATEGORY.BEAUTY,
    "skin-care": ITEM_CATEGORY.BEAUTY,
    furniture: ITEM_CATEGORY.HOME,
    "home-decoration": ITEM_CATEGORY.HOME,
    "kitchen-accessories": ITEM_CATEGORY.HOME,
    groceries: ITEM_CATEGORY.GROCERIES,
    laptops: ITEM_CATEGORY.ELECTRONICS,
    smartphones: ITEM_CATEGORY.ELECTRONICS,
    tablets: ITEM_CATEGORY.ELECTRONICS,
    "mobile-accessories": ITEM_CATEGORY.ACCESSORIES,
    "mens-shirts": ITEM_CATEGORY.CLOTHING,
    "womens-dresses": ITEM_CATEGORY.CLOTHING,
    tops: ITEM_CATEGORY.CLOTHING,
    "mens-shoes": ITEM_CATEGORY.FOOTWEAR,
    "womens-shoes": ITEM_CATEGORY.FOOTWEAR,
    "mens-watches": ITEM_CATEGORY.ACCESSORIES,
    "womens-watches": ITEM_CATEGORY.ACCESSORIES,
    "womens-bags": ITEM_CATEGORY.ACCESSORIES,
    "womens-jewellery": ITEM_CATEGORY.ACCESSORIES,
    sunglasses: ITEM_CATEGORY.ACCESSORIES,
    "sports-accessories": ITEM_CATEGORY.SPORTS,
    motorcycle: ITEM_CATEGORY.OTHER,
    vehicle: ITEM_CATEGORY.OTHER,
}

interface DummyProduct {
    title: string
    price: number
    description?: string
    category: string
    thumbnail?: string
    stock?: number
}

function mapCategory(slug: string): ITEM_CATEGORY {
    return CATEGORY_MAP[slug] ?? ITEM_CATEGORY.OTHER
}

async function fetchDummyProducts(): Promise<DummyProduct[]> {
    const res = await fetch(DUMMYJSON_URL)
    if (!res.ok) {
        throw new Error(`DummyJSON request failed (${res.status} ${res.statusText})`)
    }
    const data = (await res.json()) as { products?: DummyProduct[] }
    return data.products ?? []
}

// round-robin across mapped categories so the selection stays diverse instead of
// being dominated by whichever category happens to come first in the dataset.
function pickBalanced(items: DummyProduct[], count: number): DummyProduct[] {
    const buckets = new Map<ITEM_CATEGORY, DummyProduct[]>()
    for (const item of items) {
        const category = mapCategory(item.category)
        if (!buckets.has(category)) buckets.set(category, [])
        buckets.get(category)!.push(item)
    }
    const groups = [...buckets.values()]
    const picked: DummyProduct[] = []
    for (let round = 0; picked.length < count; round++) {
        let addedThisRound = false
        for (const group of groups) {
            const candidate = group[round]
            if (candidate) {
                picked.push(candidate)
                addedThisRound = true
                if (picked.length >= count) break
            }
        }
        if (!addedThisRound) break // exhausted every category
    }
    return picked
}

async function main() {
    const fresh = process.argv.includes("--fresh")

    await appDataSource.initialize()
    console.log("Database connected ✅")
    const productRepo = appDataSource.getRepository(Product)

    if (fresh) {
        const existing = await productRepo.find()
        await productRepo.remove(existing)
        console.log(`--fresh: removed ${existing.length} existing product(s) (cascaded to their orders/cart items).`)
    }

    console.log("Fetching real product data from DummyJSON…")
    const dummy = await fetchDummyProducts()
    const selected = pickBalanced(dummy, TARGET_COUNT)
    console.log(`Selected ${selected.length} products across categories.`)

    const known = await productRepo.find({ select: { product_name: true } })
    const existingNames = new Set(known.map((p) => p.product_name))

    const toInsert: Product[] = []
    let skipped = 0
    for (const item of selected) {
        if (existingNames.has(item.title)) {
            skipped++
            continue
        }
        const product = productRepo.create({
            product_name: item.title,
            product_type: mapCategory(item.category),
            description: item.description,
            product_image: item.thumbnail,
            price: Math.max(1, Math.round((item.price ?? 1) * USD_TO_NPR)),
            stock: typeof item.stock === "number" ? item.stock : Math.floor(Math.random() * 90) + 10,
        })
        toInsert.push(product)
        existingNames.add(item.title)
    }

    if (toInsert.length) {
        await productRepo.save(toInsert)
    }

    console.log(`\nSeed complete → inserted ${toInsert.length}, skipped ${skipped} (already existed).`)
    const breakdown = new Map<string, number>()
    for (const p of toInsert) breakdown.set(p.product_type, (breakdown.get(p.product_type) ?? 0) + 1)
    for (const [category, n] of [...breakdown.entries()].sort()) {
        console.log(`  ${category}: ${n}`)
    }

    await appDataSource.destroy()
    console.log("Done.")
}

main().catch(async (err) => {
    console.error("Seed failed:", err)
    try {
        await appDataSource.destroy()
    } catch {
        // ignore teardown errors
    }
    process.exit(1)
})
