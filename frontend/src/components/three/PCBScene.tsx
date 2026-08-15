import { Canvas, useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Bounds } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const PALETTE = {
  substrate: "#08301f",
  copper: "#0f766e",
  trace: "#22d3ee",
  silicon: "#111827",
  gold: "#d4a537",
  passive: "#1f2937",
  led: "#00ff9c",
};

function Passive({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.35} />
    </mesh>
  );
}

function LedNode({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.055, 0.055, 0.05, 16]} />
      <meshStandardMaterial
        color={PALETTE.led}
        emissive={PALETTE.led}
        emissiveIntensity={1.4}
        toneMapped={false}
      />
    </mesh>
  );
}

function Board() {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const traces = useMemo(() => {
    const rows: Array<{ position: [number, number, number]; size: [number, number, number] }> = [];
    for (let i = 0; i < 14; i++) {
      const z = -1.5 + i * 0.22;
      rows.push({
        position: [-0.4 + (i % 4) * 0.25, 0.062, z],
        size: [2.2 + (i % 3) * 0.7, 0.014, 0.028],
      });
    }
    for (let i = 0; i < 9; i++) {
      rows.push({
        position: [-1.9 + i * 0.48, 0.062, 0.2],
        size: [0.026, 0.014, 2.4],
      });
    }
    return rows;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;

    pointer.current.x = THREE.MathUtils.lerp(pointer.current.x, state.pointer.x, delta * 2.5);
    pointer.current.y = THREE.MathUtils.lerp(pointer.current.y, state.pointer.y, delta * 2.5);

    const t = state.clock.elapsedTime;

    // Premium Controlled Oscillations:
    // Y-axis rotation: ±15° (0.26 rad) + smooth pointer tilt
    const rotY = Math.sin(t * 0.8) * 0.26 + pointer.current.x * 0.12;
    
    // X-axis rotation: base isometric angle ~25° (-0.44 rad) + ±5° (0.087 rad) oscillation
    const rotX = -0.44 + Math.sin(t * 0.6) * 0.087 + pointer.current.y * 0.12;
    
    // Z-axis slight roll
    const rotZ = Math.cos(t * 0.7) * 0.04;

    group.current.rotation.set(rotX, rotY, rotZ);

    // Breathing scale pulse: 0.86 baseline to leave 15-20% margin inside viewport
    const scale = 0.86 + Math.sin(t * 1.4) * 0.018;
    group.current.scale.set(scale, scale, scale);
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Base Substrate Board (Centered) */}
      <RoundedBox args={[5.2, 0.1, 3.6]} radius={0.05} smoothness={4} receiveShadow>
        <meshStandardMaterial color={PALETTE.substrate} roughness={0.65} metalness={0.25} />
      </RoundedBox>

      {/* Copper Traces */}
      {traces.map((trace, i) => (
        <mesh key={i} position={trace.position}>
          <boxGeometry args={trace.size} />
          <meshStandardMaterial
            color={PALETTE.trace}
            emissive={PALETTE.trace}
            emissiveIntensity={0.35}
            roughness={0.3}
            metalness={0.8}
            polygonOffset
            polygonOffsetFactor={-1}
            polygonOffsetUnits={-1}
          />
        </mesh>
      ))}

      {/* Main SOC Processor */}
      <group position={[-0.55, 0.16, -0.1]}>
        <RoundedBox args={[1.5, 0.18, 1.5]} radius={0.03} smoothness={3} castShadow>
          <meshStandardMaterial color={PALETTE.silicon} roughness={0.35} metalness={0.6} />
        </RoundedBox>
        <mesh position={[0, 0.13, 0]}>
          <boxGeometry args={[1.05, 0.06, 1.05]} />
          <meshStandardMaterial color="#9ca3af" roughness={0.2} metalness={0.95} />
        </mesh>
      </group>

      {/* Secondary MCU */}
      <group position={[1.5, 0.14, -0.85]}>
        <RoundedBox args={[1.0, 0.14, 0.62]} radius={0.02} smoothness={3} castShadow>
          <meshStandardMaterial color={PALETTE.silicon} roughness={0.4} metalness={0.5} />
        </RoundedBox>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh key={i} position={[-0.42 + i * 0.12, 0.0, 0.36]}>
            <boxGeometry args={[0.05, 0.03, 0.12]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={1} roughness={0.25} />
          </mesh>
        ))}
      </group>

      <RoundedBox
        args={[0.7, 0.12, 0.5]}
        radius={0.02}
        smoothness={3}
        position={[1.35, 0.13, 1.0]}
        castShadow
      >
        <meshStandardMaterial color={PALETTE.silicon} roughness={0.42} metalness={0.5} />
      </RoundedBox>

      {[
        [-1.9, 0.12, 1.15],
        [-1.6, 0.12, 1.15],
        [-1.3, 0.12, 1.15],
        [-1.9, 0.12, 0.85],
        [-1.6, 0.12, 0.85],
      ].map((p, i) => (
        <Passive
          key={`r-${i}`}
          position={p as [number, number, number]}
          size={[0.18, 0.07, 0.1]}
          color={PALETTE.passive}
        />
      ))}

      {[
        [0.55, 0.24, 1.15],
        [0.95, 0.24, 1.2],
        [-0.15, 0.24, -1.35],
      ].map((p, i) => (
        <mesh key={`c-${i}`} position={p as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.16, 0.16, 0.36, 20]} />
          <meshStandardMaterial color={PALETTE.copper} metalness={0.8} roughness={0.3} />
        </mesh>
      ))}

      <LedNode position={[2.15, 0.11, 1.45]} />
      <LedNode position={[2.15, 0.11, 1.2]} />
      <LedNode position={[2.15, 0.11, 0.95]} />

      <group position={[0.4, 0.2, -1.55]}>
        <mesh>
          <boxGeometry args={[2.4, 0.2, 0.22]} />
          <meshStandardMaterial color="#0f172a" roughness={0.5} />
        </mesh>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh key={i} position={[-1.13 + i * 0.12, 0.16, 0]}>
            <boxGeometry args={[0.04, 0.16, 0.04]} />
            <meshStandardMaterial color={PALETTE.gold} metalness={1} roughness={0.2} />
          </mesh>
        ))}
      </group>

      <mesh position={[-2.3, 0.24, -0.9]} castShadow>
        <boxGeometry args={[0.6, 0.3, 0.7]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.25} />
      </mesh>

      {/* Gold Solder Pads */}
      {Array.from({ length: 16 }, (_, i) => (
        <mesh key={`pad-${i}`} position={[-2.2 + (i % 8) * 0.62, 0.065, i < 8 ? 1.6 : -1.62]}>
          <cylinderGeometry args={[0.055, 0.055, 0.014, 16]} />
          <meshStandardMaterial
            color={PALETTE.gold}
            metalness={1}
            roughness={0.3}
            polygonOffset
            polygonOffsetFactor={-2}
            polygonOffsetUnits={-2}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function PCBScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      shadows
      camera={{ position: [0, 3.8, 7.8], fov: 46 }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      gl={{
        antialias: true,
        alpha: true,
        logarithmicDepthBuffer: true,
        powerPreference: "high-performance",
      }}
    >
      {/* Soft Ambient Theme Lighting */}
      <ambientLight intensity={0.75} />
      <directionalLight
        position={[5, 8, 4]}
        intensity={1.8}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[1024, 1024]}
      />
      {/* Accent Lights */}
      <pointLight position={[-5, 3, -4]} intensity={45} color="#22d3ee" distance={16} />
      <pointLight position={[4, 2, 4]} intensity={30} color="#32d583" distance={14} />
      <directionalLight position={[-6, 5, -6]} intensity={1.2} color="#7ce7ac" />

      <Bounds fit clip observe margin={1.2}>
        <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.4}>
          <Board />
        </Float>
      </Bounds>
    </Canvas>
  );
}



