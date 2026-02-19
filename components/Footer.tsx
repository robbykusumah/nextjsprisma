import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer footer-center p-10 bg-base-100 text-base-content rounded mt-10 border-t border-base-200">
      <nav className="grid grid-flow-col gap-4">
        <Link href="/products" className="link link-hover text-neutral/80 hover:text-primary transition-colors">Products</Link>
        <Link href="/about" className="link link-hover text-neutral/80 hover:text-primary transition-colors">About</Link>
        <Link href="/contact" className="link link-hover text-neutral/80 hover:text-primary transition-colors">Contact</Link>
      </nav> 
      <aside>
        <p className="text-neutral/60 text-sm">Copyright © 2026 - All right reserved by StockPilot Industries</p>
      </aside>
    </footer>
  );
}
