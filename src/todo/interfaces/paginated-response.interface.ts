export interface PaginatedResponse<T> {
    [x: string]: any;
    data: T[];
    meta: {
      total: number;
      currentPage: number;
      itemsPerPage: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  }