import * as THREE from "three";

/**
 * Builds a stylized Volkswagen Beetle from Three.js primitives.
 *
 * The iconic Beetle shape: rounded dome body, curved roof, bumpers,
 * round headlights, and a visible interior (two seats, steering wheel,
 * dashboard) that the camera can see when it dollies inside.
 *
 * Returns a Group centered at origin, sitting on the ground (y=0),
 * roughly 4 units long.
 */
export function buildVWBeetle(): THREE.Group {
  const car = new THREE.Group();
  car.name = "VWBeetle";

  // ---- Materials ----
  const bodyMat = new THREE.MeshStandardMaterial({
    color: "#1a6cb8", // VW blue
    metalness: 0.6,
    roughness: 0.35,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  } as THREE.MeshPhysicalMaterialParameters);
  // Use MeshPhysicalMaterial for clearcoat
  (bodyMat as THREE.MeshPhysicalMaterial).clearcoat = 1;
  (bodyMat as THREE.MeshPhysicalMaterial).clearcoatRoughness = 0.08;

  const roofMat = new THREE.MeshStandardMaterial({
    color: "#1a6cb8",
    metalness: 0.6,
    roughness: 0.3,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: "#223344",
    metalness: 0,
    roughness: 0.05,
    transmission: 0.92,
    transparent: true,
    opacity: 0.45,
    ior: 1.5,
    thickness: 0.05,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: "#e0e0e0",
    metalness: 1,
    roughness: 0.15,
  });

  const blackMat = new THREE.MeshStandardMaterial({
    color: "#1a1a1a",
    metalness: 0.3,
    roughness: 0.7,
  });

  const tireMat = new THREE.MeshStandardMaterial({
    color: "#0d0d0d",
    metalness: 0.1,
    roughness: 0.9,
  });

  const interiorMat = new THREE.MeshStandardMaterial({
    color: "#3a2a1a", // brown/tan interior
    metalness: 0.1,
    roughness: 0.8,
  });

  const seatMat = new THREE.MeshStandardMaterial({
    color: "#5a3a20",
    metalness: 0.1,
    roughness: 0.85,
  });

  const dashMat = new THREE.MeshStandardMaterial({
    color: "#2a2a2a",
    metalness: 0.2,
    roughness: 0.6,
  });

  const metalMat = new THREE.MeshStandardMaterial({
    color: "#888888",
    metalness: 0.8,
    roughness: 0.3,
  });

  const redMat = new THREE.MeshStandardMaterial({
    color: "#cc2222",
    emissive: "#660000",
    metalness: 0.2,
    roughness: 0.5,
  });

  const yellowMat = new THREE.MeshStandardMaterial({
    color: "#ffcc00",
    emissive: "#443300",
    metalness: 0.2,
    roughness: 0.5,
  });

  // ---- Body: the iconic Beetle dome shape ----
  // Main body: a stretched sphere flattened on bottom
  const bodyGeo = new THREE.SphereGeometry(1.5, 32, 24);
  bodyGeo.scale(1.6, 0.75, 1.0);
  // Flatten the bottom
  const positions = bodyGeo.attributes.position;
  for (let i = 0; i < positions.count; i++) {
    const y = positions.getY(i);
    if (y < -0.5) positions.setY(i, -0.5);
  }
  bodyGeo.computeVertexNormals();
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.75;
  body.castShadow = true;
  body.receiveShadow = true;
  car.add(body);

  // ---- Roof / cabin: smaller dome on top ----
  const roofGeo = new THREE.SphereGeometry(1.1, 24, 20);
  roofGeo.scale(1.3, 0.8, 0.95);
  const roofPos = roofGeo.attributes.position;
  for (let i = 0; i < roofPos.count; i++) {
    const y = roofPos.getY(i);
    if (y < -0.3) roofPos.setY(i, -0.3);
  }
  roofGeo.computeVertexNormals();
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.set(0, 1.35, -0.15);
  roof.castShadow = true;
  car.add(roof);

  // ---- Windows (glass) ----
  // Windshield (front, angled)
  const windshieldGeo = new THREE.PlaneGeometry(1.3, 0.7);
  const windshield = new THREE.Mesh(windshieldGeo, glassMat);
  windshield.position.set(0, 1.3, 0.85);
  windshield.rotation.x = -Math.PI / 5;
  car.add(windshield);

  // Rear window
  const rearWindowGeo = new THREE.PlaneGeometry(1.2, 0.6);
  const rearWindow = new THREE.Mesh(rearWindowGeo, glassMat);
  rearWindow.position.set(0, 1.35, -1.15);
  rearWindow.rotation.x = Math.PI / 5;
  car.add(rearWindow);

  // Side windows (left + right)
  const sideWinGeo = new THREE.PlaneGeometry(1.4, 0.5);
  const leftWin = new THREE.Mesh(sideWinGeo, glassMat);
  leftWin.position.set(-1.15, 1.45, -0.15);
  leftWin.rotation.y = Math.PI / 2;
  car.add(leftWin);

  const rightWin = new THREE.Mesh(sideWinGeo, glassMat);
  rightWin.position.set(1.15, 1.45, -0.15);
  rightWin.rotation.y = -Math.PI / 2;
  car.add(rightWin);

  // ---- Hood (front section, slightly lower) ----
  const hoodGeo = new THREE.SphereGeometry(0.9, 24, 16);
  hoodGeo.scale(1.2, 0.5, 0.8);
  const hoodPos = hoodGeo.attributes.position;
  for (let i = 0; i < hoodPos.count; i++) {
    const y = hoodPos.getY(i);
    if (y < -0.3) hoodPos.setY(i, -0.3);
  }
  hoodGeo.computeVertexNormals();
  const hood = new THREE.Mesh(hoodGeo, bodyMat);
  hood.position.set(0, 0.7, 1.5);
  hood.castShadow = true;
  car.add(hood);

  // ---- Rear engine deck ----
  const rearDeckGeo = new THREE.SphereGeometry(0.85, 24, 16);
  rearDeckGeo.scale(1.2, 0.5, 0.75);
  const rearDeckPos = rearDeckGeo.attributes.position;
  for (let i = 0; i < rearDeckPos.count; i++) {
    const y = rearDeckPos.getY(i);
    if (y < -0.3) rearDeckPos.setY(i, -0.3);
  }
  rearDeckGeo.computeVertexNormals();
  const rearDeck = new THREE.Mesh(rearDeckGeo, bodyMat);
  rearDeck.position.set(0, 0.75, -1.6);
  rearDeck.castShadow = true;
  car.add(rearDeck);

  // ---- Headlights (round, iconic Beetle look) ----
  const headlightGeo = new THREE.SphereGeometry(0.22, 16, 12);
  headlightGeo.scale(0.6, 1, 1);
  const hlMat = new THREE.MeshStandardMaterial({
    color: "#fffbe6",
    emissive: "#fffbe6",
    emissiveIntensity: 0.4,
    metalness: 0.5,
    roughness: 0.1,
  });
  const leftHL = new THREE.Mesh(headlightGeo, hlMat);
  leftHL.position.set(-0.75, 0.85, 2.05);
  car.add(leftHL);
  const rightHL = new THREE.Mesh(headlightGeo, hlMat);
  rightHL.position.set(0.75, 0.85, 2.05);
  car.add(rightHL);

  // Headlight chrome rings
  const ringGeo = new THREE.TorusGeometry(0.23, 0.04, 8, 20);
  const leftRing = new THREE.Mesh(ringGeo, chromeMat);
  leftRing.position.set(-0.75, 0.85, 2.06);
  leftRing.rotation.y = Math.PI / 2;
  car.add(leftRing);
  const rightRing = new THREE.Mesh(ringGeo, chromeMat);
  rightRing.position.set(0.75, 0.85, 2.06);
  rightRing.rotation.y = Math.PI / 2;
  car.add(rightRing);

  // ---- Taillights ----
  const tailGeo = new THREE.SphereGeometry(0.15, 12, 10);
  tailGeo.scale(0.5, 1, 1);
  const leftTail = new THREE.Mesh(tailGeo, redMat);
  leftTail.position.set(-0.85, 0.95, -2.15);
  car.add(leftTail);
  const rightTail = new THREE.Mesh(tailGeo, redMat);
  rightTail.position.set(0.85, 0.95, -2.15);
  car.add(rightTail);

  // ---- Bumpers (chrome, front + rear) ----
  const bumperGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.2, 16);
  const frontBumper = new THREE.Mesh(bumperGeo, chromeMat);
  frontBumper.position.set(0, 0.45, 2.15);
  frontBumper.rotation.z = Math.PI / 2;
  car.add(frontBumper);

  const rearBumper = new THREE.Mesh(bumperGeo, chromeMat);
  rearBumper.position.set(0, 0.45, -2.15);
  rearBumper.rotation.z = Math.PI / 2;
  car.add(rearBumper);

  // ---- VW Logo on hood front ----
  const logoBaseGeo = new THREE.CircleGeometry(0.18, 24);
  const logoBase = new THREE.Mesh(logoBaseGeo, chromeMat);
  logoBase.position.set(0, 0.95, 2.18);
  car.add(logoBase);

  // "V" and "W" simplified - two angled bars + two angled bars
  const logoBarGeo = new THREE.BoxGeometry(0.08, 0.02, 0.12);
  // V
  const vLeft = new THREE.Mesh(logoBarGeo, blueMat());
  vLeft.position.set(-0.05, 0.95, 2.19);
  vLeft.rotation.y = 0.5;
  car.add(vLeft);
  const vRight = new THREE.Mesh(logoBarGeo, blueMat());
  vRight.position.set(0.05, 0.95, 2.19);
  vRight.rotation.y = -0.5;
  car.add(vRight);

  // ---- Wheels ----
  const wheelGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.35, 24);
  const wheelPos: [number, number, number][] = [
    [-1.55, 0.55, 1.3],
    [1.55, 0.55, 1.3],
    [-1.55, 0.55, -1.3],
    [1.55, 0.55, -1.3],
  ];
  for (const [x, y, z] of wheelPos) {
    const wheel = new THREE.Mesh(wheelGeo, tireMat);
    wheel.position.set(x, y, z);
    wheel.rotation.z = Math.PI / 2;
    wheel.castShadow = true;
    car.add(wheel);

    // Hubcap (chrome)
    const hubGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.37, 16);
    const hub = new THREE.Mesh(hubGeo, chromeMat);
    hub.position.set(x, y, z);
    hub.rotation.z = Math.PI / 2;
    car.add(hub);
  }

  // ---- Running boards (side steps) ----
  const boardGeo = new THREE.BoxGeometry(0.12, 0.06, 1.2);
  const leftBoard = new THREE.Mesh(boardGeo, chromeMat);
  leftBoard.position.set(-1.5, 0.35, 0);
  car.add(leftBoard);
  const rightBoard = new THREE.Mesh(boardGeo, chromeMat);
  rightBoard.position.set(1.5, 0.35, 0);
  car.add(rightBoard);

  // ---- Door lines (thin grooves to suggest doors) ----
  const lineGeo = new THREE.BoxGeometry(0.02, 0.02, 2.2);
  const leftDoorLine = new THREE.Mesh(lineGeo, blackMat);
  leftDoorLine.position.set(-1.35, 0.8, 0);
  car.add(leftDoorLine);
  const rightDoorLine = new THREE.Mesh(lineGeo, blackMat);
  rightDoorLine.position.set(1.35, 0.8, 0);
  car.add(rightDoorLine);

  // ============ INTERIOR (visible when camera goes inside) ============
  const interior = new THREE.Group();
  interior.name = "interior";

  // Floor
  const floorGeo = new THREE.BoxGeometry(2.4, 0.05, 3.2);
  const floor = new THREE.Mesh(floorGeo, interiorMat);
  floor.position.set(0, 0.28, 0);
  interior.add(floor);

  // Dashboard
  const dashGeo = new THREE.BoxGeometry(2.2, 0.35, 0.4);
  const dashboard = new THREE.Mesh(dashGeo, dashMat);
  dashboard.position.set(0, 0.85, 0.95);
  interior.add(dashboard);

  // Steering wheel
  const wheelRingGeo = new THREE.TorusGeometry(0.18, 0.03, 8, 24);
  const steeringWheel = new THREE.Mesh(wheelRingGeo, blackMat);
  steeringWheel.position.set(-0.45, 0.95, 0.85);
  steeringWheel.rotation.x = Math.PI / 2.5;
  interior.add(steeringWheel);

  // Steering column
  const columnGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.3, 8);
  const column = new THREE.Mesh(columnGeo, metalMat);
  column.position.set(-0.45, 0.8, 0.95);
  column.rotation.x = Math.PI / 4;
  interior.add(column);

  // Dashboard gauges
  const gaugeGeo = new THREE.CircleGeometry(0.08, 16);
  const gauge1 = new THREE.Mesh(gaugeGeo, yellowMat);
  gauge1.position.set(0.15, 0.9, 0.76);
  gauge1.rotation.y = Math.PI;
  interior.add(gauge1);
  const gauge2 = new THREE.Mesh(gaugeGeo, new THREE.MeshStandardMaterial({ color: "#222", metalness: 0.5, roughness: 0.3 }));
  gauge2.position.set(0.35, 0.9, 0.76);
  gauge2.rotation.y = Math.PI;
  interior.add(gauge2);

  // Front seats (two)
  const seatBaseGeo = new THREE.BoxGeometry(0.55, 0.3, 0.6);
  const seatBackGeo = new THREE.BoxGeometry(0.55, 0.55, 0.12);

  const driverSeatBase = new THREE.Mesh(seatBaseGeo, seatMat);
  driverSeatBase.position.set(-0.45, 0.5, 0.2);
  interior.add(driverSeatBase);
  const driverSeatBack = new THREE.Mesh(seatBackGeo, seatMat);
  driverSeatBack.position.set(-0.45, 0.85, -0.05);
  interior.add(driverSeatBack);

  const passSeatBase = new THREE.Mesh(seatBaseGeo, seatMat);
  passSeatBase.position.set(0.45, 0.5, 0.2);
  interior.add(passSeatBase);
  const passSeatBack = new THREE.Mesh(seatBackGeo, seatMat);
  passSeatBack.position.set(0.45, 0.85, -0.05);
  interior.add(passSeatBack);

  // Rear seat (bench)
  const rearSeatBaseGeo = new THREE.BoxGeometry(1.8, 0.25, 0.5);
  const rearSeatBase = new THREE.Mesh(rearSeatBaseGeo, seatMat);
  rearSeatBase.position.set(0, 0.45, -1.0);
  interior.add(rearSeatBase);
  const rearSeatBackGeo = new THREE.BoxGeometry(1.8, 0.5, 0.12);
  const rearSeatBack = new THREE.Mesh(rearSeatBackGeo, seatMat);
  rearSeatBack.position.set(0, 0.8, -1.25);
  interior.add(rearSeatBack);

  // Rearview mirror
  const mirrorGeo = new THREE.BoxGeometry(0.2, 0.06, 0.03);
  const mirror = new THREE.Mesh(mirrorGeo, blackMat);
  mirror.position.set(0, 1.25, 0.7);
  interior.add(mirror);

  // Gear shift
  const shiftGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8);
  const shift = new THREE.Mesh(shiftGeo, metalMat);
  shift.position.set(-0.15, 0.7, 0.5);
  interior.add(shift);
  const shiftKnobGeo = new THREE.SphereGeometry(0.05, 8, 8);
  const shiftKnob = new THREE.Mesh(shiftKnobGeo, blackMat);
  shiftKnob.position.set(-0.15, 0.82, 0.5);
  interior.add(shiftKnob);

  car.add(interior);

  // ---- Ground shadow catcher plane (optional, handled by Ground in scene) ----

  return car;
}

function blueMat(): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: "#003a7d",
    metalness: 0.5,
    roughness: 0.4,
  });
}
