import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

const textureLoader = new THREE.TextureLoader();

const techDetails = [
  { name: "Python", url: "/images/python.webp" },
  { name: "TensorFlow", url: "/images/tensorflow.webp" },
  { name: "PyTorch", url: "/images/pytorch.webp" },
  { name: "Pandas", url: "/images/pandas.webp" },
  { name: "Scikit-Learn", url: "/images/scikit.webp" },
  { name: "Keras", url: "/images/keras.webp" },
  { name: "NumPy", url: "/images/numpy.webp" },
  { name: "SQL Databases", url: "/images/sql.webp" },
  { name: "Power BI", url: "/images/powerbi.webp" },
  { name: "React", url: "/images/react2.webp" },
  { name: "Next.js", url: "/images/next2.webp" },
  { name: "Node.js", url: "/images/node2.webp" },
  { name: "Express.js", url: "/images/express.webp" },
  { name: "MongoDB", url: "/images/mongo.webp" },
  { name: "MySQL", url: "/images/mysql.webp" },
  { name: "TypeScript", url: "/images/typescript.webp" },
  { name: "JavaScript", url: "/images/javascript.webp" },
];

const textures = techDetails.map((tech) => textureLoader.load(tech.url));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

// Shared mouse state for document-level tracking
const mouseState = { x: 0, y: 0 };

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
  techName: string;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
  techName,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -25 * delta * scale,
          -75 * delta * scale,
          -25 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      restitution={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale * 1.15]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
        userData={{ techName }}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport, size } = useThree();

  useFrame(() => {
    if (!isActive) return;
    const ndcX = (mouseState.x / size.width) * 2 - 1;
    const ndcY = -(mouseState.y / size.height) * 2 + 1;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (ndcX * viewport.width) / 2,
        (ndcY * viewport.height) / 2,
        0
      ),
      0.1
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[1.5]} />
    </RigidBody>
  );
}

function RaycasterManager({
  subtitleRef,
  isActive,
}: {
  subtitleRef: React.RefObject<HTMLParagraphElement | null>;
  isActive: boolean;
}) {
  const { raycaster, camera, scene, size } = useThree();
  const lastHovered = useRef<string | null>(null);

  useFrame(() => {
    if (!isActive) {
      if (lastHovered.current !== null) {
        lastHovered.current = null;
        if (subtitleRef.current) {
          subtitleRef.current.innerText = "Move your mouse to interact with my stack";
          subtitleRef.current.style.color = "rgba(234, 229, 236, 0.6)";
        }
      }
      return;
    }

    const ndcX = (mouseState.x / size.width) * 2 - 1;
    const ndcY = -(mouseState.y / size.height) * 2 + 1;

    raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
    const intersects = raycaster.intersectObjects(scene.children, true);

    const intersectedSphere = intersects.find(
      (intersect) =>
        intersect.object.userData && intersect.object.userData.techName
    );

    const currentHovered = intersectedSphere
      ? intersectedSphere.object.userData.techName
      : null;

    if (currentHovered !== lastHovered.current) {
      lastHovered.current = currentHovered;
      if (subtitleRef.current) {
        if (currentHovered) {
          subtitleRef.current.innerText = `Exploring: ${currentHovered}`;
          subtitleRef.current.style.color = "#c2a4ff";
        } else {
          subtitleRef.current.innerText = "Move your mouse to interact with my stack";
          subtitleRef.current.style.color = "rgba(234, 229, 236, 0.6)";
        }
      }
    }
  });

  return null;
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasContainerRef.current) return;
      const rect = canvasContainerRef.current.getBoundingClientRect();
      mouseState.x = e.clientX - rect.left;
      mouseState.y = e.clientY - rect.top;
    };
    document.addEventListener("mousemove", handleMouseMove);

    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const threshold = workEl.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };

    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const spheres = useMemo(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
    const baseCount = techDetails.length;
    const multiplier = isMobile ? 1 : 2;
    const numSpheres = baseCount * multiplier;

    return [...Array(numSpheres)].map((_, i) => ({
      scale:
        [0.4, 0.5, 0.6, 0.7, 0.8][Math.floor(Math.random() * 5)] *
        (isMobile ? 0.75 : 0.95),
      techIndex: i % baseCount,
    }));
  }, []);

  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.15,
          metalness: 0.1,
          roughness: 0.15,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
        })
    );
  }, []);

  return (
    <div className="techstack" ref={canvasContainerRef}>
      <div className="techstack-header">
        <h2>My Techstack</h2>
        <p className="techstack-subtitle" ref={subtitleRef}>
          Move your mouse to interact with my stack
        </p>
      </div>

      <Canvas
        shadows
        gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
        style={{
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        <Physics gravity={[0, 0, 0]}>
          <Pointer isActive={isActive} />
          <RaycasterManager subtitleRef={subtitleRef} isActive={isActive} />
          {spheres.map((props, i) => (
            <SphereGeo
              key={i}
              scale={props.scale}
              material={materials[props.techIndex]}
              isActive={isActive}
              techName={techDetails[props.techIndex].name}
            />
          ))}
        </Physics>
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
        <EffectComposer enableNormalPass={false}>
          <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default TechStack;
