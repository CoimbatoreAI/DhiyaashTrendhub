import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, FileText } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-charcoal text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Dhiyaash Trendhub"
              className="h-16 w-auto object-contain bg-white/10 rounded-full p-2"
            />
          </div>
          <p className="mt-4 max-w-sm text-sm text-primary-foreground/70">
            Premium curations for your home, kitchen, and gifting moments. Thoughtfully sourced,
            beautifully packed.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Explore
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li>
              <Link to="/" className="hover:text-gold">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-gold">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-gold">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Reach Us
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>8/4084-B, Iyyappa Nagar, 7th Street, Boyampalayam, Tirupur - 641 602.</span>
            </li>
            <li className="flex gap-3">
              <Phone className="h-4 w-4 shrink-0 text-gold" />
              <a href="tel:+919789107642" className="hover:text-gold">
                +91 97891 07642
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="h-4 w-4 shrink-0 text-gold" />
              <a href="mailto:dhiyaashtrendhub@gmail.com" className="hover:text-gold break-all">
                dhiyaashtrendhub@gmail.com
              </a>
            </li>
            <li className="flex gap-3">
              <FileText className="h-4 w-4 shrink-0 text-gold" />
              <span>GSTIN: 33APQPL1236A1ZG</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-xs text-primary-foreground/60 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Dhiyaash Trendhub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
