import { PrismaClient, Status } from '@prisma/client'

const prisma = new PrismaClient()

const stores = [
  '西友',
  'イオン',
  'コストコ',
  'カルディ',
  '業務スーパー',
  'セブンイレブン',
  'ファミリーマート',
  'ローソン',
  'ドン・キホーテ',
  'マツモトキヨシ'
]

const products = [
  {
    name: '食パン',
    description: '毎日の朝食用の食パン',
    purchase_location: stores[0],
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: 'トイレットペーパー',
    description: '12ロール入り パック',
    purchase_location: stores[1],
    stock_quantity: 3,
    minimum_stock: 2
  },
  {
    name: '牛乳',
    description: '1000ml 成分無調整',
    purchase_location: stores[2],
    stock_quantity: 1,
    minimum_stock: 1
  },
  {
    name: 'コーヒー豆',
    description: 'ブラジル産 中煎り',
    purchase_location: stores[3],
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: '米',
    description: '新潟県産コシヒカリ 5kg',
    purchase_location: stores[4],
    stock_quantity: 1,
    minimum_stock: 1
  },
  {
    name: 'ティッシュペーパー',
    description: '5箱パック',
    purchase_location: stores[5],
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: 'シャンプー',
    description: '詰め替え用 400ml',
    purchase_location: stores[9],
    stock_quantity: 1,
    minimum_stock: 1
  },
  {
    name: 'ハンドソープ',
    description: '泡タイプ 詰め替え用',
    purchase_location: stores[9],
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: 'キッチンペーパー',
    description: '3ロール入り',
    purchase_location: stores[1],
    stock_quantity: 2,
    minimum_stock: 1
  },
  {
    name: '歯磨き粉',
    description: 'ミント味 大容量',
    purchase_location: stores[9],
    stock_quantity: 1,
    minimum_stock: 1
  }
]

async function main() {
  console.log('Start seeding...')
  
  for (const product of products) {
    const result = await prisma.product.create({
      data: {
        ...product,
        status: Math.random() > 0.7 ? Status.NEED_TO_BUY : Status.IN_STOCK
      }
    })
    console.log(`Created product with id: ${result.id}`)
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
