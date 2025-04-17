import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

export function createCube(scene, video, cubeSize, wireframeScale, isMobile) {
  const videoTexture = new THREE.VideoTexture(video);
  videoTexture.minFilter = THREE.LinearFilter;
  videoTexture.magFilter = THREE.LinearFilter;
  videoTexture.format = THREE.RGBAFormat;
  const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

  const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
  const cubeMaterials = Array(6).fill(videoMaterial);
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
  scene.add(cube);

  const neonColor = new THREE.Color('hsl(200, 100%, 60%)');
  const brightMat = new THREE.MeshBasicMaterial({ color: neonColor });
  const edgePositions = [
    [[-wireframeScale, -wireframeScale, -wireframeScale], [wireframeScale, -wireframeScale, -wireframeScale]],
    [[-wireframeScale,  wireframeScale, -wireframeScale], [wireframeScale,  wireframeScale, -wireframeScale]],
    [[-wireframeScale, -wireframeScale,  wireframeScale], [wireframeScale, -wireframeScale,  wireframeScale]],
    [[-wireframeScale,  wireframeScale,  wireframeScale], [wireframeScale,  wireframeScale,  wireframeScale]],
    [[-wireframeScale, -wireframeScale, -wireframeScale], [-wireframeScale,  wireframeScale, -wireframeScale]],
    [[ wireframeScale, -wireframeScale, -wireframeScale], [ wireframeScale,  wireframeScale, -wireframeScale]],
    [[-wireframeScale, -wireframeScale,  wireframeScale], [-wireframeScale,  wireframeScale,  wireframeScale]],
    [[ wireframeScale, -wireframeScale,  wireframeScale], [ wireframeScale,  wireframeScale,  wireframeScale]],
    [[-wireframeScale, -wireframeScale, -wireframeScale], [-wireframeScale, -wireframeScale,  wireframeScale]],
    [[ wireframeScale, -wireframeScale, -wireframeScale], [ wireframeScale, -wireframeScale,  wireframeScale]],
    [[-wireframeScale,  wireframeScale, -wireframeScale], [-wireframeScale,  wireframeScale,  wireframeScale]],
    [[ wireframeScale,  wireframeScale, -wireframeScale], [ wireframeScale,  wireframeScale,  wireframeScale]]
  ];

  const wireframe = new THREE.Group();
  edgePositions.forEach(([start, end]) => {
    const path = new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(...end));
    const tubeGeometry = new THREE.TubeGeometry(path, 1, 0.02, 8, false);
    const mesh = new THREE.Mesh(tubeGeometry, brightMat);
    mesh.raycast = () => {};
    wireframe.add(mesh);
  });
  scene.add(wireframe);

  const glowMat = new THREE.MeshBasicMaterial({ color: neonColor, transparent: true, opacity: 0.4 });
  const glowWireframe = new THREE.Group();
  edgePositions.forEach(([start, end]) => {
    const path = new THREE.LineCurve3(new THREE.Vector3(...start), new THREE.Vector3(...end));
    const tubeGeometry = new THREE.TubeGeometry(path, 1, 0.03, 8, false);
    const mesh = new THREE.Mesh(tubeGeometry, glowMat);
    mesh.raycast = () => {};
    glowWireframe.add(mesh);
  });
  glowWireframe.scale.set(isMobile ? 1.15 : 1.1, isMobile ? 1.15 : 1.1, isMobile ? 1.15 : 1.1);
  scene.add(glowWireframe);

  return { cube, wireframe, glowWireframe };
}
