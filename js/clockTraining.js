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

let clockFeedback = null;

let secondReadingActive = false;

console.log("clockTraining.js geladen");



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



    clockFeedback =
        new ClockFeedback(
            "clockResult"
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



    setupClockEventListeners();



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
    Zweite Lösung Checkbox
    -----------------------------------------------------
    */

    const secondSolutionCheckbox =
        document.getElementById(
            "showSecondReadingSolution"
        );


    if (secondSolutionCheckbox) {

        console.log("Checkbox gefunden:");

        secondSolutionCheckbox.addEventListener(
            "change",
            () => {

                console.log("Checkbox checked");

                secondReadingActive =
                    secondSolutionCheckbox.checked;

                console.log("Zweite Lösung aktiv");

                updateSecondReadingBox();

            }
        );

    }



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



    const preset =
        getLabelDifficulty();



    therapyClock.renderLabelMode(
        preset
    );



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

    updateSecondReadingBox();

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



    const fields = [

        "answerHour",

        "answerMinute",

        "answerHour2",

        "answerMinute2"

    ];



    fields.forEach(
        id => {

            const field =
                document.getElementById(
                    id
                );


            if(field){

                field.value = "";

            }

        }
    );



    const hourInput =
        document.getElementById(
            "answerHour"
        );


    if(hourInput){

        hourInput.focus();

    }

}

function updateSecondReadingBox(){

    console.log(
        "updateSecondReadingBox gestartet"
    );


    const box =
        document.getElementById(
            "secondReadingInputs"
        );


    console.log(
        "Box gefunden:",
        box
    );


    if(!box){
        return;
    }


    box.style.display =
        secondReadingActive
            ? "flex"
            : "none";


    console.log(
        "Display gesetzt:",
        box.style.display
    );

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


        case "easy":

            minute = 0;

            break;



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

function checkReading(){

    const target =
        window.currentReadingTime;


    if(!target){
        return;
    }


    const hour1 =
        Number(
            document.getElementById(
                "answerHour"
            ).value
        );


    const minute1 =
        Number(
            document.getElementById(
                "answerMinute"
            ).value
        );


    const solution1 =
        hour1 === target.hour &&
        minute1 === target.minute;



    const hour2 =
        Number(
            document.getElementById(
                "answerHour2"
            )?.value
        );


    const minute2 =
        Number(
            document.getElementById(
                "answerMinute2"
            )?.value
        );


    const solution2 =
        hour2 === target.hour + 12 &&
        minute2 === target.minute;



    let correct = false;


    if(secondReadingActive){

        correct =
            solution1 &&
            solution2;

    }

    else{

        correct =
            solution1 ||
            solution2;

    }



    if(correct){

        clockFeedback.showSuccess(
            "✓ Richtig",
            ""
        );

    }

    else{

        clockFeedback.showError(
            "✗ Falsch",
            ""
        );

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



    clockFeedback.showInfo(

        result.correct +
        " von " +
        result.total +
        " richtig."

    );

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



    if(result.correct){


        clockFeedback.showSuccess(
            "✓ Richtig",
            ""
        );


    }

    else {


        clockFeedback.showError(

            "✗ Falsch",

            "Eingestellt war " +
            formatTime(
                result.userHour,
                result.userMinute
            )

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



    if(inputs){


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



    if(inputs){


        inputs.style.display =
            "none";


    }


}





// =========================================================
// BESCHRIFTUNGSFELDER ENTFERNEN
// =========================================================

function clearClockInputs() {


    if(
        !therapyClock ||
        !therapyClock.inputs
    ){

        return;

    }



    therapyClock.inputs.forEach(
        input => {

            if(input){

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



    if(task){

        task.style.display =
            "none";

    }


}





// =========================================================
// ERGEBNIS LÖSCHEN
// =========================================================

function clearClockResult() {


    if(clockFeedback){

        clockFeedback.clear();

    }


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
            .padStart(2,"0")

        +

        ":"

        +

        String(minute)
            .padStart(2,"0")

    );


}







// =========================================================
// EINGABEVERHALTEN BESCHRIFTUNG
// =========================================================


function isInputComplete(
    input
) {


    if(!input){

        return false;

    }



    const requiredLength =
        Number(
            input.dataset.length
        );



    const fallbackLength =
        Number(
            input.dataset.hour
        ) >= 10
            ? 2
            : 1;



    const length =
        Number.isFinite(
            requiredLength
        ) &&
        requiredLength > 0
            ? requiredLength
            : fallbackLength;



    return (
        input.value.trim() !== "" &&
        input.value.length >= length
    );


}





// =========================================================
// NUR EIN EINGABEFELD AKTIVIEREN
// =========================================================

function enableOnly(
    index
) {


    if(
        !therapyClock ||
        !therapyClock.inputs
    ){

        return;

    }



    therapyClock.inputs.forEach(
        (input,i)=>{


            if(
                input.dataset.given ===
                "true"
            ){

                input.disabled = true;

                return;

            }



            input.disabled =
                i !== index;



            if(
                i === index
            ){

                input.style.display =
                    "block";

            }


        }
    );



    const active =
        therapyClock.inputs[index];



    if(active){

        active.focus();

    }


}





// =========================================================
// MANUELL
// =========================================================

function setupManualInput(){


    if(
        !therapyClock ||
        !therapyClock.inputs
    ){

        return;

    }



    therapyClock.inputs.forEach(
        input=>{


            if(
                input.dataset.given ===
                "true"
            ){

                input.disabled = true;

            }

            else {


                input.disabled = false;

                input.style.display =
                    "block";


            }


        }
    );


}





// =========================================================
// UHRZEIGERSINN
// =========================================================

function setupClockwiseInput(){


    if(
        !therapyClock ||
        !therapyClock.inputs
    ){

        return;

    }



    const freeIndices = [];



    therapyClock.inputs.forEach(
        (input,index)=>{


            if(
                input.dataset.given !==
                "true"
            ){

                freeIndices.push(index);

            }


        }
    );



    if(
        freeIndices.length === 0
    ){

        return;

    }



    therapyClock.inputs.forEach(
        input=>{

            input.disabled = true;

        }
    );



    enableOnly(
        freeIndices[0]
    );



    therapyClock.inputs.forEach(
        (input,index)=>{


            input.oninput =
                ()=>{


                    if(
                        !isInputComplete(input)
                    ){

                        return;

                    }



                    const position =
                        freeIndices.indexOf(
                            index
                        );



                    if(position === -1){

                        return;

                    }



                    const next =
                        position + 1;



                    if(
                        next <
                        freeIndices.length
                    ){

                        enableOnly(
                            freeIndices[next]
                        );

                    }

                    else{

                        input.blur();

                    }


                };


        }
    );


}





// =========================================================
// ZUFÄLLIGE REIHENFOLGE
// =========================================================

function setupRandomInput(){


    if(
        !therapyClock ||
        !therapyClock.inputs
    ){

        return;

    }



    const indices = [];



    therapyClock.inputs.forEach(
        (input,index)=>{


            if(
                input.dataset.given !==
                "true"
            ){

                indices.push(index);

            }


        }
    );



    for(
        let i = indices.length-1;
        i>0;
        i--
    ){

        const random =
            Math.floor(
                Math.random()*(i+1)
            );


        [
            indices[i],
            indices[random]
        ] =
        [
            indices[random],
            indices[i]
        ];

    }



    therapyClock.inputs.forEach(
        input=>{

            input.disabled = true;

        }
    );



    enableOnly(
        indices[0]
    );



    therapyClock.inputs.forEach(
        (input,index)=>{


            input.oninput =
                ()=>{


                    if(
                        !isInputComplete(input)
                    ){

                        return;

                    }



                    const pos =
                        indices.indexOf(
                            index
                        );



                    if(pos === -1){

                        return;

                    }



                    const next =
                        pos+1;



                    if(
                        next <
                        indices.length
                    ){

                        enableOnly(
                            indices[next]
                        );

                    }

                    else{

                        input.blur();

                    }


                };


        }
    );


}
