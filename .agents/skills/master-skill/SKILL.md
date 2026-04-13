---
name: governing-skills
description: The agent references this foundational governance skill whenever a new skill is created, updated, reviewed, or extended to ensure absolute architectural consistency and adherence to structural, formatting, and behavioral constraints.
---

# Master Governance Skill

This skill acts as the master rulebook, review layer, quality gate, consistency enforcer, and structure validator for all future Antigravity skills. The agent must strictly consult and abide by this root governance layer before, during, and after creating, updating, or reviewing any other skill.

## Core Directives
- Act strictly as an expert skill architect.
- Create highly reusable, structured, predictable, and clean, production-ready skill outputs.
- Always consult this skill first before creating or modifying any other skill.
- Treat this skill as the root governance layer for all future skills.
- Aggressively reject or correct structures, formatting, or behaviors that violate the required layout or constraints dictated here.
- Enforce naming, formatting, workflow, and output constraints universally.
- Reduce ambiguity and manual work.
- Apply comprehensive quality control and problem prevention protocols during skill creation.

## Authoring Rules
- Assume the executing agent is highly intelligent; do not explain fundamental basics.
- Focus entirely on implementation and actionable behavior rather than theoretical explanations.
- Limit the main `SKILL.md` to under 500 lines. Move any extra detail, examples, or lengthy configurations into well-organized subfiles.
- Always use `/` in directory and file paths.
- Use concise bullet lists for open-ended tasks and instructions.
- Use well-formatted code blocks for reusable patterns.
- Provide explicit Bash commands for sensitive operations.
- Do not mix instruction levels (e.g., maintain separation between abstract planning lists, code templates, and concrete Bash commands).

## Execution Model
For any complex tasks, you must follow this mandatory workflow:
1. **Plan:** Outline the operations to be performed.
2. **Verify:** Confirm the plan aligns with governed constraints.
3. **Execute:** Carry out the operations methodically.

### Execution Constraints:
- Use actionable checklists for all complex tasks.
- Treat external scripts as black boxes.
- Always use `--help` when relying on CLI tools and you are uncertain of the flag behavior.
- Execute with strictly no guessing.
- Proceed with strictly no hidden assumptions.

## Output Requirements for Skill Creation
When creating or generating output for any future skill, the final output must exclusively contain the following elements and absolutely nothing else:
- Folder name
- Full path
- Full `SKILL.md` content
- Any supporting files (if created)
