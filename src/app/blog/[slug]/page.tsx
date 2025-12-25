"use client";

import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ShareButtons from "@/components/ui/ShareButtons";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string[];
  views: number;
  publishedAt: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function BlogPostPage({ params }: PageProps) {
  const { slug } = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${slug}`);
        const data = await res.json();

        if (!data.success) {
          setPost(null);
        } else {
          setPost(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="container">
          <div className="skeleton-content">
            <div className="skeleton-title"></div>
            <div className="skeleton-meta"></div>
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text"></div>
            <div className="skeleton-text short"></div>
          </div>
        </div>
        <style jsx>{`
          .blog-post-page {
            padding: 3rem 0 4rem;
          }
          .skeleton-content {
            max-width: 800px;
            margin: 0 auto;
          }
          .skeleton-title {
            height: 48px;
            width: 80%;
            background: #e0e0e0;
            border-radius: 8px;
            margin-bottom: 1rem;
          }
          .skeleton-meta {
            height: 20px;
            width: 40%;
            background: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 2rem;
          }
          .skeleton-image {
            height: 400px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 16px;
            margin-bottom: 2rem;
          }
          .skeleton-text {
            height: 20px;
            width: 100%;
            background: #e0e0e0;
            border-radius: 4px;
            margin-bottom: 0.75rem;
          }
          .skeleton-text.short {
            width: 60%;
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <div className="container">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/blog">Blog</Link>
          <span>/</span>
          <span className="current">{post.title}</span>
        </div>
      </div>

      <article className="blog-post-page">
        <div className="container">
          <div className="post-container">
            {/* Header */}
            <header className="post-header">
              <span className="post-category">{post.category}</span>
              <h1>{post.title}</h1>
              <div className="post-meta">
                <span className="post-author">By {post.author}</span>
                <span className="separator">•</span>
                <span className="post-date">
                  {formatDate(post.publishedAt)}
                </span>
                <span className="separator">•</span>
                <span className="post-views">{post.views} views</span>
              </div>
            </header>

            {/* Featured Image */}
            <div className="post-image">
              <img src={post.image} alt={post.title} />
            </div>

            {/* Content */}
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="post-tags">
                <span className="tags-label">Tags:</span>
                {post.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share */}
            <div className="share-section">
              <ShareButtons
                url={`/blog/${post.slug}`}
                title={post.title}
                description={post.excerpt}
              />
            </div>

            {/* Back Link */}
            <div className="back-section">
              <Link href="/blog" className="back-link">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to Blog
              </Link>
            </div>
          </div>
        </div>
      </article>

      <style jsx>{`
        .breadcrumb {
          background: var(--bg-light);
          padding: 1rem 0;
        }

        .breadcrumb .container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb a {
          color: var(--text-secondary);
          text-decoration: none;
        }

        .breadcrumb a:hover {
          color: var(--primary-purple);
        }

        .breadcrumb span {
          color: var(--text-muted);
        }

        .breadcrumb .current {
          color: var(--text-primary);
          font-weight: 500;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .blog-post-page {
          padding: 3rem 0 4rem;
        }

        .post-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .post-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .post-category {
          display: inline-block;
          background: var(--primary-gradient);
          color: white;
          padding: 0.25rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .post-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1.2;
          margin: 0 0 1rem 0;
          color: var(--text-primary);
        }

        .post-meta {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .separator {
          color: var(--border-color);
        }

        .post-author {
          font-weight: 500;
        }

        .post-image {
          border-radius: var(--radius-2xl);
          overflow: hidden;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-lg);
        }

        .post-image img {
          width: 100%;
          height: auto;
          display: block;
        }

        .post-content {
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text-primary);
        }

        .post-content :global(h2) {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 2rem 0 1rem 0;
          color: var(--secondary-navy);
        }

        .post-content :global(h3) {
          font-size: 1.375rem;
          font-weight: 600;
          margin: 1.5rem 0 0.75rem 0;
        }

        .post-content :global(p) {
          margin: 0 0 1.5rem 0;
        }

        .post-content :global(ul),
        .post-content :global(ol) {
          margin: 0 0 1.5rem 1.5rem;
        }

        .post-content :global(li) {
          margin-bottom: 0.5rem;
        }

        .post-content :global(a) {
          color: var(--primary-purple);
          text-decoration: underline;
        }

        .post-content :global(blockquote) {
          border-left: 4px solid var(--primary-purple);
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: var(--text-secondary);
        }

        .post-tags {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .tags-label {
          font-weight: 500;
          color: var(--text-secondary);
        }

        .tag {
          background: var(--bg-light);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .share-section {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid var(--border-color);
        }

        .back-section {
          margin-top: 2rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--primary-purple);
        }

        @media (max-width: 768px) {
          .post-header h1 {
            font-size: 1.75rem;
          }

          .post-meta {
            flex-wrap: wrap;
            gap: 0.5rem;
          }

          .post-content {
            font-size: 1rem;
          }
        }
      `}</style>
    </>
  );
}
