# Shorts

- Candidate: `text_visual/cand-001`, 0.00–55.14 s (the full clip), delivery `horizontal_and_vertical`.
- Decision mode: agent, delegated by the user (approved plan + "cook").
- Status: planning done; awaiting the main render, then horizontal extraction and vertical crop planning.
- The final 9:16 video is rendered by Remotion (user requirement), not by this skill's `render_vertical.py --mode final`.
  This skill's vertical plan validation and preview are used to prove the crops.

## Results (2026-10-28)

- Main delivery rendered and verified (identity render, 0 contributions).
- Horizontal extraction ran after a user-approved one-line patch (see `../../SKILL-PATCHES.md`).
  **Check failed:** `tail_release_verified: false` — the last word ends 0.015 s before the source ends
  (minimum 0.25 s). The source cannot be extended without altering the voice.
- `vertical_plan.py`: **pass** (SCENE_CROP: 4 presenter crops 608x1080, 4 letterbox segments).
- `render_vertical.py --mode preview`: rendered, but **failed its own duration check** (55.255 s vs 55.155 s;
  tolerance 0.1 s), so no review page/receipt was produced. Preview frames were inspected manually:
  faces whole in every presenter crop, inserts whole.
- Vertical approval and `--mode final` not used: the final 9:16 video is rendered by Remotion.
