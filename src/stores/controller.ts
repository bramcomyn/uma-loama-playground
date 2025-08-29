import { defineStore } from 'pinia';

type ControllerType = 'drive' | 'odrl' | 'solid';

enum Controller {
  DRIVE = 'drive',
  ODRL = 'odrl',
  SOLID = 'solid',
}

interface State {
  controllers: Map<ControllerType, Controller>;
  currentControllerType: ControllerType;
  authorizationServerURL: string;
}

export const useControllerStore = defineStore('controller', {
  state: (): State => ({
    controllers: new Map<ControllerType, Controller>([
      ['drive', Controller.DRIVE],
      ['odrl', Controller.ODRL],
      ['solid', Controller.SOLID],
    ]),
    currentControllerType: 'odrl',
    authorizationServerURL: 'http://localhost:4000/',
  }),
  getters: {
    types(state) {
      return state.controllers.keys();
    },
    current(state) {
      return state.controllers.get(state.currentControllerType);
    },
    type(state) {
      return state.currentControllerType;
    },
    authorizationServer(state) {
      return state.authorizationServerURL;
    },
  }
});
