"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Logo({ size = 120 }: { size?: number }) {
  return (
    <Image
      src="/image.png"
      alt="The X Parallel"
      width={size}
      height={Math.round(size * 0.947)}
      style={{ width: size, height: "auto" }}
      className="select-none"
      priority
    />
  );
}

export default function HomePage() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);
  const [heroCounter, setHeroCounter] = useState("01");

  // Custom cursor
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + "px";
        cursorRef.current.style.top = e.clientY + "px";
      }
    };
    document.addEventListener("mousemove", onMove);

    const animRing = () => {
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.12;
      if (ringRef.current) {
        ringRef.current.style.left = ringPos.current.x + "px";
        ringRef.current.style.top = ringPos.current.y + "px";
      }
      rafRef.current = requestAnimationFrame(animRing);
    };
    rafRef.current = requestAnimationFrame(animRing);

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Scroll reveal
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(
              () => (entry.target as HTMLElement).classList.add("visible"),
              i * 80
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Hero counter on scroll
  useEffect(() => {
    const sections = ["home", "concept", "tour", "experiences", "team", "contact"];
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight / 2;
      sections.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const bot = top + el.offsetHeight;
          if (y > top && y < bot) {
            setHeroCounter(String(i + 1).padStart(2, "0"));
          }
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleCursorEnter = () => {
    if (cursorRef.current) { cursorRef.current.style.width = "6px"; cursorRef.current.style.height = "6px"; }
    if (ringRef.current) { ringRef.current.style.width = "60px"; ringRef.current.style.height = "60px"; ringRef.current.style.opacity = "0.6"; }
  };
  const handleCursorLeave = () => {
    if (cursorRef.current) { cursorRef.current.style.width = "10px"; cursorRef.current.style.height = "10px"; }
    if (ringRef.current) { ringRef.current.style.width = "36px"; ringRef.current.style.height = "36px"; ringRef.current.style.opacity = "1"; }
  };

  const cities = [
    { name: "Tanger", region: "Nord du Maroc", image: "/cities/Tanger.png" },
    { name: "Casablanca", region: "Atlantic Coast", image: "/cities/Casablanca.png" },
    { name: "Marrakech", region: "Région du Sud", image: "/cities/Marrakech.png" },
    { name: "Essaouira", region: "Côte Atlantique", image: "/cities/Essouira.png" },
    { name: "Rabat", region: "Capitale", image: "/cities/Rabat.png" },
    { name: "Dakhla", region: "Sahara Atlantique", image: "/cities/Dakhla.png" },
  ];

  const experiences = [
    { num: "01", name: "Agafay Valley", desc: "Au cœur d'Agafay Valley et au milieu des paysages époustouflants de Marrakech, un set de DJ ODY en direct mêlant des rythmes downtempo à des mélodies organiques. Un voyage sonore qui reflète la beauté et la sérénité d'Agafay.", tag: "Marrakech · Désert" },
    { num: "02", name: "Dakhla Soundscapes", desc: "Plongez dans l'aventure unique au cœur de Dakhla. Notre projet fusionne musique et paysages époustouflants — des dunes blanches à l'Île du Dragon, de Sabkhat Imlili jusqu'au catamaran voguant sur les eaux captivantes.", tag: "Dakhla · Océan" },
    { num: "03", name: "The X Lab Experience", desc: "Une collaboration visionnaire entre The X Parallel et le Kenzi Tower Hotel. Ce concept fusionne l'art musical et l'hospitalité dans un cadre panoramique au 28ème étage du Sky 28, révolutionnant l'hospitalité.", tag: "Casablanca · Sky 28" },
    { num: "04", name: "ONOMO Hotels Kick-Off", desc: "L'événement inaugural chez ONOMO Hotel Sidimaarouf, une célébration collaborative mettant en valeur des artistes et artisans talentueux, pour le lancement officiel du concept THE X PARALLEL.", tag: "Casablanca · ONOMO" },
  ];

  const pills = [
    "Musique Électronique", "Musique Underground", "Musique Éthnique", "Tourisme Culturel",
    "Patrimoine Naturel & Historique", "Art Visuel", "Cosmétique Bio", "Artisanat & Modélisme Contemporain",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;600;700&family=Barlow:wght@300;400&display=swap');

        :root {
          --red: #c0000c;
          --white: #f0ece4;
          --black: #080808;
          --gray: #1a1a1a;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Barlow', sans-serif;
          font-weight: 300;
          overflow-x: hidden;
          cursor: none;
        }

        .cursor {
          position: fixed;
          width: 10px; height: 10px;
          background: var(--red);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width 0.2s, height 0.2s;
        }
        .cursor-ring {
          position: fixed;
          width: 36px; height: 36px;
          border: 1px solid rgba(192,0,12,0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width 0.3s, height 0.3s, opacity 0.3s;
        }

        /* NAV */
        .nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 60px;
          background: linear-gradient(to bottom, rgba(8,8,8,0.95), transparent);
        }
        .nav-logo-img {
          display: inline-flex;
          align-items: center;
          line-height: 0;
          flex-shrink: 0;
          text-decoration: none;
          color: inherit;
        }
        .nav-logo-img img {
          display: block;
          height: auto;
          width: auto;
          transition: opacity 0.3s;
        }
        .nav-logo-img:hover {
          opacity: 0.8;
        }
        .nav-links { display: flex; gap: 40px; list-style: none; }
        .nav-links a {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 12px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(240,236,228,0.6);
          text-decoration: none;
          transition: color 0.3s;
        }
        .nav-links a:hover { color: var(--red); }
        
        .nav-auth {
          display: flex;
          gap: 16px;
          align-items: center;
        }
        .nav-auth-btn {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 10px 24px;
          text-decoration: none;
          transition: all 0.3s;
          border: 1px solid rgba(240,236,228,0.2);
          color: rgba(240,236,228,0.7);
        }
        .nav-auth-btn:hover {
          border-color: var(--red);
          color: var(--white);
        }
        .nav-auth-btn-register {
          background: var(--red);
          color: var(--white);
          border-color: var(--red);
        }
        .nav-auth-btn-register:hover {
          background: rgba(192,0,12,0.8);
        }

        /* HERO */
        .hero {
          height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 0 60px;
          position: relative;
          overflow: hidden;
        }
        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 70% at 80% 50%, rgba(192,0,12,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 40% 40% at 20% 80%, rgba(192,0,12,0.05) 0%, transparent 60%);
        }
        .hero-noise {
          position: absolute; inset: 0;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-size: 200px;
        }
        @keyframes expandLine {
          from { opacity: 0; width: 0; }
          to { opacity: 1; width: 40px; }
        }
        .hero-line {
          position: absolute; left: 0; top: 50%;
          width: 40px; height: 2px;
          background: var(--red);
          transform: translateY(-50%);
          animation: expandLine 1.5s ease forwards;
          animation-delay: 0.5s;
          transform-origin: left;
          opacity: 0;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-tag {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
          color: var(--red); margin-bottom: 24px;
          opacity: 0; animation: fadeUp 0.8s ease forwards; animation-delay: 0.3s;
        }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(80px, 14vw, 200px);
          line-height: 0.9; letter-spacing: -2px;
          opacity: 0; animation: fadeUp 1s ease forwards; animation-delay: 0.5s;
        }
        .hero-title .x { color: var(--red); }
        .hero-subtitle {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 8px; text-transform: uppercase;
          color: rgba(240,236,228,0.4); margin-top: 20px;
          opacity: 0; animation: fadeUp 0.8s ease forwards; animation-delay: 0.8s;
        }
        .hero-cta {
          margin-top: 50px; display: flex; gap: 20px;
          opacity: 0; animation: fadeUp 0.8s ease forwards; animation-delay: 1s;
        }
        .btn-primary {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          padding: 14px 36px; background: var(--red); color: var(--white);
          text-decoration: none; position: relative; overflow: hidden;
          transition: transform 0.2s; display: inline-block;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.1);
          transform: translateX(-100%); transition: transform 0.3s ease;
        }
        .btn-primary:hover::before { transform: translateX(0); }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-outline {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase;
          padding: 14px 36px; border: 1px solid rgba(240,236,228,0.3);
          color: var(--white); text-decoration: none; display: inline-block;
          transition: border-color 0.3s, color 0.3s, transform 0.2s;
        }
        .btn-outline:hover { border-color: var(--red); color: var(--red); transform: translateY(-2px); }
        .hero-scroll {
          position: absolute; bottom: 40px; left: 60px;
          display: flex; align-items: center; gap: 16px;
          opacity: 0; animation: fadeIn 1s ease forwards; animation-delay: 1.5s;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; } 50% { opacity: 1; }
        }
        .scroll-line {
          width: 1px; height: 60px;
          background: linear-gradient(to bottom, var(--red), transparent);
          animation: scrollPulse 2s ease infinite;
        }
        .scroll-text {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 10px; letter-spacing: 4px; text-transform: uppercase;
          color: rgba(240,236,228,0.3); writing-mode: vertical-rl;
        }
        .hero-counter {
          position: absolute; right: 60px; bottom: 40px;
          font-family: 'Bebas Neue', sans-serif; font-size: 80px;
          color: rgba(192,0,12,0.06); letter-spacing: -2px; user-select: none;
          opacity: 0; animation: fadeIn 1s ease forwards; animation-delay: 1.2s;
        }

        /* MARQUEE */
        .marquee-section {
          overflow: hidden;
          border-top: 1px solid rgba(192,0,12,0.3);
          border-bottom: 1px solid rgba(192,0,12,0.3);
          padding: 16px 0; background: rgba(192,0,12,0.04);
        }
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex; gap: 0;
          animation: marquee 20s linear infinite; white-space: nowrap;
        }
        .marquee-item {
          font-family: 'Bebas Neue', sans-serif; font-size: 14px;
          letter-spacing: 6px; color: rgba(240,236,228,0.25);
          padding: 0 40px; flex-shrink: 0;
        }
        .marquee-item span { color: var(--red); }

        /* SECTIONS */
        .section { padding: 120px 60px; }
        .section-header { display: flex; align-items: center; gap: 20px; margin-bottom: 80px; }
        .section-num { font-family: 'Bebas Neue', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--red); }
        .section-line { flex: 1; height: 1px; background: rgba(240,236,228,0.1); }
        .section-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(40px, 6vw, 80px); letter-spacing: 3px; line-height: 1; }

        /* CONCEPT */
        .concept-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .concept-text p { font-size: 16px; line-height: 1.8; color: rgba(240,236,228,0.7); margin-bottom: 24px; }
        .concept-text strong { color: var(--white); font-weight: 600; }
        .concept-visual { display: grid; grid-template-columns: 1fr 1fr; gap: 3px; }
        .concept-tag { grid-column: 1 / -1; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--red); margin-bottom: 12px; }
        .concept-pill {
          background: var(--gray); border: 1px solid rgba(240,236,228,0.07);
          padding: 18px 24px; font-family: 'Barlow Condensed', sans-serif;
          font-size: 13px; letter-spacing: 2px; text-transform: uppercase;
          color: rgba(240,236,228,0.5); transition: background 0.3s, color 0.3s, border-color 0.3s; cursor: default;
        }
        .concept-pill:hover { background: rgba(192,0,12,0.15); color: var(--white); border-color: rgba(192,0,12,0.4); }
        .concept-pill.full { grid-column: 1 / -1; }

        /* TOUR */
        .tour-cities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; margin-top: 40px; }
        .city-card {
          position: relative; height: 280px; overflow: hidden;
          background: var(--gray); display: flex; flex-direction: column;
          justify-content: flex-end; padding: 28px; cursor: pointer;
        }
        .city-card-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .city-card-bg img {
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        .city-card:hover .city-card-bg {
          transform: none;
        }
        .city-card:hover .city-card-bg img {
          transform: scale(1.1);
        }
        .city-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(8,8,8,0.9) 0%, rgba(8,8,8,0.2) 60%, transparent 100%);
          z-index: 1;
        }
        .city-card::after {
          content: ''; position: absolute; bottom: 0; left: 0;
          width: 100%; height: 2px; background: var(--red);
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease; z-index: 3;
        }
        .city-card:hover::after { transform: scaleX(1); }
        .city-content { position: relative; z-index: 2; }
        .city-name { font-family: 'Bebas Neue', sans-serif; font-size: 36px; letter-spacing: 3px; line-height: 1; }
        .city-region { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 4px; text-transform: uppercase; color: var(--red); margin-top: 4px; }

        /* EXPERIENCES */
        .exp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; }
        .exp-card {
          background: var(--gray); padding: 50px;
          position: relative; overflow: hidden; transition: background 0.3s;
        }
        .exp-card:hover { background: rgba(192,0,12,0.08); }
        .exp-card::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 3px; height: 0; background: var(--red);
          transition: height 0.4s ease;
        }
        .exp-card:hover::before { height: 100%; }
        .exp-num { font-family: 'Bebas Neue', sans-serif; font-size: 60px; color: rgba(192,0,12,0.15); line-height: 1; margin-bottom: 20px; }
        .exp-name { font-family: 'Bebas Neue', sans-serif; font-size: 28px; letter-spacing: 2px; margin-bottom: 16px; }
        .exp-desc { font-size: 14px; line-height: 1.7; color: rgba(240,236,228,0.5); }
        .exp-tag { display: inline-block; margin-top: 20px; font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--red); border: 1px solid rgba(192,0,12,0.3); padding: 6px 14px; }

        /* TEAM */
        .team-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; max-width: 700px; }
        .team-card { display: flex; flex-direction: column; gap: 16px; }
        .team-img-wrap { width: 120px; height: 140px; overflow: hidden; position: relative; }
        .team-img-wrap::after { content: ''; position: absolute; inset: 0; border: 1px solid rgba(192,0,12,0.4); }
        .team-avatar { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .team-avatar span { font-family: 'Bebas Neue', sans-serif; font-size: 40px; color: rgba(192,0,12,0.4); }
        .team-name { font-family: 'Bebas Neue', sans-serif; font-size: 24px; letter-spacing: 2px; }
        .team-role { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--red); line-height: 1.6; }
        .team-exp { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; color: rgba(240,236,228,0.35); letter-spacing: 2px; }

        /* CONTACT */
        .contact-section { background: var(--gray); text-align: center; padding: 100px 60px; position: relative; overflow: hidden; }
        .contact-section::before {
          content: 'CONTACT'; position: absolute;
          font-family: 'Bebas Neue', sans-serif; font-size: 220px;
          color: rgba(192,0,12,0.03); top: 50%; left: 50%;
          transform: translate(-50%, -50%); white-space: nowrap; pointer-events: none;
        }
        .contact-title { font-family: 'Bebas Neue', sans-serif; font-size: clamp(50px, 8vw, 100px); letter-spacing: 4px; line-height: 1; margin-bottom: 20px; }
        .contact-title span { color: var(--red); }
        .contact-sub { font-family: 'Barlow Condensed', sans-serif; font-size: 13px; letter-spacing: 5px; text-transform: uppercase; color: rgba(240,236,228,0.35); margin-bottom: 60px; }
        .contact-cards { display: flex; justify-content: center; gap: 60px; margin-bottom: 60px; flex-wrap: wrap; }
        .contact-card { text-align: left; }
        .contact-card-name { font-family: 'Bebas Neue', sans-serif; font-size: 20px; letter-spacing: 2px; margin-bottom: 10px; }
        .contact-card-info { font-family: 'Barlow', sans-serif; font-size: 13px; color: rgba(240,236,228,0.45); line-height: 2; }
        .contact-card-info a { color: rgba(240,236,228,0.45); text-decoration: none; transition: color 0.3s; }
        .contact-card-info a:hover { color: var(--red); }
        .contact-social { font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 4px; text-transform: uppercase; color: rgba(240,236,228,0.25); margin-top: 40px; }
        .contact-social a { color: rgba(240,236,228,0.5); text-decoration: none; transition: color 0.3s; }
        .contact-social a:hover { color: var(--red); }

        /* FOOTER */
        .footer { padding: 30px 60px; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(240,236,228,0.06); }
        .footer-copy { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 2px; color: rgba(240,236,228,0.2); text-transform: uppercase; }
        .footer-link { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; letter-spacing: 3px; color: var(--red); text-decoration: none; text-transform: uppercase; transition: opacity 0.3s; }
        .footer-link:hover { opacity: 0.7; }

        /* Reveal */
        .reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        @media (max-width: 900px) {
          .nav { padding: 20px 24px; }
          .nav-links { display: none; }
          .nav-auth { gap: 8px; }
          .nav-auth-btn { padding: 8px 16px; font-size: 10px; }
          .section { padding: 80px 24px; }
          .hero { padding: 0 24px; }
          .hero-scroll { left: 24px; }
          .hero-counter { right: 24px; }
          .concept-grid, .exp-grid, .team-grid { grid-template-columns: 1fr; }
          .tour-cities { grid-template-columns: 1fr 1fr; }
          .contact-cards { flex-direction: column; align-items: center; }
          .footer { flex-direction: column; gap: 12px; text-align: center; }
        }
      `}</style>

      {/* Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* NAV */}
      <nav className="nav">
        <Link href="/" className="nav-logo-img" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
          <Logo size={110} />
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
          <ul className="nav-links">
            {["concept", "tour", "experiences", "team", "contact"].map((id) => (
              <li key={id}>
                <a href={`#${id}`} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
                  {id === "concept" ? "Concept" : id === "tour" ? "Le Tour" : id === "experiences" ? "Expériences" : id === "team" ? "Équipe" : "Contact"}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-auth">
            <Link href="/login" className="nav-auth-btn" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Login</Link>
            <Link href="/register" className="nav-auth-btn nav-auth-btn-register" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Register</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-noise" />
        <div className="hero-line" />
        <p className="hero-tag">Between Art &amp; Fiction</p>
        
        <p className="hero-subtitle">Musique · Nature · Tourisme · Culture</p>
        <div className="hero-cta">
          <a href="#concept" className="btn-primary" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Découvrir</a>
          <a href="#contact" className="btn-outline" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>Nous rejoindre</a>
        </div>
        <div className="hero-scroll">
          <div className="scroll-line" />
          <span className="scroll-text">Scroll</span>
        </div>
        <div className="hero-counter">{heroCounter}</div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) => (
            ["THE <X/> PARALLEL", "BETWEEN ART & FICTION", "MOROCCAN CARAVAN TOUR", "MUSIQUE × TOURISME", "NATURE × CULTURE"].map((item, i) => (
              <span key={`${rep}-${i}`} className="marquee-item">{item}</span>
            ))
          ))}
        </div>
      </div>

      {/* CONCEPT */}
      <section className="section" id="concept">
        <div className="section-header reveal">
          <span className="section-num">01</span>
          <div className="section-line" />
        </div>
        <div className="concept-grid">
          <div className="concept-text reveal">
            <h2 className="section-title" style={{ marginBottom: 40 }}>Notre<br />Concept</h2>
            <p>Unir l'utile e t l ' a g r é a b l e p o u r s e retrouver e e t profitable, entre emportement e t passion.</p>
            <p><strong>THE X PARALLEL</strong> est un concept innovant qui repère le monde de la musique, rythmes, ondes sonores, en communiquant de manières différentes sur plusieurs sujets, un mouvement qui lie entre deux mondes parallèles ; la Musique et le quotidien, la musique et le tourisme, la musique et la nature,... La musique et le monde </p>
            <p><strong>THE X PARALLEL</strong> , se base spécialement sur la musique électronique, underground comme éthnique. L'évènement se déroule dans des paysages pittoresques, naturels ou historiques. L'équipe s'appuie sur des partenaires locaux de différentes origines: " cosmétique bio, modélistes contemporains, artistes photographes" le tout pour promouvoir le tourisme national, faire connaître le Maroc et transmettre l'originalité des différentes richesses du royaume en optant pour un esprit associatif, avec l'objectif d'aider les villageois de différentes régions</p>
          </div>
          <div className="concept-visual reveal">
            <p className="concept-tag">Nos univers</p>
            {pills.map((pill, i) => (
              <div key={i} className={`concept-pill${i === 4 || i === 7 ? " full" : ""}`} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>{pill}</div>
            ))}
          </div>
        </div>
      </section>

      {/* TOUR */}
      <section className="section" id="tour" style={{ paddingTop: 0 }}>
        <div className="section-header reveal">
          <span className="section-num">02</span>
          <div className="section-line" />
        </div>
        <h2 className="section-title reveal">Moroccan<br />Caravan Tour</h2>
        <div className="reveal" style={{ maxWidth: 640, marginTop: 24 }}>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(240,236,228,0.6)" }}>
            À travers des productions audio-visuelles immersives et itinérantes, ce concept explore les différentes régions du Maroc, révélant la diversité de leurs instruments, rythmes et traditions.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(240,236,228,0.6)", marginTop: 16 }}>
            Moroccan Carvan Tour est un concept qui célèbre la richesse du patrimoine musical marocain, véritable témoignage de son identité culturelle et touristique.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(240,236,228,0.6)", marginTop: 16 }}>
            Chaque étape de ce voyage musical met en lumière le dialogue entre les mélodies envoûtantes et les emblèmes de chaque région du Maroc, tout en créant une harmonie entre musique et patrimoine visuel.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.8, color: "rgba(240,236,228,0.6)", marginTop: 16 }}>
            Le Moroccan Caravan Tour tisse un lien entre le passé et le présent, la musique et le tourisme, pour offrir une expérience unique où chaque note raconte l&apos;histoire du Maroc.
          </p>
        </div>
        <div className="tour-cities reveal">
          {cities.map((city) => (
            <div key={city.name} className="city-card" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <div className="city-card-bg">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  sizes="(max-width: 900px) 50vw, 33vw"
                />
              </div>
              <div className="city-content">
                <div className="city-name">{city.name}</div>
                <div className="city-region">{city.region}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="section" id="experiences">
        <div className="section-header reveal">
          <span className="section-num">03</span>
          <div className="section-line" />
        </div>
        <h2 className="section-title reveal" style={{ marginBottom: 40 }}>Nos<br />Expériences</h2>
        <div className="exp-grid reveal">
          {experiences.map((exp) => (
            <div key={exp.num} className="exp-card" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <div className="exp-num">{exp.num}</div>
              <div className="exp-name">{exp.name}</div>
              <p className="exp-desc">{exp.desc}</p>
              <span className="exp-tag">{exp.tag}</span>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="section" id="team">
        <div className="section-header reveal">
          <span className="section-num">04</span>
          <div className="section-line" />
        </div>
        <h2 className="section-title reveal" style={{ marginBottom: 16 }}>L&apos;Équipe</h2>
        <p className="reveal" style={{ fontSize: 14, color: "rgba(240,236,228,0.4)", letterSpacing: 2, textTransform: "uppercase", fontFamily: "'Barlow Condensed', sans-serif", marginBottom: 60 }}>
          Jeune · Expérimentée · Passionnée
        </p>
        <div className="team-grid reveal">
          {[
            { initials: "OE", name: "Omar Echeddadi", role: "Directeur Développement\n& DJ", exp: "20 ans d'expérience", bg: "linear-gradient(135deg,#2a2020,#1a1010)" },
            
          ].map((member) => (
            <div key={member.initials} className="team-card" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>
              <div className="team-img-wrap">
                <div className="team-avatar" style={{ background: member.bg }}>
                  <span>{member.initials}</span>
                </div>
              </div>
              <div className="team-name">{member.name}</div>
              <div className="team-role" style={{ whiteSpace: "pre-line" }}>{member.role}</div>
              <div className="team-exp">{member.exp}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <div className="contact-section" id="contact">
        <h2 className="contact-title reveal">Rejoignez<br />L&apos;<span>Aventure</span></h2>
        <p className="contact-sub reveal">Partenariats · Collaborations · Presse</p>
        <div className="contact-cards reveal">
          {[
            { name: "Omar Ech-Cheddadi", phone: "+212 662 888 277", email: "O.cheddadi@thexparallel.com" },
            
          ].map((c) => (
            <div key={c.name} className="contact-card">
              <div className="contact-card-name">{c.name}</div>
              <div className="contact-card-info">
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>{c.phone}</a><br />
                <a href={`mailto:${c.email}`} onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>{c.email}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="contact-social reveal">
          <a href="https://instagram.com/the_x_parallel" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>@the_x_parallel</a>
          &nbsp;·&nbsp;
          <a href="https://www.thexparallel.com" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>www.thexparallel.com</a>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <span className="footer-copy">© The X Parallel — All rights reserved</span>
        <a href="https://www.thexparallel.com" className="footer-link" onMouseEnter={handleCursorEnter} onMouseLeave={handleCursorLeave}>thexparallel.com</a>
      </footer>
    </>
  );
}
