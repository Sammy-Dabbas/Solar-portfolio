"use client"

import { useRef } from "react"
import { Text, Center } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export function WelcomeText3D() {
  const groupRef = useRef<THREE.Group>(null)
  const titleRef = useRef<THREE.Group>(null)
  const subtitleRef = useRef<THREE.Group>(null)
  const descriptionRef = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = 300 + Math.sin(clock.getElapsedTime() * 0.5) * 10
    }

    // Gentle rotation for each text element
    if (titleRef.current) {
      titleRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3) * 0.05
    }
    if (subtitleRef.current) {
      subtitleRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3 + 0.4) * 0.05
    }
    if (descriptionRef.current) {
      descriptionRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.3 + 0.8) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 300, -800]}>
      {/* Title */}
      <Center position={[0, 80, 0]}>
        <group ref={titleRef}>
          {/* Create multiple layers of text with slight offsets for 3D effect */}
          {[...Array(8)].map((_, i) => (
            <Text
              key={i}
              fontSize={40}
              color={i === 7 ? "#ffffff" : "#aaaaaa"}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, -i * 1]} // Stack texts behind each other
              outlineWidth={i === 7 ? 0.5 : 0}
              outlineColor="#000000"
            >
              Welcome to My Portfolio
            </Text>
          ))}
        </group>
      </Center>

      {/* Subtitle */}
      <Center position={[0, 0, 0]}>
        <group ref={subtitleRef}>
          {[...Array(6)].map((_, i) => (
            <Text
              key={i}
              fontSize={30}
              color={i === 5 ? "#ffffff" : "#aaaaaa"}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, -i * 1]}
              outlineWidth={i === 5 ? 0.5 : 0}
              outlineColor="#000000"
            >
              I'm a Software Engineer
            </Text>
          ))}
        </group>
      </Center>

      {/* Description */}
      <Center position={[0, -80, 0]}>
        <group ref={descriptionRef}>
          {[...Array(4)].map((_, i) => (
            <Text
              key={i}
              fontSize={20}
              color={i === 3 ? "#ffffff" : "#aaaaaa"}
              anchorX="center"
              anchorY="middle"
              position={[0, 0, -i * 1]}
              outlineWidth={i === 3 ? 0.5 : 0}
              outlineColor="#000000"
              opacity={i === 3 ? 0.9 : 0.7}
            >
              Explore the solar system below
            </Text>
          ))}
        </group>
      </Center>
    </group>
  )
}

