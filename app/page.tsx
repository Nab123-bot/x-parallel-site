"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ─── Translations ─────────────────────────────────────────────────────────────
type Lang = "fr" | "en" | "ar";

const T = {
  fr: {
    signal: "Signal en cours",
    construction: "En Construction",
    soon: "BIENTÔT",
    online: "EN LIGNE",
    desc: "Quelque chose d'extraordinaire se prépare. Musique, art, territoire — une nouvelle expérience arrive.",
    copyright: "© The X Parallel — Strictement Confidentiel",
    tagline: "Between Art & Fiction",
    instagram: "www.thexparallel.com",
  },
  en: {
    signal: "Signal in progress",
    construction: "Under Construction",
    soon: "COMING SOON",
    online: "ONLINE",
    desc: "Something extraordinary is being prepared. Music, art, territory — a new experience is on its way.",
    copyright: "© The X Parallel — Strictly Confidential",
    tagline: "Between Art & Fiction",
    instagram: "www.thexparallel.com",
  },
  ar: {
    signal: "الإشارة جارية",
    construction: "قيد الإنشاء",
    soon: "قريبًا",
    online: "على الإنترنت",
    desc: "شيء استثنائي قيد الإعداد. موسيقى، فن، أرض — تجربة جديدة في الطريق إليك.",
    copyright: "© ذا إكس باراليل — سري للغاية",
    tagline: "بين الفن والخيال",
    instagram: "www.thexparallel.com",
  },
};

// ─── Language switcher amélioré ───────────────────────────────────────────────
function LangSwitcher({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const langs = [
    { code: "fr", label: "Français" },
    { code: "en", label: "English" },
    { code: "ar", label: "العربية" },
  ];

  return (
    <div className="flex items-center bg-white/5 border border-white/10 rounded-md overflow-hidden">
      {langs.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => setLang(code as Lang)}
          className={`px-4 py-2 text-xs font-bold transition-all duration-200
          ${
            lang === code
              ? "bg-red-600 text-white"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Animated noise background ───────────────────────────────────────────────
function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);

      for (let i = 0; i < imageData.data.length; i += 4) {
        const v = Math.random() * 255 * 0.04;
        imageData.data[i] = v;
        imageData.data[i + 1] = v;
        imageData.data[i + 2] = v;
        imageData.data[i + 3] = 255;
      }

      ctx.putImageData(imageData, 0, 0);
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-40"
    />
  );
}

 function Logo({ size = 420 }: { size?: number }) {
  // Use public asset path so Next.js serves it correctly in all environments.
  return (
    <Image
      src="/image.png"
      alt="The X Parallel"
      width={size}
      height={Math.round(size * 0.9)}
      className="mx-auto select-none h-auto w-auto"
      priority
    />
  );
}

// ─── Icons ───────────────────────────────────────────────────────────────────
const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    aria-hidden="true"
    className="fill-current"
  >
    <path d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm5 3.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5zm0 2A1.5 1.5 0 1 0 13.5 12 1.5 1.5 0 0 0 12 10.5zM16.75 7a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
  </svg>
);

// ─── Glitch text ─────────────────────────────────────────────────────────────
function GlitchText({ text }: { text: string }) {
  return (
    <span className="relative inline-block glitch" data-text={text}>
      {text}

      <style>{`
      .glitch::before,
      .glitch::after{
        content:attr(data-text);
        position:absolute;
        left:0;
        top:0;
      }

      .glitch::before{
        color:#CC0000;
        transform:translateX(-2px);
        animation:glitch1 3s infinite;
      }

      .glitch::after{
        color:white;
        transform:translateX(2px);
        animation:glitch2 3s infinite;
      }

      @keyframes glitch1{
        0%,90%,100%{opacity:0}
        92%{opacity:1}
      }

      @keyframes glitch2{
        0%,90%,100%{opacity:0}
        94%{opacity:1}
      }
      `}</style>
    </span>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function UnderConstruction() {
  const [lang, setLang] = useState<Lang>("fr");

  const t = T[lang];
  const isRtl = lang === "ar";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-black text-white min-h-screen flex flex-col relative"
    >
      <NoiseCanvas />

      {/* ─── Top bar ─── */}
      <div className="relative z-20 flex justify-between items-center px-6 md:px-12 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
          <span className="text-[9px] tracking-[0.45em] text-white/25 uppercase">
            {t.signal}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/the_x_parallel"
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            aria-label="Instagram The X Parallel"
          >
            <InstagramIcon size={16} />
            <span className="text-[9px] tracking-[0.35em] uppercase">
              {t.instagram}
            </span>
          </a>

          <LangSwitcher lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* ─── Main content ─── */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-6 text-center gap-12">

        <div>
          <Logo size={200} />
          <p className="text-white/25 tracking-[0.55em] text-[10px] uppercase mt-3">
            {t.tagline}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">

          <div className="flex items-center gap-4 mb-2">
            <div className="h-px w-12 bg-red-600/50" />
            <span className="text-red-600 text-[10px] tracking-[0.5em] uppercase font-black">
              {t.construction}
            </span>
            <div className="h-px w-12 bg-red-600/50" />
          </div>

          <h1 className="text-6xl md:text-9xl font-black uppercase">
            <GlitchText text={t.soon} />
          </h1>

          <h2 className="text-6xl md:text-9xl font-black uppercase text-white/10">
            {t.online}
          </h2>

        </div>

        <p className="text-white/40 max-w-md text-sm leading-relaxed">
          {t.desc}
        </p>

      </main>

      {/* ─── Footer ─── */}
      <div className="relative z-20 border-t border-white/5 px-6 md:px-12 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">

        <p className="text-white/15 text-[9px] tracking-[0.4em] uppercase">
          {t.copyright}
        </p>

        <div className="flex gap-6">
          <span className="text-white/15 text-[9px] tracking-[0.35em] uppercase">
            O.cheddadi@thexparallel.com
          </span>

          
        </div>

      </div>
    </div>
  );
}
