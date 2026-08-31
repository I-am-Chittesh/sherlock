import { reactive } from 'vue';

export const store = reactive({
  currentScreen: 'console', // 'console', 'hub', 'pinboard', 'admin'
  currentRole: 'INVESTIGATOR', // 'INVESTIGATOR' or 'ADMIN'
  activeCaseId: null,

  setScreen(screen) {
    this.currentScreen = screen;
  },

  setRole(role) {
    this.currentRole = role;
  },

  setActiveCase(caseId) {
    this.activeCaseId = caseId;
    if (caseId) {
      this.currentScreen = 'pinboard';
    }
  }
});