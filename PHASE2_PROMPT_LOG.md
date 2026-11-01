# Phase 2 prompt log

Tool: Claude (Anthropic), via Claude Code in VS Code.

This is the log for Phase 2 only. The original author's `prompt_log.md` is theirs and was not edited.

| # | My prompt (summarized) | What the AI did | What I checked, changed, or decided |
| --- | --- | --- | --- |
| 1 | "Based on this assignment criteria and this person's code, help me decide which features to try and implement first." | Read SPEC.md, README.md, phase2_goals.md and the code; suggested an order: playtest, spawn variety, saving, owl, day/night; skip storms and audio. | |
| 2 | "What does this mean: 'Next developer: start with human playtesting…'" | Explained that the author's bot tests can't check whether the game is readable or fun for a person. | |
| 3 | "I played it and it feels pretty straightforward, is that all or do I need to do/write something?" | Told me to record evidence for the four partially met criteria (AC-04, 06, 10, 19). | |
| 4 | "How to test AC-04 and AC-19?" (plus screenshots of resized windows) | Gave resize steps and a console snippet that throttles Chrome to ~30 FPS. | |
| 5 | "So fix it then?" (game pushed off-screen in short windows) | Added a CSS rule hiding the intro panel in short windows. | |
| 6 | "Now I don't see the left side at all." | Lowered the height cutoff from 760 px to 680 px. | |
| 7 | "I still don't know how to test AC-19" / "How do I measure how far it threw me?" | Step-by-step frame-rate test instructions. | |
| 8 | "Help me implement [spawn variety]." | Added cluster, stretch and zigzag formations inside the author's `extendFlock`; moved new-species intros away from other birds; added a test. | |
| 9 | "Did you retain 75% of the author's original code?" / "What exactly did you change?" / "Explain more." | Compared the diff with the original commit and explained the changes in plain language. | |
| 10 | "Help me create a README with all the stuff updated so far." | Wrote the Phase 2 section and the per-criterion acceptance report in README.md. | |
| 11 | "Help me implement [saving]." | Added `src/storage.js`, wired saving into `main.js`, and added tests. | |
| 12 | "Maybe I'll just add the owl and day/night." | Added the owl species and silhouette, the 60 s day/night cycle with night readability fixes, updated the tests for 5 species, and updated the README. | |
