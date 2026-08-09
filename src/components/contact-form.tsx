"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <p className="mt-8 rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-900">
        Dziękujemy! Wiadomość została zapisana — odpowiemy najszybciej, jak to możliwe.
      </p>
    );
  }

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-emerald-900">
          Imię
        </label>
        <input
          id="name"
          name="name"
          required
          className="mt-1.5 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-emerald-900">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1.5 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 outline-none focus:border-emerald-600"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-emerald-900">
          Wiadomość
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="mt-1.5 w-full rounded-xl border border-emerald-900/15 bg-white px-4 py-2.5 outline-none focus:border-emerald-600"
        />
      </div>
      <button
        type="submit"
        className="rounded-full bg-emerald-800 px-6 py-2.5 text-sm font-medium text-emerald-50 transition hover:bg-emerald-900"
      >
        Wyślij wiadomość
      </button>
      <p className="text-xs text-emerald-900/60">
        Formularz jest demonstracyjny — wiadomość nie jest jeszcze wysyłana na serwer.
      </p>
    </form>
  );
}
