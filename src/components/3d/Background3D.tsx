import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useSettingsStore } from '../../stores/useSettingsStore';

// Font URL for 3D Text rendering (helvetiker font standard format)
const FONT_URL = 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json';

interface FloatingCubeProps {
  position: [number, number, number];
  rotationSpeed: [number, number, number];
  value: string;
  color: string;
}

const FloatingCube: React.FC<FloatingCubeProps> = ({
  position,
  rotationSpeed,
  value,
  color,
}) => {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed[0] * delta;
      meshRef.current.rotation.y += rotationSpeed[1] * delta;
      meshRef.current.rotation.z += rotationSpeed[2] * delta;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1.2} position={position}>
      <group ref={meshRef}>
        {/* Glowing 3D Glass Box */}
        <mesh>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshPhysicalMaterial
            color={color}
            roughness={0.2}
            metalness={0.1}
            transmission={0.6}
            thickness={1.2}
            transparent
            opacity={0.7}
            wireframe={false}
          />
        </mesh>
        {/* Wireframe Outline */}
        <mesh>
          <boxGeometry args={[1.62, 1.62, 1.62]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
        </mesh>
      </group>
    </Float>
  );
};

const ParticleMatrix: React.FC<{ color: string }> = ({ color }) => {
  const count = 120;
  const particlesRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const baseColor = new THREE.Color(color);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 35;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;

      col[i * 3] = baseColor.r;
      col[i * 3 + 1] = baseColor.g;
      col[i * 3 + 2] = baseColor.b;
    }
    return [pos, col];
  }, [color]);

  useFrame((_, delta) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.03 * delta;
      particlesRef.current.rotation.x += 0.01 * delta;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const Background3D: React.FC = () => {
  const { theme, reducedMotion } = useSettingsStore();

  const themeColors = useMemo(() => {
    switch (theme) {
      case 'cyberpunk': return { primary: '#06B6D4', secondary: '#EC4899', cubes: '#8B5CF6' };
      case 'neon': return { primary: '#EC4899', secondary: '#06B6D4', cubes: '#3B82F6' };
      case 'galaxy': return { primary: '#8B5CF6', secondary: '#C084FC', cubes: '#6366F1' };
      case 'retro': return { primary: '#10B981', secondary: '#F59E0B', cubes: '#059669' };
      case 'light': return { primary: '#3B82F6', secondary: '#F59E0B', cubes: '#60A5FA' };
      default: return { primary: '#3B82F6', secondary: '#8B5CF6', cubes: '#06B6D4' };
    }
  }, [theme]);

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-br from-[#0A0D14] via-[#121824] to-[#0A0D14]" />
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color={themeColors.primary} />
        <pointLight position={[-10, -10, -10]} intensity={1} color={themeColors.secondary} />

        <FloatingCube position={[-6, 4, -4]} rotationSpeed={[0.3, 0.4, 0.1]} value="2048" color={themeColors.primary} />
        <FloatingCube position={[6, -4, -6]} rotationSpeed={[0.2, 0.5, 0.2]} value="1024" color={themeColors.secondary} />
        <FloatingCube position={[-7, -3, -5]} rotationSpeed={[0.4, 0.2, 0.3]} value="512" color={themeColors.cubes} />
        <FloatingCube position={[7, 5, -8]} rotationSpeed={[0.1, 0.3, 0.4]} value="4096" color={themeColors.primary} />

        <ParticleMatrix color={themeColors.primary} />
      </Canvas>
    </div>
  );
};
