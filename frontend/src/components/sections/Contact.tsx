"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { INITIAL, socials } from "@/lib/data";
import { FieldProps, FormErrors, FormState } from "@/lib/interface";


function validate(values: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.message.trim()) {
    errors.message = "Message is required.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

export function Contact() {
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setValues(INITIAL);
    } else {
      setSubmitted(false);
    }
  }


  return (
    <Section id="contact" className="border-t border-border">
      <SectionHeader
        eyebrow="Contact"
        title="Let's build something resilient"
        description="Open to roles and collaborations spanning full-stack product work and real-time data systems."
      />

      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45 }}
          className="lg:col-span-4"
        >
          <p className="text-sm leading-relaxed text-muted">
            Prefer a direct channel? Reach out on GitHub, LinkedIn, or email—I
            typically respond within a few business days.
          </p>
          <ul className="mt-8 flex flex-col gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={
                    href.startsWith("mailto:")
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className="inline-flex items-center gap-3 text-sm text-foreground transition-colors hover:text-accent"
                >
                  <Icon size={16} strokeWidth={1.75} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.form
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="border border-border bg-surface p-6 sm:p-8 lg:col-span-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="name"
              label="Name"
              value={values.name}
              error={errors.name}
              onChange={(name) => setValues((v) => ({ ...v, name }))}
            />
            <Field
              id="email"
              label="Email"
              type="email"
              value={values.email}
              error={errors.email}
              onChange={(email) => setValues((v) => ({ ...v, email }))}
            />
          </div>

          <div className="mt-5">
            <label
              htmlFor="message"
              className="mb-2 block font-mono text-[11px] tracking-[0.16em] text-muted uppercase"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              value={values.message}
              onChange={(e) =>
                setValues((v) => ({ ...v, message: e.target.value }))
              }
              className={`w-full resize-y border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent ${
                errors.message ? "border-danger" : "border-border"
              }`}
              placeholder="Tell me about the role, system, or problem you're solving…"
            />
            {errors.message ? (
              <p className="mt-1.5 text-xs text-danger">{errors.message}</p>
            ) : null}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-foreground px-5 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Send message
              <Send size={14} />
            </button>
            {submitted ? (
              <motion.p
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-sm text-accent"
              >
                Thanks — your message looks good. Wire this form to your backend
                or email service when ready.
              </motion.p>
            ) : null}
          </div>
        </motion.form>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  value,
  error,
  type = "text",
  onChange,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-mono text-[11px] tracking-[0.16em] text-muted uppercase"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full border bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/50 focus:border-accent ${
          error ? "border-danger" : "border-border"
        }`}
      />
      {error ? <p className="mt-1.5 text-xs text-danger">{error}</p> : null}
    </div>
  );
}
