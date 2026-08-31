<script setup>
import { store } from '../store';

const selectRole = (role) => {
  store.setRole(role);
  store.setScreen('hub');
};
</script>

<template>
  <div class="console-screen">
    <header class="console-header">
      <h1 class="console-label">console.</h1>
      <div class="lockup" aria-label="sher locked, no shit sherlock">
        <span>sher</span>
        <strong>locked</strong>
        <small>*no shit sherlock*</small>
      </div>
    </header>

    <section class="portal-layout" aria-label="Choose a portal">
      <button
        class="portal portal-investigator"
        type="button"
        @click="selectRole('INVESTIGATOR')"
      >
        <span>invest.</span>
      </button>

      <div class="key-mark" aria-hidden="true">
        <span class="key-head">+</span>
        <span class="key-stem"></span>
      </div>

      <button
        class="portal portal-admin"
        type="button"
        @click="selectRole('ADMIN')"
      >
        <span>admin</span>
      </button>
    </section>
  </div>
</template>

<style scoped>
.console-screen {
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
  padding: 22px 28px 30px;
  overflow: hidden;
  background: #e6e5e0;
  color: #202020;
  font-family: "SF Pro Text", "SF Sans", -apple-system, BlinkMacSystemFont, sans-serif;
}

.console-screen::before {
  position: absolute;
  inset: 8px;
  border: 1px solid #9c9b95;
  content: "";
  pointer-events: none;
}

.console-header {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 82px;
  padding: 0 18px;
}

.console-label,
.lockup {
  font-family: "Times New Roman", Times, serif;
  font-weight: 400;
  letter-spacing: 0.16em;
}

.console-label {
  margin: 5px 0 0;
  font-size: clamp(1.35rem, 3vw, 2rem);
  font-style: italic;
}

.lockup {
  display: grid;
  justify-items: center;
  margin-top: -8px;
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  line-height: 0.9;
}

.lockup strong {
  font-weight: 400;
}

.lockup small {
  margin-top: 9px;
  font-size: 0.6rem;
  letter-spacing: 0.03em;
}

.portal-layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 86px minmax(0, 1fr);
  align-items: center;
  width: min(100%, 1060px);
  min-height: min(68vh, 590px);
  margin: 18px auto 0;
}

.portal {
  display: grid;
  place-items: center;
  width: min(100%, 360px);
  aspect-ratio: 0.72;
  padding: 20px;
  border: 1.5px solid #252525;
  border-radius: 31% 27% 25% 29%;
  background: transparent;
  color: #202020;
  cursor: pointer;
  font-family: "Times New Roman", Times, serif;
  font-size: clamp(1.5rem, 3vw, 2.15rem);
  font-style: italic;
  transition: background-color 160ms ease, transform 160ms ease;
}

.portal:hover,
.portal:focus-visible {
  background: rgba(255, 255, 255, 0.3);
  outline: none;
  transform: translateY(-3px);
}

.portal:focus-visible {
  box-shadow: 0 0 0 2px #202020;
}

.portal-investigator {
  justify-self: end;
}

.portal-admin {
  justify-self: start;
  border-radius: 27% 31% 29% 25%;
}

.key-mark {
  position: relative;
  justify-self: center;
  width: 42px;
  height: 122px;
  transform: rotate(29deg);
}

.key-head {
  position: absolute;
  top: 0;
  left: 3px;
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border: 1.5px solid #252525;
  border-radius: 50%;
  font-family: "SF Pro Text", "SF Sans", sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
}

.key-stem {
  position: absolute;
  top: 35px;
  left: 17px;
  width: 9px;
  height: 83px;
  border: 1.5px solid #252525;
  border-top: 0;
  transform: skewX(-7deg);
}

@media (max-width: 620px) {
  .console-screen {
    padding: 18px 14px 24px;
  }

  .console-header {
    min-height: 64px;
    padding: 0 10px;
  }

  .portal-layout {
    grid-template-columns: minmax(0, 1fr) 42px minmax(0, 1fr);
    min-height: 64vh;
    margin-top: 12px;
  }

  .portal {
    width: 100%;
    min-height: 270px;
  }

  .key-mark {
    transform: rotate(29deg) scale(0.76);
  }
}
</style>