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

import sh from "./sh.mjs";
import inquirer from "inquirer";
import fs from "fs";
import * as dotenv from "dotenv";

const original = dotenv.config({
    path: "./.perspectiverc",
}).parsed;

const CONFIG = new Proxy(
    new (class {
        constructor() {
            this.config = [];
            this._values = { ...original } || {};
            if (this._values.PACKAGE && this._values.PACKAGE.startsWith("@")) {
                this._values.PACKAGE = this._values.PACKAGE.slice(
                    2,
                    this._values.PACKAGE.length - 1
                ).replace(/\|/g, ",");
            }
        }
        remove(keyname) {
            const idx = this.config.find((x) => s.startsWith(keyname));
            if (idx >= 0) {
                this.config.splice(idx);
            }
        }
        add(new_config) {
            for (const key in new_config) {
                const val = new_config[key];
                if (val !== "" && !!val) {
                    this._values[key] = val;
                    this.config.push(`${key}=${val}`);
                }
            }
        }
        write() {
            fs.writeFileSync("./.perspectiverc", this.config.join("\n"));
            if (process.env.PSP_BUILD_IMMEDIATELY || process.env.PSP_ONCE) {
                sh`node tools/perspective-scripts/build.mjs`.runSync();
                if (process.env.PSP_ONCE) {
                    // this.config = [];
                    while (this.config.length > 0) {
                        this.config.pop();
                    }

                    for (const key in this._values) {
                        if (key in original) {
                            this._values[key] = original[key];
                        } else {
                            delete this._values[key];
                        }
                    }

                    if (
                        this._values.PACKAGE &&
                        this._values.PACKAGE.startsWith("@")
                    ) {
                        this._values.PACKAGE = this._values.PACKAGE.slice(
                            2,
                            this._values.PACKAGE.length - 1
                        ).replace(/\|/g, ",");
                    }

                    fs.writeFileSync(
                        "./.perspectiverc",
                        this.config.join("\n")
                    );
                }
            }
        }
    })(),
    {
        set: function (target, name, val) {
            target.add({
                [name]: val,
            });
        },
        get: function (target, name) {
            if (name in target._values) {
                return target._values[name];
            } else {
                return target[name];
            }
        },
    }
);

const PROMPT_DEBUG = {
    type: "confirm",
    name: "PSP_DEBUG",
    message: "Run debug build?",
    default: CONFIG["PSP_DEBUG"] || false,
};

const PROMPT_DOCKER = {
    type: "confirm",
    name: "PSP_DOCKER",
    message: "Use docker for build env?",
    default: CONFIG["PSP_DOCKER"] || false,
};

async function choose_docker() {
    const answers = await inquirer.prompt([PROMPT_DOCKER]);
    CONFIG.add(answers);
    CONFIG.write();
}

async function focus_package() {
    const choices = [
        {
            key: "r",
            name: "perspective-docs",
            value: "perspective-docs",
        },
        {
            key: "c",
            name: "perspective-cpp",
            value: "perspective-cpp",
        },
        {
            key: "p",
            name: "perspective (perspective-js)",
            value: "perspective",
        },
        {
            key: "m",
            name: "perspective-metadata",
            value: "perspective-metadata",
        },
        {
            key: "y",
            name: "perspective-python",
            value: "perspective-python",
        },
        {
            key: "q",
            name: "perspective-pyodide",
            value: "perspective-pyodide",
        },
        {
            key: "r",
            name: "perspective-rs",
            value: "perspective-rs",
        },
        {
            key: "v",
            name: "perspective-viewer",
            value: "perspective-viewer",
        },
        {
            key: "e",
            name: "perspective-viewer-datagrid",
            value: "perspective-viewer-datagrid",
        },
        {
            key: "d",
            name: "perspective-viewer-d3fc",
            value: "perspective-viewer-d3fc",
        },
        {
            key: "i",
            name: "perspective-jupyterlab",
            value: "perspective-jupyterlab",
        },
        {
            key: "o",
            name: "perspective-viewer-openlayers",
            value: "perspective-viewer-openlayers",
        },
        {
            key: "w",
            name: "perspective-workspace",
            value: "perspective-workspace",
        },
        {
            key: "l",
            name: "perspective-cli",
            value: "perspective-cli",
        },
        {
            key: "a",
            name: "perspective-react",
            value: "perspective-react",
        },
    ];
    const new_config = await inquirer.prompt([
        {
            type: "checkbox",
            name: "PACKAGE",
            message: "Focus NPM package(s)?",
            default: () => {
                if (CONFIG["PACKAGE"]) {
                    const packages = CONFIG["PACKAGE"].split(",");
                    if (CONFIG["PSP_PYODIDE"] === "1") {
                        const py = packages.indexOf("perspective-python");
                        if (py >= 0) {
                            packages[py] = "perspective-pyodide";
                        }
                    }
                    return packages;
                } else {
                    return [""];
                }
            },
            filter: (answer) => {
                if (!answer || answer.length === choices.length) {
                    return "";
                } else {
                    return answer;
                }
            },
            loop: false,
            pageSize: 20,
            choices,
        },
    ]);

    if (Array.isArray(new_config.PACKAGE)) {
        if (new_config.PACKAGE.length > 0) {
            let pyodide = new_config.PACKAGE.indexOf("perspective-pyodide");
            if (pyodide >= 0) {
                new_config.PACKAGE.splice(pyodide, 1);
                new_config.PSP_PYODIDE = 1;
                new_config.CI = 1;
                new_config.PACKAGE.push("perspective-python");
            } else {
                CONFIG.remove("PSP_PYODIDE");
                CONFIG.remove("CI");
            }

            new_config.PACKAGE = `${new_config.PACKAGE.join(",")}`;
        } else {
            new_config.PACKAGE = undefined;
        }
    }

    CONFIG.add(new_config);
    await javascript_options();
}

async function javascript_options() {
    const new_config = await inquirer.prompt([PROMPT_DEBUG, PROMPT_DOCKER]);
    CONFIG.add(new_config);
    CONFIG.write();
}

focus_package();
