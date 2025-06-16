"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, Float, Environment } from "@react-three/drei"
import * as THREE from "three"
import { EffectComposer, Bloom } from "@react-three/postprocessing"

function Brain({ position = [0, 0, 0], scale = 1 }) {
  const mesh = useRef<THREE.Mesh>(null!)
  const { scene } = useThree()

  // Create a simple brain-like structure
  useEffect(() => {
    const geometry = new THREE.SphereGeometry(1.5, 32, 32)
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#8B5CF6"),
      roughness: 0.2,
      metalness: 0.8,
      emissive: new THREE.Color("#8B5CF6").multiplyScalar(0.2),
    })

    const brain = new THREE.Mesh(geometry, material)
    brain.position.set(...position)
    brain.scale.set(scale, scale, scale)

    // Add some "neural connections"
    const connectionCount = 50
    const connectionGroup = new THREE.Group()

    for (let i = 0; i < connectionCount; i++) {
      const startPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      )

      const endPoint = new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3,
      )

      const curve = new THREE.LineCurve3(startPoint, endPoint)
      const tubeGeometry = new THREE.TubeGeometry(curve, 20, 0.02, 8, false)
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#EC4899"),
        emissive: new THREE.Color("#EC4899").multiplyScalar(0.5),
        roughness: 0.3,
        metalness: 0.7,
      })

      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial)
      connectionGroup.add(tube)
    }

    // Add some "nodes"
    const nodeCount = 30
    const nodeGroup = new THREE.Group()

    for (let i = 0; i < nodeCount; i++) {
      const nodeGeometry = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 16, 16)
      const nodeMaterial = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#EC4899"),
        emissive: new THREE.Color("#EC4899").multiplyScalar(0.5),
        roughness: 0.3,
        metalness: 0.7,
      })

      const node = new THREE.Mesh(nodeGeometry, nodeMaterial)
      node.position.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3, (Math.random() - 0.5) * 3)
      nodeGroup.add(node)
    }

    mesh.current.add(connectionGroup)
    mesh.current.add(nodeGroup)

    return () => {
      connectionGroup.clear()
      nodeGroup.clear()
    }
  }, [position, scale])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    mesh.current.rotation.y = Math.sin(t / 4) * 0.3
    mesh.current.rotation.x = Math.cos(t / 4) * 0.2
  })

  return <mesh ref={mesh} />
}

function FloatingThoughts() {
  const thoughts = useRef<THREE.Group>(null!)

  useEffect(() => {
    const thoughtCount = 15

    for (let i = 0; i < thoughtCount; i++) {
      const size = 0.2 + Math.random() * 0.3
      const geometry = new THREE.SphereGeometry(size, 16, 16)
      const material = new THREE.MeshStandardMaterial({
        color: new THREE.Color(Math.random() > 0.5 ? "#8B5CF6" : "#EC4899"),
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7,
      })

      const thought = new THREE.Mesh(geometry, material)
      thought.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)

      // Store animation parameters in userData
      thought.userData = {
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        amplitude: 0.5 + Math.random() * 1,
        direction: Math.random() > 0.5 ? 1 : -1,
      }

      thoughts.current.add(thought)
    }

    return () => {
      while (thoughts.current?.children.length) {
        thoughts.current.remove(thoughts.current.children[0])
      }
    }
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    thoughts.current.children.forEach((thought: any) => {
      const { speed, offset, amplitude, direction } = thought.userData

      thought.position.y += Math.sin(t * speed + offset) * 0.01 * direction
      thought.rotation.x = Math.sin(t * speed * 0.5 + offset) * 0.2
      thought.rotation.z = Math.cos(t * speed * 0.5 + offset) * 0.2
    })
  })

  return <group ref={thoughts} />
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#EC4899" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Brain position={[0, 0, 0]} scale={1} />
      </Float>

      <FloatingThoughts />

      <Environment preset="night" />

      <EffectComposer>
        <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
    </>
  )
}

export function HeroScene() {
  return (
    <div className="absolute inset-0">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
