import { Clone, Environment, Html, OrbitControls, PerspectiveCamera, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useBox, Physics, useSphere } from '@react-three/cannon';
import { useConfigurator } from './components/Configurator';
import UI from './UI.JSX';
import { Debug } from '@react-three/cannon';


function Feather(props) {
  const { nodes, materials } = useGLTF('/3_great_feathers_pack.glb');
  const { height, simulationStarted, gravity, vacuum } = useConfigurator();

  const initialPosition = [props.position[0], props.position[1], props.position[2]];
  const [position, setPosition] = useState(initialPosition);
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));

  const tableHeight = 9.8 - height;

  useFrame((state, delta) => {
    if (!props.simulationStarted) return;

    const gravityForce = gravity * (1 - height / 10000);

    const dragForce = !vacuum
      ? 0.5 * 1.225 * 1.2 * 0.001 * velocity.lengthSq()
      : 0;

    const acceleration = gravityForce - dragForce / 0.0008;

    const newVelocity = velocity.clone();
    newVelocity.y -= acceleration * delta;

    const newPosition = position.slice();
    newPosition[1] += newVelocity.y * delta;

    if (newPosition[1] <= tableHeight) {
      newPosition[1] = tableHeight;
      newVelocity.y = 0;
    }

    setPosition(newPosition);
    setVelocity(newVelocity);
  });

  const meshMaterial = props.simulationStarted
    ? new THREE.MeshBasicMaterial({ color: 'white', wireframe: true })
    : materials.sparrow;

  return (
    <group position={position} scale={3}>
      <mesh
        position={[-0.07, 0.2, 1]}
        castShadow
        receiveShadow
        geometry={nodes.Object_6.geometry}
        material={meshMaterial}
        rotation={[0, 0, 0]}
      />
    </group>
  );
}


function Sfera(props) {
  const { nodes, materials } = useGLTF('/xxr_sphere_12.13.19.glb');
  const { gravity, height, vacuum } = useConfigurator();
  const [velocity, setVelocity] = useState(new THREE.Vector3(0, 0, 0));
  const initialPosition = [props.position[0], props.position[1], props.position[2]];

  const [position, setPosition] = useState(initialPosition);

  const tableHeight = 11.3 - height;

  useFrame((state, delta) => {
    if (!props.simulationStarted) return;

    const gravityForce = gravity * (1 - height / 10000);
    const dragForce = !vacuum
      ? 0.5 * 1.225 * 0.47 * 0.00785 * velocity.lengthSq()
      : 0;

    const acceleration = gravityForce - dragForce / 0.8;

    const newVelocity = velocity.clone();
    newVelocity.y -= acceleration * delta;

    const newPosition = position.slice();
    newPosition[1] += newVelocity.y * delta;

    if (newPosition[1] <= tableHeight) {
      newPosition[1] = tableHeight;
      newVelocity.y = 0;
    }

    setPosition(newPosition);
    setVelocity(newVelocity);
  });

  const meshMaterial = props.simulationStarted
    ? new THREE.MeshBasicMaterial({ color: 'white', wireframe: true })
    : materials['Material.003'];

  return (
    <group position={position} dispose={null}>
      <mesh
        position={[0, -1.6, 0]}
        castShadow
        receiveShadow
        geometry={nodes.Object_2.geometry}
        material={meshMaterial}
        rotation={[-Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

function Glass(props) {
  const { nodes, materials } = useGLTF('/glass_shelf.glb');

  return (
    <group scale={[15, 50, 20]}>
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh
          position={[0, 0.03, -0.46]}
          castShadow
          receiveShadow
          geometry={nodes.Object_3.geometry}
          material={materials.material_1}
        />
      </group>
    </group>
  );
}


function CameraAnimation({ simulationStarted }) {
  const { camera } = useThree();
  const { gravity, height, vacuum, setMovementTime, setMovementTime2 } = useConfigurator();
  const targetPosition = new THREE.Vector3(0, 13 - height, 20);
  const originalPosition = new THREE.Vector3(0, 30, 20);
  const originaltarget = new THREE.Vector3(0, 30, 25);
  const velocity = new THREE.Vector3(0, 0, 0);
  const clock = useRef(new THREE.Clock());
  const [movementStartTime, setMovementStartTime] = useState(null);
  const [movementEndTime, setMovementEndTime] = useState(null);

  useFrame((state, delta) => {
    if (simulationStarted) {
      if (movementStartTime === null) {
        setMovementStartTime(clock.current.getElapsedTime());
      }
      const gravityForce = gravity * (1 - height / 10000);
      const dragForce = !vacuum
        ? 0.5 * 1.225 * 0.47 * 0.00785 * velocity.lengthSq()
        : 0;

      const acceleration = gravityForce - dragForce / 0.8;

      velocity.y -= acceleration * delta;

      if (Math.abs(camera.position.y - targetPosition.y) < 10) {
        camera.position.lerp(targetPosition, 0.01);
      }
      else if (Math.abs(camera.position.y - targetPosition.y) >= 10) {
        camera.position.y += velocity.y * delta;
      }
      if (Math.abs(camera.position.y - targetPosition.y) < 0.1) {
        if (movementEndTime === null) {
          setMovementEndTime(clock.current.getElapsedTime());
        }
      }
    }
    else {
      setMovementStartTime(null);
      setMovementEndTime(null);
      camera.lookAt(originalPosition);
      camera.position.lerp(originaltarget, 0.02);
    }
  });

  function timeWithDrag(mass, gravity, k, height) {
    const sqrtMass = Math.sqrt(mass);
    const sqrtGravityK = Math.sqrt(gravity * k);
    const expTerm = Math.exp((k / mass) * height);
    const coshInverse = Math.log(expTerm + Math.sqrt(expTerm ** 2 - 1)); // cosh^-1(x) = ln(x + sqrt(x^2 - 1))
    return (sqrtMass / sqrtGravityK) * coshInverse;
  }
  

  useEffect(() => {
    if (simulationStarted && movementStartTime !== null && movementEndTime !== null) {
      if(!vacuum){
        setMovementTime(timeWithDrag(0.8, gravity, 0.02259, height + 10));
        setMovementTime2(timeWithDrag(0.0008, gravity, 0.000735, height + 10));
      }
      else{
        setMovementTime(Math.sqrt(2 * height / gravity));
        setMovementTime2(Math.sqrt(2 * height / gravity));
      }
    }
  }, [simulationStarted, movementStartTime, movementEndTime]);
  
  return null;
}

export function Table(props) {
  const { nodes, materials } = useGLTF('/industrial_table.glb');
  const { height } = useConfigurator();

  return (
    <group position={[0, -height, 0]} dispose={null} scale={15}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_4.geometry}
        material={materials.Table_wood_1}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Object_5.geometry}
        material={materials.Old_Steel}
      />
    </group>
  );
}

export default function App() {
  const { startSimulation, setStartSimulation } = useConfigurator();
  const [backgroundColor, setBackgroundColor] = useState(new THREE.Color('white'));
  const { gravity, height } = useConfigurator();


  useEffect(() => {
    if (startSimulation) {
      setBackgroundColor(new THREE.Color('black'));
    } else {
      setBackgroundColor(new THREE.Color('white'));
    }
  }, [startSimulation]);

  useEffect(() => {
    console.log('Start Simulation:', startSimulation);
  }, [startSimulation]);

  return (
    <>
      <div className='absolute w-full h-full'>
        <Canvas style={{ width: '100vw', height: '100vh', backgroundColor: backgroundColor.getStyle() }}>
          <ambientLight />
          <directionalLight position={[0, 10, 0]} />
          <PerspectiveCamera makeDefault fov={75} near={0.1} far={1000} />
          <CameraAnimation simulationStarted={startSimulation} />
          {!startSimulation && <Glass />}
          <Sfera position={[4, 20.6, 1]} simulationStarted={startSimulation} />
          <Feather position={[-4, 19.6, 0]} simulationStarted={startSimulation} />
          <Table position={[0, -15, 0]} simulationStarted={startSimulation} />
        </Canvas>
        <UI />
      </div>
    </>
  );
}
