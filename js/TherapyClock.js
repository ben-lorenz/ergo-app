
class TherapyClock {


// =========================================================
// KONSTRUKTOR
// =========================================================

constructor(container) {

    this.container = container;

    this.size = 520;
    this.center = this.size / 2;
    this.radius = 210;

    // Einheitliche SVG-Geometrie
    this.centerX = this.center;
    this.centerY = this.center;
    this.viewBoxWidth = this.size;
    this.viewBoxHeight = this.size;

    this.svg = null;
    this.handLayer = null;
    this.inputLayer = null;

    this.inputs = [];

    // Einstellmodus
    this.setTimeMode = false;
    this.userHour = 12;
    this.userMinute = 0;

    this.targetHour = null;
    this.targetMinute = null;

    this.settingClickHandler = null;
}


// =========================================================
// SVG HELFER
// =========================================================

createSvgElement(tag) {

    return document.createElementNS(
        "http://www.w3.org/2000/svg",
        tag
    );

}


// =========================================================
// GRUNDAUFBAU DER UHR
// =========================================================

createBaseClock(showNumbers = false) {

    // Alten Inhalt vollständig entfernen
    this.container.innerHTML = "";

    this.inputs = [];

    this.svg = this.createSvgElement("svg");

    this.svg.setAttribute(
        "width",
        this.size
    );

    this.svg.setAttribute(
        "height",
        this.size
    );

    this.svg.setAttribute(
        "viewBox",
        `0 0 ${this.size} ${this.size}`
    );

    this.svg.classList.add(
        "therapyClock"
    );

    this.container.appendChild(
        this.svg
    );


    // -----------------------------------------------------
    // Zifferblatt
    // -----------------------------------------------------

    this.drawClockCircle();

    this.drawTicks();

    if (showNumbers) {
        this.drawNumbers();
    }


    // -----------------------------------------------------
    // Zeiger-Layer
    // -----------------------------------------------------

    this.handLayer = this.createSvgElement("g");

    this.handLayer.classList.add(
        "handLayer"
    );

    this.svg.appendChild(
        this.handLayer
    );


    // -----------------------------------------------------
    // Mittelpunkt
    // -----------------------------------------------------

    this.drawCenter();


    // -----------------------------------------------------
    // Overlay für HTML-Eingabefelder
    // -----------------------------------------------------

    this.createInputLayer();

}


// =========================================================
// INPUT LAYER
// =========================================================

createInputLayer() {

    this.inputLayer =
        document.createElement("div");

    this.inputLayer.className =
        "clockInputLayer";

    this.inputLayer.style.position =
        "absolute";

    this.inputLayer.style.left =
        "0";

    this.inputLayer.style.top =
        "0";

    this.inputLayer.style.width =
        `${this.size}px`;

    this.inputLayer.style.height =
        `${this.size}px`;

    this.inputLayer.style.pointerEvents =
        "none";

    /*
     * Wichtig:
     * Der Container muss als Bezugspunkt
     * für die absolute Positionierung dienen.
     */
    if (
        getComputedStyle(this.container).position ===
        "static"
    ) {

        this.container.style.position =
            "relative";

    }

    this.container.appendChild(
        this.inputLayer
    );

}


// =========================================================
// AUSSENKREIS
// =========================================================

drawClockCircle() {

    const circle =
        this.createSvgElement("circle");

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


// =========================================================
// MINUTEN- UND STUNDENMARKIERUNGEN
// =========================================================

drawTicks() {

    for (
        let i = 0;
        i < 60;
        i++
    ) {

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
                ? this.radius - 35
                : this.radius - 22;


        const line =
            this.createSvgElement("line");


        line.setAttribute(
            "x1",
            this.center +
            Math.cos(angle) * inner
        );

        line.setAttribute(
            "y1",
            this.center +
            Math.sin(angle) * inner
        );

        line.setAttribute(
            "x2",
            this.center +
            Math.cos(angle) * outer
        );

        line.setAttribute(
            "y2",
            this.center +
            Math.sin(angle) * outer
        );


        line.classList.add(
            i % 5 === 0
                ? "hourTick"
                : "minuteTick"
        );


        this.svg.appendChild(
            line
        );

    }

}


// =========================================================
// ZAHLEN 1-12
// =========================================================

drawNumbers() {

    for (
        let hour = 1;
        hour <= 12;
        hour++
    ) {

        const angle =
            (
                hour * 30 - 90
            )
            *
            Math.PI
            /
            180;


        const numberRadius =
            this.radius - 60;


        const x =
            this.center +
            Math.cos(angle) *
            numberRadius;


        const y =
            this.center +
            Math.sin(angle) *
            numberRadius;


        const text =
            this.createSvgElement("text");


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


// =========================================================
// MITTELPUNKT
// =========================================================

drawCenter() {

    const center =
        this.createSvgElement("circle");

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


// =========================================================
// BESCHRIFTUNGSMODUS
// =========================================================

renderLabelMode(settings = []) {

    /*
     * Ganz wichtig:
     * Die Uhr wird zuerst vollständig aufgebaut.
     */
    this.createBaseClock(false);


    /*
     * Alte Einstellzeiger deaktivieren.
     */
    this.setTimeMode = false;


    for (
        let hour = 1;
        hour <= 12;
        hour++
    ) {

        const angle =
            (
                hour * 30 - 90
            )
            *
            Math.PI
            /
            180;


        const inputRadius =
            this.radius - 45;


        const x =
            this.center +
            Math.cos(angle) *
            inputRadius;


        const y =
            this.center +
            Math.sin(angle) *
            inputRadius;


        const input =
            document.createElement("input");


        input.className =
            "clockInput";


        input.type =
            "text";


        input.inputMode =
            "numeric";


        input.dataset.hour =
            hour;


        input.dataset.length =
            hour >= 10 ? 2 : 1;


        input.maxLength =
            hour >= 10 ? 2 : 1;


        /*
         * Input-Größe:
         * Wir gehen davon aus, dass die CSS-Datei
         * ungefähr 50x50px vorsieht.
         */
        const inputSize = 50;


        input.style.position =
            "absolute";

        input.style.left =
            `${x - inputSize / 2}px`;

        input.style.top =
            `${y - inputSize / 2}px`;

        input.style.width =
            `${inputSize}px`;

        input.style.height =
            `${inputSize}px`;

        input.style.pointerEvents =
            "auto";


        // -------------------------------------------------
        // Vorgegebene Beschriftung
        // -------------------------------------------------

        if (
            settings.includes(hour)
        ) {

            input.value =
                hour;

            input.disabled =
                true;

            input.dataset.given =
                "true";

        }
        else {

            input.dataset.given =
                "false";

        }


        this.inputs.push(
            input
        );


        this.inputLayer.appendChild(
            input
        );

    }

}


// =========================================================
// ABLESEMODUS
// =========================================================

renderReadingMode() {

    this.setTimeMode = false;

    this.createBaseClock(true);

}


// =========================================================
// UHRZEIT ANZEIGEN
// =========================================================

showTime(hour, minute) {

    if (!this.handLayer) {
        return;
    }


    this.handLayer.innerHTML = "";


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


    this.drawHandCenter();

}


// =========================================================
// EINZELNEN ZEIGER ZEICHNEN
// =========================================================

drawHand(
    angle,
    length,
    className
) {

    const line =
        this.createSvgElement("line");


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
        Math.cos(angle) * length
    );

    line.setAttribute(
        "y2",
        this.center +
        Math.sin(angle) * length
    );


    line.classList.add(
        className
    );


    this.handLayer.appendChild(
        line
    );

}


// =========================================================
// MITTELPUNKT FÜR ZEIGER
// =========================================================

drawHandCenter() {

    const dot =
        this.createSvgElement("circle");


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


// =========================================================
// BESCHRIFTUNG PRÜFEN
// =========================================================

check() {

    let correct = 0;
    let total = 0;


    this.inputs.forEach(
        input => {

            /*
             * WICHTIG:
             *
             * "disabled" darf hier NICHT verwendet werden.
             *
             * Ein freies Feld kann durch die Eingabelogik
             * momentan disabled sein, ohne vorgegeben zu sein.
             *
             * Nur dataset.given === "true" bedeutet:
             * Dieses Feld war von Anfang an vorgegeben.
             */
            if (
                input.dataset.given ===
                "true"
            ) {

                return;

            }


            /*
             * Jedes nicht vorgegebene Feld wird gewertet.
             *
             * Dabei spielt es keine Rolle, ob es momentan
             * aktiv oder disabled ist.
             */
            total++;


            const expected =
                Number(
                    input.dataset.hour
                );


            const value =
                Number(
                    input.value
                );


            if (
                value === expected
            ) {

                correct++;


                input.classList.add(
                    "correct"
                );

                input.classList.remove(
                    "wrong"
                );

            }
            else {

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


// =========================================================
// ZIELZEIT FÜR EINSTELLMODUS
// =========================================================

setTargetTime(hour, minute) {

    this.targetHour =
        hour;

    this.targetMinute =
        minute;

    this.setTimeMode =
        true;

}


// =========================================================
// EINSTELLUHR ZEICHNEN
// =========================================================

renderSettingMode() {

    this.setTimeMode =
        true;

    this.userHour =
        12;

    this.userMinute =
        0;


    /*
     * Wir verwenden dieselbe Uhrbasis
     * wie in den anderen Modi.
     */
    this.createBaseClock(true);


    this.drawSettingHands();

    this.setupSettingInteraction();

}


// =========================================================
// ZEIGER FÜR EINSTELLMODUS
// =========================================================

drawSettingHands() {

    if (!this.svg) {
        return;
    }


    /*
     * Alte Einstellzeiger entfernen.
     */
    this.svg
        .querySelectorAll(".setting-hand")
        .forEach(
            hand => hand.remove()
        );


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
        this.createSvgElement("line");


    minuteHand.setAttribute(
        "x1",
        this.centerX
    );

    minuteHand.setAttribute(
        "y1",
        this.centerY
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


    this.svg.appendChild(
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
        this.createSvgElement("line");


    hourHand.setAttribute(
        "x1",
        this.centerX
    );

    hourHand.setAttribute(
        "y1",
        this.centerY
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


    this.svg.appendChild(
        hourHand
    );


    /*
     * Mittelpunkt über den Zeigern.
     */
    const center =
        this.createSvgElement("circle");


    center.setAttribute(
        "cx",
        this.centerX
    );

    center.setAttribute(
        "cy",
        this.centerY
    );

    center.setAttribute(
        "r",
        8
    );


    center.classList.add(
        "clockCenter",
        "setting-center"
    );


    this.svg.appendChild(
        center
    );

}


// =========================================================
// PUNKT AUF UHR BERECHNEN
// =========================================================

getPointOnClock(
    angle,
    length
) {

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
            this.centerX +
            Math.cos(radians) *
            length,

        y:
            this.centerY +
            Math.sin(radians) *
            length

    };

}


// =========================================================
// EINGABE FÜR EINSTELLUHR
// =========================================================

setupSettingInteraction() {

    if (!this.svg) {
        return;
    }


    /*
     * Listener der alten SVG-Instanz entfernen,
     * falls vorhanden.
     */
    if (
        this.settingClickHandler
    ) {

        this.svg.removeEventListener(
            "click",
            this.settingClickHandler
        );

    }


    this.settingClickHandler =
        event => {

            this.handleClockClick(
                event
            );

        };


    this.svg.addEventListener(
        "click",
        this.settingClickHandler
    );

}


// =========================================================
// KLICK AUF UHR VERARBEITEN
// =========================================================

handleClockClick(event) {

    if (!this.svg) {
        return;
    }


    const rect =
        this.svg.getBoundingClientRect();


    /*
     * Tatsächliche SVG-Größe berücksichtigen.
     */
    const scaleX =
        this.viewBoxWidth /
        rect.width;


    const scaleY =
        this.viewBoxHeight /
        rect.height;


    const x =
        (
            event.clientX -
            rect.left
        )
        *
        scaleX;


    const y =
        (
            event.clientY -
            rect.top
        )
        *
        scaleY;


    const dx =
        x - this.centerX;


    const dy =
        y - this.centerY;


    /*
     * Winkel ab 3-Uhr-Position.
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
     * 12 Uhr = 0 Grad.
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
     * Auf nächste Minute runden.
     */
    let minute =
        Math.round(
            angle / 6
        );


    if (minute === 60) {
        minute = 0;
    }


    /*
     * Stunde zunächst beibehalten.
     */
    let hour =
        this.userHour;


    /*
     * Übergang über 12 Uhr erkennen.
     */
    if (
        this.userMinute > 45 &&
        minute < 15
    ) {

        hour++;

    }


    if (
        this.userMinute < 15 &&
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


// =========================================================
// AKTUELLE EINSTELLUNG AUSLESEN
// =========================================================

getSetTime() {

    return {

        hour:
            this.userHour,

        minute:
            this.userMinute

    };

}

}

