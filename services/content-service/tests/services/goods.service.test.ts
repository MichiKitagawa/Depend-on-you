import { PrismaClient } from '@generated/prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { GoodsService } from '@src/services/goods.service';

describe('GoodsService', () => {
  let goodsService: GoodsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    goodsService = new GoodsService(prismaMock);
  });

  it('should create goods if author owns the magazine', async () => {
    const goodsData = { magazineId: 'mag1', name: 'Test Goods', description: 'Desc', price: 1000, stock: 10 };
    const authorId = 'author1';
    const magazine = { id: 'mag1', authorId: authorId, title:'', description:'', createdAt: new Date(), updatedAt: new Date(), posts:[], goods:[] };
    const expectedGoods = {
      id: 'goods1',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...goodsData,
    };

    prismaMock.magazine.findUnique.mockResolvedValue(magazine);
    prismaMock.goods.create.mockResolvedValue(expectedGoods);

    const result = await goodsService.createGoods(goodsData, authorId);

    expect(result).toEqual(expectedGoods);
    expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: goodsData.magazineId } });
    expect(prismaMock.goods.create).toHaveBeenCalledWith({ data: goodsData });
  });

 it('should not create goods if author does not own the magazine', async () => {
    const goodsData = { magazineId: 'mag1', name: 'Test Goods', price: 1000 };
    const authorId = 'author1';
    const wrongAuthorId = 'author2';
    const magazine = { id: 'mag1', authorId: authorId, title:'', description:'', createdAt: new Date(), updatedAt: new Date(), posts:[], goods:[] };

    prismaMock.magazine.findUnique.mockResolvedValue(magazine);

    const result = await goodsService.createGoods(goodsData, wrongAuthorId);

    expect(result).toBeNull();
    expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: goodsData.magazineId } });
    expect(prismaMock.goods.create).not.toHaveBeenCalled();
  });

  it('should get goods by magazine id', async () => {
      const magazineId = 'mag1';
      const expectedGoods = [
          { id: 'goods1', magazineId, name: 'G1', description: '', price: 100, stock: 5, createdAt: new Date(), updatedAt: new Date() },
          { id: 'goods2', magazineId, name: 'G2', description: '', price: 200, stock: null, createdAt: new Date(), updatedAt: new Date() },
      ];
      prismaMock.goods.findMany.mockResolvedValue(expectedGoods);

      const result = await goodsService.getGoodsByMagazineId(magazineId);

      expect(result).toEqual(expectedGoods);
      expect(prismaMock.goods.findMany).toHaveBeenCalledWith({ where: { magazineId } });
  });

  // getGoodsById, updateGoods, deleteGoods のテストケースも同様に追加
}); 