---
name: handling-errors
description: The agent references this skill when diagnosing application issues, implementing robust error handling strategies, and ensuring resilient failure recovery to fix bugs gracefully.
---

# Error Handling Patterns

This skill provides actionable strategies and implementation patterns to build resilient applications, diagnose execution failures, and implement proper error handling.

## When to Use This Skill
- Implementing error handling in new features
- Designing error-resilient APIs
- Debugging production issues
- Improving application reliability
- Creating better error messages for users and developers
- Implementing retry and circuit breaker patterns
- Handling async/concurrent errors
- Building fault-tolerant distributed systems

## Core Concepts

### 1. Error Handling Philosophies
- **Exceptions vs Result Types:**
  - Exceptions: Unexpected errors, exceptional conditions. Disrupts control flow.
  - Result Types: Expected errors, validation failures. Explicit functional approach.
- **Error Categories:**
  - Recoverable Errors: Network timeouts, missing files, invalid user input.
  - Unrecoverable Errors: Out of memory, stack overflow, programming bugs.

## Language-Specific Implementation Patterns
Reference the specific example files in the `examples/` directory for implementation patterns in various languages:
- **Python:** `/Users/adelalwakeel/Desktop/dayzo/.agents/skills/handling-errors/examples/python_patterns.py` Use for Custom Exception Hierarchy, Context Managers, and Retry Decorators.
- **TypeScript/JavaScript:** `/Users/adelalwakeel/Desktop/dayzo/.agents/skills/handling-errors/examples/typescript_patterns.ts` Use for Custom Error Classes, Result Type Pattern, and Async Error Handling.
- **Rust:** `/Users/adelalwakeel/Desktop/dayzo/.agents/skills/handling-errors/examples/rust_patterns.rs` Use for Result/Option Types and Custom Errors.
- **Go:** `/Users/adelalwakeel/Desktop/dayzo/.agents/skills/handling-errors/examples/go_patterns.go` Use for Explicit Error Returns, Sentinel Errors, and Error Wrapping.
- **Universal Patterns:** `/Users/adelalwakeel/Desktop/dayzo/.agents/skills/handling-errors/examples/universal_patterns.md` Use for architectural patterns like Circuit Breaker, Error Aggregation, and Graceful Degradation.

## Best Practices
- **Fail Fast:** Validate input early, fail quickly.
- **Preserve Context:** Include stack traces, metadata, timestamps.
- **Meaningful Messages:** Explain what happened and how to fix it.
- **Log Appropriately:** Error = log, expected failure = don't spam logs.
- **Handle at Right Level:** Catch where you can meaningfully handle.
- **Clean Up Resources:** Use try-finally, context managers, defer.
- **Don't Swallow Errors:** Log or re-throw, don't silently ignore.
- **Type-Safe Errors:** Use typed errors when possible.

## Common Pitfalls to Avoid
- **Catching Too Broadly:** `except Exception` hides actual bugs.
- **Empty Catch Blocks:** Silently swallowing errors leaves the system in an unknown state.
- **Logging and Re-throwing:** Creates duplicate log entries and noise.
- **Not Cleaning Up:** Forgetting to close files or connections leads to resource leaks.
- **Poor Error Messages:** Generic messages like "Error occurred" provide no debugging context.
- **Ignoring Async Errors:** Unhandled promise rejections can crash Node.js or hide async execution failures.
