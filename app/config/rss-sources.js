export const RSS_SOURCES = [
  { 
    url: 'https://redline24.com.tr/rss', 
    name: 'Redline24',
    encoding: 'utf-8',
    category: 'genel'
  },
  { 
    url: 'https://www.savunmasanayist.com/feed/', 
    name: 'Savunma SanayiiST',
    encoding: 'utf-8',
    category: 'savunma'
  },
  { 
    url: 'https://www.defenceturk.net/feed', 
    name: 'DefenceTurk',
    encoding: 'utf-8',
    category: 'savunma'
  },
  { 
    url: 'https://www.savunmatr.com/feed/', 
    name: 'SavunmaTR',
    encoding: 'utf-8',
    category: 'savunma'
  },
  { 
    url: 'https://www.turdef.com/rss', 
    name: 'TurDef',
    encoding: 'utf-8',
    category: 'savunma'
  },


  // siyaset
  {
  url: 'https://www.bbc.com/turkce/index.xml',
  name: 'BBC Türkçe',
  encoding: 'utf-8',
  category: 'siyaset'
},
{
  url: 'https://www.aa.com.tr/tr/rss/default?cat=guncel',
  name: 'Anadolu Ajansı - Güncel',
  encoding: 'utf-8',
  category: 'siyaset'
},
{
  url: 'https://www.cnnturk.com/feed/rss/all/news',
  name: 'CNN Türk',
  encoding: 'utf-8',
  category: 'siyaset'
}

]


export const CATEGORIES = [
  { id: 'all', name: 'Tümü' },
  { id: 'savunma', name: 'Savunma Sanayi' },
  { id: 'siyaset', name: 'Siyaset' },
  { id: 'teknoloji', name: 'Yabancı Kaynaklar' }
]