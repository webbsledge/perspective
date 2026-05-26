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

import perspective from "@perspective-dev/client";
import perspective_viewer from "@perspective-dev/viewer";

import server_wasm from "@perspective-dev/server/dist/wasm/perspective-server.wasm";
import client_wasm from "@perspective-dev/viewer/dist/wasm/perspective-viewer.wasm";

import "@perspective-dev/viewer-datagrid";
import "@perspective-dev/viewer-charts";

const ready = Promise.all([
    perspective_viewer.init_client(client_wasm),
    perspective.init_server(server_wasm),
]);

export { ready };

export async function worker() {
    await ready;
    return await perspective.worker();
}

const PERSISTENT_ATTRIBUTES = [
    "plugin",
    "columns",
    "group_by",
    "split_by",
    "aggregates",
    "sort",
    "filter",
    "expressions",
    "plugin_config",
    "settings",
    "theme",
    "title",
    "version",
];

function isEqual(a, b) {
    if (a === b) return true;
    if (typeof a != "object" || typeof b != "object" || a == null || b == null)
        return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length != keysB.length) return false;
    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (typeof a[key] === "function" || typeof b[key] === "function") {
            if (a[key].toString() != b[key].toString()) return false;
        } else {
            if (!isEqual(a[key], b[key])) return false;
        }
    }
    return true;
}

async function get_psp_wasm_module() {
    let elem = customElements.get("perspective-viewer");
    if (!elem) {
        await customElements.whenDefined("perspective-viewer");
        elem = customElements.get("perspective-viewer");
    }
    return elem.__wasm_module__;
}

async function render({ model, el }) {
    await ready;

    el.classList.add("PSPContainer");
    const viewer = document.createElement("perspective-viewer");
    viewer.classList.add("PSPViewer");
    viewer.setAttribute("type", "application/psp+json");
    viewer.addEventListener(
        "contextmenu",
        (event) => event.stopPropagation(),
        false,
    );
    el.appendChild(viewer);

    const client_id = `${Math.random()}`;
    const wasm_module = await get_psp_wasm_module();
    const psp_client = new wasm_module.Client(
        async (binary_msg) => {
            const buffer = binary_msg.slice().buffer;
            model.send({ type: "binary_msg", client_id }, null, [buffer]);
        },
        () => {
            model.send({ type: "hangup", client_id }, null);
        },
    );

    const on_custom_msg = (msg, buffers) => {
        if (msg.type === "binary_msg" && msg.client_id === client_id) {
            const [dataview] = buffers;
            psp_client.handle_response(dataview.buffer);
        }
    };
    model.on("msg:custom", on_custom_msg);
    model.send({ type: "connect", client_id }, null);

    const binding_mode = model.get("binding_mode");
    const table_name = model.get("table_name");
    if (!table_name) {
        throw new Error("table_name not set in model");
    }

    let load_complete = false;
    const table_promise = psp_client.open_table(table_name).then(async (t) => {
        if (binding_mode === "client-server") {
            const local_client = await perspective.worker();
            const remote_view = await t.view();
            return await local_client.table(remote_view);
        } else if (binding_mode === "server") {
            return t;
        } else {
            throw new Error(`unknown binding mode: ${binding_mode}`);
        }
    });

    await viewer.load(table_promise);
    await viewer.restore(
        Object.fromEntries(PERSISTENT_ATTRIBUTES.map((k) => [k, model.get(k)])),
    );
    load_complete = true;

    const sync_to_python = async () => {
        if (!load_complete) {
            return;
        }
        const config = await viewer.save();
        for (const name of Object.keys(config)) {
            let new_value = config[name];
            const current_value = model.get(name);
            if (typeof new_value === "undefined") {
                continue;
            }
            if (
                new_value &&
                typeof new_value === "string" &&
                name !== "plugin" &&
                name !== "theme" &&
                name !== "title" &&
                name !== "version"
            ) {
                new_value = JSON.parse(new_value);
            }
            if (new_value === null && name === "plugin_config") {
                new_value = {};
            }
            if (!isEqual(new_value, current_value)) {
                model.set(name, new_value);
            }
        }
        model.save_changes();
    };
    viewer.addEventListener("perspective-config-update", sync_to_python);

    const trait_listeners = PERSISTENT_ATTRIBUTES.map((name) => {
        const cb = () => {
            viewer.restore({ [name]: model.get(name) });
        };
        model.on(`change:${name}`, cb);
        return [name, cb];
    });

    return () => {
        for (const [name, cb] of trait_listeners) {
            model.off(`change:${name}`, cb);
        }
        model.off("msg:custom", on_custom_msg);
        viewer.removeEventListener("perspective-config-update", sync_to_python);
        psp_client.terminate();
        viewer.delete();
        if (viewer.parentNode === el) {
            el.removeChild(viewer);
        }
    };
}

export default { render };
