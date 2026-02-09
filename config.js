// --- 1. CONFIGURATION ---
const MAX_TIME_MINUTES = 10; 
const START_TIME = Date.now();
const WILD_EVENT_INTERVAL = 45000; 

// --- PROJECTS MENU ---
// Since the content is now in HTML templates, we only need 
// the Title (for the link) and Preview (for the hover image) here.
const projects = [
    {
        id: 0,
        title: "Obelisk", 
        preview: "Obelisk/side-white-88-Large.jpeg"
    },
    {
        id: 1,
        title: "Graph", 
        preview: "https://example.com/some-online-image.jpg"
    },
    {
        id: 2,
        title: "Semiotics and Understanding", 
        preview: "https://example.com/some-online-image.jpg"
    },
    {
        id: 3,
        title: "Content Exoskeleton", 
        preview: "https://example.com/some-online-image.jpg"
    },
    {
        id: 4,
        title: "Camper Magazine", 
        preview: "https://example.com/some-online-image.jpg"
    },
    {
        id: 5,
        title: "Scorched Wine Rack", 
        preview: "https://example.com/some-online-image.jpg"
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
    // 1. Find the Template in the HTML
    const template = document.getElementById(`project-${id}-content`); 
    
    if (!template) {
        console.error(`No content found for Project ID ${id}. Check index.html <template> tags.`);
        return;
    }

    // 2. Clear current view
    detailView.innerHTML = ''; 

    // 3. Clone the content and inject it
    const clone = template.content.cloneNode(true);
    detailView.appendChild(clone);

    // 4. Setup Physics for the New Elements
    const newDrifters = detailView.querySelectorAll('.drift-text, .drift-media');
    
    newDrifters.forEach(el => {
        el.classList.add('entropy-element'); // Turn on the physics engine
        initPhysics(el); // Give it a starting push
        
        // Tag them so gameLoop knows to restrict text rotation
        if (el.classList.contains('drift-text')) {
             el.dataset.type = 'text'; 
        } else {
             el.dataset.type = 'media';
        }
    });

    // 5. Switch Screens
    listView.style.display = 'none';
    detailView.style.display = 'block'; 
    homeBtn.style.display = 'block';
    
    // Hide the hover image from the home screen
    hoverImg.style.opacity = 0;
}

// --- 4. HOVER IMAGE ---
let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    hoverImg.style.left = mouseX + 'px';
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
    const numGlitches = Math.floor(Math.random() * 5) + 2;
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
            const driftSpeed = 0.02; 
            const rangeLimit = 50;  

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
    
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);