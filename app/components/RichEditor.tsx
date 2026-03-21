'use client';

import { useEffect, useRef } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

// Quill is loaded once via CDN and cached on window
let quillLoaded = false;
let quillLoadPromise: Promise<void> | null = null;

function loadQuill(): Promise<void> {
  if (quillLoaded) return Promise.resolve();
  if (quillLoadPromise) return quillLoadPromise;

  quillLoadPromise = new Promise((resolve) => {
    // Load Quill CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.snow.min.css';
    document.head.appendChild(link);

    // Load Quill JS
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/quill/1.3.7/quill.min.js';
    script.onload = () => {
      quillLoaded = true;
      resolve();
    };
    document.head.appendChild(script);
  });

  return quillLoadPromise;
}

export default function RichEditor({
  value,
  onChange,
  placeholder = 'Write content here...',
  minHeight = 200,
}: RichEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    loadQuill().then(() => {
      if (!containerRef.current || quillRef.current) return;

      const Quill = (window as any).Quill;
      if (!Quill) return;

      quillRef.current = new Quill(containerRef.current, {
        theme: 'snow',
        placeholder,
        modules: {
          toolbar: [
            [{ header: [2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link'],
            ['clean'],
          ],
        },
      });

      // Set initial value
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Emit changes
      quillRef.current.on('text-change', () => {
        isInternalChange.current = true;
        const html = quillRef.current.root.innerHTML;
        // Treat empty editor as empty string
        onChange(html === '<p><br></p>' ? '' : html);
        isInternalChange.current = false;
      });
    });

    return () => {
      quillRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. when switching edit targets)
  useEffect(() => {
    if (!quillRef.current || isInternalChange.current) return;
    const current = quillRef.current.root.innerHTML;
    const normalised = current === '<p><br></p>' ? '' : current;
    if (normalised !== value) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div className="rich-editor-wrapper">
      <style>{`
        .rich-editor-wrapper .ql-toolbar {
          background: rgba(10, 14, 39, 0.8);
          border: 1px solid rgba(77, 184, 255, 0.3) !important;
          border-bottom: none !important;
          border-radius: 4px 4px 0 0;
        }
        .rich-editor-wrapper .ql-toolbar .ql-stroke {
          stroke: #aaa;
        }
        .rich-editor-wrapper .ql-toolbar .ql-fill {
          fill: #aaa;
        }
        .rich-editor-wrapper .ql-toolbar .ql-picker {
          color: #aaa;
        }
        .rich-editor-wrapper .ql-toolbar button:hover .ql-stroke,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-stroke {
          stroke: #4db8ff;
        }
        .rich-editor-wrapper .ql-toolbar button:hover .ql-fill,
        .rich-editor-wrapper .ql-toolbar button.ql-active .ql-fill {
          fill: #4db8ff;
        }
        .rich-editor-wrapper .ql-toolbar .ql-picker-label:hover,
        .rich-editor-wrapper .ql-toolbar .ql-picker-item:hover {
          color: #4db8ff;
        }
        .rich-editor-wrapper .ql-container {
          background: rgba(10, 14, 39, 0.6);
          border: 1px solid rgba(77, 184, 255, 0.3) !important;
          border-radius: 0 0 4px 4px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 0.95rem;
          min-height: ${minHeight}px;
        }
        .rich-editor-wrapper .ql-editor {
          color: #e0e0e0;
          min-height: ${minHeight}px;
          line-height: 1.6;
        }
        .rich-editor-wrapper .ql-editor.ql-blank::before {
          color: #555;
          font-style: normal;
        }
        .rich-editor-wrapper .ql-editor a {
          color: #4db8ff;
        }
        .rich-editor-wrapper .ql-editor ul,
        .rich-editor-wrapper .ql-editor ol {
          padding-left: 1.5rem;
        }
        .rich-editor-wrapper .ql-picker-options {
          background: #16213e !important;
          border: 1px solid rgba(77, 184, 255, 0.3) !important;
        }
        .rich-editor-wrapper .ql-picker-item {
          color: #aaa !important;
        }
      `}</style>
      <div ref={containerRef} />
    </div>
  );
}
