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

function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function PasswordField({
  id, label, value, onChange, show, onToggle,
}: {
  id: string; label: string; value: string;
  onChange: (v: string) => void; show: boolean; onToggle: () => void;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] tracking-[0.25em] text-white/50 uppercase font-bold">{label}</label>
      <div className={`relative border transition-all duration-200 ${focused ? "border-red-600/70" : "border-white/10"}`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors ${focused ? "border-red-600" : "border-white/20"}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors ${focused ? "border-red-600" : "border-white/20"}`} />
        <input
          id={id} type={show ? "text" : "password"} placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          className="w-full bg-white/[0.03] px-4 py-3 pr-12 text-white text-sm tracking-wide placeholder:text-white/20 outline-none"
          style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
        />
        <button type="button" onClick={onToggle} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
          <EyeIcon visible={show} />
        </button>
      </div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const s = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const labels = ["", "Faible", "Moyen", "Fort"];
  const colors = ["", "bg-red-700", "bg-yellow-600", "bg-green-700"];
  if (!password) return null;
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1,2,3].map(i => (
          <div key={i} className={`h-0.5 flex-1 transition-all duration-300 ${i <= s ? colors[s] : "bg-white/10"}`} />
        ))}
      </div>
      <span className="text-[10px] tracking-[0.2em] text-white/40 uppercase">{labels[s]}</span>
    </div>
  );
}

export default function ResetPasswordPage() {
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);
  const [error,       setError]       = useState("");
  const [validSession, setValidSession] = useState(false);
  const [checking,    setChecking]    = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Verifie que l'utilisateur a bien clique sur le lien de reset
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setValidSession(!!session);
      setChecking(false);
    };

    // Supabase gere le token via l'URL fragment (#access_token=...)
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setValidSession(true);
        setChecking(false);
      }
    });

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6)  { setError("Mot de passe trop court (6 caracteres min)."); return; }
    if (password !== confirm)  { setError("Les mots de passe ne correspondent pas."); return; }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) {
        setError(updateError.message);
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

            {/* Checking session */}
            {checking && (
              <div className="flex flex-col items-center gap-4 py-8">
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{animationDelay:"0ms"}} />
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{animationDelay:"150ms"}} />
                  <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce" style={{animationDelay:"300ms"}} />
                </span>
                <p className="text-white/30 text-xs tracking-widest uppercase">V&eacute;rification en cours...</p>
              </div>
            )}

            {/* Invalid / expired link */}
            {!checking && !validSession && !done && (
              <div className="flex flex-col items-center gap-5 py-4 text-center">
                <div className="w-12 h-12 border-2 border-red-800/60 flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-red-700" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-red-700" />
                  <span className="text-red-600 text-xl font-black">!</span>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="h-px w-5 bg-red-800/50" />
                    <span className="text-red-700 text-[9px] tracking-[0.4em] uppercase font-black">Lien invalide</span>
                    <div className="h-px w-5 bg-red-800/50" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Lien expir&eacute;</h2>
                </div>
                <p className="text-white/40 text-xs leading-relaxed tracking-wide">
                  Ce lien est invalide ou a expir&eacute;. Demandez un nouveau lien de r&eacute;initialisation.
                </p>
                <Link href="/forgot-password"
                  className="text-[10px] tracking-[0.4em] text-red-500 uppercase font-black hover:text-red-400 transition-colors">
                  Nouveau lien &rarr;
                </Link>
              </div>
            )}

            {/* Success */}
            {done && (
              <div className="flex flex-col items-center gap-5 py-4 text-center">
                <div className="w-12 h-12 border-2 border-green-700/60 flex items-center justify-center relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-green-600" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-green-600" />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-3 mb-1">
                    <div className="h-px w-5 bg-green-700/50" />
                    <span className="text-green-600 text-[9px] tracking-[0.4em] uppercase font-black">Succ&egrave;s</span>
                    <div className="h-px w-5 bg-green-700/50" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tight">Mot de passe mis &agrave; jour</h2>
                </div>
                <p className="text-white/40 text-xs leading-relaxed tracking-wide">
                  Votre mot de passe a &eacute;t&eacute; r&eacute;initialis&eacute; avec succ&egrave;s.
                </p>
                <Link href="/login"
                  className="text-[10px] tracking-[0.4em] text-red-500 uppercase font-black hover:text-red-400 transition-colors">
                  Se connecter &rarr;
                </Link>
              </div>
            )}

            {/* Form */}
            {!checking && validSession && !done && (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-red-600/50" />
                    <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Nouveau mot de passe</span>
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">
                    R&eacute;initialiser
                  </h1>
                  <p className="text-white/30 text-xs mt-2 leading-relaxed tracking-wide">
                    Choisissez un nouveau mot de passe s&eacute;curis&eacute;.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 a3">
                  <div>
                    <PasswordField id="password" label="Nouveau mot de passe"
                      value={password} onChange={setPassword} show={showPwd} onToggle={() => setShowPwd(!showPwd)} />
                    <PasswordStrength password={password} />
                  </div>

                  <PasswordField id="confirm" label="Confirmer"
                    value={confirm} onChange={setConfirm} show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />

                  {error && (
                    <div className="flex items-center gap-2 border border-red-800/50 bg-red-900/10 px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                      <p className="text-red-400 text-[11px] tracking-wide">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 mt-1 overflow-hidden">
                    <span className={loading ? "opacity-0" : ""}>Confirmer</span>
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
