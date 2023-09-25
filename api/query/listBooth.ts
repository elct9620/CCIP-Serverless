import { Booth } from '@/event'
import { Query, Projection } from '@/core'
import { ListBoothInput } from '@api/projection'

export type QueryBoothInput = {
  eventId: string
}

type BoothInfo = {
  name: string
}

export class ListBooth implements Query<QueryBoothInput, BoothInfo[]> {
  private readonly booths: Projection<ListBoothInput, Booth[]>

  constructor(booths: Projection<ListBoothInput, Booth[]>) {
    this.booths = booths
  }

  async execute({ eventId }: QueryBoothInput): Promise<BoothInfo[]> {
    const booths = (await this.booths.query({ eventId })) ?? []

    return booths.map(booth => ({ name: booth.name }))
  }
}
