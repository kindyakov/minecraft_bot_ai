import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCIo6ajoaJiZaako6WloKCuoqtg4Ivioaqj5q9Qom+mZKgcEYOAQkFNQayPgYpPjYmQBqGQCaGjGYq5iEUQAyCxgYAOI0Mcf4W5i4pHTElDG5UoUiYpL5ZV59XkabBUpkqVU6iCM+l6RjYJihSiUULMcK0ExAIWm4TmxAWS3QKzWqE2xB2ewOR1O5CiqGOcUu11u90ez1e73yn2KP1AZQavRUWjY+kFClGPhaEIQw2qlRU0P0DQVgzYaKCGKmYVmzDxy1WG22u322EOJw0dGOmEwMQZNzuDyeLzenA+Ai+JV+iCUJmqApaKgFbCUanMCklRi0+hqSmUOmMVgVOhM6MxmoiuMWuqJJLJRpNp0I+FwISutuZDrZzo5rq5pUQfI0CjUwwVWhMVTaNns8jUJg0lSUgaMPbYrQUvmTGpmaZ1BL1xIN5ONlI0hEox2OlAA6jamfbWU68rxq99awhE70e+f9EZVEK4Uow60NIGxQO5QLBgoJ6EpziZ4T9VJQ0KVNOgAAlMGOJJcB3O0WUddkjyKE8PQQYMLyqf05QMNRcI6Lsz0qPphlFEcQURCNvyxLV5gzWcswNKJcAuTB0DILBMDiOgNEwZAHhY9BsC2Uh9kydArlXSg4iefZcGwMDEIKY93R5eQ9GcXCPF8NgRzUKw1Hwro5DYDR9DHZolDMlpY2DRMqNTP86IA+cgKYgT2MtLieL45jWKEkTEgZRTORQ1TynUmo3CRLQB0sTxOyMtotG0Zp6kMXRXHcFR7N-bUnLnbMNDc1iPM47jeP4vzhIg-BjgZSTpIYQt5OC5TuRkNSIwbFU1AVbwVBVIxDLrBQG1SnxSKwnscuxPL8WcwrirY0gOK8irfME6r9jq8SaFa5CVI68KqhqFQRm8Ro6lUHRJQUDxTP0R6zLMtw2FwmaaPTeaCoNbBKGQchEj2yskLddqyiMFLmjlKFeqaFpVFunRGz7PQDCG8wEw+6d8oYoC-oBxINDiHBUHpXb9rB085CG0aWj05R6k-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-ovCuJQFJAwkwqfnIE2lOnfE-AYMKPCGoLdLgjUPlqJjhI-jvkBFNjNqfm0L0C0rhNGCRENDAS4h4k2IKEiAqCqnohbiHo0pZJDC8jOu8kkp8kZOFi4Mtk9vDigeGsMiIUEiYloucvgW4IMIoQ5tCIMAqD4E4pYDUMQr1o2P2KoV7gSnmkUuMhnmUgUroUOL2K8tkkYRGA0JzkZPGFtkodes9sIaMocmxMcqcg6gEm4bhAYSqN4SYX4WIkag9I9Bvl6IiDZKEWClHAWtEWAm4V1FlFhGhkkSarGM+N6BamjL2v4EAA */
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
      }
    },
    "states": {
      "MAIN_ACTIVITY": {
        "initial": "PEACEFUL",
        "states": {
          "PEACEFUL": {
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
          "URGENT_NEEDS": {
            "description": "Срочные потребности (приоритет 8)",
            "initial": "EMERGENCY_EATING",
            "states": {
              "EMERGENCY_EATING": {
                "entry": {
                  "type": "entryEmergencyEating"
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
          "COMBAT": {
            initial: "DECIDING",
            "description": "Состояние сражения (приоритет 7.5)",
            "entry": {
              "type": "entryEvaluateCombatSituation"
            },
            "always": [
              { "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist", "guard": "noEnemiesNearby" },
              { "target": ".FLEEING", "guard": "shouldFlee" },
              { "target": ".DECIDING", "guard": "shouldRecalculateStrategy" }
            ],
            "states": {
              "FLEEING": {
                "entry": {
                  "type": "entryFleeing"
                }
              },

              "MELEE_ATTACKING": {
                "description": "Ближний бой",
                "entry": {
                  "type": "entryMeleeAttacking"
                }
              },

              "DEFENDING": {
                "entry": {
                  "type": "entryDefenging"
                }
              },

              "RANGED_ATTACKING": {
                "description": "Дальний бой",
                "entry": {
                  "type": "entryRangedAttacking"
                }
              },
              DECIDING: {
                always: [
                  {
                    target: "FLEEING",
                    guard: "isLowLealth",
                  },
                  {
                    target: "RANGED_ATTACKING",
                    guard: "isEnemyFar"
                  },
                  {
                    target: "MELEE_ATTACKING",
                    guard: "isEnemyClose"
                  },
                  {
                    target: "DEFENDING",
                    guard: "isSurrounded"
                  }
                ],
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
              "UPDATE_HEALTH": [
                {
                  "actions": [
                    {
                      "type": "updateHealth"
                    }
                  ]
                }
              ]
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
              "UPDATE_FOOD": [
                {
                  "actions": [
                    {
                      "type": "updateFood"
                    }
                  ]
                }
              ]
            }
          },
          "ENTITIES_MONITOR": {
            "entry": {
              "type": "entryEntitiesMonitoring"
            },
            "always": {
              "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.COMBAT",
              "guard": "isEnemyNearby",
              "actions": [],
              "meta": {}
            },
            "on": {
              "UPDATE_ENTITIES": [
                {
                  "actions": [
                    {
                      "type": "updateEntities"
                    }
                  ]
                }
              ]
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
    services,
    guards,
    delays: {}
  }
)

