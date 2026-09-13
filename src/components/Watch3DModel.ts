import * as THREE from 'three';
import { WatchEdition } from '../types';
import { createDialTexture, createBezelTexture, createMovementTexture } from '../utils/watchTextures';

export interface WatchModelParts {
  rootGroup: THREE.Group;
  layerCrystal: THREE.Group;
  layerBezel: THREE.Group;
  layerDial: THREE.Group;
  layerMovement: THREE.Group;
  layerCase: THREE.Group;
  layerRotor: THREE.Group;
  layerCaseback: THREE.Group;
  layerStrap: THREE.Group;
  hands: {
    hour: THREE.Group;
    minute: THREE.Group;
    second: THREE.Group;
    subMinute: THREE.Group;
    subSecond: THREE.Group;
  };
  tourbillonCage: THREE.Group;
  balanceWheel: THREE.Group;
  rotorMesh: THREE.Group;
  caseMesh: THREE.Mesh;
  bezelMesh: THREE.Mesh;
  dialMesh: THREE.Mesh;
  strapMeshes: THREE.Mesh[];
}

export function buildWatch3DModel(edition: WatchEdition): {
  parts: WatchModelParts;
  updateMaterials: (newEdition: WatchEdition) => void;
  updateAnimation: (delta: number, isLiveTime: boolean, chronoSeconds?: number) => void;
  setExplosionProgress: (progress: number) => void;
} {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'Watch_Root';

  // Master layer groups for exploded view
  const layerCrystal = new THREE.Group();
  const layerBezel = new THREE.Group();
  const layerDial = new THREE.Group();
  const layerMovement = new THREE.Group();
  const layerCase = new THREE.Group();
  const layerRotor = new THREE.Group();
  const layerCaseback = new THREE.Group();
  const layerStrap = new THREE.Group();

  rootGroup.add(
    layerCase,
    layerStrap,
    layerMovement,
    layerRotor,
    layerCaseback,
    layerDial,
    layerBezel,
    layerCrystal
  );

  // 1. Materials setup
  const caseColor = new THREE.Color(edition.materials.caseColor);
  const dialColor = new THREE.Color(edition.materials.dialColor);
  const handsColor = new THREE.Color(edition.materials.handsColor);
  const strapColor = new THREE.Color(edition.materials.strapColor);
  const bezelColor = new THREE.Color(edition.materials.bezelColor);

  // Metal case material
  const caseMaterial = new THREE.MeshStandardMaterial({
    color: caseColor,
    metalness: edition.materials.metalness,
    roughness: edition.materials.roughness,
    envMapIntensity: 1.5,
  });

  // Sapphire crystal glass material
  const sapphireMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.04,
    transmission: 0.95,
    opacity: 0.35,
    transparent: true,
    reflectivity: 0.8,
    ior: 1.77, // Sapphire refractive index
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    depthWrite: false,
  });

  // Dial Material
  let dialTexture = createDialTexture(edition.materials.dialColor, true, edition.materials.handsColor);
  const dialMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: dialTexture,
    metalness: 0.7,
    roughness: 0.3,
    transparent: true,
  });

  // Bezel Material
  let bezelTexture = createBezelTexture(edition.materials.bezelColor, edition.materials.handsColor);
  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: bezelColor,
    map: bezelTexture,
    metalness: 0.88,
    roughness: 0.22,
  });

  // Hands Material
  const handsMaterial = new THREE.MeshStandardMaterial({
    color: handsColor,
    metalness: 0.95,
    roughness: 0.12,
  });

  // Movement German Silver & Geneva Stripes Material
  const movementTexture = createMovementTexture(edition.materials.handsColor);
  const movementMaterial = new THREE.MeshStandardMaterial({
    map: movementTexture,
    metalness: 0.85,
    roughness: 0.25,
  });

  // Synthetic Pigeon-Blood Ruby Material
  const rubyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xaa0022,
    metalness: 0.2,
    roughness: 0.1,
    transmission: 0.85,
    transparent: true,
    opacity: 0.9,
    ior: 1.76,
  });

  // Blued Steel Screw Material
  const bluedScrewMaterial = new THREE.MeshStandardMaterial({
    color: 0x1b3b6f,
    metalness: 0.92,
    roughness: 0.18,
  });

  // 2. Build Case
  const caseRadius = 1.35;
  const caseHeight = 0.46;
  const caseGeometry = new THREE.CylinderGeometry(caseRadius, caseRadius, caseHeight, 64);
  const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
  caseMesh.rotation.x = Math.PI / 2;
  caseMesh.castShadow = true;
  caseMesh.receiveShadow = true;
  layerCase.add(caseMesh);

  // Stepped case flank ring
  const flankRingGeom = new THREE.TorusGeometry(caseRadius + 0.02, 0.04, 16, 64);
  const flankRingMesh = new THREE.Mesh(flankRingGeom, caseMaterial);
  layerCase.add(flankRingMesh);

  // Lugs (4 corner lugs at 10, 2, 4, 8 o'clock)
  const lugGeom = new THREE.BoxGeometry(0.18, 0.85, 0.42);
  const lugOffsets = [
    { x: -0.85, y: 1.45, rotZ: 0.12 },
    { x: 0.85, y: 1.45, rotZ: -0.12 },
    { x: -0.85, y: -1.45, rotZ: -0.12 },
    { x: 0.85, y: -1.45, rotZ: 0.12 },
  ];

  lugOffsets.forEach((cfg) => {
    const lug = new THREE.Mesh(lugGeom, caseMaterial);
    lug.position.set(cfg.x, cfg.y, -0.05);
    lug.rotation.z = cfg.rotZ;
    lug.rotation.x = cfg.y > 0 ? -0.18 : 0.18; // curve slightly downward to wrist
    layerCase.add(lug);
  });

  // Crown at 3 o'clock
  const crownGroup = new THREE.Group();
  crownGroup.position.set(caseRadius + 0.12, 0, 0);
  crownGroup.rotation.z = -Math.PI / 2;

  // Crown stem & grooved head
  const crownGeom = new THREE.CylinderGeometry(0.2, 0.22, 0.24, 24);
  const crownMesh = new THREE.Mesh(crownGeom, caseMaterial);
  crownGroup.add(crownMesh);

  // Crown cabochon jewel at tip
  const cabochonGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const cabochonMesh = new THREE.Mesh(cabochonGeom, rubyMaterial);
  cabochonMesh.position.y = 0.14;
  crownGroup.add(cabochonMesh);

  // Chronograph pushers at 2 o'clock and 4 o'clock
  const pusherGeom = new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16);
  const pusher1 = new THREE.Mesh(pusherGeom, caseMaterial);
  pusher1.position.set(caseRadius * 0.92, 0.72, 0);
  pusher1.rotation.z = -Math.PI / 3;

  const pusher2 = new THREE.Mesh(pusherGeom, caseMaterial);
  pusher2.position.set(caseRadius * 0.92, -0.72, 0);
  pusher2.rotation.z = -Math.PI / 1.7;

  layerCase.add(crownGroup, pusher1, pusher2);

  // 3. Build Bezel
  const bezelOuterRadius = 1.38;
  const bezelInnerRadius = 1.08;
  const bezelGeometry = new THREE.RingGeometry(bezelInnerRadius, bezelOuterRadius, 64);
  const bezelMesh = new THREE.Mesh(bezelGeometry, bezelMaterial);
  bezelMesh.position.z = 0.24;
  layerBezel.add(bezelMesh);

  // Bezel stepped outer metal rim
  const bezelRimGeom = new THREE.TorusGeometry(bezelOuterRadius, 0.045, 16, 64);
  const bezelRim = new THREE.Mesh(bezelRimGeom, caseMaterial);
  bezelRim.position.z = 0.24;
  layerBezel.add(bezelRim);

  // 4. Build Front Sapphire Crystal
  const crystalGeometry = new THREE.CylinderGeometry(1.22, 1.22, 0.06, 64);
  const crystalMesh = new THREE.Mesh(crystalGeometry, sapphireMaterial);
  crystalMesh.rotation.x = Math.PI / 2;
  crystalMesh.position.z = 0.28;
  layerCrystal.add(crystalMesh);

  // 5. Build Dial Plate & Applied Markers
  const dialRadius = 1.18;
  const dialGeometry = new THREE.CircleGeometry(dialRadius, 64);
  const dialMesh = new THREE.Mesh(dialGeometry, dialMaterial);
  dialMesh.position.z = 0.16;
  layerDial.add(dialMesh);

  // Applied 3D Hour Markers (12, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11) - skip 6 because of Tourbillon
  const markerGeom = new THREE.BoxGeometry(0.04, 0.18, 0.035);
  const doubleMarkerGeom = new THREE.BoxGeometry(0.08, 0.22, 0.04);

  for (let h = 1; h <= 12; h++) {
    if (h === 6) continue; // Tourbillon window occupies 6 o'clock
    const angle = (h * Math.PI * 2) / 12;
    const dist = 0.95;
    const mx = Math.sin(angle) * dist;
    const my = Math.cos(angle) * dist;

    const marker = new THREE.Mesh(h === 12 ? doubleMarkerGeom : markerGeom, handsMaterial);
    marker.position.set(mx, my, 0.18);
    marker.rotation.z = -angle;
    layerDial.add(marker);
  }

  // 6. Build Mechanical Flying Tourbillon (at 6 o'clock)
  const tourbillonGroup = new THREE.Group();
  tourbillonGroup.position.set(0, -0.49, 0.08);
  layerMovement.add(tourbillonGroup);

  // Tourbillon outer aperture deep well
  const wellGeom = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 32);
  const wellMesh = new THREE.Mesh(wellGeom, movementMaterial);
  wellMesh.rotation.x = Math.PI / 2;
  wellMesh.position.z = -0.06;
  tourbillonGroup.add(wellMesh);

  // Rotating carriage cage (spins once per 60 seconds)
  const tourbillonCage = new THREE.Group();
  tourbillonGroup.add(tourbillonCage);

  // 3-Spoke titanium tourbillon bridge
  for (let s = 0; s < 3; s++) {
    const spokeAngle = (s * Math.PI * 2) / 3;
    const spokeGeom = new THREE.BoxGeometry(0.03, 0.34, 0.02);
    const spoke = new THREE.Mesh(spokeGeom, handsMaterial);
    spoke.position.set(Math.sin(spokeAngle) * 0.16, Math.cos(spokeAngle) * 0.16, 0.06);
    spoke.rotation.z = -spokeAngle;
    tourbillonCage.add(spoke);
  }

  // Central tourbillon ruby bearing
  const centralRubyGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.03, 16);
  const centralRuby = new THREE.Mesh(centralRubyGeom, rubyMaterial);
  centralRuby.rotation.x = Math.PI / 2;
  centralRuby.position.z = 0.07;
  tourbillonCage.add(centralRuby);

  // Gold balance wheel oscillating inside the tourbillon cage
  const balanceWheel = new THREE.Group();
  const balanceRimGeom = new THREE.TorusGeometry(0.24, 0.018, 12, 32);
  const balanceRim = new THREE.Mesh(balanceRimGeom, handsMaterial);
  balanceWheel.add(balanceRim);

  // Balance wheel crossbar & weights
  const barGeom = new THREE.BoxGeometry(0.02, 0.46, 0.015);
  const bar = new THREE.Mesh(barGeom, handsMaterial);
  balanceWheel.add(bar);

  // Balance spring spiral representation
  const springRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.12, 0.008, 8, 32),
    bluedScrewMaterial
  );
  balanceWheel.add(springRing);
  balanceWheel.position.z = 0.02;
  tourbillonCage.add(balanceWheel);

  // 7. Watch Hands (Dauphine style)
  const handsGroup = new THREE.Group();
  handsGroup.position.set(0, 0, 0.20);
  layerDial.add(handsGroup);

  // Hour Hand (faceted dauphine)
  const hourGroup = new THREE.Group();
  const hourBladeGeom = new THREE.ConeGeometry(0.055, 0.52, 4);
  const hourBlade = new THREE.Mesh(hourBladeGeom, handsMaterial);
  hourBlade.position.y = 0.26;
  hourBlade.scale.set(1, 1, 0.3);
  hourGroup.add(hourBlade);
  handsGroup.add(hourGroup);

  // Minute Hand (longer faceted dauphine)
  const minuteGroup = new THREE.Group();
  const minuteBladeGeom = new THREE.ConeGeometry(0.048, 0.82, 4);
  const minuteBlade = new THREE.Mesh(minuteBladeGeom, handsMaterial);
  minuteBlade.position.y = 0.41;
  minuteBlade.scale.set(1, 1, 0.3);
  minuteGroup.add(minuteBlade);
  minuteGroup.position.z = 0.015;
  handsGroup.add(minuteGroup);

  // Second Hand (needle thin with counterweight)
  const secondGroup = new THREE.Group();
  const secondNeedleGeom = new THREE.BoxGeometry(0.012, 1.05, 0.01);
  const secondNeedle = new THREE.Mesh(secondNeedleGeom, bluedScrewMaterial);
  secondNeedle.position.y = 0.38;
  secondGroup.add(secondNeedle);

  // Counterweight teardrop
  const counterGeom = new THREE.CircleGeometry(0.04, 16);
  const counter = new THREE.Mesh(counterGeom, bluedScrewMaterial);
  counter.position.y = -0.15;
  secondGroup.add(counter);
  secondGroup.position.z = 0.03;
  handsGroup.add(secondGroup);

  // Subdial Hands at 3 o'clock and 9 o'clock
  const subRadius = 1.18 * 0.22;
  const subMinuteGroup = new THREE.Group();
  subMinuteGroup.position.set(subRadius, 0, 0.18);
  const subMinuteBlade = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.01), handsMaterial);
  subMinuteBlade.position.y = 0.08;
  subMinuteGroup.add(subMinuteBlade);
  layerDial.add(subMinuteGroup);

  const subSecondGroup = new THREE.Group();
  subSecondGroup.position.set(-subRadius, 0, 0.18);
  const subSecondBlade = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.16, 0.01), handsMaterial);
  subSecondBlade.position.y = 0.08;
  subSecondGroup.add(subSecondBlade);
  layerDial.add(subSecondGroup);

  // Center pin cap
  const centerCapGeom = new THREE.CylinderGeometry(0.065, 0.065, 0.04, 24);
  const centerCap = new THREE.Mesh(centerCapGeom, handsMaterial);
  centerCap.rotation.x = Math.PI / 2;
  centerCap.position.z = 0.045;
  handsGroup.add(centerCap);

  // 8. Movement Mainplate & Gear Train (inside layerMovement)
  const mainplateGeom = new THREE.CylinderGeometry(1.28, 1.28, 0.12, 48);
  const mainplateMesh = new THREE.Mesh(mainplateGeom, movementMaterial);
  mainplateMesh.rotation.x = Math.PI / 2;
  layerMovement.add(mainplateMesh);

  // Movement rubies and blued screws on plate
  const rubyPositions = [
    [-0.45, 0.45],
    [0.45, 0.45],
    [0.35, -0.15],
    [-0.35, -0.15],
    [0, 0.35],
    [-0.6, 0.1],
  ];

  rubyPositions.forEach(([rx, ry]) => {
    const rmesh = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), rubyMaterial);
    rmesh.rotation.x = Math.PI / 2;
    rmesh.position.set(rx, ry, -0.06);
    layerMovement.add(rmesh);

    // Surrounding gold chaton
    const chaton = new THREE.Mesh(new THREE.TorusGeometry(0.052, 0.012, 8, 16), handsMaterial);
    chaton.position.set(rx, ry, -0.06);
    layerMovement.add(chaton);
  });

  // 9. 22K Solid Gold Oscillating Rotor (at back)
  const rotorGroup = new THREE.Group();
  rotorGroup.position.set(0, 0, -0.16);
  layerRotor.add(rotorGroup);

  // Semi-circular rotor mass
  const rotorGeom = new THREE.RingGeometry(0.3, 1.22, 32, 1, 0, Math.PI);
  const rotorMesh = new THREE.Mesh(rotorGeom, handsMaterial);
  rotorMesh.position.z = 0.01;
  rotorGroup.add(rotorMesh);

  // Central ball bearing mount
  const bearingGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.03, 32);
  const bearingMesh = new THREE.Mesh(bearingGeom, caseMaterial);
  bearingMesh.rotation.x = Math.PI / 2;
  rotorGroup.add(bearingMesh);

  // 10. Exhibition Sapphire Caseback
  const casebackRingGeom = new THREE.TorusGeometry(1.28, 0.08, 16, 64);
  const casebackRing = new THREE.Mesh(casebackRingGeom, caseMaterial);
  casebackRing.position.z = -0.24;
  layerCaseback.add(casebackRing);

  const rearCrystalGeom = new THREE.CylinderGeometry(1.18, 1.18, 0.04, 64);
  const rearCrystal = new THREE.Mesh(rearCrystalGeom, sapphireMaterial);
  rearCrystal.rotation.x = Math.PI / 2;
  rearCrystal.position.z = -0.24;
  layerCaseback.add(rearCrystal);

  // 11. Watch Strap / Bracelet
  const strapMeshes: THREE.Mesh[] = [];
  const strapMaterial = new THREE.MeshStandardMaterial({
    color: strapColor,
    roughness: 0.75,
    metalness: 0.1,
  });

  // Upper strap curve (12 o'clock)
  const createCurvedStrap = (isTop: boolean) => {
    const curveGroup = new THREE.Group();
    const segmentCount = 14;
    const strapWidth = 0.96;
    const startY = isTop ? 1.45 : -1.45;
    const dir = isTop ? 1 : -1;

    for (let i = 0; i < segmentCount; i++) {
      const segLen = 0.18;
      const progress = i / segmentCount;
      const angle = progress * (Math.PI * 0.48) * dir;
      const segGeom = new THREE.BoxGeometry(strapWidth * (1 - progress * 0.18), segLen, 0.08);
      const segMesh = new THREE.Mesh(segGeom, strapMaterial);

      const py = startY + Math.sin(progress * 1.2) * (1.6 * dir);
      const pz = -Math.pow(progress, 1.6) * 1.4 - 0.06;

      segMesh.position.set(0, py, pz);
      segMesh.rotation.x = angle;
      strapMeshes.push(segMesh);
      curveGroup.add(segMesh);
    }
    return curveGroup;
  };

  const topStrap = createCurvedStrap(true);
  const bottomStrap = createCurvedStrap(false);
  layerStrap.add(topStrap, bottomStrap);

  // Parts reference bundle
  const parts: WatchModelParts = {
    rootGroup,
    layerCrystal,
    layerBezel,
    layerDial,
    layerMovement,
    layerCase,
    layerRotor,
    layerCaseback,
    layerStrap,
    hands: {
      hour: hourGroup,
      minute: minuteGroup,
      second: secondGroup,
      subMinute: subMinuteGroup,
      subSecond: subSecondGroup,
    },
    tourbillonCage,
    balanceWheel,
    rotorMesh: rotorGroup,
    caseMesh,
    bezelMesh,
    dialMesh,
    strapMeshes,
  };

  // Runtime Animation state
  let totalTime = 0;
  let rotorVelocity = 0;

  const updateAnimation = (delta: number, isLiveTime: boolean, chronoSeconds = 0) => {
    totalTime += delta;

    // 1. Tourbillon continuous 60s rotation
    tourbillonCage.rotation.z -= (Math.PI * 2 * delta) / 60;

    // 2. High-frequency 4Hz balance wheel oscillation
    balanceWheel.rotation.z = Math.sin(totalTime * 25.13) * 0.75;

    // 3. Sub-dials gentle movement
    parts.hands.subMinute.rotation.z -= delta * 0.05;
    parts.hands.subSecond.rotation.z -= delta * 0.2;

    // 4. Rotor inertial swing
    rotorVelocity += Math.sin(totalTime * 0.8) * 0.02;
    rotorVelocity *= 0.96; // damping
    rotorGroup.rotation.z += rotorVelocity;

    // 5. Watch Hands movement
    if (isLiveTime) {
      const now = new Date();
      const h = now.getHours() % 12;
      const m = now.getMinutes();
      const s = now.getSeconds();
      const ms = now.getMilliseconds();

      const secProgress = s + ms / 1000;
      const minProgress = m + secProgress / 60;
      const hourProgress = h + minProgress / 60;

      parts.hands.second.rotation.z = -secProgress * (Math.PI / 30);
      parts.hands.minute.rotation.z = -minProgress * (Math.PI / 30);
      parts.hands.hour.rotation.z = -hourProgress * (Math.PI / 6);
    } else {
      // Chronometer stopwatch mode
      const secProgress = chronoSeconds % 60;
      const minProgress = (chronoSeconds / 60) % 60;
      const hourProgress = (chronoSeconds / 3600) % 12;

      parts.hands.second.rotation.z = -secProgress * (Math.PI / 30);
      parts.hands.minute.rotation.z = -minProgress * (Math.PI / 30);
      parts.hands.hour.rotation.z = -hourProgress * (Math.PI / 6);
    }
  };

  // Update materials when switching editions
  const updateMaterials = (newEdition: WatchEdition) => {
    caseMaterial.color.set(newEdition.materials.caseColor);
    caseMaterial.metalness = newEdition.materials.metalness;
    caseMaterial.roughness = newEdition.materials.roughness;

    bezelMaterial.color.set(newEdition.materials.bezelColor);
    handsMaterial.color.set(newEdition.materials.handsColor);

    // Refresh dial texture
    dialTexture.dispose();
    dialTexture = createDialTexture(newEdition.materials.dialColor, true, newEdition.materials.handsColor);
    dialMaterial.map = dialTexture;
    dialMaterial.needsUpdate = true;

    // Refresh bezel texture
    bezelTexture.dispose();
    bezelTexture = createBezelTexture(newEdition.materials.bezelColor, newEdition.materials.handsColor);
    bezelMaterial.map = bezelTexture;
    bezelMaterial.needsUpdate = true;

    // Update strap color
    strapMaterial.color.set(newEdition.materials.strapColor);
  };

  // Exploded calibre mode layer translation
  const setExplosionProgress = (p: number) => {
    layerCrystal.position.z = 1.45 * p;
    layerBezel.position.z = 0.95 * p;
    layerDial.position.z = 0.48 * p;
    layerMovement.position.z = 0.0;
    layerCase.position.z = -0.48 * p;
    layerRotor.position.z = -0.98 * p;
    layerCaseback.position.z = -1.48 * p;
    layerStrap.position.z = -0.65 * p;
  };

  return {
    parts,
    updateMaterials,
    updateAnimation,
    setExplosionProgress,
  };
}
