// --- 1. CONFIGURATION ---
const MAX_TIME_MINUTES = 10; 
const START_TIME = Date.now();
const WILD_EVENT_INTERVAL = 45000; 

// --- Projects Page
const projects = [
    {
        id: 0,
        title: "Obelisk", 
        preview: "Obelisk/side-white-88.jpg",        
        images: [
            
            "Obelisk/Language-Large.jpeg",
            "Obelisk/kitchen-3-wide-Large.jpeg",
            "Obelisk/opening-iris-Large.jpeg",
            "Obelisk/using-arms-open-Large.jpeg",
            "Obelisk/IMG_0739.mp4",
            "Obelisk/cup-with-water-Large.jpeg",
            "Obelisk/starting-process-Large.jpeg",
            "Obelisk/woman-using-no-chandelier-Large.jpeg",
            "Obelisk/riag-10s.mp4",
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
        preview: "Graph/shadow.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 2,
        title: "Semiotics and Understanding", 
        preview: "Chair/chair_black.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 3,
        title: "Content Exoskeleton", 
        preview: "Exo Skeleton/exo.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

    {
        id: 4,
        title: "Camper Magazine", 
        preview: "Magazine/camper.jpg", 
        images: [
            "https://example.com/detail-1.jpg",
            "https://example.com/detail-2.jpg"
        ],
        bio: "You can also use online links for images if you don't want to host them yourself."
    },

        {
        id: 5,
        title: "Scorched Wine Rack", 
        preview: "Wine Rack/winerack.jpg", 
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

    detailViewOpenedAt = Date.now();
    detailDataRotStarted = false;
    detailDataRotStartTime = Date.now();

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
    hoverImg.style.left = (mouseX - 100) + 'px'; // Offset 100px left
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

// --- Data Rot Timers ---
let lastBodyRot = 0;
let lastTitleRot = 0;
const bodyRotInterval = 10000;   // every 10 seconds
const titleRotInterval = 20000; // every 20 seconds
const rotDuration = 4000;       // rot lasts 4 seconds

function triggerDataRot(element, minGlitch = 3, maxGlitch = 7) {
    if (!element) return;
    
    // 1. Save the pristine HTML (not innerText) so we can restore it perfectly
    if (!element.dataset.originalHtml) {
        element.dataset.originalHtml = element.innerHTML;
    }
    
    const GLITCH_CHARS = 'XV0#/_<>[]{}—=+*^?@!&';
    const numGlitches = Math.floor(Math.random() * (maxGlitch - minGlitch + 1)) + minGlitch;
    
    // 2. Use a TreeWalker to safely find pure text nodes, ignoring HTML tags like <b> and <br>
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        // Only grab nodes that actually have text inside them
        if (node.nodeValue.trim().length > 0) {
            textNodes.push(node);
        }
    }
    
    // If there is no text to glitch, stop here
    if (textNodes.length === 0) return;

    // 3. Apply the glitches randomly ONLY across the safe text nodes
    for (let i = 0; i < numGlitches; i++) {
        const randomNode = textNodes[Math.floor(Math.random() * textNodes.length)];
        let chars = randomNode.nodeValue.split('');
        const index = Math.floor(Math.random() * chars.length);
        
        chars[index] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        randomNode.nodeValue = chars.join('');
    }

    // 4. Restore the perfect, original HTML after the duration ends
    setTimeout(() => {
        element.innerHTML = element.dataset.originalHtml;
    }, rotDuration);
}

// --- In your main loop or a setInterval ---
function dataRotLoop() {
    const now = Date.now();
    const detailView = document.getElementById('detail-view');
    if (!detailView || detailView.style.display === 'none') return;

    // Body text (p.drift-text)
    if (now - lastBodyRot > bodyRotInterval) {
        const bodyTexts = Array.from(detailView.querySelectorAll('p.drift-text'))
            .filter(el => el.offsetParent !== null); // <-- ADD THIS LINE

        if (bodyTexts.length > 0) {
            const victim = bodyTexts[Math.floor(Math.random() * bodyTexts.length)];
            triggerDataRot(victim, 2, 12);
        }
        lastBodyRot = now;
    }

    // Title (h1.drift-text)
    if (now - lastTitleRot > titleRotInterval) {
        const titles = Array.from(detailView.querySelectorAll('h1.drift-text'))
            .filter(el => el.offsetParent !== null); // <-- ADD THIS LINE

        if (titles.length > 0) {
            const victim = titles[Math.floor(Math.random() * titles.length)];
            triggerDataRot(victim, 2, 4); 
        }
        lastTitleRot = now;
    }
}

// Call this loop with setInterval
setInterval(dataRotLoop, 1000);

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
            // --- PROJECT VIEW: FREE-FLOWING ENTROPY WITH PARALLAX ---
            const timeSinceOpen = detailViewOpenedAt ? (Date.now() - detailViewOpenedAt) : 0;
            
            if (timeSinceOpen > 5000) { 
                // At 10s, it's 0. At 12.5s, it's 0.5. At 15s+, it caps at 1.0.
                const fadeMultiplier = Math.min((timeSinceOpen - 5000) / 2500, 1.0);

                const isText = el.classList.contains('drift-text');
                
                // Multiply your base speed by the fader
                // Note: If the final speed is still too fast, lower the 0.001 and 0.0025
                const driftSpeed = (isText ? 0.001 : 0.005) * fadeMultiplier;
                
                // Movement
                state.x += state.vx * driftSpeed;
                state.y += state.vy * driftSpeed;

                // --- Rotation ---
                // NEW: Allow a much wider, natural tilt (5 degrees for text, 10 for images)
                const maxRot = isText ? 5 : 10;
                
                // NEW: Dropped the rotation multiplier down to 0.01 so the tilt is incredibly gradual
                state.rotation += (state.vr * 0.01) * fadeMultiplier;
                
                if (state.rotation > maxRot) { state.rotation = maxRot; state.vr *= -1; }
                if (state.rotation < -maxRot) { state.rotation = -maxRot; state.vr *= -1; }
            }

        } else {
            // --- 3. HOME VIEW: STANDARD DRIFT ---
            const currentSpeed = 0.00001 + (chaos * 0.02); 
            
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

let detailViewOpenedAt = 0;

let detailDataRotStarted = false;
let detailDataRotStartTime = 0;
let detailDataRotInterval = 10000; // 10 seconds
let detailDataRotDuration = 3000;  // 3 seconds
