# AiDLC vs SDLC: Enterprise Knowledge, Architecture & Decision Portal

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B-brightgreen)](https://nodejs.org/)
[![Tests Passing](https://img.shields.io/badge/Tests-25%20Passing-emerald)](tests/)
[![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel%20Ready-black)](https://vercel.com/)
[![Governance](https://img.shields.io/badge/Governance-ISO%2042001%20%7C%20NIST%20AI%20RMF-purple)](docs/)

An authoritative, production-grade enterprise knowledge base and interactive decision platform comparing the **Artificial Intelligence Development Life Cycle (AiDLC)** versus the traditional **Software Development Life Cycle (SDLC)**.

Designed for Chief Technology Officers, Principal Solutions Architects, Engineering Directors, DevSecOps Leads, and Product Strategists navigating the paradigm shift from deterministic code to probabilistic neural systems.

---

## 🚀 Live Demo & One-Click Deploy to Vercel

Deploy your own instance of the portal to Vercel in seconds:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsantoshadkar%2Fadlc_vs_sdlc_web_portal)

### Manual Vercel Deployment via CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## 🌟 Key Architecture Modules & Capabilities

### 1. 12 Core Paradigm Dimensions (Deep-Dive & Table Modes)
- Explores foundational architectural differences across Logic, Artifacts, QA/Evals, Debugging, Deployment, Observability, Failure Modes, Iteration Cycles, Engineering Roles, Hardware/Compute, Cybersecurity, and Regulatory Governance.
- Dual-view toggle (Interactive Deep-Dive Cards vs Compact Comparison Table) with Dissection Modals.

### 2. Architectural Figures & Visual Blueprint Studio
- **7 High-Definition Vector Flow Blueprints**:
  1. *The Macro Paradigm Shift*: Deductive CPU execution vs Inductive Probabilistic Matrix inference.
  2. *7-Phase Dual Lifecycle Pipeline*: Waterfall/Agile sprint flow vs Continuous Evaluation flywheels.
  3. *The Deterministic Sandwich Pattern*: Layer 1 Pre-Flight SDLC Gate -> Layer 2 AI Reasoning -> Layer 3 Post-Flight Schema Assertions.
  4. *Dual-Loop Agile Governance Engine*: Outer 2-week SDLC release loop governing inner daily AiDLC eval iterations.
  5. *5-Layer Defense-in-Depth Guardrails Stack*: Input, Retrieval (RAG), Model Decoding, Output, and Operational layers.
  6. *Enterprise AI Threat Defense & OWASP Attack Map*: Intercepts LLM01 Prompt Injections, LLM04 Poisoning, and LLM06 Excessive Agency.
  7. *Active Learning & Continuous Retraining Flywheel*: Telemetry -> Shadow Clustering -> HITL SME -> DSPy / LoRA -> Eval Gate -> Canary.

### 3. Enterprise FinOps TCO & Latency Simulator
- Real-time simulation of operational cost, latency P95, unit cost per 1,000 queries, and carbon emissions across:
  - **Pure SDLC** (Microservices / Serverless)
  - **Pure AiDLC** (Direct Frontier LLM REST APIs)
  - **Compound AI** (Semantic Vector Caching + SLM Triage + Guardrails - saves up to **91%**)
  - **Self-Hosted Private GPU Clusters** (Calculates required 8x H100 GPU nodes)

### 4. CAB Production Go/No-Go Readiness Audit Gate
- 15 Enterprise compliance gates based on ISO 42001, NIST AI RMF, and SAFe Release Train standards.
- Interactive checklist calculating real-time **CAB Readiness Score (%)** and status (`CAB APPROVED`, `CONDITIONAL`, `REJECTED`).
- One-click export to official Markdown / printable audit certificates.

### 5. Production Code Starter Toolkit & Cheat Sheets
- Vetted production boilerplates ready for copy-pasting:
  - **TypeScript Sandwich Wrapper**: Express + Zod + OpenAI structured tool calls + PII redaction.
  - **Python Sandwich Wrapper**: FastAPI + Pydantic V2 + Instructor + ACID rollback boundaries.
  - **CI/CD Eval Gate Action**: `.github/workflows/eval-gate.yml` blocking PRs if Faithfulness drops below 96%.
  - **Declarative Guardrails Config**: `guardrails.config.json` defining token clamps, topical boundaries, and canary traps.

### 6. Global Spotlight Quick Search (`Ctrl+K`) & URL Deep-Linking
- Fast index search across all dimensions, blueprints, guardrails, governance frameworks, case studies, and code snippets.
- Full URL hash routing (`#finops`, `#readiness`, `#toolkit`, `#diagrams`, `#guardrails`, `#casestudies`).

### 7. 12 Cross-Domain Enterprise Case Studies
- In-depth, real-world case studies with interactive domain filtering:
  - **Fintech**: High-Frequency Transaction Fraud Detection vs Core Banking Ledger
  - **Healthcare**: Clinical Diagnostic NLP vs Radiation Oncology Dose Engine
  - **Aerospace**: Autonomous Flight Envelope Guidance vs DO-178C Fly-By-Wire Actuators
  - **Automotive**: Autonomous Perception & Trajectory Planning vs Brake-by-Wire ABS ECU
  - **Telecom**: Real-Time Call Routing vs Self-Healing Fiber Network Orchestration
  - **Insurance**: Actuarial Mortality Underwriting vs Automated Catastrophe Claim Processing
  - **Logistics**: Real-Time Fleet Dispatch Optimization vs WMS Inventory Barcode Ledger
  - **Energy**: Substation Electrical Fault Trip vs Renewable Demand Forecasting
  - **Legal**: M&A Due Diligence Extraction vs Tamper-Proof Litigation Audit Hold
  - **Human Resources**: Fair Hiring Resume Screening vs Multi-State Payroll & Tax Calculation
  - **Public Sector**: Multilingual Citizen Assistant vs Statutory Benefit Calculation Engine

---

## 🛠️ Technology Stack & Engineering Standards

- **Runtime & Backend**: Node.js (v18+), Express.js (Modular clean architecture).
- **Frontend**: Modern Vanilla JS (zero bundler bloat, ultra-fast load times), Tailwind CSS, Lucide Icons, Chart.js.
- **Serverless & Cloud**: Native Vercel Serverless Functions (`api/index.js` + `vercel.json`).
- **Testing**: Native Node.js Test Runner (`node:test`, `node:assert/strict`) — **25/25 tests passing in < 700ms**.
- **Standards Compliance**: Zero hardcoded secrets (`.env` powered), SAFe Agile Governance, ISO 42001, and NIST AI RMF.

---

## 💻 Local Development Setup

### 1. Clone & Install
```bash
git clone https://github.com/santoshadkar/adlc_vs_sdlc_web_portal.git
cd adlc_vs_sdlc_web_portal
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

### 3. Run Automated Test Suite
```bash
npm test
```
*Executes all 25 unit and integration tests across API routes, assessment engines, and FinOps calculators.*

### 4. Start Local Development Server
```bash
npm run dev
# Server listening on http://localhost:3000
```

---

## 📚 REST API Specifications

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck and uptime monitor |
| `GET` | `/api/overview` | 12 Core Paradigm Dimensions with deep-dive technical mechanics |
| `GET` | `/api/phases` | 7 Lifecycle Phases with Security & Compliance Gates |
| `GET` | `/api/advantages` | Comparative Pros, Cons, and TCO trade-offs |
| `GET` | `/api/matrix` | Cross-domain recommendation matrix |
| `GET` | `/api/hybrid-patterns` | Compound AI architectural patterns (Deterministic Sandwich) |
| `GET` | `/api/guardrails` | 5-Layer Defense-in-Depth Guardrail taxonomy |
| `GET` | `/api/governance` | ISO 42001, NIST AI RMF, and EU AI Act specifications |
| `GET` | `/api/security` | AppSec vs AI Sec and OWASP LLM Top 10 threat matrices |
| `GET` | `/api/case-studies` | 12 Comprehensive cross-domain case studies |
| `GET` | `/api/diagrams` | 7 High-Definition architectural vector blueprints |
| `POST` | `/api/assess` | Algorithmic project fit assessment engine |
| `POST` | `/api/finops` | Real-time TCO, unit economics ($/1k), and latency simulator |
| `GET` | `/api/toolkit` | Production code templates (TypeScript, Python, CI/CD YAML) |
| `GET` | `/api/readiness-checklist` | 15 Enterprise CAB Go/No-Go audit criteria |
| `POST` | `/api/readiness-audit` | Evaluates submitted checklist and returns official CAB score |

Full OpenAPI specification available at [`docs/api_spec.json`](docs/api_spec.json).

---

## 📄 License & Governance
Distributed under the **MIT License**. Created for enterprise engineering teams adhering to modern AI safety and deterministic system boundaries.
