document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".contact-btn");
  const range = 200; // Range in pixels for the effect

  document.addEventListener("mousemove", (e) => {
    const rect = btn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;
    const distance = Math.sqrt(
      Math.pow(e.clientX - btnCenterX, 2) + Math.pow(e.clientY - btnCenterY, 2),
    );

    if (distance < range) {
      const opacity = 1 - distance / range;
      btn.style.borderColor = `rgba(255, 255, 255, ${0.5 + opacity * 0.5})`;
    } else {
      btn.style.borderColor = "rgba(255, 255, 255, 0.25)";
    }
  });
});
