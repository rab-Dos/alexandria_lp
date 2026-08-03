const THREE_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';

type ThreeWindow = Window & typeof globalThis & { THREE?: any };
type IdleWindow = Window & typeof globalThis & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
};

let threePromise: Promise<any> | null = null;

function loadThree(): Promise<any> {
  const browserWindow = window as ThreeWindow;
  if (browserWindow.THREE) return Promise.resolve(browserWindow.THREE);
  if (threePromise) return threePromise;

  threePromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = THREE_CDN_URL;
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => browserWindow.THREE
      ? resolve(browserWindow.THREE)
      : reject(new Error('Three.js no quedó disponible después de cargar el recurso.'));
    script.onerror = () => reject(new Error('No fue posible cargar Three.js.'));
    document.head.appendChild(script);
  });

  return threePromise;
}

function waitForIdle(): Promise<void> {
  return new Promise((resolve) => {
    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      idleWindow.requestIdleCallback(resolve, { timeout: 500 });
    } else {
      window.setTimeout(resolve, 0);
    }
  });
}

export async function initFooterGlobe(container: HTMLElement): Promise<void> {
  if (container.dataset.initialized === 'true') return;
  container.dataset.initialized = 'true';

  const THREE = await loadThree();
  await waitForIdle();

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x040506, 0.025);

  const getSize = () => ({
    width: Math.max(container.offsetWidth, 1),
    height: Math.max(container.offsetHeight, 1),
  });
  const initialSize = getSize();
  const camera = new THREE.PerspectiveCamera(60, initialSize.width / initialSize.height, 0.1, 1000);
  camera.position.z = 16;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(initialSize.width, initialSize.height);
  container.appendChild(renderer.domElement);

  const globeGroup = new THREE.Group();
  globeGroup.position.y = -14;
  globeGroup.rotation.z = 0.4;
  scene.add(globeGroup);

  const radius = 12;
  const geometry = new THREE.IcosahedronGeometry(radius, 2);
  const positions = geometry.attributes.position.array;
  const vertexCount = positions.length / 3;

  const nodeCanvas = document.createElement('canvas');
  nodeCanvas.width = 32;
  nodeCanvas.height = 32;
  const nodeContext = nodeCanvas.getContext('2d');
  if (!nodeContext) return;
  const nodeGradient = nodeContext.createRadialGradient(16, 16, 0, 16, 16, 16);
  nodeGradient.addColorStop(0, 'rgba(255,255,255,1)');
  nodeGradient.addColorStop(0.2, 'rgba(0,136,255,0.8)');
  nodeGradient.addColorStop(0.5, 'rgba(0,91,181,0.2)');
  nodeGradient.addColorStop(1, 'rgba(0,0,0,0)');
  nodeContext.fillStyle = nodeGradient;
  nodeContext.fillRect(0, 0, 32, 32);
  const nodeTexture = new THREE.CanvasTexture(nodeCanvas);

  globeGroup.add(new THREE.Points(
    geometry,
    new THREE.PointsMaterial({
      size: 0.8,
      map: nodeTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff,
    }),
  ));

  const linePositions: number[] = [];
  const thresholdSquared = 6.5 ** 2;
  for (let i = 0; i < vertexCount; i++) {
    for (let j = i + 1; j < vertexCount; j++) {
      const dx = positions[i * 3] - positions[j * 3];
      const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
      const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
      if (dx * dx + dy * dy + dz * dz < thresholdSquared) {
        linePositions.push(
          positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
          positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
        );
      }
    }
  }

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  globeGroup.add(new THREE.LineSegments(
    lineGeometry,
    new THREE.LineBasicMaterial({
      color: 0x005bb5,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    }),
  ));

  const textCanvas = document.createElement('canvas');
  textCanvas.width = 2560;
  textCanvas.height = 128;
  const textContext = textCanvas.getContext('2d');
  if (!textContext) return;
  textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);
  textContext.font = '600 55px Inter, monospace';
  textContext.fillStyle = '#38bdf8';
  textContext.textAlign = 'center';
  textContext.textBaseline = 'middle';
  textContext.shadowColor = '#0284c7';
  textContext.shadowBlur = 18;
  const ribbonText = '[ { < A > } ]';
  for (let i = 0; i < 6; i++) {
    textContext.fillText(ribbonText, (i * 2560 / 6) + (2560 / 12), 64);
  }

  const textTexture = new THREE.CanvasTexture(textCanvas);
  textTexture.wrapS = THREE.RepeatWrapping;
  const textRing = new THREE.Mesh(
    new THREE.CylinderGeometry(13.5, 13.5, 3, 64, 1, true),
    new THREE.MeshBasicMaterial({
      map: textTexture,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );

  const orbitGroup = new THREE.Group();
  orbitGroup.position.y = globeGroup.position.y;
  orbitGroup.rotation.x = -0.65;
  orbitGroup.rotation.z = 0.15;
  orbitGroup.add(textRing);
  scene.add(orbitGroup);

  let mouseX = 0;
  let mouseY = 0;
  container.addEventListener('mousemove', (event) => {
    const bounds = container.getBoundingClientRect();
    mouseX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
    mouseY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 3;
  }, { passive: true });

  let resizeRaf: number | null = null;
  window.addEventListener('resize', () => {
    if (resizeRaf !== null) return;
    resizeRaf = requestAnimationFrame(() => {
      const size = getSize();
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
      renderer.setSize(size.width, size.height);
      resizeRaf = null;
    });
  }, { passive: true });

  let rafId: number | null = null;
  let lastFrameTime = 0;
  let isVisible = false;
  const frameInterval = 1000 / 30;

  const render = (): void => {
    camera.lookAt(0, -4, 0);
    renderer.render(scene, camera);
  };

  const loop = (timestamp: number): void => {
    rafId = requestAnimationFrame(loop);
    const elapsed = timestamp - lastFrameTime;
    if (elapsed < frameInterval) return;
    const frameScale = Math.min(elapsed / (1000 / 60), 2.5);
    lastFrameTime = timestamp - (elapsed % frameInterval);
    globeGroup.rotation.y += 0.001 * frameScale;
    globeGroup.rotation.x += 0.0005 * frameScale;
    textRing.rotation.y += 0.003 * frameScale;
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    render();
  };

  const shouldAnimate = (): boolean => isVisible && document.visibilityState === 'visible';
  const start = (): void => {
    if (rafId !== null || !shouldAnimate()) return;
    lastFrameTime = performance.now() - frameInterval;
    rafId = requestAnimationFrame(loop);
  };
  const stop = (): void => {
    if (rafId === null) return;
    cancelAnimationFrame(rafId);
    rafId = null;
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    isVisible = entry.isIntersecting;
    if (shouldAnimate()) start();
    else stop();
  }, { threshold: 0.01 });
  visibilityObserver.observe(container);

  document.addEventListener('visibilitychange', () => {
    if (shouldAnimate()) start();
    else stop();
  });

  render();
}
