import { Booth } from '@/event'
import { Projection, ProjectionInput } from '@/core'

export type BoothQueryInput = ProjectionInput

type BoothInfo = {
  name: string
}

export class ListBooth {
  private readonly booths: Projection<BoothQueryInput, Booth[]>

  constructor(booths: Projection<BoothQueryInput, Booth[]>) {
    this.booths = booths
  }

  async listAll(): Promise<BoothInfo[]> {
    const booths = await this.booths.query()

    return booths.map(booth => ({ name: booth.name }))
  }
}
