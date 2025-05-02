import { PrismaClient, Goods } from '@generated/prisma';

// DTO は後で作成
// import { CreateGoodsDto, UpdateGoodsDto } from '../dtos/goods.dto';

export class GoodsService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  async createGoods(data: { magazineId: string; name: string; description?: string | null; price: number; stock?: number | null }, authorId: string): Promise<Goods | null> {
    // 認可チェック: マガジンの authorId と作成者の ID が一致するか確認
    const magazine = await this.prisma.magazine.findUnique({ where: { id: data.magazineId } });
    if (!magazine || magazine.authorId !== authorId) {
      return null; // または権限エラー
    }

    return this.prisma.goods.create({
      data: {
        magazineId: data.magazineId,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  async getGoodsById(id: string): Promise<Goods | null> {
    return this.prisma.goods.findUnique({ where: { id } });
  }

  async getGoodsByMagazineId(magazineId: string): Promise<Goods[]> {
    return this.prisma.goods.findMany({ where: { magazineId } });
  }

  async updateGoods(id: string, data: { name?: string; description?: string | null; price?: number; stock?: number | null }, authorId: string): Promise<Goods | null> {
    const goods = await this.prisma.goods.findUnique({ where: { id }, include: { magazine: true } });
    if (!goods || goods.magazine.authorId !== authorId) {
      return null; // または権限エラー
    }
    return this.prisma.goods.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
      },
    });
  }

  async deleteGoods(id: string, authorId: string): Promise<boolean> {
    const goods = await this.prisma.goods.findUnique({ where: { id }, include: { magazine: true } });
    if (!goods || goods.magazine.authorId !== authorId) {
      return false;
    }
    await this.prisma.goods.delete({ where: { id } });
    return true;
  }
} 