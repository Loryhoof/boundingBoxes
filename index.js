import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLocalPlayer, usePhysics} = metaversefile;

export default () => {
  const app = useApp();
  const physics = usePhysics();
  const localPlayer = useLocalPlayer();

  const geometry = new THREE.BoxGeometry( 5, 20, 5 );
  const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
  const cube = new THREE.Mesh( geometry, material );

  app.add( cube );

  cube.position.copy(app.position);
  cube.quaternion.copy(app.quaternion);

  cube.updateMatrixWorld();

  cube.visible = false;

  const cubeBoundingBox = new THREE.Box3().setFromObject( cube );

  useFrame((timeDiffS) => {

    if(localPlayer && localPlayer.characterController) {

      var avatarBoundingBox = new THREE.Box3();
      avatarBoundingBox.copy( localPlayer.characterController.physicsMesh.geometry.boundingBox );
      avatarBoundingBox.applyMatrix4( localPlayer.characterController.physicsMesh.matrixWorld );

      let windVel = new THREE.Vector3(0,0.01,0);
      const quaternion = new THREE.Quaternion();
      quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI*0.5);

      let result = physics.raycast(localPlayer.position, quaternion);
      
      windVel.y = Math.abs(1/result.distance);

      const flags = physics.moveCharacterController(
          localPlayer.characterController,
          windVel,
          0,
          timeDiffS,
          localPlayer.characterController.position
      );
      
      /*if(cubeBoundingBox.intersectsBox(avatarBoundingBox)) {

        let velocity = new THREE.Vector3(0,0,0);
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI*0.5);

        let result = physics.raycast(localPlayer.position, quaternion);
        
        velocity.z = Math.abs(1/result.distance);
        //console.log(velocity.y);

        const flags = physics.moveCharacterController(
          localPlayer.characterController,
          velocity,
          0,
          timeDiffS,
          localPlayer.characterController.position
        );

      }*/
    }

  });
  
  return app;
};
