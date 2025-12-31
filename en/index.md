---
layout: layouts/base.njk
title: "Home"
lang: "en"
dir: "ltr"
---

<section class="hero">
  <div class="hero-inner">
    <div class="hero-left">
      <div class="hero-left-title">
        <h1 class="hero-title">Thesis</h1>
      </div>
      <div class="hero-left-subtitle">
        <p class="hero-subtitle">
          This site hosts the practical, open-source investigation component of our Master's thesis.
          It traces biometric voice technologies in European asylum procedures.
        </p>
      </div>
      <div class="hero-left-subtitle">
        <p class="hero-subtitle">
          The Archive documents how the Dialect Identification Assistance System (DIAS)
          and related voice-based systems shape borders, credibility assessments, and the
          lives of people seeking protection.
        </p>
      </div>
      <div class="hero-left-actions">
        <a href="/en/cases/dias/" class="hero-small-btn">
          Figures &amp; Statistics
        </a>
        <a href="/en/cases/dias/" class="hero-small-btn">
          Use Cases
        </a>
        <a href="/en/cases/dias/" class="hero-small-btn">
          More on Voice Biometrics
        </a>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-right-inner">
        <!-- <div class="hero-right-title">
          <h3>Image Box</h3>
        </div>
        <div class="hero-right-text">
          <p>put image here</p>
        </div> -->
        <div class="hero-right-media">
          <img src="/assets/images/your-image.jpg" alt="DIAS Archive visual" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</section>

<section class="hero-secondary">

  <div class="hero-secondary-inner">
    <div class="hero-secondary-box" data-hero-key="what">
      <h3 class="hero-secondary-title">What is DIAS?</h3>
      <div class="hero-secondary-content"></div>
    </div>
    <div class="hero-secondary-box" data-hero-key="how">
      <h3 class="hero-secondary-title">How DIAS is used</h3>
      <div class="hero-secondary-content"></div>
    </div>
    <div class="hero-secondary-box" data-hero-key="risks">
      <h3 class="hero-secondary-title">Risks &amp; critiques</h3>
      <div class="hero-secondary-content"></div>
    </div>
  </div>

</section>

<script type="application/json" id="heroSecondaryData">
{
  "what": {
    "text": "DIAS is a voice-based tool used to classify the dialect of asylum seekers. It turns spoken language into data points used in credibility assessments.",
    "link": {
      "href": "/en/concepts/algorithmic-borders/",
      "label": "Detailed information on DIAS"
    }
  },
  "how": {
    "text": "Follow how DIAS appears in asylum interviews, language assessments, and credibility evaluations.",
    "link": {
      "href": "/en/methodology/",
      "label": "Method overview"
    }
  },
  "risks": {
    "text": "Learn about technical limitations, political stakes, and human rights concerns surrounding voice-based decision systems.",
    "link": {
      "href": "/en/concepts/algorithmic-borders/",
      "label": "Learn more"
    }
  }
}
</script>

<script src="/assets/scripts/main.js" defer></script>