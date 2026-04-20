"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// ─── Noise canvas ─────────────────────────────────────────────────────────────
function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    setSize();
    window.addEventListener("resize", setSize);
    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255 * 0.035;
        imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = v;
        imageData.data[i+3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", setSize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />;
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 120 }: { size?: number }) {
  return (
    <Image
      src="/image.png"
      alt="The X Parallel"
      width={size}
      height={Math.round(size * 0.947)}
      className="h-auto w-auto select-none"
      priority
    />
  );
}

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({
  label, type = "text", placeholder, value, onChange, id,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; id: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[10px] tracking-[0.35em] text-white/40 uppercase font-black">
        {label}
      </label>
      <div className={`relative border transition-all duration-200 ${focused ? "border-red-600/70" : "border-white/10"}`}>
        {/* corner accents */}
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-white/[0.03] px-4 py-3 text-white text-sm tracking-wide placeholder:text-white/20 outline-none"
          style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
        />
      </div>
    </div>
  );
}

// ─── Login page ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1500);
  };

  return (
    <div
      className="bg-black text-white min-h-screen flex flex-col overflow-hidden relative"
      style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseRed { 0%,100%{opacity:.12} 50%{opacity:.28} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .a1{animation:fadeUp .8s ease both .1s}
        .a2{animation:fadeUp .8s ease both .25s}
        .a3{animation:fadeUp .8s ease both .4s}
        .a4{animation:fadeUp .8s ease both .55s}
      `}</style>

      <NoiseCanvas />

      {/* Rotating X bg */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div style={{ width:700, height:700, animation:"spinSlow 60s linear infinite", opacity:.03 }}>
          <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
            <line x1="5" y1="5" x2="95" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
            <line x1="95" y1="5" x2="5" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Red glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div style={{ width:500, height:500, background:"radial-gradient(circle,rgba(180,0,0,.15) 0%,transparent 70%)", animation:"pulseRed 4s ease-in-out infinite" }} />
      </div>

      {/* Scanline */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div style={{ position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(transparent,rgba(255,255,255,.03),transparent)", animation:"scanline 6s linear infinite" }} />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 a1">
        <Link href="/" className="flex items-center gap-2 text-white/30 hover:text-white/60 transition-colors text-[10px] tracking-[0.35em] uppercase">
          ← Retour
        </Link>
        <span className="text-[9px] tracking-[0.45em] text-white/20 uppercase">thexparallel.com</span>
      </header>

      {/* Main */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="flex flex-col items-center mb-10 a1">
            <Logo size={110} />
            <p className="text-white/20 tracking-[0.5em] text-[9px] uppercase mt-2">Between Art & Fiction</p>
          </div>

          {/* Card */}
          <div className="relative border border-white/8 bg-white/[0.02] p-8 a2">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

            <div className="mb-7">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-px w-6 bg-red-600/50" />
                <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Accès membre</span>
              </div>
              <h1 className="text-3xl font-black uppercase tracking-tight">Connexion</h1>
            </div>

            {done ? (
              <div className="flex flex-col items-center gap-3 py-6 a3">
                <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                <p className="text-white/60 text-sm tracking-wider text-center">Signal reçu.<br/>Accès en cours...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5 a3">
                <Field id="email"    label="Adresse e-mail" type="email"    placeholder="vous@exemple.com" value={email}    onChange={setEmail}    />
                <Field id="password" label="Mot de passe"   type="password" placeholder="••••••••"         value={password} onChange={setPassword} />

                <div className="flex justify-end">
  <Link
    href="forgot-password/page.tsx"
    className="text-[10px] tracking-[0.3em] text-white/30 uppercase hover:text-red-500 transition-colors"
  >
    Mot de passe oublié ?
  </Link>
</div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 mt-2 overflow-hidden"
                >
                  <span className={loading ? "opacity-0" : ""}>Entrer</span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center gap-1">
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                      <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
                </button>
              </form>
            )}
          </div>

          {/* Switch to register */}
          <div className="a4 text-center mt-6">
            <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Pas encore membre ? </span>
            <Link href="/register" className="text-red-500 text-[10px] tracking-[0.3em] uppercase font-black hover:text-red-400 transition-colors">
              S&apos;inscrire →
            </Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase">© The X Parallel — Strictement Confidentiel</p>
      </footer>
    </div>
  );
}
