import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.155.0/build/three.module.js';

export function setupInteractions(cube, camera, renderer, faceLinks, rotateCube, isMobile) {
  const swipeThreshold = 75;
  const touchMult = 2;
  const deadZone = 10;

  let accumulatedDeltaX = 0;
  let accumulatedDeltaY = 0;
  let lockedAxis = null;
  let lastX = 0, lastY = 0;

  function onWheel(e) {
    e.preventDefault();
    const deltaX = e.deltaX || 0;
    const deltaY = e.deltaY || 0;

    if (e.shiftKey) {
      accumulatedDeltaX += deltaX;
      accumulatedDeltaY = 0;
    } else {
      if (Math.abs(deltaY) >= Math.abs(deltaX)) {
        accumulatedDeltaY += deltaY;
        accumulatedDeltaX = 0;
      } else {
        accumulatedDeltaX += deltaX;
        accumulatedDeltaY = 0;
      }
    }

    if (Math.abs(accumulatedDeltaX) > swipeThreshold) {
      rotateCube(accumulatedDeltaX > 0 ? 'right' : 'left');
      accumulatedDeltaX = 0;
      accumulatedDeltaY = 0;
      lockedAxis = null;
    } else if (Math.abs(accumulatedDeltaY) > swipeThreshold) {
      rotateCube(accumulatedDeltaY > 0 ? 'up' : 'down');
      accumulatedDeltaX = 0;
      accumulatedDeltaY = 0;
      lockedAxis = null;
    }
  }

  function onTouchStart(e) {
    lastX = e.touches[0].clientX;
    lastY = e.touches[0].clientY;
    lockedAxis = null;
    accumulatedDeltaX = 0;
    accumulatedDeltaY = 0;
  }

  function onTouchMove(e) {
    e.preventDefault();
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = lastX - currentX;
    const deltaY = lastY - currentY;

    if (!lockedAxis && (Math.abs(deltaX) > deadZone || Math.abs(deltaY) > deadZone)) {
      lockedAxis = Math.abs(deltaX) >= Math.abs(deltaY) ? 'x' : 'y';
    }

    if (lockedAxis === 'x') {
      accumulatedDeltaX += deltaX * touchMult;
      accumulatedDeltaY = 0;
    } else if (lockedAxis === 'y') {
      accumulatedDeltaY += deltaY * touchMult;
      accumulatedDeltaX = 0;
    }

    if (Math.abs(accumulatedDeltaX) > swipeThreshold) {
      rotateCube(accumulatedDeltaX > 0 ? 'right' : 'left');
      accumulatedDeltaX = 0;
      accumulatedDeltaY = 0;
      lockedAxis = null;
    } else if (Math.abs(accumulatedDeltaY) > swipeThreshold) {
      rotateCube(accumulatedDeltaY > 0 ? 'up' : 'down');
      accumulatedDeltaX = 0;
      accumulatedDeltaY = 0;
      lockedAxis = null;
    }

    lastX = currentX;
    lastY = currentY;
  }

  function onTouchEnd() {
    lockedAxis = null;
    accumulatedDeltaX = 0;
    accumulatedDeltaY = 0;
  }

  if (!isMobile) {
    window.addEventListener('wheel', onWheel, { passive: false });
  } else {
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: false });
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  const cubeContainer = renderer.domElement;

  cubeContainer.addEventListener('click', event => {
    const rect = cubeContainer.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);
    
    console.log('Click detected', { mouseX: mouse.x, mouseY: mouse.y, intersects: intersects.length });
    
    if (intersects.length > 0) {
      const faceIndex = Math.floor(intersects[0].faceIndex / 2);
      console.log('Face clicked:', faceIndex, 'Link:', faceLinks[faceIndex]);
      window.open(faceLinks[faceIndex], '_blank');
    } else {
      console.log('No intersection with cube');
    }
  });
}
