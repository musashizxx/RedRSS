import Link from 'next/link'
import { CATEGORIES } from '../config/rss-sources'

export default function FeedCard({ feed }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCategoryInfo = (categoryId) => {
    return CATEGORIES.find(cat => cat.id === categoryId) || CATEGORIES[0]
  }

  const categoryInfo = getCategoryInfo(feed.category)

  return (
    <Link href={`/post/${feed.id}`}>
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden cursor-pointer h-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-medium text-blue-700 ">
              - {categoryInfo.name}
            </span>
            <span className="text-xs text-gray-500">{formatDate(feed.pubDate)}</span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 leading-tight">
            {feed.title}
          </h3>
          
          <p className="text-gray-600 mb-4 text-sm line-clamp-3 leading-relaxed">
            {feed.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span className="font-medium px-2 py-1 bg-blue-50 text-blue-700 rounded">
              {feed.source}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}