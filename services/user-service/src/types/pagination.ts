import { ParsedQs } from 'qs';

export interface PaginationQuery extends ParsedQs {
  page?: string;
  limit?: string;
} 