# QuerySage: AI SQL Performance Agent

QuerySage is a client-side web application built with Nuxt.js that helps developers analyze, audit, and optimize SQL queries and execution plans for PostgreSQL, MySQL, Microsoft SQL Server, SQLite, and Oracle.

It includes an offline heuristics engine for instant query auditing, an execution plan visualizer, and optional AI integrations (Gemini and OpenAI) for deep performance analysis and query refactoring.

## Core Architecture

QuerySage is designed as a lightweight, zero-overhead client-side tool:

1. Nuxt.js Single Page Application (SPA) Mode
   - Built using Vue 3 and Vite, running entirely in client-side SPA mode (ssr: false).
   - Ensures zero server-side compilation or network latency during user interactions.

2. Monaco Editor Integration
   - Replaces standard input textareas with native Monaco Editor instances loaded dynamically from CDN.
   - Provides a VSCode-like editor environment with full SQL syntax highlighting, line numbers, automatic bracket matching, and smooth scrolling.
   - Outputs are rendered in read-only Monaco Editor instances for side-by-side SQL diff comparisons.

3. Offline Heuristic Audit Engine
   - Performs regex-based static query analysis on the client side.
   - Detects common anti-patterns such as:
     - Unindexed join keys.
     - Wildcard leading LIKE filters (e.g. LIKE '%keyword').
     - Function wraps on filtered columns (e.g. LOWER(col)).
     - Implicit Cartesian Joins (ANSI-89 comma joins).
     - Oversized pagination offsets.
     - Redundant DISTINCT flags.
   - Evaluates a heuristic performance score (1 to 10) and estimates latency impact under small, medium, and large data scales.

4. Execution Plan Tree Visualizer
   - Parses PG (PostgreSQL) text explain formats and MySQL tabular explain layouts into a hierarchical tree node structure.
   - Identifies high-cost operations (e.g. Seq Scan, Temp tables) and highlights them in the tree view.

5. AI Performance Agent Connectors
   - Connects directly to Gemini (Google) and OpenAI APIs via secure client-side API Keys.
   - Generates structured audit prompts containing the target SQL query and execution plan, outputting markdown reports that are split and bound to interactive tabs.

## Features

- IDE Theme: A dark user interface designed after the classic VSCode Dark+ theme.
- Responsive Design: Custom media breakpoints optimizing the workspace layout for dual-pane desktop viewports (100vh locked height) and vertical stacking for tablet/mobile scroll viewports.
- Collapsible AI Settings: Hides credential keys and model options in a details drawer to reduce clutter.
- Instantly Loadable Samples: Provides PostgreSQL, MySQL, and SQLite sample sets to immediately demonstrate optimization rules.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fa33az/querysage.git
   cd querysage
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To run the development server locally:
```bash
npm run dev
```

Open http://localhost:3000 in your browser to view the application.

### Production Build

To compile and build a production-ready package:
```bash
npm run build
```

To preview the built production package:
```bash
npm run preview
```

## How to Use

1. Select your target Database Engine from the dropdown list.
2. Enter your SQL query in the left editor panel.
3. (Optional) Paste your query execution plan (EXPLAIN or EXPLAIN ANALYZE output) in the bottom-left panel.
4. (Optional) Open the AI API Configurations drawer in the sidebar, input your Gemini or OpenAI API Key, and select your model. If left empty, QuerySage runs in Heuristic Offline mode.
5. Click the "Analyze Query" button.
6. Explore the results through the output tabs:
   - Overview: Performance scores, estimated latencies under load, and structural summary.
   - Issues: List of performance issues, explanations of why they occur, and severe rankings.
   - Plan: Visual tree diagram representing the cost hierarchy of your database plan.
   - Index: Custom SQL scripts to create suggested indexes, with positive and negative storage warnings.
   - Optimized: Side-by-side visual diff showing the original SQL query compared to the optimized refactored version.
