import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

export function createScene() {
  const scene = new THREE.Scene();
  return scene;
}

export function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  return camera;
}

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);
  return renderer;
}

export function addLights(scene) {
  scene.add(new THREE.AmbientLight(0xffffff, 1));
}
