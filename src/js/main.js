import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';
import { createScene, createCamera, createRenderer, addLights } from './scene.js';
import { createCube } from './cube.js';
import { setupInteractions } from './interactions.js';
import { updateContent } from './content.js';
import { faceContents, faceLinks } from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const isMobile = window.matchMedia('(max-width: 768px)').matches || ('ontouchstart' in window);
  const cubeSize = isMobile ? 1.5 : 1;
  const wireframeScale = isMobile ? cubeSize / 2 : 0.5;

  const cubeContainer = document.getElementById('cube-container');
  const scene = createScene();
  const camera = createCamera(cubeContainer);
  camera.position.z = isMobile ? 2.5 : 2;
  const renderer = createRenderer(cubeContainer);
  addLights(scene);

  const video = document.createElement('video');
  video.src = '../assets/cube_texture.mp4';
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.play();

  const { cube, wireframe, glowWireframe } = createCube(scene, video, cubeSize, wireframeScale, isMobile);

  const faceNormals = [
    new THREE.Vector3(1, 0, 0),  // right
    new THREE.Vector3(-1, 0, 0), // left
    new THREE.Vector3(0, 1, 0),  // top
    new THREE.Vector3(0, -1, 0), // bottom
    new THREE.Vector3(0, 0, 1),  // front
    new THREE.Vector3(0, 0, -1)  // back
  ];

  let currentFrontFace = 0;
  function getFrontFace() {
    const viewDir = new THREE.Vector3(0, 0, -1);
    let maxDot = -1;
    let frontFaceIndex = 0;
    faceNormals.forEach((normal, index) => {
      const transformedNormal = normal.clone().applyQuaternion(cube.quaternion);
      const dot = transformedNormal.dot(viewDir);
      if (dot > maxDot) {
        maxDot = dot;
        frontFaceIndex = index;
      }
    });
    return frontFaceIndex;
  }

  let verticalIndex = 0;
  let horizontalIndexY = 0;
  let horizontalIndexZ = 0;
  let currentRotX = 0, currentRotY = 0, currentRotZ = 0;
  let targetRotX = 0, targetRotY = 0, targetRotZ = 0;
  let isAnimating = false;

  const toRad = deg => deg * Math.PI / 180;
  const lerpSpeed = 0.1;

  function rotateCube(direction) {
    if (isAnimating) return;
    if (direction === 'up') {
      verticalIndex++;
      targetRotX = -90 * verticalIndex;
    } else if (direction === 'down') {
      verticalIndex--;
      targetRotX = -90 * verticalIndex;
    } else if (direction === 'left') {
      if (verticalIndex % 2 === 0) {
        horizontalIndexY++;
        targetRotY = 90 * horizontalIndexY;
      } else {
        horizontalIndexZ--;
        targetRotZ = 90 * horizontalIndexZ;
      }
    } else if (direction === 'right') {
      if (verticalIndex % 2 === 0) {
        horizontalIndexY--;
        targetRotY = 90 * horizontalIndexY;
      } else {
        horizontalIndexZ++;
        targetRotZ = 90 * horizontalIndexZ;
      }
    }
    isAnimating = true;
  }

  function updateScene() {
    let animating = false;
    if (Math.abs(currentRotX - targetRotX) > 0.1) {
      currentRotX += (targetRotX - currentRotX) * lerpSpeed;
      animating = true;
    } else {
      currentRotX = targetRotX;
    }
    if (Math.abs(currentRotY - targetRotY) > 0.1) {
      currentRotY += (targetRotY - currentRotY) * lerpSpeed;
      animating = true;
    } else {
      currentRotY = targetRotY;
    }
    if (Math.abs(currentRotZ - targetRotZ) > 0.1) {
      currentRotZ += (targetRotZ - currentRotZ) * lerpSpeed;
      animating = true;
    } else {
      currentRotZ = targetRotZ;
    }

    isAnimating = animating;
    if (!isAnimating) {
      const newFrontFace = getFrontFace();
      if (newFrontFace !== currentFrontFace) {
        currentFrontFace = newFrontFace;
        updateContent(newFrontFace);
      }
    }

    cube.rotation.set(toRad(currentRotX), toRad(currentRotY), toRad(currentRotZ));
    wireframe.rotation.set(toRad(currentRotX), toRad(currentRotY), toRad(currentRotZ));
    glowWireframe.rotation.set(toRad(currentRotX), toRad(currentRotY), toRad(currentRotZ));

    renderer.render(scene, camera);
    requestAnimationFrame(updateScene);
  }

  setupInteractions(cube, camera, renderer, faceLinks, rotateCube, isMobile);

  window.addEventListener('resize', () => {
    const w = cubeContainer.clientWidth;
    const h = cubeContainer.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  updateContent(currentFrontFace);
  requestAnimationFrame(updateScene);
});
