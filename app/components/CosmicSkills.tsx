"use client"

import { useRef, useMemo, useState, useCallback } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

interface Skill {
  name: string
  position: [number, number, number]
  related: string[]
  category: "languages" | "technologies" | "web" | "devops"
  level: number
}

// Update colors to include sub-categories
const categoryColors = {
  languages: "#00fff2", // Bright cyan for languages
  technologies: "#ffb700", // Golden for general technologies
  web: "#4287f5", // Bright blue for web technologies
  devops: "#c026d3", // Purple for DevOps tools
}

const skills: Skill[] = [
  // Web Development Constellation (JavaScript, React, HTML/CSS)
  {
    name: "JavaScript",
    position: [600, 100, -1500],
    related: ["React.js", "HTML/CSS"],
    category: "web",
    level: 5,
  },
  {
    name: "React.js",
    position: [650, 200, -1500],
    related: ["HTML/CSS"],
    category: "web",
    level: 5,
  },
  {
    name: "HTML/CSS",
    position: [550, 150, -1500],
    related: [],
    category: "web",
    level: 5,
  },

  // Core Languages Constellation
  {
    name: "Python",
    position: [-600, 200, -1500],
    related: ["C#"],
    category: "languages",
    level: 5,
  },
  {
    name: "C#",
    position: [-550, 300, -1500],
    related: ["Visual Basic"],
    category: "languages",
    level: 5,
  },
  {
    name: "Visual Basic",
    position: [-500, 250, -1500],
    related: [],
    category: "languages",
    level: 4,
  },

  // Systems Programming Constellation
  {
    name: "Java",
    position: [-700, -50, -1500],
    related: ["C++"],
    category: "languages",
    level: 4,
  },
  {
    name: "C++",
    position: [-600, -100, -1500],
    related: [],
    category: "languages",
    level: 4,
  },

  // Database Constellation
  {
    name: "SQL",
    position: [700, -50, -1500],
    related: ["MS SQL Server", "NoSQL"],
    category: "technologies",
    level: 5,
  },
  {
    name: "NoSQL",
    position: [800, -100, -1500],
    related: [],
    category: "technologies",
    level: 4,
  },
  {
    name: "MS SQL Server",
    position: [750, 0, -1500],
    related: [],
    category: "technologies",
    level: 5,
  },

  // DevOps Constellation
  {
    name: "Docker",
    position: [500, -200, -1500],
    related: ["Kubernetes"],
    category: "devops",
    level: 5,
  },
  {
    name: "Kubernetes",
    position: [450, -250, -1500],
    related: [],
    category: "devops",
    level: 4,
  },
  {
    name: "Git/GitHub",
    position: [600, -150, -1500],
    related: ["GitLab"],
    category: "devops",
    level: 5,
  },
  {
    name: "GitLab",
    position: [550, -200, -1500],
    related: [],
    category: "devops",
    level: 4,
  },
]

export function CosmicSkills() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  // Update the hover state management to prevent unnecessary re-renders
  const handleSkillHover = useCallback(
    (skillName: string | null) => {
      if (hoveredSkill !== skillName) {
        setHoveredSkill(skillName)
      }
    },
    [hoveredSkill],
  )

  // Create points for skills with enhanced star-like effect
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

  // Enhanced star sizes based on skill level
  const sizes = useMemo(() => {
    const temp = new Float32Array(skills.length)
    for (let i = 0; i < temp.length; i++) {
      temp[i] = skills[i].level * 5 // Increased size for more prominent stars
    }
    return temp
  }, [])

  // Create constellation lines
  const linePositions = useMemo(() => {
    const positions: number[] = []
    const colors: number[] = []
    const color1 = new THREE.Color()
    const color2 = new THREE.Color()

    skills.forEach((skill) => {
      skill.related.forEach((relatedName) => {
        const relatedSkill = skills.find((s) => s.name === relatedName)
        if (relatedSkill) {
          positions.push(
            skill.position[0],
            skill.position[1],
            skill.position[2],
            relatedSkill.position[0],
            relatedSkill.position[1],
            relatedSkill.position[2],
          )

          color1.set(categoryColors[skill.category])
          color2.set(categoryColors[relatedSkill.category])
          colors.push(color1.r, color1.g, color1.b, color2.r, color2.g, color2.b)
        }
      })
    })

    return { positions: new Float32Array(positions), colors: new Float32Array(colors) }
  }, [])

  // Update the useFrame hook to prevent state updates in animation frames
  useFrame(({ clock }) => {
    if (pointsRef.current && linesRef.current) {
      const time = clock.getElapsedTime()

      // Subtle floating movement - only update position, not state
      pointsRef.current.position.y = Math.sin(time * 0.2) * 3
      linesRef.current.position.y = Math.sin(time * 0.2) * 3

      // Twinkling effect for stars - update uniforms directly
      const material = pointsRef.current.material as THREE.ShaderMaterial
      if (material && material.uniforms) {
        material.uniforms.time.value = time
      }

      // Pulsing opacity for constellation lines
      const lineMaterial = linesRef.current.material as THREE.LineBasicMaterial
      if (lineMaterial) {
        lineMaterial.opacity = (Math.sin(time * 0.5) * 0.2 + 0.5) * 0.5
      }
    }
  })

  return (
    <group>
      {/* Constellation lines */}
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
        <lineBasicMaterial vertexColors transparent opacity={0.3} linewidth={1.5} />
      </lineSegments>

      {/* Star points */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
          <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          vertexColors
          blending={THREE.AdditiveBlending}
          uniforms={{
            time: { value: 0 },
          }}
          vertexShader={`
            attribute float size;
            varying vec3 vColor;
            uniform float time;
            void main() {
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              float twinkle = sin(time * 2.0 + position.x * 0.5) * 0.2 + 0.8;
              gl_PointSize = size * (300.0 / -mvPosition.z) * twinkle;
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            varying vec3 vColor;
            void main() {
              float r = length(gl_PointCoord - vec2(0.5));
              if (r > 0.5) discard;
              float strength = 1.0 - (r * 2.0);
              gl_FragColor = vec4(vColor, strength);
            }
          `}
        />
      </points>

      {/* Skill labels */}
      {skills.map((skill, index) => (
        <group key={skill.name} position={skill.position as [number, number, number]}>
          <Text
            position={[0, 15, 0]}
            fontSize={24}
            color={hoveredSkill === skill.name ? "#ffffff" : categoryColors[skill.category]}
            anchorX="center"
            anchorY="middle"
            opacity={0.8}
            onPointerOver={() => handleSkillHover(skill.name)}
            onPointerOut={() => handleSkillHover(null)}
            outlineWidth={0.5}
            outlineColor="rgba(0,0,0,0.5)"
          >
            {skill.name}
          </Text>
          {/* Enhanced glow effect when hovered */}
          {hoveredSkill === skill.name && (
            <Text
              position={[0, 15, 0]}
              fontSize={24}
              color={categoryColors[skill.category]}
              anchorX="center"
              anchorY="middle"
              opacity={0.4}
              renderOrder={-1}
            >
              {skill.name}
            </Text>
          )}
        </group>
      ))}
    </group>
  )
}

