// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
// ┃ ██████ ██████ ██████       █      █      █      █      █ █▄  ▀███ █       ┃
// ┃ ▄▄▄▄▄█ █▄▄▄▄▄ ▄▄▄▄▄█  ▀▀▀▀▀█▀▀▀▀▀ █ ▀▀▀▀▀█ ████████▌▐███ ███▄  ▀█ █ ▀▀▀▀▀ ┃
// ┃ █▀▀▀▀▀ █▀▀▀▀▀ █▀██▀▀ ▄▄▄▄▄ █ ▄▄▄▄▄█ ▄▄▄▄▄█ ████████▌▐███ █████▄   █ ▄▄▄▄▄ ┃
// ┃ █      ██████ █  ▀█▄       █ ██████      █      ███▌▐███ ███████▄ █       ┃
// ┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫
// ┃ Copyright (c) 2017, the Perspective Authors.                              ┃
// ┃ ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ ┃
// ┃ This file is part of the Perspective library, distributed under the terms ┃
// ┃ of the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0). ┃
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer@3.5.0/dist/cdn/perspective-viewer.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-datagrid@3.5.0/dist/cdn/perspective-viewer-datagrid.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-d3fc@3.5.0/dist/cdn/perspective-viewer-d3fc.js";
import "https://cdn.jsdelivr.net/npm/@finos/perspective-viewer-openlayers/dist/cdn/perspective-viewer-openlayers.js";

import perspective from "https://cdn.jsdelivr.net/npm/@finos/perspective@3.5.0/dist/cdn/perspective.js";

const worker = await perspective.worker();

// Get `dropArea` element from the DOM.
var dropArea = document.getElementById("drop-area");

// Get `input` element from the DOM.
var input = document.getElementById("fileElem");

// Add event listeners to `dropArea`.
dropArea.addEventListener("dragenter", () => {}, false);
dropArea.addEventListener("dragleave", () => {}, false);
dropArea.addEventListener("dragover", () => {}, false);
dropArea.addEventListener("drop", (x) => console.log(x), false);

// Prevent defaults for drag / drop events.
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight `dropArea` on drag enter and over.
["dragenter", "dragover"].forEach(function (eventName) {
    dropArea.addEventListener(eventName, highlight, false);
});

// Remove highlight `dropArea` on drag leave and drop.
["dragleave", "drop"].forEach(function (eventName) {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Add class for highlighting drop area.
function highlight() {
    dropArea.classList.add("highlight");
}

// Remove class for highlighting drop area.
function unhighlight() {
    dropArea.classList.remove("highlight");
}

// Add event listener for drop.
dropArea.addEventListener("drop", handleDrop, false);

// Add event listener for file change on `input`.
input.addEventListener("change", function () {
    handleFiles(this.files);
});

// Handle files attached to the drop.
function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;

    handleFiles(files);
}

// Iterate over files and call upload on each.
function handleFiles(files) {
    [...files].forEach(uploadFile);
}

// On file load, remove the `dropArea` and replace it with a `<perspective-viewer>`.
function uploadFile(file) {
    let reader = new FileReader();
    reader.onload = function (fileLoadedEvent) {
        let data = fileLoadedEvent.target.result;

        // Remove the `dropArea` from the DOM.
        const parent = dropArea.parentElement;
        parent.removeChild(dropArea);

        // Create a `<perspective-viewer>` and append it to the DOM.
        const psp = document.createElement("perspective-viewer");
        parent.appendChild(psp);

        // Load the file data into `<perspective-viewer>`.
        if (file.name.endsWith(".feather") || file.name.endsWith(".arrow")) {
            psp.load(worker.table(data));
        } else {
            psp.load(worker.table(data, { format: "csv" }));
        }
    };

    // Read the contents of the file - triggering the onload when finished.
    reader.readAsArrayBuffer(file);
}
