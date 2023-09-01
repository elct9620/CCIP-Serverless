import { routes as announcementRouts } from './announcement'
import { routes as landingRoutes } from './landing'
import { routes as statusRoutes } from './status'
import { routes as useRoutes } from './use'

export const routes = [...announcementRouts, ...landingRoutes, ...statusRoutes, ...useRoutes]
