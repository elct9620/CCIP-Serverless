export interface ProjectionInput {}

export interface Projection<I extends ProjectionInput, O> {
  query(input?: I): Promise<O>
}
