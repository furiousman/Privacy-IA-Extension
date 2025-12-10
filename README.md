# Privacy-IA-Extension
Extension Edge pour forcer l'utilisation de Chatgpt dans le respect du RGPD et des environnements sécurisés

## Installation
1) Il faut modifier le fichier config.js pour customiser votre plugin
2) Il faut générer le CRX depuis Edge (https://learn.microsoft.com/en-us/deployedge/microsoft-edge-manage-extensions-webstore)
3) Récupérer la clé public avec openssl en CLI depuis le fichier PEM (clé privée) générer par Edge et la renseigner dans le manifest.json
4) Copier le ficheir CRX et le fichier update.xml (en changenant les chemins) dans un site IIS accessibles aux utilisateurs par exemple
5) Intégrer la GPO pour déployer l'extension et la forcer en navigation inPrivate.
