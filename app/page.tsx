"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Github, Linkedin, Mail, HardHat } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import components that use window
const ClientSideComponents = dynamic(() => import("./components/ClientSideComponents"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-gradient-to-b from-gray-900 to-gray-800"></div>,
})

export default function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const sectionRefs = useRef({
    home: useRef<HTMLElement>(null),
    about: useRef<HTMLElement>(null),
    work: useRef<HTMLElement>(null),
    education: useRef<HTMLElement>(null),
    projects: useRef<HTMLElement>(null),
    skills: useRef<HTMLElement>(null),
    contact: useRef<HTMLElement>(null),
  })

  // Set isMounted to true after component mounts
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100 // Offset for better accuracy

      for (const [section, ref] of Object.entries(sectionRefs.current)) {
        if (
          ref.current &&
          scrollPosition >= ref.current.offsetTop &&
          scrollPosition < ref.current.offsetTop + ref.current.offsetHeight
        ) {
          setActiveSection(section)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isMounted])

  const scrollToSection = (section: string) => {
    const element = sectionRefs.current[section as keyof typeof sectionRefs.current].current
    if (element) {
      const offset = 80 // Adjust this value based on your header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      })
    }
    setMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white relative">
      {isMounted && <ClientSideComponents />}

      <header className="bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-lg shadow-md fixed top-0 left-0 right-0 z-50">
        <nav className="container mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-blue-400">
              Sammy Dabbas
            </Link>
            <div className="hidden md:flex space-x-4">
              {["home", "about", "work", "education", "projects", "skills", "contact"].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize ${
                    activeSection === section ? "text-blue-400 font-semibold" : "text-gray-300 hover:text-blue-400"
                  }`}
                >
                  {section}
                </button>
              ))}
              <div className="group relative">
                <Link href="/solar-system" className="text-gray-300 hover:text-blue-400">
                  Explore Solar System
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-sm text-gray-300 rounded-lg">
                  Experience an interactive 3D version of my portfolio with an animated solar system theme
                </div>
              </div>
            </div>
            <div className="md:hidden">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-blue-400">
                <svg
                  xmlns="https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 bg-gray-900 bg-opacity-95 backdrop-filter backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {["home", "about", "work", "education", "projects", "skills", "contact"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-700 w-full text-left"
                  >
                    {section}
                  </button>
                ))}
                <Link
                  href="/solar-system"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-blue-400 hover:bg-gray-700"
                >
                  Switch to 3D View
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="relative z-10 pt-16">
        <section ref={sectionRefs.current.home} className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold mb-4"
            >
              Sammy Dabbas
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8"
            >
              Full Stack Developer | AI/ML Enthusiast
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-x-4"
            >
              <button
                onClick={() => scrollToSection("about")}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors"
              >
                Learn More
              </button>
              <a
                href="https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/Sammy-Dabbas-Resume-JXtxeUswCQ6od7gY5EsQ0VEonA7WdN.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors inline-block"
              >
                Download Resume
              </a>
            </motion.div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown size={32} />
          </div>
        </section>

        <section ref={sectionRefs.current.about} className="py-20 bg-gray-800 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <img
                  src="/placeholder.svg?height=400&width=400"
                  alt="Your Name"
                  className="rounded-full w-64 h-64 object-cover mx-auto"
                />
              </div>
              <div className="md:w-1/2">
                <p className="text-lg mb-4">
                  Hello! I'm a passionate full-stack developer and AI/ML enthusiast currently pursuing a Bachelor's
                  degree in Computer Science at UCF with a 3.9 GPA. I specialize in building scalable applications and
                  implementing machine learning solutions.
                </p>
                <p className="text-lg mb-4">
                  My expertise spans across Python, C#, and JavaScript ecosystems, with hands-on experience in ETL
                  pipeline development, real-time data streaming systems, and GPU-accelerated machine learning
                  workloads. I'm particularly skilled in containerization with Docker and orchestration with Kubernetes.
                </p>
                <p className="text-lg">
                  Currently working as a Software Developer Intern at FINDER Software Solutions, where I've
                  significantly improved recognition rates through ML pipeline optimizations. I also bring valuable
                  experience from my time as a Statistical Analyst with NASA's research team, where I conducted
                  statistical analysis on severe weather data.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.work} className="py-20 bg-gray-900 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Work Experience</h2>
            <div className="space-y-12">
              {[
                {
                  title: "Software Developer Intern",
                  company: "FINDER Software Solutions",
                  period: "Sep 2024 - Present",
                  description: `Engineered scalable ETL pipelines using Python and C#, implemented real-time visual data streaming systems, and developed advanced parsers. Increased recognition rates by 350% and delivered 15+ ticket-based enhancements.`,
                },
                {
                  title: "Statistical Analyst",
                  company: "NASA Research Team",
                  period: "Nov 2023 - Feb 2024",
                  description: `Conducted statistical recalculations and error analysis on severe weather data for NASA-led projects. Applied statistical forecasting tools and cross-verified calculations to maintain data integrity.`,
                },
              ].map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-800 bg-opacity-95 rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                  <p className="text-blue-400 mb-2">{job.company}</p>
                  <p className="text-sm text-gray-400 mb-4">{job.period}</p>
                  <p>{job.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.education} className="py-20 bg-gray-800 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Education</h2>
            <div className="space-y-12">
              {[
                {
                  degree: "Bachelor of Science in Computer Science",
                  school: "University of Central Florida",
                  year: "Expected May 2026",
                  description: "Current undergraduate student maintaining a GPA of 3.9",
                },
                {
                  degree: "Associate in Arts degree, General Studies",
                  school: "Valencia College",
                  year: "Expected May 2024",
                  description: "Foundation in general studies and core academic subjects",
                },
              ].map((edu, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-900 bg-opacity-95 rounded-lg shadow-md p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                  <p className="text-blue-400 mb-2">{edu.school}</p>
                  <p className="text-sm text-gray-400 mb-4">{edu.year}</p>
                  <p>{edu.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.projects} className="py-20 bg-gray-900 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Fire & Safety Compliance Platform",
                  description:
                    "A scalable compliance platform automating fire and safety inspections for commercial properties. Features inspection scheduling, digital checklists, document repositories, role-based access control, interactive dashboards, and offline capabilities via PWA.",
                  image: "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/fire-safety-qmvE1wUbesMW7gt9LnAVDGiuSBSODB.png",
                  link: "https://kzmiig8m6cgsxcx2ffit.lite.vusercontent.net",
                  technologies: ["React", "Material UI", "Node.js", "PWA", "MongoDB", "Express"],
                },
                {
                  title: "GPU Training Service",
                  description:
                    "A secure and scalable service for researchers to run training jobs on GPU clusters. Features Kubernetes integration, Django authentication, and Express backend for managing GPU resources.",
                  image: "/placeholder.svg?height=200&width=400&text=GPU+Training+Service",
                  link: "https://github.com/james-lat/simpletrain",
                  technologies: ["Node.js", "Express", "Kubernetes", "Django", "Docker"],
                },
                {
                  title: "TaleForge",
                  description:
                    "An interactive storybook website where young readers' choices shape the story progression. Features dynamic image generation and a child-friendly interface.",
                  image: "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/taleforge-pCMgNw4xmqvr7Nc2GNhkgyerhZEg4c.png",
                  link: "https://github.com/Sammy-Dabbas/TaleForge",
                  technologies: ["Next.js", "TypeScript", "React", "Node.js"],
                },
              ].map((project, index) => {
                if (typeof project === "number") {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-800 bg-opacity-95 rounded-lg shadow-md overflow-hidden"
                    >
                      <img
                        src={`/placeholder.svg?height=200&width=400&text=Project+${project}`}
                        alt={`Project ${project}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">Project {project}</h3>
                        <p className="text-gray-400 mb-4">
                          A brief description of project {project} and its key features.
                        </p>
                        <div className="flex justify-between items-center">
                          <a href="#" className="text-blue-400 hover:underline">
                            View Project
                          </a>
                          <a href="#" className="text-gray-400 hover:text-gray-200">
                            <Github size={20} />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )
                } else {
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-800 bg-opacity-95 rounded-lg shadow-md overflow-hidden"
                    >
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <p className="text-gray-400 mb-4">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.technologies.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-gray-700 px-2 py-1 rounded-full text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.title === "Fire & Safety Compliance Platform" ? (
                          <div className="flex justify-between items-center">
                            <a
                              href={project.link}
                              className="text-blue-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project
                            </a>
                            <div className="flex items-center text-amber-400">
                              <HardHat size={20} className="mr-2" />
                              <span className="text-sm">Backend Under Construction</span>
                            </div>
                          </div>
                        ) : project.title === "GPU Training Service" ? (
                          <div className="flex justify-between items-center">
                            <div className="flex items-center text-amber-400">
                              <HardHat size={20} className="mr-2" />
                              <span className="text-sm">Under Construction</span>
                            </div>
                            <HardHat size={20} className="text-amber-400" />
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <a
                              href={project.link}
                              className="text-blue-400 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View Project
                            </a>
                            <a
                              href={project.link}
                              className="text-gray-400 hover:text-gray-200"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github size={20} />
                            </a>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                }
              })}
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.skills} className="py-20 bg-gray-800 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {[
                "Python",
                "C#",
                "JavaScript",
                "Java",
                "C++",
                "SQL",
                "NoSQL",
                "Git/GitHub",
                "Docker",
                "Kubernetes",
                "MS SQL Server",
                "React.js",
                "HTML/CSS",
                "ETL",
                "Statistical Analysis",
              ].map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-700 rounded-lg p-4 text-center"
                >
                  <p className="text-lg font-semibold">{skill}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section ref={sectionRefs.current.contact} className="py-20 bg-gray-900 bg-opacity-80">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 text-center">Get in Touch</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-center mb-8">
                I'm always open to new opportunities and collaborations. Feel free to reach out if you'd like to
                connect!
              </p>
              <div className="flex justify-center space-x-6">
                <a href="mailto:dabbassammy@gmail.com" className="hover:text-blue-400 transition-colors">
                  <Mail size={32} />
                </a>
                <a
                  href="https://github.com/Sammy-Dabbas"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <Github size={32} />
                </a>
                <a
                  href="https://linkedin.com/in/sammy-dabbas-61a559309"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors"
                >
                  <Linkedin size={32} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 bg-opacity-80 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} Sammy Dabbas. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

