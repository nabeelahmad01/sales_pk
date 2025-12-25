"use client";

import { useState, useRef } from "react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  type?: "sales" | "brands" | "general";
  currentImage?: string;
  label?: string;
}

export default function ImageUpload({
  onUpload,
  type = "general",
  currentImage,
  label = "Upload Image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string>(currentImage || "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File too large. Maximum size is 5MB.");
      return;
    }

    setError("");
    setUploading(true);

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        onUpload(data.data.url);
      } else {
        setError(data.error || "Upload failed");
        setPreview(currentImage || "");
      }
    } catch (err) {
      setError("Upload failed. Please try again.");
      setPreview(currentImage || "");
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setPreview("");
    onUpload("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="image-upload">
      <label className="upload-label">{label}</label>

      <div
        className={`upload-area ${dragActive ? "drag-active" : ""} ${
          preview ? "has-preview" : ""
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleChange}
          className="file-input"
        />

        {preview ? (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
            {uploading && (
              <div className="upload-overlay">
                <div className="spinner"></div>
                <span>Uploading...</span>
              </div>
            )}
          </div>
        ) : (
          <div className="upload-placeholder">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="upload-text">
              {uploading
                ? "Uploading..."
                : "Drag & drop an image or click to browse"}
            </p>
            <span className="upload-hint">JPEG, PNG, WebP, GIF • Max 5MB</span>
          </div>
        )}
      </div>

      {preview && !uploading && (
        <button type="button" className="remove-btn" onClick={handleRemove}>
          Remove Image
        </button>
      )}

      {error && <p className="error-message">{error}</p>}

      <style jsx>{`
        .image-upload {
          margin-bottom: 1.5rem;
        }

        .upload-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .upload-area {
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 2rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: var(--bg-light);
        }

        .upload-area:hover,
        .upload-area.drag-active {
          border-color: var(--primary-purple);
          background: rgba(139, 92, 246, 0.05);
        }

        .upload-area.has-preview {
          padding: 0;
          border-style: solid;
        }

        .file-input {
          display: none;
        }

        .upload-placeholder {
          color: var(--text-secondary);
        }

        .upload-placeholder svg {
          margin: 0 auto 1rem;
          opacity: 0.5;
        }

        .upload-text {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .upload-hint {
          font-size: 0.75rem;
          opacity: 0.7;
        }

        .preview-container {
          position: relative;
          width: 100%;
        }

        .preview-image {
          width: 100%;
          max-height: 300px;
          object-fit: cover;
          border-radius: var(--radius-lg);
        }

        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          border-radius: var(--radius-lg);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 0.5rem;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .remove-btn {
          margin-top: 0.75rem;
          padding: 0.5rem 1rem;
          background: none;
          border: 1px solid #ef4444;
          color: #ef4444;
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-btn:hover {
          background: #ef4444;
          color: white;
        }

        .error-message {
          color: #ef4444;
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }
      `}</style>
    </div>
  );
}
