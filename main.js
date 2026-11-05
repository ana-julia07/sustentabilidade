/**
 * EcoVanguarda - Scripts Interativos
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initNavbarScroll();
  initCarbonCalculator();
});

/* 1. Menu Mobile Toggle */
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars');
      }
    });

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars');
        }
      });
    });
  }
}

/* 2. Efeito de Sombra e Destaque no Nav no Scroll */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Adiciona classe scrolled
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scrollspy simples
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });
}

/* 3. Lógica da Calculadora de Pegada de Carbono */
function initCarbonCalculator() {
  const carbonForm = document.getElementById('carbonForm');
  const calcResult = document.getElementById('calcResult');
  const co2TotalSpan = document.getElementById('co2Total');
  const calcAdvice = document.getElementById('calcAdvice');

  if (carbonForm) {
    carbonForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const transporteKm = parseFloat(document.getElementById('transporte').value) || 0;
      const energiaKwh = parseFloat(document.getElementById('energia').value) || 0;
      const carneDias = parseInt(document.getElementById('carne').value) || 0;

      // Fatores de emissão aproximados (anualizados)
      // Transporte: 0.12 kg CO2/km * 12 meses
      const emissaoTransporte = (transporteKm * 12 * 0.19) / 1000; 

      // Energia: 0.085 kg CO2/kWh * 12 meses (matriz elétrica)
      const emissaoEnergia = (energiaKwh * 12 * 0.09) / 1000;

      // Dieta: estimativa anual por frequência de carne vermelha
      let emissaoDieta = 0.4; // Base vegetal
      if (carneDias === 1) emissaoDieta = 0.9;
      else if (carneDias === 3) emissaoDieta = 1.6;
      else if (carneDias === 6) emissaoDieta = 2.5;

      const totalToneladas = (emissaoTransporte + emissaoEnergia + emissaoDieta).toFixed(2);

      // Atualiza a tela
      co2TotalSpan.textContent = totalToneladas;

      if (totalToneladas < 2.0) {
        calcAdvice.textContent = "Excelente! Sua pegada de carbono estimada está abaixo da média. Continue adotando práticas sustentáveis!";
      } else if (totalToneladas <= 4.0) {
        calcAdvice.textContent = "Sua pegada de carbono está na média. É possível reduzir utilizando mais transporte coletivo/bicicleta e ajustando o consumo de energia.";
      } else {
        calcAdvice.textContent = "Sua pegada de carbono está acima da média recomendada. Considere aplicar princípios de logística reversa e diminuir emissões diretas.";
      }

      calcResult.classList.remove('hidden');
    });
  }
}
