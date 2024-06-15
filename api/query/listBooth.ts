import { injectable, inject } from 'tsyringe'
import { Booth } from '@/event'
import { Query, Projection } from '@/core'
import { ListBoothInput } from '@api/projection'

export type QueryBoothInput = {
  eventId: string
}

type BoothInfo = {
  name: string
}

@injectable()
export class ListBooth implements Query<QueryBoothInput, BoothInfo[]> {
  constructor(
    @inject('IBoothProjection')
    private readonly booths: Projection<ListBoothInput, Booth[]>
  ) {}

  async execute({ eventId }: QueryBoothInput): Promise<BoothInfo[]> {
    const booths = (await this.booths.query({ eventId })) ?? []

    return booths.map(booth => ({ name: booth.name }))
  }
}
