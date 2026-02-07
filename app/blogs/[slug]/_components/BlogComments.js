"use client";

import { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useTranslations } from "@/app/_components/I18nProvider";

export default function BlogComments({ blogSlug, locale: localeProp }) {
  const { t, locale: contextLocale } = useTranslations();
  const locale = localeProp ?? contextLocale ?? "tr";
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState({ author_name: "", author_email: "", content: "" });

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/blogs/slug/${blogSlug}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      } else setComments([]);
    } catch {
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (blogSlug) fetchComments();
  }, [blogSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { author_name, author_email, content } = form;
    if (!author_name?.trim() || !author_email?.trim() || !content?.trim()) {
      setMessage({ type: "error", text: t("blog.commentErrorRequired") });
      return;
    }
    setSubmitLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`/api/blogs/slug/${blogSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_name: author_name.trim(),
          author_email: author_email.trim(),
          content: content.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage({ type: "success", text: data.message || t("blog.commentSuccess") });
        setForm({ author_name: "", author_email: "", content: "" });
      } else {
        setMessage({ type: "error", text: data.error || t("blog.commentErrorSubmit") });
      }
    } catch {
      setMessage({ type: "error", text: t("blog.commentErrorGeneric") });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-600">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{t("blog.commentsTitle")}</h2>

      {comments.length > 0 && (
        <ul className="space-y-4 mb-8">
          {comments.map((c) => (
            <li key={c.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-100 dark:border-gray-600">
              <p className="font-medium text-gray-900 dark:text-white">{c.author_name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {new Date(c.created_at).toLocaleString(locale === "en" ? "en-GB" : "tr-TR", { dateStyle: "medium", timeStyle: "short" })}
              </p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{c.content}</p>
            </li>
          ))}
        </ul>
      )}

      {!loading && comments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{t("blog.noCommentsYet")}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="comment-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("blog.commentName")} <span className="text-red-500">*</span>
            </label>
            <InputText
              id="comment-name"
              value={form.author_name}
              onChange={(e) => setForm((f) => ({ ...f, author_name: e.target.value }))}
              className="w-full"
              placeholder={t("blog.commentName")}
              maxLength={255}
            />
          </div>
          <div>
            <label htmlFor="comment-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("blog.commentEmail")} <span className="text-red-500">*</span>
            </label>
            <InputText
              id="comment-email"
              type="email"
              value={form.author_email}
              onChange={(e) => setForm((f) => ({ ...f, author_email: e.target.value }))}
              className="w-full"
              placeholder="ornek@email.com"
              maxLength={255}
            />
          </div>
        </div>
        <div>
          <label htmlFor="comment-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t("blog.commentContent")} <span className="text-red-500">*</span>
          </label>
          <InputTextarea
            id="comment-content"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            className="w-full"
            rows={4}
            placeholder={t("blog.commentPlaceholder")}
          />
        </div>
        {message.text && (
          <p className={message.type === "error" ? "text-red-600 text-sm" : "text-green-600 text-sm"}>
            {message.text}
          </p>
        )}
        <Button
          type="submit"
          label={t("blog.commentSubmit")}
          icon="pi pi-send"
          loading={submitLoading}
          className="bg-primary-500 hover:bg-primary-600 border-primary-500"
        />
      </form>
    </div>
  );
}
