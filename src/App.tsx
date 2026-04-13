import React, { useEffect, useRef, useState } from 'react'
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import {
  Phone, Mail, MessageCircle, MapPin, ChevronRight, ChevronDown,
  ArrowUp, Menu, X, Heart, Star, CheckCircle2, ArrowLeft,
  Clock, Shield, Users, Activity, Leaf, Award, Calendar
} from 'lucide-react'

// ─── IMAGES ───
const IMG = {
  heroM:   '/img/hero_mobile.jpg',
  heroD:   '/img/hero_desktop.jpg',
  thuis:   '/img/thuiszorg.jpg',
  dement:  '/img/dementiezorg.jpg',
  revalid: '/img/revalidatie.jpg',
}

// ─── SERVICES ───
const SERVICES = [
  {
    slug: 'thuiszorg',
    title: 'Thuiszorg',
    short: 'Professionele, persoonlijke verzorging in uw eigen vertrouwde omgeving.',
    icon: Heart,
    img: IMG.thuis,
    imgPos: 'center center',
    num: '01',
    color: 'var(--green)',
    intro: 'Kwalitatieve thuiszorg die aansluit bij uw dagelijkse behoeften en wensen. Onze verzorgenden komen bij u thuis voor persoonlijke en medische ondersteuning.',
    bullets: [
      'Persoonlijke verzorging & hygiëne',
      'Medicatiebeheer & toediening',
      'Wondverzorging & medische zorg',
      'Huishoudelijke ondersteuning',
      'Maaltijdbegeleiding',
      'Sociaal contact & activering',
    ],
    usps: [
      { icon: Heart,    t: 'Persoonsgericht',  s: 'Zorg op maat, afgestemd op uw wensen' },
      { icon: Shield,   t: 'BIG-geregistreerd',s: 'Gecertificeerde zorgprofessionals' },
      { icon: Clock,    t: '7 dagen beschikbaar',s: 'Ook in het weekend en op feestdagen' },
      { icon: Leaf,     t: 'Vertrouwd thuis',  s: 'U blijft in uw eigen omgeving' },
    ],
    text: `Thuis zorg ontvangen voelt vertrouwd en veilig. Onze thuiszorgverzorgenden zijn opgeleid om u te ondersteunen bij alle aspecten van het dagelijks leven, van persoonlijke verzorging tot medische handelingen.\n\nWij geloven dat goede zorg begint met een vertrouwensrelatie. Daarom werken wij waar mogelijk met dezelfde vaste verzorgende, zodat u weet wie er aan uw deur komt.\n\nOf het nu gaat om dagelijkse hulp of intensievere begeleiding: wij passen ons aan aan uw situatie en uw tempo.`,
  },
  {
    slug: 'dementiezorg',
    title: 'Dementiezorg',
    short: 'Gespecialiseerde, liefdevolle zorg voor mensen met dementie en hun naasten.',
    icon: Users,
    img: IMG.dement,
    imgPos: 'center 30%',
    num: '02',
    color: 'var(--green)',
    intro: 'Dementie vraagt om specialistische kennis, geduld en empathie. Onze zorgverleners zijn getraind in persoonsgerichte dementiezorg en ondersteunen zowel de cliënt als de mantelzorger.',
    bullets: [
      'Persoonsgerichte dementiezorg',
      'Dagstructuur & activering',
      'Begeleiding bij gedragsverandering',
      'Ondersteuning mantelzorgers',
      'Veilige leefomgeving',
      'Samenwerking met huisarts & specialist',
    ],
    usps: [
      { icon: Heart,    t: 'Gespecialiseerd',  s: 'Specifiek getraind in dementiezorg' },
      { icon: Users,    t: 'Familie betrekken', s: 'Naasten worden actief ondersteund' },
      { icon: Shield,   t: 'Veiligheid',        s: 'Veilige en vertrouwde omgeving' },
      { icon: Clock,    t: 'Continuïteit',      s: 'Vaste zorgverleners voor vertrouwen' },
    ],
    text: `Dementie is een ingrijpende ziekte, voor de persoon zelf maar ook voor de mensen om hem of haar heen. Onze gespecialiseerde dementiezorgverleners begrijpen dit en bieden zorg die aansluit bij de belevingswereld van de cliënt.\n\nWij werken met de methode van persoonsgerichte zorg: de mens staat centraal, niet de ziekte. Door aan te sluiten bij wat iemand nog kan en nog prettig vindt, behouden we zoveel mogelijk kwaliteit van leven.\n\nOok voor mantelzorgers bieden wij ondersteuning en respijtzorg, zodat zij even op adem kunnen komen.`,
  },
  {
    slug: 'revalidatie',
    title: 'Revalidatie',
    short: 'Gerichte begeleiding bij herstel na ziekte, operatie of een val.',
    icon: Activity,
    img: IMG.revalid,
    imgPos: 'center center',
    num: '03',
    color: 'var(--green)',
    intro: 'Na een ziekenhuisopname of een periode van ziekte wilt u zo snel mogelijk weer uw eigen leven leiden. Onze revalidatiezorgverleners ondersteunen u stap voor stap.',
    bullets: [
      'Herstelondersteuning na operatie',
      'Oefentherapie & mobiliteitsverbetering',
      'Valpreventie & looptraining',
      'ADL-training (activiteiten dagelijks leven)',
      'Samenwerking fysiotherapeut',
      'Psychosociale begeleiding bij herstel',
    ],
    usps: [
      { icon: Activity, t: 'Herstelgericht',   s: 'Terug naar zelfstandigheid' },
      { icon: Shield,   t: 'Multidisciplinair',s: 'Samenwerking met andere zorgverleners' },
      { icon: Heart,    t: 'Motiverend',       s: 'Positieve begeleiding bij iedere stap' },
      { icon: Clock,    t: 'Op uw tempo',      s: 'Herstel gaat in uw eigen ritme' },
    ],
    text: `Revalideren thuis is voor veel mensen de beste oplossing. In uw eigen vertrouwde omgeving, omringd door uw dierbaren, verloopt het herstel vaak sneller en prettiger dan in een instelling.\n\nOnze revalidatiezorgverleners werken nauw samen met uw behandelend arts, fysiotherapeut en andere specialisten. Zo ontvangt u een coherent zorgplan dat gericht is op uw persoonlijke hersteldoelen.\n\nVan eenvoudige looptraining tot intensieve herstelzorg na een ernstige operatie: wij staan naast u in elk stadium van uw herstel.`,
  },
]

// ─── ANIMATION HELPERS ───
const FU = ({ children, delay = 0, style = {}, className = '' }: any) => {
  const ref = useRef(null)
  const v = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref} style={style} className={className}
      initial={{ opacity: 0, y: 24 }} animate={v ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  )
}
const FL = ({ children, delay = 0, style = {} }: any) => {
  const ref = useRef(null); const v = useInView(ref, { once: true, margin: '-40px' })
  return <motion.div ref={ref} style={style} initial={{ opacity: 0, x: -28 }} animate={v ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
const FR = ({ children, delay = 0, style = {} }: any) => {
  const ref = useRef(null); const v = useInView(ref, { once: true, margin: '-40px' })
  return <motion.div ref={ref} style={style} initial={{ opacity: 0, x: 28 }} animate={v ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}
const CU = ({ end, suffix = '' }: { end: number; suffix?: string }) => {
  const ref = useRef(null); const v = useInView(ref, { once: true }); const [n, setN] = useState(0)
  useEffect(() => {
    if (!v) return; let s = 0; const step = end / 55
    const t = setInterval(() => { s += step; if (s >= end) { setN(end); clearInterval(t) } else setN(Math.floor(s)) }, 18)
    return () => clearInterval(t)
  }, [v, end])
  return <span ref={ref}>{n}{suffix}</span>
}
const ScrollTop = () => {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

// ─── LOGO ───
const Logo = ({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) => {
  const fs = size === 'sm' ? 15 : size === 'lg' ? 28 : 20
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: fs, fontWeight: 700, color: 'var(--green)', letterSpacing: '0.01em' }}>Vita</span>
      <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: fs, fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.01em' }}>Zorg</span>
    </span>
  )
}

// ─── WA BUBBLE ───
const WA = () => {
  const [open, setOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const [btns, setBtns] = useState(false)
  const msg = 'Goedemiddag! Ik ben Sophia van VitaZorg. Waarmee kan ik u helpen?'
  useEffect(() => {
    if (!open) { setTyped(''); setBtns(false); return }
    let i = 0
    const t = setInterval(() => { i++; setTyped(msg.slice(0, i)); if (i >= msg.length) { clearInterval(t); setTimeout(() => setBtns(true), 400) } }, 26)
    return () => clearInterval(t)
  }, [open])
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 14 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            style={{ position: 'fixed', bottom: 84, right: 16, zIndex: 499, width: 300, background: 'var(--white)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(30,107,74,0.2)', border: '1px solid var(--border)' }}>
            <div style={{ background: 'var(--green)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={18} color="white" fill="white" />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>VitaZorg</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7fffd4' }} />Online beschikbaar
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ background: 'var(--bg2)', padding: '16px 14px', minHeight: 88 }}>
              <div style={{ background: 'var(--white)', borderRadius: '4px 16px 16px 16px', padding: '10px 14px', maxWidth: '90%', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6, minHeight: 18 }}>
                  {typed}{typed.length < msg.length && <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.7, repeat: Infinity }} style={{ color: 'var(--green)', fontWeight: 700 }}>|</motion.span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text2)', marginTop: 4, textAlign: 'right' }}>Nu ✓✓</div>
              </div>
            </div>
            <AnimatePresence>
              {btns && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  style={{ padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: 8, background: 'var(--white)', borderTop: '1px solid var(--border)' }}>
                  <motion.a href="https://wa.me/31612345678" target="_blank" rel="noopener" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    style={{ background: '#25d366', color: '#fff', padding: '11px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, textAlign: 'center', display: 'block' }}>
                    💬 WhatsApp ons
                  </motion.a>
                  <Link to="/contact" onClick={() => setOpen(false)}>
                    <div style={{ background: 'var(--green)', color: '#fff', padding: '11px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                      Neem contact op
                    </div>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button onClick={() => setOpen(o => !o)} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }}
        animate={!open ? { boxShadow: ['0 0 0 0 rgba(37,211,102,0.4)', '0 0 0 12px rgba(37,211,102,0)', '0 0 0 0 rgba(37,211,102,0)'] } : {}}
        transition={!open ? { duration: 2.8, repeat: Infinity } : {}}
        style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 500, width: 56, height: 56, borderRadius: '50%', background: '#25d366', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}>
        <AnimatePresence mode="wait">
          {open ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} color="#fff" /></motion.div>
                : <motion.div key="wa" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><MessageCircle size={24} fill="white" color="white" /></motion.div>}
        </AnimatePresence>
      </motion.button>
    </>
  )
}

// ─── NAV ───
const Nav = () => {
  const [mob, setMob] = useState(false)
  const [dd, setDd] = useState(false)
  const [mobSvc, setMobSvc] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const ddRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  useEffect(() => { setMob(false); setDd(false) }, [location])
  useEffect(() => { const h = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ddRef.current && !ddRef.current.contains(e.target as Node)) setDd(false) }
    document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h)
  }, [])

  const navBg = scrolled ? 'rgba(250,250,248,0.97)' : 'rgba(250,250,248,0.92)'

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300, height: 68, background: navBg, backdropFilter: 'blur(16px)', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent', transition: 'all 0.3s', display: 'flex', alignItems: 'center' }}>
        <div className="wrap" style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
          {/* Desktop logo */}
          <Link to="/" className="d-logo" style={{ display: 'flex', alignItems: 'center' }}>
            <Logo size="md" />
          </Link>

          {/* Desktop links */}
          <div className="d-links" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div ref={ddRef} style={{ position: 'relative' }}>
              <button onMouseEnter={() => setDd(true)} onClick={() => setDd(d => !d)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', fontSize: 14, fontWeight: 500, color: dd ? 'var(--green)' : 'var(--text)', fontFamily: 'DM Sans, sans-serif' }}>
                Zorg & Diensten <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: dd ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>
              <AnimatePresence>
                {dd && (
                  <motion.div onMouseLeave={() => setDd(false)}
                    initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 10, background: 'var(--white)', borderRadius: 16, overflow: 'hidden', width: 360, boxShadow: '0 24px 64px rgba(30,107,74,0.15)', border: '1px solid var(--border)', zIndex: 400 }}>
                    <Link to="/diensten"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--green3)', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Alle diensten</span>
                      <ChevronRight size={13} color="var(--green)" />
                    </Link>
                    {SERVICES.map(s => {
                      const I = s.icon
                      return (
                        <Link key={s.slug} to={`/diensten/${s.slug}`}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget as any).style.background = 'var(--green3)'}
                          onMouseLeave={e => (e.currentTarget as any).style.background = 'transparent'}>
                          <div style={{ width: 38, height: 38, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <I size={16} color="var(--green)" />
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 2 }}>{s.title}</div>
                            <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 300 }}>{s.short}</div>
                          </div>
                          <ChevronRight size={12} color="var(--text2)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {[{ label: 'Over ons', to: '/over-ons' }, { label: 'Contact', to: '/contact' }].map(l => (
              <Link key={l.to} to={l.to}
                style={{ padding: '8px 14px', fontSize: 14, fontWeight: 500, color: 'var(--text)', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget as any).style.color = 'var(--green)'}
                onMouseLeave={e => (e.currentTarget as any).style.color = 'var(--text)'}>
                {l.label}
              </Link>
            ))}
            <Link to="/contact">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                style={{ marginLeft: 10, background: 'var(--green)', color: '#fff', padding: '10px 22px', borderRadius: 100, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>
                <Phone size={13} /> Bel ons
              </motion.div>
            </Link>
          </div>

          {/* Mobile */}
          <button onClick={() => setMob(o => !o)} className="m-hb" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--dark)', alignItems: 'center', justifyContent: 'center' }}>
            {mob ? <X size={22} /> : <Menu size={22} />}
          </button>
          <Link to="/" className="m-logo" style={{ display: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)', alignItems: 'center' }}>
            <Logo size="md" />
          </Link>
          <a href="tel:0612345678" className="m-phone" style={{ display: 'none', marginLeft: 'auto', color: 'var(--green)', padding: 8, alignItems: 'center' }}>
            <Phone size={22} color="var(--green)" />
          </a>
        </div>
      </nav>

      <AnimatePresence>
        {mob && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ position: 'fixed', top: 68, left: 0, right: 0, zIndex: 299, background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '16px 20px 28px', display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 'calc(100vh - 68px)', overflowY: 'auto', boxShadow: '0 16px 40px rgba(30,107,74,0.12)' }}>
            <div>
              <button onClick={() => setMobSvc(s => !s)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px', fontSize: 17, fontWeight: 500, color: 'var(--dark)', textAlign: 'left', fontFamily: 'DM Sans, sans-serif' }}>
                Zorg & Diensten <ChevronDown size={16} color="var(--green)" style={{ transform: mobSvc ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>
              <AnimatePresence>
                {mobSvc && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', paddingLeft: 12 }}>
                    <Link to="/diensten" onClick={() => setMob(false)} style={{ display: 'block', padding: '10px 12px', fontSize: 13, color: 'var(--green)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Alle diensten →</Link>
                    {SERVICES.map(s => {
                      const I = s.icon
                      return (
                        <Link key={s.slug} to={`/diensten/${s.slug}`} onClick={() => setMob(false)}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8 }}>
                          <I size={15} color="var(--green)" />
                          <span style={{ fontSize: 16, color: 'var(--dark)', fontWeight: 500 }}>{s.title}</span>
                        </Link>
                      )
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {[{ label: 'Over ons', to: '/over-ons' }, { label: 'Contact', to: '/contact' }].map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 + 0.1 }}>
                <Link to={l.to} onClick={() => setMob(false)} style={{ display: 'block', padding: '14px 12px', fontSize: 17, fontWeight: 500, color: 'var(--dark)' }}>{l.label}</Link>
              </motion.div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
              <motion.a href="tel:0612345678" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}
                style={{ flex: 1, background: 'var(--green)', color: '#fff', padding: '14px 20px', borderRadius: 100, textAlign: 'center', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <Phone size={16} /> Bel direct
              </motion.a>
              <Link to="/contact" onClick={() => setMob(false)}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                  style={{ background: 'var(--gold)', color: '#fff', padding: '14px 20px', borderRadius: 100, textAlign: 'center', fontSize: 15, fontWeight: 600 }}>
                  Offerte
                </motion.div>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@media(min-width:769px){.m-hb,.m-logo,.m-phone{display:none!important}.d-logo,.d-links{display:flex!important}}@media(max-width:768px){.d-logo,.d-links{display:none!important}.m-hb,.m-logo,.m-phone{display:flex!important}}`}</style>
    </>
  )
}

// ─── FOOTER ───
const Footer = () => {
  const [top, setTop] = useState(false)
  useEffect(() => { const h = () => setTop(window.scrollY > 400); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h) }, [])
  return (
    <>
      <footer style={{ background: 'var(--dark)', color: 'rgba(255,255,255,0.7)', padding: '64px 0 32px' }}>
        <div className="wrap">
          <div className="fg" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 56, marginBottom: 48, paddingBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>
              <div style={{ marginBottom: 16 }}><Logo size="lg" /></div>
              <p style={{ fontSize: 14, lineHeight: 1.8, maxWidth: 260, marginBottom: 24, opacity: 0.7 }}>
                Professionele thuiszorg met hart voor de mens. Wij zorgen voor u in uw eigen vertrouwde omgeving.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                {['AGB-gecertificeerd', 'ISO 9001', 'WTZi'].map(b => (
                  <div key={b} style={{ background: 'var(--green)', color: '#fff', fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.06em', opacity: 0.9 }}>{b}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Onze zorg</div>
              {SERVICES.map(s => (
                <Link key={s.slug} to={`/diensten/${s.slug}`} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as any).style.color = 'var(--gold)'}
                  onMouseLeave={e => (e.currentTarget as any).style.color = 'rgba(255,255,255,0.65)'}>{s.title}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
              {[{ label: 'Over ons', to: '/over-ons' }, { label: 'Contact', to: '/contact' }].map(l => (
                <Link key={l.to} to={l.to} style={{ display: 'block', fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 10, transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as any).style.color = 'var(--gold)'}
                  onMouseLeave={e => (e.currentTarget as any).style.color = 'rgba(255,255,255,0.65)'}>{l.label}</Link>
              ))}
              <div style={{ marginTop: 16 }}>
                <a href="tel:0612345678" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}><Phone size={13} color="var(--gold)" />06-12345678</a>
                <a href="mailto:info@vitazorg.nl" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'rgba(255,255,255,0.65)', marginBottom: 12 }}><Mail size={13} color="var(--gold)" />info@vitazorg.nl</a>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#7fffd4', fontWeight: 500 }}>
                  <div style={{ width: 6, height: 6, background: '#7fffd4', borderRadius: '50%', animation: 'pulse 2s infinite' }} />7 dagen bereikbaar
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.4 }}>© 2026 VitaZorg BV · KvK: 12345678 · Vision Web Agency</div>
            <div style={{ display: 'flex', gap: 18 }}>{['Privacy', 'Voorwaarden', 'Cookies'].map(l => <a key={l} href="#" style={{ fontSize: 12, opacity: 0.4 }}>{l}</a>)}</div>
          </div>
        </div>
      </footer>
      <AnimatePresence>
        {top && (
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ position: 'fixed', bottom: 84, right: 16, zIndex: 300, width: 44, height: 44, borderRadius: '50%', background: 'var(--green)', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(30,107,74,0.3)' }}>
            <ArrowUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}@media(max-width:600px){.fg{grid-template-columns:1fr 1fr!important;gap:28px!important}.fg>div:first-child{grid-column:1/-1}}`}</style>
    </>
  )
}

// ─── PAGE HEADER (reusable) ───
const PageHdr = ({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) => (
  <div style={{ paddingTop: 68, background: 'linear-gradient(135deg, var(--green) 0%, #2d8a5e 100%)', overflow: 'hidden', position: 'relative' }}>
    <div style={{ position: 'absolute', inset: 0, background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")', opacity: 0.6 }} />
    <div className="wrap" style={{ padding: '52px 20px 48px', position: 'relative', zIndex: 1 }}>
      <FU>
        <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 1.5, background: 'var(--gold)' }} />{eyebrow}
        </div>
        <h1 style={{ color: '#fff', marginBottom: sub ? 12 : 0 }}>{title}</h1>
        {sub && <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.75)', fontWeight: 300, maxWidth: 540, lineHeight: 1.75, marginTop: 8 }}>{sub}</p>}
      </FU>
    </div>
    <div style={{ height: 3, background: `linear-gradient(90deg, var(--gold), transparent 60%)` }} />
  </div>
)

// ─────────────────────────────────────────────
// PAGE: HOME
// ─────────────────────────────────────────────
const PageHome = () => {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 60])

  const reviews = [
    { t: 'De verzorgenden van VitaZorg zijn echte professionals. Mijn moeder voelt zich veilig en goed verzorgd.', name: 'Familie Van der Berg', role: 'Thuiszorg client', stars: 5 },
    { t: 'Eindelijk een zorgorganisatie die echt luistert. Altijd dezelfde verzorgende en altijd op tijd.', name: 'Mevr. De Graaf', role: 'Revalidatiezorg', stars: 5 },
    { t: 'De begeleiding bij de dementiezorg van mijn vader is uitzonderlijk warm en professioneel.', name: 'Familie Janssen', role: 'Dementiezorg client', stars: 5 },
  ]

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100svh', display: 'flex', alignItems: 'center' }}>
        {/* Desktop hero bg */}
        <motion.div className="hero-d" style={{ y: heroY, position: 'absolute', inset: '-8% 0', zIndex: 0 }}>
          <img src={IMG.heroD} alt="VitaZorg verzorgenden"
            style={{ width: '100%', height: '110%', objectFit: 'cover', objectPosition: 'center 35%', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(250,250,248,0.96) 0%, rgba(250,250,248,0.8) 45%, rgba(250,250,248,0.15) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 30%)' }} />
        </motion.div>

        {/* Mobile hero bg */}
        <div className="hero-m" style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src={IMG.heroM} alt="VitaZorg"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 20%', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(250,250,248,0.3) 0%, rgba(250,250,248,0.92) 55%, var(--bg) 100%)' }} />
        </div>

        <div className="wrap" style={{ position: 'relative', zIndex: 1, width: '100%', paddingTop: 120 }}>
          <div className="hero-content" style={{ maxWidth: 580 }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 32, height: 1.5, background: 'var(--gold)' }} />
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green)' }}>AGB-gecertificeerde thuiszorg</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ color: 'var(--dark)', marginBottom: 20, lineHeight: 1.08 }}>
              Zorg met<br />
              <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>hart en aandacht</em><br />
              bij u thuis.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }}
              style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1.85, marginBottom: 36, fontWeight: 300, maxWidth: 480 }}>
              VitaZorg levert kwalitatieve thuiszorg, dementiezorg en revalidatiezorg door gecertificeerde zorgprofessionals. Persoonlijk, betrouwbaar en altijd dichtbij.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.58 }}
              style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(30,107,74,0.3)' }} whileTap={{ scale: 0.97 }}
                  style={{ background: 'var(--green)', color: '#fff', padding: '15px 28px', borderRadius: 100, fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 20px rgba(30,107,74,0.2)' }}>
                  <Calendar size={15} /> Gratis kennismaking
                </motion.div>
              </Link>
              <Link to="/diensten">
                <motion.div whileHover={{ scale: 1.03, borderColor: 'var(--green)', color: 'var(--green)' }}
                  style={{ background: 'transparent', color: 'var(--text)', padding: '15px 28px', borderRadius: 100, fontSize: 15, fontWeight: 500, border: '1.5px solid rgba(30,107,74,0.3)', cursor: 'pointer', transition: 'all 0.2s' }}>
                  Onze diensten
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
              style={{ display: 'flex', gap: 20, marginTop: 40, flexWrap: 'wrap' }}>
              {[{ n: '500+', l: 'Cliënten' }, { n: '12', l: 'Jaar ervaring' }, { n: '98%', l: 'Tevredenheid' }].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: 'var(--green)' }}>{s.n}</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 400, lineHeight: 1.3 }}>{s.l}</div>
                  {i < 2 && <div style={{ width: 1, height: 24, background: 'var(--border)', marginLeft: 12 }} />}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
          <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown size={22} color="var(--green)" style={{ opacity: 0.5 }} />
          </motion.div>
        </motion.div>
      </section>
      <style>{`.hero-d{display:block}.hero-m{display:none}@media(max-width:768px){.hero-d{display:none!important}.hero-m{display:block!important}.hero-content{max-width:100%!important;padding-top:300px;padding-bottom:40px}}`}</style>

      {/* ── 3 DIENSTEN ── */}
      <section style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div className="wrap">
          <FU style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
              <div>
                <div className="eyebrow">Onze zorgdiensten</div>
                <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 16 }} />
                <h2 style={{ color: 'var(--dark)' }}>Vakkundige zorg,<br />
                  <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>precies waar u het nodig heeft</span>
                </h2>
              </div>
              <Link to="/diensten">
                <motion.div whileHover={{ scale: 1.03, background: 'var(--green)', color: '#fff' }}
                  style={{ color: 'var(--green)', padding: '12px 24px', border: '1.5px solid var(--green)', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  Alle diensten →
                </motion.div>
              </Link>
            </div>
          </FU>

          <div className="svc3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {SERVICES.map((s, i) => {
              const I = s.icon
              return (
                <FU key={i} delay={i * 0.1}>
                  <Link to={`/diensten/${s.slug}`} style={{ display: 'block', height: '100%' }}>
                    <motion.div whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(30,107,74,0.14)' }}
                      style={{ background: 'var(--white)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', transition: 'box-shadow 0.3s, border-color 0.3s', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget as any).style.borderColor = 'var(--green4)'}
                      onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'var(--border)'}>
                      <div style={{ height: 220, overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                        <motion.img src={s.img} alt={s.title} loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.imgPos, display: 'block' }}
                          whileHover={{ scale: 1.05 }} transition={{ duration: 0.6 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 50%)' }} />
                        <div style={{ position: 'absolute', top: 14, left: 14, background: 'var(--white)', borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <I size={14} color="var(--green)" />
                          <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.num}</span>
                        </div>
                      </div>
                      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--green), var(--gold), transparent)' }} />
                      <div style={{ padding: '22px 22px 26px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <h3 style={{ color: 'var(--dark)', fontSize: 22 }}>{s.title}</h3>
                        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, fontWeight: 300, flex: 1 }}>{s.short}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {s.bullets.slice(0, 3).map(b => (
                            <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text)' }}>
                              <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />{b}
                            </div>
                          ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--green)', marginTop: 6 }}>
                          Lees meer <ChevronRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </FU>
              )
            })}
          </div>
        </div>
        <style>{`@media(max-width:768px){.svc3{grid-template-columns:1fr!important;gap:16px!important}}`}</style>
      </section>

      {/* ── WHY VITAZORG ── */}
      <section style={{ padding: '96px 0', background: 'linear-gradient(135deg, #f0f7f3 0%, var(--bg2) 100%)' }}>
        <div className="wrap">
          <FU style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow" style={{ justifyContent: 'center' }}>Waarom VitaZorg</div>
            <div style={{ width: 48, height: 2, background: 'var(--gold)', margin: '0 auto 16px' }} />
            <h2 style={{ color: 'var(--dark)' }}>Zorg die u kunt <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>vertrouwen</span></h2>
          </FU>
          <div className="why4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 2 }}>
            {[
              { icon: <Heart size={24} color="var(--green)" />, t: 'Persoonsgerichte zorg', s: 'Elk zorgplan is uniek en afgestemd op uw persoonlijke situatie en wensen.' },
              { icon: <Award size={24} color="var(--green)" />, t: 'BIG-geregistreerd', s: 'Al onze medewerkers zijn gecertificeerd en staan geregistreerd in het BIG-register.' },
              { icon: <Shield size={24} color="var(--green)" />, t: 'Vaste zorgverlener', s: 'U ontvangt zoveel mogelijk van dezelfde zorgverlener voor continuïteit en vertrouwen.' },
              { icon: <Clock size={24} color="var(--green)" />, t: '7 dagen bereikbaar', s: 'Ook in het weekend en op feestdagen staan wij voor u klaar.' },
            ].map((w, i) => (
              <FU key={i} delay={i * 0.08}>
                <motion.div whileHover={{ background: 'var(--white)', boxShadow: 'var(--shadow2)' }}
                  style={{ background: 'var(--white)', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 14, borderRadius: i === 0 ? '20px 0 0 20px' : i === 3 ? '0 20px 20px 0' : 0, transition: 'all 0.25s', border: '1px solid var(--border)' }}>
                  <div style={{ width: 52, height: 52, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {w.icon}
                  </div>
                  <h3 style={{ color: 'var(--dark)', fontSize: 18 }}>{w.t}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, fontWeight: 300 }}>{w.s}</p>
                </motion.div>
              </FU>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.why4{grid-template-columns:1fr 1fr!important}.why4>div{border-radius:16px!important}}@media(max-width:480px){.why4{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── OVER ONS teaser ── */}
      <section style={{ padding: '96px 0', background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="aot" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <FL>
              <div style={{ position: 'relative' }}>
                <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5' }}>
                  <img src={IMG.thuis} alt="VitaZorg team" loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
                </div>
                {/* Floating stat */}
                <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}
                  style={{ position: 'absolute', bottom: 28, left: -20, zIndex: 3, background: 'var(--white)', borderRadius: 18, padding: '16px 22px', boxShadow: '0 12px 40px rgba(30,107,74,0.2)', border: '1px solid var(--border)' }}>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 600, color: 'var(--green)', lineHeight: 1 }}>12+</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3, fontWeight: 500 }}>Jaar ervaring</div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: -14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.65 }}
                  style={{ position: 'absolute', top: 24, right: -16, zIndex: 3, background: 'var(--green)', borderRadius: 14, padding: '10px 16px', boxShadow: '0 8px 24px rgba(30,107,74,0.3)' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 7, height: 7, background: '#7fffd4', borderRadius: '50%' }} />7 DAGEN ZORG
                  </div>
                </motion.div>
                {/* Decorative dots */}
                <div style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, backgroundImage: 'radial-gradient(var(--green4) 1.5px, transparent 1.5px)', backgroundSize: '10px 10px', zIndex: 0, borderRadius: 8 }} />
              </div>
            </FL>
            <FR>
              <div>
                <div className="eyebrow">Over VitaZorg</div>
                <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 20 }} />
                <h2 style={{ color: 'var(--dark)', marginBottom: 20 }}>Meer dan zorg —<br /><span style={{ color: 'var(--green)', fontStyle: 'italic' }}>een vertrouwde partner</span></h2>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.9, marginBottom: 14, fontWeight: 300 }}>
                  VitaZorg is opgericht vanuit de overtuiging dat goede zorg draait om de persoon, niet om de procedure. Wij brengen warmte, deskundigheid en betrokkenheid samen in elk zorgtraject.
                </p>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.9, marginBottom: 32, fontWeight: 300 }}>
                  Onze zorgverleners zijn BIG-geregistreerd en werken vanuit een diepgevoeld gevoel van verantwoordelijkheid voor het welzijn van iedere cliënt.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                  {['AGB-gecertificeerd', 'BIG-geregistreerd', 'ISO 9001', 'WTZi erkend'].map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 100, padding: '6px 14px' }}>
                      <div style={{ width: 4, height: 4, background: 'var(--green)', borderRadius: '50%' }} />
                      <span style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>{c}</span>
                    </motion.div>
                  ))}
                </div>
                <Link to="/over-ons">
                  <motion.div whileHover={{ scale: 1.03, background: 'var(--green)', color: '#fff' }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--green)', padding: '13px 26px', border: '1.5px solid var(--green)', borderRadius: 100, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                    Lees ons verhaal <ChevronRight size={15} />
                  </motion.div>
                </Link>
              </div>
            </FR>
          </div>
        </div>
        <style>{`@media(max-width:768px){.aot{grid-template-columns:1fr!important;gap:44px!important}}`}</style>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding: '96px 0', background: 'var(--dark)', overflow: 'hidden' }}>
        <div className="wrap">
          <FU style={{ marginBottom: 52 }}>
            <div className="eyebrow" style={{ color: 'var(--gold)' }}>Ervaringen</div>
            <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 16 }} />
            <h2 style={{ color: '#fff' }}>Wat onze cliënten<br /><span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>over ons zeggen</span></h2>
          </FU>
          <div className="rvw" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }}>
            {reviews.map((r, i) => (
              <FU key={i} delay={i * 0.1}>
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 20, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.08)', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(r.stars)].map((_, j) => <Star key={j} size={14} fill="var(--gold)" color="var(--gold)" />)}
                  </div>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.8, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 17, flex: 1 }}>"{r.t}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, color: '#fff', flexShrink: 0 }}>{r.name[0]}</div>
                    <div><div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{r.name}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{r.role}</div></div>
                  </div>
                </div>
              </FU>
            ))}
          </div>
        </div>
        <style>{`@media(max-width:768px){.rvw{grid-template-columns:1fr!important}}`}</style>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', background: 'linear-gradient(135deg, var(--green) 0%, #2d8a5e 100%)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div className="wrap" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <FU>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 100, padding: '6px 16px', marginBottom: 20 }}>
              <Heart size={13} color="var(--gold)" fill="var(--gold)" />
              <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Vrijblijvend kennismakingsgesprek</span>
            </div>
            <h2 style={{ color: '#fff', marginBottom: 14 }}>Klaar om te starten<br /><span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>met goede zorg?</span></h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 480, margin: '0 auto 36px', fontWeight: 300, lineHeight: 1.8 }}>
              Neem contact op voor een gratis kennismakingsgesprek. Wij bespreken uw zorgsituatie en maken een persoonlijk zorgplan.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.04, boxShadow: '0 8px 28px rgba(0,0,0,0.2)' }} whileTap={{ scale: 0.97 }}
                  style={{ background: 'var(--white)', color: 'var(--green)', padding: '15px 32px', borderRadius: 100, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
                  <Calendar size={16} /> Kennismaking inplannen
                </motion.div>
              </Link>
              <motion.a href="tel:0612345678" whileHover={{ scale: 1.03 }}
                style={{ background: 'transparent', color: '#fff', padding: '15px 32px', borderRadius: 100, fontSize: 15, fontWeight: 500, border: '1.5px solid rgba(255,255,255,0.35)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Phone size={15} /> 06-12345678
              </motion.a>
            </div>
          </FU>
        </div>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────
// PAGE: DIENSTEN OVERVIEW
// ─────────────────────────────────────────────
const PageDiensten = () => (
  <>
    <PageHdr eyebrow="Ons zorgaanbod" title="Onze diensten" sub="Professionele thuiszorg, dementiezorg en revalidatiezorg — altijd afgestemd op uw persoonlijke situatie." />
    <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
      <div className="wrap">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {SERVICES.map((s, i) => {
            const I = s.icon
            return (
              <FU key={i} delay={i * 0.08}>
                <Link to={`/diensten/${s.slug}`} style={{ display: 'block' }}>
                  <motion.div whileHover={{ boxShadow: '0 16px 48px rgba(30,107,74,0.14)' }}
                    style={{ background: 'var(--white)', borderRadius: 24, overflow: 'hidden', display: 'grid', gridTemplateColumns: '340px 1fr', border: '1px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s, box-shadow 0.3s', boxShadow: 'var(--shadow)' }} className="srow"
                    onMouseEnter={e => (e.currentTarget as any).style.borderColor = 'var(--green4)'}
                    onMouseLeave={e => (e.currentTarget as any).style.borderColor = 'var(--border)'}>
                    <div style={{ position: 'relative', overflow: 'hidden' }}>
                      <motion.img src={s.img} alt={s.title} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: s.imgPos, display: 'block', minHeight: 260 }}
                        whileHover={{ scale: 1.04 }} transition={{ duration: 0.6 }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 70%, rgba(250,250,248,0.5))' }} />
                    </div>
                    <div style={{ padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <I size={20} color="var(--green)" />
                        </div>
                        <div>
                          <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.num}</div>
                          <h3 style={{ color: 'var(--dark)', fontSize: 26, lineHeight: 1.1 }}>{s.title}</h3>
                        </div>
                      </div>
                      <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.8, fontWeight: 300, maxWidth: 480 }}>{s.intro}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {s.bullets.slice(0, 3).map(b => (
                          <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text2)', background: 'var(--bg2)', borderRadius: 100, padding: '4px 12px', border: '1px solid var(--border)' }}>
                            <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />{b}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, color: 'var(--green)', marginTop: 4 }}>
                        Meer over {s.title} <ChevronRight size={14} />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </FU>
            )
          })}
        </div>
      </div>
    </section>
    <style>{`@media(max-width:640px){.srow{grid-template-columns:1fr!important}}`}</style>
  </>
)

// ─────────────────────────────────────────────
// PAGE: DIENST DETAIL
// ─────────────────────────────────────────────
const PageDienstDetail = ({ slug }: { slug: string }) => {
  const service = SERVICES.find(s => s.slug === slug)
  const navigate = useNavigate()
  if (!service) return <div style={{ paddingTop: 140, textAlign: 'center' }}>Niet gevonden.</div>
  const Icon = service.icon
  return (
    <>
      <div style={{ paddingTop: 68, position: 'relative', height: 440, overflow: 'hidden' }}>
        <img src={service.img} alt={service.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: service.imgPos, display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(250,250,248,0.95) 0%, rgba(250,250,248,0.75) 50%, rgba(250,250,248,0.1) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 40%)' }} />
        <div className="wrap" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 48 }}>
          <FU>
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, color: 'var(--text2)', fontSize: 13, fontWeight: 500, marginBottom: 20, padding: 0, fontFamily: 'DM Sans, sans-serif' }}>
              <ArrowLeft size={14} /> Terug
            </button>
            <div className="eyebrow">{`Dienst ${service.num}`}</div>
            <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 14 }} />
            <h1 style={{ color: 'var(--dark)', marginBottom: 10 }}>{service.title}</h1>
            <p style={{ fontSize: 17, color: 'var(--text)', fontWeight: 300, maxWidth: 500, lineHeight: 1.75 }}>{service.intro}</p>
          </FU>
        </div>
      </div>

      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="detg" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 56, alignItems: 'start' }}>
            <div>
              <div style={{ marginBottom: 48 }}>
                <div className="eyebrow">Wat is inbegrepen</div>
                <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="bul2">
                  {service.bullets.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'var(--white)', borderRadius: 14, padding: '16px 16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                      <CheckCircle2 size={16} color="var(--green)" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.5 }}>{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 48 }}>
                <div className="eyebrow">Over deze dienst</div>
                <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
                {service.text.trim().split('\n\n').map((p, i) => (
                  <p key={i} style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.9, fontWeight: 300, marginBottom: 16 }}>{p.trim()}</p>
                ))}
              </div>

              <div>
                <div className="eyebrow">Waarom VitaZorg</div>
                <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="usp2">
                  {service.usps.map((u, i) => {
                    const UI = u.icon
                    return (
                      <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', background: 'var(--white)', borderRadius: 16, padding: '18px 16px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                        <div style={{ width: 40, height: 40, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <UI size={18} color="var(--green)" />
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 4 }}>{u.t}</div>
                          <div style={{ fontSize: 13, color: 'var(--text2)', fontWeight: 300 }}>{u.s}</div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div style={{ borderRadius: 20, overflow: 'hidden', marginBottom: 20, position: 'relative', boxShadow: 'var(--shadow2)' }}>
                <img src={service.img} alt={service.title} loading="lazy"
                  style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', objectPosition: service.imgPos, display: 'block' }} />
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--green), var(--gold))' }} />
              </div>

              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, padding: '26px 22px', marginBottom: 14, boxShadow: 'var(--shadow)', borderTop: '3px solid var(--green)' }}>
                <h3 style={{ color: 'var(--dark)', fontSize: 20, marginBottom: 8 }}>Kennismaking plannen</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, marginBottom: 20 }}>Vrijblijvend gesprek. Wij bellen u terug binnen 24 uur.</p>
                <Link to="/contact" style={{ display: 'block' }}>
                  <motion.div whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(30,107,74,0.3)' }} whileTap={{ scale: 0.97 }}
                    style={{ background: 'var(--green)', color: '#fff', padding: '13px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600, textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <Calendar size={15} /> Maak afspraak
                  </motion.div>
                </Link>
                <motion.a href="tel:0612345678" whileHover={{ scale: 1.02 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 10, color: 'var(--text2)', padding: '11px 20px', borderRadius: 100, fontSize: 13, fontWeight: 500, border: '1px solid var(--border)' }}>
                  <Phone size={13} color="var(--green)" /> 06-12345678
                </motion.a>
              </div>

              {/* Certifications */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 20px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Certificeringen</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {['AGB-gecertificeerd', 'BIG-register', 'ISO 9001', 'WTZi'].map(c => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 100, padding: '4px 12px' }}>
                      <div style={{ width: 4, height: 4, background: 'var(--green)', borderRadius: '50%' }} />
                      <span style={{ fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other services */}
              <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Andere diensten</div>
                {SERVICES.filter(s => s.slug !== slug).map(s => {
                  const SI = s.icon
                  return (
                    <Link key={s.slug} to={`/diensten/${s.slug}`}
                      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)', transition: 'color 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget.querySelector('span') as any).style.color = 'var(--green)' }}
                      onMouseLeave={e => { (e.currentTarget.querySelector('span') as any).style.color = 'var(--text)' }}>
                      <SI size={14} color="var(--green)" />
                      <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500, flex: 1, transition: 'color 0.15s' }}>{s.title}</span>
                      <ChevronRight size={12} color="var(--text2)" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
        <style>{`@media(max-width:768px){.detg{grid-template-columns:1fr!important}.bul2{grid-template-columns:1fr!important}.usp2{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────
// PAGE: OVER ONS
// ─────────────────────────────────────────────
const PageOverOns = () => (
  <>
    <div style={{ paddingTop: 68, position: 'relative', height: 420, overflow: 'hidden' }}>
      <img src={IMG.heroD} alt="VitaZorg team" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(250,250,248,0.95) 0%, rgba(250,250,248,0.7) 55%, rgba(250,250,248,0.1) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--bg) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'linear-gradient(90deg, var(--green), var(--gold), transparent 70%)' }} />
      <div className="wrap" style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingBottom: 52 }}>
        <FU>
          <div className="eyebrow">Over ons</div>
          <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 16 }} />
          <h1 style={{ color: 'var(--dark)', marginBottom: 10 }}>Wij zijn VitaZorg</h1>
          <p style={{ fontSize: 17, color: 'var(--text)', fontWeight: 300, maxWidth: 500, lineHeight: 1.75 }}>Vakkundige zorg met hart voor de mens. Dat is onze belofte.</p>
        </FU>
      </div>
    </div>

    {/* Stats */}
    <section style={{ background: 'var(--white)', borderBottom: '1px solid var(--border)', padding: '44px 0' }}>
      <div className="wrap">
        <div className="stg" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
          {[{ n: 500, s: '+', l: 'Tevreden cliënten' }, { n: 12, s: '+', l: 'Jaar ervaring' }, { n: 60, s: '+', l: 'Zorgverleners' }, { n: 98, s: '%', l: 'Tevredenheid' }].map((s, i) => (
            <FU key={i} delay={i * 0.08}>
              <div style={{ textAlign: 'center', padding: '0 14px', borderRight: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 600, color: 'var(--green)', lineHeight: 1, marginBottom: 6 }}><CU end={s.n} suffix={s.s} /></div>
                <div style={{ fontSize: 12, color: 'var(--text2)', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500 }}>{s.l}</div>
              </div>
            </FU>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:600px){.stg{grid-template-columns:repeat(2,1fr)!important;gap:2px!important}.stg>div{padding:18px 8px!important;border-right:none!important;border-bottom:1px solid var(--border)}}`}</style>
    </section>

    {/* Story */}
    <section style={{ padding: '96px 0', background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="aog2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start', marginBottom: 80 }}>
          <FL>
            <div style={{ position: 'relative' }}>
              <div style={{ borderRadius: 24, overflow: 'hidden', aspectRatio: '4/5', boxShadow: 'var(--shadow2)' }}>
                <img src={IMG.heroM} alt="VitaZorg team" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%', display: 'block' }} />
              </div>
              <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
                style={{ position: 'absolute', bottom: 28, left: -20, zIndex: 3, background: 'var(--white)', borderRadius: 18, padding: '16px 22px', boxShadow: '0 12px 40px rgba(30,107,74,0.2)', border: '1px solid var(--border)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, fontWeight: 600, color: 'var(--green)', lineHeight: 1 }}>2012</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 3, fontWeight: 500 }}>Opgericht</div>
              </motion.div>
              <div style={{ position: 'absolute', top: -16, left: -16, width: 80, height: 80, backgroundImage: 'radial-gradient(var(--green4) 1.5px, transparent 1.5px)', backgroundSize: '10px 10px', borderRadius: 8 }} />
            </div>
          </FL>
          <FR>
            <div>
              <div className="eyebrow">Ons verhaal</div>
              <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 24 }} />
              <h2 style={{ color: 'var(--dark)', marginBottom: 22 }}>Zorg vanuit <span style={{ color: 'var(--green)', fontStyle: 'italic' }}>overtuiging</span></h2>
              {[
                'VitaZorg werd in 2012 opgericht door een groep verpleegkundigen die geloofden dat zorg anders kon: warmer, persoonlijker en altijd gericht op de mens achter de zorgvraag.',
                'In meer dan tien jaar hebben wij meer dan 500 cliënten mogen ondersteunen. Ons team bestaat uit meer dan 60 gecertificeerde zorgverleners die elke dag met passie en toewijding werken.',
                'Wij werken nauw samen met huisartsen, specialisten en ziekenhuizen om de beste integrale zorg te leveren. Want goede zorg stopt niet bij de voordeur.',
              ].map((t, i) => <p key={i} style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.9, marginBottom: 14, fontWeight: 300 }}>{t}</p>)}
            </div>
          </FR>
        </div>

        {/* Values */}
        <FU style={{ marginBottom: 40 }}>
          <div className="eyebrow">Onze waarden</div>
          <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 16 }} />
          <h2 style={{ color: 'var(--dark)' }}>Waar wij voor staan</h2>
        </FU>
        <div className="vals" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 80 }}>
          {[
            { icon: <Heart size={22} color="var(--green)" />, t: 'Menselijkheid', s: 'Elke cliënt is uniek. Wij luisteren, begrijpen en handelen vanuit echte betrokkenheid.' },
            { icon: <Award size={22} color="var(--green)" />, t: 'Professionaliteit', s: 'Gecertificeerde zorg, continue scholing en bewezen kwaliteitsstandaarden.' },
            { icon: <Shield size={22} color="var(--green)" />, t: 'Betrouwbaarheid', s: 'Afspraken nakomen, op tijd komen en altijd eerlijk communiceren.' },
            { icon: <Leaf size={22} color="var(--green)" />, t: 'Respect', s: 'Respect voor de autonomie, cultuur en levensbeschouwing van iedere cliënt.' },
            { icon: <Users size={22} color="var(--green)" />, t: 'Samenwerking', s: 'Met de cliënt, de familie en andere zorgprofessionals werken wij als één team.' },
            { icon: <Activity size={22} color="var(--green)" />, t: 'Kwaliteit', s: 'Continue verbetering van onze zorg, mede op basis van feedback van cliënten.' },
          ].map((v, i) => (
            <FU key={i} delay={i * 0.07}>
              <motion.div whileHover={{ y: -4, boxShadow: 'var(--shadow2)' }}
                style={{ background: 'var(--white)', padding: '28px 22px', borderRadius: 20, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border)', boxShadow: 'var(--shadow)', transition: 'all 0.25s' }}>
                <div style={{ width: 50, height: 50, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{v.icon}</div>
                <h3 style={{ color: 'var(--dark)', fontSize: 18 }}>{v.t}</h3>
                <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, fontWeight: 300 }}>{v.s}</p>
              </motion.div>
            </FU>
          ))}
        </div>

        {/* Certs */}
        <FU style={{ marginBottom: 40 }}>
          <div className="eyebrow">Kwaliteit & certificering</div>
          <div style={{ width: 48, height: 2, background: 'var(--gold)', marginBottom: 16 }} />
          <h2 style={{ color: 'var(--dark)' }}>Erkend door de sector</h2>
        </FU>
        <div className="certg" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { badge: 'AGB', full: 'AGB-gecertificeerd', desc: 'Erkend zorgaanbieder' },
            { badge: 'BIG', full: 'BIG-register', desc: 'Alle medewerkers geregistreerd' },
            { badge: 'ISO', full: 'ISO 9001:2015', desc: 'Kwaliteitsmanagementsysteem' },
            { badge: 'WTZi', full: 'WTZi erkend', desc: 'Wet toelating zorginstellingen' },
          ].map((c, i) => (
            <FU key={i} delay={i * 0.08}>
              <div style={{ background: 'var(--white)', padding: '28px 20px', borderRadius: 20, textAlign: 'center', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                <div style={{ width: 56, height: 56, background: 'var(--green)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.06em' }}>{c.badge}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)', marginBottom: 6 }}>{c.full}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 300 }}>{c.desc}</div>
              </div>
            </FU>
          ))}
        </div>
      </div>
      <style>{`@media(max-width:768px){.aog2{grid-template-columns:1fr!important;gap:44px!important}.vals{grid-template-columns:1fr 1fr!important}.certg{grid-template-columns:repeat(2,1fr)!important}}@media(max-width:480px){.vals{grid-template-columns:1fr!important}}`}</style>
    </section>

    <section style={{ padding: '72px 0', background: 'linear-gradient(135deg, var(--green) 0%, #2d8a5e 100%)' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <FU>
          <h2 style={{ color: '#fff', marginBottom: 14 }}>Samen voor goede zorg</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', maxWidth: 440, margin: '0 auto 32px', fontWeight: 300 }}>
            Maak kennis met ons team en ontdek wat VitaZorg voor u of uw naaste kan betekenen.
          </p>
          <Link to="/contact">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--white)', color: 'var(--green)', padding: '14px 32px', borderRadius: 100, fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
              <Calendar size={16} /> Kennismaking inplannen
            </motion.div>
          </Link>
        </FU>
      </div>
    </section>
  </>
)

// ─────────────────────────────────────────────
// PAGE: CONTACT
// ─────────────────────────────────────────────
const PageContact = () => {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ naam: '', email: '', telefoon: '', dienst: '', bericht: '' })
  const submit = (e: React.FormEvent) => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setSent(true) }, 1600) }
  const inp: React.CSSProperties = { padding: '13px 16px', borderRadius: 12, fontSize: 14, border: '1.5px solid var(--border)', outline: 'none', background: 'var(--white)', color: 'var(--dark)', fontFamily: 'DM Sans, sans-serif', width: '100%', transition: 'border-color 0.2s' }
  return (
    <>
      <PageHdr eyebrow="Contact" title="Hoe kunnen wij u helpen?" sub="Neem contact op voor een vrijblijvend kennismakingsgesprek. Wij bellen u terug binnen 24 uur." />
      <section style={{ padding: '80px 0', background: 'var(--bg)' }}>
        <div className="wrap">
          <div className="ctg2" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 56, alignItems: 'start' }}>
            <FL>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { icon: <Phone size={20} color="var(--green)" />, label: 'Telefoon', val: '06-12345678', sub: '7 dagen bereikbaar', href: 'tel:0612345678' },
                  { icon: <Mail size={20} color="var(--green)" />, label: 'E-mail', val: 'info@vitazorg.nl', sub: 'Reactie binnen 24 uur', href: 'mailto:info@vitazorg.nl' },
                  { icon: <MapPin size={20} color="var(--green)" />, label: 'Regio', val: 'Heel Nederland', sub: 'Zorg aan huis', href: undefined },
                  { icon: <MessageCircle size={20} color="var(--green)" />, label: 'WhatsApp', val: 'Stuur een bericht', sub: 'Snel en makkelijk', href: 'https://wa.me/31612345678' },
                ].map((c, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    {c.href ? (
                      <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noopener"
                        style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '18px 18px', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={e => { (e.currentTarget as any).style.borderColor = 'var(--green4)'; (e.currentTarget as any).style.boxShadow = 'var(--shadow2)' }}
                        onMouseLeave={e => { (e.currentTarget as any).style.borderColor = 'var(--border)'; (e.currentTarget as any).style.boxShadow = 'none' }}>
                        <div style={{ width: 46, height: 46, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                          <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 600, marginBottom: 2 }}>{c.val}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 300 }}>{c.sub}</div>
                        </div>
                      </a>
                    ) : (
                      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '18px 18px' }}>
                        <div style={{ width: 46, height: 46, background: 'var(--green3)', border: '1px solid var(--green4)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{c.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{c.label}</div>
                          <div style={{ fontSize: 14, color: 'var(--dark)', fontWeight: 600, marginBottom: 2 }}>{c.val}</div>
                          <div style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 300 }}>{c.sub}</div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Availability */}
                <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 18, padding: '20px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <div style={{ width: 8, height: 8, background: '#22c55e', borderRadius: '50%', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--green)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>7 dagen bereikbaar</span>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'].map(d => (
                      <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <div style={{ fontSize: 10, color: 'var(--text2)', fontWeight: 600 }}>{d}</div>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--green3)', border: '1px solid var(--green4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: 'var(--green)' }}>✓</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FL>

            <FR>
              <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', borderRadius: 24, padding: '40px 36px', boxShadow: 'var(--shadow2)', borderTop: '4px solid var(--green)' }}>
                <AnimatePresence mode="wait">
                  {!sent ? (
                    <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                      <div>
                        <h3 style={{ color: 'var(--dark)', fontSize: 26, marginBottom: 6 }}>Neem contact op</h3>
                        <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.65 }}>Vrijblijvend. Wij reageren binnen 24 uur.</p>
                      </div>
                      <div className="frr" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Naam</label>
                          <input type="text" placeholder="Uw naam" value={form.naam} onChange={e => setForm(f => ({ ...f, naam: e.target.value }))} required style={inp}
                            onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Telefoon</label>
                          <input type="tel" placeholder="06-12345678" value={form.telefoon} onChange={e => setForm(f => ({ ...f, telefoon: e.target.value }))} style={inp}
                            onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>E-mail</label>
                        <input type="email" placeholder="uw@emailadres.nl" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required style={inp}
                          onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Zorgvraag</label>
                        <select value={form.dienst} onChange={e => setForm(f => ({ ...f, dienst: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}
                          onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = 'var(--border)'}>
                          <option value="">Selecteer een zorgdienst...</option>
                          {SERVICES.map(s => <option key={s.slug} value={s.slug}>{s.title}</option>)}
                          <option value="overig">Anders / Overig</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Uw bericht</label>
                        <textarea rows={4} placeholder="Omschrijf uw zorgsituatie..." value={form.bericht} onChange={e => setForm(f => ({ ...f, bericht: e.target.value }))} required
                          style={{ ...inp, resize: 'vertical' } as any}
                          onFocus={e => e.target.style.borderColor = 'var(--green)'} onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                      </div>
                      <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(30,107,74,0.3)' }} whileTap={{ scale: 0.97 }}
                        style={{ background: 'var(--green)', color: '#fff', padding: '16px 28px', borderRadius: 100, fontSize: 15, fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.8 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, fontFamily: 'DM Sans, sans-serif' }}>
                        {loading ? (
                          <><motion.div animate={{ rotate: 360 }} transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                            style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }} />Versturen...</>
                        ) : <><Calendar size={16} /> Kennismaking aanvragen</>}
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div key="ok" initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '56px 20px' }}>
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 220, delay: 0.1 }}
                        style={{ width: 68, height: 68, background: 'var(--green3)', border: '1.5px solid var(--green4)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}>
                        <CheckCircle2 size={32} color="var(--green)" />
                      </motion.div>
                      <h3 style={{ color: 'var(--dark)', marginBottom: 10, fontSize: 26 }}>Aanvraag ontvangen</h3>
                      <p style={{ color: 'var(--text2)', fontSize: 15, lineHeight: 1.75 }}>Wij nemen binnen 24 uur contact met u op om een kennismakingsgesprek in te plannen.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FR>
          </div>
        </div>
        <style>{`@media(max-width:768px){.ctg2{grid-template-columns:1fr!important}.frr{grid-template-columns:1fr!important}}`}</style>
      </section>
    </>
  )
}

// ─────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────
function DienstRouter() {
  const { pathname } = useLocation()
  const slug = pathname.split('/').pop() || ''
  return <PageDienstDetail slug={slug} />
}

function Page404() {
  return (
    <div style={{ paddingTop: 140, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 11, color: 'var(--green)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>404</div>
      <h2 style={{ color: 'var(--dark)' }}>Pagina niet gevonden</h2>
      <p style={{ color: 'var(--text2)', maxWidth: 360, lineHeight: 1.7 }}>De pagina die u zoekt bestaat niet of is verplaatst.</p>
      <Link to="/">
        <motion.div whileHover={{ scale: 1.04 }} style={{ background: 'var(--green)', color: '#fff', padding: '13px 28px', borderRadius: 100, fontWeight: 600, cursor: 'pointer' }}>
          Terug naar home
        </motion.div>
      </Link>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollTop />
      <Nav />
      <main style={{ minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<PageHome />} />
          <Route path="/diensten" element={<PageDiensten />} />
          <Route path="/diensten/:slug" element={<DienstRouter />} />
          <Route path="/over-ons" element={<PageOverOns />} />
          <Route path="/contact" element={<PageContact />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
      <Footer />
      <WA />
    </>
  )
}
