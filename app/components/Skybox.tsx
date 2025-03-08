"use client"

import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"

export function Skybox() {
  const { scene } = useThree()

  useEffect(() => {
    // Set a black background
    scene.background = new THREE.Color(0x000000)

    return () => {
      // Cleanup if needed
    }
  }, [scene])

  return null
}

