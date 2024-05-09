const locationSearch = document.getElementById("locationSearch");
const locationSearchContainer = document.getElementById("locationSearchContainer");
const locationIcon = document.getElementById("locationIcon");
const selectUnit = document.getElementById("selectUnit");
const unitList = document.getElementById("unitList");
const defaultBtn = document.getElementById("defaultBtn");
const defaultLocation = document.getElementById("defaultLocation");

locationSearch.addEventListener("focusin", event => {
    locationSearchContainer.classList.add("outline");
    locationIcon.classList.replace("text-dark-txt", "text-accent/50");
})

locationSearch.addEventListener("focusout", event => {
    locationSearchContainer.classList.remove("outline");
    locationIcon.classList.replace("text-accent/50", "text-dark-txt");
})

const buttons = document.querySelectorAll(".focus");

buttons.forEach(button => {
    button.addEventListener("click", event => {
        event.target.classList.add("outline");
    })

    document.addEventListener("click", event => {
        if(event.target !== button && !button.contains(event.target)){
            button.classList.remove("outline");
        }
    })
})

selectUnit.addEventListener("click", event => {
    unitList.classList.remove("hidden");
})

document.addEventListener("click", event => {
    if(event.target !== selectUnit && event.target !== unitList){
        unitList.classList.add("hidden");
    }
})

function getUnit(unit){
    selectUnit.innerHTML = `${unit}&nbsp;&#11167;`;
}

locationSearch.addEventListener("keyup", event => {
    locationSearch.value.length >= 5 ? defaultBtn.classList.remove("hidden") : defaultBtn.classList.add("hidden");
})

defaultBtn.onclick = () => {
    if(defaultLocation.textContent !== locationSearch.value){
        defaultLocation.textContent = locationSearch.value;
    }
}