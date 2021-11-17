import { Type } from '@nestjs/common';
import { ArgsType, Field, Int, ObjectType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class Pagination {
  page?: number;
  perPage?: number;
}

@ArgsType()
export class PaginationGql extends Pagination {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  page?: number;

  @Field({ nullable: true, defaultValue: 10 })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  perPage?: number;
}

export interface IEdgeType<T> {
  node: T;
  cursor: number;
}

export interface IPageInfo {
  total: number;
  page: number;
  perPage: number;
  prevPage: number;
  nextPage: number;
  totalPages: number;
}

export interface IPaginatedResponse<T> {
  edges: IEdgeType<T>[];
  pageInfo: IPageInfo;
}

export function getEdges<T extends { id?: number }>(
  nodes: Array<T>,
): Array<IEdgeType<T>> {
  return nodes.map((node) => ({ node, cursor: node.id }));
}

export function CursorPaginated<T>(
  classRef: Type<T>,
): Type<IPaginatedResponse<T>> {
  @ObjectType(`${classRef.name}Edge`)
  abstract class EdgeType {
    @Field(() => Int)
    cursor: number;

    @Field(() => classRef)
    node: T;
  }

  @ObjectType(`${classRef.name}PageInfo`)
  abstract class PageInfo {
    @Field(() => Int, { nullable: true })
    public total: number;

    @Field(() => Int, { nullable: true })
    public page: number;

    @Field(() => Int, { nullable: true })
    public perPage: number;

    @Field(() => Int, { nullable: true })
    public prevPage: number;

    @Field(() => Int, { nullable: true })
    public nextPage: number;

    @Field(() => Int, { nullable: true })
    public totalPages: number;
  }

  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedResponse<T> {
    @Field(() => [EdgeType], { nullable: true })
    edges: EdgeType[];

    @Field(() => PageInfo, { nullable: true })
    pageInfo: PageInfo;
  }

  return PaginatedType as Type<IPaginatedResponse<T>>;
}
