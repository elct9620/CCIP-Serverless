import { Booth } from '@/event'
import { Query, Projection } from '@/core'

type BoothInfo = {
  name: string
}

export class ListBooth implements Query<void, BoothInfo[]> {
  private readonly booths: Projection<void, Booth[]>

  constructor(booths: Projection<void, Booth[]>) {
    this.booths = booths
  }

  async execute(): Promise<BoothInfo[]> {
    const booths = (await this.booths.query()) ?? []

    return booths.map(booth => ({ name: booth.name }))
  }
}
