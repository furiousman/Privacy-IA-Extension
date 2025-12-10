// Customization
var CONFIG = {
    logoBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAIAQMAAAD+wSzIAAAABlBMVEX///+/v7+jQ3Y5AAAADklEQVQI12P4AIX8EAgALgAD/aNpbtEAAAAASUVORK5CYII"
    companyName: "COMPANY_NAME",
    awarenessText: `<div style="color:black;">
        ⚠️ <strong>Attention :</strong> Les informations saisies dans cet outil peuvent être transmises à des serveurs externes.
        Ne partagez jamais de <u>données sensibles, confidentielles ou nominatives</u>.
        <br><br>
        Les réponses de l’IA peuvent contenir des erreurs : <strong>vérifiez toujours les contenus avant diffusion ou décision.</strong>
      </div>`,
    authorizedIA: "chatgpt.com",
    authorizedIAUrlParam: "temporary-chat",
    redirectionIAUrl: "https://chatgpt.com/?temporary-chat=true",

    theme: {
        bannerBackground: "#004c8c",
        bannerColor: "white",
        alertBackground: "#fff8e1",
        alertBorder: "#f0c36d"
    },

    timer: {
        REDIRECTION_INTERVAL_MS : 10000,
        CLOSE_POPUP_INTERVAL_MS : 800,
        WATCHGUARD_INTERVAL_MS : 5000
    }
};
