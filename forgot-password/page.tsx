"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

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

function Logo({ size = 120 }: { size?: number }) {
  const f = "'Barlow Condensed','Arial Narrow',sans-serif";
  return (
    <svg width={size} height={size * 0.52} viewBox="0 0 315 164" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="0"   y="68"  fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">THE</text>
      <text x="120" y="68"  fontFamily={f} fontWeight="900" fontSize="62" fill="#CC0000">X</text>
      <text x="0"   y="150" fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">PARA</text>
      <rect x="156" y="90" width="9" height="62" fill="#CC0000" rx="1"/>
      <rect x="170" y="90" width="9" height="62" fill="#CC0000" rx="1"/>
      <text x="182" y="150" fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">LEL</text>
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const [error,   setError]   = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) { setError("L'email est requis."); return; }

    setLoading(true);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          // Supabase redirigera vers cette URL apres le clic dans l'email
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        return;
      }

      setDone(true);
    } catch (err) {
      console.error(err);
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden relative"
      style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseRed { 0%,100%{opacity:.12} 50%{opacity:.28} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .a1{animation:fadeUp .8s ease both .1s}
        .a2{animation:fadeUp .8s ease both .25s}
        .a3{animation:fadeUp .8s ease both .4s}
      `}</style>

      <NoiseCanvas />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div style={{ width:700, height:700, animation:"spinSlow 60s linear infinite", opacity:.03 }}>
          <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
            <line x1="5" y1="5" x2="95" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
            <line x1="95" y1="5" x2="5" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div style={{ width:500, height:500, background:"radial-gradient(circle,rgba(180,0,0,.15) 0%,transparent 70%)", animation:"pulseRed 4s ease-in-out infinite" }} />
      </div>

      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div style={{ position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(transparent,rgba(255,255,255,.03),transparent)", animation:"scanline 6s linear infinite" }} />
      </div>

      <header className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 a1">
        <Link href="/login" className="text-white/30 hover:text-white/60 transition-colors text-[10px] tracking-[0.35em] uppercase">
          &larr; Connexion
        </Link>
        <span className="text-[9px] tracking-[0.45em] text-white/20 uppercase">thexparallel.com</span>
      </header>

      <main className="relative z-20 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          <div className="flex flex-col items-center mb-10 a1">
            <Logo size={110} />
            <p className="text-white/20 tracking-[0.5em] text-[9px] uppercase mt-2">Between Art &amp; Fiction</p>
          </div>

          <div className="relative border border-white/8 bg-white/[0.02] p-8 a2">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

            {done ? (
              /* ── Email sent confirmation ── */
              <div className="flex flex-col items-center gap-6 py-4">
                <div className="relative">
                  <div className="w-14 h-14 border-2 border-red-600/60 flex items-center justify-center">
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-600" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-600" />
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                </div>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div className="h-px w-6 bg-red-600/50" />
                    <span className="text-red-600 text-[9px] tracking-[0.4em] uppercase font-black">Email envoy&eacute;</span>
                    <div className="h-px w-6 bg-red-600/50" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight mb-3">V&eacute;rifiez votre boite mail</h2>
                </div>

                <div className="w-full border border-white/10 bg-white/[0.02] px-4 py-3 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600/40" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600/40" />
                  <p className="text-white/40 text-[9px] tracking-[0.3em] uppercase mb-1">Lien envoy&eacute; &agrave;</p>
                  <p className="text-white font-black text-sm break-all">{email}</p>
                </div>

                <p className="text-white/40 text-xs leading-relaxed text-center tracking-wide">
                  Cliquez sur le lien dans l&apos;email pour r&eacute;initialiser votre mot de passe. V&eacute;rifiez aussi vos spams.
                </p>

                <Link href="/login" className="text-[10px] tracking-[0.4em] text-red-500 uppercase font-black hover:text-red-400 transition-colors">
                  Retour &agrave; la connexion &rarr;
                </Link>
              </div>
            ) : (
              /* ── Form ── */
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-red-600/50" />
                    <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">R&eacute;initialisation</span>
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
                    Mot de passe<br />oubli&eacute; ?
                  </h1>
                  <p className="text-white/30 text-xs mt-3 leading-relaxed tracking-wide">
                    Entrez votre email et nous vous enverrons un lien pour r&eacute;initialiser votre mot de passe.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 a3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-[11px] tracking-[0.25em] text-white/50 uppercase font-bold">
                      Adresse e-mail
                    </label>
                    <div className={`relative border transition-all duration-200 ${focused ? "border-red-600/70" : "border-white/10"}`}>
                      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
                      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
                      <input
                        id="email" type="email" placeholder="vous@exemple.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        className="w-full bg-white/[0.03] px-4 py-3 text-white text-sm tracking-wide placeholder:text-white/20 outline-none"
                        style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 border border-red-800/50 bg-red-900/10 px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                      <p className="text-red-400 text-[11px] tracking-wide">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 overflow-hidden">
                    <span className={loading ? "opacity-0" : ""}>Envoyer le lien</span>
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
              </>
            )}
          </div>

        </div>
      </main>

      <footer className="relative z-20 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase">&copy; The X Parallel &mdash; Strictement Confidentiel</p>
      </footer>
    </div>
  );
}
