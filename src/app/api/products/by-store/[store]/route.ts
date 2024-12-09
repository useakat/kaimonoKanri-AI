import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// GET /products/by-store/{store} - 購入先別商品一覧取得
export async function GET(
  request: Request,
  { params }: { params: { store: string } }
) {
  try {
    const store = decodeURIComponent(params.store);

    // 指定された購入先の商品を取得
    const products = await prisma.product.findMany({
      where: {
        purchase_location: store
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // 商品が見つからない場合
    if (products.length === 0) {
      return NextResponse.json(
        {
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "指定された購入先の商品が見つかりません"
          }
        },
        { status: 404 }
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by store:', error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "サーバー内部でエラーが発生しました"
        }
      },
      { status: 500 }
    );
  }
}
