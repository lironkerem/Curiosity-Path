// Mini-Apps/FlipTheScript/ui.js
export function mountUI(app) {
  
  // ========== DOM Elements ==========
  const input = document.getElementById("negative-input");
  const flipBtn = document.getElementById("flip-btn");
  const clearBtn = document.getElementById("clear-btn");
  const progressWrapper = document.getElementById("progress-wrapper");
  const progressInner = document.getElementById("progress-inner");

  const extendedFlipEl = document.getElementById("extended-flip");

  const saveExtendedBtn = document.getElementById("save-extended");
  const audioExtendedBtn = document.getElementById("audio-extended");

  const savedList = document.getElementById("saved-list");
  const searchSaved = document.getElementById("search-saved");

  const backupBtn = document.getElementById("backup-id");
  const restoreBtn = document.getElementById("restore-id");

  const charCount = document.getElementById("char-count");

  const inputSection = document.getElementById("input-section");
  const outputSection = document.getElementById("output-section");
  const flipAnotherBtn = document.getElementById("flip-another-btn");

  const voiceInputBtn = document.getElementById("voice-input-btn");

  // ========== State ==========
  let savedFlips = JSON.parse(localStorage.getItem("savedFlips") || "[]");
  let isListening = false;
  let recognition = null;
  let wasVoiceInput = false;

  // ========== Helper Functions ==========
  function showToastLocal(message, duration = 2000) {
    app.showToast(message);
  }
  const showToast = showToastLocal;

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => showToast('Copied to clipboard!'));
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try { document.execCommand('copy'); showToast('Copied to clipboard!'); } catch (_) {}
      document.body.removeChild(textarea);
    }
  }

  function speakText(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
      showToast("Playing audio...");
    } else {
      showToast("Audio not supported");
    }
  }

  // ========== Voice Input (Speech Recognition) ==========
  function initSpeechRecognition() {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      voiceInputBtn.style.display = "none";
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      isListening = true;
      voiceInputBtn.classList.add("listening");
      voiceInputBtn.innerHTML = "🔴";
      showToast("Listening... Speak now!");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      input.value = transcript;
      charCount.textContent = transcript.length;
      showToast("Got it! Flipping now...");
      wasVoiceInput = true;

      // Auto-trigger flip after 500ms
      setTimeout(() => {
        if (transcript.trim()) {
          flipBtn.click();
        }
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isListening = false;
      voiceInputBtn.classList.remove("listening");
      voiceInputBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="9" height="13" x="7" y="3" rx="4.5"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`;

      if (event.error === "no-speech") {
        showToast("No speech detected. Try again!");
      } else if (event.error === "not-allowed") {
        showToast(
          "Microphone access denied. Please allow microphone access in browser settings."
        );
      } else if (event.error === "network") {
        showToast("Network error. Check your internet connection.");
      } else {
        showToast("Could not recognize speech. Try again.");
      }
    };

    recognition.onend = () => {
      isListening = false;
      voiceInputBtn.classList.remove("listening");
      voiceInputBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><rect width="9" height="13" x="7" y="3" rx="4.5"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="8" y1="22" x2="16" y2="22"/></svg>`;
    };
  }

  voiceInputBtn.addEventListener("click", async () => {
    if (!recognition) {
      showToast("Speech recognition not supported in this browser");
      return;
    }

    if (isListening) {
      recognition.stop();
      return;
    }

    // Check if page is served over HTTPS (required for mic access)
    if (
      window.location.protocol !== "https:" &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      showToast(
        "Microphone requires HTTPS. Voice input only works on secure pages."
      );
      return;
    }

    // Try to start recognition
    try {
      recognition.start();
    } catch (error) {
      console.error("Error starting recognition:", error);
      showToast("Could not start voice input. Please try again.");
    }
  });

  initSpeechRecognition();

  // ========== Character Counter ==========
  input.addEventListener("input", () => {
    const count = input.value.length;
    charCount.textContent = count;
    const counter = charCount.parentElement;

    counter.classList.remove("warning", "danger");
    if (count > 400) {
      counter.classList.add("danger");
    } else if (count > 350) {
      counter.classList.add("warning");
    }
  });

  // ========== Flip Suggestions ==========
  document.querySelectorAll(".suggestion-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-text");
      input.value = text;
      input.focus();
    });
  });

  // ========== Collapsible Behavior ==========
  document.querySelectorAll(".collapsible-card").forEach((card) => {
    const toggle = card.querySelector(".collapse-toggle");
    const content = card.querySelector(".collapse-content");
    const icon = toggle.querySelector(".collapse-icon");

    if (!toggle || !content) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", !expanded);

      if (expanded) {
        content.classList.add("collapsed");
        icon.textContent = "▶";
      } else {
        content.classList.remove("collapsed");
        icon.textContent = "▼";
      }
    });
  });

  // ========== Flip Another Button ==========
  flipAnotherBtn.addEventListener("click", () => {
    // Hide output section
    outputSection.classList.add("hidden");
    outputSection.classList.remove("show");

    // Show input section
    inputSection.classList.remove("minimized");

    // Clear input
    input.value = "";
    charCount.textContent = "0";

    // Scroll to input
    inputSection.scrollIntoView({ behavior: "smooth", block: "start" });

    // Focus input
    setTimeout(() => input.focus(), 300);
  });

  // ========== Handle Enter Key ==========
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      flipBtn.click();
    }
  });

  // ========== Create halo rings ==========
  function createHaloRings() {
    const outputSection = document.getElementById("output-section");
    requestAnimationFrame(() => {
    const outputRect = outputSection.getBoundingClientRect();
    const centerX = outputRect.left + outputRect.width / 2;
    const centerY = outputRect.top + outputRect.height / 2;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ring = document.createElement("div");
        ring.className = "halo-ring";
        ring.style.left = centerX + "px";
        ring.style.top = centerY + "px";

        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 1500);
      }, i * 300);
    }
    });
  }

  // ========== Create floating particles ==========
  function createFlipParticles() {
    const particles = [
      "✨", "⭐", "💫", "🌟", "💥", "⚡", "🌠", "💎",
      "💚", "🦋", "🌸", "✴️", "🎆", "💖", "🌈", "💎",
      "✴️", "🎆", "🎇", "✨", "⭐", "💫", "🌟", "💥",
    ];
    requestAnimationFrame(() => {
    const inputRect = input.getBoundingClientRect();
    const centerX = inputRect.left + inputRect.width / 2;
    const centerY = inputRect.top + inputRect.height / 2;

    particles.forEach((particle, i) => {
      setTimeout(() => {
        const el = document.createElement("div");
        el.className = "flip-particle";
        el.textContent = particle;
        el.style.left = centerX + "px";
        el.style.top = centerY + "px";

        const angle = (i / particles.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const distance = 350 + Math.random() * 200;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;

        el.style.setProperty("--tx", tx + "px");
        el.style.setProperty("--ty", ty + "px");

        document.body.appendChild(el);

        setTimeout(() => el.remove(), 2000);
      }, i * 30);
    });
    });
  }

  // ========== Enhanced Flip Action ==========
  async function performFlip() {
    const text = input.value.trim();
    if (!text) {
      showToast("Please enter a thought first");
      return;
    }

    flipBtn.disabled = true;
    flipBtn.textContent = "Flipping...";

    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.classList.add("animating");
    }

    const whooshOverlay1 = document.createElement("div");
    whooshOverlay1.className = "whoosh-overlay";
    document.body.appendChild(whooshOverlay1);

    const whooshOverlay2 = document.createElement("div");
    whooshOverlay2.className = "whoosh-overlay-2";
    document.body.appendChild(whooshOverlay2);

    createHaloRings();
    createFlipParticles();

    progressWrapper.classList.remove("hidden");
    progressInner.style.width = "0%";

    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + 10, 100);
      progressInner.style.width = progress + "%";
      progressInner.textContent = progress + "%";
    }, 150);

    extendedFlipEl.textContent = "Generating...";

    try {
      const result = await FlipEngine.flip(text);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Minimize input section
      inputSection.classList.add("minimized");

      // Show output section as main event
      outputSection.classList.remove("hidden");

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Add show class for animation
      outputSection.classList.add("show");

      // Scroll to output
      setTimeout(() => {
        outputSection.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);

      await new Promise((resolve) => setTimeout(resolve, 750));

      extendedFlipEl.textContent =
        result.expandedAffirmation || result.basicAffirmation || "No result";

      extendedFlipEl.classList.add("text-reveal");

      await new Promise((resolve) => setTimeout(resolve, 600));

      setTimeout(() => {
        extendedFlipEl.classList.remove("text-reveal");
      }, 600);

      // Auto-speak the flipped result if voice input was used
      if (wasVoiceInput) {
        setTimeout(() => {
          speakText(extendedFlipEl.textContent);
          wasVoiceInput = false;
        }, 800);
      } else {
        wasVoiceInput = false;
      }
    } catch (err) {
      console.error(err);
      extendedFlipEl.textContent = "Error generating flip.";
      showToast("Error occurred");
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        progressWrapper.classList.add("hidden");
        whooshOverlay1.remove();
        whooshOverlay2.remove();
        if (appContainer) {
          appContainer.classList.remove("animating");
        }
      }, 1500);
      flipBtn.disabled = false;
      flipBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-icon"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9"/><path d="m15 3 3 3-3 3"/><path d="M18 6H9"/></svg> Flip It Now`;
    }
  }

  flipBtn.addEventListener("click", performFlip);

  // ========== Clear ==========
  clearBtn.addEventListener("click", () => {
    input.value = "";
    extendedFlipEl.textContent = "Your Flipped Script will appear here...";
    charCount.textContent = "0";

    // Hide output if shown
    if (!outputSection.classList.contains("hidden")) {
      outputSection.classList.add("hidden");
      outputSection.classList.remove("show");
      inputSection.classList.remove("minimized");
    }
  });

  // ========== Copy & Audio ==========
  audioExtendedBtn.addEventListener("click", () =>
    speakText(extendedFlipEl.textContent)
  );

  // ========== Save ==========
  function addSaved(text) {
    const t = text.trim();
    if (!t || t.includes("will appear here")) return;
    if (savedFlips.some((f) => f.text === t)) {
      showToast("Already saved");
      return;
    }
    savedFlips.unshift({
      text: t,
      favorite: false,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("savedFlips", JSON.stringify(savedFlips));
    renderSaved();
    showToast("Saved!");
  }

  saveExtendedBtn.addEventListener("click", () =>
    addSaved(extendedFlipEl.textContent)
  );

  // ========== Saved Flips Rendering ==========
  function renderSaved(filter = "") {
    savedList.innerHTML = "";

    let filtered = savedFlips;
    if (filter) {
      const lower = filter.toLowerCase();
      filtered = savedFlips.filter((f) =>
        f.text.toLowerCase().includes(lower)
      );
    }

    if (filtered.length === 0) {
      const li = document.createElement("li");
      li.className = "saved-item";
      li.innerHTML = '<p class="placeholder">No saved flips yet.</p>';
      savedList.appendChild(li);
      return;
    }

    filtered.forEach((item) => {
      const actualIdx = savedFlips.indexOf(item);
      const li = document.createElement("li");
      li.className = "saved-item";
      if (item.favorite) li.classList.add("favorite");

      li.innerHTML = `
        <div style="flex: 1;">
          <p>${item.text}</p>
        </div>
        <div class="action-icons">
          <button class="small-btn edit">Edit</button>
          <button class="small-btn delete">Delete</button>
          <button class="small-btn favorite">${
            item.favorite ? "★" : "☆"
          }</button>
        </div>`;

      li.querySelector(".delete").addEventListener("click", () => {
        savedFlips.splice(actualIdx, 1);
        localStorage.setItem("savedFlips", JSON.stringify(savedFlips));
        renderSaved(filter);
        showToast("Deleted");
      });

      li.querySelector(".favorite").addEventListener("click", () => {
        savedFlips[actualIdx].favorite = !savedFlips[actualIdx].favorite;
        localStorage.setItem("savedFlips", JSON.stringify(savedFlips));
        renderSaved(filter);
        showToast(
          savedFlips[actualIdx].favorite ? "⭐ Favorited" : "☆ Unfavorited"
        );
      });

      li.querySelector(".edit").addEventListener("click", () => {
        const p = li.querySelector("p");
        const inputEl = document.createElement("input");
        inputEl.type = "text";
        inputEl.value = p.textContent;
        inputEl.className = "edit-input";
        p.replaceWith(inputEl);
        inputEl.focus();

        inputEl.addEventListener("blur", () => {
          savedFlips[actualIdx].text = inputEl.value.trim();
          localStorage.setItem("savedFlips", JSON.stringify(savedFlips));
          renderSaved(filter);
        });

        inputEl.addEventListener("keypress", (e) => {
          if (e.key === "Enter") inputEl.blur();
        });
      });

      savedList.appendChild(li);
    });
  }

  searchSaved.addEventListener("input", (e) => {
    renderSaved(e.target.value);
  });

  // ========== Backup / Restore ==========
  backupBtn.addEventListener("click", () => {
    const backup = {
      savedFlips,
      version: "2.0",
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "FlipTheScript_Backup_" + new Date().toISOString().split("T")[0] + ".json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Backup downloaded!");
  });

  restoreBtn.addEventListener("click", () => {
    const inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "application/json";
    inputFile.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const backup = JSON.parse(reader.result);
          if (backup.savedFlips) {
            savedFlips = backup.savedFlips;
            localStorage.setItem("savedFlips", JSON.stringify(savedFlips));
          }
          renderSaved();
          showToast("Backup restored!");
        } catch {
          showToast("Invalid backup file");
        }
      };
      reader.readAsText(file);
    };
    inputFile.click();
  });

  // ========== Keyboard Shortcuts ==========
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      flipBtn.click();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === "s") {
      e.preventDefault();
      if (
        extendedFlipEl.textContent &&
        !extendedFlipEl.textContent.includes("will appear here")
      ) {
        addSaved(extendedFlipEl.textContent);
      }
    }
    if (e.key === "Escape") {
      clearBtn.click();
    }
  });

  // ========== Initialize ==========
  renderSaved();

}