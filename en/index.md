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
        <h1 class="hero-title">An Investigation of the Automated Dialect Recognition System (DIAS) </h1>
      </div>
      <table class="hero-title-table" aria-label="Quick info table">
        <tbody>
          <tr>
            <td><span class="kicker">Date of Deployment</span><span class="val">01.09.2017 – now</span></td>
            <td><span class="kicker">Location</span><span class="val">Germany</span></td>
            <td><span class="kicker">Number of Uses</span><span class="val">134.938</span></td>
          </tr>
          <tr>
            <td><span class="kicker">Software</span><span class="val">Automated Dialect Recognition</span></td>
            <td><span class="kicker">Software by</span><span class="val">Nuance Communications, Inc.</span></td>
            <td><span class="kicker">Languages claimed to recognize</span>
              <span class="val">Arabic (Levantine, Maghrebi, Gulf, Iraqi, Egyptian), Dari, Farsi, Pashto</span>
            </td>
          </tr>
          <tr>
            <td><span class="kicker">Deployed by</span><span class="val">BAMF (Federal Office for Migration and Refugees)</span></td>
            <td><span class="kicker">Deployed in cases</span><span class="val">unverified identification documents</span></td>
            <td><span class="kicker">Used</span><span class="val">right after asylum registration, prior to asylum hearing</span></td>
          </tr>
        </tbody>
      </table>
      <div class="hero-left-secondbox">
        <h3 class="hero-left-secondbox-headline">Background</h3>
      </div>
      <div class="hero-left-subtitle">
        <p class="hero-subtitle">In 2015, nearly 500,000 individuals sought protection from war, conflict, and persecution, more than twice as the previous year, overwhelming Germany’s asylum system and putting its Federal Office for Migration and Refugees (BAMF) under intense pressure. By the end of 2016, staff shortages contributed to over 579,000 pending initial asylum proceedings, with average processing times approaching eight months.
        </p>
        <p class="hero-subtitle">
          Incentivized by scandals and institutional strain, the Federal Office’s Digitalisation Agenda looked to explore technological solutions to accelerate asylum decisions and reduce errors. It is within this context that the BAMF introduced the Integrated Identity Management System (IDM-S) to reform German asylum procedures in 2016.  Developed in 2017 under the Commissioner for Refugee Management and implemented with private firms without public tender, IDM-S was rolled out nationwide in early 2018. IDM-S uses automated tools such as dialect recognition, name transliteration and mobile-phone data analysis to verify asylum applicant’s information.
        </p>
        <p class="hero-subtitle">
          Of the IDM-S tools, we focus our research on the Dialect Recognition tool referred to by the BAMF as the Dialect Assistance Recognition System, in short, DIAS. According to BAMF, the rationale for using the technology includes the following reasons: (1) lack of ID documents among applicants, (2) identification of fraud in Identification documents and narratives, (3) efficiency in terms of time and financial cost, and finally (4) for helping with returns, as origin countries do not accept rejected asylum seekers without reliable evidence.
        </p>
        <p class="hero-subtitle">
          The BAMF promised the tool would improve efficiency by verifying asylum seekers’ places of origin through linguistic means by making references to a region of origin based on a biometric speech sample of asylum applicants. This approach, however, is not new. Language analysis has been used by government agencies in asylum procedures since the early 2000s as a method to assess claims of origin in cases where documentary evidence is insufficient. Already back then, this method, Language Analysis for Determination of Origin (LADO), was widely criticized by linguistic experts and scholars, who pointed to its methodological limitations and ethical risks.  Trials for the tool began in late March 17th 2017, and despite criticism regarding its accuracy, it was rolled out nationwide in September 2017 on the legal basis of Section 16, Paragraph 1 Sentence 3 of the Asylum Act, which allows audio recording of oral statements made outside of the formal hearing to determine the foreigner’s country or region of origin, provided applicants are informed DIAS is used prior to the hearing in cases when asylum seekers lack sufficient documents to prove their identity. 
        </p>
        <p class="hero-subtitle">
          As of November 2025, DIAS uses the following language and dialect models actively: Arabic (Levantine, Maghrebi, Egyptian, Gulf, Iraqi), Dari and Persian (Farsi). The reliability of this tool is a major concern. In 2017, only 160 out of the 292 reports were able to confirm the country of origin. In 2018, the BAMF claimed that the recognition rate of the software was around 80 percent. In the same year, BAMF won the ’eGovernment Award Ceremony’ for DIAS which is named the ’Best Digitization Project 2018’. In 2023, BAMF claims the recognition rate for Arabic dialects to be 87 percent. This would mean that among the around 45.000 undocumented asylum seekers who gave a speech probe in 2023, roughly 6.000 would be misclassified. Linguists emphasize that 100 percent accuracy is structurally impossible, as identifying the place of origin is an extremely complex task and analysts need to consider various factors such as the changing of language over time, code-switching, and adaptation of speech patterns, migration trajectories, and aging of training data. Linguists also point out that one needed to travel to the places regularly to analyze these changes.
        </p>
        <p class="hero-subtitle">
          Having spent almost 5 million Euros on DIAS in the first 5 years of its deployment, Germany remains the first and only European state to deploy automated dialect identification software in asylum procedures. Currently, no results from independent monitoring and evaluation of DIAS are available. 
        </p>
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-right-inner">
        <div class="hero-right-media">
          <img src="/assets/images/homepage.jpeg" alt="DIAS Archive visual" loading="lazy" />
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
    "text": "The asylum applicant is asked by the staff worker to verbally describe a selected image or speak freely in their native language over telephone. The recording is approximately 2 minutes long. The applicant's speech is recorded in a central file repository and analysed using DIAS tool. The results show the person's speech as a probability distribution across different languages and dialects (e.g. 55 percent Arabic Levantine, 25 percent Arabic Gulf, 5 percent Turkish etc.). The results also show recommendations to redo the speech analysis for better accuracy, if necessary. The result file is added to the applicant's case folder for further evaluation of the asylum case.",
    "link": {
      "href": "/en/documents/digitalisation-summit-2020/",
      "label": "See the internal guidelines"
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