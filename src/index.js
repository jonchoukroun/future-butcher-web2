function component() {
    const el = document.createElement("h1");

    el.innerText = "hey nong man";

    return el;
}

document.getElementById("root").appendChild(component());
