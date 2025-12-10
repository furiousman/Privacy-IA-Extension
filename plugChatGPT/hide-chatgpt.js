// Script pour sécurisation ChatGPT
(function () {
    // Utilitaires de debug
    const log = (...args) => console.log("[EXT-LOG]", ...args);
    const err = (...args) => console.error("[EXT-ERR]", ...args);


    // #########################################
    // ####           Functions             ####
    // #########################################

    // sécurisation et rebranding de ChatGPT
    function init() {
        try {
            if (!document.body) {
                log("init: document.body non disponible encore");
                return false;
            }
            // n'exécute qu'une fois si déjà modifié
            if (document.body.dataset.modified === "true") {
                return true;
            }
            createCustomBanner();
            showPopupAwarness();
            document.body.dataset.modified = "true";
            return true;
        } catch (e) {
            err("Erreur dans init:", e);
            return false;
        }
    }

    // modification de l'header
    function createCustomBanner() {
        if (document.body.dataset.bannerInjected === "true") return;

        const newBanner = document.createElement('div');
        newBanner.id = "ght-custom-banner";
        newBanner.style.cssText = `
            width: 100%;
            background: ${CONFIG.theme.bannerBackground};
            color: ${CONFIG.theme.bannerColor};
            display: flex; align-items: center; gap: 12px;
            padding: 10px 20px; font-family: Arial, sans-serif;
            font-size: 16px; z-index: 10000; border-bottom: 3px solid;
            `;
        const logo = document.createElement('img');
        logo.src = CONFIG.logoBase64;
        logo.alt = CONFIG.companyName;
        logo.style.width = '32px';
        logo.style.height = '32px';
        logo.style.borderRadius = '4px';

        const name = document.createElement('span');
        name.textContent = CONFIG.companyName;
        name.style.fontWeight = 'bold';
        newBanner.appendChild(logo);
        newBanner.appendChild(name);

        // ajout au DOM
        main = document.querySelector('#page-header') || document.body;
        //masquer les div présentes pour ne pas mettre en error Chatgpt
        subDiv = main.querySelectorAll(':scope > div, :scope > nav');
        for (var i = 0; i < subDiv.length; i++) {
            var elem = subDiv[i];
            elem.style.display = 'none';
        }
        main.prepend(newBanner);
        log("Bandeau injecté");
    }

    // affiche une pop de 
    function showPopupAwarness() {
        const popupHTML = `
          <div id="ChatGptPrivacy-popup" style="
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: rgba(0,0,0,0.5);
            justify-content: center;
            align-items: center;
            z-index: 2147483647;
          ">
            <div style="
              background: `+ CONFIG.theme.alertBackground + `;
              padding: 30px;
              border-color: `+ CONFIG.theme.alertBorder + `;
              border-radius: 8px;
              width: 600px;
              position: relative;
              box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            ">
              <span id="closeExtensionPopup" style="
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 20px;
                font-weight: bold;
                color: #333;
                cursor: pointer;
              ">&times;</span>
              <h2>Rappel de la DSI</h2>
              <p style="padding:30px">`+ CONFIG.awarenessText + `</p>
            </div>
          </div>
        `;

        // Injecter la popup dans le body
        document.body.insertAdjacentHTML('beforeend', popupHTML);

        // Récupérer les éléments
        const popup = document.getElementById('ChatGptPrivacy-popup');
        const closeBtn = document.getElementById('closeExtensionPopup');

        // Ouvrir la popup automatiquement (ou tu peux lier à un événement)
        popup.style.display = 'flex';

        // Fermer la popup en cliquant sur la croix
        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
        });

        // Fermer la popup en cliquant en dehors de la boîte
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
            }
        });
    }

    // Fonction pour fermer toutes les popups avec le bouton "close-button"
    function closeChatPopups() {
        // Sélectionne tous les boutons ayant data-testid="close-button"
        var closeButtons = document.querySelectorAll('[data-testid="close-button"]');

        // Parcours et "click" sur chaque bouton pour fermer la popup
        closeButtons.forEach(button => {
            button.click();
            console.log("Popup fermée :", button);
        });

        // Sélectionne tous les liens <a>
        var allLinks = document.querySelectorAll('a');

        // Convertit en tableau et filtre par texte exact
        var links = Array.from(allLinks).filter(a => a.textContent.trim() === 'Rester déconnecté');

        // Vérifie que c'est bien un tableau avant le forEach
        if (Array.isArray(links)) {
            links.forEach(link => {
                link.click();
                console.log("Popup fermée :", link);
            });
        }
    }

    // redirige les chat normaux en mode ForceRedirectPrivacyMode
    function forceRedirectPrivacyMode() {
        const url = new URL(window.location.href);
        const urlPrivacyParam = CONFIG.authorizedIAUrlParam;

        if (!(url.hostname === CONFIG.authorizedIA)) {
            window.location.replace(CONFIG.redirectionIAUrl);
        }
        else if (url.hostname === CONFIG.authorizedIA && !url.searchParams.has(CONFIG.authorizedIAUrlParam)) {
            // Ajoute le paramètre et redirige
            url.searchParams.set(CONFIG.authorizedIAUrlParam, "true");
            window.location.replace(url.toString());
        }
    }
    
    // attend proprement que le body existe
    function waitForBody(timeout = CONFIG.timer.WATCHGUARD_INTERVAL_MS) {
        return new Promise((resolve) => {
            if (document.body) return resolve(true);

            const start = Date.now();
            const poll = () => {
                if (document.body) return resolve(true);
                if (Date.now() - start > timeout) return resolve(false);
                requestAnimationFrame(poll);
            };
            poll();
        });
    }

    // installe l'observer en toute sécurité
    async function safeObserve() {
        const bodyReady = await waitForBody(CONFIG.timer.WATCHGUARD_INTERVAL_MS);
        if (!bodyReady) {
            err("body introuvable après attente — abort observe");
            return;
        }

        // crée l'observer si nécessaire
        if (typeof MutationObserver === "undefined") {
            err("MutationObserver non supporté dans cet environnement");
            return;
        }

        // évite création multiple d'observer si déjà défini
        if (window.__GHT_OBSERVER_INSTALLED) {
            log("Observer déjà installé, skip");
            return;
        }

        const target = document.body || document.documentElement;
        if (!(target instanceof Node)) {
            err("Cible d'observation non valide:", target);
            return;
        }

        try {
            const observer = new MutationObserver((mutations) => {
            // Petite optimisation : on ne réinitialise que si le header réapparait
                if (!document.body.dataset.modified && DefaultHeaderIsReady()) {
                    log("Mutation détectée → init()");
                    init();
                }
            });

            observer.observe(target, { childList: true, subtree: true });
            window.__GHT_OBSERVER = observer;
            window.__GHT_OBSERVER_INSTALLED = true;
            log("MutationObserver installé sur", target.tagName);
        } catch (e) {
            err("Échec lors de l'appel observer.observe:", e);
        }
    }

    // Hook sur changement d'URL en SPA (pushState/popState)
    function hookHistory() {
        try {
            const _wr = function (type) {
                const orig = history[type];
                return function () {
                    const rv = orig.apply(this, arguments);
                    window.dispatchEvent(new Event("ght-history-change"));
                    return rv;
                };
            };
            history.pushState = _wr("pushState");
            history.replaceState = _wr("replaceState");
            window.addEventListener("popstate", () => window.dispatchEvent(new Event("ght-history-change")));
            window.addEventListener("ght-history-change", () => {
                // réinitialise les flags pour permettre nouvelle injection si nécessaire
                document.body && delete document.body.dataset.modified;
                document.body && delete document.body.dataset.bannerInjected;
                document.body && delete document.body.dataset.alertInjected;
                log("Navigation SPA détectée → flags reset");
                // tente une réinjection
                setTimeout(() => safeObserve().catch(e => err(e)), 50);
            });
            log("Hook historique installé");
        } catch (e) {
            err("Erreur hookHistory:", e);
        }
    }

    // determine si le header est bien charger pour le rebranding
    function DefaultHeaderIsReady() {
        const header = document.querySelector('#page-header');
        if (!header)  return false;

        // Vérifie que le header contient bien ses images et boutons (par ex.)
        const hasImages     = header.querySelectorAll('svg').length > 0;
        const hasButtons    = header.querySelectorAll('button').length > 0;

        if (hasImages && hasButtons) 
            return true;
        
        return false;
    }


  // #########################################
  // ####           Runtime               ####
  // #########################################
 
    log("[GHT] Force ChatGpt privacy mode");

    // force chatGpt en mode ephemere ----------
    forceRedirectPrivacyMode();
    setInterval(forceRedirectPrivacyMode, CONFIG.timer.REDIRECTION_INTERVAL_MS);

    // rebranding et securisation ------------
    (async function start() {
        // on tente au cas ou 
        if (DefaultHeaderIsReady())
            init();

        //sinon on monitore les changements de DOM
        await waitForBody(CONFIG.timer.WATCHGUARD_INTERVAL_MS);
        // installe observer avec protections
        safeObserve();   
        // surveille les changements d'URL SPA
        hookHistory();       
    })();

    // auto close chatgpt pop up -------------
    setInterval(closeChatPopups, CONFIG.timer.CLOSE_POPUP_INTERVAL_MS);
})();
