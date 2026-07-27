# Product requirements — TheeOrb

## Product definition

**TheeOrb** is a private AI job-application copilot. A person stores a CV and career profile, pastes a job listing, reviews structured details extracted from it, creates a concise tailored cover letter, and explicitly sends the application from their own Gmail account.

The **Orb** is a private career copilot. It learns the member's approved professional voice, skills, evidence, and boundaries; it never invents a qualification, submits an application, or accesses a mailbox without the member's explicit consent.

## Core loop

**Set up career profile → Upload CV → Configure career Orb → Paste job listing → Review extraction → Draft letter → Review email → Send with Gmail → Track outcome**

## MVP goals

1. Let a member build and correct a structured career profile from an uploaded CV.
2. Extract a pasted job listing into role, company, location, work type, salary, requirements, skills, and application-email fields.
3. Make uncertainty visible and require the member to correct missing or ambiguous information.
4. Produce a concise 120–180 word cover letter grounded only in the member's approved profile and the reviewed listing.
5. Attach the member's original CV and send only after a deliberate final review through Gmail OAuth.
6. Retain drafts, sent applications, delivery failures, status, and notes in a private tracker.

## Safety and privacy

- Store CVs as private assets and reveal them only to their owner through time-limited access.
- Treat pasted listings as untrusted content. They cannot override system instructions, make the Orb send email, or access data outside the reviewed profile.
- Gmail access uses the minimum `gmail.send` scope. Refresh tokens are encrypted at rest.
- Sending always requires a final review of recipient, subject, body, and attachment. No automated or scheduled sends.
- Never fabricate job listings, salary, qualifications, work history, emails, application status, or social proof.

## Out of scope for MVP

- Automatic job search or scraping.
- Automatic submission without review.
- Multiple email providers, bulk outreach, scheduling, or email read access.
- Generated CV replacements or generated cover-letter PDF attachments.
