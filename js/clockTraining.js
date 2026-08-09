/*
=========================================================
clockTraining.js
Therapie-App

Steuerung des Uhrentrainings

Modi:

1. Ziffernblatt beschriften
2. Uhrzeit ablesen
3. Uhrzeit einstellen

Die Darstellung übernimmt TherapyClock.
Der Einstellmodus übernimmt ClockSettingMode.
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initClockTraining();

    }
);





/*
=========================================================
GLOBALE VARIABLEN
=========================================================
*/

let therapyClock = null;

let settingMode = null;

let currentClockMode = "label";

let currentInputMode = "clockwise";





/*
=========================================================
INITIALISIERUNG
=========================================================
*/

function initClockTraining() {

    const container =
        document.getElementById(
            "clockContainer"
        );


    if (!container) {

        console.error(
            "clockContainer wurde nicht gefunden."
        );

        return;

    }


    /*
    -----------------------------------------------------
    TherapyClock erzeugen
    -----------------------------------------------------
    */

    if (
        typeof TherapyClock !==
        "function"
    ) {

        console.error(
            "TherapyClock.js wurde nicht korrekt geladen."
        );

        return;

    }


    therapyClock =
        new TherapyClock(
            container
        );


    /*
    -----------------------------------------------------
    ClockSettingMode erzeugen
    -----------------------------------------------------
    */

    if (
        typeof ClockSettingMode ===
        "function"
    ) {

        settingMode =
            new ClockSettingMode(
                therapyClock
            );

    }
    else {

        console.warn(
            "ClockSettingMode.js wurde nicht gefunden."
        );

    }


    /*
    -----------------------------------------------------
    Ereignisse
    -----------------------------------------------------
    */

    setupClockEventListeners();


    /*
    -----------------------------------------------------
    Aktuellen Modus anzeigen
    -----------------------------------------------------
    */

    switchClockMode(
        getSelectedClockMode()
    );

}





/*
=========================================================
EVENT LISTENER
=========================================================
*/

function setupClockEventListeners() {


    /*
    -----------------------------------------------------
    Modus
    -----------------------------------------------------
    */

    document
        .querySelectorAll(
            "input[name='clockMode']"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        if (
                            radio.checked
                        ) {

                            switchClockMode(
                                radio.value
                            );

                        }

                    }
                );

            }
        );



    /*
    -----------------------------------------------------
    Beschriftungs-Schwierigkeit
    -----------------------------------------------------
    */

    document
        .querySelectorAll(
            "input[name='clockDifficulty']"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        if (
                            currentClockMode ===
                            "label" &&
                            radio.checked
                        ) {

                            startLabelMode();

                        }

                    }
                );

            }
        );



    /*
    -----------------------------------------------------
    Ablese-Schwierigkeit
    -----------------------------------------------------
    */

    document
        .querySelectorAll(
            "input[name='readingDifficulty']"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        if (
                            currentClockMode ===
                            "reading" &&
                            radio.checked
                        ) {

                            startReadingMode();

                        }

                    }
                );

            }
        );



    /*
    -----------------------------------------------------
    Einstell-Schwierigkeit
    -----------------------------------------------------
    */

    document
        .querySelectorAll(
            "input[name='settingDifficulty']"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        if (
                            currentClockMode ===
                            "setting" &&
                            radio.checked
                        ) {

                            startSettingMode();

                        }

                    }
                );

            }
        );



    /*
    -----------------------------------------------------
    Eingabeverhalten Beschriftung
    -----------------------------------------------------
    */

    document
        .querySelectorAll(
            "input[name='clockInputMode']"
        )
        .forEach(
            radio => {

                radio.addEventListener(
                    "change",
                    () => {

                        if (
                            radio.checked
                        ) {

                            currentInputMode =
                                radio.value;

                        }

                    }
                );

            }
        );



    /*
    -----------------------------------------------------
    Neue Aufgabe
    -----------------------------------------------------
    */

    const startButton =
        document.getElementById(
            "startClockBtn"
        );


    if (startButton) {

        startButton.addEventListener(
            "click",
            () => {

                startCurrentClockMode();

            }
        );

    }



    /*
    -----------------------------------------------------
    Prüfen
    -----------------------------------------------------
    */

    const checkButton =
        document.getElementById(
            "checkClockBtn"
        );


    if (checkButton) {

        checkButton.addEventListener(
            "click",
            () => {

                checkCurrentClockMode();

            }
        );

    }

}





/*
=========================================================
AKTUELLEN MODUS ERMITTELN
=========================================================
*/

function getSelectedClockMode() {

    const selected =
        document.querySelector(
            "input[name='clockMode']:checked"
        );


    if (!selected) {

        return "label";

    }


    return selected.value;

}





/*
=========================================================
MODUS WECHSELN
=========================================================
*/

function switchClockMode(
    mode
) {

    currentClockMode =
        mode;


    /*
    -----------------------------------------------------
    Alte Zustände zurücksetzen
    -----------------------------------------------------
    */

    clearClockResult();

    hideReadingInputs();

    hideSettingTask();

    clearClockInputs();


    if (settingMode) {

        if (
            typeof settingMode.stop ===
            "function"
        ) {

            settingMode.stop();

        }

    }



    /*
    -----------------------------------------------------
    Einstellungsbereiche
    -----------------------------------------------------
    */

    const labelSettings =
        document.getElementById(
            "labelSettings"
        );

    const readingSettings =
        document.getElementById(
            "readingSettings"
        );

    const settingSettings =
        document.getElementById(
            "settingSettings"
        );



    if (labelSettings) {

        labelSettings.style.display =
            mode === "label"
                ? "block"
                : "none";

    }


    if (readingSettings) {

        readingSettings.style.display =
            mode === "reading"
                ? "block"
                : "none";

    }


    if (settingSettings) {

        settingSettings.style.display =
            mode === "setting"
                ? "block"
                : "none";

    }



    /*
    -----------------------------------------------------
    Modus starten
    -----------------------------------------------------
    */

    startCurrentClockMode();

}





/*
=========================================================
AKTUELLEN MODUS STARTEN
=========================================================
*/

function startCurrentClockMode() {

    clearClockResult();


    if (
        currentClockMode ===
        "label"
    ) {

        startLabelMode();

        return;

    }


    if (
        currentClockMode ===
        "reading"
    ) {

        startReadingMode();

        return;

    }


    if (
        currentClockMode ===
        "setting"
    ) {

        startSettingMode();

        return;

    }

}





/*
=========================================================
BESCHRIFTUNGSMODUS
=========================================================
*/

function startLabelMode() {

    hideReadingInputs();

    hideSettingTask();

    clearClockResult();


    if (!therapyClock) {

        return;

    }


    const difficulty =
        getLabelDifficulty();


    therapyClock.renderLabelMode(
        difficulty
    );

}





/*
=========================================================
SCHWIERIGKEIT BESCHRIFTUNG
=========================================================
*/

function getLabelDifficulty() {

    const selected =
        document.querySelector(
            "input[name='clockDifficulty']:checked"
        );


    const difficulty =
        selected
            ? selected.value
            : "easy";


    switch (
        difficulty
    ) {

        case "easy":

            return [
                3,
                6,
                9,
                12
            ];


        case "medium":

            return [
                12
            ];


        case "hard":

            return [];


        default:

            return [
                12
            ];

    }

}





/*
=========================================================
ABLESEMODUS
=========================================================
*/

function startReadingMode() {

    hideSettingTask();

    clearClockResult();

    clearClockInputs();

    showReadingInputs();


    if (!therapyClock) {

        return;

    }


    therapyClock.renderReadingMode();


    const time =
        generateReadingTime();


    therapyClock.showTime(
        time.hour,
        time.minute
    );


    window.currentReadingTime =
        time;


    const hourInput =
        document.getElementById(
            "answerHour"
        );

    const minuteInput =
        document.getElementById(
            "answerMinute"
        );


    if (hourInput) {

        hourInput.value = "";

    }


    if (minuteInput) {

        minuteInput.value = "";

    }


    if (hourInput) {

        hourInput.focus();

    }

}





/*
=========================================================
ZEIT FÜR ABLESEN ERZEUGEN
=========================================================
*/

function generateReadingTime() {

    const difficulty =
        getReadingDifficulty();


    let hour =
        Math.floor(
            Math.random() * 12
        ) + 1;


    let minute = 0;


    switch (
        difficulty
    ) {

        /*
        -------------------------------------------------
        Volle Stunden
        -------------------------------------------------
        */

        case "easy":

            minute = 0;

            break;



        /*
        -------------------------------------------------
        15 Minuten
        -------------------------------------------------
        */

        case "medium": {

            const values = [
                0,
                15,
                30,
                45
            ];


            minute =
                values[
                    Math.floor(
                        Math.random() *
                        values.length
                    )
                ];

            break;

        }



        /*
        -------------------------------------------------
        5 Minuten
        -------------------------------------------------
        */

        case "hard": {

            const values = [];


            for (
                let i = 0;
                i < 12;
                i++
            ) {

                values.push(
                    i * 5
                );

            }


            minute =
                values[
                    Math.floor(
                        Math.random() *
                        values.length
                    )
                ];

            break;

        }



        /*
        -------------------------------------------------
        Jede Minute
        -------------------------------------------------
        */

        case "everyMinute":

            minute =
                Math.floor(
                    Math.random() * 60
                );

            break;



        default:

            minute = 0;

    }


    return {

        hour,
        minute

    };

}





/*
=========================================================
ABLESE-SCHWIERIGKEIT
=========================================================
*/

function getReadingDifficulty() {

    const selected =
        document.querySelector(
            "input[name='readingDifficulty']:checked"
        );


    return selected
        ? selected.value
        : "easy";

}





/*
=========================================================
ABLESEN PRÜFEN
=========================================================
*/

function checkReading() {

    const hourInput =
        document.getElementById(
            "answerHour"
        );

    const minuteInput =
        document.getElementById(
            "answerMinute"
        );


    if (
        !hourInput ||
        !minuteInput
    ) {

        return;

    }


    const hourText =
        hourInput.value.trim();

    const minuteText =
        minuteInput.value.trim();


    if (
        hourText === "" ||
        minuteText === ""
    ) {

        return;

    }


    const enteredHour =
        Number(
            hourText
        );

    const enteredMinute =
        Number(
            minuteText
        );


    const target =
        window.currentReadingTime;


    if (!target) {

        return;

    }


    const correct =
        enteredHour === target.hour &&
        enteredMinute === target.minute;


    const result =
        document.getElementById(
            "clockResult"
        );


    if (!result) {

        return;

    }


    if (correct) {

        result.textContent =
            "✓ Richtig";

        result.className =
            "correct";

    }
    else {

        result.textContent =
            "✗ Nicht ganz. Richtig wäre " +
            formatTime(
                target.hour,
                target.minute
            ) +
            ".";

        result.className =
            "wrong";

    }

}





/*
=========================================================
EINSTELLMODUS
=========================================================
*/

function startSettingMode() {

    hideReadingInputs();

    clearClockResult();

    hideSettingTask();

    clearClockInputs();


    if (!settingMode) {

        console.error(
            "ClockSettingMode ist nicht verfügbar."
        );

        return;

    }


    const difficulty =
        getSettingDifficulty();


    if (
        typeof settingMode.start !==
        "function"
    ) {

        console.error(
            "ClockSettingMode.start() wurde nicht gefunden."
        );

        return;

    }


    settingMode.start(
        difficulty
    );

}





/*
=========================================================
SCHWIERIGKEIT EINSTELLMODUS
=========================================================
*/

function getSettingDifficulty() {

    const selected =
        document.querySelector(
            "input[name='settingDifficulty']:checked"
        );


    const difficulty =
        selected
            ? selected.value
            : "easy";


    switch (
        difficulty
    ) {

        case "easy":

            return "hours";


        case "medium":

            return "quarter";


        case "hard":

            return "five";


        case "everyMinute":

            return "everyMinute";


        default:

            return "hours";

    }

}





/*
=========================================================
AKTUELLEN MODUS PRÜFEN
=========================================================
*/

function checkCurrentClockMode() {


    if (
        currentClockMode ===
        "label"
    ) {

        checkLabel();

        return;

    }


    if (
        currentClockMode ===
        "reading"
    ) {

        checkReading();

        return;

    }


    if (
        currentClockMode ===
        "setting"
    ) {

        checkSetting();

        return;

    }

}





/*
=========================================================
BESCHRIFTUNG PRÜFEN
=========================================================
*/

function checkLabel() {

    if (
        !therapyClock ||
        typeof therapyClock.check !==
        "function"
    ) {

        return;

    }


    const result =
        therapyClock.check();


    const resultElement =
        document.getElementById(
            "clockResult"
        );


    if (!resultElement) {

        return;

    }


    resultElement.textContent =
        result.correct +
        " von " +
        result.total +
        " richtig.";


    resultElement.className =
        "";

}





/*
=========================================================
EINSTELLMODUS PRÜFEN
=========================================================
*/

function checkSetting() {

    if (!settingMode) {
        return;
    }

    const result =
        settingMode.check();

    const resultElement =
        document.getElementById(
            "clockResult"
        );

    if (!resultElement) {
        return;
    }

    /*
    Ergebnis zurücksetzen
    */

    resultElement.textContent = "";
    resultElement.className = "";

    /*
    Richtig
    */

    if (result.correct) {

        resultElement.textContent =
            "✓ Richtig";

    }

    /*
    Falsch
    */

    else {

        resultElement.textContent =
            "✗ Falsch – eingestellt war " +
            formatTime(
                result.userHour,
                result.userMinute
            );

    }

}









/*
=========================================================
ABLESEFELDER ANZEIGEN
=========================================================
*/

function showReadingInputs() {

    const inputs =
        document.getElementById(
            "readingInputs"
        );


    if (inputs) {

        inputs.style.display =
            "flex";

    }

}





/*
=========================================================
ABLESEFELDER AUSBLENDEN
=========================================================
*/

function hideReadingInputs() {

    const inputs =
        document.getElementById(
            "readingInputs"
        );


    if (inputs) {

        inputs.style.display =
            "none";

    }

}





/*
=========================================================
BESCHRIFTUNGSFELDER ENTFERNEN
=========================================================
*/

function clearClockInputs() {

    if (
        !therapyClock ||
        !therapyClock.inputs
    ) {

        return;

    }


    therapyClock.inputs.forEach(
        input => {

            if (input) {

                input.remove();

            }

        }
    );


    therapyClock.inputs = [];

}





/*
=========================================================
AUFGABENTEXT EINSTELLMODUS
=========================================================
*/

function hideSettingTask() {

    const task =
        document.getElementById(
            "settingTask"
        );


    if (task) {

        task.style.display =
            "none";

    }

}





/*
=========================================================
ERGEBNIS LÖSCHEN
=========================================================
*/

function clearClockResult() {

    const result =
        document.getElementById(
            "clockResult"
        );


    if (!result) {

        return;

    }


    result.textContent = "";

    result.className = "";

}





/*
=========================================================
ZEIT FORMATIEREN
=========================================================
*/

function formatTime(
    hour,
    minute
) {

    return (
        String(hour)
            .padStart(2, "0")
        +
        ":"
        +
        String(minute)
            .padStart(2, "0")
    );

}

