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
});