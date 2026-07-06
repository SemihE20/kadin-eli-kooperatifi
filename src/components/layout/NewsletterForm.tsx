"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });

    if (error) {
      if (error.code === "23505") {
        setStatus("success");
        setMessage("Bu e-posta zaten abone listemizde.");
      } else {
        setStatus("error");
        setMessage("Bir şeyler ters gitti. Lütfen tekrar deneyin.");
      }
      return;
    }

    setStatus("success");
    setMessage("Bültenimize başarıyla abone oldunuz!");
    setEmail("");
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-posta adresiniz"
          className="flex-1 min-w-0 px-4 py-2.5 text-sm rounded-xl border border-earth-700 bg-earth-800 text-cream-100 placeholder:text-earth-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-5 py-2.5 bg-primary-700 text-white text-sm font-medium rounded-xl hover:bg-primary-800 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
        >
          {status === "loading" ? "..." : "Abone Ol"}
        </button>
      </form>
      {message && (
        <p className={`mt-2 text-xs ${status === "error" ? "text-red-400" : "text-primary-300"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
