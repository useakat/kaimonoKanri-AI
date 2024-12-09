import { NextResponse } from 'next/server';
import { PrismaClient, Status } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// ステータスの日本語表示からPrismaの列挙型への変換マップ
const statusMap: { [key: string]: Status } = {
  '在庫あり': Status.IN_STOCK,
  '要購入': Status.NEED_TO_BUY
};

// GET /products/by-status - ステータス別商品一覧取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // バリデーション: statusパラメータの存在確認
    if (!statusParam) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "status クエリパラメータは必須です"
          }
        },
        { status: 400 }
      );
    }

    // バリデーション: statusの値チェック
    if (!['要購入', '在庫あり'].includes(statusParam)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "status は '要購入' または '在庫あり' である必要があります"
          }
        },
        { status: 400 }
      );
    }

    const prismaStatus = statusMap[statusParam];

    // ステータスに基づいて商品を取得
    const products = await prisma.product.findMany({
      where: {
        status: prismaStatus
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products by status:', error);
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
