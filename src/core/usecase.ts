export interface UseCase<I, O> {
  execute(input?: I): Promise<O>
}

export type Command<I, O> = UseCase<I, O>
export type Query<I, O> = UseCase<I, O>
