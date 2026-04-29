---
description: Onboard a provider namespace to the C# schema generator
---

# Onboard to C# Generation

You are onboarding an Azure resource provider to the C# schema generator pipeline.

## Context

This repo has two schema generation pipelines:

- **AutoRest generator** (legacy): Runs AutoRest against Swagger specs to produce JSON schemas. Configured via `autoGenList` in `generator/autogenlist.ts`.
- **C# generator** (preferred): Reads pre-built Bicep types from `bicep-types-az/generated/` and converts them to ARM JSON schemas using `src/TemplateSchemaGenerator`. Configured via `csharpGeneratorProviders` in `generator/autogenlist.ts`.

When a provider is enabled for C# generation, the pipeline **skips** it in the AutoRest path and **includes** it in the C# generator path.

## Steps

### 1. Get the provider namespace

If the user hasn't provided you one, prompt them to enter one. You can provide suggestions from the `csharpGeneratorProviders` array in `generator/autogenlist.ts`.

The provider namespace should be of format `<Prefix>.<Suffix>` - e.g. `Microsoft.Compute`.

### 2. Enable the provider

In `generator/autogenlist.ts`, find the `csharpGeneratorProviders` array. Either:

- **Existing entry**: Change `enabled: false` to `enabled: true` for the target namespace.
- **New entry**: Add `{ namespace: '<ProviderNamespace>', enabled: true }` in alphabetical order.

The `csharpGeneratorEnabledProviders` export is derived automatically:
```ts
export const csharpGeneratorEnabledProviders = csharpGeneratorProviders.filter(p => p.enabled).map(x => x.namespace);
```

### 3. Run generation

Run the following script to trigger generation:
```sh
scripts/GenerateCsharp.ps1
```

### 4. Verify output

Run the .NET Tests and verify there are no errors:

```sh
dotnet test
```

If any errors come up, attempt to fix them. If the fix is unclear, prompt the user for how to proceed.

### 5. Create a PR

Create a new branch titled `csharp/<namespace>` and open a pull request with title `Onboard <namespace> for C# generation`

## Important notes

- Each PR should only change **one** provider's `enabled` flag to avoid merge conflicts between concurrent PRs. The `csharpGeneratorProviders` array uses one entry per line specifically to minimize conflicts.
- The `disabledProviders` and `autoGenList` entries for the provider should remain unchanged — the C# path bypasses AutoRest entirely.