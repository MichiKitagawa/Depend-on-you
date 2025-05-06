import { PrismaClient, Prisma, Magazine } from '@prisma/client';
import { MagazineService } from '@src/services/magazine.service';

// Manual mocks
const mockMagazineDb = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
const mockPrismaClient = {
  magazine: mockMagazineDb,
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrismaClient),
  Prisma: jest.requireActual('@prisma/client').Prisma,
}));

describe('MagazineService', () => {
  let magazineService: MagazineService;

  const mockMagazineId = 'mag-123';
  const mockUserId = 'user-789';
  const mockMagazineData: Magazine = {
    id: mockMagazineId,
    title: 'Test Magazine',
    description: 'Test Description',
    authorId: mockUserId,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    magazineService = new MagazineService(mockPrismaClient as unknown as PrismaClient);
    Object.values(mockMagazineDb).forEach(mockFn => mockFn.mockReset());
  });

  describe('createMagazine', () => {
    const input = { title: 'New Mag', description: 'New Desc' };
    const createData = { ...input, authorId: mockUserId };

    it('正常に Magazine を作成できる', async () => {
      const createdMagazine = { ...mockMagazineData, id: 'new-mag-id', ...input };
      mockMagazineDb.create.mockResolvedValue(createdMagazine);

      const magazine = await magazineService.createMagazine(createData);

      expect(magazine).toEqual(createdMagazine);
      expect(mockMagazineDb.create).toHaveBeenCalledWith({ data: createData });
    });
  });

  describe('getMagazineById', () => {
      it('正常に Magazine を取得できる', async () => {
        mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData);
        const magazine = await magazineService.getMagazineById(mockMagazineId);
        expect(magazine).toEqual(mockMagazineData);
        expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
      });
       it('存在しない MagazineID の場合 null を返す', async () => {
        mockMagazineDb.findUnique.mockResolvedValue(null);
        const magazine = await magazineService.getMagazineById('non-existent');
        expect(magazine).toBeNull();
      });
  });

   describe('updateMagazine', () => {
       const updateData = { title: 'Updated Title' };

       it('正常に Magazine を更新できる (作者確認)', async () => {
        const updatedMagazine = { ...mockMagazineData, ...updateData };
        mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData);
        mockMagazineDb.update.mockResolvedValue(updatedMagazine);

        const magazine = await magazineService.updateMagazine(mockMagazineId, updateData, mockUserId);

        expect(magazine).toEqual(updatedMagazine);
        expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
        expect(mockMagazineDb.update).toHaveBeenCalledWith({ where: { id: mockMagazineId }, data: updateData });
       });

        it('Magazine が存在しない場合エラーをスローする', async () => {
            mockMagazineDb.findUnique.mockResolvedValue(null);
            await expect(magazineService.updateMagazine('non-existent', updateData, mockUserId))
                .rejects.toThrow(new Error('Forbidden: You are not authorized to update this magazine'));
            expect(mockMagazineDb.update).not.toHaveBeenCalled();
        });

       it('ユーザーが作者でない場合エラーをスローする', async () => {
           const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
           mockMagazineDb.findUnique.mockResolvedValue(otherAuthorMagazine);
           await expect(magazineService.updateMagazine(mockMagazineId, updateData, mockUserId))
               .rejects.toThrow(new Error('Forbidden: You are not authorized to update this magazine'));
           expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
           expect(mockMagazineDb.update).not.toHaveBeenCalled();
       });
   });

    describe('deleteMagazine', () => {
        it('正常に Magazine を削除できる (作者確認)', async () => {
            mockMagazineDb.findUnique.mockResolvedValue(mockMagazineData);
            mockMagazineDb.delete.mockResolvedValue(mockMagazineData);

            const result = await magazineService.deleteMagazine(mockMagazineId, mockUserId);

            expect(result).toBe(true);
            expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
            expect(mockMagazineDb.delete).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
        });

        it('Magazine が存在しない場合 false を返す', async () => {
            mockMagazineDb.findUnique.mockResolvedValue(null);
            const result = await magazineService.deleteMagazine('non-existent', mockUserId);
            expect(result).toBe(false);
            expect(mockMagazineDb.delete).not.toHaveBeenCalled();
        });

        it('ユーザーが作者でない場合 false を返す', async () => {
            const otherAuthorMagazine = { ...mockMagazineData, authorId: 'other-user' };
            mockMagazineDb.findUnique.mockResolvedValue(otherAuthorMagazine);
            const result = await magazineService.deleteMagazine(mockMagazineId, mockUserId);
            expect(result).toBe(false);
            expect(mockMagazineDb.findUnique).toHaveBeenCalledWith({ where: { id: mockMagazineId } });
            expect(mockMagazineDb.delete).not.toHaveBeenCalled();
        });
    });

    describe('getMagazinesByAuthor', () => {
        it('正常に Author の Magazine 一覧を取得できる', async () => {
            const mockMagazines = [mockMagazineData, { ...mockMagazineData, id: 'mag-789' }];
            mockMagazineDb.findMany.mockResolvedValue(mockMagazines);
            const magazines = await magazineService.getMagazinesByAuthor(mockUserId);
            expect(magazines).toEqual(mockMagazines);
            expect(mockMagazineDb.findMany).toHaveBeenCalledWith({ where: { authorId: mockUserId } });
        });
    });
}); 