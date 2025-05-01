import { getPostsByTag, getAllTags } from '../../../../lib/blog';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tag = searchParams.get('tag');

  if (tag) {
    // Return posts for the specified tag
    const posts = getPostsByTag(tag);
    return NextResponse.json({ posts });
  } else {
    // Return all available tags
    const tags = getAllTags();
    return NextResponse.json({ tags });
  }
} 