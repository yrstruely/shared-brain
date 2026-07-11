# Project Types Registry

> All supported project types in the framework.

---

## Supported Types

| Type | Stack | Status |
|------|-------|--------|
| [[.framework/templates/project-types/nestjs-vue\|nestjs-vue]] | NestJS (CQRS) + Nuxt 4 + PostgreSQL | ✅ Active |

---

## Planned Types

| Type | Stack | Status |
|------|-------|--------|
| django-react | Django + React + PostgreSQL | ⏳ Planned |
| go-vue | Go + Vue + PostgreSQL | ⏳ Planned |
| flutter-firebase | Flutter + Firebase | ⏳ Planned |

---

## Adding a Project Type

1. Create `.framework/templates/project-types/{type}.md`
2. Create `.framework/templates/okf-bundle/{type}/` with OKF template
3. Add to this registry
4. Update [[CLAUDE.md]]

---

## Project Type Selection

```bash
/framework:init-project --name <name> --type <type>
```

Available types: `nestjs-vue`
