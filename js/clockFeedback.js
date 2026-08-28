/*
=========================================================
ClockFeedback.js

Darstellung der Rückmeldungen
für das Uhrentraining

- Erfolg
- Fehler
- neutrale Auswertung
- zentrale Darstellung
=========================================================
*/


class ClockFeedback {


    constructor(elementId) {

        this.element =
            document.getElementById(
                elementId
            );


        if (!this.element) {

            console.error(
                "ClockFeedback: Element nicht gefunden:",
                elementId
            );

        }


    }



    /*
    =====================================================
    RICHTIG
    =====================================================
    */


    showSuccess(
        title,
        message = ""
    ) {

        this.show(
            "success",
            title,
            message
        );

    }



    /*
    =====================================================
    FALSCH
    =====================================================
    */


    showError(
        title,
        message = ""
    ) {

        this.show(
            "error",
            title,
            message
        );

    }



    /*
    =====================================================
    NEUTRALE AUSWERTUNG
    =====================================================
    */


    showInfo(
        title,
        message = ""
    ) {

        this.show(
            "info",
            title,
            message
        );

    }



    /*
    =====================================================
    DARSTELLUNG
    =====================================================
    */


    show(
        type,
        title = "",
        message = ""
    ) {


        if (!this.element) {

            return;

        }



        /*
        Sicherheit:
        niemals undefined anzeigen
        */

        if (
            !title
        ) {

            title = "";

        }


        if (
            !message
        ) {

            message = "";

        }



        this.element.className =
            "clockFeedback " +
            type;



        this.element.innerHTML = `

            <div class="feedbackTitle">
                ${title}
            </div>


            ${
                message
                ?
                `
                <div class="feedbackMessage">
                    ${message}
                </div>
                `
                :
                ""
            }

        `;


    }



    /*
    =====================================================
    LEEREN
    =====================================================
    */


    clear() {


        if (!this.element) {

            return;

        }


        this.element.textContent =
            "";


        this.element.className =
            "clockFeedback hidden";


    }


}
