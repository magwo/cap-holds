const aircraftElements = [];
let currentHold, speedFactor;

function setAircraftPosition(aircraftIndex, x, y, rot, elapsedTime) {
    const aircraft = aircraftElements[aircraftIndex];
    aircraft.style.transform = `translate(${x-16}px, ${y-16}px) rotate(${rot+Math.PI/4}rad)`;
    aircraft.getElementsByClassName('number')[0].style.transform = `translate(${0}px, ${0}px) rotate(${-(rot+Math.PI/4)}rad)`;

    const gimbal = 60;
    let phase = ((elapsedTime + aircraft.phaseOffset) * 200) % (gimbal * 4);
    if (phase > gimbal * 2) {
       phase = gimbal * 2 - (phase - gimbal * 2); 
    }
    const beamRotation = -gimbal + phase;
    // console.log("beam", beamRotation);
    aircraft.getElementsByClassName('beam-container')[0].setAttribute('transform', `translate(${300}, ${0}) rotate(${beamRotation})`);
}

function setAircraftImage(aircraftIndex, url) {
    const aircraft = aircraftElements[aircraftIndex];
    aircraft.style["background-image"] = url;
}

function setAllAircraftImage(url) {
    for(let i=0; i<aircraftElements.length; i++) {
        setAircraftImage(i, url);
    }
}

function setHold(hold, _speedFactor) {
    currentHold = hold;
    speedFactor = _speedFactor
    const start = hold(0);

    for(let i=0; i<aircraftElements.length; i++) {
        aircraft = aircraftElements[i];

        if (i<start.length) {
            aircraft.classList.remove("faded");
        } else {
            aircraft.classList.add("faded");
        }
    }
}

function updateHold(timePassed) {
    const positions = currentHold(timePassed);
    for(let i=0; i<aircraftElements.length; i++) {
        aircraft = aircraftElements[i];

        if (i<positions.length) {
            let pos = positions[i];
            setAircraftPosition(i, 560/2 + pos.x * 100, 182 + pos.y * 100, pos.rotation, timePassed);
        }
    }
}

function initHolds(viewport, aircraftTemplate) {
    for(let i=0; i<8; i++) {
        let aircraftElement = aircraftTemplate.content.cloneNode(true);
        aircraftElement = viewport.appendChild(aircraftElement.querySelector("div"));
        aircraftElement.querySelector(".number").innerHTML = 1 + i;
        aircraftElement.phaseOffset = 100000 * Math.random();
        aircraftElements.push(aircraftElement);
    }
}



let start;
function startAnimationLoop() {
    function step(timestamp) {
        if (start === undefined) {
            start = timestamp;
        }
        const elapsed = timestamp - start;
        updateHold(speedFactor * elapsed / 3000);
        requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}