"use client"

import { useRef, useMemo } from "react"
import type * as THREE from "three"
import { useFrame } from "@react-three/fiber"

export function AsteroidBelt({ isActive }: { isActive: boolean }) {
  const meshRef = useRef<THREE.Points>(null)

  // Create asteroids in a belt formation
  const asteroids = useMemo(() => {
    const temp = []
    const numAsteroids = 2000
    const radius = 350 // Belt radius
    const spread = 50 // Belt width

    for (let i = 0; i < numAsteroids; i++) {
      // Calculate position on a circle with some random spread
      const angle = (i / numAsteroids) * Math.PI * 2
      const baseRadius = radius + (Math.random() - 0.5) * spread
      const x = Math.cos(angle) * baseRadius
      const z = Math.sin(angle) * baseRadius
      const y = (Math.random() - 0.5) * spread * 0.5 // Less vertical spread

      // Add some random offset to make it less uniform
      const randOffset = Math.random() * Math.PI * 2
      temp.push(x + Math.cos(randOffset) * 5, y, z + Math.sin(randOffset) * 5)
    }
    return new Float32Array(temp)
  }, [])

  // Create varying sizes for the asteroids
  const sizes = useMemo(() => {
    const temp = new Float32Array(asteroids.length / 3)
    for (let i = 0; i < temp.length; i++) {
      temp[i] = Math.random() * 1.5 + 0.5 // Random sizes between 0.5 and 2
    }
    return temp
  }, [asteroids])

  useFrame((state) => {
    if (meshRef.current && !isActive) {
      // Apply rotation directly to the mesh without causing re-renders
      meshRef.current.rotation.y += 0.0003
    }
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={asteroids.length / 3} array={asteroids} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={sizes.length} array={sizes} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={1}
        sizeAttenuation={true}
        color="#cccccc" // Changed from #aaaaaa to #cccccc for brighter color
        transparent
        opacity={0.8} // Increased from 0.6 to 0.8 for more visibility
      />
    </points>
  )
}

