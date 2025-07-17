import { notFound } from 'next/navigation'
import PostContent from './PostContent'

async function getPostData(id) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/post/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

export default async function PostPage({ params }) {
  const post = await getPostData(params.id)
  
  if (!post) {
    notFound()
  }

  return <PostContent post={post} />
}

// SEO için metadata
export async function generateMetadata({ params }) {
  const post = await getPostData(params.id)
  
  if (!post) {
    return {
      title: 'Haber Bulunamadı',
    }
  }

  return {
    title: `${post.title} - RSS Feed`,
    description: post.description,
  }
}