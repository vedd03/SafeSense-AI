# SafeSense AI — PBL Demo Guide

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Best 3-minute demo

1. Login as **Employee**.
2. Open **Report Incident**.
3. Click **Load Demo Scenario**.
4. Click **Submit & Analyze**.
5. Show the AI result: hazard category, severity, probability, risk score, root causes and recommended actions.
6. Logout and login as **Safety Officer**.
7. Open **Alerts** to show the automatically generated high-risk alert.
8. Open **AI Analysis** to show the incident intelligence.
9. Open **CAPA Tracking** and create/track a corrective action.
10. Open **Risk Prediction** to show the deterministic forecast.
11. Login as **Manager** and open **Analytics** to show trends and department safety insights.

## Prototype note

The AI decision-support engine is intentionally local and deterministic for the PBL prototype. It uses a rule/knowledge-base approach to simulate multimodal hazard classification, risk scoring, root-cause clues and recommendations without requiring a paid AI API or backend.

Incident, CAPA and alert changes are stored in browser `localStorage`, so the demo survives page refreshes.
