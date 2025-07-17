'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PostContent({ post }) {
  const [fullContent, setFullContent] = useState('')
  const [loadingContent, setLoadingContent] = useState(false)
  const [showFullContent, setShowFullContent] = useState(false)
  const [error, setError] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleShowFullContent = async () => {
    if (showFullContent) {
      setShowFullContent(false)
      return
    }

    setLoadingContent(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(post.link)}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      setFullContent(data.content)
      setShowFullContent(true)
    } catch (error) {
      console.error('Error fetching full content:', error)
      setError('İçerik yüklenirken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setLoadingContent(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          ← Ana Sayfaya Dön
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6 text-sm">
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
              {post.source}
            </span>
            <span className="text-gray-500">{formatDate(post.pubDate)}</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed text-lg">
              {post.description}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-6">
            <button
              onClick={handleShowFullContent}
              disabled={loadingContent}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              {loadingContent && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>
                {loadingContent ? 'Yükleniyor...' : showFullContent ? 'Tam İçeriği Gizle' : 'Tam İçeriği Göster'}
              </span>
            </button>
            
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              Orijinal Makale →
            </a>
          </div>

          {showFullContent && fullContent && (
            <div className="mt-8 border-t pt-8">
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Tam Makale İçeriği</h2>
              <div 
                className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: fullContent }}
              />
            </div>
          )}
        </div>
      </article>
    </div>
  )
}