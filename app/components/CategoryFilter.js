'use client'
import { CATEGORIES } from '../config/rss-sources'

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-medium text-gray-900 mb-6 tracking-wide">Kategoriler</h3>
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 ease-out
              border border-gray-200 hover:border-gray-300
              ${selectedCategory === category.id
                ? 'bg-gray-900 text-white border-gray-900 shadow-lg transform'
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}