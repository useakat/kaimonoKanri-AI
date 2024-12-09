import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

// GET /products/{id} - 商品詳細取得
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id
      }
    });

    if (!product) {
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
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

// PUT /products/{id} - 商品情報更新
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

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

    // バリデーション
    if (body.name && body.name.length > 100) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "name は100文字以内で入力してください"
          }
        },
        { status: 400 }
      );
    }

    if (body.purchase_location && body.purchase_location.length > 50) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "purchase_location は50文字以内で入力してください"
          }
        },
        { status: 400 }
      );
    }

    if (body.description && body.description.length > 1000) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "description は1000文字以内で入力してください"
          }
        },
        { status: 400 }
      );
    }

    if (body.stock_quantity !== undefined && (body.stock_quantity < 0 || !Number.isInteger(body.stock_quantity))) {
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

    if (body.minimum_stock !== undefined && (body.minimum_stock < 0 || !Number.isInteger(body.minimum_stock))) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "minimum_stock は0以上の整数である必要があります"
          }
        },
        { status: 400 }
      );
    }

    // 商品の更新
    const updatedProduct = await prisma.product.update({
      where: {
        id: params.id
      },
      data: {
        name: body.name,
        image_path: body.image_path,
        order_url: body.order_url,
        barcode: body.barcode,
        description: body.description,
        purchase_location: body.purchase_location,
        stock_quantity: body.stock_quantity,
        minimum_stock: body.minimum_stock
      }
    });

    return NextResponse.json({
      id: updatedProduct.id,
      message: "商品情報が正常に更新されました"
    });
  } catch (error) {
    console.error('Error updating product:', error);
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

// DELETE /products/{id} - 商品削除
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
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

    // 商品の削除
    await prisma.product.delete({
      where: {
        id: params.id
      }
    });

    return NextResponse.json({
      message: "商品が正常に削除されました"
    });
  } catch (error) {
    console.error('Error deleting product:', error);
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
