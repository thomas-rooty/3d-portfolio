import {useEffect, useRef} from 'react'
import {extend, useFrame, useThree} from '@react-three/fiber'
import {useRaycastVehicle} from '@react-three/cannon'
import {useControls} from '../../utils/useControls'
import Tricycle from './Tricycle'
import Wheel from './Wheel'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

const Vehicle = ({radius = 0.7, width = 1.5, height = -0.04, front = 1.5, back = -0.5, steer = 0.5, force = 1000, maxBrake = 1e5, ...props }) => {
    // Camera
    let camera, gl;
    const controlsCamera = useRef();
    const player = useRef();
    const CameraController = () => {
        extend({OrbitControls});
        return () => {
            ({camera, gl} = useThree());
            camera.position.set([-2, 5, -5]);
            useFrame(() => controlsCamera.current.update());
            return <orbitControls
                ref={controlsCamera}
                args={[camera, gl.domElement]}
                enableZoom={false}
                enableDamping
                enablePan={false}
                enableRotate={false}
                enabled
                castShadow
            />;
        };
    };
    const CameraComponent = CameraController();

    // Tricycle
    const chassis = useRef()
    const wheel1 = useRef()
    const wheel2 = useRef()
    const wheel3 = useRef()
    const wheel4 = useRef()
    const controls = useControls()

    const wheelInfo = {
        radius,
        directionLocal: [0, -1, 0],
        suspensionStiffness: 30,
        suspensionRestLength: 0.3,
        maxSuspensionForce: 1e4,
        maxSuspensionTravel: 0.3,
        dampingRelaxation: 10,
        dampingCompression: 4.4,
        axleLocal: [-1, 0, 0],
        chassisConnectionPointLocal: [1, 0, 1],
        useCustomSlidingRotationalSpeed: true,
        customSlidingRotationalSpeed: -30,
        frictionSlip: 2
    }

    const wheelInfo1 = {...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [-width / 2, height, front]}
    const wheelInfo2 = {...wheelInfo, isFrontWheel: true, chassisConnectionPointLocal: [width / 2, height, front]}
    const wheelInfo3 = {...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [-width / 2, height, back]}
    const wheelInfo4 = {...wheelInfo, isFrontWheel: false, chassisConnectionPointLocal: [width / 2, height, back]}

    const [vehicle, api] = useRaycastVehicle(() => ({
        chassisBody: chassis,
        wheels: [wheel1, wheel2, wheel3, wheel4],
        wheelInfos: [wheelInfo1, wheelInfo2, wheelInfo3, wheelInfo4],
        indexForwardAxis: 2,
        indexRightAxis: 0,
        indexUpAxis: 1
    }))

    const vehiclePosition = useRef([0, 0, 0]);
    useEffect(() => {
        chassis.current.api.position.subscribe(value => vehiclePosition.current = value);
    }, [])

    useFrame(() => {
        // Make the controls follow the vehicle
        controlsCamera.current.target.x = vehiclePosition.current[0];
        controlsCamera.current.target.y = vehiclePosition.current[1];
        controlsCamera.current.target.z = vehiclePosition.current[2];

        // Move camera to vehicle
        camera.position.set(vehiclePosition.current[0], vehiclePosition.current[1] + 4, vehiclePosition.current[2] + 6);

        // Controls steering, braking, and acceleration
        const {forward, backward, left, right, brake, reset} = controls.current
        for (let e = 2; e < 4; e++) api.applyEngineForce(forward || backward ? force * (forward && !backward ? -1 : 1) : 0, 2)
        for (let s = 0; s < 2; s++) api.setSteeringValue(left || right ? steer * (left && !right ? 1 : -1) : 0, s)
        for (let b = 2; b < 4; b++) api.setBrake(brake ? maxBrake : 0, b)
        if (reset) {
            chassis.current.api.position.set(0, 0.5, 0)
            chassis.current.api.velocity.set(0, 0, 0)
            chassis.current.api.angularVelocity.set(0, 0.5, 0)
            chassis.current.api.rotation.set(0, -Math.PI / 4, 0)
        }
    })

    return (
        <>
            <CameraComponent/>
            <group ref={vehicle} position={[0, -0.4, 0]}>
                <Tricycle ref={chassis} rotation={props.rotation} position={props.position}
                          angularVelocity={props.angularVelocity}/>
                <Wheel ref={wheel1} radius={radius} leftSide/>
                <Wheel ref={wheel2} radius={radius}/>
                <Wheel ref={wheel3} radius={radius} leftSide/>
                <Wheel ref={wheel4} radius={radius}/>
            </group>
        </>
    )
}

export default Vehicle
