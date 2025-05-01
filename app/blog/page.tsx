import { getAllPostsMeta, extractTags, getAllTags } from '../../lib/blog';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Montessori Parenting Blog | Montessori Find',
  description: 'Discover insights, read stories, and gather perspective on raising children with a taste of Montessori.',
};

// Format date properly for display
function formatBlogDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString; // Return original if parsing fails
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString; // Return original on error
  }
}

export default async function BlogIndexPage() {
  const posts = getAllPostsMeta();
  const allTags = getAllTags();
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] mb-12">
        <Image 
          src="/assets/graphics/backgrounds/pexels-karolina-grabowska-7269603.jpg" 
          alt="Montessori classroom materials" 
          fill 
          className="object-cover brightness-[0.85]"
          priority
        />
        {/* Semi-transparent white overlay */}
        <div className="absolute inset-0 bg-white bg-opacity-70"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl font-bold mb-6 text-center">Montessori Parenting Blog</h1>
          <p className="text-lg max-w-3xl mx-auto">
            Discover insights, read stories, and gather perspective on raising children with a taste of Montessori.
          </p>
        </div>
      </section>
      
      {/* Popular Tags */}
      <section className="max-w-7xl mx-auto pt-8 px-4">
        <h2 className="text-xl font-semibold mb-4">Popular Topics</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {allTags.map(tag => (
            <Link 
              href={`/blog?tag=${encodeURIComponent(tag)}`} 
              key={tag}
              className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-sm font-medium px-3 py-1.5 rounded-full"
            >
              {tag}
            </Link>
          ))}
        </div>
      </section>
      
      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map(post => {
            const tags = extractTags(post);
            return (
              <div key={post.slug} className="flex flex-col overflow-hidden border rounded-lg shadow hover:shadow-md transition-shadow">
                {post.coverImage && (
                  <Link href={`/blog/${post.slug}`} className="block h-52 w-full overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="object-cover w-full h-full"
                      loading="lazy"
                    />
                  </Link>
                )}
                <div className="flex-1 flex flex-col p-6">
                  <Link href={`/blog/${post.slug}`} className="text-xl font-semibold text-gray-900 hover:text-green-700 transition-colors mb-2">
                    {post.title}
                  </Link>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <span>{formatBlogDate(post.date)}</span>
                    {post.readingTime && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{post.readingTime}</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-700 text-sm mb-4 flex-grow">{post.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {tags.map(tag => (
                      <Link
                        href={`/blog?tag=${encodeURIComponent(tag)}`}
                        key={tag}
                        className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors text-xs font-medium px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
} 