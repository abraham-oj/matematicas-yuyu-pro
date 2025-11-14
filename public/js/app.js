document.addEventListener('DOMContentLoaded', () => {
  const state = {
    solved: parseInt(localStorage.getItem('yuyu_score') || '0'),
    type: 'algebra'
  };

  // --- DICCIONARIO DE EJEMPLOS PARA YUYU ---
  const examples = {
    algebra: "Ejemplo: 2x + 5 = 15\n(Ayuda a encontrar el valor de x)",
    geometry: "Ejemplo: Calcular el área de un triángulo con base 10 y altura 5",
    arithmetic: "Ejemplo: 450 + 125\n(O prueba con divisiones: 20 / 4)",
    percentages: "Ejemplo: ¿Cuánto es el 20% de 500?"
  };

  const ui = {
    input: document.getElementById('problemInput'),
    btn: document.getElementById('solveBtn'),
    btnText: document.querySelector('.btn-text'),
    loader: document.querySelector('.loader'),
    result: document.getElementById('resultArea'),
    content: document.getElementById('solutionContent'),
    score: document.getElementById('score'),
    bar: document.getElementById('progressFill'),
    types: document.querySelectorAll('.type-btn'),
    welcomeOverlay: document.getElementById('welcomeOverlay'),
    closeWelcomeBtn: document.getElementById('closeWelcomeBtn'),
    starBg: document.querySelector('.star-bg')
  };

  function init() {
    updateScore();
    attachEventListeners();
    showWelcomeMessageOnce();
    createDynamicBackgroundElements();
    updatePlaceholder(); // Poner el primer ejemplo al cargar
  }

  function attachEventListeners() {
    ui.types.forEach(btn => {
      btn.addEventListener('click', (e) => {
        // 1. Cambiar botón activo
        ui.types.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        // 2. Actualizar estado interno
        state.type = e.target.dataset.type;

        // --- CORRECCIÓN DEL BUG ---
        // 3. Limpiar la caja para que se vea el nuevo ejemplo
        ui.input.value = '';
        ui.input.focus(); // Ponemos el cursor listo para escribir
        // --------------------------

        // 4. Actualizar el texto fantasma (placeholder)
        updatePlaceholder();

        // Animación
        ui.input.style.transform = "scale(0.98)";
        setTimeout(() => ui.input.style.transform = "scale(1)", 100);
      });
    });

    // ... resto de listeners ...

    ui.btn.addEventListener('click', handleSolve);
    ui.closeWelcomeBtn.addEventListener('click', hideWelcomeMessage);
  }

  function updatePlaceholder() {
    // Cambia el texto gris de fondo según el botón presionado
    ui.input.placeholder = examples[state.type];
  }

  // ... (Mantén el resto de las funciones: handleSolve, renderSolution, celebrate, etc. IGUAL QUE ANTES) ...
  // SOLO COPIA LAS FUNCIONES DE ARRIBA SI NO QUIERES BORRAR TODO.

  // --- (Aquí abajo te repito handleSolve por si acaso, ajustado a Mistral) ---
  async function handleSolve() {
    const problem = ui.input.value.trim();
    if (!problem) {
      ui.input.focus();
      // Efecto de temblor si intenta enviar vacío
      ui.input.style.border = "3px solid #ff6b6b";
      setTimeout(() => ui.input.style.border = "3px solid transparent", 500);
      return;
    }

    setLoading(true);

    try {
      // Usamos la ruta directa de funciones para asegurar que la encuentre
      const req = await fetch('/.netlify/functions/magic-solver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, type: state.type })
      });

      const data = await req.json();

      if (!req.ok) {
        // Mensaje amigable si Mistral está dormido
        if (data.error && data.error.includes("loading")) {
          throw new Error("😴 El cerebro mágico está despertando. Espera 20 segunditos e intenta de nuevo.");
        }
        throw new Error(data.error || `Error mágico.`);
      }

      renderSolution(data.solution);
      celebrate();
    } catch (err) {
      ui.content.innerHTML = `<p style="color: #e056fd; font-weight:bold;">😿 Ups: ${err.message}</p>`;
      ui.result.classList.remove('hidden');
    } finally {
      setLoading(false);
    }
  }

  // ... (El resto de funciones auxiliares: setLoading, renderSolution, celebrate, init...)

  // FUNCIONES AUXILIARES NECESARIAS (POR SI LAS BORRAS)
  function showWelcomeMessageOnce() {
    if (!localStorage.getItem('yuyu_welcome_shown')) {
      ui.welcomeOverlay.classList.remove('fade-out');
    } else {
      ui.welcomeOverlay.classList.add('fade-out');
    }
  }

  function hideWelcomeMessage() {
    ui.welcomeOverlay.classList.add('fade-out');
    localStorage.setItem('yuyu_welcome_shown', 'true');
  }

  function createDynamicBackgroundElements() {
    const numStars = 50;
    for (let i = 0; i < numStars; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.width = star.style.height = `${Math.random() * 5 + 2}px`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.left = `${Math.random() * 100}%`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      ui.starBg.appendChild(star);
    }
  }

  function setLoading(isLoading) {
    ui.btn.disabled = isLoading;
    if (isLoading) {
      ui.btnText.classList.add('hidden');
      ui.loader.classList.remove('hidden');
      ui.result.classList.add('hidden');
    } else {
      ui.btnText.classList.remove('hidden');
      ui.loader.classList.add('hidden');
    }
  }

  function renderSolution(markdown) {
    const html = markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^\d+\.\s/gm, '<br>✨ ')
      .replace(/^- (.*)/gm, '<br>✨ $1')
      .replace(/\n/g, '<br>');

    ui.content.innerHTML = html;
    ui.result.classList.remove('hidden');
  }

  function celebrate() {
    state.solved++;
    localStorage.setItem('yuyu_score', state.solved);
    updateScore();
  }

  function updateScore() {
    ui.score.textContent = state.solved;
    const pct = Math.min(state.solved * 2, 100);
    ui.bar.style.width = `${pct}%`;
  }

  init();
});