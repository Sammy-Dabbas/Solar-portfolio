"use client"

import { useEffect, useRef } from "react"
import { useAnimation } from "framer-motion"
import { motion } from "framer-motion"

export default function ClientSideComponents() {
  return (
    <>
      <StarBackground />
    </>
  )
}

const ShootingStar = () => {
  const controls = useAnimation()

  useEffect(() => {
    let isMounted = true

    // Add a small delay to ensure the component is mounted
    const timeout = setTimeout(() => {
      const animateStar = async () => {
        if (!isMounted) return

        try {
          // Calculate angle and positions based on screen width
          const screenWidth = window.innerWidth
          const isSmallScreen = screenWidth < 768 // Mobile breakpoint

          // Adjust starting and ending positions based on screen size
          const startX = screenWidth + 100
          const startY = isSmallScreen ? -50 : -100
          const endX = -100
          const endY = isSmallScreen ? window.innerHeight + 20 : window.innerHeight + 50

          await controls.start({
            x: [startX, endX],
            y: [startY, endY],
            transition: { duration: isSmallScreen ? 1.5 : 2, ease: "linear" },
          })

          if (isMounted) {
            await new Promise((resolve) => setTimeout(resolve, Math.random() * 30000 + 20000))
            if (isMounted) animateStar()
          }
        } catch (error) {
          console.error("Animation error:", error)
        }
      }

      animateStar()
    }, 100) // Small delay to ensure component is mounted

    return () => {
      isMounted = false
      clearTimeout(timeout)
    }
  }, [controls])

  return (
    <motion.div className="absolute" animate={controls} initial={{ x: window.innerWidth, y: -100 }}>
      <div
        className="w-[100px] sm:w-[150px] h-[2px] -rotate-[45deg] sm:-rotate-[35deg]"
        style={{
          background: "linear-gradient(to left, transparent, white)",
          boxShadow: "0 0 20px rgba(255,255,255,0.5)",
        }}
      >
        <div
          className="absolute right-[calc(100%-2px)] w-[3px] sm:w-[4px] h-[3px] sm:h-[4px] rounded-full bg-white"
          style={{
            boxShadow: "0 0 20px rgba(255,255,255,1)",
          }}
        />
      </div>
    </motion.div>
  )
}

const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; radius: number; color: string }[] = []

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        color: `rgba(255, 255, 255, ${Math.random() * 0.8 + 0.2})`,
      })
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()
      })
    }

    function animateStars() {
      drawStars()
      stars.forEach((star) => {
        star.y -= star.radius * 0.05 // Vary speed based on star size
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width // Randomize x position when resetting
        }
      })
      requestAnimationFrame(animateStars)
    }

    animateStars()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      <ShootingStar />
      <ShootingStar />
    </>
  )
}

