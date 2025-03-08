"use client"

import type React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { SolarSystem } from "./SolarSystem"
import type * as THREE from "three"

interface ProjectData {
  title: string
  description: string
  link: string
  technologies: string[]
}

interface ThreeCanvasProps {
  activeProject: ProjectData | null
  onProjectSelect: (project: ProjectData | null, position: THREE.Vector3) => void
  controlsRef: React.RefObject<any>
}

export default function ThreeCanvas({ activeProject, onProjectSelect, controlsRef }: ThreeCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 200, 600], fov: 60, far: 10000 }}
      onCreated={({ gl }) => {
        gl.setPixelRatio(window.devicePixelRatio)
      }}
    >
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        rotateSpeed={0.5}
        minDistance={100}
        maxDistance={1500}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.9}
      />
      <SolarSystem onProjectSelect={onProjectSelect} controlsRef={controlsRef} isActive={activeProject !== null} />
    </Canvas>
  )
}

