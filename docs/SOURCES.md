# Sources

Every external source this methodology draws on, with the specific claim it supports. Ordered roughly by how much weight the method puts on it.

## Primary

**Anthropic, *Best practices for Claude Code***
<https://code.claude.com/docs/en/best-practices>
Supports the central argument of the method: an agent without a check it can run itself stops when work "looks done," which makes the human the verification loop. Also the source for the escalation ladder (in-prompt instruction, goal condition, Stop hook), the "interview me" spec-generation prompt, the fresh-context reviewer prompt and the warning attached to it, the rule that letting an agent code before planning produces code that solves the wrong problem, the roughly 200-line target for an always-loaded constitution with the "would removing this cause a mistake?" test, and the instruction to skip the plan when the diff fits in one sentence.

**Anthropic, *Effective context engineering for AI agents***
<https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents>
Supports the underlying constraint from which every other practice is derived: the context window fills fast and performance degrades as it fills. This is why constitutions are short, sessions are cleared between unrelated tasks, and specs are per-feature rather than one growing document.

**GitHub, *Spec Kit***
<https://github.com/github/spec-kit>
Supports the five-artifact chain (constitution, spec, plan, tasks, implement), the `specs/<feature-id>/` folder-per-feature layout, the use of EARS-format acceptance criteria, and the `[P]` marker for tasks that can run in parallel.

**GitHub Blog, *Spec-driven development with AI: get started with a new open source toolkit***
<https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/>
The narrative introduction to Spec Kit. Supports the framing of spec-driven development as a named, adoptable practice rather than an individual habit.

**AWS, *Kiro Specs***
<https://kiro.dev/docs/specs/>
Supports the requirements/design/tasks decomposition, the use of EARS (`WHEN ... SHALL ...`) as the acceptance-criteria format, and the dependency-graph approach to running independent tasks in waves.

**Harper Reed, *My LLM codegen workflow atm***
<https://harper.blog/2025/02/16/my-llm-codegen-workflow-atm/>
Supports the one-question-at-a-time interview technique for spec generation, and the task-decomposition rules: break work into small iterative chunks, no orphaned code, every prompt must integrate into previous work, and track progress aggressively against documentation to prevent accumulating uncompleted dependencies.

**Simon Willison, notes on Harper Reed's workflow**
<https://simonwillison.net/2025/Feb/21/my-llm-codegen-workflow-atm/>
Independent corroboration that the spec-then-plan-then-todo chain was reproducible by other practitioners before it had a name.

## Supporting research

**Red Hat, *Eval-driven development: build and evaluate reliable AI agents***
<https://developers.redhat.com/articles/2026/03/23/eval-driven-development-build-evaluate-ai-agents>
Supports the claim that quantifiable acceptance criteria turned into executable checks are the mechanism by which an agent iterates to correctness without supervision.

**Red Hat, *The uncomfortable truth about vibe coding***
<https://developers.redhat.com/articles/2026/02/17/uncomfortable-truth-about-vibe-coding>
Supports the rigor spectrum: why unstructured prompting is acceptable for throwaway work and fails on anything that will be maintained.

**Augment Code, *Vibe Coding vs Spec-Driven Development (2026)***
<https://www.augmentcode.com/guides/vibe-coding-vs-spec-driven-development>
Source for Karpathy's original scoping of vibe coding to throwaway weekend projects, and for his later description of the shift to "the age of agentic engineering," meaning agents orchestrated against detailed specifications with human oversight.

**Towards Data Science, *From Vibe Coding to Spec-Driven Development***
<https://towardsdatascience.com/from-vibe-coding-to-spec-driven-development/>
Supports the documentation-drift failure mode: updating code is easier than updating the spec first, so code, spec, and mental model diverge over time.

**Fireworks, *Test-Driven Agent Development with Eval Protocol***
<https://fireworks.ai/blog/test-driven-agent-development>
Supports the red-then-green implementation loop as applied to agents specifically, where the failing test is the agent's self-verification signal rather than a human's checklist item.

**TDAD: Test-Driven Agentic Development (arXiv)**
<https://arxiv.org/html/2603.17973v1>
Academic treatment of the same loop. Supports the claim that the acceptance-criterion-to-test mapping is what makes agentic implementation measurable rather than impressionistic.
