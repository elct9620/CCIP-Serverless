import { Announcement as AnnouncementEntity } from '../../src/announcement'

export type Announcement = {
  datetime: number
  msgEn: AnnouncementEntity['messageEn']
  msgZh: AnnouncementEntity['messageZh']
  uri: AnnouncementEntity['uri']
}
