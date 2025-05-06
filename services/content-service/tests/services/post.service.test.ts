import { PrismaClient, Prisma, Post, Magazine } from '@prisma/client';
import { PostService } from '@src/services/post.service';

// Manual mocks
const mockPostDb = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockMagazineDb = {
  findUnique: jest.fn(),
};
const mockPrismaClient = {
  post: mockPostDb,
  magazine: mockMagazineDb,
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: jest.requireActual('@prisma/client').Prisma,
}));

describe('PostService', () => {
  let postService: PostService;

  const mockPostId = 'post-123';
  const mockMagazineId = 'mag-456';
  const mockUserId = 'user-789';
  const mockPostData: Post = {
    id: mockPostId,
    title: 'Test Post',
    content: 'Test content',
    published: false,
    publishedAt: null,
    magazineId: mockMagazineId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const mockMagazineData = { id: mockMagazineId, authorId: mockUserId };

  beforeEach(() => {
    jest.clearAllMocks();
    postService = new PostService(mockPrismaClient as unknown as PrismaClient);
    Object.values(mockPostDb).forEach(mockFn => mockFn.mockReset());
    Object.values(mockMagazineDb).forEach(mockFn => mockFn.mockReset());
    mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData as any);
  });

  describe('createPost', () => {
    const input = { title: 'New Post', content: 'New Content', magazineId: mockMagazineId };
    const createDataPrisma = { title: input.title, content: input.content, published: false, publishedAt: null, magazine: { connect: { id: input.magazineId } } };

    it('正常に Post を作成できる', async () => {
      const createdPost = { ...mockPostData, id: 'new-post-id', title: input.title, content: input.content };
      mockPostDb.create.mockResolvedValue(createdPost);
      mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData as any);

      const post = await postService.createPost(input, mockUserId);

      expect(post).toEqual(createdPost);
      expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: input.magazineId } });
      expect(mockPostDb.create).toHaveBeenCalledWith({ data: expect.objectContaining({
          title: input.title,
          content: input.content,
          magazineId: input.magazineId,
          published: false,
          publishedAt: null
      }) });
    });

    it('ユーザーが Magazine の作者でない場合 null を返す', async () => {
        mockMagazineDb.findUnique.mockResolvedValue({ authorId: 'other-user' } as any);
        const result = await postService.createPost(input, mockUserId);
        expect(result).toBeNull();
        expect(mockPostDb.create).not.toHaveBeenCalled();
    });
  });

  describe('getPostById', () => {
    it('正常に Post を取得できる', async () => {
        mockPostDb.findUnique.mockResolvedValue(mockPostData);
        const post = await postService.getPostById(mockPostId);
        expect(post).toEqual(mockPostData);
        expect(mockPostDb.findUnique).toHaveBeenCalledWith({ where: { id: mockPostId } });
    });
    it('存在しない PostID の場合 null を返す', async () => {
        mockPostDb.findUnique.mockResolvedValue(null);
        const post = await postService.getPostById('non-existent');
        expect(post).toBeNull();
    });
  });

  describe('updatePost', () => {
    const updateData = { title: 'Updated Title', content: 'Updated Content', published: true };

    it('正常に Post を更新できる (作者確認)', async () => {
        const updatedPost = { ...mockPostData, ...updateData, publishedAt: expect.any(Date) };
        mockPostDb.findUnique.mockResolvedValue({ ...mockPostData, magazine: mockMagazineData });
        mockPostDb.update.mockResolvedValue(updatedPost);

        const post = await postService.updatePost(mockPostId, updateData, mockUserId);

        expect(post).toEqual(updatedPost);
        expect(mockPostDb.findUnique).toHaveBeenCalledWith({ where: { id: mockPostId }, include: { magazine: true } });
        expect(mockPostDb.update).toHaveBeenCalledWith({ where: { id: mockPostId }, data: { ...updateData, publishedAt: expect.any(Date) } });
    });

    it('Post が存在しない場合 null を返す', async () => {
        mockPostDb.findUnique.mockResolvedValue(null);
        const result = await postService.updatePost('non-existent', updateData, mockUserId);
        expect(result).toBeNull();
        expect(mockPostDb.update).not.toHaveBeenCalled();
    });

    it('ユーザーが作者でない場合 null を返す', async () => {
        const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
        mockPostDb.findUnique.mockResolvedValue({ ...mockPostData, magazine: otherAuthorMagazine });
        const result = await postService.updatePost(mockPostId, updateData, mockUserId);
        expect(result).toBeNull();
        expect(mockPostDb.findUnique).toHaveBeenCalledWith({ where: { id: mockPostId }, include: { magazine: true } });
        expect(mockPostDb.update).not.toHaveBeenCalled();
    });
  });

  describe('deletePost', () => {
      it('正常に Post を削除できる (作者確認)', async () => {
        mockPostDb.findUnique.mockResolvedValue({ ...mockPostData, magazine: mockMagazineData });
        mockPostDb.delete.mockResolvedValue(mockPostData);

        const result = await postService.deletePost(mockPostId, mockUserId);

        expect(result).toBe(true);
        expect(mockPostDb.findUnique).toHaveBeenCalledWith({ where: { id: mockPostId }, include: { magazine: true } });
        expect(mockPostDb.delete).toHaveBeenCalledWith({ where: { id: mockPostId } });
      });

      it('Post が存在しない場合 false を返す', async () => {
        mockPostDb.findUnique.mockResolvedValue(null);
        const result = await postService.deletePost('non-existent', mockUserId);
        expect(result).toBe(false);
        expect(mockPostDb.delete).not.toHaveBeenCalled();
      });

      it('ユーザーが作者でない場合 false を返す', async () => {
        const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
        mockPostDb.findUnique.mockResolvedValue({ ...mockPostData, magazine: otherAuthorMagazine });
        const result = await postService.deletePost(mockPostId, mockUserId);
        expect(result).toBe(false);
        expect(mockPostDb.findUnique).toHaveBeenCalledWith({ where: { id: mockPostId }, include: { magazine: true } });
        expect(mockPostDb.delete).not.toHaveBeenCalled();
      });
  });

  describe('getPostsByMagazineId', () => {
    it('正常に Magazine の Post 一覧を取得できる', async () => {
        const mockPosts = [mockPostData, { ...mockPostData, id: 'post-789' }];
        mockPostDb.findMany.mockResolvedValue(mockPosts);
        const posts = await postService.getPostsByMagazineId(mockMagazineId);
        expect(posts).toEqual(mockPosts);
        expect(mockPostDb.findMany).toHaveBeenCalledWith({
            where: { magazineId: mockMagazineId },
            orderBy: { createdAt: 'asc' }
        });
    });
  });
}); 