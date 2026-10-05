import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Check,
  ChevronDown, Heart, Leaf, Menu, Moon, Move3d, PawPrint, Search, Sparkles,
  Sun, X,
} from 'lucide-react';
import ScrollReveal from './components/ScrollReveal.jsx';

const photos = {
  hero: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=2200&q=90',
  bengal: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85',
  maine: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=900&q=85',
  siamese: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=85',
  ragdoll: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=85',
  story: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?auto=format&fit=crop&w=1400&q=85',
  gallery1: 'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=1000&q=85',
  gallery2: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=1000&q=85',
  gallery3: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=85',
  adopt1: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=85',
  adopt2: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=900&q=85',
  adopt3: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=85',
};

const breeds = [
  { name: 'Bengal', origin: 'United States', life: '12–16 years', size: 'Medium', mood: 'Curious · Athletic · Vocal', type: 'Short coat', image: photos.bengal, tag: 'THE ADVENTURER', color: '#c4e26b', energy: 5 },
  { name: 'Maine Coon', origin: 'United States', life: '12–15 years', size: 'Large', mood: 'Gentle · Social · Clever', type: 'Long coat', image: photos.maine, tag: 'THE GENTLE GIANT', color: '#f0a078', energy: 4 },
  { name: 'Siamese', origin: 'Thailand', life: '15–20 years', size: 'Medium', mood: 'Affectionate · Chatty · Bright', type: 'Short coat', image: photos.siamese, tag: 'THE CONVERSATIONALIST', color: '#93c5bf', energy: 5 },
  { name: 'Ragdoll', origin: 'United States', life: '13–18 years', size: 'Large', mood: 'Easygoing · Sweet · Quiet', type: 'Long coat', image: photos.ragdoll, tag: 'THE SOFT LANDING', color: '#f3cb73', energy: 2 },
];

const cats = [
  { name: 'Miso', details: '2 years · The window watcher', image: photos.adopt1, traits: ['Gentle', 'Indoor'] },
  { name: 'Fig', details: '1 year · A pocket-sized explorer', image: photos.adopt2, traits: ['Playful', 'Curious'] },
  { name: 'Olive', details: '3 years · Professional sunbeam finder', image: photos.adopt3, traits: ['Affectionate', 'Calm'] },
];

function CatStage({ coat }) {
  const canvasRef = useRef(null);
  const materialsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    let cancelled = false;
    let frame;
    let resize;
    let controls;
    let renderer;
    let scene;

    const setupScene = async () => {
      const [THREE, { OrbitControls }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
      ]);
      if (cancelled) return;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 1.3, 7.5);
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.2, 0);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = 5.5;
    controls.maxDistance = 9;
    controls.maxPolarAngle = Math.PI * 0.66;
    controls.minPolarAngle = Math.PI * 0.28;

    scene.add(new THREE.HemisphereLight(0xe9f4dc, 0x26392c, 2.2));
    const key = new THREE.DirectionalLight(0xffe2b1, 3.4);
    key.position.set(-3, 5, 5);
    key.castShadow = true;
    scene.add(key);
    const rim = new THREE.PointLight(0x99bd69, 18, 12);
    rim.position.set(3, 2, -2);
    scene.add(rim);

    const cat = new THREE.Group();
    scene.add(cat);
    const coatMaterial = new THREE.MeshStandardMaterial({ color: coat, roughness: 0.76 });
    materialsRef.current = [coatMaterial];
    const cream = new THREE.MeshStandardMaterial({ color: '#f5e9d2', roughness: 0.82 });
    const earPink = new THREE.MeshStandardMaterial({ color: '#a9564a', roughness: 0.8 });
    const dark = new THREE.MeshStandardMaterial({ color: '#202a20', roughness: 0.45 });
    const iris = new THREE.MeshStandardMaterial({ color: '#a9cf5b', roughness: 0.34, metalness: 0.08 });

    const mesh = (geometry, material, position, scale, parent = cat) => {
      const part = new THREE.Mesh(geometry, material);
      part.position.set(...position);
      if (scale) part.scale.set(...scale);
      part.castShadow = true;
      part.receiveShadow = true;
      parent.add(part);
      return part;
    };
    mesh(new THREE.SphereGeometry(0.82, 48, 36), coatMaterial, [0, 0.62, 0], [0.8, 0.92, 0.63]);
    mesh(new THREE.SphereGeometry(0.59, 48, 36), coatMaterial, [0, 1.69, 0.03], [1, 0.94, 0.82]);
    const ears = [];
    [-1, 1].forEach((side) => {
      const ear = mesh(new THREE.ConeGeometry(0.29, 0.58, 4), coatMaterial, [side * 0.39, 2.2, -0.01], [1, 1, 0.7]);
      ear.rotation.z = side * -0.25;
      const inner = mesh(new THREE.ConeGeometry(0.17, 0.35, 4), earPink, [side * 0.39, 2.2, 0.12], [1, 1, 0.38]);
      inner.rotation.z = side * -0.25;
      ears.push(ear);
    });
    [-1, 1].forEach((side) => {
      mesh(new THREE.SphereGeometry(0.125, 24, 18), cream, [side * 0.23, 1.78, 0.66], [1.15, 0.9, 0.4]);
      mesh(new THREE.SphereGeometry(0.079, 24, 18), iris, [side * 0.23, 1.78, 0.716], [0.78, 1, 0.4]);
      mesh(new THREE.SphereGeometry(0.032, 16, 12), dark, [side * 0.23, 1.78, 0.74], [1, 1, 0.4]);
      mesh(new THREE.SphereGeometry(0.016, 12, 8), cream, [side * 0.25, 1.81, 0.755], [1, 1, 0.4]);
    });
    mesh(new THREE.SphereGeometry(0.08, 20, 14), earPink, [0, 1.54, 0.71], [1.15, 0.72, 0.45]);
    const mouthGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 1.5, 0.69), new THREE.Vector3(-0.12, 1.41, 0.68), new THREE.Vector3(-0.2, 1.45, 0.65),
      new THREE.Vector3(0, 1.5, 0.69), new THREE.Vector3(0.12, 1.41, 0.68), new THREE.Vector3(0.2, 1.45, 0.65),
    ]);
    cat.add(new THREE.LineSegments(mouthGeometry, new THREE.LineBasicMaterial({ color: '#342b24' })));
    for (let side of [-1, 1]) {
      for (let i = 0; i < 3; i += 1) {
        const line = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(side * 0.34, 1.52 - i * 0.06, 0.62),
          new THREE.Vector3(side * (0.75 + i * 0.03), 1.58 - i * 0.11, 0.49),
        ]);
        cat.add(new THREE.Line(line, new THREE.LineBasicMaterial({ color: '#f3e5c9', transparent: true, opacity: 0.8 })));
      }
    }

    const tail = new THREE.Group();
    tail.position.set(0.57, 0.48, -0.05);
    cat.add(tail);
    const tailCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.23, -0.11, -0.02),
      new THREE.Vector3(0.28, 0.24, -0.02), new THREE.Vector3(0.18, 0.52, 0),
    ]);
    tail.add(new THREE.Mesh(new THREE.TubeGeometry(tailCurve, 36, 0.105, 12, false), coatMaterial));
    const ground = new THREE.Mesh(new THREE.CircleGeometry(2.2, 64), new THREE.MeshStandardMaterial({ color: '#324232', roughness: 1 }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.25;
    ground.receiveShadow = true;
    scene.add(ground);

    const clock = new THREE.Clock();
    const draw = () => {
      frame = requestAnimationFrame(draw);
      const time = clock.getElapsedTime();
      cat.position.y = Math.sin(time * 1.4) * 0.035;
      tail.rotation.z = Math.sin(time * 1.1) * 0.12;
      controls.update();
      renderer.render(scene, camera);
    };
    draw();
    resize = new ResizeObserver(() => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });
    resize.observe(canvas);
    };

    setupScene();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resize?.disconnect();
      controls?.dispose();
      scene?.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          const list = Array.isArray(object.material) ? object.material : [object.material];
          list.forEach((material) => material.dispose());
        }
      });
      renderer?.dispose();
      materialsRef.current = [];
    };
  }, []);

  useEffect(() => {
    materialsRef.current.forEach((material) => material.color.set(coat));
  }, [coat]);

  return <canvas className="cat-canvas" ref={canvasRef} aria-label="Interactive 3D cat. Drag to rotate and scroll to zoom." />;
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All cats');
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('catverse-favorites') || '[]'); } catch { return []; }
  });
  const [dark, setDark] = useState(() => localStorage.getItem('catverse-theme') === 'dark');
  const [coat, setCoat] = useState('#d48445');
  const [selectedImage, setSelectedImage] = useState(null);
  const [openCare, setOpenCare] = useState(null);
  const [copied, setCopied] = useState(false);
  const studioRef = useRef(null);
  const [studioVisible, setStudioVisible] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('catverse-theme', dark ? 'dark' : 'light');
  }, [dark]);

  useEffect(() => {
    localStorage.setItem('catverse-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const section = studioRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setStudioVisible(true);
        observer.disconnect();
      }
    }, { rootMargin: '180px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setSelectedImage(null);
        setSearchOpen(false);
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const visibleBreeds = useMemo(() => breeds.filter((breed) => {
    const matchesQuery = `${breed.name} ${breed.origin} ${breed.mood} ${breed.type}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = filter === 'All cats' || breed.type === filter || (filter === 'Big personalities' && breed.energy >= 4);
    return matchesQuery && matchesFilter;
  }), [query, filter]);

  const toggleFavorite = (name) => setFavorites((current) => current.includes(name) ? current.filter((item) => item !== name) : [...current, name]);

  const shareResult = async () => {
    try {
      await navigator.clipboard.writeText('Meet me in the CATVERSE: a curious world, one paw at a time.');
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.hash = 'discover';
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="wordmark" aria-label="CATVERSE home" onClick={closeMenu}>
          <span className="brand-icon"><PawPrint size={18} strokeWidth={2.2} /></span>
          <span>CATVERSE<span className="wordmark-dot">.</span></span>
        </a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="#discover" onClick={closeMenu}>Discover</a>
          <a href="#breeds" onClick={closeMenu}>Breeds</a>
          <a href="#care" onClick={closeMenu}>Care notes</a>
          <a href="#gallery" onClick={closeMenu}>Gallery</a>
          <a href="#adopt" onClick={closeMenu}>Adoption</a>
        </nav>
        <div className="header-actions">
          <button className="icon-button search-trigger" aria-label="Search breeds" onClick={() => { setSearchOpen((value) => !value); document.getElementById('breed-search')?.focus(); }}><Search size={18} /></button>
          <button className="icon-button theme-toggle" aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`} onClick={() => setDark((value) => !value)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
          <button className="icon-button menu-trigger" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} onClick={() => setMenuOpen((value) => !value)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </header>

      <main>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-photo" role="img" aria-label="Close-up portrait of a curious cat" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> THE FIELD GUIDE TO FELINE LIFE</div>
            <h1 id="hero-title">CATVERSE<span className="hero-period">.</span></h1>
            <p className="hero-subtitle">A curious world,<br />one paw at a time.</p>
            <p className="hero-description">Meet remarkable cats. Find your kind of curious.<br className="desktop-break" /> Learn the little things that make a life together.</p>
            <div className="hero-actions">
              <a className="button button-lime" href="#discover">Step inside <ArrowDownRight size={17} /></a>
              <a className="text-link light-link" href="#breeds">Meet the breeds <ArrowRight size={16} /></a>
            </div>
          </div>
          <div className="hero-side-note"><span>01 — A WORLD OF THEIR OWN</span><span>SCROLL TO WANDER</span></div>
          <a className="scroll-cue" href="#discover" aria-label="Scroll to discover"><ArrowDown size={17} /></a>
          <span className="hero-index">EST. FOR THE CAT-CURIOUS · 2026</span>
        </section>

        <section className="intro-section section-wrap" id="discover">
          <div className="section-kicker"><span>01</span><span className="kicker-line" /> A BETTER KIND OF CAT SITE</div>
          <div className="intro-grid">
            <h2>Less scroll.<br /><em>More soul.</em></h2>
            <div className="intro-copy">
              <ScrollReveal
                baseOpacity={0.16}
                baseRotation={1.5}
                blurStrength={4}
                containerClassName="intro-scroll-reveal"
                textClassName="intro-reveal-text"
                rotationEnd="bottom 78%"
                wordAnimationEnd="bottom 78%"
              >
                Somewhere between the sunniest window and the 3 a.m. zoomies is a whole universe worth knowing.
              </ScrollReveal>
              <p>CATVERSE is your field guide to the feline world: honest breed notes, thoughtful care, and stories worth slowing down for.</p>
              <a href="#breeds" className="underlined-link">Find your starting point <ArrowDownRight size={16} /></a>
            </div>
          </div>
          <div className="intro-stats" aria-label="CATVERSE at a glance">
            <div><strong>73<span>+</span></strong><small>Recognized breeds</small></div>
            <div><strong>09</strong><small>Lives changed this week</small></div>
            <div><strong>100<span>%</span></strong><small>Here for the cats</small></div>
            <span className="intro-stamp"><PawPrint size={28} /><small>GOOD<br />COMPANY</small></span>
          </div>
        </section>

        <section className="breed-section" id="breeds">
          <div className="section-wrap">
            <div className="section-topline"><div className="section-kicker"><span>02</span><span className="kicker-line" /> THE BREED INDEX</div><span className="section-aside">A few faces to know</span></div>
            <div className="breed-heading-row">
              <h2>Different by nature.<br /><em>Cat by cat.</em></h2>
              <p>Every breed has its own rhythm. Start with a feeling, follow your curiosity, and see who feels like home.</p>
            </div>
            <div className="breed-toolbar">
              <div className="filter-tabs" role="group" aria-label="Filter breeds">
                {['All cats', 'Long coat', 'Short coat', 'Big personalities'].map((item) => <button key={item} className={filter === item ? 'filter-pill active' : 'filter-pill'} onClick={() => setFilter(item)}>{item}</button>)}
              </div>
              <label className={`breed-search ${searchOpen ? 'search-visible' : ''}`}>
                <Search size={16} />
                <input id="breed-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a breed" aria-label="Search breeds" />
                {query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={14} /></button>}
              </label>
            </div>
            <div className="breed-grid">
              {visibleBreeds.map((breed, index) => (
                <article className={`breed-card breed-card-${index + 1}`} key={breed.name}>
                  <div className="breed-image-wrap">
                    <img src={breed.image} alt={`${breed.name} cat`} loading="lazy" />
                    <span className="breed-number">0{index + 1} / 04</span>
                    <button className={`favorite-button ${favorites.includes(breed.name) ? 'is-favorite' : ''}`} aria-label={`${favorites.includes(breed.name) ? 'Remove' : 'Add'} ${breed.name} ${favorites.includes(breed.name) ? 'from' : 'to'} favorites`} onClick={() => toggleFavorite(breed.name)}><Heart size={17} fill={favorites.includes(breed.name) ? 'currentColor' : 'none'} /></button>
                    <span className="breed-tag" style={{ '--tag-color': breed.color }}>{breed.tag}</span>
                  </div>
                  <div className="breed-card-info">
                    <div className="breed-title-line"><h3>{breed.name}</h3><span>{breed.size}</span></div>
                    <p className="breed-mood">{breed.mood}</p>
                    <div className="breed-details"><span>{breed.origin}</span><span>{breed.life}</span></div>
                    <a href="#cat-studio" className="card-arrow" aria-label={`Explore ${breed.name}`}><ArrowUpRight size={19} /></a>
                  </div>
                </article>
              ))}
              {visibleBreeds.length === 0 && <div className="empty-results"><PawPrint size={24} /><p>No cats found by that name. Try another trail.</p><button onClick={() => { setQuery(''); setFilter('All cats'); }}>Reset the index</button></div>}
            </div>
            <div className="breed-footnote"><span><Sparkles size={15} /> Curious is a good place to start.</span><span>Showing {visibleBreeds.length} of 4 field notes</span></div>
          </div>
        </section>

        <section className="studio-section" id="cat-studio" ref={studioRef}>
          <div className="studio-wrap section-wrap">
            <div className="studio-copy">
              <div className="section-kicker light-kicker"><span>03</span><span className="kicker-line" /> MEET YOUR MUSE</div>
              <h2>Built from<br />pure <em>curiosity.</em></h2>
              <p>Go ahead. Give them a turn. This little studio cat is happiest when you make a fuss.</p>
              <div className="studio-controls">
                <span className="control-label">PICK A COAT</span>
                <div className="coat-picker" role="group" aria-label="Choose cat coat color">
                  {[['#d48445', 'Ginger'], ['#303a35', 'Midnight'], ['#e7e0d1', 'Cloud'], ['#a2a37d', 'Sage']].map(([color, name]) => <button key={color} className={`coat-swatch ${coat === color ? 'selected' : ''}`} style={{ '--swatch': color }} aria-label={`${name} coat`} aria-pressed={coat === color} onClick={() => setCoat(color)}>{coat === color && <Check size={14} />}</button>)}
                </div>
                <span className="control-hint"><Move3d size={14} /> DRAG TO ROTATE · SCROLL TO ZOOM</span>
              </div>
            </div>
            <div className="studio-canvas-wrap">
              <div className="orbit-label orbit-label-top">CAT STUDIO <span>✳</span></div>
              <div className="studio-orbit studio-orbit-one" />
              <div className="studio-orbit studio-orbit-two" />
              {studioVisible ? <CatStage coat={coat} /> : <div className="studio-loading" aria-hidden="true" />}
              <div className="studio-caption"><span>01 / 04</span><span>A STUDY IN CAT</span></div>
            </div>
            <div className="studio-asterisk" aria-hidden="true">✳</div>
          </div>
        </section>

        <section className="story-section section-wrap" id="stories">
          <div className="section-topline"><div className="section-kicker"><span>04</span><span className="kicker-line" /> NOTES FROM THE FELINE WORLD</div><a href="#gallery" className="underlined-link">All stories <ArrowRight size={15} /></a></div>
          <div className="story-grid">
            <div className="story-image"><img src={photos.story} alt="A cat looking toward the late afternoon light" loading="lazy" /><span className="image-note">A SMALL MOMENT, KEPT</span></div>
            <article className="story-copy">
              <span className="story-category"><span /> FIELD NOTE No. 008 · 6 MIN READ</span>
              <h2>The art of<br /><em>doing nothing.</em></h2>
              <p>On a cat's ability to make an ordinary afternoon feel like the only thing on the calendar.</p>
              <a href="#care" className="round-arrow-link" aria-label="Read the story"><ArrowUpRight size={21} /></a>
              <span className="story-bottom-note">WORDS FOR SLOWER DAYS</span>
            </article>
          </div>
          <div className="story-caption"><span>STORIES FOR THE CAT-OBSESSED, AND THE CAT-CURIOUS.</span><ArrowDownRight size={18} /></div>
        </section>

        <section className="care-section" id="care">
          <div className="section-wrap care-wrap">
            <div className="care-heading">
              <div><div className="section-kicker"><span>05</span><span className="kicker-line" /> A LITTLE CARE GOES A LONG WAY</div><h2>Good care.<br /><em>Good company.</em></h2></div>
              <p>The best care starts with paying attention. A few grounded notes for the long, lovely life you build together.</p>
            </div>
            <div className="care-list">
              {[
                { title: 'Food & feeding', tag: 'NUTRITION', detail: 'Cats thrive on consistent meals, fresh water, and food that suits their age and health. When in doubt, make your vet part of the conversation.' },
                { title: 'Health, without the guesswork', tag: 'WELLBEING', detail: 'Routine checkups help catch small changes early. Keep an eye on appetite, energy, litter habits, and the little ways your cat says “something feels different.”' },
                { title: 'Make room for their nature', tag: 'BEHAVIOUR', detail: 'Scratching, climbing, hiding, and play are not bad habits. They are cat habits. A good environment gives those instincts somewhere safe to land.' },
              ].map((item, index) => <article className={`care-row ${openCare === index ? 'care-row-open' : ''}`} key={item.title}>
                <button className="care-row-trigger" aria-expanded={openCare === index} onClick={() => setOpenCare(openCare === index ? null : index)}>
                  <span className="care-number">0{index + 1}</span><span className="care-title">{item.title}</span><span className="care-tag">{item.tag}</span><ChevronDown size={19} className="care-chevron" />
                </button>
                {openCare === index && <div className="care-detail"><p>{item.detail}</p><a href="#adopt">More thoughtful notes <ArrowRight size={15} /></a></div>}
              </article>)}
            </div>
            <p className="care-disclaimer"><Leaf size={14} /> These notes are for learning, not a substitute for advice from your veterinarian.</p>
          </div>
        </section>

        <section className="gallery-section section-wrap" id="gallery">
          <div className="section-topline"><div className="section-kicker"><span>06</span><span className="kicker-line" /> THE CAT EYE</div><span className="section-aside">A field collection</span></div>
          <div className="gallery-heading"><h2>Proof of <em>magic.</em></h2><p>Some things are better seen than explained.</p></div>
          <div className="gallery-grid">
            {[photos.gallery1, photos.gallery2, photos.gallery3].map((image, index) => <button className={`gallery-tile gallery-tile-${index + 1}`} key={image} onClick={() => setSelectedImage(image)} aria-label={`Open cat photograph ${index + 1}`}><img src={image} alt={['A cat resting in a patch of sunlight', 'A curious cat portrait', 'A cat looking out at the world'][index]} loading="lazy" /><span className="gallery-overlay"><span>FRAME 0{index + 1}</span><ArrowUpRight size={19} /></span></button>)}
          </div>
          <div className="gallery-foot"><span>COLLECTED WITH CARE, SHARED WITH LOVE.</span><span>03 / ∞</span></div>
        </section>

        <section className="adopt-section" id="adopt">
          <div className="adopt-background" />
          <div className="section-wrap adopt-wrap">
            <div className="section-kicker light-kicker"><span>07</span><span className="kicker-line" /> SOMEONE IS WAITING</div>
            <div className="adopt-intro"><h2>Find your<br /><em>plus-one.</em></h2><div><p>The best story might be the one you write together. Meet a few cats looking for a place to call theirs.</p><a href="mailto:hello@catverse.com?subject=Adoption%20enquiry" className="button button-lime">Find your cat <ArrowUpRight size={16} /></a></div></div>
            <div className="adopt-grid">
              {cats.map((cat) => <article className="adopt-card" key={cat.name}>
                <div className="adopt-photo"><img src={cat.image} alt={`${cat.name}, a cat looking for a home`} loading="lazy" /><span className="adopt-open">MEET {cat.name.toUpperCase()} <ArrowUpRight size={15} /></span></div>
                <div className="adopt-card-bottom"><div><h3>{cat.name}</h3><p>{cat.details}</p></div><button className={`adopt-heart ${favorites.includes(cat.name) ? 'is-favorite' : ''}`} aria-label={`${favorites.includes(cat.name) ? 'Remove' : 'Add'} ${cat.name} ${favorites.includes(cat.name) ? 'from' : 'to'} favorites`} onClick={() => toggleFavorite(cat.name)}><Heart size={18} fill={favorites.includes(cat.name) ? 'currentColor' : 'none'} /></button></div>
                <div className="adopt-traits">{cat.traits.map((trait) => <span key={trait}>{trait}</span>)}</div>
              </article>)}
            </div>
            <div className="adopt-note"><PawPrint size={17} /> Every adoption starts with a conversation. We’ll help you find the right local shelter.</div>
          </div>
        </section>

        <section className="closing-section section-wrap">
          <div className="closing-mark"><PawPrint size={24} /></div>
          <p>THE WORLD IS BETTER<br />WITH A CAT IN IT.</p>
          <button className="closing-share" onClick={shareResult}>{copied ? <><Check size={17} /> COPIED</> : <>PASS IT ON <ArrowUpRight size={17} /></>}</button>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main section-wrap">
          <div className="footer-brand"><a href="#top" className="wordmark"><span className="brand-icon"><PawPrint size={18} /></span><span>CATVERSE<span className="wordmark-dot">.</span></span></a><p>A field guide for living<br />well with cats.</p><span className="footer-location">MADE FOR THE CAT-CURIOUS · 2026</span></div>
          <div className="footer-links"><span>GO WANDER</span><a href="#breeds">The breed index</a><a href="#cat-studio">Cat studio</a><a href="#care">Care notes</a><a href="#gallery">The cat eye</a></div>
          <div className="footer-links"><span>FIND YOUR WAY</span><a href="#stories">Field notes</a><a href="#adopt">Adoption</a><a href="#top">Back to the top ↑</a></div>
          <div className="footer-news"><span>NOTES FROM THE CATVERSE</span><p>A monthly letter for the incurably cat-curious.</p><a href="mailto:hello@catverse.com?subject=CATVERSE%20letter">Get the occasional note <ArrowUpRight size={16} /></a></div>
        </div>
        <div className="footer-bottom section-wrap"><span>© CATVERSE 2026</span><span>MADE WITH A LITTLE WONDER <span className="footer-star">✳</span></span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>

      {selectedImage && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Cat photograph viewer" onClick={() => setSelectedImage(null)}><button className="lightbox-close" onClick={() => setSelectedImage(null)} aria-label="Close photograph"><X size={22} /></button><button className="lightbox-prev" onClick={(event) => { event.stopPropagation(); setSelectedImage((current) => current === photos.gallery1 ? photos.gallery3 : current === photos.gallery2 ? photos.gallery1 : photos.gallery2); }} aria-label="Previous photo"><ArrowLeft size={20} /></button><img src={selectedImage} alt="Full-size cat photograph" onClick={(event) => event.stopPropagation()} /><button className="lightbox-next" onClick={(event) => { event.stopPropagation(); setSelectedImage((current) => current === photos.gallery1 ? photos.gallery2 : current === photos.gallery2 ? photos.gallery3 : photos.gallery1); }} aria-label="Next photo"><ArrowRight size={20} /></button></div>}
    </div>
  );
}

export default App;
