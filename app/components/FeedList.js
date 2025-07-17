'use client'

import { useState, useEffect } from 'react'
import FeedCard from './FeedCard'
import Loading from './Loading'
import CategoryFilter from './CategoryFilter'

export default function FeedList() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchFeeds()
  }, [])

  const fetchFeeds = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/feeds')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setFeeds(data)
    } catch (err) {
      console.error('Feed fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchFeeds()
  }

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId)
  }

  // Kategori filtreleme
  const filteredFeeds = selectedCategory === 'all' 
    ? feeds 
    : feeds.filter(feed => feed.category === selectedCategory)

  if (loading) return <Loading />
  
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <h3 className="text-lg font-semibold mb-2">Hata</h3>
          <p className="text-sm">Haberler yüklenirken bir hata oluştu.</p>
        </div>
        <button
          onClick={handleRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Tekrar Dene
        </button>
      </div>
    )
  }

  return (
    <>
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange} 
      />
      
      {filteredFeeds.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            <h3 className="text-lg font-semibold mb-2">
              {selectedCategory === 'all' ? 'Haber Bulunamadı' : 'Bu kategoride haber bulunamadı'}
            </h3>
            <p className="text-sm">
              {selectedCategory === 'all' 
                ? 'Şu anda gösterilecek haber bulunmuyor.' 
                : '...'}
            </p>
          </div>
          <div className="mt-4 space-x-2">
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Tüm Haberler
              </button>
            )}
            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Yenile
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeeds.map((feed) => (
            <FeedCard key={feed.id} feed={feed} />
          ))}
        </div>
      )}
    </>
  )
}