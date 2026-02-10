// --- 1. CONFIGURATION ---
const MAX_TIME_MINUTES = 10; 
const START_TIME = Date.now();
const WILD_EVENT_INTERVAL = 45000; 

// --- Projects Page
const projects = [
    {
        id: 0,
        title: "Obelisk", 
        preview: "Obelisk/side-white-88-Large.jpeg",        
        images: [
            
            "Obelisk/Language-Large.jpeg",
            "Obelisk/kitchen-3-wide-Large.jpeg",
            "Obelisk/opening-iris-Large.jpeg",
            "Obelisk/using-arms-open-Large.jpeg",
            "Obelisk/IMG_0739.mp4",
            "Obelisk/cup-with-water-Large.jpeg",
            "Obelisk/starting-process-Large.jpeg",
            "Obelisk/woman-using-no-chandelier-Large.jpeg",
            "Obelisk/ring-10s.mp4",
            "Obelisk/three-obelisks.jpeg",
            "Obelisk/glass-with-tea-Large.jpeg",
            "Obelisk/side-dim-Large.jpeg",
            "Obelisk/top-dim-Large.jpeg",
            "Obelisk/exploded-fixed.png",
            "Obelisk/charcoal-Large.jpeg",

        ],
        bio: "In so many of our lives, stillness is missing. The weekday morning is a rushed process: throwing on clothes, a quick cup of coffee or tea and out to start one’s day. Obelisk aims to bring back a careful moment of rest. Obelisk is more than a morning routine, it is an innovative use of robotics that brings together the ceremony of tea drinking with meditation. Tea is inherently spiritual, both in substance and pratice. The beverage is consumed by an estimated 2 billion people everyday in countless ceremonies. As the revered Buddhist monk Popchong Sunim puts it, “Tea is a path to the universe.” Obelisks too are paths to the universe; totems, spires and obelisks were built through millennia by disparate cultures, often with the intent of asking for or offering something. Egyptian, American Indian and Aztec culture, all constructed these objects to bring them closer with their deities. Throughout the design process, I held the great minimalists in mind. The goal was to create a device that doesn’t demand attention, in size or form, that fits perfectly into the user’s space. Below are some of my design references."
    },

    {
        id: 1,
        title: "Graph", 
        preview: "https://example.com/some-online-image.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 2,
        title: "Semiotics and Understanding", 
        preview: "https://example.com/some-online-image.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 3,
        title: "Content Exoskeleton", 
        preview: "https://example.com/some-online-image.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 4,
        title: "Camper Magazine", 
        preview: "https://example.com/some-online-image.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

        {
        id: 5,
        title: "Scorched Wine Rack", 
        preview: "https://example.com/some-online-image.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    }
    
];

// --- 2. INITIALIZATION ---
const listView = document.getElementById('list-view');
const detailView = document.getElementById('detail-view');
const homeBtn = document.getElementById('home-btn');
const hoverImg = document.getElementById('hover-reveal');

// Render List
projects.forEach(p => {
    const el = document.createElement('div');
    el.className = 'project-item entropy-element'; 
    el.classList.add('title-target'); 
    el.id = `proj-item-${p.id}`;

    const a = document.createElement('a');
    a.href = "#";
    a.innerText = p.title;
    a.dataset.originalText = p.title; 
    
    a.onmouseover = () => showImg(p.preview);
    a.onmouseout = () => hideImg();
    a.onclick = () => openProject(p.id);

    el.appendChild(a);
    listView.appendChild(el);
});

// --- 3. NAVIGATION ---
function openProject(id) {
    // Hide all project detail sections
    document.querySelectorAll('#detail-view > section').forEach(sec => sec.style.display = 'none');

    // Show the selected project detail section
    const section = document.getElementById(`project-detail-${id}`);
    if (section) section.style.display = 'block';

    // Show detail view, hide list view
    listView.style.display = 'none';
    detailView.style.display = 'flex';
    homeBtn.style.display = 'block';
    hoverImg.style.opacity = 0;

    // Optionally: re-init physics for new elements
    section.querySelectorAll('.drift-text, .drift-media, img, h1, p').forEach(el => {
        physicsState.delete(el);
        initPhysics(el);
    });
}

function goHome() {
    const listView = document.getElementById('list-view');
    const detailView = document.getElementById('detail-view');
    const homeBtn = document.getElementById('home-btn');

    // Switch visibility
    listView.style.display = 'flex'; // Or 'block', depending on your CSS preference
    detailView.style.display = 'none';
    homeBtn.style.display = 'none';
}

// --- 4. HOVER IMAGE ---
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverImg.style.left = (mouseX - 50) + 'px'; // Offset 30px left
    hoverImg.style.top = mouseY + 'px';
});

function showImg(src) { hoverImg.src = src; hoverImg.style.opacity = 1; }
function hideImg() { hoverImg.style.opacity = 0; }


// --- 5. THE PHYSICS ENGINE ---

const physicsState = new Map();

function initPhysics(element) {
    if (!physicsState.has(element)) {
        let vx = Math.random() - 0.5;
        let vy = Math.random() - 0.5;
        const mag = Math.sqrt(vx*vx + vy*vy) || 1;
        vx = vx / mag;
        vy = vy / mag;
        
        let startX = 0;
        let startY = 0;
        let startRot = 0;

        const now = Date.now();
        const elapsed = (now - START_TIME) / 1000; 
        
        if (elapsed > 1) { 
            const maxSeconds = MAX_TIME_MINUTES * 60;
            const chaos = Math.min(elapsed / maxSeconds, 1.0);
            const spreadX = (window.innerWidth * 0.01) * chaos;
            const spreadY = (window.innerHeight * 0.01) * chaos;
            startX = (Math.random() - 0.5) * 2 * spreadX;
            startY = (Math.random() - 0.5) * 2 * spreadY;
            startRot = (Math.random() - 0.5) * (chaos * 30); 
        }

        physicsState.set(element, {
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            rotation: startRot,
            vr: (Math.random() - 0.5) * 0.1, 
            isWild: false
        });
    }
    return physicsState.get(element);
}

// --- 6. DATA ROT ENGINE ---
const GLITCH_CHARS = 'XV0#/_<>[]{}—=+*^?@!&';
let currentRotInterval = 15000; 
let nextRotTime = Date.now() + currentRotInterval; 

function triggerDataRot(element) {
    const link = element.querySelector('a');
    if (!link) return;
    const originalText = link.dataset.originalText;
    if (!originalText) return; 
    
    if (link.rotTimeout) clearTimeout(link.rotTimeout);
    const numGlitches = Math.floor(Math.random() * 3) + 2;
    let chars = originalText.split('');
    
    for(let i=0; i<numGlitches; i++) {
        const index = Math.floor(Math.random() * chars.length);
        chars[index] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
    }
    
    link.innerText = chars.join('');
    const duration = 3000 + Math.random() * 12000;
    link.rotTimeout = setTimeout(() => { link.innerText = originalText; }, duration);
}

// WILD EVENT TRIGGER
setInterval(() => {
    // Only target elements that are NOT in the detail view
    // This prevents the project title/bio from suddenly falling while you are reading them
    const candidates = Array.from(document.querySelectorAll('.title-target:not(.wild)'))
        .filter(el => el.offsetParent !== null && el.closest('#detail-view') === null);

    if (candidates.length > 0) {
        const victim = candidates[Math.floor(Math.random() * candidates.length)];
        const state = initPhysics(victim);
        state.isWild = true;
        victim.classList.add('wild');
        state.vx = (Math.random() - 0.5) * 15; 
        state.vy = (Math.random() - 1.0) * 15; 
        state.vr = (Math.random() - 0.5) * 10; 
    }
}, WILD_EVENT_INTERVAL);


// --- MAIN LOOP ---
function gameLoop() {
    const now = Date.now();
    const elapsedTotal = (now - START_TIME) / 1000; 
    const maxSeconds = MAX_TIME_MINUTES * 60;
    let chaos = Math.min(elapsedTotal / maxSeconds, 1.0); 

    const winW = window.innerWidth;
    const winH = window.innerHeight;

    const targets = document.querySelectorAll('.entropy-element');
    
    targets.forEach(el => {
        if (el.offsetParent === null) return;

        const state = initPhysics(el);
        const rect = el.getBoundingClientRect();
        
        // CHECK: Is this an item in the Project Detail View?
        const isDetailItem = el.closest('#detail-view') !== null;

        if (state.isWild) {
            // --- 1. WILD PHYSICS (Falling/Exploding) ---
            state.vx *= 0.995; 
            state.vy *= 0.995;
            state.vy += 0.01; 
            state.vr *= 0.99;

            state.x += state.vx;
            state.y += state.vy;
            state.rotation += state.vr;

            // Screen Edge Bounce
            if (rect.left <= 0) { state.x += (0 - rect.left); state.vx = Math.abs(state.vx) * 0.9; } 
            else if (rect.right >= winW) { state.x -= (rect.right - winW); state.vx = -Math.abs(state.vx) * 0.9; }
            if (rect.top <= 0) { state.y += (0 - rect.top); state.vy = Math.abs(state.vy) * 0.9; } 
            else if (rect.bottom >= winH) { state.y -= (rect.bottom - winH); state.vy = -Math.abs(state.vy) * 0.8; }
            
        } else if (isDetailItem) {
            // --- 2. PROJECT VIEW: CONSTRAINED DRIFT ---
            
            // Check if it is text or media based on the tag we added in openProject
            const isText = el.dataset.type === 'text' || el.id === 'detail-title' || el.id === 'detail-bio';
            
            // CONFIGURATION
            const driftSpeed = 0.00001; 
            const rangeLimit = 30; // Reduce drift range for detail view

            // MOVE
            state.x += state.vx * driftSpeed;
            state.y += state.vy * driftSpeed;

            // INVISIBLE BOX (Bounce)
            if (state.x > rangeLimit) { state.x = rangeLimit; state.vx = -Math.abs(state.vx); }
            if (state.x < -rangeLimit) { state.x = -rangeLimit; state.vx = Math.abs(state.vx); }
            
            if (state.y > rangeLimit) { state.y = rangeLimit; state.vy = -Math.abs(state.vy); }
            if (state.y < -rangeLimit) { state.y = -rangeLimit; state.vy = Math.abs(state.vy); }

            // ROTATION
            // Text rotates LESS (easier to read), Media rotates MORE (cooler)
            const maxRot = isText ? 1 : 2; 

            state.rotation += state.vr * chaos;
            if (state.rotation > maxRot) { state.rotation = maxRot; state.vr *= -1; }
            if (state.rotation < -maxRot) { state.rotation = -maxRot; state.vr *= -1; }

            } else {
            // --- 3. HOME VIEW: STANDARD DRIFT ---
            const currentSpeed = 0.0005 + (chaos * 0.02); 
            
            state.x += state.vx * currentSpeed; 
            state.y += state.vy * currentSpeed;
            state.rotation += state.vr * chaos;

            // Sticky Borders (prevents leaving screen)
            if (rect.left <= 0) state.x += (0 - rect.left);
            else if (rect.right >= winW) state.x -= (rect.right - winW);
            if (rect.top <= 0) state.y += (0 - rect.top);
            else if (rect.bottom >= winH) state.y -= (rect.bottom - winH);
        }

        el.style.transform = `translate(${state.x}px, ${state.y}px) rotate(${state.rotation}deg)`;
    });

    // Data Rot Trigger
    if (now > nextRotTime) {
        const visibleTitles = Array.from(document.querySelectorAll('.title-target'))
            .filter(el => el.offsetParent !== null); 
        if (visibleTitles.length > 0) {
            const victim = visibleTitles[Math.floor(Math.random() * visibleTitles.length)];
            triggerDataRot(victim);
        }
        nextRotTime = now + currentRotInterval;
        currentRotInterval = Math.max(1000, currentRotInterval - 2500);
    }
    
    // (Glitch Squares removed per request)

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
