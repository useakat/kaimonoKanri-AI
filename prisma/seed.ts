import { PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

const stores = ['生協', '店舗', 'ネット']

const products = [
  {
    name: '食パン',
    description: '毎日の朝食用の食パン',
    purchase_location: stores[0], // 生協
    stock_quantity: 2,
    minimum_stock: 3
  },
  {
    name: 'トイレットペーパー',
    description: '12ロール入り パック',
    purchase_location: stores[1], // 店舗
    stock_quantity: 3,
    minimum_stock: 2
  },
  {
    name: '牛乳',
    description: '1000ml 成分無調整',
    purchase_location: stores[0], // 生協
    stock_quantity: 1,
    minimum_stock: 2
  },
  {
    name: 'コーヒー豆',
    description: 'ブラジル産 中煎り',
    purchase_location: stores[2], // ネット
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: '米',
    description: '新潟県産コシヒカリ 5kg',
    purchase_location: stores[1], // 店舗
    stock_quantity: 1,
    minimum_stock: 2
  },
  {
    name: 'ティッシュペーパー',
    description: '5箱パック',
    purchase_location: stores[1], // 店舗
    stock_quantity: 2,
    minimum_stock: 3
  },
  {
    name: 'シャンプー',
    description: '詰め替え用 400ml',
    purchase_location: stores[2], // ネット
    stock_quantity: 1,
    minimum_stock: 1
  },
  {
    name: 'ハンドソープ',
    description: '泡タイプ 詰め替え用',
    purchase_location: stores[2], // ネット
    stock_quantity: 1,
    minimum_stock: 2
  },
  {
    name: 'キッチンペーパー',
    description: '3ロール入り',
    purchase_location: stores[1], // 店舗
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: '歯磨き粉',
    description: 'ミント味 大容量',
    purchase_location: stores[0], // 生協
    stock_quantity: 1,
    minimum_stock: 2
  }
]

async function main() {
  console.log('Start seeding...')
  
  // 既存のデータを削除
  await prisma.product.deleteMany()
  
  for (const product of products) {
    const status = product.stock_quantity < product.minimum_stock 
      ? Status.NEED_TO_BUY 
      : Status.IN_STOCK

    const result = await prisma.product.create({
      data: {
        ...product,
        status
      }
    })
    console.log(`Created product with id: ${result.id} - Status: ${result.status}`)
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
