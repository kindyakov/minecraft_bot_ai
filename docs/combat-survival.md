# Combat and survival: behavior and verification

This is a public behavior overview and manual test checklist, not the agent architecture contract. Agent implementation guidance lives in `ARCHITECTURE.md`.

## Behavior

Critical health interrupts every active behavior except death/shutdown. The bot escapes using the nearest observed threat, eats only when safe, interrupts eating if danger closes, and stays in survival until health and safety are both restored. A goal received during survival is deferred; canceling the goal does not cancel survival. With no food, the bot reports the critical situation once per food-availability change and continues monitoring/escaping.

Critical hunger can interrupt combat; ordinary hunger cannot. Hunger-only recovery may resume the goal after a safe retreat without food. It cannot release a critical-health episode.

Combat is self-defense, not distant hunting or PvP. Close confirmed hostile mobs may be engaged; uncertain neutral aggression leads to distance, not an unprovoked attack. Tiny slimes are excluded; larger slimes are threats. Wither, dragon and warden are avoid-only. Missing weapons/ammunition, exhausted approaches and nearby swelling/ignited/unknown-state creepers lead to tactical retreat. A creeper disengagement is remembered throughout its observed encounter: ordinary updates and defusing do not restart melee. Suitable ranged combat remains possible outside the danger boundary.

Escape never digs or places blocks. It measures displacement and progress, changes failed routes, reports exhaustion once, and waits for a relevant world/threat change while preserving the safety obligation. Changed approach conditions permit only a bounded number of retries. An absent path does not prove safety. Missing/stale observation does not permit eating or recovery completion. Damage during eating invalidates that location even if the source is unknown or distant; the obligation to relocate survives a failed route and actor retry.

## Current tuning

Implementation choices live in `src/hsm/context.ts`, not Minecraft constants:

| Setting | Default |
| --- | --- |
| Health entry / exit | below 10 / at least 18, plus safety |
| Hunger entry / restored | below 6 / at least 18 |
| Start eating / interrupt eating | at least 30 / at most 20 blocks |
| Preventive self-defense / existing encounter | 8 / 20 blocks |
| Creeper danger boundary | 12 blocks, conservative for charged creepers |
| Observation radius / freshness and lost-threat retention | 50 blocks / 2 seconds |
| Escape waypoint length | 15 blocks; not the eating safety distance |
| Escape no-progress window / displacement | 1.5 seconds / 0.75 blocks |
| Alternative escape directions | 8 |
| Route search budget / per-tick slice | 200 / 10 ms |
| Failed recovery retry delay | 1 second |
| Approach no-progress window / failed routes | 3 seconds / 3 |
| Changed-condition approach retries | 2 per encounter |
| Meaningful threat displacement / approach memory after absence | 3 blocks / 30 seconds |

Distance alone is not protection against ranged attacks. Server AI, terrain, movement speed, visibility and latency can change outcomes. The bot does not promise to escape a physically closed trap or regenerate without usable food/server regeneration.

## Versioned evidence and limits

Metadata decoding is explicitly supported for Java 1.20.4 and uses `minecraft-data` named keys, not fixed array offsets. Unsupported versions/missing data remain uncertain. Creeper swelling, powered and ignited are distinct signals. Spider light checks use conservative Overworld light bounds, not a day/night switch; unknown ambient light/weather does not establish aggression. Enderman anger flags do not identify whom it targets; confirmed damage to this bot can authorize self-defense.

Vanilla base follow-range attributes were checked in the [official 1.20.4 server artifact](https://piston-data.mojang.com/v1/objects/8dd1a28015f51b1803213892b50b7b4fc76e594d/server.jar) using the [matching official mappings](https://piston-data.mojang.com/v1/objects/c1cafe916dd8b58ed1fe0564fc8f786885224e62/server.txt): Mob defaults to 16; Zombie overrides to 35, Blaze to 48, Enderman to 64, Pillager to 32, Vindicator to 12. These are follow-range attributes, not universal detection or attack distances. The profile comments identify the exact artifact hashes; custom server modifiers are outside this baseline.

The same artifact separates creeper swelling/powered/ignited fields, gates slime damage by non-tiny size, and checks spider target acquisition against brightness. Mineflayer's normalized `entityHurt` supplies an optional source; absence is handled explicitly. Full target intent is not exposed reliably for every mob.

## Manual Minecraft scenarios — not yet run for this change

Use a disposable Java 1.20.4 world and retain console logs plus video. Confirm actual position changes, not merely movement log messages.

1. Engage a zombie while armed, then drop below the health threshold. Confirm immediate cessation of attacks and real displacement away from the closest threat. Add a second closer mob behind the bot: the old route must not continue toward it.
2. Supply food, reach the eating boundary, then move the nearest threat through the hysteresis band and interruption boundary. Confirm food use stops at danger and resumes only after reaching the start boundary again.
3. While eating at range, take a skeleton/projectile hit. Confirm item use stops and the bot changes location before eating again. Repeat with unavailable damage-source data and an obstructed route.
4. Remove food during critical health, including during flight and inside a closed trap. Confirm one critical notice, no unsolicited return to combat/tasks, deferred replacement goals and goal-only cancellation. Supply food/open an exit and confirm recovery resumes.
5. Start an existing fight, then bring a different swelling creeper close. Repeat with a charged creeper. Confirm retreat, shield/item cleanup, and no automatic melee restart after the swelling clears. With bow/ammunition, check actual ranged shots at a suitable distance.
6. Test bright and dark spiders, unprovoked/angered endermen, tiny/larger slimes and each avoid-only boss. Confirm real entity types reach observation, players are not attacked, and remote detection alone does not trigger pursuit.
7. Block every exit, then open one side corridor. Confirm bounded route search, one stuck notice, no digging/placing, and actual escape after the world change. Repeat with side obstacles and water/uneven terrain.
8. Make a target unreachable or freeze effective progress. Confirm retreat after the configured limit; repeated observations and brief occlusion do not reset it. Change a relevant passage repeatedly and verify the retry budget is finite. Once safe, the saved goal replans without resetting its execution budget.
9. Repeat health preemption during delayed equipment, aim, food use, navigation, block interaction and window operations. Confirm canceled callbacks never retake controls. Repeat with death and process shutdown.

Automated counterparts use the public HSM, real Mineflayer plugins and Prismarine physics with a simulated server/world in `src/tests/hsm/*runtime.test.ts`. Protocol-adapter tests cover unknown/malformed versioned signals. These checks do not replace the live scenarios above.
