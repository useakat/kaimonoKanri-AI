import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// PUT /products/{id}/stock - 在庫数更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // バリデーション: stock_quantityの存在確認
    if (body.stock_quantity === undefined) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "stock_quantity は必須フィールドです"
          }
        },
        { status: 400 }
      );
    }

    // バリデーション: stock_quantityの値チェック
    if (body.stock_quantity < 0 || !Number.isInteger(body.stock_quantity)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "stock_quantity は0以上の整数である必要があります"
          }
        },
        { status: 400 }
      );
    }

    // 商品の存在確認
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.id
      }
    });

    if (!existingProduct) {
      return NextResponse.json(
        {
          error: {
            code: "RESOURCE_NOT_FOUND",
            message: "指定された商品が見つかりません"
          }
        },
        { status: 404 }
      );
    }

    // 在庫数の更新
    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        stock_quantity: body.stock_quantity
      }
    });

    return NextResponse.json({
      id: updatedProduct.id,
      current_stock: updatedProduct.stock_quantity,
      message: "在庫数が正常に更新されました"
    });
  } catch (error) {
    console.error('Error updating stock:', error);
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
