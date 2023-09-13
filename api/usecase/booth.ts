type BoothInfo = {
  name: string
}

export class Booth {
  async listAll(): Promise<BoothInfo[]> {
    return [{ name: 'COSCUP' }, { name: 'SITCON' }]
  }
}
