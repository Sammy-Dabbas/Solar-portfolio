"use client"

import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useState, useCallback, Suspense } from "react"
import { Sphere, Text, useTexture } from "@react-three/drei"
import { Skybox } from "./components/Skybox"

interface ProjectData {
  title: string
  description: string
  link: string
  technologies: string[]
}

interface PlanetData {
  name: string
  radius: number
  orbitRadius: number
  speed: number
  color: string
  initialAngle: number
  project: ProjectData
  texturePath: string
}

const planetOrbitalPeriods = {
  Mercury: 0.8,
  Venus: 1.6,
  Earth: 2.4,
  Mars: 3.2,
  Jupiter: 4.0,
  Saturn: 4.8,
}

// Add these constants at the top level
const sunProject: ProjectData = {
  title: "Interactive 3D Portfolio",
  description:
    "An immersive 3D solar system portfolio showcasing various projects. Built with React, Three.js, and React Three Fiber.",
  link: "https://github.com/yourusername/3d-portfolio",
  technologies: ["React", "Three.js", "React Three Fiber", "TypeScript", "Tailwind CSS"],
}

const planets: PlanetData[] = [
  {
    name: "Mercury",
    radius: 10,
    orbitRadius: 100,
    speed: 0.01,
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce platform with user authentication, product catalog, and payment integration.",
      link: "https://github.com/yourusername/e-commerce-platform",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png",
  },
  {
    name: "Venus",
    radius: 15,
    orbitRadius: 150,
    speed: 0.007,
    color: "#ffd85c",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Weather App",
      description: "A responsive weather application with real-time weather data and forecasts.",
      link: "https://github.com/yourusername/weather-app",
      technologies: ["React", "OpenWeatherMap API", "Styled Components"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png",
  },
  {
    name: "Earth",
    radius: 16,
    orbitRadius: 200,
    speed: 0.005,
    color: "#2b82c9",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Task Management System",
      description: "A collaborative task management system with real-time updates and project analytics.",
      link: "https://github.com/yourusername/task-management-system",
      technologies: ["Vue.js", "Firebase", "Vuex", "Chart.js"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png",
  },
  {
    name: "Mars",
    radius: 12,
    orbitRadius: 250,
    speed: 0.004,
    color: "#c1440e",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Fitness Tracker",
      description: "A mobile app for tracking workouts, nutrition, and personal fitness goals.",
      link: "https://github.com/yourusername/fitness-tracker",
      technologies: ["React Native", "Redux", "Express.js", "PostgreSQL"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png",
  },
]

function OrbitLine({ radius }: { radius: number }) {
  const points = useMemo(() => {
    const segments = 128
    const vertices = []
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    }
    return new Float32Array(vertices)
  }, [radius])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={points.length / 3} array={points} itemSize={3} />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" opacity={0.3} transparent linewidth={2} />
    </line>
  )
}

function Planet({ planet, onClick, isActive }: { planet: PlanetData; onClick: () => void; isActive: boolean }) {
  const ref = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const { radius, orbitRadius, color, initialAngle, name, texturePath } = planet
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  const orbitalPeriod = planetOrbitalPeriods[name as keyof typeof planetOrbitalPeriods] || 1

  const texture = useTexture(texturePath)

  useFrame(({ clock }) => {
    if (ref.current && textRef.current) {
      const t = clock.getElapsedTime() * 0.1
      const angle = t / orbitalPeriod + initialAngle
      const x = Math.cos(angle) * orbitRadius
      const z = Math.sin(angle) * orbitRadius
      ref.current.position.set(x, 0, z)
      textRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <>
      <OrbitLine radius={orbitRadius} />
      <group ref={ref}>
        <Sphere
          ref={sphereRef}
          args={[radius, 32, 32]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshBasicMaterial map={texture} />
        </Sphere>
        {hovered && (
          <Sphere args={[radius * 1.05, 32, 32]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </Sphere>
        )}
        <Text
          ref={textRef}
          fontSize={10}
          color="white"
          anchorX="center"
          anchorY="middle"
          position={[0, radius + 10, 0]}
        >
          {name}
        </Text>
      </group>
    </>
  )
}

// Add the Sun component
function Sun({ onClick }: { onClick: () => void }) {
  const sunRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()

  const sunTexture = useTexture(
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/sun-W8e2ouPCZSCEi2rRK9t32Qeo5MsI85.jpg",
  )

  useFrame((state) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001
    }
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group>
      <Sphere ref={sunRef} args={[40, 64, 64]} onClick={onClick}>
        <meshBasicMaterial map={sunTexture} />
      </Sphere>
      <Text ref={textRef} fontSize={12} color="#87CEEB" anchorX="center" anchorY="middle" position={[0, 50, 0]}>
        Click to view portfolio
      </Text>
    </group>
  )
}

// Update the SolarSystem component's return statement
export function SolarSystem({ onProjectSelect }: { onProjectSelect?: (project: ProjectData | null) => void }) {
  const { camera } = useThree()
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)

  // Set initial camera position
  useMemo(() => {
    camera.position.set(0, 200, 600)
    camera.far = 10000
    camera.updateProjectionMatrix()
  }, [camera])

  const handleProjectClick = useCallback(
    (project: ProjectData) => {
      setActiveProject(project)
      if (onProjectSelect) {
        onProjectSelect(project)
      }
    },
    [onProjectSelect],
  )

  const stars = useMemo(() => {
    const STAR_COUNT = 3000
    const STAR_FIELD_SIZE = 2000
    const temp = []
    const color = new THREE.Color()
    const colors = new Float32Array(STAR_COUNT * 3)

    for (let i = 0; i < STAR_COUNT; i++) {
      const x = THREE.MathUtils.randFloatSpread(STAR_FIELD_SIZE)
      const y = THREE.MathUtils.randFloatSpread(STAR_FIELD_SIZE)
      const z = THREE.MathUtils.randFloatSpread(STAR_FIELD_SIZE)
      temp.push(x, y, z)

      // Set a random star color (white to pale yellow)
      const r = Math.random() * 0.2 + 0.8
      const g = Math.random() * 0.2 + 0.8
      const b = Math.random() * 0.2 + 0.7
      color.setRGB(r, g, b)
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(temp, 3))
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    return geometry
  }, [])

  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 2,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
    })
  }, [])

  return (
    <>
      <Skybox />
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, 0]} intensity={1} distance={2000} decay={2} />

      {/* Welcome text group */}
      <group position={[0, 150, -200]}>
        <Text
          fontSize={20}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, 40, 0]}
          maxWidth={400}
          textAlign="center"
        >
          Welcome to My Portfolio
        </Text>
        <Text
          fontSize={16}
          color="#87CEEB"
          anchorX="center"
          anchorY="middle"
          position={[0, 0, 0]}
          maxWidth={400}
          textAlign="center"
        >
          I'm a Software Engineer
        </Text>
        <Text
          fontSize={14}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          position={[0, -40, 0]}
          maxWidth={400}
          textAlign="center"
          opacity={0.7}
        >
          Explore the solar system below to discover my projects
        </Text>
      </group>

      {/* Solar System group */}
      <group position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Sun onClick={() => handleProjectClick(sunProject)} />
          {planets.map((planet) => (
            <Planet
              key={planet.name}
              planet={planet}
              onClick={() => handleProjectClick(planet.project)}
              isActive={activeProject === planet.project}
            />
          ))}
        </Suspense>
      </group>

      {/* Stars background */}
      <points geometry={stars} material={starMaterial} />
    </>
  )
}

