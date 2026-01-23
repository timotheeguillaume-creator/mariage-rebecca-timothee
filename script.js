document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestEmail = urlParams.get('guest');
    
    const mainContent = document.getElementById('main-content');
    const accessDenied = document.getElementById('access-denied');
    const guestInput = document.getElementById('guest-id');

    // 1. Vérification de l'accès
    if (guestEmail && guestEmail.includes('@')) {
        mainContent.classList.remove('hidden');
        accessDenied.classList.add('hidden');
        guestInput.value = guestEmail;

        // Nettoyage de l'URL pour la discrétion
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 2. Logique Partenaire
    const partnerCheck = document.getElementById('add-plus-one');
    const partnerField = document.getElementById('partner-field');
    partnerCheck.addEventListener('change', (e) => {
        partnerField.classList.toggle('hidden', !e.target.checked);
    });

    // 3. Logique Enfants
    const kidsCheck = document.getElementById('has-kids');
    const kidsField = document.getElementById('kids-field');
    kidsCheck.addEventListener('change', (e) => {
        kidsField.classList.toggle('hidden', !e.target.checked);
    });

    const honeyCheck = document.getElementById('honeyboom');
    const boomBox = document.querySelector('.boom-anniversary-style');
    
    // Création de l'élément audio en JS
    const bassSound = new Audio('deep-bass.mp3');
    bassSound.volume = 0.7; // Ajustez le volume ici

    honeyCheck.addEventListener('change', function() {
        if (this.checked) {
            // 1. Jouer le son
            bassSound.currentTime = 0; // Recommence le son si on clique vite
            bassSound.play().catch(e => console.log("L'audio nécessite une interaction préalable."));

            // 2. Ajouter l'effet sismique
            boomBox.classList.add('quake-effect');

            // 3. Retirer l'effet après l'animation (500ms)
            setTimeout(() => {
                boomBox.classList.remove('quake-effect');
            }, 500);
        }
    });
});