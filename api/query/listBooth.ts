import { Booth } from '@/event'
import { Query, Projection, ProjectionInput } from '@/core'

export type BoothQueryInput = ProjectionInput

type BoothInfo = {
  name: string
}

export class ListBooth implements Query<void, BoothInfo[]> {
  private readonly booths: Projection<BoothQueryInput, Booth[]>

  constructor(booths: Projection<BoothQueryInput, Booth[]>) {
    this.booths = booths
  }

  async execute(): Promise<BoothInfo[]> {
    const booths = await this.booths.query()

    return booths.map(booth => ({ name: booth.name }))
  }
}
