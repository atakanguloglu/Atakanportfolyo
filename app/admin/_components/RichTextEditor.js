"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { createPortal } from "react-dom";

const EMOJIS = ["😀", "👍", "❤️", "🔥", "✨", "💡", "📌", "✅", "🎉", "👋", "📝", "🚀", "💻", "📚", "⭐", "🙏"];

export default function RichTextEditor({ value = "", onChange, placeholder = "İçerik yazın...", minHeight = 280 }) {
  const editorRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const isInternal = useRef(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    if (isInternal.current) {
      isInternal.current = false;
      return;
    }
    const v = value ?? "";
    if (el.innerHTML !== v) {
      el.innerHTML = v;
    }
  }, [value]);

  const notify = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    isInternal.current = true;
    onChange(html);
  }, [onChange]);

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    notify();
  };

  const insertEmoji = (emoji) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    document.execCommand("insertText", false, emoji);
    notify();
    setShowEmojiPicker(false);
  };

  const setHeading = (level) => {
    if (level === "p") {
      exec("formatBlock", "<p>");
    } else {
      exec("formatBlock", `<h${level}>`);
    }
  };

  const insertLink = () => {
    const url = prompt("Link URL'si girin:");
    if (url) {
      exec("createLink", url);
    }
  };

  const insertImage = () => {
    const url = prompt("Görsel URL'si girin:");
    if (url) {
      exec("insertImage", url);
    }
  };

  const openEmojiPicker = () => {
    if (emojiButtonRef.current) {
      const rect = emojiButtonRef.current.getBoundingClientRect();
      const popoverHeight = 100;
      const gap = 8;
      setEmojiPickerPosition({
        top: rect.top - popoverHeight - gap,
        left: rect.left,
      });
    }
    setShowEmojiPicker(true);
  };

  return (
    <div className="rich-editor-wrapper rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2.5 bg-gray-50 border-b border-gray-200">
        {/* Başlık Seçimi */}
        <select
          onChange={(e) => {
            const v = e.target.value;
            if (v) setHeading(v);
            e.target.value = "";
          }}
          className="text-sm border border-gray-200 rounded-md px-2.5 py-1.5 bg-white text-gray-700 hover:border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/30 outline-none transition-shadow"
          title="Başlık türü"
        >
          <option value="">Başlık</option>
          <option value="p">Normal metin</option>
          <option value="1">Başlık 1</option>
          <option value="2">Başlık 2</option>
          <option value="3">Başlık 3</option>
          <option value="4">Başlık 4</option>
        </select>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Metin Biçimlendirme */}
        <button
          type="button"
          onClick={() => exec("bold")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Kalın (Ctrl+B)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 5a3 3 0 00-3-3H5v14h4a4.5 4.5 0 001-8.92A3.5 3.5 0 0011 5z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("italic")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="İtalik (Ctrl+I)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2L8 18h2l2-16z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("underline")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Altı çizili (Ctrl+U)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 3v7a4 4 0 008 0V3h-2v7a2 2 0 01-4 0V3H6zm-1 14h10v2H5v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("strikeThrough")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors font-bold line-through"
          title="Üstü çizili"
        >
          S
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Listeler */}
        <button
          type="button"
          onClick={() => exec("insertUnorderedList")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Madde işaretli liste"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 100 2 1 1 0 000-2zm4 1h10v1H7V5zm-4 4a1 1 0 100 2 1 1 0 000-2zm4 1h10v1H7v-1zm-4 4a1 1 0 100 2 1 1 0 000-2zm4 1h10v1H7v-1z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("insertOrderedList")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Numaralı liste"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h1v3H3V4zm0 5h1.5v1H3v1h2V9.5a.5.5 0 00-.5-.5H3V9zm0 5h2v1H3v1h2.5v-.5a.5.5 0 00-.5-.5H4v-1h1v-.5H3v1zM7 5h10v1H7V5zm0 5h10v1H7v-1zm0 5h10v1H7v-1z" />
          </svg>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Hizalama */}
        <button
          type="button"
          onClick={() => exec("justifyLeft")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Sola hizala"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm0 4h10v2H3V8zm0 4h14v2H3v-2zm0 4h10v2H3v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("justifyCenter")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Ortala"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm2 4h10v2H5V8zm-2 4h14v2H3v-2zm2 4h10v2H5v-2z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => exec("justifyRight")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Sağa hizala"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4h14v2H3V4zm4 4h10v2H7V8zm-4 4h14v2H3v-2zm4 4h10v2H7v-2z" />
          </svg>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Link ve Görsel */}
        <button
          type="button"
          onClick={insertLink}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Link ekle"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={insertImage}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Görsel ekle"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
          </svg>
        </button>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Emoji Picker */}
        <div className="relative">
          <button
            ref={emojiButtonRef}
            type="button"
            onClick={() => (showEmojiPicker ? setShowEmojiPicker(false) : openEmojiPicker())}
            className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 transition-colors text-base leading-none"
            title="Emoji ekle"
          >
            😀
          </button>
          {showEmojiPicker &&
            typeof document !== "undefined" &&
            createPortal(
              <>
                <div
                  className="fixed inset-0 z-[9998]"
                  onClick={() => setShowEmojiPicker(false)}
                  aria-hidden
                />
                <div
                  className="emoji-picker-popover fixed p-2 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                  style={{
                    top: emojiPickerPosition.top,
                    left: emojiPickerPosition.left,
                  }}
                >
                  <div className="emoji-picker-grid">
                    {EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => insertEmoji(emoji)}
                        className="emoji-picker-cell"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </>,
              document.body
            )}
        </div>

        <span className="w-px h-5 bg-gray-300 mx-1" aria-hidden />

        {/* Temizle */}
        <button
          type="button"
          onClick={() => exec("removeFormat")}
          className="p-2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-200 text-gray-700 transition-colors"
          title="Biçimlendirmeyi temizle"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L10 11.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3z" />
          </svg>
        </button>
      </div>

      {/* Editor Alanı */}
      <div
        ref={editorRef}
        contentEditable
        className="rich-editor-body w-full px-5 py-4 text-gray-800 outline-none prose prose-sm max-w-none focus:ring-2 focus:ring-primary-500/20 focus:ring-inset transition-shadow"
        style={{ minHeight: `${minHeight}px` }}
        data-placeholder={placeholder}
        onInput={notify}
        onBlur={notify}
        suppressContentEditableWarning
      />

      <style jsx>{`
        .rich-editor-body:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
        .rich-editor-body h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        .rich-editor-body h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        .rich-editor-body h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        .rich-editor-body h4 {
          font-size: 1em;
          font-weight: bold;
          margin: 1em 0;
        }
        .rich-editor-body p {
          margin: 1em 0;
        }
        .rich-editor-body ul,
        .rich-editor-body ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .rich-editor-body ul {
          list-style-type: disc;
        }
        .rich-editor-body ol {
          list-style-type: decimal;
        }
        .rich-editor-body li {
          margin: 0.5em 0;
        }
        .rich-editor-body a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .rich-editor-body img {
          max-width: 100%;
          height: auto;
          margin: 1em 0;
          border-radius: 0.5rem;
        }
        .rich-editor-body blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1em;
          margin: 1em 0;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
