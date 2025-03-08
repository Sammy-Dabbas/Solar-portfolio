"use client"

import { useState, useEffect } from "react"
import { useLoader } from "@react-three/fiber"
import * as THREE from "three"

export function useOptionalTexture(path: string): THREE.Texture | null {
  const [textureExists, setTextureExists] = useState<boolean | null>(null)

  useEffect(() => {
    fetch(path)
      .then((response) => {
        setTextureExists(response.ok)
        if (!response.ok) {
          console.warn(`Texture not found: ${path}`)
        }
      })
      .catch((error) => {
        console.error(`Error fetching texture: ${path}`, error)
        setTextureExists(false)
      })
  }, [path])

  const texture = useLoader(THREE.TextureLoader, textureExists ? path : "/placeholder.png")

  useEffect(() => {
    if (texture) {
      texture.encoding = THREE.sRGBEncoding
      texture.needsUpdate = true
    }
  }, [texture])

  return textureExists ? texture : null
}

