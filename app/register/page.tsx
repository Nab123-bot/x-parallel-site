"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { createBrowserClient } from '@supabase/ssr';

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

// ─── Eye icon ─────────────────────────────────────────────────────────────────
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

// ─── Input field ──────────────────────────────────────────────────────────────
function Field({
  label, type = "text", placeholder, value, onChange, id,
  showPasswordToggle, onTogglePassword, passwordVisible,
}: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void; id: string;
  showPasswordToggle?: boolean; onTogglePassword?: () => void; passwordVisible?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] tracking-[0.25em] text-white/50 uppercase font-bold">
        {label}
      </label>
      <div className={`relative border transition-all duration-200 ${focused ? "border-red-600/70" : "border-white/10"}`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-200 ${focused ? "border-red-600" : "border-white/20"}`} />
        <input
          id={id} type={type} placeholder={placeholder} value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-white/[0.03] px-4 py-3 text-white text-sm tracking-wide placeholder:text-white/20 outline-none ${showPasswordToggle ? "pr-12" : ""}`}
          style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
        />
        {showPasswordToggle && (
          <button type="button" onClick={onTogglePassword} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            <EyeIcon visible={passwordVisible || false} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Password strength ────────────────────────────────────────────────────────
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

// ─── Confirmation screen ──────────────────────────────────────────────────────
function ConfirmationScreen({ email }: { email: string }) {
  const [dots, setDots] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setDots(d => (d + 1) % 4), 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      {/* Envelope icon */}
      <div className="relative">
        <div className="w-16 h-16 border-2 border-red-600/60 flex items-center justify-center">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-600" />
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#CC0000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse" />
      </div>

      {/* Title */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-8 bg-red-600/50" />
          <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Email envoy&eacute;</span>
          <div className="h-px w-8 bg-red-600/50" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Confirm Your Signup</h2>
      </div>

      {/* Email */}
      <div className="w-full border border-white/10 bg-white/[0.02] px-5 py-4 relative">
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600/40" />
        <p className="text-white/40 text-[10px] tracking-[0.35em] uppercase mb-1">Email envoy&eacute; &agrave;</p>
        <p className="text-white font-black tracking-wide text-sm break-all">{email}</p>
      </div>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full">
        {[
          "V\u00e9rifiez votre bo\u00eete mail (et vos spams).",
          "Cliquez sur le lien \"Confirm your mail\" dans l'email.",
          "Votre compte sera activ\u00e9 et vous pourrez vous connecter.",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="w-5 h-5 bg-red-600/20 border border-red-600/40 flex items-center justify-center flex-shrink-0 text-red-500 text-[10px] font-black mt-0.5">
              {i + 1}
            </span>
            <p className="text-white/50 text-xs leading-relaxed tracking-wide">{step}</p>
          </div>
        ))}
      </div>

      <p className="text-white/20 text-[10px] tracking-[0.3em] uppercase">
        En attente{".".repeat(dots)}
      </p>

      <Link href="/login" className="text-[10px] tracking-[0.4em] text-red-500 uppercase font-black hover:text-red-400 transition-colors">
        Se connecter &rarr;
      </Link>
    </div>
  );
}

// ─── Register page ────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [nom,           setNom]           = useState("");
  const [prenom,        setPrenom]        = useState("");
  const [email,         setEmail]         = useState("");
  const [telephone,     setTelephone]     = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [password,      setPassword]      = useState("");
  const [confirm,       setConfirm]       = useState("");
  const [loading,       setLoading]       = useState(false);
  const [done,          setDone]          = useState(false);
  const [error,         setError]         = useState("");
  const [acceptTerms,   setAcceptTerms]   = useState(false);
  const [showPassword,  setShowPassword]  = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nom.trim())          { setError("Le nom est requis."); return; }
    if (!prenom.trim())       { setError("Le prenom est requis."); return; }
    if (!email.trim())        { setError("L'email est requis."); return; }
    if (!telephone.trim())    { setError("Le telephone est requis."); return; }
    if (!dateNaissance)       { setError("La date de naissance est requise."); return; }
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 6)  { setError("Mot de passe trop court (6 caracteres min)."); return; }
    if (!acceptTerms)         { setError("Vous devez accepter les conditions d'utilisation."); return; }

    const today = new Date();
    const birthDate = new Date(dateNaissance);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (age < 13 || (age === 13 && monthDiff < 0)) {
      setError("Vous devez avoir au moins 13 ans pour vous inscrire.");
      return;
    }

    setLoading(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        setError("Configuration Supabase manquante. Verifiez votre fichier .env.local");
        setLoading(false);
        return;
      }

      const supabase = createBrowserClient(supabaseUrl, supabaseKey);
      const emailRedirectTo = `${window.location.origin}/welcome`;

      // ✅ auth.signUp() envoie automatiquement l'email de confirmation
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password: password,
        options: {
          emailRedirectTo,
          data: {
            nom:            nom.trim(),
            prenom:         prenom.trim(),
            telephone:      telephone.trim(),
            date_naissance: dateNaissance,
          },
        },
      });

      if (signUpError) {
        if (
          signUpError.message.includes('already registered') ||
          signUpError.message.includes('already exists')
        ) {
          setError("Cet email est deja utilise.");
        } else {
          setError(signUpError.message || "Erreur lors de l'inscription.");
        }
        setLoading(false);
        return;
      }

      // Si identities vide → compte existant non confirme
      if (data.user && data.user.identities?.length === 0) {
        setError("Cet email est deja utilise.");
        setLoading(false);
        return;
      }

      setDone(true);

    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      setError("Une erreur inattendue s'est produite.");
    } finally {
      setLoading(false);
    }
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
        <Link href="/" className="text-white/30 hover:text-white/60 transition-colors text-[10px] tracking-[0.35em] uppercase">
          &larr; Retour
        </Link>
        <span className="text-[9px] tracking-[0.45em] text-white/20 uppercase">thexparallel.com</span>
      </header>

      <main className="relative z-20 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="flex flex-col items-center mb-10 a1">
            <Logo size={110} />
            <p className="text-white/20 tracking-[0.5em] text-[9px] uppercase mt-2">Between Art &amp; Fiction</p>
          </div>

          <div className="relative border border-white/8 bg-white/[0.02] p-8 a2">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

            {done ? (
              <ConfirmationScreen email={email} />
            ) : (
              <>
                <div className="mb-7">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-6 bg-red-600/50" />
                    <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Nouveau membre</span>
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tight">Inscription</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 a3">
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="nom"    label="Nom"    type="text" placeholder="Votre nom"    value={nom}    onChange={setNom}    />
                    <Field id="prenom" label="Prenom" type="text" placeholder="Votre prenom" value={prenom} onChange={setPrenom} />
                  </div>
                  <Field id="email"         label="Adresse e-mail"    type="email" placeholder="vous@exemple.com"  value={email}         onChange={setEmail}         />
                  <Field id="telephone"     label="Telephone"         type="tel"   placeholder="+212 6XX XX XX XX" value={telephone}     onChange={setTelephone}     />
                  <Field id="dateNaissance" label="Date de naissance" type="date"  placeholder=""                  value={dateNaissance}  onChange={setDateNaissance}  />

                  <div>
                    <Field id="password" label="Mot de passe" type={showPassword ? "text" : "password"}
                      placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" value={password} onChange={setPassword}
                      showPasswordToggle onTogglePassword={() => setShowPassword(!showPassword)} passwordVisible={showPassword} />
                    <PasswordStrength password={password} />
                  </div>

                  <Field id="confirm" label="Confirmer" type={showConfirm ? "text" : "password"}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" value={confirm} onChange={setConfirm}
                    showPasswordToggle onTogglePassword={() => setShowConfirm(!showConfirm)} passwordVisible={showConfirm} />

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <input type="checkbox" checked={acceptTerms} onChange={e => setAcceptTerms(e.target.checked)} className="peer sr-only" />
                      <div className="w-5 h-5 border border-white/20 bg-white/[0.03] peer-checked:border-red-600 peer-checked:bg-red-600/20 transition-all duration-200 flex items-center justify-center">
                        {acceptTerms && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6L5 9L10 3" stroke="#CC0000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                    </div>
                    <span className="text-white/30 text-[11px] leading-relaxed group-hover:text-white/50 transition-colors">
                      J&apos;accepte les{" "}
                      <Link href="/terms" className="text-red-500 hover:text-red-400 underline">conditions d&apos;utilisation</Link>
                      {" "}de The X Parallel
                    </span>
                  </label>

                  {error && (
                    <div className="flex items-center gap-2 border border-red-800/50 bg-red-900/10 px-3 py-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0" />
                      <p className="text-red-400 text-[11px] tracking-wide">{error}</p>
                    </div>
                  )}

                  <button type="submit" disabled={loading}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 mt-1 overflow-hidden">
                    <span className={loading ? "opacity-0" : ""}>Rejoindre</span>
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

          {!done && (
            <div className="a4 text-center mt-6">
              <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Deja membre ? </span>
              <Link href="/login" className="text-red-500 text-[10px] tracking-[0.3em] uppercase font-black hover:text-red-400 transition-colors">
                Se connecter &rarr;
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="relative z-20 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase">&copy; The X Parallel &mdash; Strictement Confidentiel</p>
      </footer>
    </div>
  );
}
