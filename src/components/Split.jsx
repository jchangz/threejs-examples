import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Center,
  OrbitControls,
  Environment,
  Lightformer,
} from "@react-three/drei";

function SplitView(props) {
  const ref1 = useRef();
  const ref2 = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.fov = 120;
    camera.zoom = 10;
    camera.updateProjectionMatrix();
  }, [camera]);

  useFrame(({ gl, camera, size }) => {
    if (gl.autoClear) gl.clear();
    gl.autoClear = false;
    camera.aspect = size.width / 2 / size.height;
    camera.updateProjectionMatrix();
    gl.setScissorTest(true);

    gl.setViewport(0, 0, size.width / 2, size.height);
    gl.setScissor(0, 0, size.width / 2, size.height);
    gl.render(ref1.current, camera);

    gl.setViewport(size.width / 2, 0, size.width / 2, size.height);
    gl.setScissor(size.width / 2, 0, size.width, size.height);
    gl.render(ref2.current, camera);

    gl.setScissorTest(false);

    gl.autoClear = true;
  }, 1);

  return (
    <>
      <Environment backgroundIntensity={2} preset="studio" scene={ref1} />
      <scene ref={ref1}>
        <group {...props} dispose={null}>
          <Center>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="red"
                roughness={0.1}
                metalness={0.5}
              />
            </mesh>
          </Center>
        </group>
      </scene>
      <scene ref={ref2}>
        <group {...props} dispose={null}>
          <Center>
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial
                color="green"
                roughness={0.1}
                metalness={0.5}
              />
            </mesh>
          </Center>
        </group>
      </scene>
      <Environment backgroundIntensity={2} preset="studio" scene={ref2}>
        <Lightformer
          form="ring"
          color="white"
          intensity={3}
          scale={100}
          position={[-15, 4, -18]}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}

export default function SplitComponent() {
  return (
    <div className="three-scene bg-[#0000ff] h-screen relative m-auto">
      <Canvas
        shadows
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        camera={{ position: [4, -1, 8], fov: 35 }}
      >
        <Suspense fallback={null}>
          <SplitView />
          <OrbitControls
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 1.9}
            makeDefault
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
