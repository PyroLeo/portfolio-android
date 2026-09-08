// 1. Text Animation
const animateText = document.getElementsByClassName("animation");
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

for (let i = 0; i < animateText.length; i++) {
    const text = animateText[i];
    const oldText = text.innerText;
    let busy = false;

    text.onpointerover = ev => {
        if (busy) return;

        let iterations = 0;
        busy = true;
        const interval = setInterval(() => {
            ev.target.innerText = oldText.split("")
                .map((letter, index) => {
                    if (index < iterations) {
                        return oldText[index];
                    }
                    return letters[Math.floor(Math.random() * 62)];
                })
                .join("");

            if (iterations >= oldText.length) {
                busy = false;
                clearInterval(interval);
            }
            iterations += 1 / 3;
        }, 30);
    };
}

// 2. Canvas Particle Background
const CANVAS = document.querySelector("#canvas");
const btnEl = document.querySelector(".btn");

if (CANVAS && btnEl) {
    const ctx = CANVAS.getContext("2d");
    const NUM_PARTICLES = 50;
    const MAX_Z = 2;
    const MAX_R = 2;
    const Z_SPD = 2;
    const PARTICLES = [];
    let W, H, XO, YO = 0;
    let isGoing = false;

    class Vector {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }
        add(v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
        }
        scale(n) {
            this.x *= n;
            this.y *= n;
            this.z *= n;
        }
    }

    function to2d(v) {
        const X_COORD = v.x - XO,
            Y_COORD = v.y - YO,
            PX = X_COORD / v.z,
            PY = Y_COORD / v.z;
        return [PX + XO, PY + YO];
    }

    class Particle {
        constructor(x, y, z) {
            this.pos = new Vector(x, y, z);
            const X_VEL = 0, Y_VEL = 0, Z_VEL = -Z_SPD;
            this.vel = new Vector(X_VEL, Y_VEL, Z_VEL);
            this.vel.scale(0.01);
            this.fill = "rgba(255,255,255,0.3)";
            this.stroke = this.fill;
        }

        update() {
            this.pos.add(this.vel);
        }

        render() {
            const PIXEL = to2d(this.pos),
                X = PIXEL[0],
                Y = PIXEL[1],
                R = ((MAX_Z - this.pos.z) / MAX_Z) * MAX_R;

            if (X < 0 || X > W || Y < 0 || Y > H) this.pos.z = MAX_Z;

            this.update();
            ctx.beginPath();
            ctx.fillStyle = this.fill;
            ctx.strokeStyle = this.stroke;
            ctx.arc(X, PIXEL[1], R, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    const createParticles = () => {
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const X = Math.random() * W,
                Y = Math.random() * H,
                Z = Math.random() * MAX_Z;
            PARTICLES.push(new Particle(X, Y, Z));
        }
    };

    function renderParticles() {
        for (let i = 0; i < PARTICLES.length; i++) {
            PARTICLES[i].render();
        }
    }

    function loop() {
        requestAnimationFrame(loop);
        if (isGoing) {
            ctx.fillStyle = "rgba(0,0,0,0.15)";
            ctx.fillRect(0, 0, W, H);
            renderParticles();
        } else {
            ctx.clearRect(0, 0, W, H);
        }
    }

    const onBtnClick = () => {
        isGoing = !isGoing;
        btnEl.classList.toggle("active", isGoing);
    };

    const initCanvas = () => {
        btnEl.addEventListener('click', onBtnClick);
        // FIXED: Capitalized CANVAS to match const definition
        CANVAS.width = W = btnEl.offsetWidth;
        CANVAS.height = H = btnEl.offsetHeight;
        XO = W / 2;
        YO = H / 2;
        createParticles();
        loop();
    };

    initCanvas();
}

// 3. Page Scroll Handlers
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.remove('is-scrollable');
    document.documentElement.classList.remove('is-scrollable');
    window.scrollTo(0, 0);
});

const scrollBtn = document.getElementById('toggle-scroll-btn');
if (scrollBtn) {
    scrollBtn.addEventListener('click', () => {
        document.body.classList.add('is-scrollable');
        document.documentElement.classList.add('is-scrollable');

        requestAnimationFrame(() => {
            const nextSection = document.getElementById('next-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            setTimeout(() => {
                const heroSection = document.querySelector('.section-hero');
                if (heroSection) {
                    heroSection.classList.add('is-hidden');
                }
                window.scrollTo(0, 0);
            }, 800);
        });
    });
}

// 4. Animated Progress Bars
document.addEventListener('DOMContentLoaded', () => {
    const progressBars = document.querySelectorAll('.animated-progress');
    const observerOptions = { root: null, threshold: 1 };

    const fillProgress = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                progressBar.value = progressBar.getAttribute('data-target');
                observer.unobserve(progressBar);
            }
        });
    };

    const observer = new IntersectionObserver(fillProgress, observerOptions);
    progressBars.forEach(bar => observer.observe(bar));
});

// 5. GSAP Star Rating Component (Fixed Filtering & Multi-click)
document.querySelectorAll('.rating').forEach(rating => {
    let entries = Array.from(rating.querySelectorAll('li'));

    entries.forEach((entry, index) => {
        entry.addEventListener('click', e => {
            e.preventDefault();

            // Due to flex-direction: row-reverse, index 0 is visual 5 (far right), 
            // and index 4 is visual 1 (far left).
            // Visual Stars <= clicked index should activate:
            let active = entries.filter((el, i) => i >= index);
            // Visual Stars > clicked index should deactivate:
            let inactive = entries.filter((el, i) => i < index);

            // 1. BOUNCING ANIMATION (Activate / Raise Rating)
            if (active.length) {
                // Reverse to animate in left-to-right natural reading order
                let targets = active.slice().reverse();

                gsap.killTweensOf(targets);
                targets.forEach(el => el.classList.add('active', 'activeColor'));

                gsap.set(targets, {
                    '--star-scale': 0,
                    '--star-y': 0,
                    '--star-o': 1,
                    '--star-blur': 0
                });

                gsap.to(targets, {
                    '--star-scale': 1,
                    '--dot-scale': 0,
                    duration: 0.9,
                    ease: 'elastic.out(1, 0.7)',
                    stagger: 0.03
                });
            }

            // 2. BREAK & DROP ANIMATION (Deactivate / Lower Rating)
            if (inactive.length) {
                let targetsToDrop = inactive.filter(el => el.classList.contains('active'));

                if (targetsToDrop.length) {
                    gsap.killTweensOf(targetsToDrop);

                    targetsToDrop.forEach(el => el.classList.remove('activeColor'));

                    // Shatter pieces
                    gsap.to(targetsToDrop, {
                        '--star-before-r': -20,
                        '--star-before-y': -8,
                        '--star-after-r': 20,
                        '--star-after-y': 8,
                        duration: 0.65
                    });

                    // Fall down & fade out
                    gsap.to(targetsToDrop, {
                        '--star-o': 0,
                        '--star-blur': 10,
                        '--star-y': 48,
                        '--dot-scale': 0.8,
                        duration: 0.5,
                        delay: 0.15,
                        onComplete() {
                            targetsToDrop.forEach(el => el.classList.remove('active'));
                            gsap.set(targetsToDrop, {
                                '--star-before-r': 0,
                                '--star-before-y': 0,
                                '--star-after-r': 0,
                                '--star-after-y': 0,
                                '--star-scale': 0,
                                '--star-y': 0,
                                '--star-o': 1,
                                '--star-blur': 0
                            });
                        }
                    });
                }
            }
        });
    });
});