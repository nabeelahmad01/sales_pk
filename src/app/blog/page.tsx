"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  author: string;
  category: string;
  views: number;
  publishedAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts?published=true");
        const data = await res.json();
        if (data.success) {
          setPosts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <section className="page-header">
          <div className="container">
            <h1>Blog</h1>
            <p>Shopping tips, sale alerts, and fashion guides</p>
          </div>
        </section>
        <div className="blog-page">
          <div className="container">
            <div className="posts-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          </div>
        </div>
        <style jsx>{`
          .page-header {
            background: linear-gradient(
              135deg,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(236, 72, 153, 0.08) 100%
            );
            padding: 3rem 0;
            text-align: center;
          }
          .page-header h1 {
            margin-bottom: 0.5rem;
          }
          .page-header p {
            color: var(--text-secondary);
          }
          .blog-page {
            padding: 3rem 0 4rem;
          }
          .posts-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2rem;
          }
          .skeleton-card {
            height: 350px;
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
            border-radius: 16px;
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          @media (max-width: 900px) {
            .posts-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          @media (max-width: 640px) {
            .posts-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>Blog</h1>
          <p>Shopping tips, sale alerts, and fashion guides</p>
        </div>
      </section>

      <div className="blog-page">
        <div className="container">
          {posts.length > 0 ? (
            <div className="posts-grid">
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post._id}
                  className="post-card"
                >
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                    <span className="post-category">{post.category}</span>
                  </div>
                  <div className="post-content">
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <div className="post-meta">
                      <span className="post-author">{post.author}</span>
                      <span className="post-date">
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-posts">
              <span className="no-posts-icon">📝</span>
              <h3>No blog posts yet</h3>
              <p>Check back later for shopping tips and sale alerts</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .page-header {
          background: linear-gradient(
            135deg,
            rgba(139, 92, 246, 0.08) 0%,
            rgba(236, 72, 153, 0.08) 100%
          );
          padding: 3rem 0;
          text-align: center;
        }

        .page-header h1 {
          margin-bottom: 0.5rem;
        }
        .page-header p {
          color: var(--text-secondary);
        }

        .blog-page {
          padding: 3rem 0 4rem;
        }

        .posts-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .post-card {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-md);
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .post-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-xl);
        }

        .post-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .post-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .post-card:hover .post-image img {
          transform: scale(1.05);
        }

        .post-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: var(--primary-gradient);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-full);
          font-size: 0.75rem;
          font-weight: 600;
        }

        .post-content {
          padding: 1.5rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-excerpt {
          color: var(--text-secondary);
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0 0 1rem 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--text-muted);
        }

        .post-author {
          font-weight: 500;
        }

        .no-posts {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
        }

        .no-posts-icon {
          font-size: 4rem;
          display: block;
          margin-bottom: 1rem;
        }
        .no-posts h3 {
          margin-bottom: 0.5rem;
        }
        .no-posts p {
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .posts-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 640px) {
          .posts-grid {
            grid-template-columns: 1fr;
          }
          .page-header {
            padding: 2rem 0;
          }
        }
      `}</style>
    </>
  );
}
