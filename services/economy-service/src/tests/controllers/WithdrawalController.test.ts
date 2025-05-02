// WithdrawalController.test.ts
describe('WithdrawalController', () => {
  describe('requestWithdrawal', () => {
      it.todo('should request withdrawal successfully for authenticated user');
      it.todo('should return 400 for invalid input');
      it.todo('should return 401 if user is not authenticated');
      it.todo('should return 400 for insufficient balance');
      it.todo('should handle other service errors');
  });
  describe('getWithdrawals', () => {
    it.todo('should get withdrawal history for authenticated user');
    it.todo('should return 401 if user is not authenticated');
  });
}); 