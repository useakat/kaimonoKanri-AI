import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// PATCH /products/{id}/stock - 在庫数変更
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { change } = await request.json();

    // 入力バリデーション
    if (change === undefined || !Number.isInteger(change)) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "変更量は整数である必要があります"
          }
        },
        { status: 400 }
      );
    }

    // 商品の存在確認
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
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

    // 新しい在庫数の計算
    const newStockQuantity = existingProduct.stock_quantity + change;

    // 在庫数が0未満にならないようチェック
    if (newStockQuantity < 0) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "在庫数が0未満になることはできません"
          }
        },
        { status: 400 }
      );
    }

    // 商品の在庫数更新
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { stock_quantity: newStockQuantity }
    });

    return NextResponse.json({
      id: updatedProduct.id,
      stock_quantity: updatedProduct.stock_quantity,
      message: "在庫数が正常に更新されました"
    });

  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "在庫数の更新中にエラーが発生しました"
        }
      },
      { status: 500 }
    );
  }
}
