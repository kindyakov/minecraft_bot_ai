import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9xKrI+Bik+NhZAGqZAJqqsZg3mITRADLnGBgA4jRYl98I9MLhhsRKLEpgUZiV5qByl5VLYdho2O5DBoHA4NGsEHptO5nGwDET7ESjGSlB1Dl1wr1mOdLuhrrdUA9iM9Xu9Pj9yNFUF94gCgSCwRC6FCYZxpgJZqUFogHEolKp3Eo2NotQptK0lBZrIhXLZVDj3MTtA5bNbVWxaQcjozImcLlcbvcni83tgPt9VHQvphMLExcDQeDIdDYbwFQiynYDBoNWqFO5NWxHMZVsbCUptKpvAo0fozNaWnTnT1XSyPRyuTzff6foR8LhQoCI5Lo7L8nHinNEwgbSSFA4FAZrUoDHj00banIHAZzTas3plysFMp3FWGTXTnW2Z7Od7eX7+apCJQvl9KAB1cMSqPSmNyuHxofKhAtEnL3-aHotjuNqZK2ASLgKKoWb6vYmLEkoqoKHuYQHsy7rHg2Z7NpedAABKYF8yS4E+kZSjKsaFJ+SpIiqmKqLiHgZtoOi4g47gEloTi2JOeorFi9gFihxxMtQR7sl63KqGM-yYOgZBYJg8R0KomDIOCsnoNgjykG8WToIC16UPEwxvLg2B4ZR8JfrRFRaGajGaiBKz+BuHF5nIbCqNoyhqraygKBiDjGAYwkuoeGESaeUkyXJCkhspqnqbgmnabpSRilZ1GIjI8hElBBimnoSjLKYngLvImrqGqiG6JojQeGFaFiZFJ6NtJKVxaQimJWpGlyWlBH4F8YpGSZDDthZWWDjRuV2QWqgKA6DjWt4IGGu5tQTotNU+HxGZ+KFTr7ic6GslF7WxfJ3UJSpfWdVpOlDSNBk0NNio5YsIFmgY7hTt4aIGCVngEgF3naBDPk+a4bC4k1p0tedbXetglDIOQSQxAkSQpKj6NJKQqPyZgAAarDvgOH3DnIG6LUBxhZuOjiFUBoNuCu+gaMsegrMBvjIcdqEI26SNYVJeMY7Q70Jt+bheTV-MGLOaoYuBebbumqLJlzPmaLDlrw6JIv1pJzwS5jLAKP2VEzZ9KreUSM42qD2oc2w7u+DxfPuALnRC0b4nI+LaOS1ewaYJlFM21T340-RDo+A66baPYgMEoBbCG7WrVi2bIdJGHIaZVb8q29T63pzzWcRaLpuqObZyEOHmV6Nb1mzYsctsz51dnSb0V5-jbqESG1zEMQNwANKR232Xl74DEuK0yep5tJpuLYveI-37UN+cI8pEkE-YNPr2W7PZex+4PiLzqM6+Cn9hrwg26FVvxuYXXe-qeHY-H6fgIWCt1LjHWycgCy5lqNuIC79A653rvnM4BADJKT-lPGeICZZgKxE4fwk49qWlXunWc5otBATXAhHugsRLZ1rgPBBQ9VDINkiZI+6Cz4lw-JfMBtgjDeXWknQhT8XYlVIaYRwyxKG+3pP7WhO8UaIKYfgFBrDx7sMAcArhoC5pyAzHoW+aogZCOAgSIGDhYE5zrhPOgk86BvSju3O2CBnIOyAm4EqhgMxc1Bt4fRNVgqMRaIVXc1Dwp90-vQ6xtjVDxFDOkTIpBMhqTsUk5AdBSCxLSBkZI8RpY2TmliKCaoQJmENOmcRz89TjjER4YK61PAWLoe1KJKlcChkuBCdsyBKAQihDeOxbTYgdMJmjYEjBMB5I7ogDcKZEJ1PqpaXxEF3Z+JqoVd2sNAohL9jQmu8ipItKvJQYypl8A4DwjQa80R0AmTGpMpxywvJKxWLVIk2p2IOFBjqKCehLQ6hTvrX6FiciZB6QCVQz1iB4VIN09AoLcBY0GCkSFlkHFz1jiWKqPMNCmg8GiPUFUKhAQYji5MJVtw6inBoR0OywktRBVCEiBkIVvCItC2F8L7EX20YsCG6oNkbLxTinyBJbD6K0BKiG5VCopxpTI3Z6EGVguZXha5skIQcsZYinGpA7lou4ToksLRoICuMNfYVhKaaaznGSnieoZzEmBXCxl4LVUoI1UqhF9zqZ8pNQKoVVSCSKGpX6lY+VU4uCdfC8FcVMioEwOkzVPTtVDFjVkBN3qMVwUWuOScy5zUEtBsFRav1vArAhjzA2oTmpuk9TG+ScaE0ws9TQNp3S7gpDTY8TNYDMVmjqvTANgEILsWgrxPwqoXDUv2LSmt5w63MrTfGxNLae06JTn+HMbg8TLknPiPMxVCwSrISoLxbgo0uuZRZAmSaEUAFtBDiDAGu8obACQ+xXArL9-iL3Kv+PXPCN6W0ADM+AABswN8AAO4vsqjtdarMD1VW-Sh7Qv6mX-uvWQW9NBYBgbAGAHgsGKhQRYs7PM1Kj3HuoxK9D4KsPNudcm2AAALMAYHhBgAAE7EaXOoUwLM1a1E1G7U1Ym5XVmFvOpjGGANAZkzQYDABDLjd7iOQJNMSaqKGFZoerVJ299HAPYZbQAIwAK6CDAxAXjXkl7sUho5vl19OKwxLX9TQgkgrKCCAccQfAIBwCkJJo2mD8mLB3OqbcE5Zy-XxcOjyPtCwCtcD5CNgVGn7MeGFqZFQVpOGPVqLm9hkxBq0FBR5Ya0uUgy-pgOlj6HnhbDlpxgUnAZnxcoWcjg-lBu3c4HFK0dRElxBuTLET2pNcvKgeIwYWvDh6+oZaBZipkj8NUJD7nkwsR1PUIGM75V0o-hdbCfIAyhABPN2Wvyc16lxOOd2Eb32Ti2z7NxHtMTjZO1JKbAZBTClFAZK7tlrSFg6zimc5CWgbagSBIsXslpanNbDA7IW5ETdOxeAMQYQxhiB1orBc1gJOACtfRCWpfqqnfTi17RUPvbMO3Ohrk2cIBjbB2S7BPwuIFB2OnwRIMS6FcAYINS0zRuHHHykb-gZxfaDk2M7rYbx3kfPjymhPyj4I1AWrrNoHPaE4kUlQOhoa-J3RoOX8Dfs-HwoRYinP1fc4QEYfRfhAo+FMCVQx1OoKTj+m9sV9PLd12t6oFjghYDCGB3NHmK482Vf8OSD3QapwMUeTDS0mZI11fR9954V14pKToNHxYDmalFdTqVjyvySQpfDTV4P9CC83SL0lfqj10r6X+CX+QwUoKFeMJX-di5oGhtSyWBvOe9kY5ig9QvvVkqpSeqyh30cNe95WOXwfJXh+IAWn8-UwVfoZhWo33eiCe95b8ItZaQMZyeBYhphAesz8KMYU3Iuau19O8UBDVEm5iQ-pfkl4Rd1ZMRuJkxyFJFNQqFZ0DMmk39Q4f5R42ET5V9HFqYCxCxEdlxDEH8cVQZJwvJN4p9wk88GFQ5mFUFUCAFL9wFU9tYPAfJfoTAn9dAUxtYoDtQYDpE0dp9yC95YlCA5JAdu8udcs5AODbRvoeI9dBN04HQtZxEKEeDX8Dl8AbFi9xCnElx9AixDAzAAYxVvF1Y-BCx8oCxyQpdUcTp6sED1DNCYk4lslElkg0k6CSpZkN1lAtxAprRQYVAfldZ9QiRhsbDZF+D5dVBDlBlhkukelSA+kvgtDHcJDgZ9DyRDAI0TCoF2IVxgIHt9BBINwjo4C7CstoiNDokxpTlzkPDr8K03llwfIsRQCoFZx9FZxFkKR9RkxzFSDt4Z9nhw9I9L9HBCwnM6otQXADd1YcQKsfY8EdAJ8fY6Mv8MCs19Qc0Yt814tLUMQUxHs3ItxKVHUBja0ZNXVWUoVGN4U6Dhd9F6YHRiRVRrQfBRd8ilZbRgIyRMVqU1j-03V1VbjGV7jPEGJJwZV1s3iYc8oSxUR1x2ITiHUGc+DFVLjF0G100V0ZMwTkxnBHkCxoSbRYTCQyRnAT8lpiop0NoAS5MTNcTtDqZXAbQBsDoT8CwSTOIMxzRDAUd3FdZNRfMAggA */
    id: 'MINECRAFT_BOT',
    type: "parallel",
    predictableActionArguments: true,
    preserveActionOrder: true,
    context,
    on: {
      SET_BOT: {
        actions: [{ type: "setBot" }]
      },
      UPDATE_POSITION: {
        actions: [{ type: "updatePosition" }]
      },
      UPDATE_SATURATION: {
        actions: [{ type: "updateFoodSaturation" }]
      }
    },
    states: {
      MAIN_ACTIVITY: {
        initial: "PEACEFUL",
        states: {
          PEACEFUL: {
            "description": "Переход в эти состояния по командам игрока (приоритеты 7 - 9)",
            "initial": "IDLE",
            "states": {
              "IDLE": {
                "description": "Приоритет 1",
                "entry": {
                  "type": "entryIdle"
                }
              },
              "MINING": {
                "description": "Приоритет 7",
                "entry": {
                  "type": "entryMining"
                },
                "exit": [
                  {
                    "type": "exitMining"
                  },
                  {
                    "type": "saveMiningProgress"
                  }
                ],
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": [
                        {
                          "type": "saveMiningProgress"
                        }
                      ]
                    }
                  ]
                }
              },
              "BUILDING": {
                "description": "Приоритет 7",
                "entry": {
                  "type": "entryBuilding"
                },
                "exit": [
                  {
                    "type": "exitBuilding"
                  },
                  {
                    "type": "saveBuildingProgress"
                  }
                ],
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": [
                        {
                          "type": "saveBuildingProgress"
                        }
                      ],
                      "meta": {}
                    }
                  ]
                }
              },
              "SLEEPING": {
                "description": "Приоритет 7",
                "entry": {
                  "type": "entrySleeping"
                },
                "exit": {
                  "type": "exitSleeping"
                },
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": []
                    }
                  ]
                }
              },
              "FARMING": {
                "description": "Приоритет 7",
                "entry": {
                  "type": "entryFarming"
                },
                "exit": [
                  {
                    "type": "exitFarming"
                  },
                  {
                    "type": "saveFarmingProgress"
                  }
                ],
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": [
                        {
                          "type": "saveFarmingProgress"
                        }
                      ]
                    }
                  ]
                }
              },
              "FOLLOWING": {
                "description": "Приоритет 9",
                "entry": {
                  "type": "entryFollowing"
                },
                "exit": {
                  "type": "exitFollowing"
                },
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": []
                    }
                  ]
                }
              },
              "SHELTERING": {
                "description": "Приоритет 7",
                "entry": {
                  "type": "entrySheltering"
                },
                "exit": {
                  "type": "exitSheltering"
                },
                "on": {
                  "PLAYER_STOP": [
                    {
                      "target": "IDLE",
                      "actions": []
                    }
                  ]
                }
              },
              "hist": {
                "history": "shallow",
                "type": "history"
              }
            }
          },
          URGENT_NEEDS: {
            "description": "Срочные потребности (приоритет 8)",
            "initial": "EMERGENCY_EATING",
            "states": {
              "EMERGENCY_EATING": {
                "entry": {
                  "type": "entryEmergencyEating"
                },
                exit: {
                  type: 'exitEmergencyEating'
                },
                "always": {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.hist",
                  "guard": "isFoodRestored",
                  "actions": [],
                  reenter: true
                },
                "on": {
                  "FOOD_SEARCH": [
                    {
                      "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.FOOD_SEAECH",
                      "actions": []
                    }
                  ]
                }
              },
              "EMERGENCY_HEALING": {
                "entry": {
                  "type": "entryEmergencyHealing"
                },
                exit: {
                  type: 'exitEmergencyHealing'
                },
                "always": {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                  "guard": "isHealthRestored",
                  "actions": [],
                  reenter: true
                },
                "on": {
                  "FOOD_SEARCH": [
                    {
                      "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.FOOD_SEAECH",
                      "actions": []
                    }
                  ]
                }
              }
            }
          },
          COMBAT: {
            initial: "MELEE_ATTACKING",
            description: "Состояние сражения (приоритет 7.5)",
            entry: {
              type: "entryCombat"
            },
            exit: {
              type: 'exitCombat'
            },
            always: [
              {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                guard: "noEnemiesNearby",
                actions: [
                  { type: "clearCombatContext", },
                ]
              },
              { target: ".FLEEING", guard: "isLowLealth" },
            ],
            on: {
              UPDATE_COMBAT_CONTEXT: {
                actions: ["updateCombatContext"]
              }
            },
            invoke: {
              id: "combatMonitor",
              src: "serviceCombatMonitoring"
            },
            states: {
              FLEEING: {
                entry: {
                  type: "entryFleeing"
                },
                exit: {
                  type: "exitFleeing"
                },
                always: [
                  { target: "DEFENDING", guard: "isSurrounded" },
                  { target: "RANGED_ATTACKING", guard: "isEnemyFar" },
                  { target: "MELEE_ATTACKING", guard: "isEnemyClose" },
                ]
              },
              MELEE_ATTACKING: {
                description: "Ближний бой",
                entry: {
                  type: "entryMeleeAttacking"
                },
                exit: {
                  type: "exitMeleeAttack"
                },
                always: [
                  { target: "FLEEING", guard: "isLowLealth" },
                  { target: "RANGED_ATTACKING", guard: "isEnemyFar" },
                ]
              },
              RANGED_ATTACKING: {
                description: "Дальний бой",
                entry: { type: "entryRangedAttacking" },
                exit: { type: "exitRangedAttacking" },
                always: [
                  { target: "FLEEING", guard: "isLowLealth" },
                  { target: "MELEE_ATTACKING", guard: "isEnemyClose" },
                ]
              },
              DEFENDING: {
                entry: {
                  type: "entryDefenging"
                },
                exit: {
                  type: "exitDefenging"
                }
              },
            },
          },

          "TASKS": {
            "description": "Задачи бота",
            "initial": "DEPOSIT_ITEMS",
            "states": {
              "DEPOSIT_ITEMS": {
                "description": "Выкладывание вещей в сундук",
                "on": {
                  "ITEMS_DEPOSITED": [
                    {
                      "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                      "actions": []
                    }
                  ]
                }
              },
              "REPAIR_ARMOR_TOOLS": {
                "description": "Починка брони и инструментов",
                "on": {
                  "REPAIR_COMPLETE": [
                    {
                      "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                      "actions": []
                    }
                  ]
                }
              },
              "FOOD_SEAECH": {
                "description": "Поиск еды",
                "entry": {
                  "type": "entrySearchFood"
                },
                "on": {
                  "FOUND_FOOD": [
                    {
                      "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                      "actions": []
                    }
                  ]
                }
              }
            },
            "always": {
              "target": "hist",
              "guard": "noTasks",
              "actions": []
            }
          },

          "hist": {
            "history": "shallow",
            "type": "history"
          }
        }
      },
      "MONITORING": {
        "states": {
          "HEALTH_MONITOR": {
            "entry": {
              "type": "entryHealthMonitoring"
            },
            "always": {
              "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.URGENT_NEEDS.EMERGENCY_HEALING",
              "guard": "isHealthCritical",
              "actions": [],
              "description": "Переход выполнится если \\\nтекущий приоритет состояния \\\nниже HEALTH_MONITOR ",
              "meta": {}
            },
            "on": {
              "UPDATE_HEALTH": {
                actions: ["updateHealth"]
              }
            }
          },
          "HUNGER_MONITOR": {
            "entry": {
              "type": "entryHungerMonitoring"
            },
            "always": {
              "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.URGENT_NEEDS.EMERGENCY_EATING",
              "guard": "isHungerCritical",
              "actions": [],
              "description": "Переход выполнится если \\\nтекущий приоритет состояния \\\nниже HUNGER_MONITOR",
              "meta": {}
            },
            "on": {
              "UPDATE_FOOD": {
                actions: ["updateFood"]
              }
            }
          },
          "ENTITIES_MONITOR": {
            "entry": {
              "type": "entryEntitiesMonitoring"
            },
            "always": {
              "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.COMBAT",
              "guard": "isEnemyNearby",
              "actions": [
                {
                  type: "setTargetOnEnemy",
                },
              ],
              "meta": {}
            },
            on: {
              UPDATE_ENTITIES: {
                actions: ["updateEntities"]
              },
              REMOVE_ENTITY: {
                actions: ["removeEntity"]
              },
            }
          },
          // "ARMOR_TOOLS_MONITOR": {
          //   "entry": {
          //     "type": "entryArmorToolsMonitoring"
          //   },
          //   "always": {
          //     "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.REPAIR_ARMOR_TOOLS",
          //     "guard": "isBrokenArmorOrTools",
          //     "actions": []
          //   }
          // },
          // "INVENTORY_MONITOR": {
          //   "entry": {
          //     "type": "entryInventoryMonitoring"
          //   },
          //   "always": {
          //     "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.DEPOSIT_ITEMS",
          //     "guard": "isInventoryFull",
          //     "actions": []
          //   }
          // },
          "CHAT_MONITOR": {
            "description": "Команды игрока",
            "entry": {
              "type": "entryChatMonitoring"
            },
            "on": {
              "mine": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.MINING",
                  "actions": []
                }
              ],
              "follow": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FOLLOWING",
                  "actions": []
                }
              ],
              "sleep": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SLEEPING",
                  "actions": []
                }
              ],
              "shelter": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SHELTERING",
                  "actions": []
                }
              ],
              "farm": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FARMING",
                  "actions": []
                }
              ],
              "build": [
                {
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.BUILDING",
                  "actions": []
                }
              ]
            }
          },
        },
        "type": "parallel"
      }
    },
  },
  {
    actions,
    guards,
    actors,
    delays: {}
  }
)

