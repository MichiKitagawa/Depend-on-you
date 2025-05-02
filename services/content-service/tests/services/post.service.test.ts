import { PrismaClient } from '@generated/prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PostService } from '@src/services/post.service';

describe('PostService', () => {
  let postService: PostService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    postService = new PostService(prismaMock);
  });

  it('should create a post if author owns the magazine', async () => {
    const postData = { magazineId: 'mag1', title: 'Test Post', content: 'Content', published: true };
    const authorId = 'author1';
    const magazine = { id: 'mag1', authorId: authorId, title: 'M', description:'', createdAt: new Date(), updatedAt: new Date(), posts:[], goods:[] };
    const expectedPost = {
      id: 'post1',
      publishedAt: expect.any(Date),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...postData,
    };

    prismaMock.magazine.findUnique.mockResolvedValue(magazine);
    prismaMock.post.create.mockResolvedValue(expectedPost);

    const result = await postService.createPost(postData, authorId);

    expect(result).toEqual(expectedPost);
    expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: postData.magazineId } });
    expect(prismaMock.post.create).toHaveBeenCalledWith({
      data: {
        ...postData,
        publishedAt: expect.any(Date),
      },
    });
  });

   it('should not create a post if author does not own the magazine', async () => {
    const postData = { magazineId: 'mag1', title: 'Test Post', content: 'Content' };
    const authorId = 'author1';
    const wrongAuthorId = 'author2';
    const magazine = { id: 'mag1', authorId: authorId, title: 'M', description:'', createdAt: new Date(), updatedAt: new Date(), posts:[], goods:[] };

    prismaMock.magazine.findUnique.mockResolvedValue(magazine);

    const result = await postService.createPost(postData, wrongAuthorId);

    expect(result).toBeNull();
    expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: postData.magazineId } });
    expect(prismaMock.post.create).not.toHaveBeenCalled();
  });

  it('should get posts by magazine id', async () => {
      const magazineId = 'mag1';
      const expectedPosts = [
          { id: 'post1', magazineId, title: 'P1', content: '', published: true, publishedAt: new Date(), createdAt: new Date(), updatedAt: new Date() },
          { id: 'post2', magazineId, title: 'P2', content: '', published: false, publishedAt: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      prismaMock.post.findMany.mockResolvedValue(expectedPosts);

      const result = await postService.getPostsByMagazineId(magazineId);

      expect(result).toEqual(expectedPosts);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({ where: { magazineId }, orderBy: { createdAt: 'asc' } });
  });

  // getPostById, updatePost, deletePost のテストケースも同様に追加
}); 