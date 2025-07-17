import { parseStringPromise } from 'xml2js'
import { RSS_SOURCES } from '../../config/rss-sources'
import { createSafeId } from '../../utils/idGenerator'

function cleanHtmlContent(html) {
  if (!html) return ''
  
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
    .substring(0, 200)
}

async function fetchRSSFeed(source) {
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader Bot)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      timeout: 10000,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const xmlData = await response.text()
    const result = await parseStringPromise(xmlData, {
      trim: true,
      explicitArray: false,
      ignoreAttrs: false,
    })

    let items = []
    if (result.rss?.channel?.item) {
      items = Array.isArray(result.rss.channel.item) 
        ? result.rss.channel.item 
        : [result.rss.channel.item]
    } else if (result.feed?.entry) {
      items = Array.isArray(result.feed.entry) 
        ? result.feed.entry 
        : [result.feed.entry]
    }

    return items.slice(0, 10).map(item => {
      const title = item.title?._ || item.title || 'Başlık Yok'
      const description = cleanHtmlContent(
        item.description || 
        item.summary?._ || 
        item.summary || 
        item.content?._ || 
        item.content || 
        ''
      )
      
      const link = item.link?.$ ? item.link.$.href : item.link || '#'
      const pubDate = item.pubDate || item.published || new Date().toISOString()

      return {
        id: createSafeId(link),
        title: title,
        description: description,
        link: link,
        pubDate: pubDate,
        source: source.name,
        category: source.category || 'genel', // Kategori eklendi
      }
    })
  } catch (error) {
    console.error(`RSS fetch error for ${source.name}:`, error.message)
    return []
  }
}

export async function GET() {
  try {
    const feedPromises = RSS_SOURCES.map(source => fetchRSSFeed(source))
    const results = await Promise.allSettled(feedPromises)
    
    const allFeeds = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      .flat()
      .sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
      .slice(0, 30)

    return Response.json(allFeeds)
  } catch (error) {
    console.error('Feeds API error:', error)
    return Response.json({ error: 'Failed to fetch feeds' }, { status: 500 })
  }
}