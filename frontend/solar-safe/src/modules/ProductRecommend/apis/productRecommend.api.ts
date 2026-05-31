import type { Product, ProductCategory } from "../types/productRecommend.type";

const BASE_URL = '/api'

export async function getProducts(category?: ProductCategory): Promise<Product[]> {
  const params = new URLSearchParams()
  if (category) params.set('category', category)

  const res = await fetch(`${BASE_URL}/product-recommendations?${params}`)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()

  // Map backend shape to frontend type
  const raw: any[] = data.data ?? []
  return raw
    .filter((p: any) => p.active !== 0) // only active products
    .map((p: any) => {
      const cat = p.category as ProductCategory
      const standard =
        cat === 'sunscreen' ? 'SPF' :
        (cat === 'hats' || cat === 'uv-jacket') ? 'UPF' : 'UV'
      return {
        id: String(p.id),
        name: p.name,
        category: cat,
        price: p.price,
        imageUrl: p.imageUrl ?? '',
        description: p.description ?? undefined,
        rating: { standard, value: p.protectionScore },
        protectionScore: p.protectionScore,
      } as Product
    })
}

export async function getProductById(id: string): Promise<Product> {
  const all = await getProducts()
  const product = all.find(p => p.id === id)
  if (!product) throw new Error('Product not found: ' + id)
  return product
}
