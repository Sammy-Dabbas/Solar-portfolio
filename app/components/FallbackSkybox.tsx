"use client"

import { BackSide } from "three"
import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import * as THREE from "three"

export function FallbackSkybox() {
  const { scene } = useThree()

  useEffect(() => {
    // Store the original background
    const originalBackground = scene.background

    // Create a black background
    const geometry = new THREE.SphereGeometry(1000, 32, 32)
    const material = new THREE.ShaderMaterial({
      side: BackSide,
      uniforms: {
        topColor: { value: new THREE.Color(0x000000) }, // Black for top
        bottomColor: { value: new THREE.Color(0x000000) }, // Black for bottom
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(0.0, h)), 1.0);
        }
      `,
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    // Cleanup
    return () => {
      scene.remove(mesh)
      geometry.dispose()
      material.dispose()
      // Restore original background
      scene.background = originalBackground
    }
  }, [scene])

  return null
}

