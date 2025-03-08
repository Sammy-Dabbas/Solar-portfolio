"use client"

import { useRef, useMemo, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

interface Skill {
  name: string
  position: [number, number, number]
  related: string[]
  category: "frontend" | "backend" | "devops" | "ml" | "languages"
}

const skills: Skill[] = [
  {
    name: "React",
    position: [0, 0, 0],
    related: ["TypeScript", "JavaScript", "Next.js"],
    category: "frontend",
  },
  {
    name: "TypeScript",
    position: [-30, 20, -10],
    related: ["JavaScript", "Node.js"],
    category: "languages",
  },
  {
    name: "Python",
    position: [40, -10, 20],
    related: ["TensorFlow", "Django", "NumPy"],
    category: "languages",
  },
  {
    name: "TensorFlow",
    position: [60, 0, 40],
    related: ["Python", "NumPy", "Deep Learning"],
    category: "ml",
  },
  {
    name: "Docker",
    position: [-50, -20, 30],
    related: ["Kubernetes", "DevOps"],
    category: "devops",
  },
  {
    name: "Node.js",
    position: [20, 30, -20],
    related: ["JavaScript", "Express", "TypeScript"],
    category: "backend",
  },
]

const categoryColors = {
  frontend: "#61dafb", // React blue
  backend: "#68a063", // Node.js green
  devops: "#2396ed", // Docker blue
  ml: "#ff6f61", // TensorFlow red
  languages: "#f7df1e", // JavaScript yellow
}

export function SkillConstellation() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Create points for skills
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(skills.length * 3)
    const colors = new Float32Array(skills.length * 3)
    const color = new THREE.Color()

    skills.forEach((skill, i) => {
      positions[i * 3] = skill.position[0]
      positions[i * 3 + 1] = skill.position[1]
      positions[i * 3 + 2] = skill.position[2]

      color.set(categoryColors[skill.category])
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })

    return { positions, colors }
  }, [])

  // Create lines between related skills
  const linePositions = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const color1 = new THREE.Color()
    const color2 = new THREE.Color()

    skills.forEach((skill) => {
      skill.related.forEach((relatedName) => {
        const relatedSkill = skills.find((s) => s.name === relatedName)
        if (relatedSkill) {
          // Add line vertices
          positions.push(
            skill.position[0],
            skill.position[1],
            skill.position[2],
            relatedSkill.position[0],
            relatedSkill.position[1],
            relatedSkill.position[2],
          )

          // Add colors for gradient effect
          color1.set(categoryColors[skill.category])
          color2.set(categoryColors[relatedSkill.category])
          colors.push(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b)
        }
      })
    })

    return { positions: new Float32Array(positions), colors: new Float32Array(colors) }
  }, [])

  // Animation
  useFrame(({ clock }) => {
    if (pointsRef.current && linesRef.current) {
      const time = clock.getElapsedTime()

      // Animate points
      pointsRef.current.rotation.y = time * 0.05

      // Animate lines
      linesRef.current.material.opacity = (Math.sin(time) + 1.5) * 0.3
    }
  })

  // Handle hover interactions
  const handleSkillHover = (skillName: string | null) => {
    setHoveredSkill(skillName)
  }

  return (
    <group>
      {/* Render connecting lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.positions.length / 3}
            array={linePositions.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={linePositions.colors.length / 3}
            array={linePositions.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial vertexColors transparent opacity={0.4} linewidth={1} />
      </lineSegments>

      {/* Render skill points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial vertexColors size={5} sizeAttenuation={false} />
      </points>

      {/* Render skill labels */}
      {skills.map((skill, index) => (
        <group key={skill.name} position={skill.position as [number, number, number]}>
          <Text
            position={[0, 3, 0]}
            fontSize={3}
            color={hoveredSkill === skill.name ? "#ffffff" : categoryColors[skill.category]}
            anchorX="center"
            anchorY="middle"
            onPointerOver={() => handleSkillHover(skill.name)}
            onPointerOut={() => handleSkillHover(null)}
          >
            {skill.name}
          </Text>
          {hoveredSkill === skill.name && (
            <mesh>
              <sphereGeometry args={[2, 16, 16]} />
              <meshBasicMaterial color={categoryColors[skill.category]} transparent opacity={0.3} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

