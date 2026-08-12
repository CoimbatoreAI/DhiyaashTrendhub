import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { MapPin, Phone, Mail, FileText } from "lucide-react";

export default function Contact() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent! We'll get back to you soon.");
    }, 700);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Contact</span>
        <h1 className="mt-2 font-serif text-4xl text-foreground sm:text-5xl">Let's talk.</h1>
        <p className="mt-3 text-muted-foreground">
          Questions about a product, bulk return gifts, or a custom hamper? Send us a note — we
          usually reply within a business day.
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required />
            <Field label="Email" name="email" type="email" required />
          </div>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Message *
            </span>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
            />
          </label>
          <button
            type="submit"
            disabled={sending}
            className="btn-gold inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          >
            {sending ? "Sending..." : "Send Message"}
          </button>
        </form>

        <div className="rounded-2xl bg-charcoal p-6 text-primary-foreground sm:p-8">
          <h2 className="font-serif text-2xl">Reach us directly</h2>
          <ul className="mt-6 space-y-5 text-sm">
            <InfoRow icon={<MapPin className="h-5 w-5 text-gold" />} title="Address">
              8/4084-B, Iyyappa Nagar, 7th Street,
              <br />
              Boyampalayam, Tirupur - 641 602.
            </InfoRow>
            <InfoRow icon={<Phone className="h-5 w-5 text-gold" />} title="Phone">
              <a href="tel:+919789107642" className="hover:text-gold">
                +91 97891 07642
              </a>
            </InfoRow>
            <InfoRow icon={<Mail className="h-5 w-5 text-gold" />} title="Email">
              <a href="mailto:dhiyaashtrendhub@gmail.com" className="hover:text-gold break-all">
                dhiyaashtrendhub@gmail.com
              </a>
            </InfoRow>
            <InfoRow icon={<FileText className="h-5 w-5 text-gold" />} title="GSTIN">
              33APQPL1236A1ZG
            </InfoRow>
          </ul>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex gap-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/5">
        {icon}
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60">
          {title}
        </div>
        <div className="mt-1 text-primary-foreground/90">{children}</div>
      </div>
    </li>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && " *"}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-gold focus:ring-2 focus:ring-gold/30"
      />
    </label>
  );
}
