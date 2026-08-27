// Walks the little traveler mascot over to whichever service card the
// visitor is looking at: hover-driven on desktop (mouse/keyboard focus),
// scroll-driven on touch devices where hover doesn't exist.
export function initServicesMascot() {
  const track = document.querySelector("[data-services-track]");
  const mascot = document.querySelector("[data-services-mascot]");
  if (!track || !mascot) return;

  const cards = Array.from(track.querySelectorAll("[data-service-card]"));
  if (cards.length === 0) return;

  const mascotWidth = mascot.offsetWidth || 56;
  let activeIndex = 0;
  let revealed = false;

  function place(index, { instant = false } = {}) {
    const card = cards[index];
    if (!card) return;
    activeIndex = index;
    // getBoundingClientRect (not offsetLeft/offsetTop) because each card's
    // .reveal wrapper carries a CSS transform, which makes it the card's
    // offsetParent and breaks offset-based math relative to the track.
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const x = cardRect.left - trackRect.left + cardRect.width / 2 - mascotWidth / 2;
    const y = cardRect.top - trackRect.top + cardRect.height - 26;

    if (instant) mascot.style.transitionProperty = "opacity";
    mascot.style.transform = `translate(${x}px, ${y}px)`;
    if (instant) {
      void mascot.offsetHeight; // force reflow before restoring the transform transition
      mascot.style.transitionProperty = "";
    }
  }

  function setChecking(on) {
    mascot.classList.toggle("is-checking", on);
  }

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  cards.forEach((card, i) => {
    card.addEventListener("mouseenter", () => {
      if (!canHover) return;
      place(i);
      setChecking(true);
    });
    card.addEventListener("mouseleave", () => setChecking(false));
    card.addEventListener("focus", () => {
      place(i);
      setChecking(true);
    });
    card.addEventListener("blur", () => setChecking(false));
  });

  if (!canHover && "IntersectionObserver" in window) {
    const scrollObserver = new IntersectionObserver(
      (entries) => {
        let best = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.intersectionRatio)) {
            best = entry;
          }
        }
        if (!best) return;
        const index = cards.indexOf(best.target);
        if (index !== -1 && index !== activeIndex) {
          place(index);
          setChecking(true);
        }
      },
      { threshold: [0.4, 0.6, 0.8], rootMargin: "-35% 0px -35% 0px" },
    );
    cards.forEach((card) => scrollObserver.observe(card));
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !revealed) {
          revealed = true;
          place(0, { instant: true });
          mascot.classList.add("is-visible");
          revealObserver.disconnect();
        }
      }
    },
    { threshold: 0.2 },
  );
  revealObserver.observe(track);

  window.addEventListener("resize", () => place(activeIndex, { instant: true }));
}
