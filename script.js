// Maggilicious interactive script

document.addEventListener('DOMContentLoaded', () => {
  /* --------------------------------------
   * Theme toggle
   * Save preference in localStorage
   */
  const themeBtn = document.getElementById('theme-toggle');
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.body.classList.add('dark');
    themeBtn.textContent = '☀️';
  }
  themeBtn.addEventListener('click', () => {
    const dark = document.body.classList.toggle('dark');
    if (dark) {
      localStorage.setItem('theme', 'dark');
      themeBtn.textContent = '☀️';
    } else {
      localStorage.removeItem('theme');
      themeBtn.textContent = '🌙';
    }
  });

  // Smooth scroll to menu when hero button clicked
  const exploreBtn = document.getElementById('explore-menu');
  exploreBtn.addEventListener('click', () => {
    const menu = document.getElementById('menu');
    menu.scrollIntoView({ behavior: 'smooth' });
  });

  /* --------------------------------------
   * Boil Timer
   */
  const timerInput = document.getElementById('timer-input');
  const timerDisplay = document.getElementById('timer-display');
  const timerStart = document.getElementById('timer-start');
  let timerInterval = null;

  function formatTime(totalSeconds) {
    const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function playBeep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = ctx.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.connect(ctx.destination);
      oscillator.start();
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // fallback: simple alert if AudioContext isn't available
      alert('Time\'s up!');
    }
  }

  timerStart.addEventListener('click', () => {
    // Clear existing timer if any
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    let minutes = parseInt(timerInput.value);
    if (isNaN(minutes) || minutes <= 0) minutes = 3;
    let remaining = minutes * 60;
    timerDisplay.textContent = formatTime(remaining);
    timerInterval = setInterval(() => {
      remaining--;
      timerDisplay.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerDisplay.textContent = '00:00';
        playBeep();
      }
    }, 1000);
  });

  /* --------------------------------------
   * Noodle Doodle Canvas
   */
  const doodleCanvas = document.getElementById('doodle-canvas');
  const dCtx = doodleCanvas.getContext('2d');
  const colorPicker = document.getElementById('doodle-color');
  const clearBtn = document.getElementById('doodle-clear');
  const saveBtn = document.getElementById('doodle-save');
  let drawing = false;
  let currentColor = colorPicker.value;

  colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
  });

  function getCanvasPos(event) {
    const rect = doodleCanvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  doodleCanvas.addEventListener('mousedown', (e) => {
    drawing = true;
    const pos = getCanvasPos(e);
    dCtx.beginPath();
    dCtx.moveTo(pos.x, pos.y);
  });

  doodleCanvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getCanvasPos(e);
    dCtx.lineTo(pos.x, pos.y);
    dCtx.strokeStyle = currentColor;
    dCtx.lineWidth = 2;
    dCtx.lineCap = 'round';
    dCtx.stroke();
  });

  function endDrawing() {
    if (drawing) {
      drawing = false;
      dCtx.closePath();
    }
  }
  doodleCanvas.addEventListener('mouseup', endDrawing);
  doodleCanvas.addEventListener('mouseleave', endDrawing);

  clearBtn.addEventListener('click', () => {
    dCtx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
  });

  saveBtn.addEventListener('click', () => {
    const dataURL = doodleCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'doodle.png';
    link.click();
  });

  /* --------------------------------------
   * Cravings Curve
   */
  const curveCanvas = document.getElementById('curve-canvas');
  const cCtx = curveCanvas.getContext('2d');
  let curveData = [];

  function generateCurveData() {
    curveData = [];
    // Generate 24 points representing hours in a day
    for (let i = 0; i < 24; i++) {
      // Use a sine wave for general shape and add slight randomness
      const value = Math.sin((i / 24) * Math.PI * 2) * 0.5 + 0.5 + Math.random() * 0.1;
      curveData.push(value);
    }
  }

  function drawCurve() {
    const w = curveCanvas.width;
    const h = curveCanvas.height;
    cCtx.clearRect(0, 0, w, h);
    // Draw axes
    cCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--card-border');
    cCtx.lineWidth = 1;
    cCtx.beginPath();
    cCtx.moveTo(40, 10);
    cCtx.lineTo(40, h - 20);
    cCtx.lineTo(w - 10, h - 20);
    cCtx.stroke();
    // Draw line
    cCtx.beginPath();
    const maxVal = 1.2;
    for (let i = 0; i < curveData.length; i++) {
      const x = 40 + (i / (curveData.length - 1)) * (w - 60);
      const y = h - 20 - (curveData[i] / maxVal) * (h - 40);
      if (i === 0) {
        cCtx.moveTo(x, y);
      } else {
        cCtx.lineTo(x, y);
      }
    }
    cCtx.strokeStyle = getComputedStyle(document.body).getPropertyValue('--secondary');
    cCtx.lineWidth = 2;
    cCtx.stroke();
  }

  // Initialize curve once and redraw on theme change
  generateCurveData();
  drawCurve();
  // Redraw curve when theme toggled to update colors
  themeBtn.addEventListener('click', () => {
    setTimeout(drawCurve, 50);
  });

  /* --------------------------------------
   * Noodle Lab
   */
  const broths = ['miso', 'spicy', 'soy', 'tonkotsu', 'curry'];
  const proteins = ['tofu', 'chicken', 'pork belly', 'mushrooms', 'shrimp'];
  const veggies = ['bok choy', 'corn', 'bean sprouts', 'seaweed', 'spinach'];
  const toppings = ['soft‑boiled egg', 'chili oil', 'sesame seeds', 'pickled ginger', 'nori'];
  const labRandomBtn = document.getElementById('lab-random');
  const labCurrent = document.getElementById('lab-current');
  const labSave = document.getElementById('lab-save');
  const labCopy = document.getElementById('lab-copy');
  const labClear = document.getElementById('lab-clear');
  const labSavedList = document.getElementById('lab-saved');
  let currentRecipe = null;

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomRecipe() {
    return {
      broth: pickRandom(broths),
      protein: pickRandom(proteins),
      veggies: pickRandom(veggies),
      topping: pickRandom(toppings),
    };
  }

  function renderCurrentRecipe() {
    if (currentRecipe) {
      labCurrent.textContent = `${currentRecipe.broth} broth with ${currentRecipe.protein}, ${currentRecipe.veggies} & ${currentRecipe.topping}`;
    } else {
      labCurrent.textContent = '';
    }
  }

  function loadSavedRecipes() {
    const saved = JSON.parse(localStorage.getItem('recipes') || '[]');
    labSavedList.innerHTML = '';
    saved.forEach((recipe, index) => {
      const li = document.createElement('li');
      li.textContent = `${recipe.broth} broth with ${recipe.protein}, ${recipe.veggies} & ${recipe.topping}`;
      const del = document.createElement('span');
      del.textContent = '✕';
      del.classList.add('delete');
      del.addEventListener('click', () => {
        saved.splice(index, 1);
        localStorage.setItem('recipes', JSON.stringify(saved));
        loadSavedRecipes();
      });
      li.appendChild(del);
      labSavedList.appendChild(li);
    });
  }

  labRandomBtn.addEventListener('click', () => {
    currentRecipe = randomRecipe();
    renderCurrentRecipe();
  });

  labSave.addEventListener('click', () => {
    if (!currentRecipe) return;
    const saved = JSON.parse(localStorage.getItem('recipes') || '[]');
    saved.push(currentRecipe);
    localStorage.setItem('recipes', JSON.stringify(saved));
    loadSavedRecipes();
  });

  labCopy.addEventListener('click', () => {
    if (!currentRecipe) return;
    const json = JSON.stringify(currentRecipe, null, 2);
    navigator.clipboard.writeText(json).then(() => {
      alert('Recipe copied to clipboard');
    });
  });

  labClear.addEventListener('click', () => {
    localStorage.removeItem('recipes');
    loadSavedRecipes();
  });

  loadSavedRecipes();

  /* --------------------------------------
   * Tiny Game
   */
  const gameStart = document.getElementById('game-start');
  const gameContainer = document.getElementById('game-container');
  const gameNood = document.getElementById('game-nood');
  const gameScoreSpan = document.getElementById('game-score');
  let gameInterval = null;
  let gameRunning = false;
  let score = 0;

  function moveNoodle() {
    const containerRect = gameContainer.getBoundingClientRect();
    const size = 40; // approximate size of emoji
    const x = Math.random() * (containerRect.width - size);
    const y = Math.random() * (containerRect.height - size);
    gameNood.style.left = x + 'px';
    gameNood.style.top = y + 'px';
  }

  function startGame() {
    score = 0;
    gameScoreSpan.textContent = score;
    gameNood.classList.remove('hidden');
    moveNoodle();
    gameInterval = setInterval(moveNoodle, 800);
    gameRunning = true;
    gameStart.textContent = 'Stop Game';
  }

  function stopGame() {
    clearInterval(gameInterval);
    gameNood.classList.add('hidden');
    gameRunning = false;
    gameStart.textContent = 'Start Game';
  }

  gameStart.addEventListener('click', () => {
    if (gameRunning) {
      stopGame();
    } else {
      startGame();
    }
  });

  gameNood.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gameRunning) return;
    score++;
    gameScoreSpan.textContent = score;
    moveNoodle();
  });

  /* --------------------------------------
   * Shop & Cart
   */
  const prices = {
    starry: 12.99,
    broth: 15.99,
    mystery: 19.99,
  };
  let cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const cartItemsList = document.getElementById('cart-items');
  const cartTotalSpan = document.getElementById('cart-total');

  function updateCart() {
    cartItemsList.innerHTML = '';
    let total = 0;
    Object.keys(cart).forEach((key) => {
      const qty = cart[key];
      const price = prices[key] * qty;
      total += price;
      const li = document.createElement('li');
      li.innerHTML = `${key} x${qty} - $${price.toFixed(2)} <span class="remove">✕</span>`;
      const remove = li.querySelector('.remove');
      remove.addEventListener('click', () => {
        delete cart[key];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
      });
      cartItemsList.appendChild(li);
    });
    cartTotalSpan.textContent = total.toFixed(2);
  }

  document.querySelectorAll('.add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.item;
      cart[key] = (cart[key] || 0) + 1;
      localStorage.setItem('cart', JSON.stringify(cart));
      updateCart();
    });
  });

  updateCart();

  /* --------------------------------------
   * Newsletter
   */
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterBtn = document.getElementById('newsletter-subscribe');
  const newsletterMsg = document.getElementById('newsletter-message');

  newsletterBtn.addEventListener('click', () => {
    const email = newsletterEmail.value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      newsletterMsg.textContent = 'Please enter a valid email address.';
      newsletterMsg.style.color = 'var(--primary)';
      return;
    }
    // Save subscriber
    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
    subscribers.push(email);
    localStorage.setItem('subscribers', JSON.stringify(subscribers));
    newsletterMsg.textContent = 'Thanks for subscribing!';
    newsletterMsg.style.color = 'var(--secondary)';
    newsletterEmail.value = '';
  });
});