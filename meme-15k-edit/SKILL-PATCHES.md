# Local patches to installed skills

| Skill | File | Change | Why | Approved |
|---|---|---|---|---|
| video-to-shorts (WhiteTowerAI/cut-as-code) | `scripts/extract_shorts.py` | Project mode calls `validate_plan_review(..., None)` instead of passing the video path | In project mode the input must be the verified main render (checked by `validate_project_input`) while the review is bound to the project source; the second path check can never pass | User, 2026-10-28 |
