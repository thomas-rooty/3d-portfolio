import {extend, useFrame, useThree} from "@react-three/fiber";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {useRef} from "react";

export const CameraController = (basicCameraPos, meshPosition) => {
    extend({OrbitControls});
    return () => {
        const {camera, gl} = useThree();
        const controls = useRef();
        camera.position.set(...basicCameraPos);
        useFrame(() => controls.current.update());
        return <orbitControls
            ref={controls}
            args={[camera, gl.domElement]}
            enableZoom={false}
            enableDamping={true}
            enablePan={false}
            enableRotate={false}
            enabled={true}
            castShadow={true}
            target={meshPosition}
        />;
    };
}