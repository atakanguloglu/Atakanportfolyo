"use client";

import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

const inputClass =
  "border-0 border-b border-gray-300 dark:border-gray-500 dark:bg-transparent dark:text-gray-100 dark:placeholder-gray-400 focus:border-primary-500 rounded-none focus:outline-none focus:shadow-none focus:placeholder-primary-500 pl-0 w-full";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    budget: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ type: "success", text: data.message || "Mesajınız alındı." });
        setForm({ name: "", email: "", location: "", budget: "", subject: "", message: "" });
      } else {
        setResult({ type: "error", text: data.error || "Bir hata oluştu." });
      }
    } catch (err) {
      setResult({ type: "error", text: "Bağlantı hatası. Veritabanı ayarlarını kontrol edin." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-fluid flex flex-col gap-2 pl-0 -ml-2 max-w-full">
      <InputText
        className={inputClass}
        placeholder="Ad*"
        value={form.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
      />
      <InputText
        className={inputClass}
        placeholder="E-posta*"
        type="email"
        value={form.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
      />
      <InputText
        className={inputClass}
        placeholder="Konum"
        value={form.location}
        onChange={(e) => handleChange("location", e.target.value)}
      />
      <div className="flex gap-6">
        <div className="w-1/3">
          <InputText
            className={inputClass}
            placeholder="Bütçe*"
            value={form.budget}
            onChange={(e) => handleChange("budget", e.target.value)}
          />
        </div>
        <div className="w-2/3">
          <InputText
            className={inputClass}
            placeholder="Konu*"
            value={form.subject}
            onChange={(e) => handleChange("subject", e.target.value)}
          />
        </div>
      </div>
      <InputTextarea
        className={inputClass}
        placeholder="Mesaj*"
        rows={5}
        cols={30}
        value={form.message}
        onChange={(e) => handleChange("message", e.target.value)}
      />
      {result && (
        <Message
          severity={result.type === "success" ? "success" : "error"}
          text={result.text}
        />
      )}
      <Button
        type="submit"
        className="bg-primary-500 hover:bg-primary-600 border-primary-500 hover:border-primary-600 mt-9"
        label={loading ? "Gönderiliyor..." : "Gönder"}
        icon="pi pi-send"
        iconPos="right"
        loading={loading}
        disabled={loading}
      />
    </form>
  );
}
