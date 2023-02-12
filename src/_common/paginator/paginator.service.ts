import {
  CursorBasedPaginationArgsType,
  CursorBasedPaginationDirection,
  CursorBasedSortType,
  PaginationRes,
} from './paginator.types';
import { MyModelStatic } from '../database/database.static-model';
import { Op } from 'sequelize';
import { Literal } from 'sequelize/types/utils';

// Need to be refactored

// ^ before (regardless of sort)
// v after  (regardless of sort)
// default sort is DESC
// items will include cursor regardless of sort or direction

export const cursorPaginate = async <T>(
  args: CursorBasedPaginationArgsType,
): Promise<PaginationRes<T>> => {
  let dateCursor = args.cursor && new Date(Number(args.cursor)),
    sort = args.sort || CursorBasedSortType.DESC,
    sequelizeOperator =
      args.direction === CursorBasedPaginationDirection.AFTER ? Op.lte : Op.gte,
    sequelizeOperatorForSingle =
      args.direction === CursorBasedPaginationDirection.AFTER ? Op.gt : Op.lt,
    realOrder =
      args.direction === CursorBasedPaginationDirection.AFTER
        ? CursorBasedSortType.DESC
        : CursorBasedSortType.ASC, // + reverse
    realOrderForSingle =
      args.direction === CursorBasedPaginationDirection.AFTER
        ? CursorBasedSortType.ASC
        : CursorBasedSortType.DESC;

  if (sort === CursorBasedSortType.ASC) {
    sequelizeOperator =
      args.direction === CursorBasedPaginationDirection.AFTER ? Op.gte : Op.lte;
    sequelizeOperatorForSingle =
      args.direction === CursorBasedPaginationDirection.AFTER ? Op.lt : Op.gt;
    realOrder =
      args.direction === CursorBasedPaginationDirection.AFTER
        ? CursorBasedSortType.ASC
        : CursorBasedSortType.DESC; // + reverse
    realOrderForSingle =
      args.direction === CursorBasedPaginationDirection.AFTER
        ? CursorBasedSortType.DESC
        : CursorBasedSortType.ASC;
  }

  let items = await args.model.findAll({
    where: {
      ...args.filter,
      ...(dateCursor && {
        createdAt: { [sequelizeOperator]: new Date(dateCursor) },
      }),
    },
    order: [['createdAt', realOrder]],
    limit: args.limit + 1,
    include: args.include,
    nest: true,
    raw: true,
  });

  let hasNext = items.length === args.limit + 1,
    hasBefore = items.length === args.limit + 1,
    nextCursor = null,
    beforeCursor = null,
    nextCursorRecord = hasNext ? items[args.limit] : null,
    beforeCursorRecord = hasBefore ? items[args.limit] : null;

  if (!items.length)
    return {
      pageInfo: { nextCursor, hasNext, beforeCursor, hasBefore },
      items: <any>items,
    };

  if (!dateCursor) dateCursor = new Date(items[0].createdAt);

  const item = await args.model.findOne({
    where: {
      ...args.filter,
      ...(dateCursor && {
        createdAt: { [sequelizeOperatorForSingle]: new Date(dateCursor) },
      }),
    },
    order: [['createdAt', realOrderForSingle]],
    limit: 1,
    include: args.include,
    nest: true,
    raw: true,
  });

  if (args.direction === CursorBasedPaginationDirection.BEFORE) {
    hasNext = !!item;
    if (item) {
      nextCursorRecord = item;
      items.unshift(item); // not `push` because of reversing
    }
  }

  if (args.direction === CursorBasedPaginationDirection.AFTER) {
    hasBefore = !!item;
    if (item) {
      beforeCursorRecord = item;
      items.unshift(item);
    }
  }

  if (hasNext) {
    nextCursor = nextCursorRecord.createdAt.getTime().toString();
    items = items.filter((i) => i !== nextCursorRecord);
  }
  if (hasBefore) {
    beforeCursor = beforeCursorRecord.createdAt.getTime().toString();
    items = items.filter((i) => i !== beforeCursorRecord);
  }

  if (args.direction === CursorBasedPaginationDirection.BEFORE) items.reverse();

  return {
    pageInfo: { nextCursor, hasNext, beforeCursor, hasBefore },
    items: <any>items,
  };
};

export const paginate = async <T>(
  model: MyModelStatic,
  filter = {},
  sort: string | Literal = '-createdAt',
  page = 0,
  limit = 15,
  include: any = [],
  attributes: string[] = null,
  isNestAndRaw = true,
): Promise<PaginationRes<T>> => {
  let totalPages = 0,
    totalCount = 0,
    hasNext = false;
  // Using `findAll` instead of `count` because `count` generates a different SQL
  totalCount = (
    await model.findAll({
      where: filter,
      include,
      nest: isNestAndRaw,
      raw: isNestAndRaw,
      subQuery: false,
    })
  ).length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  let skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  if (!sort) sort = '-createdAt';
  let order = null;
  // Literal query
  if (typeof sort === 'object') order = sort;
  else order = [[sort.replace('-', ''), sort.startsWith('-') ? 'DESC' : 'ASC']];
  let items = await model.findAll({
    where: filter,
    ...(order && { order }),
    limit,
    offset: skip,
    include,
    nest: isNestAndRaw,
    raw: isNestAndRaw,
    subQuery: false,
    ...(attributes && { attributes }),
  });
  return {
    pageInfo: {
      hasBefore: page > 1,
      page,
      hasNext,
      totalCount,
      totalPages,
    },
    items: <any>items,
  };
};

export const manualPaginator = <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15,
  nestedSort = [],
): PaginationRes<T> => {
  let res = {
    pageInfo: {
      page: 0,
      limit,
      hasNext: false,
      hasBefore: false,
      totalCount: 0,
      totalPages: 0,
    },
    items: [],
  };
  if (!array || !array.length) return res;
  let totalPages = 0,
    totalCount = 0,
    hasNext = false;
  let sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
    ? array.sort((a, b) => {
        if (nestedSort.length > 0) {
          const { nestedA, nestedB } = nestSortFields(
            a[sortField],
            b[sortField],
            nestedSort,
          );
          return nestedB - nestedA;
        }
        return b[sortField] - a[sortField];
      })
    : array.sort((a, b) => {
        if (nestedSort.length > 0) {
          const { nestedA, nestedB } = nestSortFields(
            a[sort],
            b[sort],
            nestedSort,
          );
          return nestedA - nestedB;
        }
        return a[sort] - b[sort];
      });
  if (filter && Object.keys(filter).length) {
    items = array.filter((entity) => {
      for (let i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  totalCount = items.length;
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  totalPages = totalCount / limit < 1 ? 1 : Math.ceil(totalCount / limit);
  let skip = page > 1 ? (page - 1) * limit : 0;
  hasNext = skip + limit < totalCount;
  items = items.slice(skip, limit + skip);
  return {
    pageInfo: {
      page,
      hasNext,
      hasBefore: page > 1,
      totalCount,
      totalPages,
    },
    items,
  };
};

export const manualPaginatorReturnsArray = <T>(
  array: T[] = [],
  filter = {},
  sort = '-createdAt',
  page = 0,
  limit = 15,
): T[] => {
  if (!array || !array.length) return [];
  let sortField = sort;
  sortField = sort && sort.startsWith('-') ? sort.replace('-', '') : null;
  let items = !sort
    ? array
    : sort.startsWith('-')
    ? array.sort((a, b) => b[sortField] - a[sortField])
    : array.sort((a, b) => a[sortField] - b[sortField]);
  if (filter && Object.keys(filter).length) {
    items = array.filter((entity) => {
      for (let i in filter) {
        return entity[i] === filter[i];
      }
    });
  }
  if (limit > 50) limit = 50;
  if (limit < 0) limit = 15;
  if (page < 0) page = 0;
  let skip = page > 1 ? (page - 1) * limit : 0;
  items = items.slice(skip, limit + skip);
  return items;
};

const nestSortFields = (nestedA, nestedB, nestedSort) => {
  for (let i = 0; i < nestedSort.length; i++) {
    nestedB = nestedB[nestedSort[i]];
    nestedA = nestedA[nestedSort[i]];
  }
  return { nestedA, nestedB };
};
