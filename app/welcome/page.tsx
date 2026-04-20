"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

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
        imageData.data[i] =
          imageData.data[i + 1] =
          imageData.data[i + 2] =
            v;
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
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}

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
// ─── Feature card ─────────────────────────────────────────────────────────────
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`border bg-white/[0.015] p-4 flex flex-col gap-2 transition-all duration-200 ${
        hovered ? "border-red-600/30" : "border-white/[0.07]"
      }`}
    >
      <div className="w-5 h-5 text-red-600">{icon}</div>
      <span
        className="text-[11px] font-black uppercase tracking-[.1em] text-white/80"
        style={{ fontFamily: "'Barlow Condensed','Arial Narrow',sans-serif" }}
      >
        {title}
      </span>
      <span className="text-[10px] text-white/30 leading-relaxed tracking-[.03em]">
        {desc}
      </span>
    </div>
  );
}

// ─── Pulsing dot ──────────────────────────────────────────────────────────────
function PulsingDot() {
  return (
    <span className="inline-block w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse mr-1.5" />
  );
}

// ─── Welcome page ─────────────────────────────────────────────────────────────
export default function WelcomePage() {
  const [memberName, setMemberName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let active = true;

    const loadUser = async () => {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (!supabaseUrl || !supabaseKey) {
        if (active) setLoading(false);
        return;
      }
      const supabase = createBrowserClient(supabaseUrl, supabaseKey);

      const searchParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const urlError =
        searchParams.get("error_description") ||
        hashParams.get("error_description") ||
        searchParams.get("error") ||
        hashParams.get("error");

      if (urlError) {
        if (active) {
          setAuthError(decodeURIComponent(urlError.replace(/\+/g, " ")));
          setLoading(false);
        }
        return;
      }

      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error && active) {
          setAuthError(error.message);
        }
      }

      const code = searchParams.get("code");
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error && active) {
          setAuthError(error.message);
        }
      }

      if (accessToken || code || window.location.hash) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const { data, error } = await supabase.auth.getUser();
      if (active && error && !data?.user) {
        setAuthError(error.message);
      }

      if (active && data?.user) {
        const meta = data.user.user_metadata;
        const name =
          meta?.prenom && meta?.nom
            ? `${meta.prenom} ${meta.nom.charAt(0)}.`
            : meta?.prenom || meta?.nom || data.user.email || null;
        setMemberName(name);
        setAuthError(null);
      }
      if (active) setLoading(false);
    };

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  const features = [
    {
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <rect
            x="2"
            y="3"
            width="16"
            height="12"
            rx="1"
            stroke="#CC0000"
            strokeWidth="1.2"
          />
          <path
            d="M6 16h8"
            stroke="#CC0000"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M10 15v1"
            stroke="#CC0000"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <path
            d="M5 7l3 3 5-5"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Contenu exclusif",
      desc: "Accès aux œuvres et récits réservés aux membres",
    },
    {
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="10" cy="10" r="7" stroke="#CC0000" strokeWidth="1.2" />
          <path
            d="M10 6v4l3 2"
            stroke="rgba(255,255,255,.4)"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Avant-premières",
      desc: "Soyez informé en priorité des nouvelles sorties",
    },
    {
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M3 10l5 5L17 5"
            stroke="#CC0000"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Profil membre",
      desc: "Gérez vos préférences et votre espace personnel",
    },
    {
      icon: (
        <svg
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M10 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L10 14.2l-4.8 2.4.9-5.3L2.3 7.6l5.3-.8z"
            stroke="#CC0000"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
        </svg>
      ),
      title: "Communauté",
      desc: "Rejoignez les membres de l'univers X Parallel",
    },
  ];

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
        @keyframes glitch1  {
          0%,90%,100%{clip-path:none;transform:none}
          92%{clip-path:inset(30% 0 50% 0);transform:translateX(-4px)}
          95%{clip-path:inset(70% 0 10% 0);transform:translateX(4px)}
        }
        .a1{animation:fadeUp .8s ease both .1s}
        .a2{animation:fadeUp .8s ease both .25s}
        .a3{animation:fadeUp .8s ease both .4s}
        .a4{animation:fadeUp .8s ease both .55s}
        .glitch{animation:glitch1 8s ease-in-out infinite}
      `}</style>

      <NoiseCanvas />

      {/* Spinning X background */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0">
        <div
          style={{
            width: 700,
            height: 700,
            animation: "spinSlow 60s linear infinite",
            opacity: 0.03,
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" width="100%" height="100%">
            <line
              x1="5"
              y1="5"
              x2="95"
              y2="95"
              stroke="#CC0000"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <line
              x1="95"
              y1="5"
              x2="5"
              y2="95"
              stroke="#CC0000"
              strokeWidth="12"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Red glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div
          style={{
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle,rgba(180,0,0,.15) 0%,transparent 70%)",
            animation: "pulseRed 4s ease-in-out infinite",
          }}
        />
      </div>

      {/* Scanline */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(transparent,rgba(255,255,255,.03),transparent)",
            animation: "scanline 6s linear infinite",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 flex justify-between items-center px-6 md:px-12 py-5 border-b border-white/5 a1">
        <Logo size={90} />
        <span className="text-[9px] tracking-[0.45em] text-white/20 uppercase">
          thexparallel.com
        </span>
      </header>

      {/* Main */}
      <main className="relative z-20 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md flex flex-col gap-0">

          {/* Card */}
          <div className="relative border border-white/[0.08] bg-white/[0.02] p-8 md:p-10 a2">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-red-600/60" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-red-600/60" />

            {/* Badge */}
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-6 bg-red-600/50" />
              <span className="text-red-600 text-[9px] tracking-[0.45em] uppercase font-black flex items-center">
                <PulsingDot />
                {authError ? "Confirmation à vérifier" : "Compte activé"}
              </span>
              <div className="h-px w-6 bg-red-600/50" />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-6 glitch">
              Bienvenue
              <br />
              dans <span className="text-red-600">l&apos;univers</span>
            </h1>

            {/* Member name box */}
            <div className="relative border border-white/[0.08] bg-white/[0.02] px-5 py-4 mb-6">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-red-600/40" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-red-600/40" />
              <p className="text-white/35 text-[10px] tracking-[0.35em] uppercase mb-1">
                Membre vérifié
              </p>
              {loading ? (
                <div className="flex items-center gap-1 h-5">
                  {[0, 150, 300].map((d) => (
                    <span
                      key={d}
                      className="w-1 h-1 bg-white/30 rounded-full animate-bounce"
                      style={{ animationDelay: `${d}ms` }}
                    />
                  ))}
                </div>
              ) : authError ? (
                <p className="text-red-500 font-black tracking-wide text-base">
                  Session non connectée
                </p>
              ) : (
                <p className="text-white font-black tracking-wide text-base">
                  {memberName ?? "Membre"}
                </p>
              )}
            </div>

            {/* Description */}
            {authError ? (
              <div className="border border-red-600/30 bg-red-950/20 px-4 py-3 mb-6">
                <p className="text-red-400 text-[11px] tracking-[0.2em] uppercase font-black mb-2">
                  Le lien de confirmation n&apos;a pas ouvert de session
                </p>
                <p className="text-white/45 text-[12px] leading-relaxed tracking-[0.04em]">
                  {authError}. Réessayez avec un nouvel email de confirmation,
                  puis ouvrez le lien dans le même navigateur que celui utilisé
                  pour l&apos;inscription.
                </p>
              </div>
            ) : (
              <p className="text-white/45 text-[13px] leading-relaxed tracking-[0.04em] mb-6">
                Votre email a été confirmé. Vous avez désormais accès à{" "}
                <span className="text-white/75 font-bold">
                  l&apos;intégralité de l&apos;univers The X Parallel
                </span>{" "}
                — entre art, fiction et expériences uniques.
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-white/[0.06] mb-6" />

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-7 a3">
              {features.map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>

            {/* CTA button */}
            <button
              onClick={() => router.push(authError ? "/login" : "/dashboard")}
              className="group relative w-full bg-red-700 hover:bg-red-600 text-white text-[11px] tracking-[0.4em] uppercase font-black py-4 transition-all duration-200 overflow-hidden"
            >
              <span>
                {authError ? "Se connecter →" : "Accéder au tableau de bord →"}
              </span>
              <div className="absolute bottom-0 left-0 h-px w-0 bg-white group-hover:w-full transition-all duration-300" />
            </button>
          </div>

          {/* Bottom link */}
          <div className="a4 text-center mt-6">
            <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">
              Besoin d&apos;aide ?{" "}
            </span>
            <Link
              href="/contact"
              className="text-red-500 text-[10px] tracking-[0.3em] uppercase font-black hover:text-red-400 transition-colors"
            >
              Contacter le support →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/10 text-[9px] tracking-[0.4em] uppercase">
          &copy; The X Parallel &mdash; Strictement Confidentiel
        </p>
      </footer>
    </div>
  );
}
