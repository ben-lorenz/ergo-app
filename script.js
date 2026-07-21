const colors = [
    "#e74c3c",
    "#3498db",
    "#2ecc71",
    "#f1c40f",
    "#9b59b6",
    "#1abc9c",
    "#e67e22",
    "#34495e",
    "#ff69b4",
    "#7f8c8d"
];

const timeOptions =
document.querySelectorAll(
    "input[name='timeMode']"
);


timeOptions.forEach(option => {

    option.addEventListener(
        "change",
        updateTimeSettings
    );

});


function updateTimeSettings(){

    const selected =
    document.querySelector(
        "input[name='timeMode']:checked"
    ).value;


    const container =
    document.getElementById(
        "customTimeContainer"
    );


    if(selected === "custom"){

        container.style.display="block";

    }else{

        container.style.display="none";

    }

}

let sequence = [];

document
.getElementById("startBtn")
.addEventListener("click", startGame);

document
.getElementById("checkBtn")
.addEventListener("click", checkAnswers);

document
    .getElementById("newRoundBtn")
    .addEventListener("click", startGame);

document
    .getElementById("endMemoryBtn")
    .addEventListener("click",hideSequence);

function showManualButton(){

    document
    .getElementById("endMemoryBtn")
    .style.display="block";

}

function startGame(){

    document.getElementById("result").innerHTML="";
    document.getElementById("answers").innerHTML="";
    document.getElementById("sequence").innerHTML="";
    document.getElementById("checkBtn").style.display="none";
    document.getElementById("newRoundBtn").style.display = "none";

    generateSequence();

    showSequence();

    const timeMode =
document.querySelector(
    "input[name='timeMode']:checked"
).value;


if(timeMode === "manual"){

    showManualButton();

}

else {


    let seconds;


    if(timeMode === "automatic"){

        seconds = sequence.length;

    }


    if(timeMode === "custom"){

        seconds =
        Number(
            document.getElementById("time").value
        );

    }


    setTimeout(() => {

        hideSequence();

    }, seconds * 1000);


}

}

function generateSequence(){

    sequence=[];

    const count =
        Number(document.getElementById("count").value);

    const mode =
        document.querySelector("input[name='mode']:checked").value;

    for(let i=0;i<count;i++){

        sequence.push({

            value:randomCharacter(mode),

            color:colors[i]

        });

    }

}

function randomCharacter(mode){

    const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers="0123456789";

    if(mode==="letters"){

        return letters[Math.floor(Math.random()*letters.length)];

    }

    if(mode==="numbers"){

        return numbers[Math.floor(Math.random()*numbers.length)];

    }

    const all=letters+numbers;

    return all[Math.floor(Math.random()*all.length)];

}

function showSequence(){

    const area=document.getElementById("sequence");

    sequence.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        const colorMode =
    document.querySelector(
    'input[name="colorMode"]:checked'
    ).value;

    if(colorMode === "visible"){

        card.style.background = item.color;
        card.style.color = "white";

    }else{

        card.style.background = "white";
        card.style.color = "black";
        card.style.border = "2px solid #ccc";

    }

    card.innerHTML = item.value;

        area.appendChild(card);

    });

}

function hideSequence(){

    const area=document.getElementById("sequence");

    area.innerHTML="";

    sequence.forEach(item=>{

        const card=document.createElement("div");

        card.className="card";

        card.style.background=item.color;

        area.appendChild(card);

    });

    createInputs();

    document.getElementById("endMemoryBtn")
    .style.display="none";

}

function createInputs(){

    const area=document.getElementById("answers");

    sequence.forEach((item,index)=>{

        const row=document.createElement("div");

        row.className="answerRow";

        row.innerHTML=`
    <div class="colorBox"
    style="background:${item.color}"></div>

    <input 
    maxlength="1"
    id="answer${index}"
    autocomplete="off">
`;

        area.appendChild(row);

    });

    document.getElementById("checkBtn").style.display="block";

    setupInputNavigation();

}

function setupInputNavigation(){

    const inputs =
    document.querySelectorAll(
        ".answerRow input"
    );


    inputs.forEach((input, index) => {


        input.addEventListener(
            "input",
            function(){

                // automatisch groß schreiben
                this.value =
                this.value.toUpperCase();


                // zum nächsten Feld springen
                if(
                    this.value.length === 1 &&
                    index < inputs.length - 1
                ){

                    inputs[index + 1].focus();

                }

            }
        );


    });

    inputs[0].focus();

}

function checkAnswers(){

    let correct=0;

    sequence.forEach((item,index)=>{

        const input=document.getElementById("answer"+index);

        if(input.value.toUpperCase()==item.value){

            input.classList.add("correct");
            correct++;

        }else{

            input.classList.add("wrong");

        }

    });

    document.getElementById("result").innerHTML=
        `${correct} von ${sequence.length} richtig`;

    document.getElementById("checkBtn").style.display = "none";
    document.getElementById("newRoundBtn").style.display = "block";

}