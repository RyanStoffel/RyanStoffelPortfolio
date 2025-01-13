function toggleMenu() {
  const menu = document.querySelector('.menu-links');
  const icon = document.querySelector('.hamburger-icon');
  menu.classList.toggle('open');
  icon.classList.toggle('open');
}

const roles = [
    "Computer Scientist",
    "Game Developer",
    "Frontend Developer",
    "Database Developer",
    "Backend Developer"
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingDelay = 200;
let erasingDelay = 100;
let newTextDelay = 3000;

function typeText() {
    const currentRole = roles[roleIndex];
    const typingElement = document.querySelector('.typing-text');
    
    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let delay = isDeleting ? erasingDelay : typingDelay;

    if (!isDeleting && charIndex === currentRole.length) {
        delay = newTextDelay;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        delay = 500;
    }

    setTimeout(typeText, delay);
}

// Start the typing animation when the page loads
document.addEventListener('DOMContentLoaded', () => {
    typeText();
});
