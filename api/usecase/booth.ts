import { BoothRepository } from './repository'

type BoothInfo = {
  name: string
}

export class Booth {
  private readonly booths: BoothRepository

  constructor(booths: BoothRepository) {
    this.booths = booths
  }

  async listAll(): Promise<BoothInfo[]> {
    const booths = await this.booths.listAll()

    return booths.map(booth => ({ name: booth.name }))
  }
}
