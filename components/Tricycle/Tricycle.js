import {forwardRef} from 'react'
import {useGLTF} from '@react-three/drei'
import {useBox} from '@react-three/cannon'

useGLTF.preload('/Tricycle.gltf')

// Auto-generated by: https://github.com/pmndrs/gltfjsx
// Model via KrStolorz on Sketchfab, CC-BY-4.0
// https://sketchfab.com/3d-models/low-poly-volkswagen-beetle-f680ad7e98e445eaafed1a70f2c53911
const Tricycle = forwardRef(({args = [1.7, 1, 2.2], mass = 500, ...props}, ref) => {

    // Tricycle
    const {nodes, materials} = useGLTF('/Tricycle.gltf')
    const [, api] = useBox(() => ({
        mass,
        args,
        allowSleep: false,
        onCollide: (e) => console.log('bonk', e.body.userData), ...props
    }), ref)
    return (
        <mesh ref={ref} api={api}>
            <group position={[0, -0.6, 0]} scale={[0.2, 0.2, 0.2]}>
                <primitive object={nodes._rootJoint} />
                <skinnedMesh castShadow geometry={nodes.Object_6.geometry} material={materials.Kids_Toy_TrikeBikeRedMat} skeleton={nodes.Object_6.skeleton} />
                <skinnedMesh castShadow geometry={nodes.Object_7.geometry} material={materials.Kids_Toy_TrikebikeBlackPlasticMat} skeleton={nodes.Object_7.skeleton} />
                <skinnedMesh castShadow geometry={nodes.Object_8.geometry} material={materials.Kids_Toy_TrikebikeBlackMat} skeleton={nodes.Object_8.skeleton} />
                <skinnedMesh castShadow geometry={nodes.Object_9.geometry} material={materials.Kids_Toy_TrikebikeWhiteMat} skeleton={nodes.Object_9.skeleton} />
                <skinnedMesh castShadow geometry={nodes.Object_10.geometry} material={materials.Kids_Toy_TrikebikeTyreMat} skeleton={nodes.Object_10.skeleton} />
            </group>
        </mesh>
    )
})

export default Tricycle
