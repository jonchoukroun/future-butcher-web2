import "./style.scss";

function component() {
    const el = document.createElement("h1");

    el.innerText = "hey nong man";
    el.classList.add("blue-text");

    return el;
}

document.getElementById("root").appendChild(component());
