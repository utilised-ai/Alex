# Project Refactoring Plan: Math Adventures

## 1. Analysis of Current State

The project currently consists of two parallel web applications: "MathBlasters" (`math-fun/`) and "MathStars" (`math-fun-girls/`). While they target different audiences with distinct themes (action vs. magic), they share core functionalities and technologies (HTML, CSS, Vanilla JS).

**Key Issues:**

*   **High Code Duplication:** Significant overlap exists in game logic (JS), HTML structure, and base CSS rules across both versions.
*   **Maintainability Challenges:** Bug fixes, feature additions (e.g., user profiles), and updates require duplicated effort in both codebases.
*   **Scalability Issues:** Adding new themes would necessitate creating more full copies of the application.

## 2. Proposed Improvement Plan: Consolidation and Theming

The goal is to refactor the project by consolidating common code into a shared core and implementing a theming system to manage visual and textual variations.

**Plan Steps:**

1.  **Create a Shared Core:**
    *   Extract common JavaScript logic into a shared `js/core/` directory.
    *   Move common CSS rules (layout, base styles) into a shared `css/core.css`.
2.  **Develop a Theming System:**
    *   Use CSS Variables for theme-specific values (colors, fonts). Create theme files (`css/theme-blasters.css`, `css/theme-stars.css`).
    *   Standardize HTML structure for games/pages, handling text variations via JS or templating.
    *   Organize theme-specific assets (images) into theme directories (`assets/blasters/`, `assets/stars/`).
3.  **Refactor Existing Code:**
    *   Update HTML to use shared CSS classes and link appropriate stylesheets.
    *   Modify JS to use the shared core library and load theme-specific assets/text.
4.  **Update Root `index.html`:** Modify the landing page to load the selected theme dynamically instead of linking to separate sub-applications.

## 3. Proposed Structure (Mermaid Diagram)

```mermaid
graph TD
    subgraph Project Root
        direction LR
        RootIndex[index.html]
        SharedCSS[css/core.css]
        SharedJS[js/core/]
        Assets[assets/]
        GamesHTML[games/]
        GuidesHTML[guides/]
    end

    subgraph Themes
        direction TB
        ThemeBlasters[theme-blasters/]
        ThemeStars[theme-stars/]
    end

    subgraph Blasters Theme
        direction LR
        BlastersCSS[css/theme.css]
        BlastersImages[images/]
        BlastersConfig[config.json (Optional)]
    end

    subgraph Stars Theme
        direction LR
        StarsCSS[css/theme.css]
        StarsImages[images/]
        StarsConfig[config.json (Optional)]
    end

    RootIndex --> SharedCSS
    RootIndex --> SharedJS
    RootIndex --> GamesHTML
    RootIndex --> GuidesHTML

    GamesHTML --> SharedJS
    GuidesHTML --> SharedJS

    RootIndex -- Loads --> ThemeBlasters
    RootIndex -- Loads --> ThemeStars

    ThemeBlasters --> BlastersCSS
    ThemeBlasters --> BlastersImages
    ThemeBlasters --> BlastersConfig

    ThemeStars --> StarsCSS
    ThemeStars --> StarsImages
    ThemeStars --> StarsConfig

    SharedCSS -- Variables used by --> BlastersCSS
    SharedCSS -- Variables used by --> StarsCSS

    SharedJS -- Uses assets from --> BlastersImages
    SharedJS -- Uses assets from --> StarsImages
    SharedJS -- Uses config from --> BlastersConfig
    SharedJS -- Uses config from --> StarsConfig

    classDef default fill:#f9f,stroke:#333,stroke-width:2px;
    classDef shared fill:#ccf,stroke:#333,stroke-width:2px;
    classDef theme fill:#cfc,stroke:#333,stroke-width:2px;

    class RootIndex,GamesHTML,GuidesHTML default;
    class SharedCSS,SharedJS,Assets shared;
    class Themes,ThemeBlasters,ThemeStars,BlastersCSS,BlastersImages,BlastersConfig,StarsCSS,StarsImages,StarsConfig theme;
```

## 4. Benefits

*   **Reduced Duplication:** Single source for core logic and structure.
*   **Improved Maintainability:** Fix bugs and add features once.
*   **Easier Scalability:** Add new themes by creating theme-specific files.
*   **Consistency:** Ensures core mechanics are uniform across themes.