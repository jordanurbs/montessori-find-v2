import { getPostBySlug, getAllPostsMeta, extractTags } from '../../../lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  const posts = getAllPostsMeta();
  return posts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: `${post.title} | Montessori Find`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Montessori Find`,
      description: post.description,
      type: 'article',
      url: `https://montessorifind.com/blog/${post.slug}`,
      images: post.coverImage ? [post.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Montessori Find`,
      description: post.description,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) return notFound();

  const tags = extractTags(post);
  const formattedDate = formatBlogDate(post.date);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: post.author ? { '@type': 'Person', name: post.author } : undefined,
    image: post.coverImage,
    url: `https://montessorifind.com/blog/${post.slug}`,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        {/* Back link */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link href="/blog" className="inline-flex items-center text-green-600 hover:text-green-700 font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Montessori Parenting Blog
          </Link>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="w-full h-80 md:h-96 overflow-hidden">
            <img 
              src={post.coverImage} 
              alt={post.title} 
              className="w-full h-full object-cover" 
            />
          </div>
        )}

        {/* Article content */}
        <article className="max-w-4xl mx-auto px-4 py-8">
          {/* Title and metadata */}
          <div className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">{post.title}</h1>
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="text-gray-600 text-sm flex items-center">
                <span>{formattedDate}</span>
                {post.readingTime && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime}</span>
                  </>
                )}
                {post.author && (
                  <>
                    <span className="mx-2">•</span>
                    <span>By {post.author}</span>
                  </>
                )}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
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

          {/* Content */}
          <div className="prose prose-lg max-w-none 
            prose-headings:font-bold prose-headings:text-gray-900 
            prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-gray-700 prose-p:mb-6 prose-p:leading-relaxed 
            prose-a:text-green-600 prose-a:font-medium prose-a:no-underline hover:prose-a:text-green-700 hover:prose-a:underline
            prose-strong:text-gray-900 prose-strong:font-semibold
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6 prose-ol:space-y-3
            prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-ul:space-y-3
            prose-li:text-gray-700 prose-li:pl-2 prose-li:marker:text-gray-500 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-green-500 prose-blockquote:pl-4 prose-blockquote:py-3 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:font-light prose-blockquote:bg-gray-50 prose-blockquote:my-8 prose-blockquote:rounded-r-sm
            prose-table:border-collapse prose-table:w-full prose-table:my-8
            prose-thead:bg-gray-100 prose-thead:text-left
            prose-th:border prose-th:border-gray-300 prose-th:py-3 prose-th:px-4 prose-th:font-semibold
            prose-td:border prose-td:border-gray-300 prose-td:py-3 prose-td:px-4
            prose-tr:even:bg-gray-50
            prose-img:rounded-lg prose-img:my-8 prose-img:max-w-full
            prose-figure:my-8 prose-figure:mx-auto prose-figure:max-w-full
            prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-500 prose-figcaption:mt-2
            prose-video:w-full prose-video:rounded-lg prose-video:my-8
            [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:my-8 [&_iframe]:rounded-lg
            [&>div]:my-10
            [&_.tag-separator]:text-gray-400"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </article>

        {/* Related posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <div className="max-w-4xl mx-auto px-4 py-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.map(relatedPost => (
                <div key={relatedPost.slug} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {relatedPost.coverImage && (
                    <Link href={`/blog/${relatedPost.slug}`} className="block h-40 w-full overflow-hidden">
                      <img 
                        src={relatedPost.coverImage} 
                        alt={relatedPost.title} 
                        className="object-cover w-full h-full"
                        loading="lazy"
                      />
                    </Link>
                  )}
                  <div className="p-4">
                    <Link href={`/blog/${relatedPost.slug}`} className="text-lg font-semibold text-gray-900 hover:text-green-700 transition-colors">
                      {relatedPost.title}
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatBlogDate(relatedPost.date)}
                      {relatedPost.readingTime && ` • ${relatedPost.readingTime}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Newsletter signup */}
        <div className="max-w-4xl mx-auto px-4 py-8 mb-12">
          <div className="bg-green-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-4">Polish Your Parenting Journey</h2>
            <p className="text-center mb-6">
              Get more insightful articles like this delivered straight to your inbox. Join our community of mindful parents embracing the Montessori approach.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                Join Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
} 