// https://youtu.be/8dWL3wF_OMw?t=2685 <== I'm here

const HEAD = document.getElementById("convinceLabelHead");
const TAIL = document.getElementById("convinceLabelTail");
const QUERY_STRING = window.location.search;
const URL_PARAMS = new URLSearchParams(QUERY_STRING);
const USER_INPUT = URL_PARAMS.get('inpOpinion');

const MAX_TAIL_CHARS = 5;
const FONT_SIZES = {
    "-3": "0.25em",
    "-2": "0.5em",
    "-1": "0.75em",
    "0": "1em",
    "1": "1.25em",
    "2": "1.5em",
    "3": "1.75em",
    "4": "2em"
}

let isBold = false;
let isUnderlined = false;
let curCaseCode = 0;
let maxCaseCode = 0;
let curFontSize = 0;

const CASE_OPTIONS = [];
const FUNCTIONS_FOR_MORE = {
    on: new Set([changeFont, addToTail, makeBold, makeUnderline]),
    off: new Set([changeCase, removeFromTail])
}
const FUNCTIONS_FOR_LESS = {
    on: new Set([changeFont, addToTail]),
    off: new Set([changeCase, removeFromTail, makeBold, makeUnderline])
}

// OK
function changeFuncState(f, toConvinceMore, toOn) {
    const DICT_NAME = toConvinceMore ? FUNCTIONS_FOR_MORE : FUNCTIONS_FOR_LESS;
    DICT_NAME[toOn ? 'off' : 'on'].delete(f);
    DICT_NAME[toOn ? 'on' : 'off'].add(f);
}
// OK
function pickRandFunc(toConvinceMore) {
    const SET_NAME = (toConvinceMore ? FUNCTIONS_FOR_MORE : FUNCTIONS_FOR_LESS).on;
    const RAND_INDEX = Math.floor(Math.random() * SET_NAME.size);
    return Array.from(SET_NAME)[RAND_INDEX];
}
// To TEST
function changeFont(toConvinceMore) {
    let newSize;
    if (toConvinceMore) {
        if (curFontSize < 4) {
            curFontSize += 1;
            newSize = FONT_SIZES[String(curFontSize)];
            HEAD.style.fontSize = newSize;
            TAIL.style.fontSize = newSize;
            if (curFontSize >= 4) changeFuncState(changeFont, true, false); // reached max. off for more
            if (FUNCTIONS_FOR_LESS.off.has(changeFont)) changeFuncState(changeFont, false, true); // on for less, if its not already
            return true;
        } else {
            throw new Error(`\t!!Strange!! changeFont,T,F`);
        }
    } else {
        if (curFontSize > -3) {
            curFontSize -= 1;
            newSize = FONT_SIZES[String(curFontSize)];
            HEAD.style.fontSize = newSize;
            TAIL.style.fontSize = newSize;
            if (curFontSize <= -3) changeFuncState(changeFont, false, false); // reached min. off for less
            if (FUNCTIONS_FOR_MORE.off.has(changeFont)) changeFuncState(changeFont, true, true); // on for more, if its not already
            return true;
        } else {
            throw new Error(`\t!!Strange!! changeFont,F,F`);
        }
    }
}

function changeCase(toConvinceMore) {
    if (toConvinceMore) {
        if (curCaseCode < maxCaseCode) {
            curCaseCode += 1;
            HEAD.innerHTML = CASE_OPTIONS[curCaseCode];
            if (curCaseCode >= maxCaseCode) changeFuncState(changeCase, true, false); // reached max. "off" for "more".
            if (FUNCTIONS_FOR_LESS.off.has(changeCase)) changeFuncState(changeCase, false, true); // "on" for "less", (if it's not already).
            return true;
        } else {
            return false;
        }
    } else {
        if (curCaseCode > 0) {
            curCaseCode -= 1;
            HEAD.innerHTML = CASE_OPTIONS[curCaseCode];
            if (curCaseCode <= 0) changeFuncState(changeCase, false, false); // reached min. "off" for "less".
            if (FUNCTIONS_FOR_MORE.off.has(changeCase)) changeFuncState(changeCase, true, true); // "on" for "more", (if it's not already).
            return true;
        } else {
            return false;
        }
    }
}

function makeBold(toConvinceMore) {
    if (toConvinceMore && !isBold) {
        HEAD.style.fontWeight = "bold";
        TAIL.style.fontWeight = "bold";
        isBold = true;
        changeFuncState(makeBold, true, false);
        changeFuncState(makeBold, false, true);
        return true;
    } else if (!toConvinceMore && isBold) {
        HEAD.style.fontWeight = "normal";
        TAIL.style.fontWeight = "normal";
        isBold = false;
        changeFuncState(makeBold, false, false);
        changeFuncState(makeBold, true, true);
        return true;
    } else {
        return false;
    }
}

function makeUnderline(toConvinceMore) {
    if (toConvinceMore && !isUnderlined) {
        HEAD.style.textDecoration = "underline";
        TAIL.style.textDecoration = "underline";
        isUnderlined = true;
        changeFuncState(makeUnderline, true, false);
        changeFuncState(makeUnderline, false, true);
        return true;
    } else if (!toConvinceMore && isUnderlined) {
        HEAD.style.textDecoration = "none";
        TAIL.style.textDecoration = "none";
        isUnderlined = false;
        changeFuncState(makeUnderline, false, false);
        changeFuncState(makeUnderline, true, true);
        return true;
    } else {
        return false;
    }
}

function getRandIndexOf(str, char) {
    console.log(`\tgetRandIndexOf(${str}, ${char})`);
    let indexToPick;
    console.log(`\t${str} ${str.includes(char) ? "does" : "doesn't"} include ${char})`);
    if (str.includes(char)) {
        const INDEXES = [];
        for (let i = 0; i < str.length; i++) {
            console.log(`\t\t=>${i}`);
            if (str[i] === char) {
                INDEXES.push(i);
            }
        }
        indexToPick = Math.floor(Math.random() * INDEXES.length);
        console.log(INDEXES);
        console.log(indexToPick);
        console.log(INDEXES[indexToPick]);
        return INDEXES[indexToPick];
    } else {
        return undefined;
    }
}

function addToTail(toConvinceMore) {
    console.log("Called:\taddToTail");
    const RAND_INDEX = Math.floor(Math.random() * (TAIL.innerHTML.length + 1));
    if (toConvinceMore) {
        TAIL.innerHTML = TAIL.innerHTML.slice(0, RAND_INDEX) + "!" + TAIL.innerHTML.slice(RAND_INDEX);
    } else {
        TAIL.innerHTML = TAIL.innerHTML.slice(0, RAND_INDEX) + "?" + TAIL.innerHTML.slice(RAND_INDEX);
    }
    if (TAIL.innerHTML.length >= MAX_TAIL_CHARS) {
        changeFuncState(addToTail, true, false);
        changeFuncState(addToTail, false, false);
    }
    changeFuncState(removeFromTail, !(toConvinceMore), true);
}

function removeFromTail(toConvinceMore) {
    console.log("Called:\tremoveFromTail");
    const RAND_INDEX = getRandIndexOf(TAIL.innerHTML, toConvinceMore ? "?" : "!");
    let thereIsMore;
    if (RAND_INDEX !== undefined) {
        TAIL.innerHTML = TAIL.innerHTML.slice(0, RAND_INDEX) + TAIL.innerHTML.slice(RAND_INDEX + 1);
        if (TAIL.innerHTML.length <= 0) {
            changeFuncState(removeFromTail, true, false);
            changeFuncState(removeFromTail, false, false);
        }
        changeFuncState(addToTail, true, true);
        changeFuncState(addToTail, false, true);
        thereIsMore = getRandIndexOf(TAIL.innerHTML, toConvinceMore ? "?" : "!");
        thereIsMore ?? changeFuncState(removeFromTail, toConvinceMore, false);
        return true;
    } else {
        throw new Error(`No ${toConvinceMore ? "?" : "!"} to remove!... (${toConvinceMore})`);
    }
}

HEAD.innerHTML = USER_INPUT;
TAIL.innerHTML = "";

const ORIG = USER_INPUT;
const UPP = ORIG.toUpperCase();
const LOW = ORIG.toLowerCase();
CASE_OPTIONS.push(ORIG);
curCaseCode = 0;
if (LOW !== ORIG) {
    CASE_OPTIONS.unshift(LOW);
    curCaseCode += 1;
    changeFuncState(changeCase, false, true); // You CAN make it "less" (lowercase).
}
if (ORIG !== UPP) {
    CASE_OPTIONS.push(UPP)
    curCaseCode += 2;
    changeFuncState(changeCase, true, true); // You CAN make it "more" (uppercase).
}

maxCaseCode = CASE_OPTIONS.length - 1;
curCaseCode = curCaseCode % 2;
HEAD.innerHTML = ORIG;
TAIL.innerHTML = "";

curFontSize = 0;
HEAD.style.fontSize = FONT_SIZES["0"];
TAIL.style.fontSize = FONT_SIZES["0"];

document.getElementById("btnNewOp").onclick = function () {
    HEAD.innerHTML = "";
    TAIL.innerHTML = "";
    window.location.replace("index.html")
}
document.getElementById("btnConvMore").onclick = function () {
    pickRandFunc(true)(true);
}
document.getElementById("btnConvLess").onclick = function () {
    pickRandFunc(false)(false);
}