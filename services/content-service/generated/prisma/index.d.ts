
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Magazine
 * 
 */
export type Magazine = $Result.DefaultSelection<Prisma.$MagazinePayload>
/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model Goods
 * 
 */
export type Goods = $Result.DefaultSelection<Prisma.$GoodsPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Magazines
 * const magazines = await prisma.magazine.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Magazines
   * const magazines = await prisma.magazine.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.magazine`: Exposes CRUD operations for the **Magazine** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Magazines
    * const magazines = await prisma.magazine.findMany()
    * ```
    */
  get magazine(): Prisma.MagazineDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.goods`: Exposes CRUD operations for the **Goods** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Goods
    * const goods = await prisma.goods.findMany()
    * ```
    */
  get goods(): Prisma.GoodsDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.7.0
   * Query Engine version: 3cff47a7f5d65c3ea74883f1d736e41d68ce91ed
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Magazine: 'Magazine',
    Post: 'Post',
    Goods: 'Goods'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "magazine" | "post" | "goods"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Magazine: {
        payload: Prisma.$MagazinePayload<ExtArgs>
        fields: Prisma.MagazineFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MagazineFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MagazineFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          findFirst: {
            args: Prisma.MagazineFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MagazineFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          findMany: {
            args: Prisma.MagazineFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>[]
          }
          create: {
            args: Prisma.MagazineCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          createMany: {
            args: Prisma.MagazineCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MagazineCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>[]
          }
          delete: {
            args: Prisma.MagazineDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          update: {
            args: Prisma.MagazineUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          deleteMany: {
            args: Prisma.MagazineDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MagazineUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MagazineUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>[]
          }
          upsert: {
            args: Prisma.MagazineUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MagazinePayload>
          }
          aggregate: {
            args: Prisma.MagazineAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMagazine>
          }
          groupBy: {
            args: Prisma.MagazineGroupByArgs<ExtArgs>
            result: $Utils.Optional<MagazineGroupByOutputType>[]
          }
          count: {
            args: Prisma.MagazineCountArgs<ExtArgs>
            result: $Utils.Optional<MagazineCountAggregateOutputType> | number
          }
        }
      }
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      Goods: {
        payload: Prisma.$GoodsPayload<ExtArgs>
        fields: Prisma.GoodsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoodsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoodsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          findFirst: {
            args: Prisma.GoodsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoodsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          findMany: {
            args: Prisma.GoodsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>[]
          }
          create: {
            args: Prisma.GoodsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          createMany: {
            args: Prisma.GoodsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GoodsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>[]
          }
          delete: {
            args: Prisma.GoodsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          update: {
            args: Prisma.GoodsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          deleteMany: {
            args: Prisma.GoodsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoodsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GoodsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>[]
          }
          upsert: {
            args: Prisma.GoodsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoodsPayload>
          }
          aggregate: {
            args: Prisma.GoodsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoods>
          }
          groupBy: {
            args: Prisma.GoodsGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoodsGroupByOutputType>[]
          }
          count: {
            args: Prisma.GoodsCountArgs<ExtArgs>
            result: $Utils.Optional<GoodsCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    magazine?: MagazineOmit
    post?: PostOmit
    goods?: GoodsOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type MagazineCountOutputType
   */

  export type MagazineCountOutputType = {
    posts: number
    goods: number
  }

  export type MagazineCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | MagazineCountOutputTypeCountPostsArgs
    goods?: boolean | MagazineCountOutputTypeCountGoodsArgs
  }

  // Custom InputTypes
  /**
   * MagazineCountOutputType without action
   */
  export type MagazineCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the MagazineCountOutputType
     */
    select?: MagazineCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * MagazineCountOutputType without action
   */
  export type MagazineCountOutputTypeCountPostsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
  }

  /**
   * MagazineCountOutputType without action
   */
  export type MagazineCountOutputTypeCountGoodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoodsWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Magazine
   */

  export type AggregateMagazine = {
    _count: MagazineCountAggregateOutputType | null
    _min: MagazineMinAggregateOutputType | null
    _max: MagazineMaxAggregateOutputType | null
  }

  export type MagazineMinAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    authorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MagazineMaxAggregateOutputType = {
    id: string | null
    title: string | null
    description: string | null
    authorId: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type MagazineCountAggregateOutputType = {
    id: number
    title: number
    description: number
    authorId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type MagazineMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MagazineMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type MagazineCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    authorId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type MagazineAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Magazine to aggregate.
     */
    where?: MagazineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Magazines to fetch.
     */
    orderBy?: MagazineOrderByWithRelationInput | MagazineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MagazineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Magazines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Magazines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Magazines
    **/
    _count?: true | MagazineCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MagazineMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MagazineMaxAggregateInputType
  }

  export type GetMagazineAggregateType<T extends MagazineAggregateArgs> = {
        [P in keyof T & keyof AggregateMagazine]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMagazine[P]>
      : GetScalarType<T[P], AggregateMagazine[P]>
  }




  export type MagazineGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MagazineWhereInput
    orderBy?: MagazineOrderByWithAggregationInput | MagazineOrderByWithAggregationInput[]
    by: MagazineScalarFieldEnum[] | MagazineScalarFieldEnum
    having?: MagazineScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MagazineCountAggregateInputType | true
    _min?: MagazineMinAggregateInputType
    _max?: MagazineMaxAggregateInputType
  }

  export type MagazineGroupByOutputType = {
    id: string
    title: string
    description: string | null
    authorId: string
    createdAt: Date
    updatedAt: Date
    _count: MagazineCountAggregateOutputType | null
    _min: MagazineMinAggregateOutputType | null
    _max: MagazineMaxAggregateOutputType | null
  }

  type GetMagazineGroupByPayload<T extends MagazineGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MagazineGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MagazineGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MagazineGroupByOutputType[P]>
            : GetScalarType<T[P], MagazineGroupByOutputType[P]>
        }
      >
    >


  export type MagazineSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    posts?: boolean | Magazine$postsArgs<ExtArgs>
    goods?: boolean | Magazine$goodsArgs<ExtArgs>
    _count?: boolean | MagazineCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["magazine"]>

  export type MagazineSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["magazine"]>

  export type MagazineSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["magazine"]>

  export type MagazineSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    authorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type MagazineOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "authorId" | "createdAt" | "updatedAt", ExtArgs["result"]["magazine"]>
  export type MagazineInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    posts?: boolean | Magazine$postsArgs<ExtArgs>
    goods?: boolean | Magazine$goodsArgs<ExtArgs>
    _count?: boolean | MagazineCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type MagazineIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type MagazineIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $MagazinePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Magazine"
    objects: {
      posts: Prisma.$PostPayload<ExtArgs>[]
      goods: Prisma.$GoodsPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      title: string
      description: string | null
      authorId: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["magazine"]>
    composites: {}
  }

  type MagazineGetPayload<S extends boolean | null | undefined | MagazineDefaultArgs> = $Result.GetResult<Prisma.$MagazinePayload, S>

  type MagazineCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MagazineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MagazineCountAggregateInputType | true
    }

  export interface MagazineDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Magazine'], meta: { name: 'Magazine' } }
    /**
     * Find zero or one Magazine that matches the filter.
     * @param {MagazineFindUniqueArgs} args - Arguments to find a Magazine
     * @example
     * // Get one Magazine
     * const magazine = await prisma.magazine.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MagazineFindUniqueArgs>(args: SelectSubset<T, MagazineFindUniqueArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Magazine that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MagazineFindUniqueOrThrowArgs} args - Arguments to find a Magazine
     * @example
     * // Get one Magazine
     * const magazine = await prisma.magazine.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MagazineFindUniqueOrThrowArgs>(args: SelectSubset<T, MagazineFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Magazine that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineFindFirstArgs} args - Arguments to find a Magazine
     * @example
     * // Get one Magazine
     * const magazine = await prisma.magazine.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MagazineFindFirstArgs>(args?: SelectSubset<T, MagazineFindFirstArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Magazine that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineFindFirstOrThrowArgs} args - Arguments to find a Magazine
     * @example
     * // Get one Magazine
     * const magazine = await prisma.magazine.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MagazineFindFirstOrThrowArgs>(args?: SelectSubset<T, MagazineFindFirstOrThrowArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Magazines that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Magazines
     * const magazines = await prisma.magazine.findMany()
     * 
     * // Get first 10 Magazines
     * const magazines = await prisma.magazine.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const magazineWithIdOnly = await prisma.magazine.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MagazineFindManyArgs>(args?: SelectSubset<T, MagazineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Magazine.
     * @param {MagazineCreateArgs} args - Arguments to create a Magazine.
     * @example
     * // Create one Magazine
     * const Magazine = await prisma.magazine.create({
     *   data: {
     *     // ... data to create a Magazine
     *   }
     * })
     * 
     */
    create<T extends MagazineCreateArgs>(args: SelectSubset<T, MagazineCreateArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Magazines.
     * @param {MagazineCreateManyArgs} args - Arguments to create many Magazines.
     * @example
     * // Create many Magazines
     * const magazine = await prisma.magazine.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MagazineCreateManyArgs>(args?: SelectSubset<T, MagazineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Magazines and returns the data saved in the database.
     * @param {MagazineCreateManyAndReturnArgs} args - Arguments to create many Magazines.
     * @example
     * // Create many Magazines
     * const magazine = await prisma.magazine.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Magazines and only return the `id`
     * const magazineWithIdOnly = await prisma.magazine.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MagazineCreateManyAndReturnArgs>(args?: SelectSubset<T, MagazineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Magazine.
     * @param {MagazineDeleteArgs} args - Arguments to delete one Magazine.
     * @example
     * // Delete one Magazine
     * const Magazine = await prisma.magazine.delete({
     *   where: {
     *     // ... filter to delete one Magazine
     *   }
     * })
     * 
     */
    delete<T extends MagazineDeleteArgs>(args: SelectSubset<T, MagazineDeleteArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Magazine.
     * @param {MagazineUpdateArgs} args - Arguments to update one Magazine.
     * @example
     * // Update one Magazine
     * const magazine = await prisma.magazine.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MagazineUpdateArgs>(args: SelectSubset<T, MagazineUpdateArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Magazines.
     * @param {MagazineDeleteManyArgs} args - Arguments to filter Magazines to delete.
     * @example
     * // Delete a few Magazines
     * const { count } = await prisma.magazine.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MagazineDeleteManyArgs>(args?: SelectSubset<T, MagazineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Magazines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Magazines
     * const magazine = await prisma.magazine.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MagazineUpdateManyArgs>(args: SelectSubset<T, MagazineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Magazines and returns the data updated in the database.
     * @param {MagazineUpdateManyAndReturnArgs} args - Arguments to update many Magazines.
     * @example
     * // Update many Magazines
     * const magazine = await prisma.magazine.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Magazines and only return the `id`
     * const magazineWithIdOnly = await prisma.magazine.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MagazineUpdateManyAndReturnArgs>(args: SelectSubset<T, MagazineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Magazine.
     * @param {MagazineUpsertArgs} args - Arguments to update or create a Magazine.
     * @example
     * // Update or create a Magazine
     * const magazine = await prisma.magazine.upsert({
     *   create: {
     *     // ... data to create a Magazine
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Magazine we want to update
     *   }
     * })
     */
    upsert<T extends MagazineUpsertArgs>(args: SelectSubset<T, MagazineUpsertArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Magazines.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineCountArgs} args - Arguments to filter Magazines to count.
     * @example
     * // Count the number of Magazines
     * const count = await prisma.magazine.count({
     *   where: {
     *     // ... the filter for the Magazines we want to count
     *   }
     * })
    **/
    count<T extends MagazineCountArgs>(
      args?: Subset<T, MagazineCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MagazineCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Magazine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MagazineAggregateArgs>(args: Subset<T, MagazineAggregateArgs>): Prisma.PrismaPromise<GetMagazineAggregateType<T>>

    /**
     * Group by Magazine.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MagazineGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MagazineGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MagazineGroupByArgs['orderBy'] }
        : { orderBy?: MagazineGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MagazineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMagazineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Magazine model
   */
  readonly fields: MagazineFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Magazine.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MagazineClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    posts<T extends Magazine$postsArgs<ExtArgs> = {}>(args?: Subset<T, Magazine$postsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    goods<T extends Magazine$goodsArgs<ExtArgs> = {}>(args?: Subset<T, Magazine$goodsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Magazine model
   */
  interface MagazineFieldRefs {
    readonly id: FieldRef<"Magazine", 'String'>
    readonly title: FieldRef<"Magazine", 'String'>
    readonly description: FieldRef<"Magazine", 'String'>
    readonly authorId: FieldRef<"Magazine", 'String'>
    readonly createdAt: FieldRef<"Magazine", 'DateTime'>
    readonly updatedAt: FieldRef<"Magazine", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Magazine findUnique
   */
  export type MagazineFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter, which Magazine to fetch.
     */
    where: MagazineWhereUniqueInput
  }

  /**
   * Magazine findUniqueOrThrow
   */
  export type MagazineFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter, which Magazine to fetch.
     */
    where: MagazineWhereUniqueInput
  }

  /**
   * Magazine findFirst
   */
  export type MagazineFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter, which Magazine to fetch.
     */
    where?: MagazineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Magazines to fetch.
     */
    orderBy?: MagazineOrderByWithRelationInput | MagazineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Magazines.
     */
    cursor?: MagazineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Magazines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Magazines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Magazines.
     */
    distinct?: MagazineScalarFieldEnum | MagazineScalarFieldEnum[]
  }

  /**
   * Magazine findFirstOrThrow
   */
  export type MagazineFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter, which Magazine to fetch.
     */
    where?: MagazineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Magazines to fetch.
     */
    orderBy?: MagazineOrderByWithRelationInput | MagazineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Magazines.
     */
    cursor?: MagazineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Magazines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Magazines.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Magazines.
     */
    distinct?: MagazineScalarFieldEnum | MagazineScalarFieldEnum[]
  }

  /**
   * Magazine findMany
   */
  export type MagazineFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter, which Magazines to fetch.
     */
    where?: MagazineWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Magazines to fetch.
     */
    orderBy?: MagazineOrderByWithRelationInput | MagazineOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Magazines.
     */
    cursor?: MagazineWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Magazines from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Magazines.
     */
    skip?: number
    distinct?: MagazineScalarFieldEnum | MagazineScalarFieldEnum[]
  }

  /**
   * Magazine create
   */
  export type MagazineCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * The data needed to create a Magazine.
     */
    data: XOR<MagazineCreateInput, MagazineUncheckedCreateInput>
  }

  /**
   * Magazine createMany
   */
  export type MagazineCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Magazines.
     */
    data: MagazineCreateManyInput | MagazineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Magazine createManyAndReturn
   */
  export type MagazineCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * The data used to create many Magazines.
     */
    data: MagazineCreateManyInput | MagazineCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Magazine update
   */
  export type MagazineUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * The data needed to update a Magazine.
     */
    data: XOR<MagazineUpdateInput, MagazineUncheckedUpdateInput>
    /**
     * Choose, which Magazine to update.
     */
    where: MagazineWhereUniqueInput
  }

  /**
   * Magazine updateMany
   */
  export type MagazineUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Magazines.
     */
    data: XOR<MagazineUpdateManyMutationInput, MagazineUncheckedUpdateManyInput>
    /**
     * Filter which Magazines to update
     */
    where?: MagazineWhereInput
    /**
     * Limit how many Magazines to update.
     */
    limit?: number
  }

  /**
   * Magazine updateManyAndReturn
   */
  export type MagazineUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * The data used to update Magazines.
     */
    data: XOR<MagazineUpdateManyMutationInput, MagazineUncheckedUpdateManyInput>
    /**
     * Filter which Magazines to update
     */
    where?: MagazineWhereInput
    /**
     * Limit how many Magazines to update.
     */
    limit?: number
  }

  /**
   * Magazine upsert
   */
  export type MagazineUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * The filter to search for the Magazine to update in case it exists.
     */
    where: MagazineWhereUniqueInput
    /**
     * In case the Magazine found by the `where` argument doesn't exist, create a new Magazine with this data.
     */
    create: XOR<MagazineCreateInput, MagazineUncheckedCreateInput>
    /**
     * In case the Magazine was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MagazineUpdateInput, MagazineUncheckedUpdateInput>
  }

  /**
   * Magazine delete
   */
  export type MagazineDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
    /**
     * Filter which Magazine to delete.
     */
    where: MagazineWhereUniqueInput
  }

  /**
   * Magazine deleteMany
   */
  export type MagazineDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Magazines to delete
     */
    where?: MagazineWhereInput
    /**
     * Limit how many Magazines to delete.
     */
    limit?: number
  }

  /**
   * Magazine.posts
   */
  export type Magazine$postsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    where?: PostWhereInput
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    cursor?: PostWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Magazine.goods
   */
  export type Magazine$goodsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    where?: GoodsWhereInput
    orderBy?: GoodsOrderByWithRelationInput | GoodsOrderByWithRelationInput[]
    cursor?: GoodsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GoodsScalarFieldEnum | GoodsScalarFieldEnum[]
  }

  /**
   * Magazine without action
   */
  export type MagazineDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Magazine
     */
    select?: MagazineSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Magazine
     */
    omit?: MagazineOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MagazineInclude<ExtArgs> | null
  }


  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostMinAggregateOutputType = {
    id: string | null
    magazineId: string | null
    title: string | null
    content: string | null
    published: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: string | null
    magazineId: string | null
    title: string | null
    content: string | null
    published: boolean | null
    publishedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    magazineId: number
    title: number
    content: number
    published: number
    publishedAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PostMinAggregateInputType = {
    id?: true
    magazineId?: true
    title?: true
    content?: true
    published?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    magazineId?: true
    title?: true
    content?: true
    published?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    magazineId?: true
    title?: true
    content?: true
    published?: true
    publishedAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: string
    magazineId: string
    title: string
    content: string
    published: boolean
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: PostCountAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    magazineId?: boolean
    title?: boolean
    content?: boolean
    published?: boolean
    publishedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "magazineId" | "title" | "content" | "published" | "publishedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      magazine: Prisma.$MagazinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      magazineId: string
      title: string
      content: string
      published: boolean
      publishedAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    magazine<T extends MagazineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MagazineDefaultArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'String'>
    readonly magazineId: FieldRef<"Post", 'String'>
    readonly title: FieldRef<"Post", 'String'>
    readonly content: FieldRef<"Post", 'String'>
    readonly published: FieldRef<"Post", 'Boolean'>
    readonly publishedAt: FieldRef<"Post", 'DateTime'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly updatedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model Goods
   */

  export type AggregateGoods = {
    _count: GoodsCountAggregateOutputType | null
    _avg: GoodsAvgAggregateOutputType | null
    _sum: GoodsSumAggregateOutputType | null
    _min: GoodsMinAggregateOutputType | null
    _max: GoodsMaxAggregateOutputType | null
  }

  export type GoodsAvgAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type GoodsSumAggregateOutputType = {
    price: number | null
    stock: number | null
  }

  export type GoodsMinAggregateOutputType = {
    id: string | null
    magazineId: string | null
    name: string | null
    description: string | null
    price: number | null
    stock: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoodsMaxAggregateOutputType = {
    id: string | null
    magazineId: string | null
    name: string | null
    description: string | null
    price: number | null
    stock: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoodsCountAggregateOutputType = {
    id: number
    magazineId: number
    name: number
    description: number
    price: number
    stock: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoodsAvgAggregateInputType = {
    price?: true
    stock?: true
  }

  export type GoodsSumAggregateInputType = {
    price?: true
    stock?: true
  }

  export type GoodsMinAggregateInputType = {
    id?: true
    magazineId?: true
    name?: true
    description?: true
    price?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoodsMaxAggregateInputType = {
    id?: true
    magazineId?: true
    name?: true
    description?: true
    price?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoodsCountAggregateInputType = {
    id?: true
    magazineId?: true
    name?: true
    description?: true
    price?: true
    stock?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoodsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goods to aggregate.
     */
    where?: GoodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goods to fetch.
     */
    orderBy?: GoodsOrderByWithRelationInput | GoodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Goods
    **/
    _count?: true | GoodsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GoodsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GoodsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoodsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoodsMaxAggregateInputType
  }

  export type GetGoodsAggregateType<T extends GoodsAggregateArgs> = {
        [P in keyof T & keyof AggregateGoods]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoods[P]>
      : GetScalarType<T[P], AggregateGoods[P]>
  }




  export type GoodsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoodsWhereInput
    orderBy?: GoodsOrderByWithAggregationInput | GoodsOrderByWithAggregationInput[]
    by: GoodsScalarFieldEnum[] | GoodsScalarFieldEnum
    having?: GoodsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoodsCountAggregateInputType | true
    _avg?: GoodsAvgAggregateInputType
    _sum?: GoodsSumAggregateInputType
    _min?: GoodsMinAggregateInputType
    _max?: GoodsMaxAggregateInputType
  }

  export type GoodsGroupByOutputType = {
    id: string
    magazineId: string
    name: string
    description: string | null
    price: number
    stock: number | null
    createdAt: Date
    updatedAt: Date
    _count: GoodsCountAggregateOutputType | null
    _avg: GoodsAvgAggregateOutputType | null
    _sum: GoodsSumAggregateOutputType | null
    _min: GoodsMinAggregateOutputType | null
    _max: GoodsMaxAggregateOutputType | null
  }

  type GetGoodsGroupByPayload<T extends GoodsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoodsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoodsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoodsGroupByOutputType[P]>
            : GetScalarType<T[P], GoodsGroupByOutputType[P]>
        }
      >
    >


  export type GoodsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goods"]>

  export type GoodsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goods"]>

  export type GoodsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    magazineId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goods"]>

  export type GoodsSelectScalar = {
    id?: boolean
    magazineId?: boolean
    name?: boolean
    description?: boolean
    price?: boolean
    stock?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoodsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "magazineId" | "name" | "description" | "price" | "stock" | "createdAt" | "updatedAt", ExtArgs["result"]["goods"]>
  export type GoodsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }
  export type GoodsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }
  export type GoodsIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    magazine?: boolean | MagazineDefaultArgs<ExtArgs>
  }

  export type $GoodsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Goods"
    objects: {
      magazine: Prisma.$MagazinePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      magazineId: string
      name: string
      description: string | null
      price: number
      stock: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["goods"]>
    composites: {}
  }

  type GoodsGetPayload<S extends boolean | null | undefined | GoodsDefaultArgs> = $Result.GetResult<Prisma.$GoodsPayload, S>

  type GoodsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GoodsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GoodsCountAggregateInputType | true
    }

  export interface GoodsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Goods'], meta: { name: 'Goods' } }
    /**
     * Find zero or one Goods that matches the filter.
     * @param {GoodsFindUniqueArgs} args - Arguments to find a Goods
     * @example
     * // Get one Goods
     * const goods = await prisma.goods.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoodsFindUniqueArgs>(args: SelectSubset<T, GoodsFindUniqueArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Goods that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GoodsFindUniqueOrThrowArgs} args - Arguments to find a Goods
     * @example
     * // Get one Goods
     * const goods = await prisma.goods.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoodsFindUniqueOrThrowArgs>(args: SelectSubset<T, GoodsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Goods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsFindFirstArgs} args - Arguments to find a Goods
     * @example
     * // Get one Goods
     * const goods = await prisma.goods.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoodsFindFirstArgs>(args?: SelectSubset<T, GoodsFindFirstArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Goods that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsFindFirstOrThrowArgs} args - Arguments to find a Goods
     * @example
     * // Get one Goods
     * const goods = await prisma.goods.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoodsFindFirstOrThrowArgs>(args?: SelectSubset<T, GoodsFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Goods that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Goods
     * const goods = await prisma.goods.findMany()
     * 
     * // Get first 10 Goods
     * const goods = await prisma.goods.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goodsWithIdOnly = await prisma.goods.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoodsFindManyArgs>(args?: SelectSubset<T, GoodsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Goods.
     * @param {GoodsCreateArgs} args - Arguments to create a Goods.
     * @example
     * // Create one Goods
     * const Goods = await prisma.goods.create({
     *   data: {
     *     // ... data to create a Goods
     *   }
     * })
     * 
     */
    create<T extends GoodsCreateArgs>(args: SelectSubset<T, GoodsCreateArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Goods.
     * @param {GoodsCreateManyArgs} args - Arguments to create many Goods.
     * @example
     * // Create many Goods
     * const goods = await prisma.goods.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoodsCreateManyArgs>(args?: SelectSubset<T, GoodsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Goods and returns the data saved in the database.
     * @param {GoodsCreateManyAndReturnArgs} args - Arguments to create many Goods.
     * @example
     * // Create many Goods
     * const goods = await prisma.goods.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Goods and only return the `id`
     * const goodsWithIdOnly = await prisma.goods.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GoodsCreateManyAndReturnArgs>(args?: SelectSubset<T, GoodsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Goods.
     * @param {GoodsDeleteArgs} args - Arguments to delete one Goods.
     * @example
     * // Delete one Goods
     * const Goods = await prisma.goods.delete({
     *   where: {
     *     // ... filter to delete one Goods
     *   }
     * })
     * 
     */
    delete<T extends GoodsDeleteArgs>(args: SelectSubset<T, GoodsDeleteArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Goods.
     * @param {GoodsUpdateArgs} args - Arguments to update one Goods.
     * @example
     * // Update one Goods
     * const goods = await prisma.goods.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoodsUpdateArgs>(args: SelectSubset<T, GoodsUpdateArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Goods.
     * @param {GoodsDeleteManyArgs} args - Arguments to filter Goods to delete.
     * @example
     * // Delete a few Goods
     * const { count } = await prisma.goods.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoodsDeleteManyArgs>(args?: SelectSubset<T, GoodsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Goods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Goods
     * const goods = await prisma.goods.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoodsUpdateManyArgs>(args: SelectSubset<T, GoodsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Goods and returns the data updated in the database.
     * @param {GoodsUpdateManyAndReturnArgs} args - Arguments to update many Goods.
     * @example
     * // Update many Goods
     * const goods = await prisma.goods.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Goods and only return the `id`
     * const goodsWithIdOnly = await prisma.goods.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GoodsUpdateManyAndReturnArgs>(args: SelectSubset<T, GoodsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Goods.
     * @param {GoodsUpsertArgs} args - Arguments to update or create a Goods.
     * @example
     * // Update or create a Goods
     * const goods = await prisma.goods.upsert({
     *   create: {
     *     // ... data to create a Goods
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Goods we want to update
     *   }
     * })
     */
    upsert<T extends GoodsUpsertArgs>(args: SelectSubset<T, GoodsUpsertArgs<ExtArgs>>): Prisma__GoodsClient<$Result.GetResult<Prisma.$GoodsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Goods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsCountArgs} args - Arguments to filter Goods to count.
     * @example
     * // Count the number of Goods
     * const count = await prisma.goods.count({
     *   where: {
     *     // ... the filter for the Goods we want to count
     *   }
     * })
    **/
    count<T extends GoodsCountArgs>(
      args?: Subset<T, GoodsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoodsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Goods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GoodsAggregateArgs>(args: Subset<T, GoodsAggregateArgs>): Prisma.PrismaPromise<GetGoodsAggregateType<T>>

    /**
     * Group by Goods.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoodsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GoodsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoodsGroupByArgs['orderBy'] }
        : { orderBy?: GoodsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GoodsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoodsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Goods model
   */
  readonly fields: GoodsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Goods.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoodsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    magazine<T extends MagazineDefaultArgs<ExtArgs> = {}>(args?: Subset<T, MagazineDefaultArgs<ExtArgs>>): Prisma__MagazineClient<$Result.GetResult<Prisma.$MagazinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Goods model
   */
  interface GoodsFieldRefs {
    readonly id: FieldRef<"Goods", 'String'>
    readonly magazineId: FieldRef<"Goods", 'String'>
    readonly name: FieldRef<"Goods", 'String'>
    readonly description: FieldRef<"Goods", 'String'>
    readonly price: FieldRef<"Goods", 'Int'>
    readonly stock: FieldRef<"Goods", 'Int'>
    readonly createdAt: FieldRef<"Goods", 'DateTime'>
    readonly updatedAt: FieldRef<"Goods", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Goods findUnique
   */
  export type GoodsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter, which Goods to fetch.
     */
    where: GoodsWhereUniqueInput
  }

  /**
   * Goods findUniqueOrThrow
   */
  export type GoodsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter, which Goods to fetch.
     */
    where: GoodsWhereUniqueInput
  }

  /**
   * Goods findFirst
   */
  export type GoodsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter, which Goods to fetch.
     */
    where?: GoodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goods to fetch.
     */
    orderBy?: GoodsOrderByWithRelationInput | GoodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goods.
     */
    cursor?: GoodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goods.
     */
    distinct?: GoodsScalarFieldEnum | GoodsScalarFieldEnum[]
  }

  /**
   * Goods findFirstOrThrow
   */
  export type GoodsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter, which Goods to fetch.
     */
    where?: GoodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goods to fetch.
     */
    orderBy?: GoodsOrderByWithRelationInput | GoodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goods.
     */
    cursor?: GoodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goods.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goods.
     */
    distinct?: GoodsScalarFieldEnum | GoodsScalarFieldEnum[]
  }

  /**
   * Goods findMany
   */
  export type GoodsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter, which Goods to fetch.
     */
    where?: GoodsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goods to fetch.
     */
    orderBy?: GoodsOrderByWithRelationInput | GoodsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Goods.
     */
    cursor?: GoodsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goods from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goods.
     */
    skip?: number
    distinct?: GoodsScalarFieldEnum | GoodsScalarFieldEnum[]
  }

  /**
   * Goods create
   */
  export type GoodsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * The data needed to create a Goods.
     */
    data: XOR<GoodsCreateInput, GoodsUncheckedCreateInput>
  }

  /**
   * Goods createMany
   */
  export type GoodsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Goods.
     */
    data: GoodsCreateManyInput | GoodsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Goods createManyAndReturn
   */
  export type GoodsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * The data used to create many Goods.
     */
    data: GoodsCreateManyInput | GoodsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Goods update
   */
  export type GoodsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * The data needed to update a Goods.
     */
    data: XOR<GoodsUpdateInput, GoodsUncheckedUpdateInput>
    /**
     * Choose, which Goods to update.
     */
    where: GoodsWhereUniqueInput
  }

  /**
   * Goods updateMany
   */
  export type GoodsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Goods.
     */
    data: XOR<GoodsUpdateManyMutationInput, GoodsUncheckedUpdateManyInput>
    /**
     * Filter which Goods to update
     */
    where?: GoodsWhereInput
    /**
     * Limit how many Goods to update.
     */
    limit?: number
  }

  /**
   * Goods updateManyAndReturn
   */
  export type GoodsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * The data used to update Goods.
     */
    data: XOR<GoodsUpdateManyMutationInput, GoodsUncheckedUpdateManyInput>
    /**
     * Filter which Goods to update
     */
    where?: GoodsWhereInput
    /**
     * Limit how many Goods to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Goods upsert
   */
  export type GoodsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * The filter to search for the Goods to update in case it exists.
     */
    where: GoodsWhereUniqueInput
    /**
     * In case the Goods found by the `where` argument doesn't exist, create a new Goods with this data.
     */
    create: XOR<GoodsCreateInput, GoodsUncheckedCreateInput>
    /**
     * In case the Goods was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoodsUpdateInput, GoodsUncheckedUpdateInput>
  }

  /**
   * Goods delete
   */
  export type GoodsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
    /**
     * Filter which Goods to delete.
     */
    where: GoodsWhereUniqueInput
  }

  /**
   * Goods deleteMany
   */
  export type GoodsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goods to delete
     */
    where?: GoodsWhereInput
    /**
     * Limit how many Goods to delete.
     */
    limit?: number
  }

  /**
   * Goods without action
   */
  export type GoodsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goods
     */
    select?: GoodsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Goods
     */
    omit?: GoodsOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoodsInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const MagazineScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    authorId: 'authorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type MagazineScalarFieldEnum = (typeof MagazineScalarFieldEnum)[keyof typeof MagazineScalarFieldEnum]


  export const PostScalarFieldEnum: {
    id: 'id',
    magazineId: 'magazineId',
    title: 'title',
    content: 'content',
    published: 'published',
    publishedAt: 'publishedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const GoodsScalarFieldEnum: {
    id: 'id',
    magazineId: 'magazineId',
    name: 'name',
    description: 'description',
    price: 'price',
    stock: 'stock',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GoodsScalarFieldEnum = (typeof GoodsScalarFieldEnum)[keyof typeof GoodsScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type MagazineWhereInput = {
    AND?: MagazineWhereInput | MagazineWhereInput[]
    OR?: MagazineWhereInput[]
    NOT?: MagazineWhereInput | MagazineWhereInput[]
    id?: StringFilter<"Magazine"> | string
    title?: StringFilter<"Magazine"> | string
    description?: StringNullableFilter<"Magazine"> | string | null
    authorId?: StringFilter<"Magazine"> | string
    createdAt?: DateTimeFilter<"Magazine"> | Date | string
    updatedAt?: DateTimeFilter<"Magazine"> | Date | string
    posts?: PostListRelationFilter
    goods?: GoodsListRelationFilter
  }

  export type MagazineOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    posts?: PostOrderByRelationAggregateInput
    goods?: GoodsOrderByRelationAggregateInput
  }

  export type MagazineWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MagazineWhereInput | MagazineWhereInput[]
    OR?: MagazineWhereInput[]
    NOT?: MagazineWhereInput | MagazineWhereInput[]
    title?: StringFilter<"Magazine"> | string
    description?: StringNullableFilter<"Magazine"> | string | null
    authorId?: StringFilter<"Magazine"> | string
    createdAt?: DateTimeFilter<"Magazine"> | Date | string
    updatedAt?: DateTimeFilter<"Magazine"> | Date | string
    posts?: PostListRelationFilter
    goods?: GoodsListRelationFilter
  }, "id">

  export type MagazineOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrderInput | SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: MagazineCountOrderByAggregateInput
    _max?: MagazineMaxOrderByAggregateInput
    _min?: MagazineMinOrderByAggregateInput
  }

  export type MagazineScalarWhereWithAggregatesInput = {
    AND?: MagazineScalarWhereWithAggregatesInput | MagazineScalarWhereWithAggregatesInput[]
    OR?: MagazineScalarWhereWithAggregatesInput[]
    NOT?: MagazineScalarWhereWithAggregatesInput | MagazineScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Magazine"> | string
    title?: StringWithAggregatesFilter<"Magazine"> | string
    description?: StringNullableWithAggregatesFilter<"Magazine"> | string | null
    authorId?: StringWithAggregatesFilter<"Magazine"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Magazine"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Magazine"> | Date | string
  }

  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: StringFilter<"Post"> | string
    magazineId?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    published?: BoolFilter<"Post"> | boolean
    publishedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    magazine?: XOR<MagazineScalarRelationFilter, MagazineWhereInput>
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    magazineId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    magazine?: MagazineOrderByWithRelationInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    magazineId?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    published?: BoolFilter<"Post"> | boolean
    publishedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
    magazine?: XOR<MagazineScalarRelationFilter, MagazineWhereInput>
  }, "id">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    magazineId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Post"> | string
    magazineId?: StringWithAggregatesFilter<"Post"> | string
    title?: StringWithAggregatesFilter<"Post"> | string
    content?: StringWithAggregatesFilter<"Post"> | string
    published?: BoolWithAggregatesFilter<"Post"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type GoodsWhereInput = {
    AND?: GoodsWhereInput | GoodsWhereInput[]
    OR?: GoodsWhereInput[]
    NOT?: GoodsWhereInput | GoodsWhereInput[]
    id?: StringFilter<"Goods"> | string
    magazineId?: StringFilter<"Goods"> | string
    name?: StringFilter<"Goods"> | string
    description?: StringNullableFilter<"Goods"> | string | null
    price?: IntFilter<"Goods"> | number
    stock?: IntNullableFilter<"Goods"> | number | null
    createdAt?: DateTimeFilter<"Goods"> | Date | string
    updatedAt?: DateTimeFilter<"Goods"> | Date | string
    magazine?: XOR<MagazineScalarRelationFilter, MagazineWhereInput>
  }

  export type GoodsOrderByWithRelationInput = {
    id?: SortOrder
    magazineId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    magazine?: MagazineOrderByWithRelationInput
  }

  export type GoodsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GoodsWhereInput | GoodsWhereInput[]
    OR?: GoodsWhereInput[]
    NOT?: GoodsWhereInput | GoodsWhereInput[]
    magazineId?: StringFilter<"Goods"> | string
    name?: StringFilter<"Goods"> | string
    description?: StringNullableFilter<"Goods"> | string | null
    price?: IntFilter<"Goods"> | number
    stock?: IntNullableFilter<"Goods"> | number | null
    createdAt?: DateTimeFilter<"Goods"> | Date | string
    updatedAt?: DateTimeFilter<"Goods"> | Date | string
    magazine?: XOR<MagazineScalarRelationFilter, MagazineWhereInput>
  }, "id">

  export type GoodsOrderByWithAggregationInput = {
    id?: SortOrder
    magazineId?: SortOrder
    name?: SortOrder
    description?: SortOrderInput | SortOrder
    price?: SortOrder
    stock?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoodsCountOrderByAggregateInput
    _avg?: GoodsAvgOrderByAggregateInput
    _max?: GoodsMaxOrderByAggregateInput
    _min?: GoodsMinOrderByAggregateInput
    _sum?: GoodsSumOrderByAggregateInput
  }

  export type GoodsScalarWhereWithAggregatesInput = {
    AND?: GoodsScalarWhereWithAggregatesInput | GoodsScalarWhereWithAggregatesInput[]
    OR?: GoodsScalarWhereWithAggregatesInput[]
    NOT?: GoodsScalarWhereWithAggregatesInput | GoodsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Goods"> | string
    magazineId?: StringWithAggregatesFilter<"Goods"> | string
    name?: StringWithAggregatesFilter<"Goods"> | string
    description?: StringNullableWithAggregatesFilter<"Goods"> | string | null
    price?: IntWithAggregatesFilter<"Goods"> | number
    stock?: IntNullableWithAggregatesFilter<"Goods"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Goods"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Goods"> | Date | string
  }

  export type MagazineCreateInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutMagazineInput
    goods?: GoodsCreateNestedManyWithoutMagazineInput
  }

  export type MagazineUncheckedCreateInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutMagazineInput
    goods?: GoodsUncheckedCreateNestedManyWithoutMagazineInput
  }

  export type MagazineUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutMagazineNestedInput
    goods?: GoodsUpdateManyWithoutMagazineNestedInput
  }

  export type MagazineUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutMagazineNestedInput
    goods?: GoodsUncheckedUpdateManyWithoutMagazineNestedInput
  }

  export type MagazineCreateManyInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MagazineUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MagazineUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    magazine: MagazineCreateNestedOneWithoutPostsInput
  }

  export type PostUncheckedCreateInput = {
    id?: string
    magazineId: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    magazine?: MagazineUpdateOneRequiredWithoutPostsNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    magazineId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostCreateManyInput = {
    id?: string
    magazineId: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    magazineId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsCreateInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    magazine: MagazineCreateNestedOneWithoutGoodsInput
  }

  export type GoodsUncheckedCreateInput = {
    id?: string
    magazineId: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    magazine?: MagazineUpdateOneRequiredWithoutGoodsNestedInput
  }

  export type GoodsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    magazineId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsCreateManyInput = {
    id?: string
    magazineId: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    magazineId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PostListRelationFilter = {
    every?: PostWhereInput
    some?: PostWhereInput
    none?: PostWhereInput
  }

  export type GoodsListRelationFilter = {
    every?: GoodsWhereInput
    some?: GoodsWhereInput
    none?: GoodsWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PostOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoodsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MagazineCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MagazineMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type MagazineMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    authorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type MagazineScalarRelationFilter = {
    is?: MagazineWhereInput
    isNot?: MagazineWhereInput
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    title?: SortOrder
    content?: SortOrder
    published?: SortOrder
    publishedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type GoodsCountOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsAvgOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type GoodsMaxOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsMinOrderByAggregateInput = {
    id?: SortOrder
    magazineId?: SortOrder
    name?: SortOrder
    description?: SortOrder
    price?: SortOrder
    stock?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoodsSumOrderByAggregateInput = {
    price?: SortOrder
    stock?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type PostCreateNestedManyWithoutMagazineInput = {
    create?: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput> | PostCreateWithoutMagazineInput[] | PostUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: PostCreateOrConnectWithoutMagazineInput | PostCreateOrConnectWithoutMagazineInput[]
    createMany?: PostCreateManyMagazineInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type GoodsCreateNestedManyWithoutMagazineInput = {
    create?: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput> | GoodsCreateWithoutMagazineInput[] | GoodsUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: GoodsCreateOrConnectWithoutMagazineInput | GoodsCreateOrConnectWithoutMagazineInput[]
    createMany?: GoodsCreateManyMagazineInputEnvelope
    connect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
  }

  export type PostUncheckedCreateNestedManyWithoutMagazineInput = {
    create?: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput> | PostCreateWithoutMagazineInput[] | PostUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: PostCreateOrConnectWithoutMagazineInput | PostCreateOrConnectWithoutMagazineInput[]
    createMany?: PostCreateManyMagazineInputEnvelope
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
  }

  export type GoodsUncheckedCreateNestedManyWithoutMagazineInput = {
    create?: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput> | GoodsCreateWithoutMagazineInput[] | GoodsUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: GoodsCreateOrConnectWithoutMagazineInput | GoodsCreateOrConnectWithoutMagazineInput[]
    createMany?: GoodsCreateManyMagazineInputEnvelope
    connect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PostUpdateManyWithoutMagazineNestedInput = {
    create?: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput> | PostCreateWithoutMagazineInput[] | PostUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: PostCreateOrConnectWithoutMagazineInput | PostCreateOrConnectWithoutMagazineInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutMagazineInput | PostUpsertWithWhereUniqueWithoutMagazineInput[]
    createMany?: PostCreateManyMagazineInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutMagazineInput | PostUpdateWithWhereUniqueWithoutMagazineInput[]
    updateMany?: PostUpdateManyWithWhereWithoutMagazineInput | PostUpdateManyWithWhereWithoutMagazineInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type GoodsUpdateManyWithoutMagazineNestedInput = {
    create?: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput> | GoodsCreateWithoutMagazineInput[] | GoodsUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: GoodsCreateOrConnectWithoutMagazineInput | GoodsCreateOrConnectWithoutMagazineInput[]
    upsert?: GoodsUpsertWithWhereUniqueWithoutMagazineInput | GoodsUpsertWithWhereUniqueWithoutMagazineInput[]
    createMany?: GoodsCreateManyMagazineInputEnvelope
    set?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    disconnect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    delete?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    connect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    update?: GoodsUpdateWithWhereUniqueWithoutMagazineInput | GoodsUpdateWithWhereUniqueWithoutMagazineInput[]
    updateMany?: GoodsUpdateManyWithWhereWithoutMagazineInput | GoodsUpdateManyWithWhereWithoutMagazineInput[]
    deleteMany?: GoodsScalarWhereInput | GoodsScalarWhereInput[]
  }

  export type PostUncheckedUpdateManyWithoutMagazineNestedInput = {
    create?: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput> | PostCreateWithoutMagazineInput[] | PostUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: PostCreateOrConnectWithoutMagazineInput | PostCreateOrConnectWithoutMagazineInput[]
    upsert?: PostUpsertWithWhereUniqueWithoutMagazineInput | PostUpsertWithWhereUniqueWithoutMagazineInput[]
    createMany?: PostCreateManyMagazineInputEnvelope
    set?: PostWhereUniqueInput | PostWhereUniqueInput[]
    disconnect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    delete?: PostWhereUniqueInput | PostWhereUniqueInput[]
    connect?: PostWhereUniqueInput | PostWhereUniqueInput[]
    update?: PostUpdateWithWhereUniqueWithoutMagazineInput | PostUpdateWithWhereUniqueWithoutMagazineInput[]
    updateMany?: PostUpdateManyWithWhereWithoutMagazineInput | PostUpdateManyWithWhereWithoutMagazineInput[]
    deleteMany?: PostScalarWhereInput | PostScalarWhereInput[]
  }

  export type GoodsUncheckedUpdateManyWithoutMagazineNestedInput = {
    create?: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput> | GoodsCreateWithoutMagazineInput[] | GoodsUncheckedCreateWithoutMagazineInput[]
    connectOrCreate?: GoodsCreateOrConnectWithoutMagazineInput | GoodsCreateOrConnectWithoutMagazineInput[]
    upsert?: GoodsUpsertWithWhereUniqueWithoutMagazineInput | GoodsUpsertWithWhereUniqueWithoutMagazineInput[]
    createMany?: GoodsCreateManyMagazineInputEnvelope
    set?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    disconnect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    delete?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    connect?: GoodsWhereUniqueInput | GoodsWhereUniqueInput[]
    update?: GoodsUpdateWithWhereUniqueWithoutMagazineInput | GoodsUpdateWithWhereUniqueWithoutMagazineInput[]
    updateMany?: GoodsUpdateManyWithWhereWithoutMagazineInput | GoodsUpdateManyWithWhereWithoutMagazineInput[]
    deleteMany?: GoodsScalarWhereInput | GoodsScalarWhereInput[]
  }

  export type MagazineCreateNestedOneWithoutPostsInput = {
    create?: XOR<MagazineCreateWithoutPostsInput, MagazineUncheckedCreateWithoutPostsInput>
    connectOrCreate?: MagazineCreateOrConnectWithoutPostsInput
    connect?: MagazineWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type MagazineUpdateOneRequiredWithoutPostsNestedInput = {
    create?: XOR<MagazineCreateWithoutPostsInput, MagazineUncheckedCreateWithoutPostsInput>
    connectOrCreate?: MagazineCreateOrConnectWithoutPostsInput
    upsert?: MagazineUpsertWithoutPostsInput
    connect?: MagazineWhereUniqueInput
    update?: XOR<XOR<MagazineUpdateToOneWithWhereWithoutPostsInput, MagazineUpdateWithoutPostsInput>, MagazineUncheckedUpdateWithoutPostsInput>
  }

  export type MagazineCreateNestedOneWithoutGoodsInput = {
    create?: XOR<MagazineCreateWithoutGoodsInput, MagazineUncheckedCreateWithoutGoodsInput>
    connectOrCreate?: MagazineCreateOrConnectWithoutGoodsInput
    connect?: MagazineWhereUniqueInput
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type MagazineUpdateOneRequiredWithoutGoodsNestedInput = {
    create?: XOR<MagazineCreateWithoutGoodsInput, MagazineUncheckedCreateWithoutGoodsInput>
    connectOrCreate?: MagazineCreateOrConnectWithoutGoodsInput
    upsert?: MagazineUpsertWithoutGoodsInput
    connect?: MagazineWhereUniqueInput
    update?: XOR<XOR<MagazineUpdateToOneWithWhereWithoutGoodsInput, MagazineUpdateWithoutGoodsInput>, MagazineUncheckedUpdateWithoutGoodsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type PostCreateWithoutMagazineInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUncheckedCreateWithoutMagazineInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostCreateOrConnectWithoutMagazineInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput>
  }

  export type PostCreateManyMagazineInputEnvelope = {
    data: PostCreateManyMagazineInput | PostCreateManyMagazineInput[]
    skipDuplicates?: boolean
  }

  export type GoodsCreateWithoutMagazineInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsUncheckedCreateWithoutMagazineInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsCreateOrConnectWithoutMagazineInput = {
    where: GoodsWhereUniqueInput
    create: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput>
  }

  export type GoodsCreateManyMagazineInputEnvelope = {
    data: GoodsCreateManyMagazineInput | GoodsCreateManyMagazineInput[]
    skipDuplicates?: boolean
  }

  export type PostUpsertWithWhereUniqueWithoutMagazineInput = {
    where: PostWhereUniqueInput
    update: XOR<PostUpdateWithoutMagazineInput, PostUncheckedUpdateWithoutMagazineInput>
    create: XOR<PostCreateWithoutMagazineInput, PostUncheckedCreateWithoutMagazineInput>
  }

  export type PostUpdateWithWhereUniqueWithoutMagazineInput = {
    where: PostWhereUniqueInput
    data: XOR<PostUpdateWithoutMagazineInput, PostUncheckedUpdateWithoutMagazineInput>
  }

  export type PostUpdateManyWithWhereWithoutMagazineInput = {
    where: PostScalarWhereInput
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyWithoutMagazineInput>
  }

  export type PostScalarWhereInput = {
    AND?: PostScalarWhereInput | PostScalarWhereInput[]
    OR?: PostScalarWhereInput[]
    NOT?: PostScalarWhereInput | PostScalarWhereInput[]
    id?: StringFilter<"Post"> | string
    magazineId?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    content?: StringFilter<"Post"> | string
    published?: BoolFilter<"Post"> | boolean
    publishedAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    createdAt?: DateTimeFilter<"Post"> | Date | string
    updatedAt?: DateTimeFilter<"Post"> | Date | string
  }

  export type GoodsUpsertWithWhereUniqueWithoutMagazineInput = {
    where: GoodsWhereUniqueInput
    update: XOR<GoodsUpdateWithoutMagazineInput, GoodsUncheckedUpdateWithoutMagazineInput>
    create: XOR<GoodsCreateWithoutMagazineInput, GoodsUncheckedCreateWithoutMagazineInput>
  }

  export type GoodsUpdateWithWhereUniqueWithoutMagazineInput = {
    where: GoodsWhereUniqueInput
    data: XOR<GoodsUpdateWithoutMagazineInput, GoodsUncheckedUpdateWithoutMagazineInput>
  }

  export type GoodsUpdateManyWithWhereWithoutMagazineInput = {
    where: GoodsScalarWhereInput
    data: XOR<GoodsUpdateManyMutationInput, GoodsUncheckedUpdateManyWithoutMagazineInput>
  }

  export type GoodsScalarWhereInput = {
    AND?: GoodsScalarWhereInput | GoodsScalarWhereInput[]
    OR?: GoodsScalarWhereInput[]
    NOT?: GoodsScalarWhereInput | GoodsScalarWhereInput[]
    id?: StringFilter<"Goods"> | string
    magazineId?: StringFilter<"Goods"> | string
    name?: StringFilter<"Goods"> | string
    description?: StringNullableFilter<"Goods"> | string | null
    price?: IntFilter<"Goods"> | number
    stock?: IntNullableFilter<"Goods"> | number | null
    createdAt?: DateTimeFilter<"Goods"> | Date | string
    updatedAt?: DateTimeFilter<"Goods"> | Date | string
  }

  export type MagazineCreateWithoutPostsInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    goods?: GoodsCreateNestedManyWithoutMagazineInput
  }

  export type MagazineUncheckedCreateWithoutPostsInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    goods?: GoodsUncheckedCreateNestedManyWithoutMagazineInput
  }

  export type MagazineCreateOrConnectWithoutPostsInput = {
    where: MagazineWhereUniqueInput
    create: XOR<MagazineCreateWithoutPostsInput, MagazineUncheckedCreateWithoutPostsInput>
  }

  export type MagazineUpsertWithoutPostsInput = {
    update: XOR<MagazineUpdateWithoutPostsInput, MagazineUncheckedUpdateWithoutPostsInput>
    create: XOR<MagazineCreateWithoutPostsInput, MagazineUncheckedCreateWithoutPostsInput>
    where?: MagazineWhereInput
  }

  export type MagazineUpdateToOneWithWhereWithoutPostsInput = {
    where?: MagazineWhereInput
    data: XOR<MagazineUpdateWithoutPostsInput, MagazineUncheckedUpdateWithoutPostsInput>
  }

  export type MagazineUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goods?: GoodsUpdateManyWithoutMagazineNestedInput
  }

  export type MagazineUncheckedUpdateWithoutPostsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    goods?: GoodsUncheckedUpdateManyWithoutMagazineNestedInput
  }

  export type MagazineCreateWithoutGoodsInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostCreateNestedManyWithoutMagazineInput
  }

  export type MagazineUncheckedCreateWithoutGoodsInput = {
    id?: string
    title: string
    description?: string | null
    authorId: string
    createdAt?: Date | string
    updatedAt?: Date | string
    posts?: PostUncheckedCreateNestedManyWithoutMagazineInput
  }

  export type MagazineCreateOrConnectWithoutGoodsInput = {
    where: MagazineWhereUniqueInput
    create: XOR<MagazineCreateWithoutGoodsInput, MagazineUncheckedCreateWithoutGoodsInput>
  }

  export type MagazineUpsertWithoutGoodsInput = {
    update: XOR<MagazineUpdateWithoutGoodsInput, MagazineUncheckedUpdateWithoutGoodsInput>
    create: XOR<MagazineCreateWithoutGoodsInput, MagazineUncheckedCreateWithoutGoodsInput>
    where?: MagazineWhereInput
  }

  export type MagazineUpdateToOneWithWhereWithoutGoodsInput = {
    where?: MagazineWhereInput
    data: XOR<MagazineUpdateWithoutGoodsInput, MagazineUncheckedUpdateWithoutGoodsInput>
  }

  export type MagazineUpdateWithoutGoodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUpdateManyWithoutMagazineNestedInput
  }

  export type MagazineUncheckedUpdateWithoutGoodsInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    authorId?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    posts?: PostUncheckedUpdateManyWithoutMagazineNestedInput
  }

  export type PostCreateManyMagazineInput = {
    id?: string
    title: string
    content: string
    published?: boolean
    publishedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GoodsCreateManyMagazineInput = {
    id?: string
    name: string
    description?: string | null
    price: number
    stock?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PostUpdateWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    published?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsUpdateWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsUncheckedUpdateWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoodsUncheckedUpdateManyWithoutMagazineInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    price?: IntFieldUpdateOperationsInput | number
    stock?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}