import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// グローバルスコープでPrismaClientのインスタンスを作成
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // バリデーション: 必須フィールドのチェック
    if (!body.name || !body.purchase_location) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_REQUEST",
            message: "name と purchase_location は必須フィールドです"
          }
        },
        { status: 400 }
      );
    }

    // バリデーション: 文字数制限
    if (body.name.length > 100) {
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

    if (body.purchase_location.length > 50) {
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

    // 数値フィールドのバリデーション
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

    // 新規商品の作成
    const product = await prisma.product.create({
      data: {
        name: body.name,
        image_path: body.image_path,
        order_url: body.order_url,
        barcode: body.barcode,
        description: body.description,
        purchase_location: body.purchase_location,
        stock_quantity: body.stock_quantity ?? 1,
        minimum_stock: body.minimum_stock ?? 1
      }
    });

    return NextResponse.json(
      {
        id: product.id,
        message: "商品が正常に登録されました"
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating product:', error);
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
