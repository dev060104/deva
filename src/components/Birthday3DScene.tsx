'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '@/lib/birthdayAudio';
import { 
  Sparkles, Gift, Volume2, VolumeX, RotateCcw, 
  Flame, Wind, Maximize2, Minimize2, Eye, Music
} from 'lucide-react';

export type BirthdayTheme = 'royal-gold' | 'cosmic-nebula' | 'sakura-pastel' | 'cyberpunk';
export type GiftType = 'cake' | 'diamond' | 'trophy' | 'heart';

interface Birthday3DSceneProps {
  recipientName?: string;
  senderName?: string;
  age?: number | string;
  secretMessage?: string;
  currentTheme?: BirthdayTheme;
  giftType?: GiftType;
  onUnboxed?: () => void;
}

export default function Birthday3DScene({
  recipientName = 'Bestie',
  senderName = 'With Love',
  age = 'Forever Young',
  secretMessage = 'May your year ahead be as radiant, unstoppable, and joyful as your smile! ✨',
  currentTheme = 'royal-gold',
  giftType = 'cake',
  onUnboxed,
}: Birthday3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isUnboxed, setIsUnboxed] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTheme, setActiveTheme] = useState<BirthdayTheme>(currentTheme);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Meshes & Animation states
  const giftBoxGroup = useRef<THREE.Group | null>(null);
  const lidMesh = useRef<THREE.Group | null>(null);
  const ribbonGroup = useRef<THREE.Group | null>(null);
  const surpriseGroup = useRef<THREE.Group | null>(null);
  const flameLights = useRef<THREE.PointLight[]>([]);
  const flameMeshes = useRef<THREE.Mesh[]>([]);
  const fireworksSystems = useRef<THREE.Points[]>([]);
  const balloonsGroup = useRef<THREE.Group | null>(null);
  const stardustPoints = useRef<THREE.Points | null>(null);

  // Mouse tilt tracking
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 });
  const cameraRot = useRef({ x: 0.2, y: 0 });

  useEffect(() => {
    setActiveTheme(currentTheme);
  }, [currentTheme]);

  const themeConfigs = {
    'royal-gold': {
      bg: 0x070913,
      boxColor: 0x8b1538, // Royal ruby velvet
      boxTrim: 0xd4af37, // 24k Gold
      ribbonColor: 0xffd700,
      light1: 0xffeedd,
      light2: 0xd4af37,
      balloonColors: [0xd4af37, 0x8b1538, 0xffe082, 0xffffff],
    },
    'cosmic-nebula': {
      bg: 0x050518,
      boxColor: 0x240046, // Cosmic deep violet
      boxTrim: 0x00f5d4, // Cyan neon
      ribbonColor: 0xff007f, // Neon magenta
      light1: 0x7b2cbf,
      light2: 0x00f5d4,
      balloonColors: [0x7b2cbf, 0x00f5d4, 0xff007f, 0x3a0ca3],
    },
    'sakura-pastel': {
      bg: 0x120814,
      boxColor: 0xf7cad0, // Pastel blush
      boxTrim: 0xff70a6, // Rose gold
      ribbonColor: 0xff99c8,
      light1: 0xffcad4,
      light2: 0xffb4d6,
      balloonColors: [0xffb4d6, 0xffcad4, 0xfff0f5, 0xe2afff],
    },
    'cyberpunk': {
      bg: 0x080c10,
      boxColor: 0x0f3460, // Cyber midnight
      boxTrim: 0x00ff88, // Electric matrix green
      ribbonColor: 0xffee00, // Cyberpunk yellow
      light1: 0x00ff88,
      light2: 0xff007f,
      balloonColors: [0x00ff88, 0xffee00, 0x00f5d4, 0xe94560],
    },
  };

  const triggerConfettiBlast = useCallback(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#FF69B4', '#00FFFF', '#FF1493', '#7B68EE', '#FFFFFF'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#FFD700', '#FF4500', '#00F5D4'],
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#FF69B4', '#9370DB', '#00E5FF'],
      });
    }, 250);
  }, []);

  const spawn3DFirework = useCallback(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    const particleCount = 140;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const origin = new THREE.Vector3(
      (Math.random() - 0.5) * 6,
      2.5 + Math.random() * 2.5,
      (Math.random() - 0.5) * 6
    );

    const baseColor = new THREE.Color().setHSL(Math.random(), 0.9, 0.6);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = origin.x;
      positions[i * 3 + 1] = origin.y;
      positions[i * 3 + 2] = origin.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 0.08 + Math.random() * 0.12;

      velocities[i * 3] = speed * Math.sin(phi) * Math.cos(theta);
      velocities[i * 3 + 1] = speed * Math.sin(phi) * Math.sin(theta);
      velocities[i * 3 + 2] = speed * Math.cos(phi);

      colors[i * 3] = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      blending: THREE.AdditiveBlending,
    });

    const firework = new THREE.Points(geometry, material);
    (firework as any).userData = { velocities, life: 1.0 };
    scene.add(firework);
    fireworksSystems.current.push(firework);

    birthdayAudio.playChime(700 + Math.random() * 400, 0.4);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const currentCfg = themeConfigs[activeTheme];
    scene.background = new THREE.Color(currentCfg.bg);
    scene.fog = new THREE.FogExp2(currentCfg.bg, 0.04);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(currentCfg.light1, 1.4);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const rimLight = new THREE.PointLight(currentCfg.light2, 1.8, 15);
    rimLight.position.set(-4, 3, -3);
    scene.add(rimLight);

    // Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(3.5, 3.8, 0.35, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x141a29,
      metalness: 0.8,
      roughness: 0.2,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.18;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Glowing Neon Ring
    const ringGeo = new THREE.TorusGeometry(3.6, 0.05, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: currentCfg.boxTrim });
    const neonRing = new THREE.Mesh(ringGeo, ringMat);
    neonRing.rotation.x = Math.PI / 2;
    neonRing.position.y = -0.01;
    scene.add(neonRing);

    // 3D Gift Box
    const boxGroup = new THREE.Group();
    boxGroup.position.set(0, 0.8, 0);
    scene.add(boxGroup);
    giftBoxGroup.current = boxGroup;

    const boxSize = 1.6;
    const baseGeo = new THREE.BoxGeometry(boxSize, boxSize * 0.85, boxSize);
    const boxMat = new THREE.MeshStandardMaterial({
      color: currentCfg.boxColor,
      metalness: 0.5,
      roughness: 0.3,
    });
    const baseMesh = new THREE.Mesh(baseGeo, boxMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    baseMesh.position.y = (boxSize * 0.85) / 2;
    boxGroup.add(baseMesh);

    const ribMat = new THREE.MeshStandardMaterial({
      color: currentCfg.ribbonColor,
      metalness: 0.8,
      roughness: 0.2,
    });
    const ribWidth = 0.22;
    const ribThickness = 0.015;

    const ribV = new THREE.Mesh(new THREE.BoxGeometry(ribWidth, boxSize * 0.86, boxSize + ribThickness * 2), ribMat);
    ribV.position.y = (boxSize * 0.85) / 2;
    boxGroup.add(ribV);

    const ribH = new THREE.Mesh(new THREE.BoxGeometry(boxSize + ribThickness * 2, boxSize * 0.86, ribWidth), ribMat);
    ribH.position.y = (boxSize * 0.85) / 2;
    boxGroup.add(ribH);

    // Lid
    const lidGrp = new THREE.Group();
    lidGrp.position.set(0, boxSize * 0.85 + 0.02, 0);
    boxGroup.add(lidGrp);
    lidMesh.current = lidGrp;

    const lidSize = boxSize * 1.05;
    const lidHeight = 0.28;
    const lidGeo = new THREE.BoxGeometry(lidSize, lidHeight, lidSize);
    const lidMat = new THREE.MeshStandardMaterial({
      color: currentCfg.boxColor,
      metalness: 0.6,
      roughness: 0.25,
    });
    const lidBox = new THREE.Mesh(lidGeo, lidMat);
    lidBox.castShadow = true;
    lidGrp.add(lidBox);

    const lidTrimGeo = new THREE.BoxGeometry(lidSize * 1.02, 0.05, lidSize * 1.02);
    const lidTrimMat = new THREE.MeshStandardMaterial({ color: currentCfg.boxTrim, metalness: 0.9, roughness: 0.2 });
    const lidTrim = new THREE.Mesh(lidTrimGeo, lidTrimMat);
    lidTrim.position.y = -lidHeight / 2 + 0.02;
    lidGrp.add(lidTrim);

    const lidRibGrp = new THREE.Group();
    lidGrp.add(lidRibGrp);
    ribbonGroup.current = lidRibGrp;

    const lidRib1 = new THREE.Mesh(new THREE.BoxGeometry(ribWidth, lidHeight * 1.05, lidSize + 0.02), ribMat);
    lidRibGrp.add(lidRib1);
    const lidRib2 = new THREE.Mesh(new THREE.BoxGeometry(lidSize + 0.02, lidHeight * 1.05, ribWidth), ribMat);
    lidRibGrp.add(lidRib2);

    // Bow
    const bowGrp = new THREE.Group();
    bowGrp.position.set(0, lidHeight / 2 + 0.12, 0);
    lidRibGrp.add(bowGrp);

    const bowLoopGeo = new THREE.TorusGeometry(0.24, 0.07, 16, 32, Math.PI * 1.5);
    const bowLeft = new THREE.Mesh(bowLoopGeo, ribMat);
    bowLeft.rotation.z = Math.PI / 4;
    bowLeft.rotation.y = Math.PI / 4;
    bowLeft.position.x = -0.15;
    bowGrp.add(bowLeft);

    const bowRight = new THREE.Mesh(bowLoopGeo, ribMat);
    bowRight.rotation.z = -Math.PI / 4;
    bowRight.rotation.y = -Math.PI / 4;
    bowRight.position.x = 0.15;
    bowGrp.add(bowRight);

    const knot = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), ribMat);
    bowGrp.add(knot);

    // Surprise item inside
    const surpGrp = new THREE.Group();
    surpGrp.position.set(0, 0.2, 0);
    surpGrp.scale.set(0.001, 0.001, 0.001);
    boxGroup.add(surpGrp);
    surpriseGroup.current = surpGrp;

    flameLights.current = [];
    flameMeshes.current = [];

    if (giftType === 'cake') {
      const t1Geo = new THREE.CylinderGeometry(0.9, 0.95, 0.5, 32);
      const cakeMat = new THREE.MeshStandardMaterial({ color: 0xfff5ea, roughness: 0.4 });
      const t1 = new THREE.Mesh(t1Geo, cakeMat);
      t1.castShadow = true;
      t1.position.y = 0.25;
      surpGrp.add(t1);

      const icingMat = new THREE.MeshStandardMaterial({ color: 0xe07a5f, roughness: 0.2 });
      const t1Rim = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.06, 16, 32), icingMat);
      t1Rim.rotation.x = Math.PI / 2;
      t1Rim.position.y = 0.48;
      surpGrp.add(t1Rim);

      const t2Geo = new THREE.CylinderGeometry(0.6, 0.65, 0.45, 32);
      const t2Mat = new THREE.MeshStandardMaterial({ color: 0xffccd5, roughness: 0.3 });
      const t2 = new THREE.Mesh(t2Geo, t2Mat);
      t2.castShadow = true;
      t2.position.y = 0.72;
      surpGrp.add(t2);

      const pearlMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });
      for (let i = 0; i < 12; i++) {
        const ang = (i / 12) * Math.PI * 2;
        const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), pearlMat);
        pearl.position.set(Math.cos(ang) * 0.62, 0.92, Math.sin(ang) * 0.62);
        surpGrp.add(pearl);
      }

      const candlePositions = [
        [-0.25, 0.95, 0],
        [0.25, 0.95, 0],
        [0, 0.95, 0.25],
      ];

      candlePositions.forEach((pos, idx) => {
        const cGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
        const cMat = new THREE.MeshStandardMaterial({ color: idx === 1 ? 0xffffff : 0xffbe0b, roughness: 0.3 });
        const candle = new THREE.Mesh(cGeo, cMat);
        candle.position.set(pos[0], pos[1] + 0.2, pos[2]);
        candle.castShadow = true;
        surpGrp.add(candle);

        const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8), new THREE.MeshBasicMaterial({ color: 0x111111 }));
        wick.position.set(pos[0], pos[1] + 0.42, pos[2]);
        surpGrp.add(wick);

        const flameGeo = new THREE.ConeGeometry(0.05, 0.16, 12);
        const flameMat = new THREE.MeshBasicMaterial({ color: 0xff7b00 });
        const flame = new THREE.Mesh(flameGeo, flameMat);
        flame.position.set(pos[0], pos[1] + 0.52, pos[2]);
        surpGrp.add(flame);
        flameMeshes.current.push(flame);

        const fLight = new THREE.PointLight(0xffaa00, 1.2, 2.5);
        fLight.position.set(pos[0], pos[1] + 0.54, pos[2]);
        surpGrp.add(fLight);
        flameLights.current.push(fLight);
      });
    } else if (giftType === 'diamond') {
      const dGeo = new THREE.OctahedronGeometry(0.9, 2);
      const dMat = new THREE.MeshPhysicalMaterial({
        color: 0x00f5d4,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        ior: 2.4,
        thickness: 1.2,
      });
      const diamond = new THREE.Mesh(dGeo, dMat);
      diamond.position.y = 0.8;
      surpGrp.add(diamond);
    } else if (giftType === 'trophy') {
      const trophyMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.95, roughness: 0.15 });
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.2, 0.8, 24), trophyMat);
      cup.position.y = 0.9;
      surpGrp.add(cup);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 16), trophyMat);
      stem.position.y = 0.4;
      surpGrp.add(stem);
      const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.2, 24), trophyMat);
      tBase.position.y = 0.15;
      surpGrp.add(tBase);
    } else {
      const x = 0, y = 0;
      const heartShape = new THREE.Shape();
      heartShape.moveTo(x + 0.25, y + 0.25);
      heartShape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
      heartShape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
      heartShape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
      heartShape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
      heartShape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
      heartShape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

      const extrudeSettings = { depth: 0.3, bevelEnabled: true, bevelSegments: 6, steps: 2, bevelSize: 0.1, bevelThickness: 0.1 };
      const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
      const heartMat = new THREE.MeshPhysicalMaterial({ color: 0xff0055, metalness: 0.3, roughness: 0.15, clearcoat: 1 });
      const heartMesh = new THREE.Mesh(heartGeo, heartMat);
      heartMesh.scale.set(1.2, -1.2, 1.2);
      heartMesh.position.set(-0.3, 1.4, 0);
      surpGrp.add(heartMesh);
    }

    // Floating Balloons
    const bGrp = new THREE.Group();
    scene.add(bGrp);
    balloonsGroup.current = bGrp;

    const balloonGeo = new THREE.SphereGeometry(0.38, 24, 24);
    balloonGeo.scale(1, 1.25, 1);

    const balloonCount = 6;
    for (let i = 0; i < balloonCount; i++) {
      const angle = (i / balloonCount) * Math.PI * 2;
      const dist = 2.2 + Math.random() * 0.8;
      const bColor = currentCfg.balloonColors[i % currentCfg.balloonColors.length];
      const bMat = new THREE.MeshPhysicalMaterial({
        color: bColor,
        metalness: 0.4,
        roughness: 0.15,
        clearcoat: 0.9,
      });

      const singleBalloon = new THREE.Group();
      singleBalloon.position.set(Math.cos(angle) * dist, 1.8 + (i % 3) * 0.5, Math.sin(angle) * dist);

      const bMesh = new THREE.Mesh(balloonGeo, bMat);
      bMesh.castShadow = true;
      singleBalloon.add(bMesh);

      const knotGeo = new THREE.ConeGeometry(0.06, 0.08, 12);
      const bKnot = new THREE.Mesh(knotGeo, bMat);
      bKnot.rotation.x = Math.PI;
      bKnot.position.y = -0.45;
      singleBalloon.add(bKnot);

      const strGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -0.45, 0),
        new THREE.Vector3(Math.sin(i) * 0.1, -1.6, Math.cos(i) * 0.1),
      ]);
      const strMat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.4 });
      const strLine = new THREE.Line(strGeo, strMat);
      singleBalloon.add(strLine);

      (singleBalloon as any).userData = {
        baseY: singleBalloon.position.y,
        speed: 1.5 + Math.random(),
        phase: Math.random() * Math.PI * 2,
      };

      bGrp.add(singleBalloon);
    }

    // Stardust Field
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 16;
      starPositions[i * 3 + 1] = Math.random() * 8 - 0.5;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;

      const starC = new THREE.Color().setHSL(0.12 + Math.random() * 0.1, 0.9, 0.7);
      starColors[i * 3] = starC.r;
      starColors[i * 3 + 1] = starC.g;
      starColors[i * 3 + 2] = starC.b;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);
    stardustPoints.current = starPoints;

    // Controls
    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      mousePos.current.isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mousePos.current.prevX = clientX;
      mousePos.current.prevY = clientY;
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (mousePos.current.isDragging) {
        const deltaX = clientX - mousePos.current.prevX;
        const deltaY = clientY - mousePos.current.prevY;
        cameraRot.current.y += deltaX * 0.008;
        cameraRot.current.x = Math.max(0.05, Math.min(Math.PI / 2.8, cameraRot.current.x + deltaY * 0.008));
        mousePos.current.prevX = clientX;
        mousePos.current.prevY = clientY;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = ((clientX - rect.left) / rect.width) * 2 - 1;
        const normY = -(((clientY - rect.top) / rect.height) * 2 - 1);
        mousePos.current.targetX = normX * 0.35;
        mousePos.current.targetY = normY * 0.25;
      }
    };

    const handlePointerUp = () => {
      mousePos.current.isDragging = false;
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);
    container.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('touchmove', handlePointerMove);
    window.addEventListener('touchend', handlePointerUp);

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      const camDist = 7.5;
      const effectiveRotY = cameraRot.current.y + mousePos.current.x;
      const effectiveRotX = cameraRot.current.x + mousePos.current.y;

      camera.position.x = camDist * Math.sin(effectiveRotY) * Math.cos(effectiveRotX);
      camera.position.y = camDist * Math.sin(effectiveRotX) + 0.8;
      camera.position.z = camDist * Math.cos(effectiveRotY) * Math.cos(effectiveRotX);
      camera.lookAt(0, 1.1, 0);

      if (boxGroup) {
        boxGroup.position.y = 0.8 + Math.sin(elapsedTime * 1.5) * 0.06;
      }

      if (bGrp) {
        bGrp.children.forEach((balloon) => {
          const uData = (balloon as any).userData;
          if (uData) {
            balloon.position.y = uData.baseY + Math.sin(elapsedTime * uData.speed + uData.phase) * 0.18;
            balloon.rotation.z = Math.sin(elapsedTime * 0.8 + uData.phase) * 0.06;
          }
        });
      }

      if (flameMeshes.current.length > 0 && !candlesBlown) {
        flameMeshes.current.forEach((mesh, idx) => {
          const s = 1 + Math.sin(elapsedTime * 12 + idx * 2) * 0.15;
          mesh.scale.set(s, 1 + Math.cos(elapsedTime * 15 + idx) * 0.2, s);
          mesh.rotation.y = elapsedTime * 4;
        });
        flameLights.current.forEach((light, idx) => {
          light.intensity = 1.2 + Math.sin(elapsedTime * 20 + idx * 3) * 0.4;
        });
      }

      if (starPoints) {
        starPoints.rotation.y = elapsedTime * 0.03;
      }

      for (let i = fireworksSystems.current.length - 1; i >= 0; i--) {
        const fw = fireworksSystems.current[i];
        const u = (fw as any).userData;
        if (!u) continue;

        u.life -= 0.016;
        (fw.material as THREE.PointsMaterial).opacity = Math.max(0, u.life);

        const posAttr = fw.geometry.getAttribute('position') as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const velArray = u.velocities as Float32Array;

        for (let p = 0; p < posAttr.count; p++) {
          posArray[p * 3] += velArray[p * 3];
          posArray[p * 3 + 1] += velArray[p * 3 + 1];
          posArray[p * 3 + 2] += velArray[p * 3 + 2];
          velArray[p * 3 + 1] -= 0.0018;
        }
        posAttr.needsUpdate = true;

        if (u.life <= 0) {
          scene.remove(fw);
          fireworksSystems.current.splice(i, 1);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      renderer.dispose();
    };
  }, [activeTheme, giftType, candlesBlown]);

  const triggerUnbox = () => {
    if (isUnboxed) return;
    setIsUnboxed(true);
    birthdayAudio.playUnboxFanfare();
    triggerConfettiBlast();
    spawn3DFirework();

    if (onUnboxed) onUnboxed();

    const startTime = performance.now();
    const duration = 1200;

    const animateOpen = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - progress, 3);

      if (lidMesh.current) {
        lidMesh.current.position.y = 1.36 + ease * 1.8;
        lidMesh.current.position.x = ease * 1.2;
        lidMesh.current.rotation.z = -ease * 0.8;
        lidMesh.current.rotation.y = ease * 0.6;
      }

      if (ribbonGroup.current) {
        ribbonGroup.current.scale.set(1 - ease * 0.4, 1 - ease * 0.4, 1 - ease * 0.4);
      }

      if (surpriseGroup.current) {
        const scale = 0.001 + ease * 0.999;
        surpriseGroup.current.scale.set(scale, scale, scale);
        surpriseGroup.current.position.y = 0.2 + ease * 0.9;
        surpriseGroup.current.rotation.y = ease * Math.PI * 2;
      }

      if (progress < 1) {
        requestAnimationFrame(animateOpen);
      }
    };

    requestAnimationFrame(animateOpen);
  };

  const blowCandles = () => {
    if (candlesBlown) return;
    setCandlesBlown(true);
    birthdayAudio.playBlowPuff();

    flameMeshes.current.forEach((mesh) => {
      mesh.visible = false;
    });
    flameLights.current.forEach((light) => {
      light.intensity = 0;
    });

    setTimeout(() => {
      birthdayAudio.playCheer();
      triggerConfettiBlast();
      spawn3DFirework();
      spawn3DFirework();
    }, 200);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      birthdayAudio.stopMelody();
      setIsMusicPlaying(false);
    } else {
      birthdayAudio.playMelody(true);
      setIsMusicPlaying(true);
    }
  };

  const toggleMuteSound = () => {
    const muted = birthdayAudio.toggleMute();
    setIsMuted(muted);
    if (muted) setIsMusicPlaying(false);
  };

  const resetBox = () => {
    setIsUnboxed(false);
    setCandlesBlown(false);
    if (lidMesh.current) {
      lidMesh.current.position.set(0, 1.36 + 0.02, 0);
      lidMesh.current.rotation.set(0, 0, 0);
    }
    if (ribbonGroup.current) {
      ribbonGroup.current.scale.set(1, 1, 1);
    }
    if (surpriseGroup.current) {
      surpriseGroup.current.scale.set(0.001, 0.001, 0.001);
      surpriseGroup.current.position.set(0, 0.2, 0);
    }
    flameMeshes.current.forEach((mesh) => (mesh.visible = true));
    flameLights.current.forEach((light) => (light.intensity = 1.2));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl bg-slate-950/80 backdrop-blur-xl group">
      
      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="w-full h-[480px] sm:h-[580px] cursor-grab active:cursor-grabbing transition-all select-none"
        onClick={() => {
          if (!isUnboxed) triggerUnbox();
        }}
      />

      {/* Floating 3D Greeting Badge on Canvas */}
      <div className="absolute top-5 left-5 pointer-events-none z-10 flex flex-col gap-1.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white text-xs font-semibold shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
          <span>3D Vision Experience</span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {activeTheme.replace('-', ' ')}
          </span>
        </div>
        
        <div className="bg-gradient-to-r from-black/70 via-black/40 to-transparent p-3 rounded-2xl backdrop-blur-sm max-w-sm">
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-mono">Special Celebration For</p>
          <h2 className="text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-pink-300 to-indigo-300">
            {recipientName} {age ? `(${age})` : ''}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
            <span>Sent with love by <strong className="text-pink-400">{senderName}</strong></span>
          </p>
        </div>
      </div>

      {/* Top-Right Quick Interactive Tools */}
      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <button
          onClick={toggleMusic}
          className={`p-2.5 rounded-xl backdrop-blur-md border transition-all text-xs flex items-center gap-1.5 font-medium shadow-lg ${
            isMusicPlaying 
              ? 'bg-pink-600/80 border-pink-400 text-white shadow-pink-500/30 animate-pulse' 
              : 'bg-black/60 border-white/10 text-slate-300 hover:text-white hover:bg-black/80'
          }`}
          title={isMusicPlaying ? 'Pause Happy Birthday Melody' : 'Play Music-Box Birthday Melody'}
        >
          <Music className="w-4 h-4" />
          <span className="hidden sm:inline">{isMusicPlaying ? 'Melody Playing' : 'Birthday Music'}</span>
        </button>

        <button
          onClick={toggleMuteSound}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg"
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        <button
          onClick={toggleFullscreen}
          className="p-2.5 rounded-xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Unboxed Secret Greeting Card Banner Overlay */}
      {isUnboxed && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-lg animate-in fade-in zoom-in-95 duration-500">
          <div className="p-4 sm:p-5 rounded-2xl bg-black/75 backdrop-blur-xl border border-amber-500/40 shadow-2xl text-center space-y-2 relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-28 h-28 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-28 h-28 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />
            
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              Surprise Unlocked!
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              Happy Birthday, <span className="text-amber-300">{recipientName}</span>! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed px-2 font-serif">
              "{secretMessage}"
            </p>
          </div>
        </div>
      )}

      {/* Bottom Main Interactive Bar */}
      <div className="absolute bottom-5 left-0 right-0 z-20 px-5 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        
        {/* Left Action: Unbox / Blow Candle */}
        <div className="flex items-center gap-2.5">
          {!isUnboxed ? (
            <button
              onClick={triggerUnbox}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-pink-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Gift className="w-4 h-4" />
              <span>Click to Unbox 3D Gift!</span>
            </button>
          ) : giftType === 'cake' && !candlesBlown ? (
            <button
              onClick={blowCandles}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-xl shadow-cyan-500/25 hover:scale-105 active:scale-95 transition-all animate-bounce cursor-pointer"
            >
              <Wind className="w-4 h-4" />
              <span>Blow Out Candles! 🎂</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Wish Made! Happy Birthday! ✨</span>
            </div>
          )}

          {/* Confetti & Fireworks Trigger Button */}
          <button
            onClick={() => {
              triggerConfettiBlast();
              spawn3DFirework();
            }}
            className="p-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-amber-300 hover:text-amber-200 transition-all shadow-lg flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Fire Celebratory Fireworks & Confetti"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Fireworks</span>
          </button>

          {isUnboxed && (
            <button
              onClick={resetBox}
              className="p-3 rounded-2xl bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white transition-all shadow-lg cursor-pointer"
              title="Reset 3D Box"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Action: 3D Visual Theme Switcher */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 font-mono uppercase px-2 hidden sm:inline">Theme:</span>
          {(['royal-gold', 'cosmic-nebula', 'sakura-pastel', 'cyberpunk'] as BirthdayTheme[]).map((thm) => (
            <button
              key={thm}
              onClick={() => {
                setActiveTheme(thm);
                birthdayAudio.playChime(600, 0.3);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all capitalize cursor-pointer ${
                activeTheme === thm
                  ? 'bg-gradient-to-r from-amber-500/30 to-pink-500/30 text-white border border-amber-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {thm.split('-')[0]}
            </button>
          ))}
        </div>

      </div>

      {/* Tip Banner for Orbit */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity">
        <span className="text-[10px] text-slate-300 font-mono tracking-wider bg-black/60 px-3 py-1 rounded-full border border-white/10">
          💡 Drag mouse / swipe to orbit 3D camera
        </span>
      </div>

    </div>
  );
}
