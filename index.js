const OPINION = document.getElementById("inpOpinion");
const EXPRESS = document.getElementById("btnExpress");

OPINION.value = "";

EXPRESS.onclick = function () {
    if (!OPINION.value) {
        document.getElementById("inpOpinion").style.border = "1px solid red";
        return false;
    }
}