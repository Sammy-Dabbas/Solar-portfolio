"use client"

import { useRef, useState } from "react"
import { Sphere, Text } from "@react-three/drei"
import { useTexture } from "@react-three/fiber"
import SolarFlares from "./SolarFlares"
import type * as THREE from "three"

function Sun() {
  const groupRef = useRef<THREE.Group>(null)
  const sphereRef = useRef<THREE.Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  const sunTexture = useTexture("/sun-texture.jpg")

  const onClick = () => {
    alert("You clicked the sun!")
  }

  // Inside the Sun component
  return (
    <group ref={groupRef}>
      <group>
        <Sphere
          ref={sphereRef}
          args={[40, 64, 64]}
          onClick={onClick}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <meshBasicMaterial map={sunTexture} />
        </Sphere>
        {hovered && (
          <Sphere args={[41, 64, 64]}>
            <meshBasicMaterial color="#ffffff" transparent opacity={0.2} />
          </Sphere>
        )}
        <SolarFlares />
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

export default Sun

