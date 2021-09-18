import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ETL调度'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
