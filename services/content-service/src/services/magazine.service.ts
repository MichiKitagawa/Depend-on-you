// import { PrismaClient, Magazine } from '../generated/prisma';
import { PrismaClient, Magazine } from '@prisma/client';
// import { CreateMagazineDto, UpdateMagazineDto } from '@src/dtos/magazine.dto'; // DTO パスも修正

export class MagazineService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  // async createMagazine(data: CreateMagazineDto & { authorId: string }): Promise<Magazine> {
  async createMagazine(data: { title: string; description?: string | null; authorId: string }): Promise<Magazine> {
    return this.prisma.magazine.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: data.authorId, // JWT などから取得したユーザーIDを使う想定
      },
    });
  }

  async getMagazineById(id: string): Promise<Magazine | null> {
    return this.prisma.magazine.findUnique({
      where: { id },
    });
  }

  // async updateMagazine(id: string, data: UpdateMagazineDto, authorId: string): Promise<Magazine | null> {
  async updateMagazine(id: string, data: { title?: string; description?: string | null }, authorId: string): Promise<Magazine | null> {
    const magazine = await this.prisma.magazine.findUnique({ where: { id } });

    const isAuthorized = magazine && magazine.authorId === authorId;

    if (!isAuthorized) {
      throw new Error('Forbidden: You are not authorized to update this magazine');
    }

    return this.prisma.magazine.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async deleteMagazine(id: string, authorId: string): Promise<boolean> {
    const magazine = await this.prisma.magazine.findUnique({ where: { id } });
    if (!magazine || magazine.authorId !== authorId) {
      return false;
    }
    // 関連する投稿やグッズの削除、または参照を切る処理が必要な場合がある
    await this.prisma.magazine.delete({ where: { id } });
    return true;
  }

  async getMagazinesByAuthor(authorId: string): Promise<Magazine[]> {
      return this.prisma.magazine.findMany({ where: { authorId } });
  }
} 