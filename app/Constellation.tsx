"use client"

import { useRef, useMemo } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import { Text } from "@react-three/drei"

const starColors = [0xffffff, 0xffefd5, 0xfffacd, 0xf0fff0]

export function SolarSystem() {
  const { camera } = useThree()

  // Set initial camera position
  useMemo(() => {
    camera.position.set(0, 0, 200)
  }, [camera])

  const backgroundStars = useMemo(() => {
    const stars = []
    for (let i = 0; i < 2000; i++) {
      const x = THREE.MathUtils.randFloatSpread(400)
      const y = THREE.MathUtils.randFloatSpread(400)
      const z = THREE.MathUtils.randFloatSpread(400)
      stars.push(new THREE.Vector3(x, y, z))
    }
    return stars
  }, [])

  const starGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(backgroundStars)
  }, [backgroundStars])

  const starMaterial = useMemo(() => {
    return new THREE.PointsMaterial({
      size: 0.5,
      sizeAttenuation: true,
      vertexColors: true,
    })
  }, [])

  const colors = useMemo(() => {
    return new Float32Array(
      backgroundStars.flatMap(() => {
        const color = new THREE.Color(starColors[Math.floor(Math.random() * starColors.length)])
        return [color.r, color.g, color.b]
      }),
    )
  }, [backgroundStars])

  const starsRef = useRef<THREE.Points>(null)
  const sunRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001
      starsRef.current.rotation.x += 0.00005
    }
    if (sunRef.current) {
      sunRef.current.rotation.y += 0.001
    }
  })

  return (
    <>
      <points ref={starsRef} geometry={starGeometry} material={starMaterial}>
        <bufferAttribute attach="geometry-attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </points>
      <group position={[0, 40, -100]}>
        <Text
          fontSize={10}
          color="white"
          anchorX="center"
          anchorY="middle"
          lookAt={[0, 0, 200]}
          maxWidth={200}
          textAlign="center"
        >
          Welcome to My Portfolio
          {"\n\n"}
          I'm Sammy, a software engineer
          {"\n\n"}
          Explore the solar system below to discover my projects
        </Text>
      </group>
      <mesh ref={sunRef} position={[0, -30, -100]}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color={0xffff00} />
      </mesh>
    </>
  )
}

