// Scene 3D low-poly lingkungan pesantren (Three.js), dipakai sebagai latar hero beranda.
// Murni Three.js tanpa React supaya bisa dimuat terpisah (dynamic import) hanya di browser.
import * as THREE from 'three'

export type SceneOptions = {
  /** Jam (0–24) yang dipaksakan, mis. dari ?jam=19 untuk demo. Kosong = jam WITA sekarang. */
  hourOverride?: number | null
  /** Perangkat lemah / layar kecil: lebih sedikit objek, tanpa bayangan, 30fps. */
  lowPower?: boolean
  /** Render satu frame saja (untuk pengguna yang memilih "kurangi animasi"). */
  staticFrame?: boolean
  /** Batas devicePixelRatio (kanvas layar penuh sebaiknya lebih rendah supaya ringan). */
  maxPixelRatio?: number
}

export type SceneHandle = {
  start: () => void
  stop: () => void
  resize: () => void
  setPointer: (x: number, y: number) => void
  /** Posisi gulir halaman 0–1: kamera berputar mengitari pesantren saat digulir. */
  setScroll: (progress: number) => void
  dispose: () => void
}

const PALETTE = {
  grass: '#9cc46e',
  grassDark: '#6f9f4c',
  earth: '#8a6a45',
  path: '#eadcb5',
  wall: '#f5f0e3',
  wallShade: '#e4dccb',
  roofGreen: '#1f6b44',
  roofDark: '#165133',
  roofClay: '#b8673f',
  gold: '#d9b13b',
  trunk: '#7a5232',
  leaves: ['#4f8f3a', '#5fa046', '#3f7a32', '#73a94f'],
  robe: '#f7f5ee',
  robeAlt: '#e9f2ec',
  skin: '#c79a72',
  peci: '#1d1d1d',
  hijab: ['#2f6f4f', '#c9a227', '#8fb7a3', '#f2efe6'],
  window: '#2b3a33',
  windowLit: '#ffd27a',
  flagRed: '#d32f2f',
  flagWhite: '#ffffff',
}

// Kunci warna langit/cahaya per jam (WITA). Diinterpolasi linear di antaranya.
const SKY_KEYS: { h: number; sky: string; light: string; intensity: number; ambient: number }[] = [
  { h: 0, sky: '#0d1b2a', light: '#7f9cc4', intensity: 0.25, ambient: 0.35 },
  { h: 4.5, sky: '#1b2a41', light: '#9fb3d6', intensity: 0.3, ambient: 0.4 },
  { h: 5.5, sky: '#f2a97a', light: '#ffc58f', intensity: 0.9, ambient: 0.55 },
  { h: 7, sky: '#bfe3f5', light: '#fff1d6', intensity: 1.4, ambient: 0.7 },
  { h: 12, sky: '#a9d8f2', light: '#ffffff', intensity: 1.7, ambient: 0.8 },
  { h: 16, sky: '#b7dcef', light: '#fff0d0', intensity: 1.4, ambient: 0.7 },
  { h: 17.8, sky: '#f0a46d', light: '#ffb070', intensity: 1.0, ambient: 0.55 },
  { h: 18.6, sky: '#5a4a7a', light: '#d28fb0', intensity: 0.5, ambient: 0.45 },
  { h: 19.5, sky: '#14243a', light: '#8aa4cc', intensity: 0.28, ambient: 0.38 },
  { h: 24, sky: '#0d1b2a', light: '#7f9cc4', intensity: 0.25, ambient: 0.35 },
]

type Spot = 'masjid' | 'asramaPutra' | 'asramaPutri' | 'kelas' | 'lapangan'

// Pintu tiap bangunan (titik tujuan santri berjalan)
const DOORS: Record<Spot, THREE.Vector3> = {
  masjid: new THREE.Vector3(0, 0, -2.2),
  asramaPutra: new THREE.Vector3(-11, 0, 0.6),
  asramaPutri: new THREE.Vector3(-11, 0, 8.6),
  kelas: new THREE.Vector3(11, 0, 1.8),
  lapangan: new THREE.Vector3(9, 0, 11),
}
const PLAZA = new THREE.Vector3(0, 0, 4)

/** Kegiatan menurut jam WITA: dari mana ke mana santri berjalan. */
function activityFor(hour: number): { from: Spot[]; to: Spot; label: string } {
  if (hour >= 4 && hour < 5.5)
    return { from: ['asramaPutra', 'asramaPutri'], to: 'masjid', label: 'Subuh berjamaah' }
  if (hour >= 5.5 && hour < 7)
    return { from: ['masjid'], to: 'asramaPutra', label: 'Selepas subuh' }
  if (hour >= 7 && hour < 12)
    return { from: ['asramaPutra', 'asramaPutri'], to: 'kelas', label: 'Kegiatan belajar' }
  if (hour >= 12 && hour < 13) return { from: ['kelas'], to: 'masjid', label: 'Dzuhur berjamaah' }
  if (hour >= 13 && hour < 15)
    return { from: ['masjid', 'asramaPutra'], to: 'kelas', label: 'Madrasah diniyah' }
  if (hour >= 15 && hour < 16)
    return { from: ['kelas', 'asramaPutri'], to: 'masjid', label: 'Ashar berjamaah' }
  if (hour >= 16 && hour < 17.7)
    return { from: ['asramaPutra', 'masjid'], to: 'lapangan', label: 'Olahraga sore' }
  if (hour >= 17.7 && hour < 19.8)
    return {
      from: ['asramaPutra', 'asramaPutri', 'lapangan'],
      to: 'masjid',
      label: 'Maghrib & Isya',
    }
  if (hour >= 19.8 && hour < 22)
    return { from: ['masjid'], to: 'asramaPutra', label: 'Belajar malam' }
  return { from: ['masjid'], to: 'asramaPutri', label: 'Istirahat' }
}

const isDaytime = (hour: number) => hour >= 6 && hour < 17.5

function witaHour(): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Makassar',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return (get('hour') % 24) + get('minute') / 60
}

// Generator acak deterministik supaya tata letak pohon selalu sama
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function createPesantrenScene(
  canvas: HTMLCanvasElement,
  options: SceneOptions = {},
): SceneHandle | null {
  const { lowPower = false, staticFrame = false } = options

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !lowPower,
      alpha: false,
      powerPreference: 'low-power',
    })
  } catch {
    return null // WebGL tidak tersedia: latar hijau bawaan tetap tampil
  }
  renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, lowPower ? 1 : (options.maxPixelRatio ?? 1.5)),
  )
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.shadowMap.enabled = !lowPower
  renderer.shadowMap.type = THREE.PCFSoftShadowMap

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.5, 400)

  // ---------- Material bersama (flat shading = gaya low-poly) ----------
  const materials = new Map<string, THREE.MeshStandardMaterial>()
  const mat = (color: string, extra: Partial<THREE.MeshStandardMaterialParameters> = {}) => {
    const key = color + JSON.stringify(extra)
    if (!materials.has(key)) {
      materials.set(
        key,
        new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9, ...extra }),
      )
    }
    return materials.get(key)!
  }
  const windowMaterial = new THREE.MeshStandardMaterial({
    color: PALETTE.window,
    emissive: new THREE.Color(PALETTE.windowLit),
    emissiveIntensity: 0,
    flatShading: true,
  })

  const add = (mesh: THREE.Mesh, parent: THREE.Object3D = scene, cast = true, receive = true) => {
    mesh.castShadow = cast && !lowPower
    mesh.receiveShadow = receive && !lowPower
    parent.add(mesh)
    return mesh
  }
  const box = (w: number, h: number, d: number, color: string | THREE.Material) =>
    new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof color === 'string' ? mat(color) : color)

  // ---------- Tanah (pulau diorama melingkar) ----------
  const island = new THREE.Group()
  scene.add(island)
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(30, 28, 1.2, 28), mat(PALETTE.grass)),
    island,
    false,
    true,
  ).position.y = -0.6
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(28, 22, 4, 28), mat(PALETTE.earth)),
    island,
    false,
    false,
  ).position.y = -3.2

  // Jalan setapak: dari plaza ke setiap pintu
  const pathMaterial = mat(PALETTE.path)
  const addPath = (from: THREE.Vector3, to: THREE.Vector3, width = 1.6) => {
    const length = from.distanceTo(to)
    const mesh = add(
      new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, length), pathMaterial),
      scene,
      false,
      true,
    )
    mesh.position.set((from.x + to.x) / 2, 0.03, (from.z + to.z) / 2)
    mesh.rotation.y = Math.atan2(to.x - from.x, to.z - from.z)
  }
  ;(Object.values(DOORS) as THREE.Vector3[]).forEach((door) => addPath(PLAZA, door))
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(3.4, 3.4, 0.07, 16), pathMaterial),
    scene,
    false,
    true,
  ).position.set(PLAZA.x, 0.035, PLAZA.z)

  // ---------- Bangunan ----------
  const windows: THREE.Mesh[] = []
  const addWindows = (
    parent: THREE.Object3D,
    count: number,
    width: number,
    y: number,
    z: number,
    faceBack = false,
  ) => {
    for (let i = 0; i < count; i++) {
      const w = add(
        new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, 0.08), windowMaterial),
        parent,
        false,
        false,
      )
      w.position.set(-width / 2 + (width / (count + 1)) * (i + 1), y, faceBack ? -z : z)
      windows.push(w)
    }
  }
  const gableRoof = (width: number, depth: number, height: number, color: string) => {
    const shape = new THREE.Shape()
    shape.moveTo(-depth / 2 - 0.4, 0)
    shape.lineTo(depth / 2 + 0.4, 0)
    shape.lineTo(0, height)
    shape.closePath()
    const geometry = new THREE.ExtrudeGeometry(shape, { depth: width + 0.6, bevelEnabled: false })
    geometry.translate(0, 0, -(width + 0.6) / 2)
    geometry.rotateY(Math.PI / 2)
    return new THREE.Mesh(geometry, mat(color))
  }

  // Masjid: badan, kubah emas, bulan sabit, serambi, menara
  const masjid = new THREE.Group()
  masjid.position.set(0, 0, -6)
  scene.add(masjid)
  add(box(8, 4, 7, PALETTE.wall), masjid).position.y = 2
  add(box(9, 0.4, 8, PALETTE.wallShade), masjid).position.y = 4.2
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 0.8, 12), mat(PALETTE.wall)),
    masjid,
  ).position.y = 4.8
  add(
    new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(PALETTE.gold, { metalness: 0.2 }),
    ),
    masjid,
  ).position.y = 5.2
  const finial = add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.2, 6), mat(PALETTE.gold)),
    masjid,
  )
  finial.position.y = 8.3
  const crescent = add(
    new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.08, 6, 14, Math.PI * 1.45),
      mat(PALETTE.gold, { metalness: 0.4 }),
    ),
    masjid,
  )
  crescent.position.y = 9.1
  crescent.rotation.z = Math.PI * 0.27
  // Serambi depan dengan tiang
  add(box(6, 0.3, 2.4, PALETTE.wallShade), masjid).position.set(0, 3.2, 4.6)
  for (const x of [-2.6, -0.9, 0.9, 2.6])
    add(box(0.35, 3, 0.35, PALETTE.wall), masjid).position.set(x, 1.5, 5.5)
  add(box(1.6, 2.4, 0.1, PALETTE.roofDark), masjid).position.set(0, 1.2, 3.52) // pintu
  addWindows(masjid, 2, 8, 2.4, 3.52) // 2 jendela mengapit pintu di tengah
  // Menara
  const minaret = new THREE.Group()
  minaret.position.set(6.2, 0, -9.5)
  scene.add(minaret)
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.75, 10, 8), mat(PALETTE.wall)),
    minaret,
  ).position.y = 5
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.35, 8), mat(PALETTE.wallShade)),
    minaret,
  ).position.y = 8.2
  add(
    new THREE.Mesh(new THREE.ConeGeometry(0.75, 2, 8), mat(PALETTE.gold, { metalness: 0.2 })),
    minaret,
  ).position.y = 11

  // Asrama putra & putri, gedung kelas
  const building = (
    x: number,
    z: number,
    w: number,
    d: number,
    h: number,
    roof: string,
    windowCount: number,
  ) => {
    const group = new THREE.Group()
    group.position.set(x, 0, z)
    scene.add(group)
    add(box(w, h, d, PALETTE.wall), group).position.y = h / 2
    const r = add(gableRoof(w, d, 1.6, roof), group)
    r.position.y = h
    addWindows(group, windowCount, w, h * 0.55, d / 2 + 0.02)
    return group
  }
  building(-13, -2.2, 9, 4, 3.4, PALETTE.roofGreen, 5)
  building(-13, 5.8, 9, 4, 3.4, PALETTE.roofClay, 5)
  const kelas = building(13, -0.6, 8, 4, 3.2, PALETTE.roofDark, 4)
  add(box(2.2, 0.12, 1.2, PALETTE.wall), kelas).position.set(0, 2.2, 2.4) // papan nama
  // Lapangan
  const field = add(
    new THREE.Mesh(new THREE.BoxGeometry(9, 0.05, 6), mat('#86b85c')),
    scene,
    false,
    true,
  )
  field.position.set(11, 0.04, 13)
  for (const x of [7, 15]) add(box(0.12, 1.6, 2.2, PALETTE.wall), scene).position.set(x, 0.8, 13)

  // ---------- Bendera merah putih ----------
  const pole = add(
    new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.09, 7, 6),
      mat('#cfcfcf', { metalness: 0.5 }),
    ),
    scene,
  )
  pole.position.set(4.2, 3.5, 4.5)
  const flagGeometry = new THREE.PlaneGeometry(2.2, 1.4, 12, 4)
  const flagColors: number[] = []
  const flagPositions = flagGeometry.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < flagPositions.count; i++) {
    const color = new THREE.Color(flagPositions.getY(i) >= 0 ? PALETTE.flagRed : PALETTE.flagWhite)
    flagColors.push(color.r, color.g, color.b)
  }
  flagGeometry.setAttribute('color', new THREE.Float32BufferAttribute(flagColors, 3))
  const flagBase = Float32Array.from(flagPositions.array as ArrayLike<number>)
  const flag = new THREE.Mesh(
    flagGeometry,
    new THREE.MeshStandardMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      flatShading: true,
    }),
  )
  flag.position.set(4.2 + 1.1, 6.2, 4.5)
  add(flag, scene, !lowPower, false)

  // ---------- Pepohonan ----------
  const random = seeded(7)
  const occupied = [
    { x: 0, z: -6, r: 7 },
    { x: 6.2, z: -9.5, r: 2 },
    { x: -13, z: -2.2, r: 6 },
    { x: -13, z: 5.8, r: 6 },
    { x: 13, z: -0.6, r: 5.5 },
    { x: 11, z: 13, r: 6 },
    { x: 0, z: 4, r: 4.5 },
    { x: -4, z: 13, r: 3.5 },
  ]
  const tree = (x: number, z: number, scale: number) => {
    const group = new THREE.Group()
    group.position.set(x, 0, z)
    group.scale.setScalar(scale)
    scene.add(group)
    add(
      new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.22, 1.4, 5), mat(PALETTE.trunk)),
      group,
    ).position.y = 0.7
    const leaves = PALETTE.leaves[Math.floor(random() * PALETTE.leaves.length)]
    if (random() > 0.35) {
      add(new THREE.Mesh(new THREE.IcosahedronGeometry(1.1, 0), mat(leaves)), group).position.y =
        2.1
    } else {
      add(new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.6, 6), mat(leaves)), group).position.y = 2.4
    }
    return group
  }
  const treeCount = lowPower ? 24 : 42
  for (let placed = 0, tries = 0; placed < treeCount && tries < 400; tries++) {
    const angle = random() * Math.PI * 2
    const radius = 6 + random() * 21
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    const blocked = occupied.some((o) => Math.hypot(o.x - x, o.z - z) < o.r)
    const onPath = (Object.values(DOORS) as THREE.Vector3[]).some((door) => {
      // jarak titik ke ruas plaza→pintu
      const ab = new THREE.Vector2(door.x - PLAZA.x, door.z - PLAZA.z)
      const ap = new THREE.Vector2(x - PLAZA.x, z - PLAZA.z)
      const t = THREE.MathUtils.clamp(ap.dot(ab) / ab.lengthSq(), 0, 1)
      return ap.sub(ab.multiplyScalar(t)).length() < 1.8
    })
    if (blocked || onPath) continue
    tree(x, z, 0.8 + random() * 0.7)
    occupied.push({ x, z, r: 1.6 })
    placed++
  }
  // Pohon besar tempat halaqah
  const bigTree = tree(-4, 13, 1.9)

  // ---------- Santri ----------
  const bodyGeometry = new THREE.CapsuleGeometry(0.26, 0.62, 3, 8)
  const headGeometry = new THREE.SphereGeometry(0.2, 8, 6)
  const peciGeometry = new THREE.CylinderGeometry(0.17, 0.18, 0.14, 8)
  const hijabGeometry = new THREE.SphereGeometry(0.24, 8, 6)
  const makeSantri = (female: boolean, tint: number) => {
    const group = new THREE.Group()
    add(
      new THREE.Mesh(bodyGeometry, mat(tint % 3 === 0 ? PALETTE.robeAlt : PALETTE.robe)),
      group,
    ).position.y = 0.6
    if (female) {
      add(
        new THREE.Mesh(hijabGeometry, mat(PALETTE.hijab[tint % PALETTE.hijab.length])),
        group,
      ).position.y = 1.3
    } else {
      add(new THREE.Mesh(headGeometry, mat(PALETTE.skin)), group).position.y = 1.28
      add(new THREE.Mesh(peciGeometry, mat(PALETTE.peci)), group).position.y = 1.47
    }
    scene.add(group)
    return group
  }

  type Walker = {
    body: THREE.Group
    from: THREE.Vector3
    to: THREE.Vector3
    t: number
    speed: number
    offset: number
    female: boolean
  }
  const walkerCount = lowPower ? 7 : 14
  const walkers: Walker[] = []
  const routeFor = (hour: number, female: boolean) => {
    const activity = activityFor(hour)
    const sources = activity.from.filter((s) =>
      female ? s !== 'asramaPutra' : s !== 'asramaPutri',
    )
    const fromSpot = sources.length
      ? sources[Math.floor(Math.random() * sources.length)]
      : activity.from[0]
    const toSpot = activity.to === 'asramaPutra' && female ? 'asramaPutri' : activity.to
    return { from: DOORS[fromSpot], to: DOORS[toSpot] }
  }
  const resetWalker = (walker: Walker, hour: number, scatter: boolean) => {
    const route = routeFor(hour, walker.female)
    walker.from = route.from
    walker.to = route.to
    walker.t = scatter ? Math.random() : 0
    walker.speed = 0.035 + Math.random() * 0.03
    walker.offset = (Math.random() - 0.5) * 1.1
  }
  for (let i = 0; i < walkerCount; i++) {
    const female = i % 2 === 1
    const walker: Walker = {
      body: makeSantri(female, i),
      from: PLAZA,
      to: PLAZA,
      t: 0,
      speed: 0.05,
      offset: 0,
      female,
    }
    walkers.push(walker)
  }

  // Halaqah: ustadz & santri duduk melingkar di bawah pohon besar (siang hari)
  const halaqah = new THREE.Group()
  scene.add(halaqah)
  const halaqahCenter = new THREE.Vector3(bigTree.position.x + 2.4, 0, bigTree.position.z - 1)
  const seated = lowPower ? 4 : 6
  for (let i = 0; i < seated; i++) {
    const santri = makeSantri(i % 2 === 1, i + 5)
    scene.remove(santri)
    halaqah.add(santri)
    const angle = (i / seated) * Math.PI * 2
    santri.position.set(
      halaqahCenter.x + Math.cos(angle) * 1.5,
      -0.45,
      halaqahCenter.z + Math.sin(angle) * 1.5,
    )
    santri.lookAt(halaqahCenter.x, -0.45, halaqahCenter.z)
  }
  const ustadz = makeSantri(false, 1)
  scene.remove(ustadz)
  halaqah.add(ustadz)
  ustadz.position.set(halaqahCenter.x, -0.4, halaqahCenter.z)
  add(
    new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.04, 14), mat('#d8c48f')),
    halaqah,
    false,
    true,
  ).position.set(halaqahCenter.x, 0.05, halaqahCenter.z)

  // ---------- Langit, cahaya, bintang, burung ----------
  const sun = new THREE.DirectionalLight('#ffffff', 1.5)
  sun.castShadow = !lowPower
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -34
  sun.shadow.camera.right = 34
  sun.shadow.camera.top = 34
  sun.shadow.camera.bottom = -34
  sun.shadow.camera.far = 140
  sun.shadow.bias = -0.0008
  scene.add(sun)
  const ambient = new THREE.HemisphereLight('#ffffff', '#6f9f4c', 0.7)
  scene.add(ambient)
  scene.fog = new THREE.Fog('#a9d8f2', 70, 160)

  const starPositions: number[] = []
  for (let i = 0; i < 400; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI * 0.42
    const r = 140
    starPositions.push(
      r * Math.sin(phi) * Math.cos(theta),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    )
  }
  const starGeometry = new THREE.BufferGeometry()
  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
  const starMaterial = new THREE.PointsMaterial({
    color: '#ffffff',
    size: 1.1,
    sizeAttenuation: false,
    transparent: true,
    opacity: 0,
    fog: false,
  })
  scene.add(new THREE.Points(starGeometry, starMaterial))

  const birds: THREE.Mesh[] = []
  const birdGeometry = new THREE.BufferGeometry()
  birdGeometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(
      [-0.5, 0, 0.2, 0, 0, -0.2, 0, 0.08, 0.1, 0.5, 0, 0.2, 0, 0, -0.2, 0, 0.08, 0.1],
      3,
    ),
  )
  birdGeometry.computeVertexNormals()
  const birdMaterial = new THREE.MeshBasicMaterial({ color: '#2b3a33', side: THREE.DoubleSide })
  for (let i = 0; i < (lowPower ? 3 : 6); i++) {
    const bird = new THREE.Mesh(birdGeometry, birdMaterial)
    bird.scale.setScalar(0.9)
    scene.add(bird)
    birds.push(bird)
  }

  const skyColor = new THREE.Color()
  const lightColor = new THREE.Color()
  const applyTimeOfDay = (hour: number) => {
    const i = SKY_KEYS.findIndex((key) => key.h > hour)
    const a = SKY_KEYS[Math.max(0, i - 1)]
    const b = SKY_KEYS[i === -1 ? SKY_KEYS.length - 1 : i]
    const k = b.h === a.h ? 0 : (hour - a.h) / (b.h - a.h)
    skyColor.set(a.sky).lerp(new THREE.Color(b.sky), k)
    lightColor.set(a.light).lerp(new THREE.Color(b.light), k)
    scene.background = skyColor
    ;(scene.fog as THREE.Fog).color.copy(skyColor)
    sun.color.copy(lightColor)
    sun.intensity = THREE.MathUtils.lerp(a.intensity, b.intensity, k)
    ambient.intensity = THREE.MathUtils.lerp(a.ambient, b.ambient, k)
    // Matahari bergerak timur→barat; malam hari jadi cahaya bulan dari atas
    const dayProgress = THREE.MathUtils.clamp((hour - 5.5) / 13, 0, 1)
    const angle = Math.PI * (0.1 + dayProgress * 0.8)
    sun.position.set(Math.cos(angle) * 60, 20 + Math.sin(angle) * 40, 25)
    const night = THREE.MathUtils.clamp(1 - sun.intensity / 0.9, 0, 1)
    starMaterial.opacity = night
    windowMaterial.emissiveIntensity = night * 1.4
    halaqah.visible = isDaytime(hour) && hour < 16
  }

  // ---------- Kamera ----------
  let width = 1
  let height = 1
  const pointer = new THREE.Vector2(0, 0)
  const pointerSmooth = new THREE.Vector2(0, 0)
  let scrollTarget = 0
  let scrollSmooth = 0
  const updateCamera = (time: number) => {
    pointerSmooth.lerp(pointer, 0.04)
    scrollSmooth += (scrollTarget - scrollSmooth) * 0.06
    const angle = -0.55 + Math.sin(time * 0.05) * 0.18 + pointerSmooth.x * 0.25 + scrollSmooth * 1.6
    // Cukup jauh supaya seluruh "pulau" diorama terlihat utuh
    const radius = width < 640 ? 96 : 86
    camera.position.set(
      Math.sin(angle) * radius,
      34 + pointerSmooth.y * 5 - scrollSmooth * 12,
      Math.cos(angle) * radius,
    )
    camera.lookAt(0, -1, 2)
  }

  const resize = () => {
    const parent = canvas.parentElement
    width = Math.max(1, parent?.clientWidth ?? canvas.clientWidth)
    height = Math.max(1, parent?.clientHeight ?? canvas.clientHeight)
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    // Kartu melebar (desktop/tablet): geser scene ke kanan supaya teks hero di kiri tetap lega
    if (width > 600 && width / height > 1.05) {
      camera.setViewOffset(width, height, -width * 0.24, 0, width, height)
    } else if (width / height < 0.9) {
      // Kartu tegak (HP): geser scene ke atas, teks hero ada di bagian bawah
      camera.setViewOffset(width, height, 0, height * 0.24, width, height)
    } else {
      camera.clearViewOffset()
    }
    camera.updateProjectionMatrix()
  }

  // ---------- Loop animasi ----------
  const clock = new THREE.Clock()
  let frame = 0
  let running = false
  let lastRender = 0
  let currentHour = options.hourOverride ?? witaHour()
  walkers.forEach((walker) => resetWalker(walker, currentHour, true))
  let lastHourCheck = 0

  const tick = () => {
    if (!running) return
    frame = requestAnimationFrame(tick)
    const now = performance.now()
    if (lowPower && now - lastRender < 33) return // ~30fps di perangkat lemah
    lastRender = now
    renderFrame(Math.min(clock.getDelta(), 0.05), clock.elapsedTime)
  }

  const renderFrame = (delta: number, time: number) => {
    if (time - lastHourCheck > 30) {
      currentHour = options.hourOverride ?? witaHour()
      lastHourCheck = time
    }
    applyTimeOfDay(currentHour)

    // Santri berjalan dari pintu ke pintu lewat plaza
    for (const walker of walkers) {
      walker.t += delta * walker.speed
      if (walker.t >= 1) resetWalker(walker, currentHour, false)
      const t = walker.t
      const a = t < 0.5 ? walker.from : PLAZA
      const b = t < 0.5 ? PLAZA : walker.to
      const local = t < 0.5 ? t * 2 : (t - 0.5) * 2
      const x = THREE.MathUtils.lerp(a.x, b.x, local)
      const z = THREE.MathUtils.lerp(a.z, b.z, local)
      const dir = new THREE.Vector2(b.x - a.x, b.z - a.z).normalize()
      walker.body.position.set(
        x - dir.y * walker.offset,
        Math.abs(Math.sin(time * 9 + walker.offset * 10)) * 0.08,
        z + dir.x * walker.offset,
      )
      walker.body.rotation.y = Math.atan2(dir.x, dir.y)
      // Masuk/keluar pintu: mengecil di ujung rute
      const edge = Math.min(t, 1 - t)
      walker.body.scale.setScalar(THREE.MathUtils.clamp(edge * 12, 0, 1))
    }

    // Bendera berkibar
    const position = flag.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < position.count; i++) {
      const bx = flagBase[i * 3]
      const wave = Math.sin(bx * 2.4 - time * 4) * 0.18 * ((bx + 1.1) / 2.2)
      position.setZ(i, wave)
    }
    position.needsUpdate = true
    flag.geometry.computeVertexNormals()

    // Halaqah: gerakan halus seperti mengaji
    halaqah.children.forEach((child, i) => {
      if (child.type === 'Group') child.rotation.x = Math.sin(time * 1.6 + i) * 0.06
    })

    // Burung berputar di atas (siang saja)
    const dayBirds = isDaytime(currentHour)
    birds.forEach((bird, i) => {
      bird.visible = dayBirds
      const a = time * 0.25 + i * 1.1
      bird.position.set(
        Math.cos(a) * (14 + i * 2),
        16 + Math.sin(time + i) * 1.2,
        Math.sin(a) * (12 + i * 2) - 4,
      )
      bird.rotation.y = -a
      bird.scale.y = 0.9 + Math.sin(time * 10 + i) * 0.4
    })

    updateCamera(time)
    renderer.render(scene, camera)
  }

  resize()

  return {
    start: () => {
      if (staticFrame) {
        renderFrame(0, 0)
        return
      }
      if (running) return
      running = true
      clock.getDelta()
      tick()
    },
    stop: () => {
      running = false
      cancelAnimationFrame(frame)
    },
    resize: () => {
      resize()
      if (!running) renderFrame(0, clock.elapsedTime)
    },
    setPointer: (x: number, y: number) => pointer.set(x, y),
    setScroll: (progress: number) => {
      scrollTarget = THREE.MathUtils.clamp(progress, 0, 1)
    },
    dispose: () => {
      running = false
      cancelAnimationFrame(frame)
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh
        mesh.geometry?.dispose()
      })
      materials.forEach((material) => material.dispose())
      windowMaterial.dispose()
      starMaterial.dispose()
      birdMaterial.dispose()
      ;(flag.material as THREE.Material).dispose()
      renderer.dispose()
    },
  }
}
