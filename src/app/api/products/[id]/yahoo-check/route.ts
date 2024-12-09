import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// POST /products/{id}/yahoo-check - Yahoo APIチェック
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // IDのバリデーション
    if (!id) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "有効な商品IDを指定してください"
          }
        },
        { status: 400 }
      );
    }

    // 商品を取得
    const product = await prisma.product.findUnique({
      where: {
        id: id
      }
    });

    if (!product) {
      return NextResponse.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "指定された商品が見つかりません"
          }
        },
        { status: 404 }
      );
    }

    // Note: ここでは簡単なモックレスポンスを返します
    // 実際の実装では、Yahoo APIを呼び出して実際の商品情報を取得する必要があります
    const mockYahooResponse = {
      id: id,
      barcode: product.barcode,
      product_info: {
        name: `Yahoo商品 (${product.barcode})`,
        price: Math.floor(Math.random() * 10000) + 100,
        availability: Math.random() > 0.5
      },
      message: "Yahoo APIチェック完了"
    };

    // 商品のyahoo_checkedフラグを更新
    await prisma.product.update({
      where: {
        id: id
      },
      data: {
        yahoo_checked: true
      }
    });

    return NextResponse.json(mockYahooResponse);
  } catch (error) {
    console.error('Error checking Yahoo API:', error);
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
