import { JSDOM } from 'jsdom'

// Site-specific scraping rules
const SITE_RULES = {
  // Config dosyanızdaki RSS kaynaklarına özel kurallar
  'redline24.com.tr': {
    contentSelectors: ['.post-content', '.entry-content', '.article-content', '.content', 'article'],
    removeSelectors: ['.related-posts', '.social-share', '.advertisement', '.sidebar', '.widget']
  },
  'savunmasanayist.com': {
    contentSelectors: ['.post-content', '.entry-content', '.article-content', '.content', 'article'],
    removeSelectors: ['.related-posts', '.social-share', '.advertisement', '.sidebar', '.widget', '.author-box']
  },
  'defenceturk.net': {
    contentSelectors: ['.post-content', '.entry-content', '.article-content', '.content', 'article'],
    removeSelectors: ['.related-posts', '.social-share', '.advertisement', '.sidebar', '.widget']
  },
  'savunmatr.com': {
    contentSelectors: ['.post-content', '.entry-content', '.article-content', '.content', 'article'],
    removeSelectors: ['.related-posts', '.social-share', '.advertisement', '.sidebar', '.widget']
  },
  'turdef.com': {
    contentSelectors: ['.post-content', '.entry-content', '.article-content', '.content', 'article'],
    removeSelectors: ['.related-posts', '.social-share', '.advertisement', '.sidebar', '.widget']
  },

  // Diğer popüler siteler
  'habertürk.com': {
    contentSelectors: ['.content-element', '.news-content', '.article-content'],
    removeSelectors: ['.related-news', '.gallery', '.video-container']
  },
  'milliyet.com.tr': {
    contentSelectors: ['.article-content', '.news-detail', '.content'],
    removeSelectors: ['.advertisement', '.social-buttons', '.related-content']
  },
  'hurriyet.com.tr': {
    contentSelectors: ['.news-content', '.article-text', '.content'],
    removeSelectors: ['.ads', '.social-share', '.gallery']
  },
  'sabah.com.tr': {
    contentSelectors: ['.news-content', '.article-body', '.content-area'],
    removeSelectors: ['.advertisement', '.related-news', '.video-box']
  },
  'sozcu.com.tr': {
    contentSelectors: ['.content-element', '.news-spot', '.article-content'],
    removeSelectors: ['.banner', '.related-content', '.social-media']
  },
  'ntv.com.tr': {
    contentSelectors: ['.article-content', '.news-detail', '.content-area'],
    removeSelectors: ['.related-news', '.video-container', '.advertisement']
  },
  'cnnturk.com': {
    contentSelectors: ['.article-content', '.news-content', '.content'],
    removeSelectors: ['.related-articles', '.video-player', '.ads']
  },
  'aa.com.tr': {
    contentSelectors: ['.detay-spot-category', '.detay-metin', '.article-content'],
    removeSelectors: ['.related-news', '.social-share', '.advertisement']
  },
  'bbc.com': {
    contentSelectors: ['[data-component="text-block"]', '.story-body__inner', 'article'],
    removeSelectors: ['.media-placeholder', '.related-content', '.social-embed']
  },
  'reuters.com': {
    contentSelectors: ['[data-module="ArticleBody"]', '.ArticleBody-container', 'article'],
    removeSelectors: ['.related-content', '.social-media', '.advertisement']
  }
}

// Readability algoritması benzeri metin çıkarma
function calculateContentScore(element) {
  let score = 0
  const text = element.textContent || ''

  // Pozitif puanlama
  score += text.length * 0.01 // Metin uzunluğu
  score += (text.match(/\./g) || []).length * 2 // Cümle sayısı
  score += (text.match(/[,;]/g) || []).length * 1 // Noktalama
  score += element.querySelectorAll('p').length * 25 // Paragraf sayısı

  // Negatif puanlama
  score -= (text.match(/\b(reklam|advertisement|ads|banner|popup)\b/gi) || []).length * 50
  score -= element.querySelectorAll('a').length * 3 // Çok fazla link
  score -= (text.match(/\b(facebook|twitter|instagram|youtube|whatsapp)\b/gi) || []).length * 10

  // Class ve id bazlı puanlama
  const className = element.className || ''
  const id = element.id || ''

  if (/(content|article|story|post|news|text|main)/i.test(className + id)) {
    score += 50
  }

  if (/(sidebar|nav|menu|header|footer|ad|comment|social|related)/i.test(className + id)) {
    score -= 30
  }

  return score
}

// İçerik temizleme fonksiyonu
function cleanContent(content) {
  if (!content) return ''

  return content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    .replace(/<form[^>]*>[\s\S]*?<\/form>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/<video[^>]*>[\s\S]*?<\/video>/gi, '')
    .replace(/<audio[^>]*>[\s\S]*?<\/audio>/gi, '')
    .replace(/<canvas[^>]*>[\s\S]*?<\/canvas>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<img[^>]*>/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Site-specific content extraction
function extractBySiteRules(document, hostname) {
  const rules = SITE_RULES[hostname]
  if (!rules) return null

  // Site-specific elementleri kaldır
  if (rules.removeSelectors) {
    rules.removeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => el.remove())
    })
  }

  // Site-specific içerik seçicileri
  for (const selector of rules.contentSelectors) {
    const element = document.querySelector(selector)
    if (element && element.textContent.trim().length > 100) {
      return element.innerHTML
    }
  }

  return null
}

// Readability benzeri ana içerik çıkarma
function extractMainContent(document) {
  const candidates = []

  // Potansiyel container elementleri
  const containerSelectors = [
    'article', 'main', '[role="main"]',
    'div[class*="content"]', 'div[class*="article"]',
    'div[class*="post"]', 'div[class*="story"]',
    'div[class*="news"]', 'div[class*="text"]',
    'section', '.container', '.wrapper'
  ]

  containerSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => {
      if (element.textContent.trim().length > 200) {
        candidates.push({
          element,
          score: calculateContentScore(element)
        })
      }
    })
  })

  // En yüksek puanlı elementi seç
  candidates.sort((a, b) => b.score - a.score)

  if (candidates.length > 0 && candidates[0].score > 100) {
    return candidates[0].element.innerHTML
  }

  return null
}

// Fallback: Paragraf tabanlı çıkarma
function extractParagraphs(document) {
  const paragraphs = Array.from(document.querySelectorAll('p'))
    .filter(p => {
      const text = p.textContent.trim()
      return text.length > 50 &&
        !/(reklam|advertisement|cookie|gdpr|privacy)/i.test(text)
    })
    .sort((a, b) => b.textContent.length - a.textContent.length)
    .slice(0, 15)

  return paragraphs.map(p => p.outerHTML).join('')
}

// JSON-LD structured data çıkarma
function extractJsonLd(document) {
  const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')

  for (const script of jsonLdScripts) {
    try {
      const data = JSON.parse(script.textContent)
      if (data['@type'] === 'Article' || data['@type'] === 'NewsArticle') {
        return data.articleBody || data.text || null
      }
    } catch (e) {
      continue
    }
  }

  return null
}

// Meta tag'lerden içerik çıkarma
function extractFromMeta(document) {
  const description = document.querySelector('meta[name="description"]')?.content ||
    document.querySelector('meta[property="og:description"]')?.content ||
    document.querySelector('meta[name="twitter:description"]')?.content

  return description && description.length > 100 ? `<p>${description}</p>` : null
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) {
      return Response.json({ error: 'URL parameter is required' }, { status: 400 })
    }

    console.log('Scraping URL:', url)

    // URL'yi güvenli hale getir
    const safeUrl = encodeURI(decodeURI(url))
    const hostname = new URL(safeUrl).hostname.toLowerCase()

    const response = await fetch(safeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Cache-Control': 'max-age=0'
      },
      timeout: 20000,
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const html = await response.text()
    const dom = new JSDOM(html)
    const document = dom.window.document

    // İstenmeyen elementleri kaldır
    const unwantedSelectors = [
      'script', 'style', 'noscript', 'iframe',
      'nav', 'header', 'footer', 'aside', 'form', 'input', 'button', 'select',
      '.advertisement', '.ads', '.ad', '.banner', '.popup', '.modal',
      '.social-share', '.social-media', '.social-buttons', '.share-buttons',
      '.comments', '.comment', '.discussion', '.disqus',
      '.sidebar', '.menu', '.navigation', '.breadcrumb', '.breadcrumbs',
      '.related-posts', '.related-articles', '.related-content', '.related-news',
      '.widget', '.widgets', '.plugin', '.embed', '.video-player',
      '.newsletter', '.subscription', '.signup', '.login', '.register',
      '.cookie', '.gdpr', '.privacy', '.terms', '.legal', '.jeg_meta_container', '.featured_image', '.ads-wrapper',
      '[class*="banner"]', '[id*="banner"]', '[class*="popup"]', '[id*="popup"]', '.jnews_related_post_container'
    ]

    unwantedSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(el => el.remove())
    })

    let content = ''

    // 1. Site-specific rules
    content = extractBySiteRules(document, hostname)

    // 2. JSON-LD structured data
    if (!content) {
      content = extractJsonLd(document)
    }

    // 3. Readability benzeri ana içerik çıkarma
    if (!content) {
      content = extractMainContent(document)
    }

    // 4. Genel içerik seçicileri
    if (!content) {
      const generalSelectors = [
        'article', 'main', '[role="main"]',
        '.post-content', '.article-content', '.content', '.story-body',
        '.entry-content', '.post-body', '.article-body', '.news-content',
        '.text-content', '.main-content', '.page-content', '.post-text',
        '.article-text', '.story-text', '.news-text', '.content-area',
        '.post-area', '.article-area', '.story-area', '.news-area', '.entry-content',
      ]

      for (const selector of generalSelectors) {
        const element = document.querySelector(selector)
        if (element && element.textContent.trim().length > 200) {
          content = element.innerHTML
          break
        }
      }
    }

    // 5. Paragraf tabanlı çıkarma
    if (!content) {
      content = extractParagraphs(document)
    }

    // 6. Meta tag'lerden içerik
    if (!content) {
      content = extractFromMeta(document)
    }

    // İçeriği temizle
    content = cleanContent(content)

    if (!content || content.length < 100) {
      return Response.json({
        error: 'İçerik çıkarılamadı',
        content: 'Bu site için içerik çıkarılması şu anda desteklenmiyor.'
      }, { status: 200 })
    }

    console.log(`Content extracted successfully from ${hostname}, length: ${content.length}`)

    return Response.json({ content })

  } catch (error) {
    console.error('Scraping error:', error)

    let errorMessage = 'İçerik çıkarılırken bir hata oluştu'
    if (error.message.includes('timeout')) {
      errorMessage = 'Site yanıt vermiyor, lütfen daha sonra tekrar deneyin'
    } else if (error.message.includes('404')) {
      errorMessage = 'Sayfa bulunamadı'
    } else if (error.message.includes('403')) {
      errorMessage = 'Siteye erişim engellendi'
    }

    return Response.json({
      error: errorMessage,
      details: error.message,
      content: 'İçerik yüklenemedi'
    }, { status: 500 })
  }
}