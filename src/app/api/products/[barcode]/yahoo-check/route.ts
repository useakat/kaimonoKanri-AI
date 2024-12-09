import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// POST /products/{barcode}/yahoo-check - Yahoo APIチェック
export async function POST(
  request: Request,
  { params }: { params: { barcode: string } }
) {
  try {
    const barcode = params.barcode;

    // バーコードのバリデーション
    if (!barcode || barcode.length < 8) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "有効なバーコードを指定してください"
          }
        },
        { status: 400 }
      );
    }

    // Note: ここでは簡単なモックレスポンスを返します
    // 実際の実装では、Yahoo APIを呼び出して実際の商品情報を取得する必要があります
    const mockYahooResponse = {
      barcode: barcode,
      product_info: {
        name: `Yahoo商品 (${barcode})`,
        price: Math.floor(Math.random() * 10000) + 100,
        availability: Math.random() > 0.5
      },
      message: "Yahoo APIチェック完了"
    };

    // 商品のyahoo_checkedフラグを更新
    const product = await prisma.product.findFirst({
      where: {
        barcode: barcode
      }
    });

    if (product) {
      await prisma.product.update({
        where: {
          id: product.id
        },
        data: {
          yahoo_checked: true
        }
      });
    }

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
