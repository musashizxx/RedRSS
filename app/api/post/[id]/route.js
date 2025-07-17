import { parseStringPromise } from 'xml2js'
import { RSS_SOURCES } from '../../../config/rss-sources'
import { createSafeId } from '../../../utils/idGenerator'

function cleanHtmlContent(html) {
  if (!html) return ''
  
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .trim()
}

async function findPostById(id) {
  console.log('Searching for post with ID:', id)
  
  for (const source of RSS_SOURCES) {
    try {
      const response = await fetch(source.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader Bot)',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
        timeout: 10000,
      })
      
      if (!response.ok) continue
      
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
      
      for (const item of items) {
        const link = item.link?.$ ? item.link.$.href : item.link || '#'
        const postId = createSafeId(link)
        
        console.log('Generated ID:', postId, 'for URL:', link)
        
        if (postId === id) {
          const title = item.title?._ || item.title || 'Başlık Yok'
          const description = cleanHtmlContent(
            item.description || 
            item.summary?._ || 
            item.summary || 
            item.content?._ || 
            item.content || 
            ''
          )
          
          return {
            id: postId,
            title: title,
            description: description,
            link: link,
            pubDate: item.pubDate || item.published || new Date().toISOString(),
            source: source.name,
          }
        }
      }
    } catch (error) {
      console.error(`Error searching in ${source.name}:`, error.message)
      continue
    }
  }
  return null
}

export async function GET(request, { params }) {
  try {
    const post = await findPostById(params.id)
    
    if (!post) {
      return Response.json({ error: 'Post not found' }, { status: 404 })
    }
    
    return Response.json(post)
  } catch (error) {
    console.error('Post API error:', error)
    return Response.json({ error: 'Failed to fetch post' }, { status: 500 })
  }
}