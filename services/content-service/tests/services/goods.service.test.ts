import { PrismaClient, Prisma, Goods, Magazine } from '@prisma/client';
import { GoodsService } from '@src/services/goods.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'; // Keep for potential other uses if needed, but avoid for Prisma client models

// Mock Prisma Client Manually
const mockGoodsDb = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMany: jest.fn(), // Add findMany if used
};
const mockMagazineDb = {
  findUnique: jest.fn(),
};

const mockPrismaClient = {
  goods: mockGoodsDb,
  magazine: mockMagazineDb,
  // Add other models if needed
  $transaction: jest.fn().mockImplementation(async (callback) => callback(mockPrismaClient)), // Mock transaction if needed
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: jest.requireActual('@prisma/client').Prisma, // Keep actual Prisma namespace for enums, types etc.
}));

describe('GoodsService', () => {
  let goodsService: GoodsService;
  // Remove mockPrisma: DeepMockProxy<PrismaClient>;

  // モックデータ定義
  const mockMagazineId = 'mag-123';
  const mockGoodsId = 'goods-456';
  const mockUserId = 'user-789';
  const mockGoodsData: Goods = {
    id: mockGoodsId,
    name: 'Test Goods',
    description: 'Test description',
    price: 1000,
    stock: 10,
    magazineId: mockMagazineId,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const mockMagazineData = { id: mockMagazineId, authorId: mockUserId };

  beforeEach(() => {
    jest.clearAllMocks();
    // Instantiate service with the manually mocked client
    goodsService = new GoodsService(mockPrismaClient as unknown as PrismaClient);

    // Reset mocks
    Object.values(mockGoodsDb).forEach(mockFn => mockFn.mockReset());
    Object.values(mockMagazineDb).forEach(mockFn => mockFn.mockReset());

    // Default mock implementations
    mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData as any);
  });

  describe('getGoodsById', () => {
    it('存在する GoodsID で Goods 情報を取得できる', async () => {
      mockGoodsDb.findUnique.mockResolvedValue(mockGoodsData);
      const goods = await goodsService.getGoodsById(mockGoodsId);
      expect(goods).toEqual(mockGoodsData);
      expect(mockGoodsDb.findUnique).toHaveBeenCalledWith({ where: { id: mockGoodsId } });
    });

    it('存在しない GoodsID の場合 null を返す', async () => {
      mockGoodsDb.findUnique.mockResolvedValue(null);
      const goods = await goodsService.getGoodsById('non-existent-id');
      expect(goods).toBeNull();
    });
  });

  describe('createGoods', () => {
    const input = {
      name: 'New Goods',
      price: 1500,
      stock: 5,
      magazineId: mockMagazineId,
    };
    const createDataPrisma = {
        name: input.name,
        price: input.price,
        stock: input.stock,
        magazine: { connect: { id: input.magazineId } }
    };

    it('正常に Goods を作成できる', async () => {
      const createdGoods = { ...mockGoodsData, id: 'new-goods-id', name: input.name };
      mockGoodsDb.create.mockResolvedValue(createdGoods);
      mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData as any);

      const goods = await goodsService.createGoods(input, mockUserId);

      expect(goods).toEqual(createdGoods);
      expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: input.magazineId } });
      expect(mockGoodsDb.create).toHaveBeenCalledWith({ data: {
          magazineId: input.magazineId,
          name: input.name,
          description: undefined,
          price: input.price,
          stock: input.stock
      } });
    });

    it('ユーザーが Magazine の作者でない場合、null を返す (サービス実装依存)', async () => {
        mockMagazineDb.findUnique.mockResolvedValue({ authorId: 'other-user' } as any);
        const result = await goodsService.createGoods(input, mockUserId);
        expect(result).toBeNull();
        expect(mockGoodsDb.create).not.toHaveBeenCalled();
    });
  });

  describe('updateGoods', () => {
    const goodsId = mockGoodsId;
    const updateData = { name: 'Updated Goods', price: 1200 };

    it('正常に Goods を更新できる (作者確認)', async () => {
      const updatedGoods = { ...mockGoodsData, name: 'Updated Goods', price: 1200 };
      mockGoodsDb.findUnique.mockResolvedValue({ ...mockGoodsData, magazine: mockMagazineData });
      mockGoodsDb.update.mockResolvedValue(updatedGoods);

      const goods = await goodsService.updateGoods(goodsId, updateData, mockUserId);

      expect(goods).toEqual(updatedGoods);
      expect(mockGoodsDb.findUnique).toHaveBeenCalledWith({
        where: { id: goodsId },
        include: { magazine: true }
      });
      expect(mockGoodsDb.update).toHaveBeenCalledWith({ where: { id: goodsId }, data: updateData });
    });

     it('Goods が存在しない場合 null を返す', async () => {
        mockGoodsDb.findUnique.mockResolvedValue(null);
        const result = await goodsService.updateGoods('non-existent', updateData, mockUserId);
        expect(result).toBeNull();
        expect(mockGoodsDb.update).not.toHaveBeenCalled();
    });

    it('ユーザーが作者でない場合 null を返す', async () => {
        const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
        mockGoodsDb.findUnique.mockResolvedValue({ ...mockGoodsData, magazine: otherAuthorMagazine });
        const result = await goodsService.updateGoods(goodsId, updateData, mockUserId);
        expect(result).toBeNull();
        expect(mockGoodsDb.findUnique).toHaveBeenCalledWith({
             where: { id: goodsId },
             include: { magazine: true }
         });
        expect(mockGoodsDb.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteGoods', () => {
    const goodsId = mockGoodsId;

    it('正常に Goods を削除できる (作者確認)', async () => {
       mockGoodsDb.findUnique.mockResolvedValue({ ...mockGoodsData, magazine: mockMagazineData });
      mockGoodsDb.delete.mockResolvedValue(mockGoodsData);

      const result = await goodsService.deleteGoods(goodsId, mockUserId);

      expect(result).toBe(true);
      expect(mockGoodsDb.findUnique).toHaveBeenCalledWith({
        where: { id: goodsId },
        include: { magazine: true }
      });
      expect(mockGoodsDb.delete).toHaveBeenCalledWith({ where: { id: goodsId } });
    });

     it('Goods が存在しない場合 false を返す', async () => {
        mockGoodsDb.findUnique.mockResolvedValue(null);
        const result = await goodsService.deleteGoods('non-existent', mockUserId);
        expect(result).toBe(false);
        expect(mockGoodsDb.delete).not.toHaveBeenCalled();
    });

    it('ユーザーが作者でない場合 false を返す', async () => {
        const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
        mockGoodsDb.findUnique.mockResolvedValue({ ...mockGoodsData, magazine: otherAuthorMagazine });
        const result = await goodsService.deleteGoods(goodsId, mockUserId);
        expect(result).toBe(false);
        expect(mockGoodsDb.findUnique).toHaveBeenCalledWith({
             where: { id: goodsId },
             include: { magazine: true }
         });
        expect(mockGoodsDb.delete).not.toHaveBeenCalled();
    });
  });
}); 