/* ==========================================
   Hirnleistungstraining - Merkspiel
   Version 1.0

   Teil 1:
   - Variablen
   - Initialisierung
   - Einstellungen
   - Zeichengenerierung
   - Merkphase
========================================== */


// ===============================
// Globale Variablen
// ===============================

const colors = [

    "#E53935", // Rot
    "#1E88E5", // Blau
    "#43A047", // Grün
    "#FDD835", // Gelb
    "#8E24AA", // Lila
    "#070808", // Schwarz
    "#FB8C00", // Orange
    "#6D4C41", // Braun
    "#3949AB", // Indigo
    "#546E7A", // Blaugrau

];


let sequence = [];

let displaySequence = [];

let answerSequence = [];

let memoryTimer = null;


// ===============================
// Start
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    init
);



function init(){


    document
        .getElementById("startBtn")
        .addEventListener(
            "click",
            startGame
        );


    document
        .getElementById("endMemoryBtn")
        .addEventListener(
            "click",
            hideSequence
        );


    document
        .getElementById("checkBtn")
        .addEventListener(
            "click",
            evaluateAnswers
        );


    document
        .getElementById("newRoundBtn")
        .addEventListener(
            "click",
            startGame
        );


    setupTimeOptions();


    hideButtons();


}



// ===============================
// Buttons verwalten
// ===============================


function hideButtons(){


    document
        .getElementById("endMemoryBtn")
        .style.display = "none";


    document
        .getElementById("checkBtn")
        .style.display = "none";


    document
        .getElementById("newRoundBtn")
        .style.display = "none";


}



function showButton(id){


    document
        .getElementById(id)
        .style.display = "inline-block";


}



function hideButton(id){


    document
        .getElementById(id)
        .style.display = "none";


}



// ===============================
// Merkzeit Einstellungen
// ===============================


function setupTimeOptions(){


    const options =
        document.querySelectorAll(
            "input[name='timeMode']"
        );


    options.forEach(option => {


        option.addEventListener(
            "change",
            updateCustomTimeVisibility
        );


    });


    updateCustomTimeVisibility();


}



function updateCustomTimeVisibility(){


    const selected =
        document.querySelector(
            "input[name='timeMode']:checked"
        ).value;


    const container =
        document.getElementById(
            "customTimeContainer"
        );


    if(selected === "custom"){


        container.style.display = "block";


    } else {


        container.style.display = "none";


    }


}



// ===============================
// Spiel starten
// ===============================


function startGame(){


    clearTimeout(memoryTimer);


    hideButtons();


    document
        .getElementById("sequence")
        .innerHTML = "";


    document
        .getElementById("answers")
        .innerHTML = "";


    document
        .getElementById("result")
        .innerHTML = "";


    setPhaseTitle(
        "Merken"
    );


    generateSequence();


    createDisplaySequence();


    showMemorySequence();


    startMemoryTimer();


}



// ===============================
// Sequenz erstellen
// ===============================


function generateSequence(){


    sequence = [];


    const count =
        Number(
            document.getElementById("count").value
        );


    const mode =
        document.querySelector(
            "input[name='mode']:checked"
        ).value;



    const available =
        createCharacterPool(mode);



    const shuffledColors =
        shuffle(
            [...colors]
        );



    for(let i = 0; i < count; i++){


        sequence.push({

            value:
                available[
                    Math.floor(
                        Math.random()
                        *
                        available.length
                    )
                ],

            color:
                shuffledColors[i]

        });


    }


}



// ===============================
// Zeichenpool
// ===============================


function createCharacterPool(mode){


    const letters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ";


    const numbers =
        "0123456789";



    if(mode === "letters"){


        return letters.split("");


    }


    if(mode === "numbers"){


        return numbers.split("");


    }


    return (
        letters + numbers
    ).split("");



}



// ===============================
// Anzeige-Reihenfolge erstellen
// ===============================


function createDisplaySequence(){

    displaySequence = [...sequence];

    answerSequence = [...sequence];

}



// ===============================
// Merkphase anzeigen
// ===============================


function showMemorySequence(){


    const area =
        document.getElementById(
            "sequence"
        );


    area.innerHTML = "";



    const displayMode =
        document.querySelector(
            "input[name='displayMode']:checked"
        ).value;



    displaySequence.forEach(item => {


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";



if(displayMode === "colors"){


    card.style.background =
        item.color;


    card.style.color =
        "white";


}


else if(displayMode === "hiddenColors"){


    card.style.background =
        "white";


    card.style.color =
        "#333";


    card.style.border =
        "2px solid #ddd";


}


else if(displayMode === "none"){


    card.style.background =
        "#f5f5f5";


    card.style.color =
        "#333";


    card.style.border =
        "2px solid #ddd";


}



        card.innerHTML =
            item.value;



        area.appendChild(card);



    });


}



// ===============================
// Timer starten
// ===============================


function startMemoryTimer(){


    const mode =
        document.querySelector(
            "input[name='timeMode']:checked"
        ).value;



    if(mode === "manual"){


        showButton(
            "endMemoryBtn"
        );


        return;


    }



    let seconds;



    if(mode === "automatic"){


        seconds =
            displaySequence.length;


    }



    if(mode === "custom"){


        seconds =
            Number(
                document.getElementById("time").value
            );


    }



    memoryTimer =
        setTimeout(
            hideSequence,
            seconds * 1000
        );


}

/* ==========================================
   Hirnleistungstraining - Merkspiel
   Version 1.0

   Teil 2:
   - Abdeckphase
   - Antwortkarten
   - Eingabe
   - Auswertung
   - Lösung
   - Hilfsfunktionen
========================================== */



// ===============================
// Merkphase beenden / Abdecken
// ===============================


function hideSequence(){


    clearTimeout(memoryTimer);


    hideButton(
        "endMemoryBtn"
    );


    setPhaseTitle(
        "Eingabe"
    );


    const area =
        document.getElementById(
            "sequence"
        );


    area.innerHTML = "";

    if(
    document
    .getElementById("shuffleColors")
    .checked
    ){

    answerSequence = shuffle(
        answerSequence
    );

    }



    displaySequence.forEach(item => {


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


const displayMode =
    document.querySelector(
        "input[name='displayMode']:checked"
    ).value;


if(displayMode === "none"){


    card.style.background =
        "#f5f5f5";


    card.style.color =
        "#333";


}
else{


    card.style.background =
        item.color;


    card.style.color =
        "white";


}


        card.style.color =
            "white";


        card.innerHTML =
            "";


        area.appendChild(card);


    });



    createAnswerCards();


    showButton(
        "checkBtn"
    );


}



// ===============================
// Antwortkarten erstellen
// ===============================


function createAnswerCards(){

    const area =
        document.getElementById("answers");


    area.innerHTML = "";


    const displayMode =
        document.querySelector(
            "input[name='displayMode']:checked"
        ).value;



    answerSequence.forEach((item,index)=>{


        const card =
            document.createElement("div");


        card.className =
            "answerCard";



        let colorHTML = "";



        // Farben anzeigen bei beiden Farbmodi
        if(
            displayMode === "colors" ||
            displayMode === "hiddenColors"
        ){

            colorHTML = `
                <div
                    class="colorBox"
                    style="background:${item.color}">
                </div>
            `;

        }



        card.innerHTML = `

            ${colorHTML}

            <input
                id="answer${index}"
                maxlength="1"
                autocomplete="off">

        `;



        area.appendChild(card);


    });



    setupInputs();

}



// ===============================
// Eingabe vorbereiten
// ===============================


function setupInputs(){


    const inputs =
        document.querySelectorAll(
            ".answerCard input"
        );



    inputs.forEach(
        (input,index)=>{


        input.addEventListener(
            "input",
            function(){


                this.value =
                    this.value
                    .toUpperCase()
                    .replace(
                        /[^A-Z0-9]/g,
                        ""
                    );



                if(
                    this.value.length === 1 &&
                    index < inputs.length - 1
                ){

                    inputs[index+1]
                        .focus();

                }


            }
        );



        input.addEventListener(
            "keydown",
            function(event){


                if(
                    event.key === "Backspace" &&
                    this.value === "" &&
                    index > 0
                ){

                    inputs[index-1]
                        .focus();

                }


            }
        );


    });



    if(inputs.length > 0){

        inputs[0].focus();

    }


}



// ===============================
// Auswertung
// ===============================


function evaluateAnswers(){


    let correct = 0;



    answerSequence.forEach(
        (item,index)=>{


        const input =
            document.getElementById(
                "answer" + index
            );



        const answer =
            input.value
            .toUpperCase();



        if(answer === item.value){


            input.classList.add(
                "correct"
            );


            correct++;



        } else {


            input.classList.add(
                "wrong"
            );


        }



        input.disabled = true;



    });



    showSolution();



    document
        .getElementById("result")
        .innerHTML =

        `${correct} von ${displaySequence.length} richtig`;



    hideButton(
        "checkBtn"
    );


    showButton(
        "newRoundBtn"
    );


    setPhaseTitle(
        "Auswertung"
    );


}



// ===============================
// Lösung anzeigen
// ===============================


function showSolution(){


    const area =
        document.getElementById(
            "sequence"
        );


    area.innerHTML = "";



    sequence.forEach(item=>{


        const card =
            document.createElement(
                "div"
            );


        card.className =
            "card";


        card.style.background =
            item.color;


        card.style.color =
            "white";


        card.innerHTML =
            item.value;


        area.appendChild(card);



    });


}



// ===============================
// Neue Runde
// ===============================


function resetGame(){


    document
        .getElementById(
            "sequence"
        )
        .innerHTML = "";



    document
        .getElementById(
            "answers"
        )
        .innerHTML = "";



    document
        .getElementById(
            "result"
        )
        .innerHTML = "";


}



// ===============================
// Überschrift ändern
// ===============================


function setPhaseTitle(text){


    document
        .getElementById(
            "phaseTitle"
        )
        .innerHTML = text;


}



// ===============================
// Array mischen
// ===============================


function shuffle(array){


    for(
        let i = array.length - 1;
        i > 0;
        i--
    ){


        const j =
            Math.floor(
                Math.random()
                *
                (i + 1)
            );



        [
            array[i],
            array[j]
        ] =
        [
            array[j],
            array[i]
        ];

    }



    return array;


}
