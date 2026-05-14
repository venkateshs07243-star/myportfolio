import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaBars, FaTimes, FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

// ─── Skill Data with SVG Icon URLs (devicons CDN) ────────────────────────────
const skills = [
  { name: "HTML",         icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  { name: "CSS",          icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  { name: "JavaScript",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  { name: "React",        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "React Native", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  { name: "Node.js",      icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  { name: "Firebase",     icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg" },
  { name: "PostgreSQL",   icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
];

// ─── Project Data ─────────────────────────────────────────────────────────────
const projects = [
  {
    title: "Water Level Mobile Monitoring App",
    description:
      "A real-time water level monitoring mobile application that tracks tank levels using IoT sensor data and sends Firebase push notifications when levels are critical.",
    image: "/img.png",
    tags: ["React Native", "Firebase", "IoT", "Node.js"],
    github: "https://github.com/venkateshs07243-star",
  },
  {
    title: "Cloud Storage App",
    description:
      "A full-stack cloud storage application with secure file upload, download, and delete features using Node.js, Express.js, React Native, and Cloudinary.",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&q=80",
    tags: ["React Native", "Node.js", "Express.js", "Cloudinary"],
    github: "https://github.com/venkateshs07243-star",
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function App() {
  const [darkMode, setDarkMode]   = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" });
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState("");
  const formRef = useRef(null);

  // ── Contact form handler using EmailJS ──────────────────────────────────────
  // SETUP INSTRUCTIONS:
  //   1. Go to https://www.emailjs.com and create a free account
  //   2. Add an Email Service (Gmail recommended) → copy your SERVICE_ID
  //   3. Create an Email Template and confirm the variable names below
  //   4. Copy your TEMPLATE_ID from the template dashboard
  //   5. Go to Account → API Keys → copy your PUBLIC_KEY
  //   6. Store those values in .env at the project root
  // ────────────────────────────────────────────────────────────────────────────
  const SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.");
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      setError("EmailJS is not configured yet. Restart Vite after adding VITE_EMAILJS_* values to .env.");
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:  formData.name,
          from_email: formData.email,
          message:    formData.message,
          to_email:   "venkateshs07243@gmail.com",
        },
        PUBLIC_KEY
      );
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS send error:", err);
      const detail = err?.text || err?.message || "Please check your EmailJS IDs and template variables.";
      setError(`Email failed: ${detail}`);
    } finally {
      setSending(false);
    }
  };

  const bg   = darkMode ? "bg-[#070b14]  text-white"       : "bg-[#f0f4ff] text-[#0a0f1e]";
  const card = darkMode ? "bg-[#0e1628]  border-[#1e2d50]" : "bg-white      border-gray-200";
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`scroll-smooth min-h-screen font-sans ${bg}`}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full bg-[#040810]/90 backdrop-blur-md border-b border-cyan-900/30 px-6 py-4 flex justify-between items-center z-50">
        <div>
          <h1 className="text-xl font-extrabold text-cyan-400 tracking-wide">Venkatesa Perumal S</h1>
          <p className="text-xs text-slate-400">B.E Mechanical Engineering</p>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        {/* Links */}
        <ul className={`absolute md:static top-[72px] left-0 w-full md:w-auto bg-[#040810] md:bg-transparent
          px-6 md:px-0 py-4 md:py-0 md:flex gap-7 text-sm font-medium
          ${menuOpen ? "block" : "hidden"} md:flex`}
        >
          {["home","about","skills","projects","contact"].map(s => (
            <li key={s}>
              <a href={`#${s}`}
                className="capitalize hover:text-cyan-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >{s}</a>
            </li>
          ))}
        </ul>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="hidden md:block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400
                     px-4 py-1.5 rounded-lg text-sm hover:bg-cyan-500/20 transition ml-4"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section id="home" className="relative flex flex-col justify-center items-center h-screen text-center px-5 pt-20 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]
                        bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.p
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-cyan-400 text-sm font-semibold tracking-[0.3em] uppercase mb-4"
        >
          Welcome to my portfolio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-5 leading-tight"
        >
          Venkatesa Perumal S
          
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-slate-300 mb-6 h-10"
        >
          <Typewriter
            words={["Full Stack Developer", "React Native Developer", "Firebase Expert"]}
            loop={0} cursor cursorStyle="|" typeSpeed={70} deleteSpeed={50} delaySpeed={1200}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className={`text-lg max-w-xl mb-10 leading-relaxed ${muted}`}
        >
          I build polished mobile apps and web applications using React Native, Firebase, and Node.js.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
          className="flex gap-4 flex-wrap justify-center"
        >
          <a href="/resume.pdf" download
            className="bg-cyan-400 text-black px-7 py-3 rounded-xl font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20"
          >
            Download Resume
          </a>
          <a href="#contact"
            className="border border-cyan-400/50 text-cyan-400 px-7 py-3 rounded-xl font-bold hover:bg-cyan-400/10 transition"
          >
            Hire Me
          </a>
        </motion.div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────── */}
          <section id="about" className={`min-h-screen p-10 md:p-20 flex flex-col justify-center ${darkMode ? "bg-[#060a12]" : "bg-slate-50"}`}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">Who I am</span>
          <h2 className="text-4xl font-black mt-2 mb-6">About Me</h2>
          <p className={`text-lg leading-9 max-w-3xl ${muted}`}>
            I am a motivated <strong className="text-cyan-400">Full Stack Developer</strong> with hands-on skills in
            JavaScript, React.js, React Native, Node.js, SQL, and Firebase. I am passionate about developing
            mobile and web applications with clean UI and efficient backend integration.
          </p>
          <p className={`text-lg leading-9 max-w-3xl mt-4 ${muted}`}>
            I have built real-time projects like a <strong className="text-white/80">Water Level Monitoring</strong> system
            and a <strong className="text-white/80">Cloud Storage</strong> application. Quick learner with strong
            problem-solving skills and a deep interest in modern software development technologies.
          </p>
        </motion.div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────────────────── */}
      <section id="skills" className="min-h-screen p-10 md:p-20 flex flex-col justify-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">What I know</span>
          <h2 className="text-4xl font-black mt-2 mb-10">Skills</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.04 }}
              className={`${card} border rounded-2xl p-6 flex flex-col items-center gap-4
                          cursor-default group transition-all duration-300
                          hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-500/10`}
            >
              <div className="w-14 h-14 flex items-center justify-center">
                <img
                  src={skill.icon}
                  alt={skill.name}
                  className="w-12 h-12 object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
              <span className="text-sm font-semibold text-center group-hover:text-cyan-400 transition-colors">
                {skill.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Projects ───────────────────────────────────────────────────────── */}
      <section id="projects" className={`min-h-screen p-10 md:p-20 flex flex-col justify-center ${darkMode ? "bg-[#060a12]" : "bg-slate-50"}`}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">What I built</span>
          <h2 className="text-4xl font-black mt-2 mb-10">Projects</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className={`${card} border rounded-2xl overflow-hidden group
                          hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300`}
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {/* Tags overlay */}
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                <p className={`text-sm leading-7 ${muted}`}>{p.description}</p>
                <div className="mt-5 flex gap-4">
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <FaGithub size={16} /> View Code
                  </a>
                  <a href={p.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
                  >
                    <FaExternalLinkAlt size={13} /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" className="min-h-screen p-10 md:p-20 flex flex-col justify-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">Get in touch</span>
          <h2 className="text-4xl font-black mt-2 mb-4">Contact</h2>
          <p className={`mb-10 ${muted}`}>
            Fill in the form below — your message lands directly in my inbox.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">

          {/* Contact Info */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-6">
            <div className={`${card} border rounded-2xl p-6 flex items-start gap-4`}>
              <FaEnvelope size={20} className="text-cyan-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Email</p>
                <a href="mailto:venkateshs07243@gmail.com" className="text-cyan-400 text-sm hover:underline">
                  venkateshs07243@gmail.com
                </a>
              </div>
            </div>
            <div className={`${card} border rounded-2xl p-6 flex items-start gap-4`}>
              <FaGithub size={20} className="text-cyan-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold">GitHub</p>
                <a href="https://github.com/venkateshs07243-star" target="_blank" rel="noopener noreferrer"
                  className="text-cyan-400 text-sm hover:underline break-all"
                >
                  github.com/venkateshs07243-star
                </a>
              </div>
            </div>
            <div className={`${card} border rounded-2xl p-6 flex items-start gap-4`}>
              <FaLinkedin size={20} className="text-cyan-400 mt-1 shrink-0" />
              <div>
                <p className="text-sm font-semibold">LinkedIn</p>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                  className="text-cyan-400 text-sm hover:underline"
                >
                  www.linkedin.com/in/venkatesa-perumal-s-4980b9299
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
            {sent ? (
              <div className={`${card} border border-cyan-500/50 rounded-2xl p-10 text-center`}>
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-cyan-400 mb-2">Message Sent!</h3>
                <p className={`text-sm ${muted}`}>Thanks for reaching out. I'll get back to you soon.</p>
                <button onClick={() => setSent(false)} className="mt-6 text-sm text-cyan-400 hover:underline">
                  Send another message
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className={`${card} border rounded-2xl p-8 space-y-5`}>

                <div>
                  <label className="block text-sm font-semibold mb-2">Your Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition
                      ${darkMode
                        ? "bg-[#0a1220] border border-[#1e2d50] text-white placeholder-slate-500 focus:border-cyan-500"
                        : "bg-slate-100 border border-slate-200 text-black placeholder-slate-400 focus:border-cyan-500"
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Your Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition
                      ${darkMode
                        ? "bg-[#0a1220] border border-[#1e2d50] text-white placeholder-slate-500 focus:border-cyan-500"
                        : "bg-slate-100 border border-slate-200 text-black placeholder-slate-400 focus:border-cyan-500"
                      }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Hi Venkatesa, I'd like to discuss an opportunity..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition resize-none
                      ${darkMode
                        ? "bg-[#0a1220] border border-[#1e2d50] text-white placeholder-slate-500 focus:border-cyan-500"
                        : "bg-slate-100 border border-slate-200 text-black placeholder-slate-400 focus:border-cyan-500"
                      }`}
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl
                             hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : "Send Message →"}
                </button>

                <p className={`text-xs text-center ${muted}`}>
                  Your message goes directly to my email inbox.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className={`bg-[#040810] border-t border-cyan-900/30 text-center py-6 text-sm ${muted}`}>
        © 2026 Venkatesa Perumal S — Built with React & ❤️
      </footer>

    </div>
  );
}