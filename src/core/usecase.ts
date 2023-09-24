export interface UseCase<I, O> {
  execute(input?: I): Promise<O | null>
}

export type Command<I, O> = UseCase<I, O>
export type Query<I, O> = UseCase<I, O>
