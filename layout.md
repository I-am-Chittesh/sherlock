## System Architecture & Tech Stack

**Project Name:** Sherlock

**Stack:** Vue (Frontend), Express.js (Backend), PostgreSQL (Database)

**Core Mechanic:** A digital evidence platform utilizing an Analysis of Competing Hypotheses (ACH) engine. Evidence verification dynamically alters the probability scores of linked case theories. The platform enforces strict role-based access (Investigator vs. Admin) and immutable audit logging.

## Database Schema Blueprint

* **Users:** `id`, `role` (Investigator/Admin).
* **Cases:** `id`, `title`, `description`, `status` (Open, Active, Review, Closed).
* **Evidence:** `id`, `case_id`, `name`, `status` (Pending, Verified, Debunked), `weight` (Integer 1-10 for scoring).
* **Evidence_Links:** `parent_evidence_id`, `child_evidence_id` (Establishes the node-graph relationships).
* **Hypotheses:** `id`, `case_id`, `theory_name`, `current_score` (Calculated dynamically).
* **Hypothesis_Evidence_Map:** `hypothesis_id`, `evidence_id` (Links specific evidence to support a specific theory).
* **Audit_Logs:** `timestamp`, `user_role`, `action_type`, `target_id` (Automatically generated via Express middleware for every mutation).

## Global UI & Navigation System

**Aesthetic:** Deep black backgrounds, dark-gray panels, stark white text. System alerts and "Debunked" nodes use an aggressive crimson red, while "Verified" nodes use sharp neon green.
**The Dynamic Taskbar:** A persistent, pill-shaped dock anchored at the bottom of the screen.

| Screen Context | Outer Edge Arrows | Center "+" Button Action | Visibility |
| --- | --- | --- | --- |
| **Console (Login)** | Hidden | Hidden | Hidden |
| **Home (Hub)** | Paginate through Case Cards | Opens "Create New Case" modal | Visible |
| **Pinboard (War Room)** | Instantly load Next/Prev Case | Drops new Evidence Node on canvas | Visible |
| **Admin Dashboard** | Hidden (Strictly read-only) | Hidden (Strictly read-only) | Visible |

## Screen-by-Screen Specifications

**1. The Console (Gateway)**

* A frictionless split-screen layout displaying "Sherlocked".
* Two massive hitboxes taking up the left and right halves: "Login as Investigator" and "Login as Admin". Bypasses standard auth for rapid demo access.

**2. Investigator Hub (Home)**

* **Top Bar:** A persistent global search input and status filter chips (Open, Active, Review, Closed).
* **Main View:** A Pinterest-style masonry grid of "Case Cards".
* **Interaction:** Clicking a card triggers a fast pop-up modal displaying case details rather than forcing a full page reload.

**3. The Pinboard (War Room - Case View)**

* **Left Hemisphere (Evidence Canvas):** Built utilizing the **Vue Flow** library to replicate an Obsidian-style node graph. Investigators drop evidence nodes onto a dark dot-grid canvas and drag visual edges (lines) to connect parent-child evidence. Toggling a node's status changes its border glow (Red/Green).
* **Right Hemisphere (Top - Theory Page):** The Hypothesis Engine. Displays visual progress bars for competing theories. As nodes on the left are marked "Verified," an Express backend formula recalculates the score based on the evidence `weight`, physically pushing the UI progress bars in real-time.
* **Right Hemisphere (Bottom):** A static quick-reference table listing case Suspects and their current tracking statuses to summarize the canvas chaos.

**4. Admin Dashboard (The Overseer)**

* **Right Column:** Three high-level KPI blocks (Total Cases, Total Evidence, Active Investigators).
* **Left Column:** An "Efficiency" metric panel tracking system usage.
* **Center Stage:** The immutable Audit Log. A massive, auto-scrolling terminal-style table pulling directly from the Express middleware, displaying every status change and node addition in real-time.