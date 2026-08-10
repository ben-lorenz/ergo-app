
/*
=========================================================
clockTraining.js
Therapie-App

Steuerung des Uhrentrainings

Modi:

1. Ziffernblatt beschriften
2. Uhrzeit ablesen
3. Uhrzeit einstellen
=========================================================
*/


document.addEventListener(
    "DOMContentLoaded",
    () => {

        initClockTraining();

    }
);



// =========================================================
// GLOBALE VARIABLEN
// =========================================================

let therapyClock = null;

let settingMode = null;

let currentClockMode = "label";

let currentInputMode = "clockwise";



// =========================================================
// INITIALISIERUNG
// =========================================================

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



// =========================================================
// EVENT LISTENER
// =========================================================

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

    clockwise = im Uhrzeigersinn
    random    = zufällige Reihenfolge
    manual    = freie Eingabe
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



// =========================================================
// AKTUELLEN MODUS ERMITTELN
// =========================================================

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



// =========================================================
// MODUS WECHSELN
// =========================================================

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



// =========================================================
// AKTUELLEN MODUS STARTEN
// =========================================================

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



// =========================================================
// BESCHRIFTUNGSMODUS
// =========================================================

function startLabelMode() {

    hideReadingInputs();

    hideSettingTask();

    clearClockResult();


    /*
    -----------------------------------------------------
    Schwierigkeitsstufe bestimmen
    -----------------------------------------------------
    */

    const preset =
        getLabelDifficulty();


    /*
    -----------------------------------------------------
    Uhr neu zeichnen
    -----------------------------------------------------
    */

    therapyClock.renderLabelMode(
        preset
    );


    /*
    -----------------------------------------------------
    Eingabeverhalten festlegen
    -----------------------------------------------------

    clockwise = im Uhrzeigersinn
    random    = zufällige Reihenfolge
    manual    = freie Eingabe
    -----------------------------------------------------
    */

    switch (
        currentInputMode
    ) {

        case "clockwise":

            setupClockwiseInput();

            break;


        case "random":

            setupRandomInput();

            break;


        case "manual":

        default:

            setupManualInput();

            break;

    }

}



// =========================================================
// SCHWIERIGKEIT BESCHRIFTUNG
// =========================================================

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



// =========================================================
// ABLESEMODUS
// =========================================================

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



// =========================================================
// ZEIT FÜR ABLESEN ERZEUGEN
// =========================================================

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



// =========================================================
// ABLESE-SCHWIERIGKEIT
// =========================================================

function getReadingDifficulty() {

    const selected =
        document.querySelector(
            "input[name='readingDifficulty']:checked"
        );


    return selected
        ? selected.value
        : "easy";

}



// =========================================================
// ABLESEN PRÜFEN
// =========================================================

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


    const enteredHour =
        Number(
            hourInput.value
        );


    const enteredMinute =
        Number(
            minuteInput.value
        );


    const target =
        window.currentReadingTime;


    if (!target) {

        return;

    }


    /*
    Zwei gültige Lösungen:
    z.B. 03:25 und 15:25
    */

    const solution1Hour =
        target.hour;


    const solution2Hour =
        target.hour + 12;


    const correct =
        enteredMinute === target.minute &&
        (
            enteredHour === solution1Hour ||
            enteredHour === solution2Hour
        );


    const result =
        document.getElementById(
            "clockResult"
        );


    if (!result) {

        return;

    }


    result.className = "";


    if (correct) {

        result.textContent =
            "✓ Richtig";

    }

    else {

        result.textContent =
            "✗ Falsch";

    }

}



// =========================================================
// EINSTELLMODUS
// =========================================================

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



// =========================================================
// SCHWIERIGKEIT EINSTELLMODUS
// =========================================================

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



// =========================================================
// AKTUELLEN MODUS PRÜFEN
// =========================================================

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



// =========================================================
// BESCHRIFTUNG PRÜFEN
// =========================================================

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



// =========================================================
// EINSTELLMODUS PRÜFEN
// =========================================================

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



// =========================================================
// ABLESEFELDER ANZEIGEN
// =========================================================

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



// =========================================================
// ABLESEFELDER AUSBLENDEN
// =========================================================

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



// =========================================================
// BESCHRIFTUNGSFELDER ENTFERNEN
// =========================================================

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



// =========================================================
// AUFGABENTEXT EINSTELLMODUS
// =========================================================

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



// =========================================================
// ERGEBNIS LÖSCHEN
// =========================================================

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



// =========================================================
// ZEIT FORMATIEREN
// =========================================================

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



// =========================================================
// EINGABEVERHALTEN BESCHRIFTUNG
// =========================================================



// =========================================================
// PRÜFEN, OB EIN FELD VOLLSTÄNDIG AUSGEFÜLLT IST
// =========================================================
//
// Entscheidend für 10, 11 und 12:
//
// Das input-Event kommt bereits nach der ersten
// eingegebenen Ziffer.
//
// Deshalb darf bei diesen Feldern erst weitergeschaltet
// werden, wenn die erforderliche Anzahl an Ziffern
// erreicht wurde.
//
// 1-9  -> Länge 1
// 10-12 -> Länge 2
//
// dataset.length wird bereits von TherapyClock.js
// korrekt gesetzt.
// =========================================================

function isInputComplete(input) {

    if (!input) {

        return false;

    }


    const requiredLength =
        Number(
            input.dataset.length
        );


    /*
    Falls aus irgendeinem Grund keine Länge
    vorhanden ist, sicherheitshalber die
    tatsächliche erwartete Länge aus der
    Stundenzahl ableiten.
    */

    const fallbackLength =
        Number(input.dataset.hour) >= 10
            ? 2
            : 1;


    const length =
        Number.isFinite(
            requiredLength
        ) &&
        requiredLength > 0
            ? requiredLength
            : fallbackLength;


    /*
    Nur tatsächliche Ziffern berücksichtigen.
    */

    const value =
        input.value.trim();


    if (value === "") {

        return false;

    }


    /*
    Ein Feld ist erst fertig, wenn die
    benötigte Anzahl Zeichen vorhanden ist.
    */

    return value.length >= length;

}



// =========================================================
// NUR EIN EINGABEFELD AKTIVIEREN
// =========================================================

function enableOnly(index) {

    if (
        !therapyClock ||
        !therapyClock.inputs
    ) {

        return;

    }


    therapyClock.inputs.forEach(
        (input, i) => {

            /*
            -------------------------------------------------
            WICHTIG:

            Nur dataset.given entscheidet darüber,
            ob ein Feld vorgegeben ist.

            disabled bedeutet lediglich:
            Dieses Feld ist momentan nicht aktiv.
            -------------------------------------------------
            */

            if (
                input.dataset.given === "true"
            ) {

                input.disabled = true;

                return;

            }


            if (
                i === index
            ) {

                input.disabled = false;

                input.style.display =
                    "block";

            }

            else {

                input.disabled = true;

            }

        }
    );


    /*
    Fokus auf das aktive Feld setzen.
    */

    const activeInput =
        therapyClock.inputs[index];


    if (
        activeInput &&
        activeInput.dataset.given !== "true"
    ) {

        activeInput.focus();

    }

}



// =========================================================
// MANUELL
// =========================================================

function setupManualInput() {

    if (
        !therapyClock ||
        !therapyClock.inputs
    ) {

        return;

    }


    therapyClock.inputs.forEach(
        input => {

            /*
            -------------------------------------------------
            Vorgegebene Zahlen bleiben gesperrt.

            Nur dataset.given entscheidet.
            -------------------------------------------------
            */

            if (
                input.dataset.given === "true"
            ) {

                input.disabled = true;

                return;

            }


            /*
            -------------------------------------------------
            Freie Felder sind wirklich frei.
            -------------------------------------------------
            */

            input.disabled = false;

            input.style.display =
                "block";

        }
    );

}



// =========================================================
// EINGABE UHRZEIGERSINN
//
// Die freien Felder werden in der Reihenfolge
// 1 -> 2 -> 3 -> ... freigegeben.
//
// Vorgegebene Zahlen werden übersprungen.
//
// WICHTIG:
// Ein temporär gesperrtes Feld ist NICHT
// automatisch ein vorgegebenes Feld.
//
// ZUSÄTZLICH:
// Bei 10, 11 und 12 wird erst nach der
// zweiten Ziffer weitergeschaltet.
// =========================================================

function setupClockwiseInput() {

    if (
        !therapyClock ||
        !therapyClock.inputs
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Alte Listener entfernen
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        input => {

            const oldHandler =
                input._clockwiseHandler;


            if (oldHandler) {

                input.removeEventListener(
                    "input",
                    oldHandler
                );

            }

        }
    );


    /*
    -----------------------------------------------------
    Alle wirklich freien Felder sammeln.
    -----------------------------------------------------

    NICHT anhand von disabled!

    Ausschließlich dataset.given entscheidet.
    -----------------------------------------------------
    */

    const freeIndices = [];


    therapyClock.inputs.forEach(
        (input, index) => {

            if (
                input.dataset.given !==
                "true"
            ) {

                freeIndices.push(
                    index
                );

            }

        }
    );


    /*
    -----------------------------------------------------
    Keine freien Felder
    -----------------------------------------------------
    */

    if (
        freeIndices.length === 0
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Alle Felder zunächst sperren.

    Dadurch wird kein Feld zu "given".
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        input => {

            input.disabled = true;

        }
    );


    /*
    -----------------------------------------------------
    Erstes freies Feld aktivieren.
    -----------------------------------------------------
    */

    enableOnly(
        freeIndices[0]
    );


    /*
    -----------------------------------------------------
    Handler für alle Felder
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        (input, index) => {

            const handler =
                () => {

                    /*
                    -------------------------------------------------
                    Nur reagieren, wenn tatsächlich etwas
                    eingegeben wurde.
                    -------------------------------------------------
                    */

                    if (
                        input.value.trim() === ""
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    NEU:

                    Bei 10, 11 und 12 darf nach der ersten
                    Ziffer NOCH NICHT weitergeschaltet werden.

                    Bei 1-9 reicht eine Ziffer.
                    -------------------------------------------------
                    */

                    if (
                        !isInputComplete(
                            input
                        )
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    Das aktuelle Feld bleibt ausdrücklich
                    ein freies Feld.

                    Wir setzen hier NICHT:
                        dataset.given = "true"
                    -------------------------------------------------
                    */


                    /*
                    -------------------------------------------------
                    Position des aktuellen Feldes
                    in der Liste der freien Felder.
                    -------------------------------------------------
                    */

                    const currentPosition =
                        freeIndices.indexOf(
                            index
                        );


                    /*
                    Vorgegebene Felder ignorieren.
                    */

                    if (
                        currentPosition === -1
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    Nächstes freies Feld.
                    -------------------------------------------------
                    */

                    const nextPosition =
                        currentPosition + 1;


                    /*
                    -------------------------------------------------
                    Noch ein freies Feld vorhanden.
                    -------------------------------------------------
                    */

                    if (
                        nextPosition <
                        freeIndices.length
                    ) {

                        enableOnly(
                            freeIndices[
                                nextPosition
                            ]
                        );

                    }

                    else {

                        /*
                        -------------------------------------------------
                        Alle freien Felder wurden ausgefüllt.

                        Das aktuelle Feld bleibt:
                            dataset.given = "false"

                        Es wird NICHT nachträglich als
                        vorgegeben markiert.
                        -------------------------------------------------
                        */

                        input.blur();

                    }

                };


            input._clockwiseHandler =
                handler;


            input.addEventListener(
                "input",
                handler
            );

        }
    );

}



// =========================================================
// ZUFÄLLIGE REIHENFOLGE
// =========================================================

function setupRandomInput() {

    if (
        !therapyClock ||
        !therapyClock.inputs
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Alte Zufalls-Handler entfernen
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        input => {

            const oldHandler =
                input._randomHandler;


            if (oldHandler) {

                input.removeEventListener(
                    "input",
                    oldHandler
                );

            }

        }
    );


    /*
    -----------------------------------------------------
    Indizes aller frei auszufüllenden
    Felder sammeln.
    -----------------------------------------------------
    */

    const indices = [];


    therapyClock.inputs.forEach(
        (input, index) => {

            if (
                input.dataset.given !==
                "true"
            ) {

                indices.push(
                    index
                );

            }

        }
    );


    /*
    -----------------------------------------------------
    Fisher-Yates Shuffle
    -----------------------------------------------------
    */

    for (
        let i = indices.length - 1;
        i > 0;
        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            indices[i],
            indices[randomIndex]
        ] =
        [
            indices[randomIndex],
            indices[i]
        ];

    }


    /*
    -----------------------------------------------------
    Alle Felder zunächst sperren.
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        input => {

            input.disabled = true;

        }
    );


    /*
    -----------------------------------------------------
    Keine freien Felder vorhanden.
    -----------------------------------------------------
    */

    if (
        indices.length === 0
    ) {

        return;

    }


    /*
    -----------------------------------------------------
    Zufälliges erstes Feld aktivieren.
    -----------------------------------------------------
    */

    enableOnly(
        indices[0]
    );


    /*
    -----------------------------------------------------
    Eingabe-Handler erstellen.
    -----------------------------------------------------
    */

    therapyClock.inputs.forEach(
        (input, index) => {

            const handler =
                () => {

                    /*
                    -------------------------------------------------
                    Leere Eingabe ignorieren.
                    -------------------------------------------------
                    */

                    if (
                        input.value.trim() === ""
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    WICHTIG:

                    Auch im Zufallsmodus erst weitergehen,
                    wenn das komplette Feld ausgefüllt ist.

                    Dadurch bleiben 10, 11 und 12 nach der
                    ersten Ziffer noch aktiv.
                    -------------------------------------------------
                    */

                    if (
                        !isInputComplete(
                            input
                        )
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    Position des aktuellen Feldes in der
                    Zufallsreihenfolge.
                    -------------------------------------------------
                    */

                    const currentPosition =
                        indices.indexOf(
                            index
                        );


                    /*
                    Vorgegebenes Feld ignorieren.
                    */

                    if (
                        currentPosition === -1
                    ) {

                        return;

                    }


                    /*
                    -------------------------------------------------
                    Nächstes zufälliges Feld.
                    -------------------------------------------------
                    */

                    const nextPosition =
                        currentPosition + 1;


                    if (
                        nextPosition <
                        indices.length
                    ) {

                        enableOnly(
                            indices[
                                nextPosition
                            ]
                        );

                    }

                    else {

                        /*
                        -------------------------------------------------
                        Alle Felder erledigt.
                        -------------------------------------------------
                        */

                        input.blur();

                    }

                };


            input._randomHandler =
                handler;


            input.addEventListener(
                "input",
                handler
            );

        }
    );

}

