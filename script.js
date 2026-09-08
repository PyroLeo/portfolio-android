const animateText = document.getElementsByClassName("animation");

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZqwertyuiopasdfghjklzxcvbnm1234567890";

for (let i = 0; i < animateText.length; i++){

const text = animateText[i];
const oldText = text.innerText;
let buzy = false;

text.onpointerover = ev => {
    if (buzy) return;

    let iterations = 0;
    buzy = true
    const interval = setInterval(() => {
        ev.target.innerText = oldText.split("")
        .map((letter, index) => {
            if(index < iterations){
                return oldText[index]
            }
            return letters[Math.floor(Math.random() * 62)]
        })
        .join("");

        if(iterations >= oldText.length) {
            buzy=false
            clearInterval(interval);
        }
        iterations += 1/3;
    }, 30);
    }
}
const CANVAS = document.querySelector("#canvas");
const btnEl = document.querySelector(".btn");
const ctx = CANVAS.getContext("2d");
const NUM_PARTICLES = 50;
const MAX_Z = 2;
const MAX_R = 2;
const Z_SPD = 2;
const PARTICLES = [];
let W,
  H,
  XO,
  YO = 0;

let isGoing = false;

class Particle {
  constructor(x, y, z) {
    this.pos = new Vector(x, y, z);
    const X_VEL = 0,
      Y_VEL = 0,
      Z_VEL = -Z_SPD;
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

const createParticles = () => {
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const X = Math.random() * W,
      Y = Math.random() * H,
      Z = Math.random() * MAX_Z;
    PARTICLES.push(new Particle(X, Y, Z));
  }
};

function render() {
  for (let i = 0; i < PARTICLES.length; i++) {
    PARTICLES[i].render();
  }
}

function loop() {
  requestAnimationFrame(loop);
  if (isGoing) {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, W, H);
  render();
  } else {
    ctx.clearRect(0, 0, W, H);
  }
}
const onBtnClick = (ev) => {
  if (isGoing) {
    isGoing = false;
    btnEl.classList.remove("active");
  } else {
    isGoing = true;
    btnEl.classList.add("active");
  }
  console.log('changed to', isGoing)
};

const init = () => {
  btnEl.addEventListener('click', onBtnClick);
  canvas.width = W = btnEl.offsetWidth;
  canvas.height = H = btnEl.offsetHeight;
  XO = W / 2;
  YO = H / 2;
  createParticles();
  loop();
};

init();
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
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
      setTimeout(() => {
      const heroSection = document.querySelector('.section-hero');
      if (heroSection) {
        // Lock out the section from display and layout
        heroSection.classList.add('is-hidden');
      }
      
      // Reset scroll position to top of the newly active section
      window.scrollTo(0, 0);
    }, 800);
    });
  });
}
document.addEventListener('DOMContentLoaded', () => {
  const progressBars = document.querySelectorAll('.animated-progress');

  const observerOptions = {
    root: null,       // Uses the viewport
    threshold: 1    // Triggers when 100% of the bar is visible
  };

  const fillProgress = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target;
        const targetValue = progressBar.getAttribute('data-target');

        // Animate fill by setting value to target
        progressBar.value = targetValue;

        // Stop observing once animated
        observer.unobserve(progressBar);
      }
    });
  };

  const observer = new IntersectionObserver(fillProgress, observerOptions);

  progressBars.forEach(bar => {
    observer.observe(bar);
  });
});