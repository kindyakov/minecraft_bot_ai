import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9tPGYSQASUwUzJfOgtXLuSmzOGgoO2tpKetoO-gclnKCncPlULzY2ncCgMekcLQcHUOXXCvWYqmQ+AwpHw2CyADVMgBNVSxC7YTCEaIAGUxGAwAHEaLEafhiZhcMNiJRYjdeAJZqUFogvKpbDsNGx3IYNACNGsEH93M42HDtPY-kY1UpkUc0ZFiJjsehcfjUETiKTyXiqbTVORoqgafEmSy2RyuXQeXzONNBfcyogHEolBDXj8VtpWr9Fa5bKo5e5of9bP8Q2xdQd9T1DcacXjCSSyRS7XS6DTMJhYm7WezOdzefzCgG5kG6gYNOGVO5IY5jKtrIg9EptKpvAoJfozP8WnrUbnTvnTYWLcWbZTqXTCPhcKFmXXPY3ffkBcU2yKEA5bCrPrD-koDA4PjLFXIHAZE9e2LY9B+VgoyjuPOYSLhiWIFualrWqWW6qIQlA0jSlAAOq1h6Dbek2fq3K2wqgOULQqh+RHaPC7hQmqtiKi4CiqD+0b2NK0JKCGCggcc6LUMuZpFlaJa2nBdCXJgNLJLg6H1l6PrNncF4EcG0qqPKvbJjoAIOO4ipaE4tiwgouigvCPjaBxBpLhBK5QcWYyMpg6BkFgmDxHQqiYMgnJ2eg2DEqQFxZOgzIIZQ8TDBcuDYNcOFnkKDwyPIWgJipvhsCs-h-lpQ4VG82jKKGabKAoUoOMYBhmWB3GWbxa78bZ9mOVWLluR5uBeT5flJG6sl4XFix-HRBjxiOyymJ4FhZc8YahqGXyZqYWzAdmC4nOBJrVdBqh1Q5pBOU17mefZ7UifgNJusFoUMLukXdee+HxRUGijqoCiZl8H43pmeiZbUDh0XlSg+AZ0q9h+5UrZVa2rhtW0Nc5rn7a1h2+cdp2BTQN2xe2zw-uO7gGIxEoGADnhxioqjfBTBmAXobAAmDXFGlVUPFtglDIOQSQ0OglB+VgaCYHQGOBpeyZjmmcrURNhgJm4nzfL86Z-vTeZM9Z-Gs+znP4OgJ3EgAWikGsc6w0UtrdvWINoLSqlK0J419LjaG+0vvHLPx-ACStLaB4OM5DaukkbSSqOc2CoK6aNC-J92VJ+JU-np0IfHCrhxg7yl+GCBhgroROLZ0PsMzxzPq2zxshzg4ddQop5m5jl6x840JVI+nhW5macahnmnPr9H7XvnKKFyr-t8YHZfB6HVeR3otdyXdiyuJ+yot9nJgd1lRUSt3fhyp8T43srFmjzV4+a0aU8R8yLAaHPPVY0vTcykTrfr9Um8wnRPe733B+Dzmvti4B1UEHI0hBKyYDdMQXcdkyCRW1nZeIUcF6in0BCT6Rg9LXg-ONWoRUQw717vvAeR9VqQTHiAieYCIFuhRsQS4pBcACx5EwpBpt54WwQL2PQ6DfiYM+I4OEacKIQn+D-Yhh9vacRHuQ0+lDz7wRoWjcBVZSCMkoCdRhFIRJsLvubds3DeGGB-AInBcY27OEzkQ-ukiC7SOPrIjaoDMSiVUUkaB2AADSUCYGMFIPAwKzlkGcMUG8POgNjCaRphRQceDkyfhhDKVKKYVDtCkeZMhVkKHOI8hA3ExAPHeLRtAxGcDLgIKCTXf0+jLwfHHC0Rwk5cpiKKnGNMYZkw9z3jY-+y0i6q2yVQlxeT3F4iKcyEpsD-HlMCUg2e1T64KQQG8T4vZNAfB8JmZuKg4zXjDN8Lpv8SHpIqn7RxLMhm5LcQUsZbp7LuV8uQHA+APKkB3LgYJWM46FRUK-dujg4z3kId0v+pCIbnNLgoq5KRRleNoRcMSDC8CZFQNgE6nyG7fN+coNe-ygSb0fMvKxILjl2IyeCrJcjnEEFmfkwpPjSnTIqbohZwsllyFeHRX8aotBkU2ToRUBzgVHNsUPexmT1oXIUTSxBdLbnFN8WU5lLAqm4Rqey34YYpQ02+LCNuCpN4jmIpnVwj4-wGV6cPBxlKnFDJlc5OVcKFWMoCYglg8y1WLJjioBJMp-AwlxQavBGg9KiM0ssdUo5YRgrOTaqV5d7WhVheMmg9zkCPOea87AyEGAYqWVNf4ug1STleKOEmm9pRJWJSKy14qKWSshQm5ljqU10KRRJLIaKaR5vumOAys1i2bLLUGy2-xhUSKzGS05QDBkKPOIQeyV8ubUGGGMXAlBojoHOCyz1bL7oAzDHCIwds4QygMoCpSBzxE9JjTOqlQz52LvhSdeh-iO2ovRew++l4D3jmMSeh256K3givdY0FJzAEDLkdAugni6Doy-eq+6FEcpmF-I9X82dPCSzwd4Hh00SryhaINWt5LY0NtJDBuDFc0gZDIJkdy8GGPIDoKQc4tGGM7pinu8oZ71ApTML8UEpgbxxlyk4LQWg-DSkzJ4W9UGNpUdckw2I2IuS7mQJQLkPJELwZU2p-xbNWSMEwD28of4uysRKi8UajFcHDlSvh6ag1Uq0yKqR6dCnixKfgpQEKYV8A4EuDQBCm7QrnTM3YVK44jDKC+H8KEPcxNky+vLDUtM8YecgzkTIWmmSqDbaQTT6Bcu4BiAkJIKQ22RYqJOF4Nt4weAlAZezFR4TKWThhwCPx8aPXkzllh+XCvFdKwhvRXrFjy3oq51KTWPi5UVL+RMkmdBJ0MAZHw-WSuDcCgVzddkuQjZYeVwYKQIuIYm-ISc1sZuzbBPN1rcgXDEU6wDbrj5oRbdK0N-bDYjtabG6y6Ok2fjTZm3Nqmb4iphhm64XK9hfzsQg-0gbeXdv1RRQLIrqOysDEq7zLIWQBY1aWMsZ6d4nzZ2a2RXZKzs7eCjGRZiX2duMjcg5THrH-tlaYZpgkKQMdWhJ3VhMuhfgjXuy1miml6L6T8CGFwj19hTuy9ttHbPBeoCx9zwHu7gfyA1MRAcbhe6DU7DRJ6K3TA9jGhoFn6uQHlLIDrgAtoIcQYAatsEVAG-j01-cEftxJXb8Dnc45oAAMz4AAG2j3wAA7iT28KVxc0XqwHjPoZTLI5Vjj-Lofsdq7K7AaPYAwA8GF+TCW2lLdW7r3bnPFk88h6d4X0bsAAAWYBo-CDAAAJxJ04TQ634Q+8fGD27t3J1irI5iZvbOC864jwAQz7y7mrsTEAWr95n6a2eVco6L-n1vOuABGABXQQ0eIAk7eC4J8osKZP98Dh1BTg9VExDT4YqygggHHEHwBAHAFIAAgzEDigrVr4GGIBL9JTpLjThNDeE4M+J8FGq4BatPqATInGlaOASEm9MtloK8F-rYObhNHKDwigSGLlOgdCI4PJifBtBuGWHge2PghCJLjitgqLM7HKK7CRgYIIYDCGAwRCjBIJPaOHJWKwZeI4CqKWtQSOGqH4O-LUF9M9PTiYD8PUETMrjPp5oweuLBPaKEEyDIUsmYLeN1gCJ8KlAjq1r7h-jCPCDTJmNKKITgeIZuPaI6M6FfOYb2l8Bwc1magiETOYmEnpHpG4fdrTHoVgdahRgJN4eWBAjWIFAEeUEgc9D2D4BmNnCGD7nUk4UNKlK8Flv0oYfxMwXBO8vuJkZbEESsD4H8LbCsIYFDjjLLF8O7IrI+B4UkTUfaAhEhKhGYXrhAbCAmL2M1lwXId8NpHRKGEVLqq4D-A3gftgYMcYeWCJGJJyOMdxvrggEYDwn4FvMPgeo+EUX9PTs4dyjEQMSXF4WWKoB3oILAMIA0UqGqBod+KlP4HCN-m+PjMpMsO0cxJCC4E8cAjDDtI1HQN8e+MmIQY9MYAjmQU8F9CqDNutppB4DATCRQnCbtPDC1G1L5P5IcXXDxvICVHRCtsQRiSOrVq4BPnDpOJqEjpsYkc8ZtIjNtKSc1AdN5MjAitSRwljPSaiUyfYJiYgE9I-k+MoSDPvvoZBlUWfMbEiaxCqNqlCLlIGoqM+MaochIhUVsXyc4pfBKd+uyiGksa9C-IGhvHEjLrlGer8MoXNESfegoiopAhkRMZwsoNMY7AnKYmbp3GON-GBtePEX0pacAjkq4jCjck6oyEiRQYmHjC0i6aoVvi8E5p6TTNnD6Y3hKlaXas2smraUhosASfRJ2B4Iafqq6VvoBF2J0teuBjyZWcmQ+lSE+kGUcRAY9JZhRGmL2Keo7CyS9LlJYmaTehWfWnyUpjqQQoImYN4JqCGnGETG8DeAIlbB4ACNnL6YpvgLBq5OxukJkKQMxoicGVjL8E4DMTCJyp2f8GJmROKB+dGH8O7AmVav2RQj5vpqgOpnuFpqQDpjSE+aOSEnwuKDgtLLua-kqHDspOJo5vYHwhed5ledRudAFkFjqS4BnDOLTPjEZAYDRORM9KluqGmIIXKARfxO8Z8d8WRGOE-t8JmK8I7PuWmPRDCP4CsZyTCEHnWZdrVixeTrAR+PAY9lKF2HYfNh+M2SoNJbtsNjjkiUvDwvCGUdCNQXslDp+KQd4IboOp4JgYmU3kfrpb9odvpc+Q3EvMRLCINKZaOOZVLJOOKD+BlABD1p9iuYzPPuzoTlrlzm5YhQ-LKM4OCWWmZT4DRL8dib9PoEJkrhaY5d9i3kkG3iwgZX+DLB4KpCoamAWQgJVYmMYulI9LlFAX-gEEAA */
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
            initial: "DECIDING",
            description: "Состояние сражения (приоритет 7.5)",
            entry: { type: "entryCombat" },
            exit: ['exitCombat', "clearCombatContext"],
            on: {
              NO_ENEMIES: {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                actions: ["clearCombatContext"]
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
                  }
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
                  }
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
                  }
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

