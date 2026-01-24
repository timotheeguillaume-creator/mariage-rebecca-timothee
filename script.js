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

    const scriptURL = 'https://script.google.com/macros/s/AKfycbw9qgpUngA3N9-GvE_ARgA26tANcCKQquZGYvTepokSTZAtes3Py-s4Q44t9fMlly6v/exec';
    const form = document.getElementById('rsvp-form');
    const rsvpSection = document.querySelector('.rsvp-section');

    if (guestEmail) {
        document.getElementById('main-content').classList.remove('hidden');
        document.getElementById('access-denied').classList.add('hidden');
        document.getElementById('guest-id').value = guestEmail;

        // VERIFICATION SI DEJA ENREGISTRÉ
        // Création d'une fonction globale que le script Google appellera
        window.handleRSVPCheck = function(data) {
            if (data.result === "EXISTS") {
                form.innerHTML = `<div class="success-message">
                    <h3>Heureux de te revoir !</h3>
                            <p>Tes réponses sont déjà enregistrées. Si tu souhaites les modifier, contactez-nous directement.</p>
                </div>`;
            }
        };

        // On injecte le script dynamiquement pour contourner CORS
        const script = document.createElement('script');
        script.src = `${scriptURL}?email=${guestEmail}&callback=handleRSVPCheck`;
        document.body.appendChild(script);

       }


    // ENVOI DU FORMULAIRE EN AJAX
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btnSubmit = form.querySelector('.btn-submit');
        btnSubmit.innerText = "Envoi en cours...";
        btnSubmit.disabled = true;

        // On transforme les données du formulaire en paramètres URL pour éviter les soucis de redirection
        const formData = new FormData(form);
        const queryString = new URLSearchParams(formData).toString();

        fetch(`${scriptURL}?${queryString}`, { 
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.result === "SUCCESS") {
                form.innerHTML = `
                    <div class="success-message">
                        <h3>C'est noté !</h3>
                        <p>On se voit très vite !</p>
                    </div>`;
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            console.error('Erreur!', error);
            btnSubmit.disabled = false;
            btnSubmit.innerText = "Réessayer";
            alert("Oups, il y a eu un petit souci. Réessaie ou contacte-nous !");
        });
    });

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
            }, 1600);
        }
    });

    function startCountdown() {
        // Date cible : 26 juin 2027 à 14:00 (Heure Française)
        const targetDate = new Date("June 26, 2027 14:00:00").getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                document.getElementById("countdown").innerHTML = "C'est le grand jour !";
                return;
            }

            // Calcul des jours, heures et minutes
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            // Affichage
            document.getElementById("days").innerText = days;
            document.getElementById("hours").innerText = hours;
            document.getElementById("minutes").innerText = minutes;
        };

        // Lancer immédiatement et mettre à jour toutes les minutes (60000ms)
        updateTimer();
        setInterval(updateTimer, 60000);
    }

    // Appelez la fonction au chargement
    startCountdown();
});