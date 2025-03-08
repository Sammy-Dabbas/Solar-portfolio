"use client"

import { useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

export function SolarFlares() {
  const flareCount = 50
  const flareGeometry = useMemo(() => {
    const points = []
    for (let i = 0; i < flareCount; i++) {
      const angle = (i / flareCount) * Math.PI * 2
      const radius = 42 // Just outside the sun's radius of 40
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      points.push(new THREE.Vector3(x, y, 0))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  const flareMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(0xffaa00) },
        },
        vertexShader: `
          uniform float time;
          
          void main() {
            vec3 pos = position;
            float angle = atan(position.y, position.x);
            float flareLength = sin(angle * 8.0 + time * 2.0) * 15.0 + 20.0;
            pos *= 1.0 + sin(time + angle * 2.0) * 0.2;
            pos *= flareLength;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 2.0;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          
          void main() {
            float r = length(gl_PointCoord - vec2(0.5));
            if (r > 0.5) discard;
            gl_FragColor = vec4(color, 1.0 - r * 2.0);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )

  useFrame(({ clock }) => {
    flareMaterial.uniforms.time.value = clock.getElapsedTime()
  })

  return (
    <points geometry={flareGeometry} material={flareMaterial}>
      <pointsMaterial size={2} color="#ffaa00" transparent opacity={0.8} />
    </points>
  )
}

