"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "profil" | "modifier" | "securite";

interface UserData {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone: string;
  date_naissance: string;
  created_at: string;
}

// ─── Noise canvas ─────────────────────────────────────────────────────────────
function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId: number;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();
    window.addEventListener("resize", setSize);
    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255 * 0.035;
        imageData.data[i] = imageData.data[i + 1] = imageData.data[i + 2] = v;
        imageData.data[i + 3] = 255;
      }
      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", setSize);
    };
  }, []);
  return (
    <canvas className="fixed inset-0 pointer-events-none z-0 opacity-40" ref={canvasRef} />
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 90 }: { size?: number }) {
  const f = "'Barlow Condensed','Arial Narrow',sans-serif";
  return (
    <svg width={size} height={size * 0.52} viewBox="0 0 315 164" fill="none">
      <text x="0"   y="68"  fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">THE</text>
      <text x="120" y="68"  fontFamily={f} fontWeight="900" fontSize="62" fill="#CC0000">X</text>
      <text x="0"   y="150" fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">PARA</text>
      <rect x="156" y="90" width="9"  height="62" fill="#CC0000" rx="1"/>
      <rect x="170" y="90" width="9"  height="62" fill="#CC0000" rx="1"/>
      <text x="182" y="150" fontFamily={f} fontWeight="900" fontSize="62" letterSpacing="3" fill="white">LEL</text>
    </svg>
  );
}

// ─── Eye icon ─────────────────────────────────────────────────────────────────
function EyeIcon({ visible }: { visible: boolean }) {
  if (visible) return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

// ─── Field ────────────────────────────────────────────────────────────────────
function Field({
  label, id, type = "text", placeholder, value, onChange,
  showToggle, onToggle, pwVisible, disabled = false,
}: {
  label: string; id: string; type?: string; placeholder?: string;
  value: string; onChange?: (v: string) => void;
  showToggle?: boolean; onToggle?: () => void; pwVisible?: boolean;
  disabled?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] tracking-[0.25em] text-white/50 uppercase font-black">
        {label}
      </label>
      <div className={`relative border transition-all duration-200 ${
        disabled ? "border-white/5 opacity-50" :
        focused ? "border-red-600/70" : "border-white/10"
      }`}>
        <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l transition-colors duration-200 ${focused && !disabled ? "border-red-600" : "border-white/20"}`} />
        <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r transition-colors duration-200 ${focused && !disabled ? "border-red-600" : "border-white/20"}`} />
        <input
          id={id} type={type} placeholder={placeholder} value={value}
          disabled={disabled}
          onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`w-full bg-white/[0.03] px-4 py-3 text-white text-sm tracking-wide placeholder:text-white/20 outline-none ${showToggle ? "pr-11" : ""} ${disabled ? "cursor-not-allowed" : ""}`}
          style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
            <EyeIcon visible={pwVisible || false} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-3 border-b border-white/[0.05] last:border-0">
      <span className="text-[10px] tracking-[0.3em] text-white/35 uppercase font-black">{label}</span>
      <span className="text-white/85 text-sm tracking-wide font-bold"
        style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}>
        {value || "—"}
      </span>
    </div>
  );
}

// ─── Alert box ────────────────────────────────────────────────────────────────
function Alert({ msg, type }: { msg: string; type: "error" | "success" }) {
  return (
    <div className={`flex items-center gap-2 border px-3 py-2 ${
      type === "error"
        ? "border-red-800/50 bg-red-900/10"
        : "border-green-800/50 bg-green-900/10"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
        type === "error" ? "bg-red-600" : "bg-green-500"
      }`} />
      <p className={`text-[11px] tracking-wide ${
        type === "error" ? "text-red-400" : "text-green-400"
      }`}>{msg}</p>
    </div>
  );
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
function Avatar({ prenom, nom }: { prenom: string; nom: string }) {
  const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  return (
    <div className="relative">
      <div className="w-20 h-20 border-2 border-red-600/50 bg-red-900/20 flex items-center justify-center">
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-600" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-600" />
        <span className="text-2xl font-black text-white/90 tracking-wider"
          style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}>
          {initials}
        </span>
      </div>
      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-600 border-2 border-black rounded-full" />
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser]         = useState<UserData | null>(null);
  const [loading, setLoading]   = useState(true);
  const [tab, setTab]           = useState<Tab>("profil");

  // Edit info
  const [nom,           setNom]           = useState("");
  const [prenom,        setPrenom]        = useState("");
  const [telephone,     setTelephone]     = useState("");
  const [dateNaissance, setDateNaissance] = useState("");
  const [editLoading,   setEditLoading]   = useState(false);
  const [editMsg,       setEditMsg]       = useState<{ text: string; type: "error" | "success" } | null>(null);

  // Change password
  const [currentPw,  setCurrentPw]  = useState("");
  const [newPw,      setNewPw]      = useState("");
  const [confirmPw,  setConfirmPw]  = useState("");
  const [showCur,    setShowCur]    = useState(false);
  const [showNew,    setShowNew]    = useState(false);
  const [showConf,   setShowConf]   = useState(false);
  const [pwLoading,  setPwLoading]  = useState(false);
  const [pwMsg,      setPwMsg]      = useState<{ text: string; type: "error" | "success" } | null>(null);

  const getSupabase = () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    return createBrowserClient(url, key);
  };

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) { router.push("/login"); return; }
      const m = data.user.user_metadata;
      const u: UserData = {
        id:             data.user.id,
        email:          data.user.email || "",
        nom:            m?.nom || "",
        prenom:         m?.prenom || "",
        telephone:      m?.telephone || "",
        date_naissance: m?.date_naissance || "",
        created_at:     data.user.created_at || "",
      };
      setUser(u);
      setNom(u.nom);
      setPrenom(u.prenom);
      setTelephone(u.telephone);
      setDateNaissance(u.date_naissance);
      setLoading(false);
    });
  }, [router]);

  const handleEditInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditMsg(null);
    if (!nom.trim() || !prenom.trim()) {
      setEditMsg({ text: "Le nom et le prénom sont requis.", type: "error" }); return;
    }
    setEditLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.updateUser({
        data: { nom: nom.trim(), prenom: prenom.trim(), telephone: telephone.trim(), date_naissance: dateNaissance },
      });
      if (error) { setEditMsg({ text: error.message, type: "error" }); }
      else {
        setUser(prev => prev ? { ...prev, nom: nom.trim(), prenom: prenom.trim(), telephone: telephone.trim(), date_naissance: dateNaissance } : prev);
        setEditMsg({ text: "Informations mises à jour avec succès.", type: "success" });
      }
    } finally { setEditLoading(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (!newPw || !confirmPw)      { setPwMsg({ text: "Tous les champs sont requis.", type: "error" }); return; }
    if (newPw !== confirmPw)       { setPwMsg({ text: "Les mots de passe ne correspondent pas.", type: "error" }); return; }
    if (newPw.length < 6)          { setPwMsg({ text: "Mot de passe trop court (6 caractères min).", type: "error" }); return; }
    if (newPw === currentPw)       { setPwMsg({ text: "Le nouveau mot de passe doit être différent.", type: "error" }); return; }
    setPwLoading(true);
    try {
      const supabase = getSupabase();
      const { error } = await supabase.auth.updateUser({ password: newPw });
      if (error) { setPwMsg({ text: error.message, type: "error" }); }
      else {
        setPwMsg({ text: "Mot de passe modifié avec succès.", type: "success" });
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      }
    } finally { setPwLoading(false); }
  };

  const handleLogout = async () => {
    const supabase = getSupabase();
    await supabase.auth.signOut();
    router.push("/login");
  };

  const formatDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "profil",   label: "Mon Profil" },
    { id: "modifier", label: "Modifier"   },
    { id: "securite", label: "Sécurité"   },
  ];

  return (
    <div className="bg-black text-white min-h-screen flex flex-col overflow-hidden relative"
      style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');
        @keyframes fadeUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulseRed { 0%,100%{opacity:.1} 50%{opacity:.22} }
        @keyframes scanline { 0%{top:-10%} 100%{top:110%} }
        .a1{animation:fadeUp .7s ease both .05s}
        .a2{animation:fadeUp .7s ease both .15s}
        .a3{animation:fadeUp .7s ease both .25s}
        .a4{animation:fadeUp .7s ease both .35s}
      `}</style>

      <NoiseCanvas />

      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div style={{ width:700, height:700, animation:"spinSlow 60s linear infinite", opacity:.025 }}>
          <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
            <line x1="5" y1="5" x2="95" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
            <line x1="95" y1="5" x2="5" y2="95" stroke="#CC0000" strokeWidth="12" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div style={{ width:500, height:500, background:"radial-gradient(circle,rgba(180,0,0,.12) 0%,transparent 70%)", animation:"pulseRed 4s ease-in-out infinite" }} />
      </div>

      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div style={{ position:"absolute", left:0, right:0, height:"2px", background:"linear-gradient(transparent,rgba(255,255,255,.03),transparent)", animation:"scanline 6s linear infinite" }} />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 a1">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-white/30 hover:text-white/60 transition-colors text-[10px] tracking-[0.35em] uppercase">
            ← Accueil
          </Link>
          <Logo size={80} />
        </div>
        <button onClick={handleLogout}
          className="text-[10px] tracking-[0.35em] uppercase text-white/25 hover:text-red-500 transition-colors border border-white/10 hover:border-red-600/40 px-4 py-2">
          Déconnexion
        </button>
      </header>

      <main className="relative z-20 flex-1 px-6 md:px-12 py-10 max-w-2xl mx-auto w-full">

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex gap-1.5">
              {[0,150,300].map(d => (
                <span key={d} className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }} />
              ))}
            </div>
          </div>
        ) : user ? (
          <>
            {/* Profile hero */}
            <div className="a2 mb-8">
              <div className="flex items-center gap-6">
                <Avatar prenom={user.prenom} nom={user.nom} />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="h-px w-5 bg-red-600/50" />
                    <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Membre</span>
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tight leading-none">
                    {user.prenom} <span className="text-white/40">{user.nom}</span>
                  </h1>
                  <p className="text-white/30 text-[11px] tracking-[0.2em] mt-1">{user.email}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="a3 flex border-b border-white/[0.07] mb-7 gap-0">
              {tabs.map(t => (
                <button key={t.id} onClick={() => { setTab(t.id); setEditMsg(null); setPwMsg(null); }}
                  className={`relative px-6 py-3 text-[11px] tracking-[0.3em] uppercase font-black transition-all duration-200 ${
                    tab === t.id
                      ? "text-white"
                      : "text-white/30 hover:text-white/60"
                  }`}>
                  {t.label}
                  {tab === t.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                  )}
                </button>
              ))}
            </div>

            {/* ── Tab: Profil ── */}
            {tab === "profil" && (
              <div className="a4 relative border border-white/[0.08] bg-white/[0.02] p-7">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-5 bg-red-600/50" />
                  <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Informations</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                  <div>
                    <InfoRow label="Prénom"          value={user.prenom} />
                    <InfoRow label="Nom"             value={user.nom} />
                    <InfoRow label="Adresse e-mail"  value={user.email} />
                  </div>
                  <div>
                    <InfoRow label="Téléphone"       value={user.telephone} />
                    <InfoRow label="Date de naissance" value={formatDate(user.date_naissance)} />
                    <InfoRow label="Membre depuis"   value={formatDate(user.created_at)} />
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/[0.05] flex gap-3">
                  <button onClick={() => setTab("modifier")}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[10px] tracking-[0.35em] uppercase font-black px-6 py-3 transition-all duration-200 overflow-hidden">
                    Modifier les infos
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
                  </button>
                  <button onClick={() => setTab("securite")}
                    className="border border-white/15 hover:border-red-600/40 text-white/40 hover:text-white/70 text-[10px] tracking-[0.35em] uppercase font-black px-6 py-3 transition-all duration-200">
                    Changer le mot de passe
                  </button>
                </div>
              </div>
            )}

            {/* ── Tab: Modifier ── */}
            {tab === "modifier" && (
              <div className="a4 relative border border-white/[0.08] bg-white/[0.02] p-7">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-5 bg-red-600/50" />
                  <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Modifier les informations</span>
                </div>

                <form onSubmit={handleEditInfo} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Field id="e-nom"    label="Nom"    value={nom}    onChange={setNom}    placeholder="Votre nom" />
                    <Field id="e-prenom" label="Prénom" value={prenom} onChange={setPrenom} placeholder="Votre prénom" />
                  </div>

                  <Field id="e-email" label="Adresse e-mail" value={user.email}
                    onChange={() => {}} disabled placeholder={user.email} />
                  <p className="text-white/20 text-[10px] tracking-[0.2em] -mt-2">
                    L&apos;email ne peut pas être modifié ici.
                  </p>

                  <Field id="e-tel"  label="Téléphone"         type="tel"  value={telephone}     onChange={setTelephone}     placeholder="+212 6XX XX XX XX" />
                  <Field id="e-dob"  label="Date de naissance" type="date" value={dateNaissance}  onChange={setDateNaissance} placeholder="" />

                  {editMsg && <Alert msg={editMsg.text} type={editMsg.type} />}

                  <button type="submit" disabled={editLoading}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 overflow-hidden mt-1">
                    <span className={editLoading ? "opacity-0" : ""}>Enregistrer les modifications</span>
                    {editLoading && (
                      <span className="absolute inset-0 flex items-center justify-center gap-1">
                        {[0,150,300].map(d => (
                          <span key={d} className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }} />
                        ))}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
                  </button>
                </form>
              </div>
            )}

            {/* ── Tab: Sécurité ── */}
            {tab === "securite" && (
              <div className="a4 relative border border-white/[0.08] bg-white/[0.02] p-7">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-5 bg-red-600/50" />
                  <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black">Changer le mot de passe</span>
                </div>

                {/* Security notice */}
                <div className="border border-white/[0.06] bg-white/[0.015] px-4 py-3 mb-5 relative">
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/15" />
                  <p className="text-white/35 text-[11px] leading-relaxed tracking-[0.03em]">
                    Votre mot de passe doit comporter au minimum <span className="text-white/60 font-bold">6 caractères</span>.
                    Utilisez une combinaison de lettres, chiffres et symboles.
                  </p>
                </div>

                <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
                  <Field id="cur-pw"  label="Mot de passe actuel"    type={showCur  ? "text" : "password"}
                    value={currentPw} onChange={setCurrentPw} placeholder="••••••••"
                    showToggle onToggle={() => setShowCur(!showCur)}  pwVisible={showCur} />

                  <div className="h-px bg-white/[0.05]" />

                  <Field id="new-pw"  label="Nouveau mot de passe"   type={showNew  ? "text" : "password"}
                    value={newPw}     onChange={setNewPw}     placeholder="••••••••"
                    showToggle onToggle={() => setShowNew(!showNew)}  pwVisible={showNew} />

                  <Field id="conf-pw" label="Confirmer le nouveau"   type={showConf ? "text" : "password"}
                    value={confirmPw} onChange={setConfirmPw} placeholder="••••••••"
                    showToggle onToggle={() => setShowConf(!showConf)} pwVisible={showConf} />

                  {/* Password match indicator */}
                  {newPw && confirmPw && (
                    <div className={`flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-black ${
                      newPw === confirmPw ? "text-green-500" : "text-red-500"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${newPw === confirmPw ? "bg-green-500" : "bg-red-600"}`} />
                      {newPw === confirmPw ? "Les mots de passe correspondent" : "Ne correspondent pas"}
                    </div>
                  )}

                  {pwMsg && <Alert msg={pwMsg.text} type={pwMsg.type} />}

                  <button type="submit" disabled={pwLoading}
                    className="group relative bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 disabled:opacity-50 overflow-hidden mt-1">
                    <span className={pwLoading ? "opacity-0" : ""}>Mettre à jour le mot de passe</span>
                    {pwLoading && (
                      <span className="absolute inset-0 flex items-center justify-center gap-1">
                        {[0,150,300].map(d => (
                          <span key={d} className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }} />
                        ))}
                      </span>
                    )}
                    <div className="absolute bottom-0 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
                  </button>
                </form>

                {/* Danger zone */}
                <div className="mt-8 pt-6 border-t border-white/[0.05]">
                  <p className="text-[9px] tracking-[0.4em] uppercase text-white/20 mb-3">Zone de danger</p>
                  <button onClick={handleLogout}
                    className="border border-red-900/40 hover:border-red-600/60 text-red-700 hover:text-red-500 text-[10px] tracking-[0.35em] uppercase font-black px-5 py-2.5 transition-all duration-200">
                    Se déconnecter →
                  </button>
                </div>
              </div>
            )}
          </>
        ) : null}
      </main>

      <footer className="relative z-20 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase">
          &copy; The X Parallel &mdash; Strictement Confidentiel
        </p>
      </footer>
    </div>
  );
}