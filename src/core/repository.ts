export interface Projection<I, O> {
  query(input?: I): Promise<O>
}

export interface Repository<T> {
  findById(id: string): Promise<T | null>
  save(entity: T): Promise<void>
  delete(entity: T): Promise<void>
}
