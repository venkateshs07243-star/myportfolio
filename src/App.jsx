import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { FaBars, FaTimes, FaGithub, FaLinkedin, FaEnvelope, FaExternalLinkAlt, FaArrowRight, FaArrowDown, FaBriefcase, FaUpload } from "react-icons/fa";
import emailjs from "@emailjs/browser";

// ─── Skill Data ───────────────────────────────────────────────────────────────
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
    image: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=600&q=80",
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

// ─── Internship Data ──────────────────────────────────────────────────────────
const internships = [
  {
    role: "Full Stack Developer Intern",
    company: "WIZBEES TECHNOLOGIES",
    duration: "Jan 2026 – Apr 2026",
    description:
      "Built and deployed React Native mobile features, integrated REST APIs, and worked with Firebase for real-time data sync. Collaborated with senior developers in an Agile team.",
    skills: ["React Native", "Firebase", "Node.js", "REST API", "JavaScript", "Git"],
  },
  {
    role: "Web Development Intern",
    company: "WIZBEES TECHNOLOGIES",
    duration: "Jun 2026 – May 2026",
    description:
      "Developed responsive landing pages and dashboards using React.js and Tailwind CSS. Optimised performance and improved Lighthouse scores across client projects.",
    skills: ["React.js", "Tailwind CSS", "JavaScript", "Git"],
  },
];

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 50 },
  visible: (i = 0) => ({
    opacity: 1, x: 0,
    transition: { duration: 0.65, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

// Bouncing arrow animation
const bounceArrow = {
  animate: {
    y: [0, 10, 0],
    transition: { duration: 1.4, repeat: Infinity, ease: "easeInOut" },
  },
};

// Sliding arrow on hover
const arrowSlide = {
  rest: { x: 0 },
  hover: { x: 6, transition: { duration: 0.25, ease: "easeOut" } },
};

// ─── Animated Arrow Button ────────────────────────────────────────────────────
function ArrowBtn({ href, children, className = "", download = false, onClick }) {
  return (
    <motion.a
      href={href}
      download={download}
      onClick={onClick}
      initial="rest"
      whileHover="hover"
      className={`group inline-flex items-center gap-2 ${className}`}
    >
      {children}
      <motion.span variants={arrowSlide}>
        <FaArrowRight size={13} />
      </motion.span>
    </motion.a>
  );
}

export default function App() {
  const [darkMode, setDarkMode]   = useState(true);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" });
  const [sending, setSending]     = useState(false);
  const [sent, setSent]           = useState(false);
  const [error, setError]         = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoURL, setPhotoURL]   = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const formRef   = useRef(null);
  const photoRef  = useRef(null);
  const resumeRef = useRef(null);

  // ── EmailJS ──────────────────────────────────────────────────────────────────
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
      setError("EmailJS is not configured yet. Add VITE_EMAILJS_* values to .env.");
      return;
    }
    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  formData.name,
        from_email: formData.email,
        message:    formData.message,
        to_email:   "venkateshs07243@gmail.com",
      }, PUBLIC_KEY);
      setSent(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("EmailJS send error:", err);
      setError(`Email failed: ${err?.text || err?.message || "Check your EmailJS config."}`);
    } finally {
      setSending(false);
    }
  };

  // ── Photo upload ─────────────────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoURL(URL.createObjectURL(file));
  };

  // ── Resume upload ────────────────────────────────────────────────────────────
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setResumeFile(file);
  };

  const resumeHref = resumeFile ? URL.createObjectURL(resumeFile) : "/resume.pdf";

  const bg    = darkMode ? "bg-[#070b14] text-white"       : "bg-[#f0f4ff] text-[#0a0f1e]";
  const card  = darkMode ? "bg-[#0e1628] border-[#1e2d50]" : "bg-white border-gray-200";
  const muted = darkMode ? "text-slate-400"                 : "text-slate-500";

  return (
    <div className={`scroll-smooth min-h-screen font-sans ${bg}`}>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 w-full bg-[#040810]/90 backdrop-blur-md border-b border-cyan-900/30 px-6 py-4 flex justify-between items-center z-50">
        <div>
          <h1 className="text-xl font-extrabold text-cyan-400 tracking-wide">Venkatesa Perumal S</h1>
          <p className="text-xs text-slate-400">B.E Mechanical Engineering</p>
        </div>

        <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>

        <ul className={`absolute md:static top-[72px] left-0 w-full md:w-auto bg-[#040810] md:bg-transparent
          px-6 md:px-0 py-4 md:py-0 md:flex gap-7 text-sm font-medium
          ${menuOpen ? "block" : "hidden"} md:flex`}
        >
          {["home","about","skills","experience","projects","contact"].map(s => (
            <li key={s}>
              <a href={`#${s}`}
                className="capitalize hover:text-cyan-400 transition-colors"
                onClick={() => setMenuOpen(false)}
              >{s}</a>
            </li>
          ))}
        </ul>

        {/* Resume PDF upload button in nav */}
        <div className="hidden md:flex items-center gap-3 ml-4">
          <label className="cursor-pointer flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30
                            text-cyan-400 px-3 py-1.5 rounded-lg text-xs hover:bg-cyan-500/20 transition"
                 title={resumeFile ? resumeFile.name : "Upload your resume PDF"}>
            <FaUpload size={11} />
            {resumeFile ? "Resume ✓" : "Upload CV"}
            <input type="file" accept=".pdf" className="hidden" ref={resumeRef} onChange={handleResumeChange} />
          </label>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400
                       px-4 py-1.5 rounded-lg text-sm hover:bg-cyan-500/20 transition"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section id="home" className="relative flex flex-col justify-center items-center h-screen text-center px-5 pt-20 overflow-hidden">
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]
                        bg-cyan-500/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[300px] h-[300px]
                        bg-blue-600/8 rounded-full blur-[100px] pointer-events-none" />

        <motion.p
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="text-cyan-400 text-sm font-semibold tracking-[0.35em] uppercase mb-4 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-cyan-400/60" />
          Welcome to my portfolio
          <span className="w-8 h-px bg-cyan-400/60" />
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-5 leading-tight tracking-tight"
        >
          Venkatesa Perumal S
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-slate-300 mb-6 h-10"
        >
          <Typewriter
            words={["Full Stack Developer", "React Native Developer", "MERN Stack Developer", "Firebase Developer"]}
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
          <ArrowBtn
            href={resumeHref}
            download={resumeFile ? resumeFile.name : "resume.pdf"}
            className="bg-cyan-400 text-black px-7 py-3 rounded-xl font-bold hover:bg-cyan-300 transition shadow-lg shadow-cyan-500/20"
          >
            Download Resume
          </ArrowBtn>
          <ArrowBtn
            href="#contact"
            className="border border-cyan-400/50 text-cyan-400 px-7 py-3 rounded-xl font-bold hover:bg-cyan-400/10 transition"
          >
            Hire Me
          </ArrowBtn>
        </motion.div>

        {/* Bouncing scroll arrow */}
        <motion.div
          variants={bounceArrow}
          animate="animate"
          className="absolute bottom-10 flex flex-col items-center gap-1 text-cyan-400/50"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <FaArrowDown size={14} />
        </motion.div>
      </section>

      {/* ── About ──────────────────────────────────────────────────────────── */}
      <section id="about" className={`min-h-screen px-10 md:px-20 py-24 flex flex-col justify-center ${darkMode ? "bg-[#060a12]" : "bg-slate-50"}`}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-6 h-px bg-cyan-400" /> Who I am
          </span>
          <h2 className="text-4xl font-black mt-2">About Me</h2>
        </motion.div>

        {/* Two-column: photo left, text right */}
        <div className="flex flex-col md:flex-row gap-14 items-start">

          {/* Photo column */}
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-shrink-0 flex flex-col items-center gap-4"
          >
            {/* Photo frame */}
            <div className="relative w-56 h-56 md:w-64 md:h-64">
              {/* Decorative corner brackets */}
              <span className="absolute -top-2 -left-2 w-7 h-7 border-t-2 border-l-2 border-cyan-400 rounded-tl-md" />
              <span className="absolute -top-2 -right-2 w-7 h-7 border-t-2 border-r-2 border-cyan-400 rounded-tr-md" />
              <span className="absolute -bottom-2 -left-2 w-7 h-7 border-b-2 border-l-2 border-cyan-400 rounded-bl-md" />
              <span className="absolute -bottom-2 -right-2 w-7 h-7 border-b-2 border-r-2 border-cyan-400 rounded-br-md" />

              {photoURL ? (
                <img
                  src={photoURL}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                <div className={`w-full h-full rounded-2xl flex flex-col items-center justify-center gap-3
                                 ${darkMode ? "bg-[#0e1628] border border-[#1e2d50]" : "bg-white border border-slate-200"}`}>
                  <div className="w-20 h-20 rounded-full bg-cyan-500/15 border-2 border-dashed border-cyan-500/40
                                  flex items-center justify-center text-cyan-400/60 text-3xl font-black">
                    VP
                  </div>
                  <p className="text-xs text-slate-500 text-center px-4">Upload your photo below</p>
                </div>
              )}
            </div>

            {/* Upload photo button */}
            <label className="cursor-pointer flex items-center gap-2 text-xs font-semibold text-cyan-400
                               border border-cyan-500/30 bg-cyan-500/8 px-4 py-2 rounded-xl
                               hover:bg-cyan-500/15 transition">
              <FaUpload size={11} />
              {photoFile ? "Change Photo" : "Upload Photo"}
              <input type="file" accept="image/*" className="hidden" ref={photoRef} onChange={handlePhotoChange} />
            </label>
          </motion.div>

          {/* Text column */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex-1 space-y-5"
          >
            <p className={`text-lg leading-9 ${muted}`}>
              I am a motivated <strong className="text-cyan-400">Full Stack Developer</strong> with hands-on skills in
              JavaScript, React.js, React Native, Node.js, SQL, and Firebase. I am passionate about developing
              mobile and web applications with clean UI and efficient backend integration.
            </p>
            <p className={`text-lg leading-9 ${muted}`}>
              I have built real-time projects like a <strong className="text-white/80">Water Level Monitoring</strong> system
              and a <strong className="text-white/80">Cloud Storage</strong> application. Quick learner with strong
              problem-solving skills and a deep interest in modern software development technologies.
            </p>

            {/* Quick stats row */}
            <div className="flex flex-wrap gap-5 pt-2">
              {[
                { label: "Projects", value: "2+" },
                { label: "Internships", value: "2" },
                { label: "Tech Stack", value: "8+" },
              ].map(({ label, value }) => (
                <div key={label} className={`${card} border rounded-xl px-6 py-4 text-center min-w-[90px]`}>
                  <p className="text-2xl font-black text-cyan-400">{value}</p>
                  <p className={`text-xs mt-1 font-semibold ${muted}`}>{label}</p>
                </div>
              ))}
            </div>

            <ArrowBtn
              href="#experience"
              className="inline-flex mt-4 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
            >
              View Experience
            </ArrowBtn>
          </motion.div>
        </div>
      </section>

      {/* ── Skills ─────────────────────────────────────────────────────────── */}
      <section id="skills" className="min-h-screen p-10 md:p-20 flex flex-col justify-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-6 h-px bg-cyan-400" /> What I know
          </span>
          <h2 className="text-4xl font-black mt-2">Skills</h2>
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
              whileHover={{ y: -8, scale: 1.04 }}
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

      {/* ── Experience / Internships ────────────────────────────────────────── */}
      <section id="experience" className={`min-h-screen px-10 md:px-20 py-24 flex flex-col justify-center ${darkMode ? "bg-[#060a12]" : "bg-slate-50"}`}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-12">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-6 h-px bg-cyan-400" /> Where I've worked
          </span>
          <h2 className="text-4xl font-black mt-2">Internship Experience</h2>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative max-w-3xl">
          {/* Timeline spine */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/60 via-cyan-500/20 to-transparent" />

          {internships.map((intern, i) => (
            <motion.div
              key={intern.company}
              custom={i}
              variants={fadeLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative pl-16 mb-10 last:mb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-[14px] top-1 w-[22px] h-[22px] rounded-full border-2 border-cyan-400
                              bg-[#060a12] flex items-center justify-center">
                <FaBriefcase size={9} className="text-cyan-400" />
              </div>

              <div className={`${card} border rounded-2xl p-7
                               hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/8
                               transition-all duration-300 group`}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-lg font-black group-hover:text-cyan-400 transition-colors">
                      {intern.role}
                    </h3>
                    <p className="text-cyan-400/80 text-sm font-semibold mt-0.5">{intern.company}</p>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border
                                    ${darkMode ? "border-cyan-500/25 bg-cyan-500/8 text-cyan-300" : "border-cyan-200 bg-cyan-50 text-cyan-700"}`}>
                    {intern.duration}
                  </span>
                </div>

                <p className={`text-sm leading-7 ${muted} mb-4`}>{intern.description}</p>

                <div className="flex flex-wrap gap-2">
                  {intern.skills.map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="mt-10"
        >
          <ArrowBtn
            href="#projects"
            className="text-sm font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            See my projects
          </ArrowBtn>
        </motion.div>
      </section>

      {/* ── Projects ───────────────────────────────────────────────────────── */}
      <section id="projects" className="min-h-screen p-10 md:p-20 flex flex-col justify-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-6 h-px bg-cyan-400" /> What I built
          </span>
          <h2 className="text-4xl font-black mt-2">Projects</h2>
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
              whileHover={{ y: -6 }}
              className={`${card} border rounded-2xl overflow-hidden group
                          hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300`}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-400 transition-colors">{p.title}</h3>
                <p className={`text-sm leading-7 ${muted}`}>{p.description}</p>
                <div className="mt-5 flex gap-5">
                  <motion.a
                    href={p.github} target="_blank" rel="noopener noreferrer"
                    initial="rest" whileHover="hover"
                    className="flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 transition"
                  >
                    <FaGithub size={16} />
                    View Code
                    <motion.span variants={arrowSlide}><FaArrowRight size={11} /></motion.span>
                  </motion.a>
                  <motion.a
                    href={p.github} target="_blank" rel="noopener noreferrer"
                    initial="rest" whileHover="hover"
                    className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition"
                  >
                    <FaExternalLinkAlt size={13} />
                    Live Demo
                    <motion.span variants={arrowSlide}><FaArrowRight size={11} /></motion.span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Contact ────────────────────────────────────────────────────────── */}
      <section id="contact" className={`min-h-screen p-10 md:p-20 flex flex-col justify-center ${darkMode ? "bg-[#060a12]" : "bg-slate-50"}`}>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10">
          <span className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase flex items-center gap-3">
            <span className="w-6 h-px bg-cyan-400" /> Get in touch
          </span>
          <h2 className="text-4xl font-black mt-2 mb-2">Contact</h2>
          <p className={`${muted}`}>Fill in the form — your message lands directly in my inbox.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl">

          {/* Contact Info */}
          <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: true }} className="space-y-5">
            {[
              { icon: <FaEnvelope size={18} />, label: "Email", value: "venkateshs07243@gmail.com", href: "mailto:venkateshs07243@gmail.com" },
              { icon: <FaGithub size={18} />, label: "GitHub", value: "github.com/venkateshs07243-star", href: "https://github.com/venkateshs07243-star" },
              { icon: <FaLinkedin size={18} />, label: "LinkedIn", value: "linkedin.com/in/venkatesa-perumal-s-4980b9299", href: "https://www.linkedin.com/in/venkatesa-perumal-s-4980b9299" },
            ].map(({ icon, label, value, href }) => (
              <motion.div
                key={label}
                whileHover={{ x: 4 }}
                className={`${card} border rounded-2xl p-6 flex items-start gap-4 hover:border-cyan-400/40 transition-all duration-300`}
              >
                <span className="text-cyan-400 mt-1 shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <a href={href} target="_blank" rel="noopener noreferrer"
                    className="text-cyan-400 text-sm hover:underline break-all"
                  >
                    {value}
                  </a>
                </div>
              </motion.div>
            ))}

            {/* Resume PDF upload in contact section too */}
            <div className={`${card} border rounded-2xl p-6`}>
              <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                <FaUpload size={14} className="text-cyan-400" /> Upload / Replace Resume PDF
              </p>
              <label className="cursor-pointer flex items-center gap-3 border-2 border-dashed border-cyan-500/30
                                rounded-xl p-4 hover:border-cyan-500/60 hover:bg-cyan-500/5 transition text-sm">
                <FaUpload className="text-cyan-400 shrink-0" />
                <span className={resumeFile ? "text-cyan-400 font-semibold" : muted}>
                  {resumeFile ? `✓ ${resumeFile.name}` : "Click to upload your resume (.pdf)"}
                </span>
                <input type="file" accept=".pdf" className="hidden" onChange={handleResumeChange} />
              </label>
              {resumeFile && (
                <a
                  href={URL.createObjectURL(resumeFile)}
                  download={resumeFile.name}
                  className="mt-3 inline-flex items-center gap-2 text-xs text-cyan-400 hover:underline font-semibold"
                >
                  Download uploaded resume <FaArrowRight size={10} />
                </a>
              )}
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
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
                {[
                  { label: "Your Name",  key: "name",    type: "text",  placeholder: "John Doe" },
                  { label: "Your Email", key: "email",   type: "email", placeholder: "you@example.com" },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-semibold mb-2">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      className={`w-full rounded-xl px-4 py-3 text-sm outline-none transition
                        ${darkMode
                          ? "bg-[#0a1220] border border-[#1e2d50] text-white placeholder-slate-500 focus:border-cyan-500"
                          : "bg-slate-100 border border-slate-200 text-black placeholder-slate-400 focus:border-cyan-500"
                        }`}
                    />
                  </div>
                ))}

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

                <motion.button
                  type="submit"
                  disabled={sending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-cyan-400 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2
                             hover:bg-cyan-300 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sending ? "Sending…" : (
                    <>Send Message <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.2, repeat: Infinity }}><FaArrowRight size={13} /></motion.span></>
                  )}
                </motion.button>

                <p className={`text-xs text-center ${muted}`}>
                  Your message goes directly to my email inbox.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className={`bg-[#040810] border-t border-cyan-900/30 text-center py-8 text-sm ${muted}`}>
        <div className="flex justify-center gap-5 mb-4 text-cyan-400/60">
          <motion.a whileHover={{ y: -3, color: "#22d3ee" }} href="mailto:venkateshs07243@gmail.com"><FaEnvelope size={18} /></motion.a>
          <motion.a whileHover={{ y: -3, color: "#22d3ee" }} href="https://github.com/venkateshs07243-star" target="_blank" rel="noopener noreferrer"><FaGithub size={18} /></motion.a>
          <motion.a whileHover={{ y: -3, color: "#22d3ee" }} href="https://www.linkedin.com/in/venkatesa-perumal-s-4980b9299" target="_blank" rel="noopener noreferrer"><FaLinkedin size={18} /></motion.a>
        </div>
        © 2026 Venkatesa Perumal S — Built with React & ❤️
      </footer>

    </div>
  );
}