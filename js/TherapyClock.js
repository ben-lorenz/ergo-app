class TherapyClock {


    constructor(container) {


        this.container = container;

        this.size = 520;

        this.center = this.size / 2;

        this.radius = 200;

        this.inputs = [];


    }





    render(settings = []) {


        // alten Zustand komplett löschen

        this.inputs = [];

        this.container.innerHTML = "";



        // Container vorbereiten

        this.container.style.position = "relative";



        // SVG erzeugen

        const svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );


        svg.setAttribute(
            "width",
            this.size
        );


        svg.setAttribute(
            "height",
            this.size
        );


        svg.classList.add(
            "therapyClock"
        );



        // Uhrkreis

        const circle =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );


        circle.setAttribute(
            "cx",
            this.center
        );


        circle.setAttribute(
            "cy",
            this.center
        );


        circle.setAttribute(
            "r",
            this.radius
        );


        circle.classList.add(
            "clockCircle"
        );


        svg.appendChild(circle);



        this.container.appendChild(svg);




        // Zahlenfelder erzeugen

        for(
            let hour = 1;
            hour <= 12;
            hour++
        ){


            const angle =
                (
                    hour * 30 - 90
                )
                *
                Math.PI
                /
                180;



            const x =
                this.center +
                Math.cos(angle)
                *
                this.radius;



            const y =
                this.center +
                Math.sin(angle)
                *
                this.radius;



            const input =
                document.createElement(
                    "input"
                );


            input.className =
                "clockInput";


            input.dataset.hour =
                hour;
            input.dataset.length =
                hour >= 10 ? 2 : 1;



            input.style.left =
                (
                    x - 25
                )
                +
                "px";


            input.style.top =
                (
                    y - 25
                )
                +
                "px";



            // Hilfszahlen eintragen

            if(
                settings.includes(hour)
            ){


                input.value =
                    hour;


                input.disabled =
                    true;


            }



            this.inputs.push(
                input
            );


            this.container.appendChild(
                input
            );

            const inputMode =
            document.querySelector(
            "input[name='clockInputMode']:checked"
             ).value;



            this.setupInputNavigation(
            inputMode
            );


            }

        }


    





    check(){


        let correct = 0;

        let total = 0;



        this.inputs.forEach(
            input => {



                // Vorgaben nicht bewerten

                if(
                    input.disabled
                ){

                    return;

                }



                total++;



                const value =
                    Number(
                        input.value
                    );



                if(
                    value ===
                    Number(
                        input.dataset.hour
                    )
                ){


                    input.classList.add(
                        "correct"
                    );


                    input.classList.remove(
                        "wrong"
                    );


                    correct++;


                }
                else{


                    input.classList.add(
                        "wrong"
                    );


                    input.classList.remove(
                        "correct"
                    );


                }


            }
        );



        return {


            correct: correct,

            total: total


        };


    }

    setupInputNavigation(mode){


    this.inputs.forEach(input => {


        input.addEventListener(
            "input",
            () => {


                if(
                input.value.length <
                Number(input.dataset.length)
                ){

                return;

            }



                input.blur();



                if(mode === "clockwise"){


                    this.focusNextClockwise(input);


                }



                if(mode === "random"){


                    this.focusRandom(input);


                }



            }
        );


    });


    }





    focusNextClockwise(current){


    const currentHour =
        Number(
            current.dataset.hour
        );



    for(
        let i = 1;
        i <= 12;
        i++
    ){


        let nextHour =
            currentHour + i;



        if(nextHour > 12){

            nextHour -= 12;

        }



        const next =
            this.inputs.find(
                input =>
                Number(input.dataset.hour)
                === nextHour
            );



        if(
            next &&
            !next.disabled &&
            next.value === ""
        ){

            next.focus();

            return;

        }


    }


    }





    focusRandom(){


    const free =
        this.inputs.filter(
            input =>
            !input.disabled &&
            input.value === ""
        );



    if(
        free.length === 0
    ){

        return;

    }



    const random =
        free[
            Math.floor(
                Math.random()
                *
                free.length
            )
        ];



    random.focus();


    }

}
