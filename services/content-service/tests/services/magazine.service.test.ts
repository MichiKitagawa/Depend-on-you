import { PrismaClient } from '@generated/prisma';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { MagazineService } from '@src/services/magazine.service';

describe('MagazineService', () => {
  let magazineService: MagazineService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(() => {
    prismaMock = mockDeep<PrismaClient>();
    magazineService = new MagazineService(prismaMock);
  });

  it('should create a magazine', async () => {
    const magazineData = { title: 'Test Magazine', description: 'Test Desc', authorId: 'author1' };
    const expectedMagazine = {
      id: 'mag1',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...magazineData,
      // Prisma によって追加されるフィールドもモックする
      posts: [], 
      goods: []
    };
    prismaMock.magazine.create.mockResolvedValue(expectedMagazine);

    const result = await magazineService.createMagazine(magazineData);
    expect(result).toEqual(expectedMagazine);
    expect(prismaMock.magazine.create).toHaveBeenCalledWith({ data: magazineData });
  });

  it('should get a magazine by id', async () => {
    const magazineId = 'mag1';
    const expectedMagazine = {
      id: magazineId,
      title: 'Test Magazine',
      description: 'Test Desc',
      authorId: 'author1',
      createdAt: new Date(),
      updatedAt: new Date(),
      posts: [],
      goods: []
    };
    prismaMock.magazine.findUnique.mockResolvedValue(expectedMagazine);

    const result = await magazineService.getMagazineById(magazineId);
    expect(result).toEqual(expectedMagazine);
    expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: magazineId } });
  });

  it('should update a magazine if author matches', async () => {
      const magazineId = 'mag1';
      const authorId = 'author1';
      const updateData = { title: 'Updated Title' };
      const existingMagazine = {
          id: magazineId, title: 'Old Title', description: 'Old Desc', authorId: authorId,
          createdAt: new Date(), updatedAt: new Date(), posts: [], goods: []
      };
      const updatedMagazine = { ...existingMagazine, ...updateData, updatedAt: new Date() };

      prismaMock.magazine.findUnique.mockResolvedValue(existingMagazine);
      prismaMock.magazine.update.mockResolvedValue(updatedMagazine);

      const result = await magazineService.updateMagazine(magazineId, updateData, authorId);

      expect(result).toEqual(updatedMagazine);
      expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: magazineId } });
      expect(prismaMock.magazine.update).toHaveBeenCalledWith({ where: { id: magazineId }, data: updateData });
  });

   it('should not update a magazine if author does not match', async () => {
      const magazineId = 'mag1';
      const authorId = 'author1';
      const wrongAuthorId = 'author2';
      const updateData = { title: 'Updated Title' };
      const existingMagazine = {
          id: magazineId, title: 'Old Title', description: 'Old Desc', authorId: authorId,
          createdAt: new Date(), updatedAt: new Date(), posts: [], goods: []
      };

      prismaMock.magazine.findUnique.mockResolvedValue(existingMagazine);

      const result = await magazineService.updateMagazine(magazineId, updateData, wrongAuthorId);

      expect(result).toBeNull();
      expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: magazineId } });
      expect(prismaMock.magazine.update).not.toHaveBeenCalled();
  });

   it('should delete a magazine if author matches', async () => {
      const magazineId = 'mag1';
      const authorId = 'author1';
      const existingMagazine = {
          id: magazineId, title: 'Old Title', description: 'Old Desc', authorId: authorId,
          createdAt: new Date(), updatedAt: new Date(), posts: [], goods: []
      };

      prismaMock.magazine.findUnique.mockResolvedValue(existingMagazine);
      prismaMock.magazine.delete.mockResolvedValue(existingMagazine); // delete は削除されたオブジェクトを返す

      const result = await magazineService.deleteMagazine(magazineId, authorId);

      expect(result).toBe(true);
      expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: magazineId } });
      expect(prismaMock.magazine.delete).toHaveBeenCalledWith({ where: { id: magazineId } });
  });

   it('should not delete a magazine if author does not match', async () => {
      const magazineId = 'mag1';
      const authorId = 'author1';
      const wrongAuthorId = 'author2';
       const existingMagazine = {
          id: magazineId, title: 'Old Title', description: 'Old Desc', authorId: authorId,
          createdAt: new Date(), updatedAt: new Date(), posts: [], goods: []
      };

      prismaMock.magazine.findUnique.mockResolvedValue(existingMagazine);

      const result = await magazineService.deleteMagazine(magazineId, wrongAuthorId);

      expect(result).toBe(false);
      expect(prismaMock.magazine.findUnique).toHaveBeenCalledWith({ where: { id: magazineId } });
      expect(prismaMock.magazine.delete).not.toHaveBeenCalled();
  });

  it('should get magazines by author', async () => {
      const authorId = 'author1';
      const expectedMagazines = [
          { id: 'mag1', title: 'M1', description: '', authorId, createdAt: new Date(), updatedAt: new Date(), posts: [], goods: [] },
          { id: 'mag2', title: 'M2', description: '', authorId, createdAt: new Date(), updatedAt: new Date(), posts: [], goods: [] },
      ];
      prismaMock.magazine.findMany.mockResolvedValue(expectedMagazines);

      const result = await magazineService.getMagazinesByAuthor(authorId);

      expect(result).toEqual(expectedMagazines);
      expect(prismaMock.magazine.findMany).toHaveBeenCalledWith({ where: { authorId } });
  });

  // 他のメソッド (update, delete, getByAuthor など) のテストケースも追加
}); 