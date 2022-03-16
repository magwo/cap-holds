const QUARTER_CIRCLE = Math.PI / 2;
const HALF_CIRCLE = Math.PI;
const FULL_CIRCLE = Math.PI * 2;


function getOrbit(timePassed) {
    const phase = timePassed % FULL_CIRCLE;
    const x = Math.cos(phase);
    const y = Math.sin(phase);
    const rotation = phase + HALF_CIRCLE;
    return { x, y, rotation };
}

function getRacetrack(timePassed, legLength) {
    const phase = timePassed % FULL_CIRCLE;
    const turnLength = HALF_CIRCLE;
    const totalLength = turnLength * 2 + legLength * 2;

    const legDuration = FULL_CIRCLE * (legLength / totalLength);
    const turnDuration = FULL_CIRCLE * (turnLength / totalLength);

    if(phase < legDuration) {
        const fraction = phase / legDuration;
        return { x: 1, y: fraction * legLength, rotation: HALF_CIRCLE }
    } else if (phase < legDuration + turnDuration) {
        const fraction = (phase - legDuration) / turnDuration;
        const pos = getOrbit(Math.PI * fraction);
        pos.y += legLength;
        return pos;
    } else if (phase < legDuration + turnDuration + legDuration) {
        const fraction = (phase - legDuration - turnDuration) / legDuration;
        return { x: -1, y: legLength - fraction * legLength, rotation: 0 }
    } else {
        const fraction = (phase - legDuration - turnDuration - legDuration) / turnDuration;
        const pos = getOrbit(HALF_CIRCLE + Math.PI * fraction);
        // pos.y -= legLength;
        return pos;
    }
}

function getInvertedRacetrack(timePassed, legLength) {
    const phase = timePassed % FULL_CIRCLE;
    const invPhase = FULL_CIRCLE - phase;
    const pos = getRacetrack(invPhase, legLength);
    pos.rotation += HALF_CIRCLE;
    return pos;
}

function getInvertedOrbit(timePassed) {
    const phase = timePassed % FULL_CIRCLE;
    const invPhase = FULL_CIRCLE - phase;
    const pos = getOrbit(invPhase);
    pos.rotation += HALF_CIRCLE;
    return pos;
}

function getOffset(pos, dx, dy) {
    return { x: pos.x + dx, y: pos.y + dy, rotation: pos.rotation };
}

function twoShipOrbitGrinder(timePassed) {
    return [
        getOrbit(timePassed),
        getOrbit(timePassed + HALF_CIRCLE),
    ]
}

function twoShipOrbitGrinderCounter(timePassed) {
    return [
        getOrbit(timePassed),
        getInvertedOrbit(timePassed),
    ]
}

function twoShipRacetrackGrinder(timePassed) {
    return [
        getRacetrack(timePassed, 2),
        getRacetrack(timePassed + HALF_CIRCLE, 2),
    ]
}

function twoShipRacetrackGrinderCounter(timePassed) {
    return [
        getRacetrack(timePassed, 2),
        getInvertedRacetrack(timePassed - QUARTER_CIRCLE + QUARTER_CIRCLE / 4, 2),
    ]
}

function fourShipOrbitGrinder(timePassed) {
    return [
        getOrbit(timePassed),
        getOrbit(timePassed + QUARTER_CIRCLE),
        getOrbit(timePassed + HALF_CIRCLE),
        getOrbit(timePassed + QUARTER_CIRCLE + HALF_CIRCLE),
    ]
}

function fourShipRacetrackGrinderCross(timePassed) {
    return [
        getRacetrack(timePassed, 2),
        getInvertedRacetrack(timePassed + HALF_CIRCLE - QUARTER_CIRCLE + QUARTER_CIRCLE / 4, 2),
        getRacetrack(timePassed + HALF_CIRCLE, 2),
        getInvertedRacetrack(timePassed - QUARTER_CIRCLE + QUARTER_CIRCLE / 4, 2),
    ]
}

function fourShipRacetrackGrinderHook(timePassed) {
    return [
        getOffset(getRacetrack(timePassed, 2), 0, 0),
        getOffset(getRacetrack(timePassed, 2), 0.6, 0),
        getOffset(getRacetrack(timePassed + HALF_CIRCLE, 2), -0.6, 0),
        getOffset(getRacetrack(timePassed + HALF_CIRCLE, 2), 0, 0),
    ]
}
