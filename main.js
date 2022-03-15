const aircraftElements = [];
let currentHold;

function setAircraftPosition(aircraftIndex, x, y, rot) {
    const aircraft = aircraftElements[aircraftIndex];
    aircraft.style.transform = `translate(${x-24}px, ${y-24}px) rotate(${rot+Math.PI/4}rad)`;
    aircraft.getElementsByClassName('number')[0].style.transform = `translate(${0}px, ${0}px) rotate(${-(rot+Math.PI/4)}rad)`;
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

function setHold(hold) {
    currentHold = hold;
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
            // console.log(pos);
            setAircraftPosition(i, 560/2 - 12 + pos.x * 120, 182 + pos.y * 120, pos.rotation);
        }
    }
}

function initHolds(viewport, aircraftTemplate) {
    for(let i=0; i<8; i++) {
        let aircraftElement = aircraftTemplate.content.cloneNode(true);
        aircraftElement = viewport.appendChild(aircraftElement.querySelector("div"));
        aircraftElement.querySelector(".number").innerHTML = 1 + i;
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
        updateHold(elapsed / 2000);
        requestAnimationFrame(step);    
    }
    requestAnimationFrame(step);
}