import { defineStore } from "pinia";

type ControllerType = "drive" | "odrl" | "solid";

enum Controller {
    DRIVE = "drive",
    ODRL = "odrl",
    SOLID = "solid",
};

export const useControllerStore = defineStore("controller", {
    state: () => ({
        controllers: new Map<ControllerType, Controller>([
            ["drive", Controller.DRIVE],
            ["odrl", Controller.ODRL],
            ["solid", Controller.SOLID]
        ]),
        current: Controller.ODRL,
        type: "odrl",
    }),
    getters: {
        types(state) { return state.controllers.keys },
        current(state) { return state.current },
        type(state) { return state.type }
    },
    actions: {
        setController(controller: Controller, type: ControllerType) {
            this.current = controller;
            this.type = type;
        }
    }
});
