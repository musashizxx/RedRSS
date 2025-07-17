import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
      <p className="text-gray-600 mb-8">The post you're looking for doesn't exist.</p>
      <Link href="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md">
        Return Home
      </Link>
    </div>
  )
}