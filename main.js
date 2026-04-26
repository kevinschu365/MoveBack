import {
  initialCompletedExerciseIdsBySessionId,
  initialMobilityRatings,
  mobilityAreas,
  trainings,
  userProfile,
  weekPlan,
} from "./data.js";

const STORAGE_KEY = "moveback-web-state-v1";

const appElement = document.querySelector("#app");
const navButtons = Array.from(document.querySelectorAll(".nav-button"));
const modalElement = document.querySelector("#trainingModal");
const modalContentElement = document.querySelector("#trainingModalContent");
const modalTitleElement = document.querySelector("#modalTitle");
const closeModalButton = document.querySelector("#closeModalButton");
const installButton = document.querySelector("#installButton");

let deferredInstallPrompt = null;

const state = {
  activeTab: "dashboard",
  activeSessionId: null,
  mobilityRatings: { ...initialMobilityRatings },
  completedExerciseIdsBySessionId: JSON.parse(
    JSON.stringify(initialCompletedExerciseIdsBySessionId),
  ),
};

loadState();
renderApp();
registerEvents();
registerServiceWorker();

function registerEvents() {
  navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTab = button.dataset.tab;
      renderApp();
    });
  });

  appElement.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");

    if (!target) {
      return;
    }

    const action = target.dataset.action;

    if (action === "open-session") {
      openSession(target.dataset.sessionId);
      return;
    }

    if (action === "open-mobility") {
      state.activeTab = "mobility";
      renderApp();
      return;
    }

    if (action === "set-mobility") {
      const area = target.dataset.area;
      const value = Number(target.dataset.value);

      state.mobilityRatings[area] = value;
      saveState();
      renderApp();
      return;
    }
  });

  modalContentElement.addEventListener("click", (event) => {
    const target = event.target.closest("[data-toggle-exercise]");

    if (!target) {
      return;
    }

    const sessionId = target.dataset.sessionId;
    const exerciseId = target.dataset.exerciseId;
    toggleExerciseCompleted(sessionId, exerciseId);
  });

  closeModalButton.addEventListener("click", closeModal);
  modalElement.addEventListener("click", (event) => {
    if (event.target === modalElement) {
      closeModal();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener("click", async () => {
    if (!deferredInstallPrompt) {
      return;
    }

    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });
}

function renderApp() {
  const completedSessionIds = getCompletedSessionIds();
  const resolvedWeekPlan = getResolvedWeekPlan(completedSessionIds);
  const activeTabMarkup = getActiveTabMarkup(resolvedWeekPlan);

  appElement.innerHTML = activeTabMarkup;

  navButtons.forEach((button) => {
    const active = button.dataset.tab === state.activeTab;
    button.classList.toggle("nav-button-active", active);
  });
}

function getActiveTabMarkup(resolvedWeekPlan) {
  if (state.activeTab === "plan") {
    return renderPlan(resolvedWeekPlan);
  }

  if (state.activeTab === "mobility") {
    return renderMobility();
  }

  if (state.activeTab === "progress") {
    return renderProgress(resolvedWeekPlan);
  }

  return renderDashboard(resolvedWeekPlan);
}

function renderDashboard(resolvedWeekPlan) {
  const today = getTodayPlanItem(resolvedWeekPlan);
  const training = getTrainingById(today.trainingId);
  const todayProgress = training
    ? getTrainingCompletion(training, state.completedExerciseIdsBySessionId[today.id] ?? [])
    : 0;
  const streak = getCurrentStreak(resolvedWeekPlan);
  const mobilityScore = getMobilityScore();
  const completedTrainingCount = getCompletedTrainingCount();
  const openCount = resolvedWeekPlan.filter(
    (day) => day.status === "open" && day.trainingId,
  ).length;

  return `
    <section class="stack-xl">
      <article class="hero-card">
        <div class="hero-grid">
          <div class="stack-md">
            <p class="eyebrow">Willkommen zurueck</p>
            <h2 class="hero-title">${userProfile.firstName}, heute wird es wieder leichter.</h2>
            <p class="hero-copy">${userProfile.goal}</p>
          </div>
          <div class="streak-badge">
            <strong>${streak}</strong>
            <span>Tage Streak</span>
          </div>
        </div>
        <button class="primary-button" data-action="open-session" data-session-id="${today.id}">
          Training starten
        </button>
      </article>

      <section class="stack-md">
        <div class="section-heading">
          <h3>Heutiges Training</h3>
          <p>Klar strukturiert, kompakt und ideal fuer den Wiedereinstieg.</p>
        </div>
        <article class="card">
          <div class="card-row">
            <div class="stack-sm grow">
              <h4>${training ? training.title : today.trainingType}</h4>
              <p class="muted">${training ? training.focus : "Erholung"} - ${today.duration} Min</p>
            </div>
            ${renderStatusPill(today.status)}
          </div>
          <p class="body-copy">
            ${
              training
                ? training.description
                : "Heute steht eine leichte Pause mit Fokus auf Regeneration und Bewegung im Alltag an."
            }
          </p>
          ${renderProgressMeter("Fortschritt", todayProgress)}
        </article>
      </section>

      <article class="card card-accent">
        <div class="stack-sm">
          <h4>Mobility Routine</h4>
          <p class="body-copy">
            In 5 Minuten deine Beweglichkeit checken und den Tageszustand besser einschaetzen.
          </p>
        </div>
        <button class="secondary-button" data-action="open-mobility">Mobility Check oeffnen</button>
      </article>

      <section class="stat-grid">
        ${renderStatCard("Aktuelle Streak", `${streak}`, true)}
        ${renderStatCard("Mobility Score", `${mobilityScore}`)}
      </section>

      <article class="card stack-md">
        <div class="section-heading">
          <h3>Fortschritt</h3>
          <p>Dein Fortschritt bleibt sichtbar, auch wenn du klein startest.</p>
        </div>
        <div class="mini-stat-grid">
          <div class="mini-stat-box">
            <strong>${completedTrainingCount}</strong>
            <span>Trainings erledigt</span>
          </div>
          <div class="mini-stat-box">
            <strong>${openCount}</strong>
            <span>Noch offen</span>
          </div>
        </div>
      </article>
    </section>
  `;
}

function renderPlan(resolvedWeekPlan) {
  return `
    <section class="stack-lg">
      <div class="section-heading">
        <h2>Wochenplan</h2>
        <p>Sieben klare Tage mit Trainingstyp, Dauer und Status.</p>
      </div>
      <div class="stack-sm">
        ${resolvedWeekPlan.map((day) => renderWeekPlanDay(day)).join("")}
      </div>
    </section>
  `;
}

function renderMobility() {
  const mobilityScore = getMobilityScore();

  return `
    <section class="stack-lg">
      <div class="section-heading">
        <h2>Mobility Check</h2>
        <p>Bewerte Schulter, Huefte, Ruecken, Beine und Nacken auf einer Skala von 1 bis 5.</p>
      </div>
      <article class="hero-card hero-card-tight center">
        <p class="eyebrow">Mobility Score</p>
        <h3 class="score-value">${mobilityScore}</h3>
        <p class="hero-copy hero-copy-center">
          Der Score wird aus dem Durchschnitt deiner 5 Bewertungen berechnet.
        </p>
      </article>
      <div class="stack-sm">
        ${mobilityAreas.map((area) => renderMobilityRow(area)).join("")}
      </div>
      <p class="footnote">1 = sehr eingeschraenkt, 5 = frei und belastbar</p>
    </section>
  `;
}

function renderProgress(resolvedWeekPlan) {
  const mobilityScore = getMobilityScore();
  const streak = getCurrentStreak(resolvedWeekPlan);
  const weekStats = getWeekStats(resolvedWeekPlan);
  const completedTrainingCount = getCompletedTrainingCount();
  const chartValues = [
    { label: "Done", value: weekStats.completed, tone: "accent" },
    { label: "Open", value: weekStats.open, tone: "muted" },
    { label: "Pause", value: weekStats.pause, tone: "warm" },
  ];
  const maxValue = Math.max(...chartValues.map((item) => item.value), 1);

  return `
    <section class="stack-lg">
      <div class="section-heading">
        <h2>Fortschritt</h2>
        <p>Alle wichtigen Signale auf einen Blick: Training, Routine und Beweglichkeit.</p>
      </div>

      <section class="stat-grid">
        ${renderStatCard("Erledigte Trainings", `${completedTrainingCount}`)}
        ${renderStatCard("Aktuelle Streak", `${streak}`, true)}
      </section>

      ${renderWideStatCard("Mobility Score", `${mobilityScore}`)}

      <article class="card stack-md">
        <div class="section-heading">
          <h3>Wochenstatistik</h3>
          <p>Ein einfacher Blick auf deine aktuelle Trainingswoche.</p>
        </div>
        <div class="chart-grid">
          ${chartValues
            .map((item) => {
              const height = Math.max((item.value / maxValue) * 100, item.value > 0 ? 10 : 0);

              return `
                <div class="chart-item">
                  <div class="chart-track">
                    <div class="chart-fill chart-fill-${item.tone}" style="height:${height}%"></div>
                  </div>
                  <strong>${item.value}</strong>
                  <span>${item.label}</span>
                </div>
              `;
            })
            .join("")}
        </div>
      </article>

      <article class="card">
        <div class="mini-stat-grid">
          <div class="mini-stat-box">
            <strong>${weekStats.completed}</strong>
            <span>Erledigt</span>
          </div>
          <div class="mini-stat-box">
            <strong>${weekStats.open}</strong>
            <span>Offen</span>
          </div>
          <div class="mini-stat-box">
            <strong>${weekStats.pause}</strong>
            <span>Pause</span>
          </div>
        </div>
      </article>
    </section>
  `;
}

function renderWeekPlanDay(day) {
  const buttonMarkup = day.trainingId
    ? `data-action="open-session" data-session-id="${day.id}"`
    : "";

  return `
    <article class="card week-card ${day.isToday ? "week-card-today" : ""}" ${buttonMarkup}>
      <div class="week-day">
        <strong>${day.dayLabel}</strong>
        <span>${day.fullLabel}</span>
      </div>
      <div class="stack-xs grow">
        <h4>${day.trainingType}</h4>
        <p class="muted">${day.duration > 0 ? `${day.duration} Min` : "Regeneration"}</p>
      </div>
      ${renderStatusPill(day.status)}
    </article>
  `;
}

function renderMobilityRow(area) {
  const value = state.mobilityRatings[area.key];

  return `
    <article class="card stack-md">
      <div class="stack-xs">
        <h4>${area.label}</h4>
        <p class="body-copy">${area.note}</p>
      </div>
      <div class="rating-row">
        ${[1, 2, 3, 4, 5]
          .map(
            (option) => `
              <button
                class="rating-button ${option === value ? "rating-button-active" : ""}"
                data-action="set-mobility"
                data-area="${area.key}"
                data-value="${option}"
                type="button"
              >
                ${option}
              </button>
            `,
          )
          .join("")}
      </div>
    </article>
  `;
}

function renderTrainingModal(sessionId) {
  const session = weekPlan.find((entry) => entry.id === sessionId);
  const training = session ? getTrainingById(session.trainingId) : null;

  if (!session || !training) {
    modalTitleElement.textContent = "Training nicht gefunden";
    modalContentElement.innerHTML =
      '<p class="body-copy">Die angeforderte Session konnte nicht geladen werden.</p>';
    return;
  }

  const completedExerciseIds = state.completedExerciseIdsBySessionId[session.id] ?? [];
  const progress = getTrainingCompletion(training, completedExerciseIds);

  modalTitleElement.textContent = training.title;
  modalContentElement.innerHTML = `
    <div class="stack-lg">
      <div class="meta-grid">
        <div>
          <span class="meta-label">Fokus</span>
          <strong class="meta-value">${training.focus}</strong>
        </div>
        <div>
          <span class="meta-label">Dauer</span>
          <strong class="meta-value">${training.duration} Min</strong>
        </div>
      </div>
      <article class="card stack-md">
        <div class="card-row">
          <h4>Training Fortschritt</h4>
          <strong class="accent-text">${Math.round(progress * 100)}%</strong>
        </div>
        ${renderProgressMeter("Session", progress)}
      </article>
      <div class="stack-sm">
        ${training.exercises
          .map((exercise) => {
            const completed = completedExerciseIds.includes(exercise.id);

            return `
              <article class="card stack-md ${completed ? "exercise-card-complete" : ""}">
                <div class="card-row card-row-start">
                  <div class="stack-xs grow">
                    <h4>${exercise.name}</h4>
                    <p class="accent-text">${exercise.prescription}</p>
                  </div>
                  <button
                    class="exercise-check ${completed ? "exercise-check-complete" : ""}"
                    data-toggle-exercise="true"
                    data-session-id="${session.id}"
                    data-exercise-id="${exercise.id}"
                    type="button"
                  >
                    ${completed ? "OK" : ""}
                  </button>
                </div>
                <p class="body-copy">${exercise.description}</p>
                <button
                  class="${completed ? "secondary-button" : "chip-button"}"
                  data-toggle-exercise="true"
                  data-session-id="${session.id}"
                  data-exercise-id="${exercise.id}"
                  type="button"
                >
                  ${completed ? "Als offen markieren" : "Erledigt"}
                </button>
              </article>
            `;
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderStatusPill(status) {
  const labels = {
    open: "Offen",
    done: "Erledigt",
    pause: "Pause",
  };

  return `<span class="status-pill status-pill-${status}">${labels[status]}</span>`;
}

function renderStatCard(label, value, dark = false) {
  return `
    <article class="stat-card ${dark ? "stat-card-dark" : ""}">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function renderWideStatCard(label, value) {
  return `
    <article class="stat-card stat-card-wide">
      <strong>${value}</strong>
      <span>${label}</span>
    </article>
  `;
}

function renderProgressMeter(label, progress) {
  return `
    <div class="stack-sm">
      <div class="card-row">
        <span class="muted">${label}</span>
        <strong>${Math.round(progress * 100)}%</strong>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width:${progress * 100}%"></div>
      </div>
    </div>
  `;
}

function getTrainingById(trainingId) {
  return trainings.find((training) => training.id === trainingId) ?? null;
}

function getTrainingCompletion(training, completedExerciseIds) {
  if (!training.exercises.length) {
    return 0;
  }

  return completedExerciseIds.length / training.exercises.length;
}

function getCompletedSessionIds() {
  return weekPlan
    .filter((day) => {
      if (!day.trainingId || day.status === "pause") {
        return false;
      }

      const training = getTrainingById(day.trainingId);

      if (!training) {
        return false;
      }

      return getTrainingCompletion(
        training,
        state.completedExerciseIdsBySessionId[day.id] ?? [],
      ) >= 1;
    })
    .map((day) => day.id);
}

function getResolvedWeekPlan(completedSessionIds) {
  return weekPlan.map((day) => {
    const derivedStatus =
      day.status === "pause"
        ? "pause"
        : completedSessionIds.includes(day.id)
          ? "done"
          : "open";

    return { ...day, status: derivedStatus };
  });
}

function getTodayPlanItem(resolvedWeekPlan) {
  return resolvedWeekPlan.find((day) => day.isToday) ?? resolvedWeekPlan[0];
}

function getCurrentStreak(resolvedWeekPlan) {
  const todayIndex = resolvedWeekPlan.findIndex((day) => day.isToday);
  const startIndex = todayIndex >= 0 ? todayIndex : resolvedWeekPlan.length - 1;
  let streak = 0;

  for (let index = startIndex; index >= 0; index -= 1) {
    const day = resolvedWeekPlan[index];

    if (day.status === "pause") {
      continue;
    }

    if (day.status === "done") {
      streak += 1;
      continue;
    }

    break;
  }

  return streak;
}

function getMobilityScore() {
  const values = Object.values(state.mobilityRatings);
  const average = values.reduce((total, value) => total + value, 0) / values.length;

  return Math.round(average * 20);
}

function getWeekStats(resolvedWeekPlan) {
  return {
    completed: resolvedWeekPlan.filter((day) => day.status === "done").length,
    open: resolvedWeekPlan.filter((day) => day.status === "open").length,
    pause: resolvedWeekPlan.filter((day) => day.status === "pause").length,
  };
}

function getCompletedTrainingCount() {
  return getCompletedSessionIds().length;
}

function toggleExerciseCompleted(sessionId, exerciseId) {
  const current = state.completedExerciseIdsBySessionId[sessionId] ?? [];
  const completed = current.includes(exerciseId);

  state.completedExerciseIdsBySessionId[sessionId] = completed
    ? current.filter((entry) => entry !== exerciseId)
    : [...current, exerciseId];

  saveState();
  renderApp();

  if (state.activeSessionId) {
    renderTrainingModal(state.activeSessionId);
  }
}

function openSession(sessionId) {
  state.activeSessionId = sessionId;
  renderTrainingModal(sessionId);
  modalElement.hidden = false;
  document.body.classList.add("modal-open");
}

function closeModal() {
  state.activeSessionId = null;
  modalElement.hidden = true;
  document.body.classList.remove("modal-open");
}

function loadState() {
  try {
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));

    if (!savedState) {
      return;
    }

    state.mobilityRatings = {
      ...state.mobilityRatings,
      ...savedState.mobilityRatings,
    };
    state.completedExerciseIdsBySessionId = {
      ...state.completedExerciseIdsBySessionId,
      ...savedState.completedExerciseIdsBySessionId,
    };
  } catch (error) {
    console.warn("MoveBack state could not be restored.", error);
  }
}

function saveState() {
  const payload = {
    mobilityRatings: state.mobilityRatings,
    completedExerciseIdsBySessionId: state.completedExerciseIdsBySessionId,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) =>
        Promise.all(registrations.map((registration) => registration.unregister())),
      )
      .then(() => {
        if ("caches" in window) {
          return caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
        }

        return Promise.resolve();
      })
      .catch((error) => {
        console.warn("Service worker cleanup failed.", error);
      });
  });
}
