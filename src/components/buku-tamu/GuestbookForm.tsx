"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AccentButton } from "@/components/ui/AccentButton";

const MAX_CHARS = 140;

export function GuestbookForm() {
  const t = useTranslations("guestbook");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <SectionTitle
          title={t("title")}
          subtitle={t("subtitle")}
          accent="pink"
          showPolkadots
        />

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="brutal-card overflow-hidden"
        >
          <div className="border-b-[3px] border-border bg-accent-4 px-6 py-5 sm:px-8">
            <h2 className="text-sm font-semibold">{t("formTitle")}</h2>
            <p className="mt-1 text-xs text-muted">{t("formDescription")}</p>
          </div>

          <div className="space-y-6 p-6 sm:p-8">
            <motion.div animate={{ scale: focused === "name" ? 1.01 : 1 }}>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-semibold text-muted"
              >
                {t("nameLabel")}
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                placeholder={t("namePlaceholder")}
                className="w-full rounded-xl border-2 border-border bg-bg px-4 py-3.5 text-sm font-medium transition-all placeholder:text-muted/50"
              />
            </motion.div>

            <motion.div animate={{ scale: focused === "message" ? 1.01 : 1 }}>
              <label
                htmlFor="message"
                className="mb-2 block text-xs font-semibold text-muted"
              >
                {t("messageLabel")}
              </label>
              <div className="relative">
                <textarea
                  id="message"
                  required
                  rows={5}
                  maxLength={MAX_CHARS}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  placeholder={t("messagePlaceholder")}
                  className="w-full resize-none rounded-xl border-2 border-border bg-bg px-4 py-3.5 text-sm font-medium transition-all placeholder:text-muted/50"
                />
                <motion.span
                  animate={{
                    color:
                      message.length > MAX_CHARS * 0.8
                        ? "var(--accent)"
                        : "var(--muted)",
                  }}
                  className="absolute bottom-3 right-3 text-xs font-medium"
                >
                  {message.length}/{MAX_CHARS}
                </motion.span>
              </div>
            </motion.div>

            <AccentButton type="submit" variant="primary" className="w-full">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.span
                    key="done"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle size={16} />
                    {t("submitted")}
                  </motion.span>
                ) : (
                  <motion.span
                    key="send"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    {t("submit")}
                    <Send size={15} />
                  </motion.span>
                )}
              </AnimatePresence>
            </AccentButton>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
