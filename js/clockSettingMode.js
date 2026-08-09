/*
=========================================================
ClockSettingMode.js

Uhrzeit einstellen

- Stundenzeiger frei beweglich
- Minutenzeiger frei beweglich
- jede Minute möglich
- keine Einschränkung durch die Schwierigkeit
- Maus / Touch / Stift über Pointer Events
- unsichtbare Trefferflächen
=========================================================
*/


class ClockSettingMode {

    constructor(therapyClock) {

        this.clock = therapyClock;

        this.targetHour = 12;
        this.targetMinute = 0;

        this.userHour = 12;
        this.userMinute = 0;

        this.dragging = null;

        this.hourHand = null;
        this.minuteHand = null;

        this.hourHitArea = null;
        this.minuteHitArea = null;

        this.centerDot = null;

        this.pointerMoveHandler = null;
        this.pointerUpHandler = null;

    }


    /*
    =====================================================
    START
    =====================================================
    */

    start(difficulty = "hours") {

        this.stop();

        const target =
            this.generateTargetTime(difficulty);

        this.targetHour = target.hour;
        this.targetMinute = target.minute;

        this.showTaskText();

        /*
        Startposition der Patienten-Uhr.
        */

        this.userHour = 12;
        this.userMinute = 0;

        /*
        Uhrengrundfläche aufbauen.
        */

        this.clock.createBaseClock(true);

        this.createSettingHands();

        this.updateHands();

        this.setupInteraction();

    }


    /*
    =====================================================
    ZIELZEIT ERZEUGEN
    =====================================================
    */

    generateTargetTime(difficulty) {

        const hour =
            Math.floor(
                Math.random() * 12
            ) + 1;

        let minute = 0;

        switch (difficulty) {

            case "hours":

                minute = 0;

                break;


            case "quarter":

                minute =
                    [0, 15, 30, 45][
                        Math.floor(
                            Math.random() * 4
                        )
                    ];

                break;


            case "five":

                minute =
                    Math.floor(
                        Math.random() * 12
                    ) * 5;

                break;


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
    =====================================================
    ZEIGER ERSTELLEN
    =====================================================
    */

createSettingHands() {

    const svg = this.clock.svg;

    if (!svg) {
        return;
    }

    /*
    -------------------------------------------------
    Stundenzeiger
    -------------------------------------------------
    */

    this.hourHand =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    this.hourHand.classList.add(
        "setting-hand",
        "setting-hour-hand"
    );

    /*
    Direkt gesetzte SVG-Eigenschaften.
    Dadurch ist der Zeiger unabhängig von
    bisherigen CSS-Regeln sichtbar.
    */

    this.hourHand.setAttribute(
        "stroke",
        "#222"
    );

    this.hourHand.setAttribute(
        "stroke-width",
        "12"
    );

    this.hourHand.setAttribute(
        "stroke-linecap",
        "round"
    );

    this.hourHand.setAttribute(
        "fill",
        "none"
    );

    this.hourHand.style.display = "block";
    this.hourHand.style.visibility = "visible";

    svg.appendChild(
        this.hourHand
    );


    /*
    -------------------------------------------------
    Minutenzeiger
    -------------------------------------------------
    */

    this.minuteHand =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    this.minuteHand.classList.add(
        "setting-hand",
        "setting-minute-hand"
    );

    this.minuteHand.setAttribute(
        "stroke",
        "#222"
    );

    this.minuteHand.setAttribute(
        "stroke-width",
        "8"
    );

    this.minuteHand.setAttribute(
        "stroke-linecap",
        "round"
    );

    this.minuteHand.setAttribute(
        "fill",
        "none"
    );

    this.minuteHand.style.display = "block";
    this.minuteHand.style.visibility = "visible";

    svg.appendChild(
        this.minuteHand
    );


    /*
    -------------------------------------------------
    Unsichtbare Trefferfläche Stundenzeiger
    -------------------------------------------------
    */

    this.hourHitArea =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    this.hourHitArea.classList.add(
        "setting-hit-area"
    );

    this.hourHitArea.dataset.hand =
        "hour";

    this.hourHitArea.setAttribute(
        "stroke",
        "transparent"
    );

    this.hourHitArea.setAttribute(
        "stroke-width",
        "35"
    );

    this.hourHitArea.setAttribute(
        "fill",
        "none"
    );

    this.hourHitArea.setAttribute(
        "pointer-events",
        "stroke"
    );

    svg.appendChild(
        this.hourHitArea
    );


    /*
    -------------------------------------------------
    Unsichtbare Trefferfläche Minutenzeiger
    -------------------------------------------------
    */

    this.minuteHitArea =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

    this.minuteHitArea.classList.add(
        "setting-hit-area"
    );

    this.minuteHitArea.dataset.hand =
        "minute";

    this.minuteHitArea.setAttribute(
        "stroke",
        "transparent"
    );

    this.minuteHitArea.setAttribute(
        "stroke-width",
        "35"
    );

    this.minuteHitArea.setAttribute(
        "fill",
        "none"
    );

    this.minuteHitArea.setAttribute(
        "pointer-events",
        "stroke"
    );

    svg.appendChild(
        this.minuteHitArea
    );


    /*
    -------------------------------------------------
    Mittelpunkt
    -------------------------------------------------
    */

    this.centerDot =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

    this.centerDot.setAttribute(
        "cx",
        this.clock.center
    );

    this.centerDot.setAttribute(
        "cy",
        this.clock.center
    );

    this.centerDot.setAttribute(
        "r",
        "9"
    );

    this.centerDot.classList.add(
        "clockCenter",
        "setting-center"
    );

    svg.appendChild(
        this.centerDot
    );

}


    /*
    =====================================================
    ZEIGER AKTUALISIEREN
    =====================================================
    */

    updateHands() {

        if (
            !this.hourHand ||
            !this.minuteHand
        ) {
            return;
        }


        /*
        -------------------------------------------------
        Stundenwinkel

        Die Minute wird berücksichtigt.

        Beispiel:

        08:00 -> exakt auf 8
        08:30 -> genau zwischen 8 und 9
        08:45 -> 3/4 Richtung 9
        -------------------------------------------------
        */

        const hourAngle =
            (
                (
                    this.userHour % 12
                ) * 30
                +
                this.userMinute * 0.5
                -
                90
            )
            *
            Math.PI
            /
            180;


        const hourLength =
            this.clock.radius * 0.52;


        const hourEnd =
            this.pointOnClock(
                hourAngle,
                hourLength
            );


        this.setLine(
            this.hourHand,
            this.clock.center,
            this.clock.center,
            hourEnd.x,
            hourEnd.y
        );


        /*
        -------------------------------------------------
        Minutenwinkel
        -------------------------------------------------
        */

        const minuteAngle =
            (
                this.userMinute * 6
                -
                90
            )
            *
            Math.PI
            /
            180;


        const minuteLength =
            this.clock.radius * 0.78;


        const minuteEnd =
            this.pointOnClock(
                minuteAngle,
                minuteLength
            );


        this.setLine(
            this.minuteHand,
            this.clock.center,
            this.clock.center,
            minuteEnd.x,
            minuteEnd.y
        );


        /*
        -------------------------------------------------
        Trefferflächen

        Sie sind optisch unsichtbar, aber deutlich
        leichter zu greifen.
        -------------------------------------------------
        */

        this.setLine(
            this.hourHitArea,
            this.clock.center,
            this.clock.center,
            hourEnd.x,
            hourEnd.y
        );


        this.setLine(
            this.minuteHitArea,
            this.clock.center,
            this.clock.center,
            minuteEnd.x,
            minuteEnd.y
        );

    }


    /*
    =====================================================
    SVG-LINIE SETZEN
    =====================================================
    */

    setLine(
        line,
        x1,
        y1,
        x2,
        y2
    ) {

        if (!line) {
            return;
        }

        line.setAttribute(
            "x1",
            x1
        );

        line.setAttribute(
            "y1",
            y1
        );

        line.setAttribute(
            "x2",
            x2
        );

        line.setAttribute(
            "y2",
            y2
        );

    }


    /*
    =====================================================
    PUNKT AUF UHR
    =====================================================
    */

    pointOnClock(
        angle,
        length
    ) {

        return {

            x:
                this.clock.center +
                Math.cos(angle) *
                length,

            y:
                this.clock.center +
                Math.sin(angle) *
                length

        };

    }


    /*
    =====================================================
    INTERAKTION
    =====================================================
    */

    setupInteraction() {

        if (
            !this.hourHitArea ||
            !this.minuteHitArea
        ) {
            return;
        }


        this.hourHitArea.addEventListener(
            "pointerdown",
            event => {

                this.startDrag(
                    "hour",
                    event
                );

            }
        );


        this.minuteHitArea.addEventListener(
            "pointerdown",
            event => {

                this.startDrag(
                    "minute",
                    event
                );

            }
        );

    }


    /*
    =====================================================
    DRAG START
    =====================================================
    */

    startDrag(
        hand,
        event
    ) {

        event.preventDefault();
        event.stopPropagation();

        this.dragging = hand;

        const svg =
            this.clock.svg;

        if (!svg) {
            return;
        }


        /*
        Pointer Capture ermöglicht sauberes Ziehen,
        auch wenn der Finger/Mauszeiger die Trefferfläche
        verlässt.
        */

        try {

            svg.setPointerCapture(
                event.pointerId
            );

        }
        catch {

            // Fallback für ältere Browser.

        }


        this.pointerMoveHandler =
            moveEvent => {

                this.handlePointerMove(
                    moveEvent
                );

            };


        this.pointerUpHandler =
            upEvent => {

                this.stopDrag(
                    upEvent
                );

            };


        svg.addEventListener(
            "pointermove",
            this.pointerMoveHandler
        );

        svg.addEventListener(
            "pointerup",
            this.pointerUpHandler
        );

        svg.addEventListener(
            "pointercancel",
            this.pointerUpHandler
        );

    }


    /*
    =====================================================
    DRAG BEWEGEN
    =====================================================
    */

    handlePointerMove(event) {

        if (!this.dragging) {
            return;
        }


        const svg =
            this.clock.svg;

        if (!svg) {
            return;
        }


        const rect =
            svg.getBoundingClientRect();


        const scaleX =
            this.clock.size /
            rect.width;


        const scaleY =
            this.clock.size /
            rect.height;


        const x =
            (
                event.clientX -
                rect.left
            ) * scaleX;


        const y =
            (
                event.clientY -
                rect.top
            ) * scaleY;


        const dx =
            x -
            this.clock.center;


        const dy =
            y -
            this.clock.center;


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
        12 Uhr = 0 Grad
        */

        angle += 90;


        if (angle < 0) {
            angle += 360;
        }


        if (angle >= 360) {
            angle -= 360;
        }


        /*
        -------------------------------------------------
        Minutenzeiger
        -------------------------------------------------
        */

        if (
            this.dragging ===
            "minute"
        ) {

            let minute =
                Math.round(
                    angle / 6
                );


            if (minute === 60) {
                minute = 0;
            }


            this.userMinute =
                minute;


            this.updateHands();

            return;

        }


        /*
        -------------------------------------------------
        Stundenzeiger
        -------------------------------------------------
        */

        if (
            this.dragging ===
            "hour"
        ) {

            /*
            Wir bestimmen die Stunde aus der
            tatsächlichen Position des Zeigers.

            Die Minute bleibt dabei erhalten.
            */

            const hourFloat =
                angle / 30;


            let hour =
                Math.floor(
                    hourFloat
                ) + 1;


            if (hour > 12) {
                hour = 12;
            }


            if (hour < 1) {
                hour = 1;
            }


            this.userHour =
                hour;


            this.updateHands();

        }

    }


    /*
    =====================================================
    DRAG ENDE
    =====================================================
    */

    stopDrag(event) {

        const svg =
            this.clock.svg;


        if (
            svg &&
            event &&
            event.pointerId !== undefined
        ) {

            try {

                svg.releasePointerCapture(
                    event.pointerId
                );

            }
            catch {

                // Ignorieren.

            }

        }


        this.removePointerListeners();

        this.dragging = null;

        this.updateHands();

    }


    /*
    =====================================================
    LISTENER ENTFERNEN
    =====================================================
    */

    removePointerListeners() {

        const svg =
            this.clock.svg;


        if (!svg) {
            return;
        }


        if (
            this.pointerMoveHandler
        ) {

            svg.removeEventListener(
                "pointermove",
                this.pointerMoveHandler
            );

        }


        if (
            this.pointerUpHandler
        ) {

            svg.removeEventListener(
                "pointerup",
                this.pointerUpHandler
            );

            svg.removeEventListener(
                "pointercancel",
                this.pointerUpHandler
            );

        }


        this.pointerMoveHandler = null;
        this.pointerUpHandler = null;

    }


    /*
    =====================================================
    PRÜFEN
    =====================================================
    */

    /*
=========================================================
AUFGABENTEXT ANZEIGEN
=========================================================
*/

showTaskText() {

    let task =
        document.getElementById(
            "settingTask"
        );


    /*
    Falls das Element in der HTML noch nicht existiert,
    wird es automatisch erzeugt.
    */

    if (!task) {

        task =
            document.createElement(
                "div"
            );

        task.id =
            "settingTask";


        const container =
            document.getElementById(
                "clockContainer"
            );


        if (container) {

            container.parentNode.insertBefore(
                task,
                container
            );

        }

    }


    task.textContent =
        "Stelle die Uhr auf: " +
        this.formatTime(
            this.targetHour,
            this.targetMinute
        );


    task.style.display =
        "block";

}


/*
=========================================================
ZEIT FORMATIEREN
=========================================================
*/

formatTime(
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

    check() {

        const correct =
            this.userHour ===
            this.targetHour
            &&
            this.userMinute ===
            this.targetMinute;


        return {

            correct,

            targetHour:
                this.targetHour,

            targetMinute:
                this.targetMinute,

            userHour:
                this.userHour,

            userMinute:
                this.userMinute

        };

    }


    /*
    =====================================================
    AKTUELLE ZEIT
    =====================================================
    */

    getSetTime() {

        return {

            hour:
                this.userHour,

            minute:
                this.userMinute

        };

    }


    /*
    =====================================================
    STOP
    =====================================================
    */

    stop() {

        this.removePointerListeners();

        this.dragging = null;


        this.hourHand = null;
        this.minuteHand = null;

        this.hourHitArea = null;
        this.minuteHitArea = null;

        this.centerDot = null;

    }

}

