"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".mobile-menu-button");
  const menuPanel = document.querySelector("#mobileMenuPanel");
  if (menuButton && menuPanel) {
    menuButton.addEventListener("click", () => {
      const open = menuPanel.classList.toggle("open");
      menuButton.classList.toggle("open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuPanel.setAttribute("aria-hidden", String(!open));
    });
    menuPanel.querySelectorAll("a").forEach(link => link.addEventListener("click", () => menuButton.click()));
  }
  const form =
    document.querySelector("#markEnquiryForm") ||
    document.querySelector("#enquiryForm") ||
    document.querySelector("form");

  if (!form) {
    console.error("CONTACT FORM NOT FOUND");
    return;
  }

  const successPanel =
    document.querySelector("#formSuccess") ||
    document.querySelector("#successPanel") ||
    document.querySelector(".success-panel");

  const submitButton =
    form.querySelector('button[type="submit"]') ||
    form.querySelector("button");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "SUBMITTING...";
    }

    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      interested_in: String(
        formData.get("interested_in") ||
        formData.get("sector") ||
        ""
      ).trim(),
      project_location: String(
        formData.get("project_location") ||
        formData.get("location") ||
        ""
      ).trim(),
      message: String(formData.get("message") || "").trim(),
      source: "Website Contact Page",
      landing_page: window.location.href,
      referrer: document.referrer || "",
      utm_source:
        new URLSearchParams(window.location.search).get("utm_source") || "",
      utm_medium:
        new URLSearchParams(window.location.search).get("utm_medium") || "",
      utm_campaign:
        new URLSearchParams(window.location.search).get("utm_campaign") || ""
    };

    console.log("LEAD PAYLOAD:", payload);

    if (!payload.name || !payload.phone || !payload.interested_in) {
      alert("Please fill Name, Phone and Interested Sector.");
      resetButton();
      return;
    }

    // Stop waiting forever if the backend hangs
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      const result = await response.json();

      console.log("SERVER RESPONSE:", result);

      if (!response.ok || !result.ok) {
        throw new Error(result.error || result.message || "Unable to submit enquiry");
      }

      form.style.display = "none";

      if (successPanel) {
        successPanel.hidden = false;
        successPanel.style.display = "block";
      } else {
        alert("Thank you. Your enquiry has been submitted successfully.");
      }

    } catch (error) {
      clearTimeout(timeout);

      console.error("LEAD SUBMISSION ERROR:", error);

      if (error.name === "AbortError") {
        alert(
          "Server is taking too long to respond. Please check whether MARK GROUPS server is running."
        );
      } else {
        alert(error.message || "Unable to submit enquiry. Please try again or call MARK GROUPS.");
      }

    } finally {
      resetButton();
    }

    function resetButton() {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "SUBMIT ENQUIRY";
      }
    }
  });
});
