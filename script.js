document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const guestEmail = urlParams.get('guest');
    
    const mainContent = document.getElementById('main-content');
    const accessDenied = document.getElementById('access-denied');
    const guestInput = document.getElementById('guest-id');

    // Date : 2027-06-26 de 14:00 à 23:59
    const eventTitle = encodeURIComponent("Mariage de Rébecca & Timothée 💍");
    const eventDetails = encodeURIComponent("Nous avons hâte de vous retrouver pour célébrer notre union !");
    const eventLocation = encodeURIComponent("Château d'Embourg', France");

    // Lien Google Calendar
    const googleUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=20270626T120000Z/20270626T220000Z&details=${eventDetails}&location=${eventLocation}`;

    // Lien ICS (Simplifié via un Data URI pour éviter de créer un fichier réel)
    const icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nURL:" + window.location.href + "\nDTSTART:20270626T120000Z\nDTEND:20270626T220000Z\nSUMMARY:Mariage de Rébecca & Timothée 💍\nDESCRIPTION:C'est le grand jour !\nLOCATION:Chateau d'Embourg\nEND:VEVENT\nEND:VCALENDAR";
    const icsUrl = "data:text/calendar;charset=utf8," + encodeURIComponent(icsContent);

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
    bassSound.preload = 'auto';
    bassSound.load();

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
                            <p>Tes réponses sont déjà enregistrées. Si tu souhaites les modifier, contacte-nous directement.</p>
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
                    <div id="success-anchor" class="success-message">
                        <h3>C'est noté !</h3>
                        <p>On se voit très vite !</p>
                        <div class="calendar-options" style="margin-top: 25px;">
                            <p style="font-size: 0.9rem; margin-bottom: 15px;">Ajouter la date à ton calendrier :</p>
                            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                                <a href="${googleUrl}" target="_blank" class="btn-cal google">Google Calendar</a>
                                <a href="${icsUrl}" download="mariage-tim-et-guillaume.ics" class="btn-cal ics">Apple / Outlook</a>
                            </div>
                        </div>
                    </div>`;

                // 2. On force le focus visuel (le scroll)
            setTimeout(() => {
                const successMessage = document.getElementById('success-anchor');
                if (successMessage) {
                    successMessage.scrollIntoView({ 
                        behavior: 'smooth', // Animation fluide
                        block: 'center'     // Centre le message au milieu de l'écran
                    });
                }
            }, 300); // 300ms est le délai idéal pour une sensation de fluidité

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

                bassSound.play().then(() => {
                bassSound.pause();
                bassSound.currentTime = 0;
                }).catch(e => console.log("Audio en attente d'interaction"));



    honeyCheck.addEventListener('change', function() {
        if (this.checked) {
            // 1. Jouer le son
            bassSound.currentTime = 0; // Recommence le son si on clique vite
            bassSound.play().catch(e => console.log("L'audio nécessite une interaction préalable."));

            setTimeout(() => {
                // 2. Déclencher la vibration
                if ("vibrate" in navigator) {
                    // On fait une double vibration : une courte, un blanc, une longue
                    // [vibration, pause, vibration] en millisecondes
                    navigator.vibrate([200, 200, 200, 200, 200, 200, 200, 200, 200, 200, 200]);
                }else{
                    console.log('Pas de vibs ici bro.')
                }

                // 2. Ajouter l'effet sismique
                boomBox.classList.add('quake-effect');

                // 3. Retirer l'effet après l'animation (500ms)
                setTimeout(() => {
                    boomBox.classList.remove('quake-effect');
                }, 1600);
            }, 50); // Ce délai de 150ms crée la sensation de "puissance" du son
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

    const lazyBackgrounds = document.querySelectorAll(".parallax-fun");

    if ("IntersectionObserver" in window) {
        let bgObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Quand la section est visible, on ajoute la classe qui charge l'image
                    entry.target.classList.add("bg-loaded");
                    bgObserver.unobserve(entry.target);
                }
            });
        });

        lazyBackgrounds.forEach((bg) => bgObserver.observe(bg));
    }
});