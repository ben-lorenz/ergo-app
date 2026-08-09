class TherapyClock {


    constructor(container) {

        this.container = container;

        this.size = 520;

        this.center = this.size / 2;

        this.radius = 210;


        this.svg = null;

        this.handLayer = null;

        this.inputs = [];

    }






    // =====================================
    // Grundaufbau der Uhr
    // =====================================


    createBaseClock(showNumbers = false) {


        this.container.innerHTML = "";

        this.inputs = [];



        this.svg =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
            );



        this.svg.setAttribute(
            "width",
            this.size
        );


        this.svg.setAttribute(
            "height",
            this.size
        );


        this.svg.classList.add(
            "therapyClock"
        );



        this.container.appendChild(
            this.svg
        );



        this.drawClockCircle();


        this.drawTicks();



        if(showNumbers){

            this.drawNumbers();

        }



        this.handLayer =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "g"
            );


        this.handLayer.classList.add(
            "handLayer"
        );


        this.svg.appendChild(
            this.handLayer
        );



        this.drawCenter();


    }







    // =====================================
    // Außenkreis
    // =====================================


    drawClockCircle(){


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



        this.svg.appendChild(
            circle
        );


    }








    // =====================================
    // Minuten- und Stundenmarkierungen
    // =====================================


    drawTicks(){



        for(
            let i = 0;
            i < 60;
            i++
        ){



            const angle =
                (
                    i * 6 - 90
                )
                *
                Math.PI
                /
                180;




            const outer =
                this.radius - 10;



            const inner =
                i % 5 === 0
                ?
                this.radius - 35
                :
                this.radius - 22;




            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );



            line.setAttribute(
                "x1",
                this.center +
                Math.cos(angle)
                *
                inner
            );


            line.setAttribute(
                "y1",
                this.center +
                Math.sin(angle)
                *
                inner
            );



            line.setAttribute(
                "x2",
                this.center +
                Math.cos(angle)
                *
                outer
            );


            line.setAttribute(
                "y2",
                this.center +
                Math.sin(angle)
                *
                outer
            );



            if(
                i % 5 === 0
            ){

                line.classList.add(
                    "hourTick"
                );

            }
            else{


                line.classList.add(
                    "minuteTick"
                );


            }



            this.svg.appendChild(
                line
            );



        }


    }








    // =====================================
    // Zahlen 1-12
    // =====================================


    drawNumbers(){



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
                (
                    this.radius - 60
                );



            const y =
                this.center +
                Math.sin(angle)
                *
                (
                    this.radius - 60
                );





            const text =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );



            text.setAttribute(
                "x",
                x
            );



            text.setAttribute(
                "y",
                y
            );



            text.setAttribute(
                "text-anchor",
                "middle"
            );



            text.setAttribute(
                "dominant-baseline",
                "middle"
            );



            text.textContent =
                hour;



            text.classList.add(
                "clockNumber"
            );



            this.svg.appendChild(
                text
            );



        }



    }








    // =====================================
    // Mittelpunkt
    // =====================================


    drawCenter(){



        const center =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );



        center.setAttribute(
            "cx",
            this.center
        );



        center.setAttribute(
            "cy",
            this.center
        );



        center.setAttribute(
            "r",
            8
        );



        center.classList.add(
            "clockCenter"
        );



        this.svg.appendChild(
            center
        );



    }
        // =====================================
    // Beschriftungsmodus
    // =====================================


    renderLabelMode(settings = []) {


        this.createBaseClock(false);



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
                (
                    this.radius - 45
                );



            const y =
                this.center +
                Math.sin(angle)
                *
                (
                    this.radius - 45
                );




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



            input.maxLength =
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



        }


    }







    // =====================================
    // Ablesemodus
    // =====================================


    renderReadingMode(){


        this.createBaseClock(true);


    }








    // =====================================
    // Uhrzeit anzeigen
    // =====================================


    showTime(hour, minute){



        if(
            !this.handLayer
        ){

            return;

        }




        this.handLayer.innerHTML =
            "";




        const hourAngle =
            (
                hour * 30
                +
                minute * 0.5
                -
                90
            )
            *
            Math.PI
            /
            180;



        const minuteAngle =
            (
                minute * 6
                -
                90
            )
            *
            Math.PI
            /
            180;





        this.drawHand(
            hourAngle,
            this.radius * 0.55,
            "hourHand"
        );



        this.drawHand(
            minuteAngle,
            this.radius * 0.8,
            "minuteHand"
        );



        // Mittelpunkt nochmal darüber zeichnen

        this.drawHandCenter();



    }








    // =====================================
    // Einzelnen Zeiger zeichnen
    // =====================================


    drawHand(
        angle,
        length,
        className
    ){



        const line =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "line"
            );




        line.setAttribute(
            "x1",
            this.center
        );



        line.setAttribute(
            "y1",
            this.center
        );



        line.setAttribute(
            "x2",
            this.center +
            Math.cos(angle)
            *
            length
        );



        line.setAttribute(
            "y2",
            this.center +
            Math.sin(angle)
            *
            length
        );



        line.classList.add(
            className
        );



        this.handLayer.appendChild(
            line
        );



    }








    drawHandCenter(){



        const dot =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "circle"
            );



        dot.setAttribute(
            "cx",
            this.center
        );



        dot.setAttribute(
            "cy",
            this.center
        );



        dot.setAttribute(
            "r",
            8
        );



        dot.classList.add(
            "clockCenter"
        );



        this.handLayer.appendChild(
            dot
        );


    }








    // =====================================
    // Beschriftung prüfen
    // =====================================


    check(){



        let correct = 0;

        let total = 0;



        this.inputs.forEach(
            input => {



                if(
                    input.disabled
                ){

                    return;

                }



                total++;



                if(
                    Number(input.value)
                    ===
                    Number(input.dataset.hour)
                ){



                    correct++;



                    input.classList.add(
                        "correct"
                    );



                    input.classList.remove(
                        "wrong"
                    );



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

            correct,

            total

        };


    }

    /*
=========================================================
UHRZEIT EINSTELLEN
=========================================================
*/

/*
 * Zielzeit für den Einstellmodus setzen.
 *
 * Beispiel:
 * setTargetTime(14, 35)
 */

setTargetTime(hour, minute) {

    this.targetHour = hour;
    this.targetMinute = minute;

    this.setTimeMode = true;

}



/*
=========================================================
EINSTELLUHR ZEICHNEN
=========================================================
*/

renderSettingMode() {

    this.setTimeMode = true;

    this.userHour = 12;
    this.userMinute = 0;

    this.renderClock();

    this.drawSettingHands();

    this.setupSettingInteraction();

}



/*
=========================================================
ZEIGER FÜR EINSTELLMODUS
=========================================================
*/

drawSettingHands() {

    const svg =
        this.container.querySelector("svg");

    if (!svg) {

        return;

    }



    /*
     * Alte Einstellzeiger entfernen
     */

    svg
        .querySelectorAll(".setting-hand")
        .forEach(hand => hand.remove());



    /*
     * Mittelpunkt der Uhr
     */

    const centerX =
        this.centerX;

    const centerY =
        this.centerY;



    /*
     * Minutenzeiger
     */

    const minuteAngle =
        this.userMinute * 6;

    const minuteLength =
        this.radius * 0.72;



    const minuteEnd =
        this.getPointOnClock(
            minuteAngle,
            minuteLength
        );



    const minuteHand =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );



    minuteHand.setAttribute(
        "x1",
        centerX
    );

    minuteHand.setAttribute(
        "y1",
        centerY
    );

    minuteHand.setAttribute(
        "x2",
        minuteEnd.x
    );

    minuteHand.setAttribute(
        "y2",
        minuteEnd.y
    );



    minuteHand.classList.add(
        "setting-hand",
        "minute-hand"
    );



    svg.appendChild(
        minuteHand
    );



    /*
     * Stundenzeiger
     */

    const hourAngle =
        (
            (this.userHour % 12) * 30
        )
        +
        (
            this.userMinute * 0.5
        );



    const hourLength =
        this.radius * 0.52;



    const hourEnd =
        this.getPointOnClock(
            hourAngle,
            hourLength
        );



    const hourHand =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );



    hourHand.setAttribute(
        "x1",
        centerX
    );

    hourHand.setAttribute(
        "y1",
        centerY
    );

    hourHand.setAttribute(
        "x2",
        hourEnd.x
    );

    hourHand.setAttribute(
        "y2",
        hourEnd.y
    );



    hourHand.classList.add(
        "setting-hand",
        "hour-hand"
    );



    svg.appendChild(
        hourHand
    );

}



/*
=========================================================
PUNKT AUF UHR BERECHNEN
=========================================================
*/

getPointOnClock(
    angle,
    length
) {

    /*
     * SVG beginnt oben bei -90 Grad.
     */

    const radians =
        (
            angle - 90
        )
        *
        Math.PI
        /
        180;



    return {

        x:
            this.centerX
            +
            Math.cos(radians) * length,

        y:
            this.centerY
            +
            Math.sin(radians) * length

    };

}



/*
=========================================================
EINGABE FÜR EINSTELLUHR
=========================================================
*/

setupSettingInteraction() {

    const svg =
        this.container.querySelector("svg");



    if (!svg) {

        return;

    }



    /*
     * Alten Listener entfernen,
     * damit beim Erzeugen einer neuen Aufgabe
     * nicht mehrere Listener übereinanderliegen.
     */

    if (this.settingClickHandler) {

        svg.removeEventListener(
            "click",
            this.settingClickHandler
        );

    }



    this.settingClickHandler =
        (event) => {

            this.handleClockClick(
                event
            );

        };



    svg.addEventListener(
        "click",
        this.settingClickHandler
    );

}



/*
=========================================================
KLICK AUF UHR VERARBEITEN
=========================================================
*/

handleClockClick(event) {

    const svg =
        event.currentTarget;



    const rect =
        svg.getBoundingClientRect();



    const x =
        event.clientX
        -
        rect.left;



    const y =
        event.clientY
        -
        rect.top;



    /*
     * SVG-Koordinaten berücksichtigen.
     */

    const scaleX =
        this.viewBoxWidth /
        rect.width;



    const scaleY =
        this.viewBoxHeight /
        rect.height;



    const svgX =
        x * scaleX;



    const svgY =
        y * scaleY;



    const dx =
        svgX - this.centerX;



    const dy =
        svgY - this.centerY;



    /*
     * Winkel bestimmen.
     *
     * atan2 liefert den Winkel
     * ab 3-Uhr-Position.
     */

    let angle =
        Math.atan2(
            dy,
            dx
        )
        *
        180
        /
        Math.PI;



    /*
     * Auf 12 Uhr als 0 Grad drehen.
     */

    angle =
        angle + 90;



    if (angle < 0) {

        angle += 360;

    }



    if (angle >= 360) {

        angle -= 360;

    }



    /*
     * Auf die nächste Minute runden.
     */

    let minute =
        Math.round(
            angle / 6
        );



    if (minute === 60) {

        minute = 0;

    }



    /*
     * Stunde aus dem bisherigen
     * Stundenwert beibehalten.
     */

    let hour =
        this.userHour;



    /*
     * Wenn wir über 12 Uhr springen,
     * Stunde entsprechend anpassen.
     */

    if (
        this.userMinute > 45
        &&
        minute < 15
    ) {

        hour++;

    }



    if (
        this.userMinute < 15
        &&
        minute > 45
    ) {

        hour--;

    }



    if (hour > 12) {

        hour = 1;

    }



    if (hour < 1) {

        hour = 12;

    }



    this.userHour =
        hour;



    this.userMinute =
        minute;



    this.drawSettingHands();

}



/*
=========================================================
AKTUELLE EINSTELLUNG AUSLESEN
=========================================================
*/

getSetTime() {

    return {

        hour:
            this.userHour,

        minute:
            this.userMinute

    };

}



}
