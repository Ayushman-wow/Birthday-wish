// Imports removed for static deployment compatibility
// import confetti from 'canvas-confetti';
// import './style.css';

// Fire confetti on load
window.addEventListener('load', () => {
    // --- BGM and Overlay Logic ---
    const overlay = document.getElementById('start-overlay');
    const audio = document.getElementById('bgm');

    overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        // Play audio
        audio.play().catch(e => console.log("Audio play failed:", e));

        // Start confetti after a small delay equal to transition
        setTimeout(startConfetti, 300);
    });

    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function startConfetti() {
        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            // since particles fall down, start a bit higher than random
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 } }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 } }));
        }, 250);
    }
});

// Photo upload handler
const photoCards = document.querySelectorAll('.photo-card');

photoCards.forEach(card => {
    card.addEventListener('click', () => {
        // If there's already an image, maybe we want to replace it? 
        // For now, let's just trigger the upload always.

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    // Remove existing content or placeholders
                    card.innerHTML = '';
                    // Add image
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    card.appendChild(img);

                    // Add slight random rotation for realism and remove dashed border
                    const rotation = Math.random() * 6 - 3;
                    card.style.transform = `rotate(${rotation}deg)`;
                    card.style.border = '4px solid white';

                    // Trigger small confetti burst on the image
                    const rect = card.getBoundingClientRect();
                    const x = (rect.left + rect.width / 2) / window.innerWidth;
                    const y = (rect.top + rect.height / 2) / window.innerHeight;

                    confetti({
                        particleCount: 30,
                        spread: 60,
                        origin: { x, y }
                    });
                };
                reader.readAsDataURL(file);
            }
        };

        input.click();
    });
});
