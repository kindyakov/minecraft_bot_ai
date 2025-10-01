import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9tPGYSQASUwUzJfOgtXLuSmzOGgoO2tpKetoO-gclnKCncPlULzY2ncCgMekcLQcHUOXXCvWYqmQ+AwpHw2CyADVMgBNVSxC7YTCEaIAGUxGAwAHEaLEafhiZhcMNiJRYjdeAJZqUFogvKpbDsNGx3IYNACNGsEH93M42HDtPY-kY1UpkUc0ZFiJjsehcfjUETiKTyXiqbTVORoqgafEmSy2RyuXQeXzONNBfcyogHEolBDXj8VtpWr9Fa5bKo5e5of9bP8Q2xdQd9T1DcacXjCSSyRS7XS6DTMJhYm7WezOdzefzCgG5kG6gYNOGVO5IY5jKtrIg9EptKpvAoJfozP8WnrUbnTvnTYWLcWbZTqXTCPhcKFmXXPY3ffkBcU2yKEA5bCrPrD-koDA4PjLFXIHAZE9e2LY9B+VgoyjuPOYSLhiWIFualrWqWW6qIQlA0jSlAAOq1h6Dbek2fq3K2wqgOULQqh+RHaPC7hQmqtiKi4CiqD+0b2NK0JKCGCggcc6LUMuZpFlaJa2nBdCXJgNLJLg6H1l6PrNncF4EcG0qqPKvbJjoAIOO4ipaE4tiwgouigvCPjaBxBpLhBK5QcWYyMpg6BkFgmDxHQqiYMgnJ2eg2DEqQFxZOgzIIZQ8TDBcuDYNcOFnkKDwyPIWgJipvhsCs-h-lpQ4VG82jKKGabKAoUoOMYBhmWB3GWbxa78bZ9mOVWLluR5uBeT5flJG6sl4XFix-HRBjxiOyymJ4FhZc8YahqGXyZqYWzAdmC4nOBJrVdBqh1Q5pBOU17mefZ7UifgNJusFoUMLukXdee+HxRUGijqoCiZl8H43pmeiZbUDh0XlSg+AZ0q9h+5UrZVa2rhtW0Nc5rn7a1h2+cdp2BTQN2xe2zw-uO7gGIxEoGADnhxioqjfBTBmAXobAAmDXFGlVUPFtglDIOQSQ0OglB+VgaCYHQGOBpe2hSuTEaPWmIZmAYcYjp+nb45oIaQkiS2geDjOQ9Z-Gs+znP4OgJ3EgAWikesc6w0UtrdvV2GL71-lTLxFdoirQiqWihnjOhkfoi2dBrDM8czuts5bqjnNgqCumjQvyfdigA8pGg3tC0rqalstZa4v30QYSstC0aYF-TeZMzrpIW0kkc4DHXUKKeNuY5eScJqYZGGO9+n6HGo35-js2zqX6uceX2t8VX4c11H9dx3oTdyXdizKO3fwy93g29znLR6AP-y6MPZWj+Zq2QZPqjV0as+x8yLAaIvPVY6vibr13E5b+NtSghR+9D8+I9A5jwshPGqU99ZGkIJWTAbpiC7jsmQSKhs7LxHjsvRAvZ26-Q8M0Hsg0+5EwhGYD4+lHwqGPkA0+ENz5gMvtPSB0C3Qo2IJcUguABY8nYag62S87YIAolgoqRFlCzXhHLR844WgHyhAAihKIg7jxoRtK+8FGFoygVWUgjJKAnTYRSES3DH623bJ4FUvwipgjlHCOEmY4wvDDMZXwjgaY000mXEBSiWb0MxKJTRSQ4HYAANKwPgYwUgSDArOTQXwuQI5xShmULlYw81qI5wlGOa8jhBr9Q8HInMmsQ6VzoRAnx0DcTEACcEtGcDEaIMuMgqJjd-TGNbgmAyysfxqkGrvbO39fgqkVtIo+7iz5WQviojyZT-F4iqcyGpCDwn1MiaghezSW4KQemGIm0oPybxesoOM71ExSP-i0PJy1g4V3Gd4yZfiKkzLdPZdyvlyA4HwB5UgO5cDRKxmCZSekXpWL0lvA5OcXCfi6UM2RIzqFjNoRM3xKRplBKYRcMSrC8CZFQNgE6PzW5-OvIBYweyVjVBzr9MMtgC5QrOTCrWniw4lIIMs8plSQm1MWQ0wxazhYbLkJoT89hHAZhHDoAycZ9BhkhacwB8jgGjPWl4plXLWUPOqaEupXKWBNNwi0vlrE3ipTlGqO8aoPhywBPvT4EpXjezpYU65yqWXItmTQeZYSIkoJYKs3V6zE4AwTH4EMoZDDAqhH3L4kj8Y+Bpn7Tw9qrnwu8cylBqqUVoyecgF5byPnYGQgwPFfKxY6WlK4D++yyXf1piqaVh9oUnwqvSuFyjk0qpdaik6LDwkSSyDimkhbE5-kkSVGEoae6gqrXE2tMjaUNoKYmltJTziEHsrfLm1BhhjFwJQaI6Bzjct9by+6KgMmi0nG4QamhvqIEAloY5g862zsoY2h1Sal1UlXR29F3asV9oHeUE9ykz2-haMoDwErvD3ppbK-JlzQEbTgXQQJdB0Y8KfpeCiOUzAgYBoYXsqc4zeD3tNEq8ozmggTfB4siHkO1zSBkMgmR3IoaY8gOgpBzj0aYwemKR7ygyjot7ac5ixo3jjLlJwWgtB+GlJmeNc64MMtJDR1y7DYjYi5LuZAlAuQ8kQihtTGnwls1ZIwTA-7hzPnUACaUmgvqMS-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-NZe8KpCDBwT4NpL2K-EYOlJ3mgVAQEEAA */
    id: 'MINECRAFT_BOT',
    type: "parallel",
    predictableActionArguments: true,
    preserveActionOrder: true,
    context,
    on: {
      SET_BOT: {
        actions: ["setBot"]
      },
      UPDATE_POSITION: {
        actions: ["updatePosition"]
      },
      UPDATE_SATURATION: {
        actions: ["updateFoodSaturation"]
      },
      DEATH: {
        target: '#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.IDLE',
        actions: ["updateAfterDeath"]
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
                  "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.hist",
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
            initial: "DECIDING",
            description: "Состояние сражения (приоритет 7.5)",
            entry: { type: "entryCombat" },
            exit: ['exitCombat', "clearCombatContext"],
            on: {
              NO_ENEMIES: {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
              },
              ANALYZE_COMBAT: {
                actions: ["analyzeCombat", "savePrevCombatState"]
              }
            },
            invoke: {
              id: "combatMonitor",
              src: "serviceCombatMonitoring",
              input: ({ context }) => ({ context })
            },
            states: {
              DECIDING: {
                entry: { type: 'entryDeciding' },
                exit: { type: 'exitDeciding' },
                always: [
                  { target: "FLEEING", guard: "isLowHealth" },
                  { target: "DEFENDING", guard: "isSurrounded" },
                  { target: "RANGED_ATTACKING", guard: "canUseRangedAndEnemyFar" },
                  { target: "MELEE_ATTACKING" }
                ]
              },
              FLEEING: {
                entry: { type: "entryFleeing" },
                exit: { type: "exitFleeing" },
                on: {
                  TARGET_CHANGED: {
                    target: "FLEEING",
                    reenter: true
                  },
                  HEALTH_RESTORED: {
                    target: "DECIDING"
                  },
                  FLEE_GOAL_REACHED: {
                    target: "FLEEING",
                    reenter: true
                  }
                }
              },
              MELEE_ATTACKING: {
                description: "Ближний бой",
                entry: { type: "entryMeleeAttacking" },
                exit: { type: "exitMeleeAttack" },
                on: {
                  TARGET_CHANGED: [
                    {
                      target: "FLEEING",
                      guard: 'isLowHealth',
                    },
                    {
                      // Новая цель далеко - переключаемся на лук
                      target: "RANGED_ATTACKING",
                      guard: "canUseRangedAndEnemyFar",
                    },
                    {
                      // Новая цель близко - перезапускаем атаку
                      target: "MELEE_ATTACKING",
                      reenter: true
                    },
                  ],
                  ENEMY_BECAME_FAR: {
                    target: "RANGED_ATTACKING",
                    guard: "canUseRanged"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  },
                }
              },
              RANGED_ATTACKING: {
                entry: "entryRangedAttacking",
                exit: "exitRangedAttacking",
                on: {
                  TARGET_CHANGED: [
                    {
                      target: "FLEEING",
                      guard: 'isLowHealth',
                    },
                    {
                      // Новая цель далеко - перезапускаем стрельбу
                      target: "RANGED_ATTACKING",
                      guard: 'canUseRangedAndEnemyFar',
                      reenter: true
                    },
                    {
                      // Новая цель близко - переключаемся на меч
                      target: "MELEE_ATTACKING",
                    }
                  ],
                  ENEMY_BECAME_CLOSE: {
                    target: "MELEE_ATTACKING"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  },
                }
              },
              DEFENDING: {
                entry: "entryDefending",
                exit: "exitDefending",
                on: {
                  NOT_SURROUNDED: {
                    target: "DECIDING"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  },
                }
              }
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
              "actions": ["setTargetOnEnemy"],
              "meta": {}
            },
            on: {
              UPDATE_ENTITIES: {
                actions: ["updateEntities"]
              },
              REMOVE_ENTITY: {
                actions: ["removeEntity"]
              },
            },
            invoke: {
              id: "entitiesTracking",
              src: "serviceEntitiesTracking",
            },
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

