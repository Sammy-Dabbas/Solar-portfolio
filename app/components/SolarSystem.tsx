"use client"

import type React from "react"

import * as THREE from "three"
import { useFrame, useThree } from "@react-three/fiber"
import { useRef, useMemo, useState, useCallback, Suspense, useEffect } from "react"
import { Sphere, Text, useTexture } from "@react-three/drei"
import { Skybox } from "./Skybox"
import { AsteroidBelt } from "./AsteroidBelt"
import { CosmicSkills } from "./CosmicSkills"
import { WelcomeText3D } from "./WelcomeText3D"
// Add import for ClientOnly
import { ClientOnly } from "./ClientOnly"

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

// Update the sunProject constant
const sunProject: ProjectData = {
  title: "Sammy Dabbas - Software Engineer",
  description: `Full-stack developer with expertise in machine learning and cloud infrastructure. Skilled in Python, C#, JavaScript, Java, C++, and various technologies including SQL, NOSQL, Git/GitHub, Docker, Kubernetes, MS SQL Server, React.js, HTML/CSS. Experienced in machine learning & deep learning with scikit-learn, Keras, TensorFlow, pandas, and NumPy.`,
  link: "https://linkedin.com/in/sammy-dabbas-61a559309/",
  technologies: ["Python", "C#", "JavaScript", "Java", "C++", "SQL", "Docker", "Kubernetes", "React.js", "TensorFlow"],
}

// Update the planets array
const planets: PlanetData[] = [
  {
    name: "Experience",
    radius: 12,
    orbitRadius: 100,
    speed: 0.01,
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Software Developer Intern - FINDER Software Solutions",
      description: `Engineered scalable ETL pipelines using Python and C#, implemented real-time data streaming systems enabling ML pipelines to increase recognition rates by 350%. Developed advanced parsers and automated validation frameworks, while delivering 15+ ticket-based enhancements. Previously worked as Statistical Analyst at NASA, conducting statistical analysis on severe weather data.`,
      link: "https://linkedin.com/in/sammy-dabbas-61a559309/",
      technologies: ["Python", "C#", "ETL", "Machine Learning", "Data Processing"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/brown_planet-DaPbJ6qhn9qJLyxloCHj67QCliTVsz.png",
  },
  {
    name: "Education",
    radius: 14,
    orbitRadius: 150,
    speed: 0.007,
    color: "#ffd85c",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Education",
      description:
        "Bachelor of Science in Computer Science at University of Central Florida (Expected May 2026) with a GPA of 3.9. Currently pursuing Associate in Arts degree in General Studies at Valencia College (Expected May 2024).",
      link: "https://www.ucf.edu/",
      technologies: ["Computer Science", "General Studies", "Academic Excellence"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Tropical-GoVd3zUFy6VhRyqeAerReVcCQDfxL9.png",
  },
  {
    name: "GPU Service",
    radius: 16,
    orbitRadius: 200,
    speed: 0.005,
    color: "#2b82c9",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Kubernetes GPU Training Orchestration Service",
      description:
        "Engineered Node.js (Express) REST APIs for GPU-based machine learning workloads. Built Django-based authentication system and data models for secure container management. Developed CLI tools improving developer productivity by 30%. Implemented containerization using Docker for consistent performance across cloud infrastructures.",
      link: "https://github.com/yourusername/gpu-training-service",
      technologies: ["Node.js", "Express", "Django", "Docker", "Kubernetes", "GPU Computing"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/Alpine-ogtBFvwlYKCLKbMD9Zj2CtwXImjtz8.png",
  },
  {
    name: "Fire & Safety",
    radius: 15,
    orbitRadius: 250,
    speed: 0.004,
    color: "#c1440e",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "Fire & Safety Compliance Management Platform",
      description:
        "Developed a scalable compliance platform to automate fire and safety inspections for commercial properties. Features include inspection scheduling, digital checklists, document repositories, role-based access control, interactive dashboards with real-time analytics, and offline capabilities via PWA. Enhanced operational efficiency, reduced errors, and provided audit-proof digital records.",
      link: "https://kzmiig8m6cgsxcx2ffit.lite.vusercontent.net",
      technologies: ["React", "Material UI", "Node.js", "PWA", "MongoDB", "Express"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/makemake-aXVdTQa5r9DGNMTJddM8DS5j2maz6V.jpg",
  },
  {
    name: "TaleForge",
    radius: 18,
    orbitRadius: 300,
    speed: 0.003,
    color: "#A88F6A",
    initialAngle: Math.random() * Math.PI * 2,
    project: {
      title: "TaleForge",
      description:
        "An interactive storybook website where young readers' choices shape the story progression. Features dynamic image generation and a child-friendly interface.",
      link: "https://github.com/Sammy-Dabbas/TaleForge",
      technologies: ["Next.js", "TypeScript", "React", "Node.js"],
    },
    texturePath:
      "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/gas%20giant-equirectangular-5-2048x1024-MpE2WbhRbu2wZJmwltTkTb3kMH4d1E.png",
  },
]

interface MoonData {
  name: string
  radius: number
  orbitRadius: number
  speed: number
  texturePath: string
}

const earthMoon: MoonData = {
  name: "Moon",
  radius: 4,
  orbitRadius: 30,
  speed: 1, // Increased speed for more visible rotation
  texturePath:
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/ceres-3UzlotgDmTrqlFRGwFxwoFiZAyxpu4.jpg",
}

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

function Planet({
  planet,
  onClick,
  isActive,
}: {
  planet: PlanetData
  onClick: (ref: THREE.Group) => void
  isActive: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const { radius, orbitRadius, color, initialAngle, name, texturePath } = planet
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()

  const orbitalPeriod = planetOrbitalPeriods[name as keyof typeof planetOrbitalPeriods] || 1

  const texture = useTexture(texturePath)

  const handlePointerOver = useCallback(() => {
    setHovered(true)
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
  }, [])

  const handleClick = useCallback(() => {
    if (ref.current) {
      onClick(ref.current)
    }
  }, [onClick])

  useFrame(({ clock }) => {
    if (ref.current && textRef.current) {
      if (!isActive) {
        // Only move if no project is active
        const t = clock.getElapsedTime() * 0.1
        const angle = t / orbitalPeriod + initialAngle
        const x = Math.cos(angle) * orbitRadius
        const z = Math.sin(angle) * orbitRadius
        ref.current.position.set(x, 0, z)

        // Add rotation on axis only when no project is active
        if (sphereRef.current) {
          sphereRef.current.rotation.y += 0.01
        }
      }
      // Update text orientation without causing re-renders
      if (textRef.current) {
        textRef.current.quaternion.copy(camera.quaternion)
      }
    }
  })

  return (
    <>
      <OrbitLine radius={orbitRadius} />
      <group ref={ref}>
        <Sphere
          ref={sphereRef}
          args={[radius, 32, 32]}
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
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
        {name === "GPU Service" && <Moon moon={earthMoon} />}
      </group>
    </>
  )
}

function Moon({ moon }: { moon: MoonData }) {
  const ref = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const orbitRef = useRef<THREE.Group>(null)
  const { radius, orbitRadius, speed, texturePath } = moon
  const { camera } = useThree()

  const texture = useTexture(texturePath)

  // Create an orbit line for the moon
  const moonOrbitPoints = useMemo(() => {
    const segments = 64
    const vertices = []
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      vertices.push(Math.cos(theta) * orbitRadius, 0, Math.sin(theta) * orbitRadius)
    }
    return new Float32Array(vertices)
  }, [orbitRadius])

  useFrame(({ clock }) => {
    if (orbitRef.current) {
      const t = clock.getElapsedTime()
      orbitRef.current.rotation.y = t * speed

      // Add rotation on axis
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.015 // Faster rotation for the moon
      }
    }
  })

  return (
    <group ref={ref}>
      {/* Moon's orbit line */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={moonOrbitPoints.length / 3}
            array={moonOrbitPoints}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffffff" opacity={0.1} transparent linewidth={1} />
      </line>

      {/* Moon's orbital rotation group */}
      <group ref={orbitRef}>
        <Sphere ref={sphereRef} args={[radius, 32, 32]} position={[orbitRadius, 0, 0]}>
          <meshBasicMaterial map={texture} />
        </Sphere>
      </group>
    </group>
  )
}

function Saturn({
  planet,
  onClick,
  isActive,
}: {
  planet: PlanetData
  onClick: (ref: THREE.Group) => void
  isActive: boolean
}) {
  const ref = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const { radius, orbitRadius, color, initialAngle, name, texturePath } = planet
  const [hovered, setHovered] = useState(false)
  const { camera } = useThree()
  const [activeProject, setActiveProject] = useState<ProjectData | null>(null)

  const texture = useTexture(texturePath)
  const ringTexture = useTexture(
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/saturn-fRvYEfZug5Jt8FOUEUMu7wmg5wvrX4.png",
  )

  // Create rings
  const ringGeometry = useMemo(() => {
    const innerRadius = radius * 1.4
    const outerRadius = radius * 2.2
    const thetaSegments = 64
    return new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments)
  }, [radius])

  // Create custom UV mapping for the ring texture
  useEffect(() => {
    if (ringGeometry) {
      const pos = ringGeometry.attributes.position
      const uv = ringGeometry.attributes.uv
      const v3 = new THREE.Vector3()

      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i)
        const distance = v3.length()
        const maxDistance = radius * 2.2
        const minDistance = radius * 1.4

        // Map the texture horizontally across the rings
        const normalizedDistance = (distance - minDistance) / (maxDistance - minDistance)

        uv.setXY(
          i,
          normalizedDistance, // Use normalized distance for horizontal mapping
          i % 2 === 0 ? 0 : 1, // Alternate between top and bottom of texture
        )
      }

      ringGeometry.attributes.uv.needsUpdate = true
    }
  }, [ringGeometry, radius])

  useFrame(({ clock }) => {
    if (ref.current && textRef.current) {
      if (!isActive) {
        // Only move if no project is active
        const t = clock.getElapsedTime() * 0.1
        const angle = t * 0.4 + initialAngle
        const x = Math.cos(angle) * orbitRadius
        const z = Math.sin(angle) * orbitRadius
        ref.current.position.set(x, 0, z)
      }
      textRef.current.quaternion.copy(camera.quaternion)

      // Add rotation on axis only when no project is active
      if (sphereRef.current) {
        sphereRef.current.rotation.y += 0.008
      }
    }
  })

  return (
    <>
      <OrbitLine radius={orbitRadius} />
      <group ref={ref}>
        {/* Planet sphere */}
        <Sphere
          ref={sphereRef}
          args={[radius, 32, 32]}
          onClick={() => ref.current && onClick(ref.current)}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshBasicMaterial map={texture} />
        </Sphere>

        {/* Rings with texture */}
        <mesh rotation-x={Math.PI / 3}>
          <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            side={THREE.DoubleSide}
            transparent
            opacity={0.9}
            alphaTest={0.2}
            color="#ffffff"
            emissive="#666666"
            emissiveIntensity={0.1}
            depthWrite={false}
          />
        </mesh>

        {/* Hover effect */}
        {hovered && (
          <Sphere args={[radius * 1.05, 32, 32]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.4} />
          </Sphere>
        )}

        {/* Label */}
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
function Sun({ onClick, isActive }: { onClick: () => void; isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const { camera } = useThree()
  const [hovered, setHovered] = useState(false)

  const sunTexture = useTexture(
    "https://tm2whnkyymobwcvl.public.blob.vercel-storage.com/textures/sun-W8e2ouPCZSCEi2rRK9t32Qeo5MsI85.jpg",
  )

  const handlePointerOver = useCallback(() => {
    setHovered(true)
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
  }, [])

  useFrame((state) => {
    if (sphereRef.current && !isActive) {
      sphereRef.current.rotation.y += 0.001
    }
    if (textRef.current) {
      textRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={groupRef}>
      <group>
        <Sphere
          ref={sphereRef}
          args={[40, 64, 64]}
          onClick={onClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <meshBasicMaterial map={sunTexture} />
        </Sphere>
        {hovered && (
          <Sphere args={[41, 64, 64]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </Sphere>
        )}
      </group>
      <Text
        ref={textRef}
        fontSize={12}
        color={hovered ? "#87CEEB" : "white"}
        anchorX="center"
        anchorY="middle"
        position={[0, 50, 0]}
      >
        About Me
      </Text>
    </group>
  )
}

// Update the SolarSystem component's return statement
export function SolarSystem({
  onProjectSelect,
  controlsRef,
  isActive,
}: {
  onProjectSelect?: (project: ProjectData | null, position: THREE.Vector3) => void
  controlsRef: React.RefObject<any>
  isActive: boolean
}) {
  const { camera } = useThree()
  const sunRef = useRef<THREE.Group>(null)

  // Update the handleProjectClick function to prevent unnecessary re-renders
  const handleProjectClick = useCallback(
    (project: ProjectData, position: THREE.Vector3) => {
      if (onProjectSelect && (!isActive || !position.equals(new THREE.Vector3(0, 0, 0)))) {
        onProjectSelect(project, position)
      }
    },
    [onProjectSelect, isActive],
  )

  // Update the useFrame hooks in Planet and Saturn components to check isActive

  // Update the onClick handlers in the Planet and Saturn components
  const planetClickHandler = (planet: PlanetData, ref: THREE.Group) => {
    handleProjectClick(planet.project, ref.position)
  }

  const handleSunClick = () => {
    // Create a position slightly above the sun for better camera positioning
    const sunPosition = new THREE.Vector3(0, 0, 0)
    handleProjectClick(sunProject, sunPosition)
  }

  // Set initial camera position
  useMemo(() => {
    camera.position.set(0, 200, 600)
    camera.far = 10000
    camera.updateProjectionMatrix()
  }, [camera])

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

      {/* Add CosmicSkills */}
      <CosmicSkills />

      {/* Replace the old welcome text with the new 3D version */}
      <ClientOnly>
        <WelcomeText3D />
      </ClientOnly>

      {/* Solar System group */}
      <group position={[0, 0, 0]}>
        <Suspense fallback={null}>
          <Sun onClick={handleSunClick} isActive={isActive} />
          <AsteroidBelt isActive={isActive} />
          {planets.map((planet) =>
            planet.name === "TaleForge" ? (
              <Saturn
                key={planet.name}
                planet={planet}
                onClick={(ref) => planetClickHandler(planet, ref)}
                isActive={isActive}
              />
            ) : (
              <Planet
                key={planet.name}
                planet={planet}
                onClick={(ref) => planetClickHandler(planet, ref)}
                isActive={isActive}
              />
            ),
          )}
        </Suspense>
      </group>

      {/* Stars background */}
      <points geometry={stars} material={starMaterial} />
    </>
  )
}

