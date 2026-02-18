import Link from "next/link";

export default function Home() {
  return (
    <div className="hero min-h-[80vh] bg-base-100">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Manage Products with <span className="text-primary">Ease</span>
          </h1>
          <p className="py-6 text-lg text-base-content/80 leading-relaxed">
            NextPrismaJS helps you organize, track, and manage your product inventory seamlessly. 
            Built with the power of Next.js 15, Prisma, and Tailwind CSS.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products" className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transition-all">
              Get Started
            </Link>
            <Link href="https://nextjs.org" target="_blank" className="btn btn-ghost btn-lg">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}