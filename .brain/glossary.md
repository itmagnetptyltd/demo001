# Glossary

Terms are **fixed** on this project. Use these words, spelled this way, and no
synonyms — in requirements, in code, in tests, in conversation with the client.

A term used in a requirement but not defined here is an **ambiguity**, not a
decision anyone may make on the client's behalf. Record it and ask.

---

## Why this file exists

A client described one thing three ways in a single meeting:

> "When a **job** comes in we assign it to a crew."
> "Each **engagement** has a start date and a purchase order."
> "The customer can cancel a **booking** up to 24 hours before."

Three words. The team built:

- a `Job` table for scheduling,
- an `Engagement` record for billing, because it "obviously" carried the PO,
- a `Booking` API for the customer-facing app.

They were the same entity. It was discovered in UAT, when cancelling a booking
left the job scheduled and the engagement billable. The fix touched three
schemas, two APIs and a migration — about three weeks — and none of it was
visible as a defect until real users produced all three views of one record.

**The cost was not the rework. It was that nobody could see it coming**, because
each team was individually consistent and the disagreement lived in the gaps
between them.

Pinning one word at discovery would have cost five minutes.

---

## How to write an entry

**Term** — what it means here, in one sentence. Then, where it matters:
- **Not to be confused with:** the near-synonym people reach for, and how it differs
- **Also called:** what the client says, when it differs from the agreed term
- **Identified by:** what makes two of these the same one

Define the term the *client's business* uses, not the one the database uses. If
they diverge, that divergence is itself worth writing down.

---

## Agreed terms

**Number** — a whole number of zero or more (0, 1, 2, …), as typed into a text
box. Never negative, never a decimal.
- **Also called:** the client says "number" and "whole number". Both mean Number.

**Answer** — the result shown in the answer label after an operation button is
pressed: the sum (Add), the first Number minus the second (Subtract), the
product (Multiply), or the first Number divided by the second, rounded to 2
decimal places with no trailing zeros, e.g. "3.5", "0.69", "3" (Divide). Unlike
a Number, an Answer can be negative (CHG-0002) and can be a decimal (CHG-0007).
Dividing by 0 has no Answer; the answer label shows "Oops! You can't divide by
zero" instead (CHG-0008).
- **Also called:** the client says "answer", "addition", "substraction",
  "multiply", "Division" and "the real result".

**Calculator** — the single page holding two text boxes, four operation buttons
(Add, Subtract, Multiply, Divide), a close button and one answer label
(CHG-0002, CHG-0003, CHG-0004, CHG-0005). There is no other page.

**Close button** — the x in the top right corner of the Calculator's card. It
asks the browser to close the tab; when the browser refuses, nothing changes. It
does not clear anything (CHG-0006, replacing CHG-0003's "clears").
- **Also called:** the client says "CLOSE (x)".

---

## Appears in source documents, not yet defined

List terms the client has used without settling what they mean. Being listed here
makes clear their absence is known, not overlooked. Each one should have a
matching question in `requirements/AMBIGUITIES.md`.

- _(none yet)_
