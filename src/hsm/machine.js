import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9tPGYSQASUwUzJfOgtXLuSmzOGgoO2tpKetoO-gclnKCncPlULzY2ncCgMekcLQcHUOXXCvWYqmQ+AwpHw2CyADVMgBNVSxC7YTCEaIAGUxGAwAHEaLEafhiZhcMNiJRYjdeAJZqUFogvKpbDsNGx3IYNACNGsEH93M42HDtPY-kY1UpkUc0ZFiJjsehcfjUETiKTyXiqbTVORoqgafEmSy2RyuXQeXzONNBfcyogHEolBDXj8VtpWr9Fa5bKo5e5of9bP8Q2xdQd9T1DcacXjCSSyRS7XS6DTMJhYm7WezOdzefzCgG5kG6gYNOGVO5IY5jKtrIg9EptKpvAoJfozP8WnrUbnTvnTYWLcWbZTqXTCPhcKFmXXPY3ffkBcU2yKEA5bCrPrD-koDA4PjLFXIHAZE9e2LY9B+VgoyjuPOYSLhiWIFualrWqWW6qIQlA0jSlAAOq1h6Dbek2fq3K2wqgOULQqh+RHaPC7hQmqtiKi4CiqD+0b2NK0JKCGCggcc6LUMuZpFlaJa2nBdCXJgNLJLg6H1l6PrNncF4EcG0qqPKvbJjoAIOO4ipaE4tiwgouigvCPjaBxBpLhBK5QcWYyMpg6BkFgmDxHQqiYMgnJ2eg2DEqQFxZOgzIIZQ8TDBcuDYNcOFnkKDwyPIWgJipvhsCs-h-lpQ4VG82jKKGabKAoUoOMYBhmWB3GWbxa78bZ9mOVWLluR5uBeT5flJG6sl4XFix-HRBjxiOyymJ4FhZc8YahqGXyZqYWzAdmC4nOBJrVdBqh1Q5pBOU17mefZ7UifgNJusFoUMLukXdee+HxRUGijqoCiZl8H43pmeiZbUDh0XlSg+AZ0q9h+5UrZVa2rhtW0Nc5rn7a1h2+cdp2BTQN2xe2zw-uO7gGIxEoGADnhxioqjfBTBmAXobAAmDXFGlVUPFtglDIOQSQ0OglB+VgaCYHQGOBpeyZjmmcrURNhgJm4nzfL86Z-vTeZM9Z-Gs+znP4OgJ3EgAWikGsc6w0UtrdvWINoLSqlK0J419LjaG+0vvHLPx-ACStLaB4OM5DaukkbSSqOc2CoK6aNC-J92KPj4q9lUj6eFbmZxmYTiaZncqfE+N7KxZ-t8YHbPGyHODh11CinmbmOXrHYsJ0TScmKnWWuN4yl+H42cftei2dD7DM8cz6sl8HocV5HejV3Jd2LPe8cyk3BjJ1K1Rt9sndZ79vd597nEq4XNXF5rRoTxHzIsBoM89VjC83kvoYry36+1KCKxb93O+5-3KKD4fkEi6qCDkaQglZMBumILuOyZBIrazsvEKOc9hwwmej4QwP5PiOEGgYOMj0wyZy-jnPu+dVqAOPsAseoDwFuhRsQS4pBcACx5EwxBptZ4WwQC0P66CjB6WvB+cab83BvGTNvYhe8B4HwLuQjaIDMSiSrLiYgUDsAAGlIHQMYKQOBgVnJIM4XIR85NQyFWbinV+iBQQGE-DCGUtM8ZgmMKQiGsiWZUIUeA5RqiNFoygYjWBlx4H6Krv6c2WNWLk2WL+OEaZsFfDjAicm-wiG71-jmX2w8A6UNPp4pRSQfGaICTooJejEHTzCbXBSFQfibBUPU5+Fi4yaTeIQ5838SH73MmQqyQD5EeS8QUvEvjmT2Xcr5cgOB8AeVIDuXABiIljh+PU5QjS15xjlp-dpEj0nLSHqrPpHiBn5JUcM2hFwxIMLwJkVA2AToLLrk9ZZZi1mtzfqxT8X1xFpJcX7Nxo9ckEDKd4s5fitGBOCWwm+4S64fXHPoKEuU1mKh+AmBF7sfjeEGhoX5WTDmAshSC9RRSYElMhSwUJuEYXVKMaleiv5EWwlXmnfwEJUw3mzjTCUuKDkUPkUChBRKRk0H8aS3RCCWAVKpVUmOyx4U02+Eyl+KKdBbJ7rnLMUjumuN6XyjxArnJCrdGM5AEypkzOwMhBgDyaW-npQqpFq83lWOMElLu2yfldIqn83Vcj9WEqGcStGdCrkSSyHcmkNrZV6HtYy15liEDRgzu69V15NV-2kT09a7jcnnEIPZC+XNqDDDGLgSg0R0DnChZU4W1S4nin-HbOEMoDJxihCqb43yf48qPn63NVIC3nJOvQnRYbbn3PYbfS89bsHtvti2p2bdpRhk7ak7tXrMm8o2lAugai6Do0ndS+6FEcpmF-I9GJvYNCSzft4GN00SryhaINXZ-8ZG+uLDuvdZc0gZDIJkdy+6APIDoKQc4v6APVulbW49Lh1ApTML8UEpgbxxlyk4LQWg-DSkzJ4Ht-zSRftckw2I2IuS7mQJQLkPJEL7pI2RnRbNWSMEwFG8of4uysRKi8UajEhHDlSve6ag1Uq0yKq+zNOrs38SI-BSgIUwr4BwJcGgCEK2hXOmxuwdKbErFYmRXQKSgRtx+HRL68sNQOJXjynImQqNMlUCG0glH0B2dwDEBISQUghq0xUScLwbbxg8BKAy-GKjwmUh8TsANAKYqtumjJ+zbMsIc05lzbmD3QplYseW9FROpWCx8XKio7WYa0N8Mag0NQJb2SrZL9nAqOYrXZLk6WWEecGCkTTh7svyEnNbfLBWwRFbC3IFwxEosXti4+aENnXMpca5cZrDY2tUcyzW6OOXamDeMMNqmb4iphny64XK9hfzsQ3Ul+bDXGRuQcjcgWzn6vuYGF53mWQsgC180sOVgFfpPhXiFsizS3hMu8FGMizE5tuYc-VB7oHVvuaYZRgkKQ4dWm+-5hMuhfgjT28DrKGV6L6T8CGFwj19hau9ZiZ7sP7ufYR899b0HNvyA1MRAcbh2k4IVITp6ZXTA9jGjiy7dXrsSUa3AsgiOaAAFtBDiDAL5tgioYSfmmhrzXSJRcWVp5LoJ0umcADM+AABtTd8AAO7fdvClXHNEAua6d6GUyOvwJ69u1Lp74uaCwFN2AMAPBMfkwltpfnAuI8i6p5uj3wCDfe4y7AAAFmAU3wgwAACdvtOE0IYeMqvjE7aLzVt97vxcOa9zLo3ABDDPsvfODjftCeDzuNeu+j1dmH+ukgJ-awAIwAK6CFNxAb7bwXBPlFhTafvgb2ilps9FeRNr0+GKsoIIBxxB8AgHAKQiXDQbeQX53wYY-uwg-Pj0bN4M4fFmiVOEHxbD4Y-VaQ-hi3qJkw68FfthOxvjlDGs+HLLTGqLLBJtqj6tJjBIJLSG-u2EVE4L2CFqsgIqLM7HKK7G9BRKGGJuAdTluuuLBPaOHJWHAdOppOoK9KOCOGqH4Aml9IvnjCYKitgr8M-lAQJJuPaKEEyGQdUmYLeLFgCJ8KlGdmFmrowSvENKlK8HgZur2oQTAXSI6M6BfHwfdP8GOEgR8I+PCM+ETHGBROOHpHpJmNKFOO0G7lJiPNAVweWOAjWIFOoeUNfs9D2D4BmCvCGKrh8JITCPCDTGYXIfsgofxBuGWPBBRrwSzkfpocTuginIZIYAdjjLLF8Bip7I+OwTYZwREQhEhKhNETFDBiCB3NoYBI+Kgd8NpHRKYjoLlK4F-FHhmhAXihQuEUJCJGJJyEUTXCUYgEYDGn4EVKvsNE-D4X9Evv4QykEdkdkh0faEnoILAMIM4QJp+OfssKlP4LEpoG+HHN+CsDTMmJCC4HMUAjDDtI1HQGsRUJpGOGVt-mdn-lLL2HlqJp2L9KxBRGVFYZATkZcbtPDC1G1L5P5L0RwljCVHRI8a6vYC8U8NTO8UcadpqBdh3gAi-qSICdcc1AdN5MjBchCVOjStCZ-loE8fCbzrUE9FPk+LQSDO3i0fgaESfMbLcUYnjLGoqsillCVIAV3ArFxsmL8Rie+hwfIufMSUeosP4cYR8k-E6gmqCL4OTEZMoDTCvHNOcXqrkmAlWNKb1ggETOoL9LoPYFgh+LCGnNeskl2p0mKVmjkf0ooikIGiMhycnM9K9MvEqYYRFkBC4L8LQdqX8W0X2qXAaqFO6Yaf0RUBRDGmVsmEqk0m3C9F2GImug6cyfIQRjkqXHmoOk4TEZwoYImeaU2g7AZNSS6s3quh6uuo6dYdkkRhyaOGGNgmYN4JqNenGEYJ+NKIVLRCKZpDqduvgLuq5OBukJkKQMBjcSWREn4BCGCDCK8IBEVP8GhkYYOaOOqO7JTjmSEXmbJvRqgORnuFRqQDRjSAucUazhUL4J+J2dLD2XPkqLTA0OhoJvYL8KKUeZiRwbJudIpspm2agppDOLTPjEZLgoTjTLUeZuqGmDYnKGOcWEsSsbcQZsktPpmK8I7H2WmPRDCP4JuZODeOiQBbruXsWfeUfksNGM9HeADpfv-sYHlr+ADJRDKCGCXpJozLHmls9hye3DGvCDIdCCGKmAmrHOKDYnEj8f5o9NDgtrdktnoq1iJYuXXO3MRLCFVnQTJc7JOOKD+BlABHFsEWLl3rdujqgI9ojqJbKM4FsaOEZWmjRGqM4CDC9COOTr8NZTRbZXHj3k5TpTSq4NeO8KpCDKOJ5VlB4CqKYEYOlI9LlCfhvgEEAA */
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
            exit: { type: 'exitCombat' },
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
                      guard: ({ context }) => context.health <= context.preferences.healthCritical,
                    },
                    {
                      // Новая цель близко - перезапускаем атаку
                      target: "MELEE_ATTACKING",
                      guard: ({ context, event }) => event.distance <= context.preferences.enemyMeleeRange,
                      reenter: true
                    },
                    {
                      // Новая цель далеко - переключаемся на лук
                      target: "RANGED_ATTACKING",
                      guard: "canUseRanged",
                    }
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
                      guard: ({ context }) => context.health <= context.preferences.healthCritical,
                    },
                    {
                      // Новая цель далеко - перезапускаем стрельбу
                      target: "RANGED_ATTACKING",
                      guard: ({ event }) => event.distance > context.preferences.enemyRangedRange,
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

