/** Vanilla Java 1.20.4 base FOLLOW_RANGE attributes, not attack or safe distances.
 * Verified against Mojang server 8dd1a28015f51b1803213892b50b7b4fc76e594d
 * and server mappings c1cafe916dd8b58ed1fe0564fc8f786885224e62.
 * Server attributes/modifiers can differ: these only bound preventive defense.
 */
export const vanillaFollowRange: Readonly<Record<string, number>> = {
	creeper: 16,
	zombie: 35,
	skeleton: 16,
	spider: 16,
	enderman: 64,
	witch: 16,
	pillager: 32,
	vindicator: 12,
	slime: 16,
	wither_skeleton: 16,
	blaze: 48
}
