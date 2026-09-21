# Contributing Guide

Thank you for taking the time to contribute to Joyory AI LookMatch! This guide covers the workflow, code standards, and review process.

---

## Getting Started

Before contributing, please:

1. Read the [Setup Guide](SETUP_GUIDE.md) to get the project running locally.
2. Read the [API Reference](API_REFERENCE.md) and [Frontend Architecture](FRONTEND_ARCHITECTURE.md) to understand the codebase.
3. Check the open issues / discussions to avoid duplicate work.

---

## Branching Strategy

We use a simple trunk-based branching model:

| Branch | Purpose |
|---|---|
| `main` | Production-ready code. Direct commits are not allowed. |
| `feat/<short-description>` | New features (e.g., `feat/add-filters`) |
| `fix/<short-description>` | Bug fixes (e.g., `fix/image-upload-validation`) |
| `docs/<short-description>` | Documentation only (e.g., `docs/api-reference`) |
| `chore/<short-description>` | Tooling, dependencies, CI (e.g., `chore/update-deps`) |

### Example

```bash
git checkout main
git pull origin main
git checkout -b feat/voice-language-selector
```

---

## Development Workflow

### 1. Make Your Changes

- Follow the code style guidelines below.
- Keep changes focused — one feature or fix per branch/PR.
- Do not commit unrelated changes (formatting fixes, dependency bumps) alongside functional changes.

### 2. Test Your Changes

**Backend**
```bash
cd backend
source venv/bin/activate   # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload
```
- Manually test the affected endpoints via Swagger UI (`http://localhost:8000/docs`) or curl.
- Verify the Pydantic schema still validates correctly for edge cases (nulls, empty arrays).

**Frontend**
```bash
cd frontend
npm run dev
```
- Test in Chrome (required for voice features).
- Verify the AI LookMatch page works end-to-end with both text and image inputs.
- Check responsive layout at mobile (375px), tablet (768px), and desktop (1280px) widths.

### 3. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <short summary>

[optional body]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
```
feat(ai): add budget filter to lookmatch-text endpoint
fix(frontend): prevent multiple voice recognition instances
docs(api): document MatchResult.unmatched field
chore(deps): upgrade google-genai to 0.8.0
```

---

## Code Style

### Python (Backend)

- Follow **PEP 8** conventions.
- Use **type hints** on all function signatures.
- Use Pydantic models for all request and response bodies — do not use raw dicts.
- Log exceptions with `logger.error(msg, exc_info=True)` before raising `HTTPException`.
- Keep business logic in `services/`, not in route handlers (`api/`).

```python
# Good
@router.post("/my-endpoint", response_model=MyResponse)
def my_endpoint(request: MyRequest) -> MyResponse:
    try:
        result = my_service.process(request)
        return MyResponse(data=result)
    except ValueError as e:
        logger.error(f"Validation error: {e}", exc_info=True)
        raise HTTPException(status_code=400, detail=str(e))
```

### TypeScript (Frontend)

- Use **named exports** for components (not default exports, except for page components).
- Define prop types as inline `type Props = {...}` adjacent to the component.
- Use `const` arrow functions for event handlers within components.
- Do not use `any` — define proper types in `src/types/`.
- All API calls go in the component or a dedicated service file — not in utility functions.

```typescript
// Good
type Props = {
  product: Product
  onAddToCart: (id: number) => void
}

export function ProductCard({ product, onAddToCart }: Props) {
  ...
}
```

### CSS / Tailwind

- Use Tailwind utility classes exclusively — no inline `style={{}}` unless absolutely necessary.
- Follow the project color tokens (see [Frontend Architecture](FRONTEND_ARCHITECTURE.md#styling)).
- All interactive elements must have `:hover` and `:focus` states.
- Ensure WCAG AA color contrast on all text.

---

## Pull Request Process

1. **Create a PR** from your feature branch to `main`.
2. **Fill in the PR template** (if provided) with:
   - A clear description of what changed and why
   - Screenshots / recordings for UI changes
   - Steps to test the change
3. **Self-review** your diff before requesting review — check for debug logs, commented-out code, or accidental file changes.
4. **Request review** from at least one other contributor.
5. A PR is merged only when it has **at least 1 approval** and all CI checks pass.

### PR Checklist

- [ ] Code follows the style guidelines above
- [ ] No secrets or API keys committed
- [ ] All affected endpoints manually tested
- [ ] UI changes tested at mobile, tablet, and desktop widths
- [ ] Relevant documentation updated (API_REFERENCE.md, FRONTEND_ARCHITECTURE.md, etc.)
- [ ] Commit messages follow Conventional Commits format

---

## Security

- **Never commit API keys, tokens, or secrets** to the repository.
- All secrets must be stored in `backend/.env` (which is `.gitignore`d).
- If you accidentally expose a secret, rotate it immediately and remove it from git history.
- Do not disable CORS, authentication, or validation controls to work around errors — fix the root cause.

---

## Reporting Bugs

Open an issue with:

1. **Steps to reproduce** the bug (numbered list)
2. **Expected behavior** — what should have happened
3. **Actual behavior** — what actually happened
4. **Environment**: OS, browser, Python version, Node.js version
5. **Relevant logs or screenshots**

---

## Suggesting Features

Open a discussion or issue with:

1. **Problem statement** — what user need does this address?
2. **Proposed solution** — high-level description of the feature
3. **Alternatives considered** — any other approaches you evaluated
4. **Scope** — is this a backend change, frontend change, or both?

---

## Questions?

Open a GitHub Discussion or reach out to the maintainers directly.
