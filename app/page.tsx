import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-base-100">
      <div className="text-center max-w-4xl px-4">
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-neutral">
          Stock<span className="text-primary">Pilot</span>
        </h1>
        
        <p className="py-2 text-xl md:text-2xl text-neutral/80 leading-relaxed mb-12 max-w-2xl mx-auto">
          Sistem manajemen stok yang simpel, cepat, dan terpercaya.
        </p>
        
        <div className="flex gap-6 justify-center mb-20">
          <Link href="/products" className="btn btn-primary btn-wide text-lg font-normal py-3 h-auto shadow-none rounded-none hover:bg-primary-focus transition-colors">
            Mulai Kelola
          </Link>
          <Link href="/admin/users" className="btn btn-ghost btn-wide text-lg font-normal py-3 h-auto hover:bg-transparent hover:underline rounded-none">
            Lihat Demo Admin →
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-primary">⚡ Real-time Update</h3>
              <p className="text-base-content/70">Data stok selalu mutakhir. Tidak ada lagi selisih hitungan.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-secondary">🛡️ Aman & Terpercaya</h3>
              <p className="text-base-content/70">Didukung database cloud yang aman dengan backup otomatis.</p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-accent">👥 Multi-User</h3>
              <p className="text-base-content/70">Kolaborasi tim mulus. Pantau siapa yang input data.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}