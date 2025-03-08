"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import * as THREE from "three"
import { HardHat } from "lucide-react"

// Dynamically import Three.js components to avoid SSR issues
const ThreeCanvas = dynamic(() => import("../components/ThreeCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-full bg-black flex items-center justify-center text-white">Loading 3D View...</div>
  ),
})

interface ProjectData {
  title: string
  description: string
  link: string
  technologies: string[]
}

interface ProjectCardProps {
  project: ProjectData
  onClose: () => void
}

function ProjectCard({ project, onClose }: ProjectCardProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="fixed top-4 sm:top-8 left-4 sm:left-[20%] w-[calc(100%-2rem)] sm:w-[90%] max-w-2xl z-50"
      >
        <div
          className="bg-gray-900/95 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl shadow-xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">{project.title}</h2>
            <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6 leading-relaxed max-h-[150px] sm:max-h-[200px] overflow-y-auto">
              {project.description}
            </p>
            <div className="mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold mb-2">Technologies:</h3>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-blue-600/50 backdrop-blur-sm px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:gap-4">
              {project.title.includes("Fire & Safety") && (
                <div className="flex items-center text-amber-400 bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg">
                  <HardHat size={20} className="mr-2" />
                  <span className="text-sm sm:text-base">Backend Under Construction</span>
                </div>
              )}
              <div className="flex justify-between items-center gap-2">
                {project.title.includes("GPU Training") ? (
                  <div className="flex items-center text-amber-400 bg-gray-800/80 backdrop-blur-sm px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg flex-1">
                    <HardHat size={20} className="mr-2" />
                    <span className="text-sm sm:text-base">Under Construction</span>
                  </div>
                ) : (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600/80 backdrop-blur-sm text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 text-center text-sm sm:text-base"
                  >
                    View Project
                  </a>
                )}
                <button
                  onClick={onClose}
                  className="bg-gray-700/80 backdrop-blur-sm text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function SolarSystemScene() {
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)
  const controlsRef = useRef<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleProjectSelect = useCallback((project: ProjectData | null, position: THREE.Vector3) => {
    setActiveProject(project)

    if (project && controlsRef.current && controlsRef.current.object) {
      // Calculate positions
      const planetPos = position.clone()
      const distance = 200 // Increased distance for better view

      // Create a point above the planet to look at
      const lookAtPoint = planetPos.clone()
      lookAtPoint.y += 50 // Look at a point above the planet

      // Position camera to look down at this point
      const targetPosition = new THREE.Vector3()
      targetPosition.copy(lookAtPoint) // Start from the look-at point
      targetPosition.y += 100 // Move camera up
      targetPosition.z += distance // Move camera back

      const duration = 1000
      const startPosition = controlsRef.current.object.position.clone()
      const startTarget = controlsRef.current.target.clone()
      const startTime = Date.now()

      const animate = () => {
        // Check if controlsRef is still valid
        if (!controlsRef.current || !controlsRef.current.object) return

        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

        // Smoothly move camera position
        controlsRef.current.object.position.lerpVectors(startPosition, targetPosition, eased)

        // Smoothly move look-at point (this will keep the planet in the bottom half)
        controlsRef.current.target.lerpVectors(startTarget, lookAtPoint, eased)

        controlsRef.current.update()

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [])

  // Update the handleCloseCard function to reset camera position
  const handleCloseCard = useCallback(() => {
    setActiveProject(null)

    // Reset camera position when closing the card
    if (controlsRef.current && controlsRef.current.object) {
      const duration = 1000
      const startPosition = controlsRef.current.object.position.clone()
      const startTarget = controlsRef.current.target.clone()
      const startTime = Date.now()

      // Default camera position and target
      const defaultPosition = new THREE.Vector3(0, 200, 600)
      const defaultTarget = new THREE.Vector3(0, 0, 0)

      const animate = () => {
        // Check if controlsRef is still valid
        if (!controlsRef.current || !controlsRef.current.object) return

        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

        const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

        // Smoothly move camera back to default position
        controlsRef.current.object.position.lerpVectors(startPosition, defaultPosition, eased)
        controlsRef.current.target.lerpVectors(startTarget, defaultTarget, eased)

        controlsRef.current.update()

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      animate()
    }
  }, [])

  return (
    <div
      className="h-screen w-full bg-black relative overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseCard()
        }
      }}
    >
      {isMounted && (
        <ThreeCanvas activeProject={activeProject} onProjectSelect={handleProjectSelect} controlsRef={controlsRef} />
      )}
      <Link
        href="/"
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full hover:bg-white/20 transition-colors z-10"
      >
        Switch to 2D View
      </Link>
      {activeProject && <ProjectCard project={activeProject} onClose={handleCloseCard} />}
    </div>
  )
}

