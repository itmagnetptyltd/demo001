# Rounding the Divide Answer by shifting with "e2" / "e-2"

- **Tried:** 2026-10-08 (planned for REQ-DEMO-007@v2, dropped before release)
- **By:** Claude, in the build session with Kartik Chandra Biswas
- **Related:** REQ-DEMO-007@v2, CHG-0007, src/calculator.js `divideNumbers`

## What was tried

Rounding the quotient to 2 decimal places by writing it with an exponent:
`Number(Math.round(Number(`${quotient}e2`)) + "e-2")`. This is the usual fix for
the plainer `Math.round(quotient * 100) / 100`, which rounds some exact halves
the wrong way.

## Why it was abandoned

It breaks on any quotient that JavaScript already prints in exponent form.
`String(1 / 10000000)` is `"1e-7"`, so the code builds `"1e-7e2"`, and
`Number("1e-7e2")` is `NaN`. Measured in Node 20.17.0 on 2026-10-08:
`Math.round(Number(1/10000000 + "e2"))` → `NaN`. Both Numbers are valid input,
so the answer label would show "NaN".

The plain `Math.round(q * 100) / 100` was also rejected: `Math.round(1.005 * 100) / 100`
is `1`, not `1.01`, because 1.005 is stored as slightly less than 1.005.

What shipped instead: `Math.round((quotient + Number.EPSILON) * 100) / 100`, which
gives `1.01` for 1.005 and has no string round-trip.

## What would have to change for this to become viable

Only if quotients could never print in exponent form, for example if both
Numbers were capped so the smallest possible quotient stays above 1e-6. Nothing
caps them today (REQ-DEMO-003 allows any whole Number of zero or more).
