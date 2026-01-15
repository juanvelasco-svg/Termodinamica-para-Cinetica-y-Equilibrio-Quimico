## Archivo: `script.js`
```javascript
// ===========================
// VARIABLES GLOBALES
// ===========================
let currentLevel = 1;
const totalLevels = 6;
const completedLevels = new Set();

// ===========================
// INICIALIZACIÓN
// ===========================
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCalculators();
    initializeSimulators();
    initializeInteractiveElements();
    updateProgressBar();
});

// ===========================
// NAVEGACIÓN ENTRE NIVELES
// ===========================
function initializeNavigation() {
    // Botones de la barra de navegación
    const levelButtons = document.querySelectorAll('.level-btn');
    levelButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = parseInt(this.dataset.level);
            goToLevel(level);
        });
    });
    
    // Botones de navegación (anterior/siguiente)
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    
    nextButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const nextLevel = parseInt(this.dataset.next);
            completedLevels.add(currentLevel);
            goToLevel(nextLevel);
        });
    });
    
    prevButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const prevLevel = parseInt(this.dataset.prev);
            goToLevel(prevLevel);
        });
    });
}

function goToLevel(level) {
    // Ocultar todos los niveles
    document.querySelectorAll('.level-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Mostrar el nivel seleccionado
    document.getElementById(`level-${level}`).classList.add('active');
    
    // Actualizar botones de navegación
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.classList.remove('active');
        const btnLevel = parseInt(btn.dataset.level);
        if (btnLevel === level) {
            btn.classList.add('active');
        }
        if (completedLevels.has(btnLevel)) {
            btn.classList.add('completed');
        }
    });
    
    // Actualizar nivel actual
    currentLevel = level;
    
    // Actualizar barra de progreso
    updateProgressBar();
    
    // Scroll hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressBar() {
    const progress = (currentLevel / totalLevels) * 100;
    document.getElementById('progressBar').style.width = `${progress}%`;
}

// ===========================
// CALCULADORAS INTERACTIVAS
// ===========================
function initializeCalculators() {
    // Calculadora de Entalpía
    const calcEnthalpyBtn = document.getElementById('calc-enthalpy');
    if (calcEnthalpyBtn) {
        calcEnthalpyBtn.addEventListener('click', calculateEnthalpy);
    }
    
    // Calculadora de Gibbs
    const calcGibbsBtn = document.getElementById('calc-gibbs');
    if (calcGibbsBtn) {
        calcGibbsBtn.addEventListener('click', calculateGibbs);
    }
    
    // Calculadora de Equilibrio
    const calcEquilibriumBtn = document.getElementById('calc-equilibrium');
    if (calcEquilibriumBtn) {
        calcEquilibriumBtn.addEventListener('click', calculateEquilibrium);
    }
    
    // Radio buttons para el modo de cálculo de equilibrio
    const calcModeRadios = document.querySelectorAll('input[name="calc-mode"]');
    calcModeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            toggleEquilibriumInputs(this.value);
        });
    });
}

function calculateEnthalpy() {
    const hProducts = parseFloat(document.getElementById('h-products').value);
    const hReactants = parseFloat(document.getElementById('h-reactants').value);
    
    const deltaH = hProducts - hReactants;
    const resultDiv = document.getElementById('enthalpy-result');
    
    let resultHTML = `<strong>ΔH = ${deltaH.toFixed(2)} kJ/mol</strong><br>`;
    
    if (deltaH < 0) {
        resultHTML += `<span style="color: var(--color-exothermic)">Proceso EXOTÉRMICO ❄️</span><br>`;
        resultHTML += `<span style="font-size: 0.9rem">Libera energía al entorno</span>`;
        resultDiv.style.background = '#ffebee';
    } else if (deltaH > 0) {
        resultHTML += `<span style="color: var(--color-endothermic)">Proceso ENDOTÉRMICO 🔥</span><br>`;
        resultHTML += `<span style="font-size: 0.9rem">Absorbe energía del entorno</span>`;
        resultDiv.style.background = '#e3f2fd';
    } else {
        resultHTML += `<span style="color: #666">Sin cambio de entalpía</span>`;
        resultDiv.style.background = '#f5f5f5';
    }
    
    resultDiv.innerHTML = resultHTML;
}

function calculateGibbs() {
    const deltaH = parseFloat(document.getElementById('delta-h').value);
    const deltaS = parseFloat(document.getElementById('delta-s').value) / 1000; // Convertir J a kJ
    const T = parseFloat(document.getElementById('temperature').value);
    
    const deltaG = deltaH - (T * deltaS);
    
    const resultDiv = document.getElementById('gibbs-result');
    const interpretDiv = document.getElementById('gibbs-interpretation');
    
    resultDiv.innerHTML = `<strong>ΔG = ${deltaG.toFixed(2)} kJ/mol</strong>`;
    
    let interpretation = '';
    if (deltaG < 0) {
        interpretation = `
            <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <strong style="color: var(--success)">✅ PROCESO ESPONTÁNEO</strong><br>
                <span style="font-size: 0.9rem">La reacción ocurrirá de manera espontánea bajo estas condiciones</span>
            </div>
        `;
        resultDiv.style.background = '#e8f5e9';
    } else if (deltaG > 0) {
        interpretation = `
            <div style="background: #ffebee; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <strong style="color: var(--danger)">❌ PROCESO NO ESPONTÁNEO</strong><br>
                <span style="font-size: 0.9rem">Se requiere trabajo externo para que la reacción ocurra</span>
            </div>
        `;
        resultDiv.style.background = '#ffebee';
    } else {
        interpretation = `
            <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <strong style="color: var(--warning)">⚖️ EQUILIBRIO</strong><br>
                <span style="font-size: 0.9rem">El sistema está en equilibrio termodinámico</span>
            </div>
        `;
        resultDiv.style.background = '#fff3e0';
    }
    
    interpretDiv.innerHTML = interpretation;
}

function toggleEquilibriumInputs(mode) {
    const kToGInputs = document.getElementById('k-to-g-inputs');
    const gToKInputs = document.getElementById('g-to-k-inputs');
    
    if (mode === 'k-to-g') {
        kToGInputs.classList.remove('hidden');
        gToKInputs.classList.add('hidden');
    } else {
        kToGInputs.classList.add('hidden');
        gToKInputs.classList.remove('hidden');
    }
}

function calculateEquilibrium() {
    const mode = document.querySelector('input[name="calc-mode"]:checked').value;
    const R = 8.314; // J/mol·K
    const resultDiv = document.getElementById('eq-result');
    
    let resultHTML = '';
    
    if (mode === 'k-to-g') {
        const K = parseFloat(document.getElementById('k-value').value);
        const T = parseFloat(document.getElementById('temp-k').value);
        
        if (K <= 0) {
            resultDiv.innerHTML = '<span style="color: var(--danger)">Error: K debe ser mayor que 0</span>';
            return;
        }
        
        const deltaG = -(R * T * Math.log(K)) / 1000; // Convertir a kJ/mol
        
        resultHTML = `
            <div style="text-align: center;">
                <strong style="font-size: 1.3rem; color: var(--primary)">ΔG° = ${deltaG.toFixed(2)} kJ/mol</strong><br>
                <div style="margin-top: 1rem; padding: 1rem; background: ${deltaG < 0 ? '#e8f5e9' : '#ffebee'}; border-radius: 8px;">
        `;
        
        if (K > 1) {
            resultHTML += `
                <strong style="color: var(--success)">K > 1: Favorece productos</strong><br>
                <span style="font-size: 0.9rem">En el equilibrio habrá más productos que reactivos</span>
            `;
        } else if (K < 1) {
            resultHTML += `
                <strong style="color: var(--danger)">K < 1: Favorece reactivos</strong><br>
                <span style="font-size: 0.9rem">En el equilibrio habrá más reactivos que productos</span>
            `;
        } else {
            resultHTML += `
                <strong style="color: var(--warning)">K = 1: Equilibrado</strong><br>
                <span style="font-size: 0.9rem">Cantidades similares de reactivos y productos</span>
            `;
        }
        
        resultHTML += '</div></div>';
        
    } else {
        const deltaG = parseFloat(document.getElementById('dg-value').value);
        const T = parseFloat(document.getElementById('temp-g').value);
        
        const K = Math.exp(-(deltaG * 1000) / (R * T));
        
        resultHTML = `
            <div style="text-align: center;">
                <strong style="font-size: 1.3rem; color: var(--primary)">K = ${K.toExponential(2)}</strong><br>
                <div style="margin-top: 1rem; padding: 1rem; background: ${deltaG < 0 ? '#e8f5e9' : '#ffebee'}; border-radius: 8px;">
        `;
        
        if (deltaG < 0) {
            resultHTML += `
                <strong style="color: var(--success)">ΔG° < 0: Reacción espontánea</strong><br>
                <span style="font-size: 0.9rem">K > 1, favorece formación de productos</span>
            `;
        } else if (deltaG > 0) {
            resultHTML += `
                <strong style="color: var(--danger)">ΔG° > 0: Reacción no espontánea</strong><br>
                <span style="font-size: 0.9rem">K < 1, favorece reactivos</span>
            `;
        } else {
            resultHTML += `
                <strong style="color: var(--warning)">ΔG° = 0: Equilibrio</strong><br>
                <span style="font-size: 0.9rem">K = 1, cantidades similares</span>
            `;
        }
        
        resultHTML += '</div></div>';
    }
    
    resultDiv.innerHTML = resultHTML;
}

// ===========================
// SIMULADOR DE MICROESTADOS
// ===========================
function initializeSimulators() {
    const particleCountSlider = document.getElementById('particle-count');
    const volumeSlider = document.getElementById('volume-size');
    
    if (particleCountSlider && volumeSlider) {
        particleCountSlider.addEventListener('input', updateSimulator);
        volumeSlider.addEventListener('input', updateSimulator);
        
        // Inicializar simulador
        updateSimulator();
    }
}

function updateSimulator() {
    const particleCount = parseInt(document.getElementById('particle-count').value);
    const volumeSize = parseInt(document.getElementById('volume-size').value);
    
    // Actualizar displays
    document.getElementById('particle-display').textContent = particleCount;
    
    const volumeLabels = ['Pequeño', 'Mediano', 'Grande'];
    document.getElementById('volume-display').textContent = volumeLabels[volumeSize - 1];
    
    // Calcular microestados aproximados (simplificado)
    const microestates = Math.pow(volumeSize * 2, particleCount);
    const entropy = Math.log(microestates);
    
    document.getElementById('microstate-count').textContent = microestates.toExponential(2);
    document.getElementById('entropy-value').textContent = entropy.toFixed(2);
    
    // Dibujar partículas en el canvas
    drawParticles(particleCount, volumeSize);
}

function drawParticles(count, volumeSize) {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, width, height);
    
    // Dibujar contenedor
    const containerWidth = (width * volumeSize) / 3;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, containerWidth - 20, height - 20);
    
    // Dibujar partículas
    const particleRadius = 5;
    const colors = ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#27ae60'];
    
    for (let i = 0; i < count; i++) {
        const x = 20 + Math.random() * (containerWidth - 50);
        const y = 20 + Math.random() * (height - 50);
        
        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
}

// ===========================
// ELEMENTOS INTERACTIVOS
// ===========================
function initializeInteractiveElements() {
    // Botones de explorar en ejemplos cotidianos
    const exploreButtons = document.querySelectorAll('.explore-btn');
    exploreButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.example-card');
            const example = card.dataset.example;
            showExampleModal(example);
        });
    });
    
    // Botón de revelar respuesta
    const revealBtn = document.getElementById('reveal-entropy');
    if (revealBtn) {
        const button = revealBtn.querySelector('.reveal-btn');
        button.addEventListener('click', function() {
            const answer = revealBtn.querySelector('.answer');
            answer.classList.toggle('hidden');
            
            if (answer.classList.contains('hidden')) {
                this.textContent = 'Revelar respuesta →';
            } else {
                this.textContent = 'Ocultar respuesta';
            }
        });
    }
    
    // Modal
    const modal = document.getElementById('exampleModal');
    const closeBtn = document.querySelector('.close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showExampleModal(example) {
    const modal = document.getElementById('exampleModal');
    const modalBody = document.getElementById('modal-body');
    
    const examples = {
        candle: {
            title: '🔥 Vela Ardiendo',
            content: `
                <h3>Análisis Termodinámico</h3>
                <div class="reaction">C₂₅H₅₂(s) + O₂(g) → CO₂(g) + H₂O(g) + Energía</div>
                
                <div style="background: #ffebee; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--danger)">Energía (ΔH)</h4>
                    <p><strong>Altamente exotérmico:</strong> ΔH ≈ -10,000 kJ/mol</p>
                    <p>Libera mucha energía en forma de luz y calor</p>
                </div>
                
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--accent)">Entropía (ΔS)</h4>
                    <p><strong>Aumenta:</strong> ΔS > 0</p>
                    <p>• Sólido → Gases (CO₂ y H₂O)</p>
                    <p>• Mayor desorden molecular</p>
                </div>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--success)">Resultado (ΔG)</h4>
                    <p><strong>Altamente espontáneo:</strong> ΔG << 0</p>
                    <p>Ambos factores (ΔH y ΔS) favorecen la combustión</p>
                </div>
                
                <p><strong>¿Por qué no se "des-quema"?</strong></p>
                <p>La reacción inversa tendría ΔG >> 0 (no espontánea). Reorganizar CO₂ y H₂O 
                dispersos en parafina sólida violaría la segunda ley de la termodinámica.</p>
            `
        },
        ice: {
            title: '🧊 Hielo Derritiéndose',
            content: `
                <h3>Análisis Termodinámico</h3>
                <div class="reaction">H₂O(s) → H₂O(l)</div>
                
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--accent)">Energía (ΔH)</h4>
                    <p><strong>Endotérmico:</strong> ΔH = +6.01 kJ/mol</p>
                    <p>Necesita absorber energía para romper enlaces de hidrógeno</p>
                </div>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--success)">Entropía (ΔS)</h4>
                    <p><strong>Aumenta:</strong> ΔS = +22.0 J/mol·K</p>
                    <p>• Las moléculas ganan libertad de movimiento</p>
                    <p>• Mayor número de microestados disponibles</p>
                </div>
                
                <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--warning)">Resultado (ΔG)</h4>
                    <p>ΔG = ΔH - TΔS = 6.01 - T(0.022)</p>
                    
                    <table style="width: 100%; margin-top: 0.5rem; border-collapse: collapse;">
                        <tr style="background: #ffebee;">
                            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>T = 263 K (-10°C)</strong></td>
                            <td style="padding: 0.5rem; border: 1px solid #ddd;">ΔG = +0.22 kJ (NO espontáneo)</td>
                        </tr>
                        <tr style="background: #fff9c4;">
                            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>T = 273 K (0°C)</strong></td>
                            <td style="padding: 0.5rem; border: 1px solid #ddd;">ΔG = 0 (EQUILIBRIO)</td>
                        </tr>
                        <tr style="background: #e8f5e9;">
                            <td style="padding: 0.5rem; border: 1px solid #ddd;"><strong>T = 298 K (25°C)</strong></td>
                            <td style="padding: 0.5rem; border: 1px solid #ddd;">ΔG = -0.55 kJ (Espontáneo)</td>
                        </tr>
                    </table>
                </div>
                
                <p><strong>Conclusión:</strong> A temperatura ambiente, el factor entropía (-TΔS) 
                domina sobre la entalpía desfavorable, haciendo espontánea la fusión.</p>
            `
        },
        coffee: {
            title: '☕ Café Enfriándose',
            content: `
                <h3>Análisis Termodinámico</h3>
                <div class="reaction">Café (90°C) → Café (25°C) + Calor al ambiente</div>
                
                <div style="background: #ffebee; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--danger)">Energía (ΔH)</h4>
                    <p><strong>Exotérmico para el café:</strong> ΔH < 0</p>
                    <p>El café pierde energía térmica hacia el entorno</p>
                </div>
                
                <div style="background: #fff3e0; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--warning)">Entropía del Sistema</h4>
                    <p><strong>Disminuye:</strong> ΔS_café < 0</p>
                    <p>Menos energía térmica = menos microestados</p>
                </div>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--success)">Entropía del Universo</h4>
                    <p><strong>Aumenta:</strong> ΔS_universo > 0</p>
                    <p>El entorno gana MÁS entropía de la que pierde el café</p>
                    <p style="margin-top: 0.5rem; font-family: var(--font-mono);">
                        ΔS_universo = ΔS_café + ΔS_entorno > 0
                    </p>
                </div>
                
                <p><strong>¿Por qué el entorno gana más entropía?</strong></p>
                <p>El calor transferido (Q) tiene mayor impacto en la entropía a temperatura 
                BAJA (ambiente) que a temperatura ALTA (café): ΔS = Q/T</p>
                
                <p style="margin-top: 1rem;"><strong>Segunda Ley en acción:</strong> 
                El calor fluye espontáneamente de caliente a frío porque esto maximiza la 
                entropía total del universo.</p>
            `
        },
        perfume: {
            title: '💨 Perfume Dispersándose',
            content: `
                <h3>Análisis Termodinámico</h3>
                <div class="reaction">Perfume (concentrado) → Perfume (disperso en habitación)</div>
                
                <div style="background: #f5f5f5; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--primary)">Energía (ΔH)</h4>
                    <p><strong>Aproximadamente cero:</strong> ΔH ≈ 0</p>
                    <p>No hay reacción química, solo expansión física</p>
                </div>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--success)">Entropía (ΔS)</h4>
                    <p><strong>Aumenta dramáticamente:</strong> ΔS >> 0</p>
                    <p>• Volumen: 0.001 m³ → 30 m³ (x30,000)</p>
                    <p>• Microestados: W_final >> W_inicial</p>
                    <p>• S = k ln W aumenta enormemente</p>
                </div>
                
                <div style="background: #e8f5e9; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4 style="color: var(--success)">Resultado (ΔG)</h4>
                    <p>ΔG = ΔH - TΔS ≈ 0 - T(ΔS grande) << 0</p>
                    <p><strong>Altamente espontáneo</strong></p>
                </div>
                
                <div style="background: #e3f2fd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                    <h4>🎲 Perspectiva Probabilística</h4>
                    <p>Probabilidad de que todas las moléculas regresen al frasco:</p>
                    <p style="font-family: var(--font-mono); font-size: 1.1rem; color: var(--danger);">
                        P ≈ (1/30,000)^(10²³) ≈ 10^(-10²⁷)
                    </p>
                    <p><strong>Prácticamente imposible</strong></p>
                </div>
                
                <p><strong>Este es un ejemplo puro del dominio de la entropía:</strong> 
                Sin cambio energético, la naturaleza elige dispersión sobre concentración.</p>
            `
        }
    };
    
    const exampleData = examples[example];
    modalBody.innerHTML = `
        <h2>${exampleData.title}</h2>
        ${exampleData.content}
    `;
    
    modal.style.display = 'block';
}

// ===========================
// ANIMACIONES Y EFECTOS
// ===========================

// Animación de la bola en la montaña (Nivel 2)
function animateMountainBall() {
    const ball = document.querySelector('.ball');
    if (!ball) return;
    
    let position = 0;
    const animate = () => {
        position += 2;
        if (position > 100) position = 0;
        
        // Calcular posición en la curva
        const x = 150 + position;
        const y = 50 + Math.abs(Math.sin(position / 20) * 50);
        
        ball.setAttribute('cx', x);
        ball.setAttribute('cy', y);
        
        requestAnimationFrame(animate);
    };
    
    animate();
}

// Iniciar animaciones cuando se carga el nivel correspondiente
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(animateMountainBall, 500);
});

// ===========================
// UTILIDADES
// ===========================

// Formatear números científicos
function formatScientific(num) {
    if (Math.abs(num) < 0.01 || Math.abs(num) > 10000) {
        return num.toExponential(2);
    }
    return num.toFixed(2);
}

// Detectar si estamos en móvil
function isMobile() {
    return window.innerWidth <= 768;
}

// Ajustar layout en móvil
window.addEventListener('resize', function() {
    if (isMobile()) {
        // Ajustes específicos para móvil si son necesarios
    }
});
