import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useLoader, useThree } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Helper function to adjust color brightness based on shade (0-100)
function adjustColorBrightness(hexColor, shade) {
  // Ensure hexColor is valid
  const cleanHex = hexColor.startsWith('#') ? hexColor.slice(1) : hexColor;
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanHex)) {
    return hexColor; // Return original if invalid
  }

  // Convert hex to RGB
  const r = parseInt(cleanHex.substr(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substr(2, 2), 16) / 255;
  const b = parseInt(cleanHex.substr(4, 2), 16) / 255;

  // Convert RGB to HSL
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // Achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        h = 0;
    }
    h /= 6;
  }

  // Adjust lightness based on shade (0 to 100 maps to 0 to 1)
  l = shade / 100;

  // Convert HSL back to RGB
  let newR, newG, newB;
  if (s === 0) {
    newR = newG = newB = l; // Achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    newR = hueToRgb(p, q, h + 1 / 3);
    newG = hueToRgb(p, q, h);
    newB = hueToRgb(p, q, h - 1 / 3);
  }

  // Convert RGB back to hex
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
}

function hueToRgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function Room({ room }) {
  const wallTexture = useLoader(THREE.TextureLoader, `/textures/${room.wallTexture || 'patterned_concrete_wall_diff_1k.jpg'}`, (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const floorTexture = useLoader(THREE.TextureLoader, '/textures/wooden_floor_02_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const ceilingTexture = useLoader(THREE.TextureLoader, '/textures/ceiling_tile_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });

  const width = room.width || 10;
  const height = room.height || 5;
  const depth = room.depth || 10;
  const wallColor = room.color || '#f0f0f0';

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -height / 2, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={floorTexture} color={wallColor} roughness={0.6} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height / 2, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshStandardMaterial map={ceilingTexture} color={wallColor} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0, -depth / 2]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0, depth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.5} />
      </mesh>
      <mesh position={[-width / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.5} />
      </mesh>
      <mesh position={[width / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[depth, height]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Chair({ item, roomHeight }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/textures/wood_025_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#8B4513', item.shade || 50);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.1, 1]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.2, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.8, 0.1]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.4, 0.25, -0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.4, 0.25, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 0.25, -0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.4, 0.25, 0.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Table({ item, roomHeight }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/textures/wood_025_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#8B4513', item.shade || 50);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 1.5]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.9, 0.4, -0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[-0.9, 0.4, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 0.4, -0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0.9, 0.4, 0.65]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 16]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Sofa({ item, roomHeight }) {
  const fabricTexture = useLoader(THREE.TextureLoader, '/textures/fabric_001_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#4B0082', item.shade || 30);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.5, 1]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[3, 1, 0.2]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-1.3, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 1]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[1.3, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 1]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Bookshelf({ item, roomHeight }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/textures/wood_025_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#8B4513', item.shade || 50);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 2, 0.5]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.1, 0.5]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function TVStand({ item, roomHeight }) {
  const woodTexture = useLoader(THREE.TextureLoader, '/textures/wood_025_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#2F4F4F', item.shade || 50);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.8, 0.8]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.1, 0.8]} />
        <meshStandardMaterial map={woodTexture} color={color} roughness={0.7} />
      </mesh>
    </group>
  );
}

function Bed({ item, roomHeight }) {
  const fabricTexture = useLoader(THREE.TextureLoader, '/textures/fabric_001_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#4682B4', item.shade || 30);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.4, 4]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.8, -1.8]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.6, 0.4]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-1.1, 0.2, -1.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 0.2, -1.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[-1.1, 0.2, 1.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
      <mesh position={[1.1, 0.2, 1.8]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.4, 16]} />
        <meshStandardMaterial map={fabricTexture} color={color} roughness={0.8} />
      </mesh>
    </group>
  );
}

function Lamp({ item, roomHeight }) {
  const metalTexture = useLoader(THREE.TextureLoader, '/textures/metal_001_diff_1k.jpg', (loader) => {
    loader.setCrossOrigin('anonymous');
  });
  const scale = item.scale || 1;
  const color = adjustColorBrightness(item.color || '#FFD700', item.shade || 70);

  return (
    <group position={[item.x || 0, -roomHeight / 2, item.z || 0]} scale={scale}>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial map={metalTexture} color={color} roughness={0.6} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.4, 0.6, 16]} />
        <meshStandardMaterial map={metalTexture} color={color} roughness={0.6} metalness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#ffffe0" emissive="#ffffe0" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

function Scene({ room, furniture, viewMode, onUpdateFurniture }) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -room.height / 2));
  const [selected, setSelected] = useState(null);
  const furnitureRefs = useRef([]);
  const controlsRef = useRef();

  useEffect(() => {
    furnitureRefs.current = furniture.map(() => React.createRef());
  }, [furniture]);

  useEffect(() => {
    if (viewMode === '2D') {
      camera.position.set(0, 10, 0);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.enableRotate = false;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.update();
      }
    } else {
      camera.position.set(10, 10, 10);
      camera.lookAt(0, 0, 0);
      if (controlsRef.current) {
        controlsRef.current.enableRotate = true;
        controlsRef.current.enableZoom = true;
        controlsRef.current.enablePan = true;
        controlsRef.current.update();
      }
    }
  }, [viewMode, camera]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const intersects = raycaster.current.intersectObjects(
      furnitureRefs.current.map((ref) => ref.current).filter(Boolean),
      true
    );

    if (intersects.length > 0) {
      const index = furniture.findIndex((item) => item.id === intersects[0].object.parent.userData.id);
      if (index !== -1) {
        setSelected(index);
      }
    } else {
      setSelected(null);
    }
  };

  const handleMouseMove = (event) => {
    if (selected === null) return;

    const rect = gl.domElement.getBoundingClientRect();
    mouse.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.current.setFromCamera(mouse.current, camera);
    const point = raycaster.current.ray.intersectPlane(plane.current, new THREE.Vector3());
    if (point) {
      onUpdateFurniture(selected, { x: point.x, z: point.z });
    }
  };

  const handleMouseUp = () => {
    setSelected(null);
  };

  useEffect(() => {
    const domElement = gl.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    domElement.addEventListener('mousemove', handleMouseMove);
    domElement.addEventListener('mouseup', handleMouseUp);

    return () => {
      domElement.removeEventListener('mousedown', handleMouseDown);
      domElement.removeEventListener('mousemove', handleMouseMove);
      domElement.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gl, camera, selected, onUpdateFurniture, room.height]);

  const zoom = Math.max(room.width, room.depth) * 1.5;

  return (
    <>
      {viewMode === '2D' ? (
        <OrthographicCamera
          makeDefault
          position={[0, 10, 0]}
          zoom={50}
          left={-zoom}
          right={zoom}
          top={zoom}
          bottom={-zoom}
          near={0.1}
          far={100}
        />
      ) : (
        <PerspectiveCamera
          makeDefault
          fov={50}
          position={[10, 10, 10]}
          near={0.1}
          far={100}
        />
      )}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.0}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
      />
      <Room room={room} />
      {furniture.map((item, index) => (
        <group key={item.id} ref={furnitureRefs.current[index]} userData={{ id: item.id }}>
          {item.type === 'chair' && <Chair item={item} roomHeight={room.height} />}
          {item.type === 'table' && <Table item={item} roomHeight={room.height} />}
          {item.type === 'sofa' && <Sofa item={item} roomHeight={room.height} />}
          {item.type === 'bookshelf' && <Bookshelf item={item} roomHeight={room.height} />}
          {item.type === 'tvstand' && <TVStand item={item} roomHeight={room.height} />}
          {item.type === 'bed' && <Bed item={item} roomHeight={room.height} />}
          {item.type === 'lamp' && <Lamp item={item} roomHeight={room.height} />}
        </group>
      ))}
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        enableRotate={viewMode === '3D'}
        enableZoom={true}
        enablePan={true}
      />
    </>
  );
}

function DesignCanvas({ room, furniture, viewMode, onUpdateFurniture }) {
  return (
    <Canvas
      style={{ width: 'texture', height: '600px' }}
      shadows
      gl={{ antialias: true }}
    >
      <Scene
        room={room}
        furniture={furniture}
        viewMode={viewMode}
        onUpdateFurniture={onUpdateFurniture}
      />
    </Canvas>
  );
}

export default DesignCanvas;