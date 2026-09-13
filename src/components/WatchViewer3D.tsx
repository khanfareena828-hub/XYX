import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Volume2,
  VolumeX,
  Compass,
  Maximize2,
  Clock,
  Timer,
  ChevronRight,
  Info,
  Sparkles,
} from 'lucide-react';
import { WatchEdition, Hotspot } from '../types';
import { buildWatch3DModel } from './Watch3DModel';
import { HOTSPOTS, EXPLODED_LAYERS } from '../data/watches';
import { horologyAudio } from '../utils/audio';

interface WatchViewer3DProps {
  edition: WatchEdition;
  onSelectEdition?: (edition: WatchEdition) => void;
  heightClass?: string;
  enableHotspots?: boolean;
  enableExplodedMode?: boolean;
  showControlsBar?: boolean;
  initialPreset?: 'face' | 'tourbillon' | 'profile' | 'back';
  className?: string;
}

export const WatchViewer3D: React.FC<WatchViewer3DProps> = ({
  edition,
  heightClass = 'h-[500px] sm:h-[620px] lg:h-[700px]',
  enableHotspots = true,
  enableExplodedMode = true,
  showControlsBar = true,
  initialPreset = 'face',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction & Mode states
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isExploded, setIsExploded] = useState(false);
  const [explosionSlider, setExplosionSlider] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [timeMode, setTimeMode] = useState<'live' | 'chrono'>('live');
  const [chronoRunning, setChronoRunning] = useState(false);
  const [chronoElapsed, setChronoElapsed] = useState(0);
  const [activePreset, setActivePreset] = useState<'face' | 'tourbillon' | 'profile' | 'back'>(initialPreset);
  const [isInteracting, setIsInteracting] = useState(false);

  // Refs for 3D engine hooks
  const modelHookRef = useRef<ReturnType<typeof buildWatch3DModel> | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Rotation physics & inertia
  const targetRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRotation = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const previousMouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera lerp target
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 4.4));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Current explosion progress for smooth transition
  const currentExplosion = useRef<number>(0);

  // Camera Presets
  const setPresetView = useCallback((preset: 'face' | 'tourbillon' | 'profile' | 'back') => {
    setActivePreset(preset);
    setActiveHotspot(null);

    switch (preset) {
      case 'face':
        targetCamPos.current.set(0, 0, 4.4);
        targetCamLook.current.set(0, 0, 0);
        targetRotation.current = { x: 0, y: 0 };
        break;
      case 'tourbillon':
        targetCamPos.current.set(0, -0.65, 3.1);
        targetCamLook.current.set(0, -0.49, 0.1);
        targetRotation.current = { x: -0.15, y: 0 };
        break;
      case 'profile':
        targetCamPos.current.set(2.4, 0.3, 3.0);
        targetCamLook.current.set(0, 0, 0);
        targetRotation.current = { x: 0.1, y: 0.85 };
        break;
      case 'back':
        targetCamPos.current.set(0, 0, -4.4);
        targetCamLook.current.set(0, 0, 0);
        targetRotation.current = { x: 0, y: Math.PI };
        break;
    }
  }, []);

  // Hotspot Click
  const handleSelectHotspot = (hs: Hotspot) => {
    setActiveHotspot(hs);
    setIsAutoRotating(false);
    targetCamPos.current.set(hs.cameraPosition[0], hs.cameraPosition[1], hs.cameraPosition[2]);
    targetCamLook.current.set(hs.cameraTarget[0], hs.cameraTarget[1], hs.cameraTarget[2]);
  };

  // Chronograph timer loop
  useEffect(() => {
    let interval: number;
    if (chronoRunning && timeMode === 'chrono') {
      interval = window.setInterval(() => {
        setChronoElapsed((prev) => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [chronoRunning, timeMode]);

  // Audio mute handler
  const toggleAudio = () => {
    const next = !isMuted;
    setIsMuted(next);
    horologyAudio.setMuted(next);
  };

  // Toggle Exploded Calibre Mode
  const toggleExploded = () => {
    const next = !isExploded;
    setIsExploded(next);
    setExplosionSlider(next ? 1 : 0);
    if (next) {
      setIsAutoRotating(false);
      targetCamPos.current.set(1.4, 0.5, 4.8);
      targetCamLook.current.set(0, 0, 0);
    } else {
      setPresetView('face');
    }
  };

  // Update materials when edition prop changes
  useEffect(() => {
    if (modelHookRef.current) {
      modelHookRef.current.updateMaterials(edition);
    }
  }, [edition]);

  // Three.js Mount & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.copy(targetCamPos.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Studio Lighting Setup
    // 1. Warm Key Spotlight
    const keyLight = new THREE.SpotLight(0xfff1db, 2.6);
    keyLight.position.set(4, 6, 5);
    keyLight.angle = Math.PI / 4;
    keyLight.penumbra = 0.5;
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0001;
    scene.add(keyLight);

    // 2. Cool Fill Light (balances shadows)
    const fillLight = new THREE.DirectionalLight(0xbdd0e8, 1.2);
    fillLight.position.set(-5, -2, 4);
    scene.add(fillLight);

    // 3. Golden Rim Light (glints edges and sapphire crystal)
    const rimLight = new THREE.DirectionalLight(0xe8c78c, 2.0);
    rimLight.position.set(0, 4, -5);
    scene.add(rimLight);

    // 4. Tourbillon Accent Light
    const tourbillonLight = new THREE.PointLight(0xffddaa, 1.2, 4);
    tourbillonLight.position.set(0, -0.6, 1.5);
    scene.add(tourbillonLight);

    // 5. Ambient Fill
    const ambientLight = new THREE.AmbientLight(0x28282b, 0.7);
    scene.add(ambientLight);

    // Build 3D Model
    const model = buildWatch3DModel(edition);
    modelHookRef.current = model;
    scene.add(model.parts.rootGroup);

    // Initial preset position
    setPresetView(initialPreset);

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let lastTime = performance.now();

    const animate = (time: number) => {
      animFrameRef.current = requestAnimationFrame(animate);
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Auto rotation
      if (isAutoRotating && !isDragging.current) {
        targetRotation.current.y += delta * 0.25;
      }

      // Smooth inertia rotation interpolation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      model.parts.rootGroup.rotation.x = currentRotation.current.x;
      model.parts.rootGroup.rotation.y = currentRotation.current.y;

      // Smooth camera position interpolation
      camera.position.lerp(targetCamPos.current, 0.06);

      // Camera lookAt smooth lerp
      const currentLook = new THREE.Vector3();
      camera.getWorldDirection(currentLook);
      const targetDir = new THREE.Vector3().subVectors(targetCamLook.current, camera.position).normalize();
      currentLook.lerp(targetDir, 0.08);
      camera.lookAt(camera.position.clone().add(currentLook));

      // Smooth explosion interpolation
      const targetExp = isExploded ? explosionSlider : 0;
      currentExplosion.current += (targetExp - currentExplosion.current) * 0.1;
      model.setExplosionProgress(currentExplosion.current);

      // Mechanical animations (hands, tourbillon, balance wheel, rotor)
      model.updateAnimation(delta, timeMode === 'live', chronoElapsed);

      renderer.render(scene, camera);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, [edition, initialPreset, setPresetView, isAutoRotating, isExploded, explosionSlider, timeMode, chronoElapsed]);

  // Pointer drag event handlers for full 360 degree rotation
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsInteracting(true);
    setIsAutoRotating(false);
    previousMouse.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - previousMouse.current.x;
    const deltaY = e.clientY - previousMouse.current.y;

    targetRotation.current.y += deltaX * 0.008;
    targetRotation.current.x += deltaY * 0.008;

    // Clamp vertical tilt to prevent flipping
    targetRotation.current.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetRotation.current.x));

    previousMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDragging.current = false;
    setIsInteracting(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignored
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY * 0.003;
    const len = targetCamPos.current.length();
    const newLen = Math.max(2.6, Math.min(6.5, len + zoomDelta));
    targetCamPos.current.setLength(newLen);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none bg-[#0B0B0C] ${heightClass} ${className}`}
      onWheel={handleWheel}
    >
      {/* 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing touch-none block"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Subtle Studio Glow Backdrop */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.06)_0%,transparent_70%)]" />

      {/* Top Left: Reference & Craftsmanship Badge */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-10 pointer-events-auto flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] tracking-[0.25em] uppercase font-semibold text-[#C5A059] px-2.5 py-0.5 rounded-xs bg-[#C5A059]/10 border border-[#C5A059]/20">
            {edition.reference}
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#8E8A82]">
            {edition.materials.case}
          </span>
        </div>
        <h3 className="font-serif text-lg sm:text-xl text-[#EDE8E0] font-normal tracking-wide">
          {edition.name}
        </h3>
      </div>

      {/* Top Right: Quick Action Controls */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 flex items-center gap-2">
        {/* Auto Rotate Toggle */}
        <button
          id="btn-toggle-autorotate"
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          title={isAutoRotating ? 'Pause Turntable' : 'Auto Rotate 360°'}
          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
            isAutoRotating
              ? 'bg-[#C5A059]/20 border-[#C5A059]/40 text-[#EDE8E0]'
              : 'bg-[#141416]/80 border-white/10 text-[#8E8A82] hover:text-[#EDE8E0]'
          }`}
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isAutoRotating ? 'animate-spin-slow' : ''}`} />
        </button>

        {/* Mechanical Sound Toggle */}
        <button
          id="btn-toggle-sound"
          onClick={toggleAudio}
          title={isMuted ? 'Listen to Mechanical Escapement' : 'Mute Escapement'}
          className={`p-2.5 rounded-full border transition-all cursor-pointer ${
            !isMuted
              ? 'bg-[#C5A059]/20 border-[#C5A059]/40 text-[#C5A059]'
              : 'bg-[#141416]/80 border-white/10 text-[#8E8A82] hover:text-[#EDE8E0]'
          }`}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Reset View */}
        <button
          id="btn-reset-view"
          onClick={() => setPresetView('face')}
          title="Reset to Front View"
          className="p-2.5 rounded-full bg-[#141416]/80 border border-white/10 text-[#8E8A82] hover:text-[#EDE8E0] hover:border-[#C5A059]/30 transition-all cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Floating Hotspots on 3D Model */}
      {enableHotspots && !isExploded && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-4 sm:right-6 max-w-xs pointer-events-auto flex flex-col gap-2">
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#8E8A82] font-semibold text-right">
              Horological Hotspots
            </span>
            <div className="flex flex-wrap justify-end gap-1.5">
              {HOTSPOTS.map((hs) => (
                <button
                  key={hs.id}
                  onClick={() => handleSelectHotspot(hs)}
                  className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs border ${
                    activeHotspot?.id === hs.id
                      ? 'bg-[#C5A059] text-[#0B0B0C] border-[#C5A059] font-semibold shadow-md'
                      : 'bg-[#141416]/80 text-[#8E8A82] border-white/10 hover:border-[#C5A059]/40 hover:text-[#EDE8E0]'
                  }`}
                >
                  {hs.number} • {hs.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Hotspot Narrative Detail Card */}
      {activeHotspot && !isExploded && (
        <div className="absolute bottom-24 sm:bottom-28 left-4 sm:left-6 max-w-md z-20 bg-[#141416]/95 border border-[#C5A059]/40 p-4 sm:p-5 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-3 duration-300">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-[0.25em] text-[#C5A059] font-medium">
                Complication {activeHotspot.number} • {activeHotspot.subtitle}
              </span>
              <h4 className="font-serif text-lg text-[#EDE8E0] font-normal">{activeHotspot.title}</h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="text-xs text-[#8E8A82] hover:text-[#EDE8E0] px-1.5 py-0.5"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-[#EDE8E0]/80 mt-2 font-sans leading-relaxed">
            {activeHotspot.description}
          </p>
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8E8A82]">
            <span>Calibre 9820-T Engineering</span>
            <button
              onClick={() => setPresetView('face')}
              className="text-[#C5A059] hover:underline uppercase tracking-wider flex items-center gap-1"
            >
              Return to Center <ChevronRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* Exploded Calibre Mode Active HUD & Layer Selector */}
      {isExploded && (
        <div className="absolute top-20 left-4 sm:left-6 z-20 max-w-xs bg-[#141416]/90 border border-[#C5A059]/30 p-4 backdrop-blur-md space-y-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#C5A059]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#EDE8E0] font-semibold">
              Exploded Calibre Architecture
            </span>
          </div>
          <p className="text-[11px] text-[#8E8A82] leading-snug">
            312 hand-finished components dissected along the Z-axis to reveal microscopic tolerances.
          </p>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-[10px] text-[#8E8A82]">
              <span>Separation Distance</span>
              <span>{Math.round(explosionSlider * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.5"
              step="0.05"
              value={explosionSlider}
              onChange={(e) => setExplosionSlider(parseFloat(e.target.value))}
              className="w-full accent-[#C5A059] bg-[#252528] h-1.5 cursor-pointer"
            />
          </div>
          <div className="space-y-1 text-[10px] text-[#EDE8E0]/70 pt-2 border-t border-white/10">
            {EXPLODED_LAYERS.map((layer, idx) => (
              <div key={layer.id} className="flex justify-between py-0.5">
                <span className="text-[#C5A059]">{idx + 1}. {layer.name}</span>
                <span className="text-[#8E8A82] text-[9px]">{layer.thickness}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      {showControlsBar && (
        <div className="absolute bottom-4 sm:bottom-6 inset-x-0 z-10 px-4 sm:px-6 pointer-events-none">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141416]/85 backdrop-blur-md border border-white/10 p-2 sm:p-2.5 pointer-events-auto rounded-xs shadow-2xl">
            {/* View Angle Presets */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8A82] px-2 font-medium hidden md:inline">
                Perspective:
              </span>
              {(['face', 'tourbillon', 'profile', 'back'] as const).map((preset) => (
                <button
                  key={preset}
                  onClick={() => setPresetView(preset)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.18em] transition-all cursor-pointer rounded-xs whitespace-nowrap ${
                    activePreset === preset && !isExploded
                      ? 'bg-[#C5A059] text-[#0B0B0C] font-semibold'
                      : 'text-[#8E8A82] hover:text-[#EDE8E0] hover:bg-white/5'
                  }`}
                >
                  {preset === 'face'
                    ? 'Dial'
                    : preset === 'tourbillon'
                    ? 'Tourbillon'
                    : preset === 'profile'
                    ? 'Crown'
                    : 'Exhibition'}
                </button>
              ))}
            </div>

            {/* Exploded Mode & Time Modes */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {/* Exploded Calibre Toggle */}
              {enableExplodedMode && (
                <button
                  id="btn-toggle-exploded"
                  onClick={toggleExploded}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.18em] border transition-all cursor-pointer flex items-center gap-1.5 rounded-xs ${
                    isExploded
                      ? 'bg-[#C5A059] text-[#0B0B0C] border-[#C5A059] font-semibold'
                      : 'border-[#C5A059]/30 text-[#C5A059] hover:bg-[#C5A059]/10'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>{isExploded ? 'Assembly' : 'Exploded Calibre'}</span>
                </button>
              )}

              {/* Time Sync vs Chronograph */}
              <div className="flex items-center bg-[#0B0B0C] border border-white/10 rounded-xs p-0.5">
                <button
                  onClick={() => setTimeMode('live')}
                  title="Real-time Swiss Chronometer Sync"
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                    timeMode === 'live' ? 'bg-[#252528] text-[#EDE8E0]' : 'text-[#8E8A82]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span className="hidden sm:inline">Live</span>
                </button>
                <button
                  onClick={() => setTimeMode('chrono')}
                  title="Chronograph Stopwatch Mode"
                  className={`px-2.5 py-1 text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 ${
                    timeMode === 'chrono' ? 'bg-[#252528] text-[#C5A059]' : 'text-[#8E8A82]'
                  }`}
                >
                  <Timer className="w-3 h-3" />
                  <span className="hidden sm:inline">Chrono</span>
                </button>
              </div>

              {/* Chrono Play / Pause when in chrono mode */}
              {timeMode === 'chrono' && (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setChronoRunning(!chronoRunning)}
                    className="p-1.5 bg-[#C5A059] text-[#0B0B0C] rounded-xs cursor-pointer hover:bg-[#E5C384]"
                  >
                    {chronoRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <span className="text-[11px] font-mono text-[#EDE8E0] px-1">
                    {chronoElapsed.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Drag & Pinch Helper Hint */}
      <div className="absolute bottom-2 right-4 text-[9px] uppercase tracking-[0.2em] text-[#8E8A82]/50 pointer-events-none hidden md:block">
        Drag to Orbit 360° • Scroll to Zoom
      </div>
    </div>
  );
};
