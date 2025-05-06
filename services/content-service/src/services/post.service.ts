// import { PrismaClient, Post } from '@generated/prisma';
import { PrismaClient, Post } from '@prisma/client';

// DTO は後で作成
// import { CreatePostDto, UpdatePostDto } from '../dtos/post.dto';

export class PostService {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  async createPost(data: { magazineId: string; title: string; content: string; published?: boolean }, authorId: string): Promise<Post | null> {
    // 認可チェック: マガジンの authorId と作成者の ID が一致するか確認
    const magazine = await this.prisma.magazine.findUnique({ where: { id: data.magazineId } });
    if (!magazine || magazine.authorId !== authorId) {
      return null; // または権限エラー
    }

    return this.prisma.post.create({
      data: {
        magazineId: data.magazineId,
        title: data.title,
        content: data.content,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
      },
    });
  }

  async getPostById(id: string): Promise<Post | null> {
    return this.prisma.post.findUnique({ where: { id } });
  }

  async getPostsByMagazineId(magazineId: string): Promise<Post[]> {
    return this.prisma.post.findMany({ where: { magazineId }, orderBy: { createdAt: 'asc' } }); // 例: 作成順
  }

  async updatePost(id: string, data: { title?: string; content?: string; published?: boolean }, authorId: string): Promise<Post | null> {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { magazine: true } });
    if (!post || post.magazine.authorId !== authorId) {
      return null; // または権限エラー
    }

    let publishedAt = post.publishedAt;
    if (data.published === true && !post.published) {
      publishedAt = new Date();
    } else if (data.published === false) {
      publishedAt = null;
    }

    return this.prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        published: data.published,
        publishedAt: publishedAt,
      },
    });
  }

  async deletePost(id: string, authorId: string): Promise<boolean> {
    const post = await this.prisma.post.findUnique({ where: { id }, include: { magazine: true } });
    if (!post || post.magazine.authorId !== authorId) {
      return false;
    }
    await this.prisma.post.delete({ where: { id } });
    return true;
  }
} 