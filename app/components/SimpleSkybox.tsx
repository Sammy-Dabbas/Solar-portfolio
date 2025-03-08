"use client"

import { useThree } from "@react-three/fiber"
import { Color } from "three"
import { useEffect } from "react"

export function SimpleSkybox() {
  const { scene } = useThree()

  useEffect(() => {
    const originalBackground = scene.background

    // Set a black background
    scene.background = new Color(0x000000)

    return () => {
      scene.background = originalBackground
    }
  }, [scene])

  return null
}

