"use client";

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from "react";
import { getDb, isFirebaseConfigured } from "@/lib/firebase";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStatus("sending");
    setError("");

    try {
      if (!isFirebaseConfigured()) {
        throw new Error("Formularz nie jest jeszcze podłączony do Firebase.");
      }
      await addDoc(collection(getDb(), "messages"), {
        name: String(form.get("name") ?? "").slice(0, 100),
        email: String(form.get("email") ?? "").slice(0, 200),
        message: String(form.get("message") ?? "").slice(0, 5000),
        createdAt: serverTimestamp(),
      });
      setStatus("sent");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nie udało się wysłać wiadomości.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p className="mt-8 border-l-4 border-brand bg-neutral-50 p-5 text-ink">
        Dziękujemy! Wiadomość dotarła, odpowiemy najszybciej, jak to możliwe.
      </p>
    );
  }

  return (
    <form className="mt-8 max-w-xl space-y-5" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-black">
          Imię
        </label>
        <input
          id="name"
          name="name"
          required
          maxLength={100}
          className="mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-black">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          className="mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-black">
          Wiadomość
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          required
          maxLength={5000}
          className="mt-1.5 w-full rounded border border-neutral-300 px-4 py-2.5 focus:border-brand focus:outline-none"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-brand px-6 py-3 text-sm text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {status === "sending" ? "Wysyłanie..." : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
