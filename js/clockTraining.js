let therapyClock;



document.addEventListener(
    "DOMContentLoaded",
    () => {



        const container =
            document.getElementById(
                "clockContainer"
            );



        if(
            !container
        ){

            return;

        }




        therapyClock =
            new TherapyClock(
                container
            );



        startClock();





        const startButton =
            document.getElementById(
                "startClockBtn"
            );


        if(startButton){


            startButton.addEventListener(
                "click",
                startClock
            );


        }





        const checkButton =
            document.getElementById(
                "checkClockBtn"
            );


        if(checkButton){


            checkButton.addEventListener(
                "click",
                checkClock
            );


        }





        // automatische neue Aufgabe

        document
            .querySelectorAll(
                "#clockPage input"
            )
            .forEach(
                input => {


                    input.addEventListener(
                        "change",
                        startClock
                    );


                }
            );



    }

);







function startClock(){



    const result =
        document.getElementById(
            "clockResult"
        );



    if(result){

        result.innerHTML = "";

    }





    const difficulty =
        document.querySelector(
            "input[name='clockDifficulty']:checked"
        )
        .value;





    let preset = [];





    if(
        difficulty === "easy"
    ){


        preset = [
            12,
            3,
            6,
            9
        ];


    }





    if(
        difficulty === "medium"
    ){


        preset = [
            12
        ];


    }





    if(
        difficulty === "hard"
    ){


        preset = [];


    }






    therapyClock.render(
        preset
    );



}








function checkClock(){



    const result =
        therapyClock.check();





    document
        .getElementById(
            "clockResult"
        )
        .innerHTML =


        `${result.correct} von ${result.total} richtig`;



}
