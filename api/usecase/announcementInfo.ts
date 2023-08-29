import { Announcement } from '../schema'
import { AnnouncementRepository } from './repository'

export type AnnouncementReply = Announcement[]

export class AnnouncementInfo {
  private readonly announcementRepository: AnnouncementRepository

  constructor(announcementRepository: AnnouncementRepository) {
    this.announcementRepository = announcementRepository
  }

  public async listAll(): Promise<AnnouncementReply> {
    const results = await this.announcementRepository.listAll()
    return results
  }
}
