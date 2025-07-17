import crypto from 'crypto'

export function createSafeId(url) {
  try {
    // URL'yi normalize et
    const normalizedUrl = url.trim().toLowerCase()
    
    // MD5 hash kullanarak tutarlı ID üret
    const hash = crypto.createHash('md5').update(normalizedUrl).digest('hex')
    
    // İlk 16 karakteri al
    return hash.substring(0, 16)
  } catch (error) {
    console.error('ID creation error:', error)
    // Fallback olarak URL'nin basit hash'ini kullan
    return url.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0)
      return a & a
    }, 0).toString(16).replace('-', '').substring(0, 16)
  }
}