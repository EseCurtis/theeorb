# Product requirements — TheeOrb

## Product definition

**TheeOrb** is an adults-only dating and friendship matching platform. People train a private Orb to represent their values, personality, communication style, and relationship preferences. Orbs privately assess compatibility, recommend people to their owners, and never open a real conversation without mutual owner consent.

## Core loop

**Sign up → Build profile → Add four photos → Configure matching → Train Orb → Receive five daily picks → Mutual acceptance → Chat → Review Orb history**

The Orb is an owner-configured representative, not an autonomous social actor. It can evaluate a prospective connection, explain its recommendation, and remain fully private. It cannot message another person, reveal contact details, or make a match without the owner.

## Audience and scope

- Adults aged 18 or older, seeking dating, friendship, or both.
- A single mixed daily feed clearly labels every recommendation as **Dating** or **Friendship**.
- v1 supports text-only chat after both people accept a recommendation.
- Exact location, contact information, and raw Orb dialogue never appear in another person's profile or match history.

## Matching profile

Required before discovery:

- Date of birth and 18+ acknowledgement.
- Display name, gender identity, sexual orientation, matching intents, interested-in preferences, age range, city, private coordinates, and distance preference.
- Bio, profile prompts, and at least four photos (maximum six).
- Orb identity, values, interests, communication style, objectives, and matching boundaries.

Optional profile filters include lifestyle, languages, family plans, faith, education, work, smoking, drinking, and height. People can pause discovery, edit their profile, block, report, or unmatch at any time.

## Matching system

1. Deterministic safety and preference filters remove ineligible, blocked, incompatible, out-of-range, or incomplete profiles.
2. Eligible Orbs have a bounded private compatibility dialogue of no more than eight turns and may decide early.
3. Gemini evaluates the dialogue and produces only a structured compatibility outcome and owner-safe explanation. Raw dialogue is never persisted or shown.
4. At most five recommendations are delivered per owner each day and expire after seven days.
5. A match exists only after both owners accept. That creates one text-only conversation.

## Safety principles

- Double opt-in is required for every connection.
- All discovery and chat resources are owner-authorized.
- Report, block, unmatch, pause discovery, and account deletion are first-class controls.
- Matching explanations must be understandable and must not claim sentience, certainty, or hidden personal knowledge.
- The platform should not fabricate activity, popularity, compatibility scores, or social proof.

## Success signals

- A new member completes their profile, photo set, matching preferences, and Orb setup without ambiguity.
- A member understands why an Orb made a recommendation and can accept or pass deliberately.
- Both people can connect only after clear, mutual intent.
- Members can inspect an owner-safe Orb history without exposing private dialogue or precise personal data.
