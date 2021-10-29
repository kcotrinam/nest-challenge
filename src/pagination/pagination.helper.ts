import { PaginationQueryDto } from '../pagination/dtos/pagination-query.dto';

export function paginatedHelper(
  params: PaginationQueryDto,
): { skip: number; take: number } | undefined {
  if (params.page && params.perPage)
    return {
      skip: (params.page - 1) * params.perPage,
      take: params.perPage,
    };
}
