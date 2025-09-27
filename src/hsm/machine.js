import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCIo6ajoaJiZaako6WloKCuoqtg4Ivioaqj5q9Qom+mZKgcEYOAQkFNQayPgYpPjYmQBqGQCaGjGYq5iEUQAyCxgYAOI0Mcf4W5i4pHTElDG5UoUiYpL5ZV59XkabBUpkqVU6iCM+l6RjYJihSiUULMcK0ExAIWm4TmxAWS3QKzWqE2xB2ewOR1O5CiqGOcUu11u90ez1e73yn2KP1AZQavRUWjY+kFClGPhaEIQw2qlRU0P0DQVgzYaKCGKmYVmzDxy1WG22u322EOJw0dGOmEwMQZNzuDyeLzenA+Ai+JV+iCUJmqApaKgFbCUanMCklRi0+hqSmUOmMVgVOhM6MxmoiuMWuqJJLJRpNp0I+FwISutuZDrZzo5rq5pUQfI0CjUwwVWhMVTaNns8jUJg0lSUgaMPbYrQUvmTGpmaZ1BL1xIN5ONlI0hEox2OlAA6jamfbWU68rxq99awhE70e+f9EZVEK4Uow60NIGxQO5QLBgoJ6EpziZ4T9VJQ0KVNOgAAlMGOJJcB3O0WUddkjyKE8PQQYMLyqf05QMNRcI6Lsz0qPphlFEcQURCNvyxLV5gzWcswNKJcAuTB0DILBMDiOgNEwZAHhY9BsC2Uh9kydArlXSg4iefZcGwMDEIKY93R5eQ9GcXCPF8NgRzUKw1Hwro5DYDR9DHZolDMlpY2DRMqNTP86IA+cgKYgT2MtLieL45jWKEkTEgZRTORQ1TynUmo3CRLQB0sTxOyMtotG0Zp6kMXRXHcFR7N-bUnLnbMNDc1iPM47jeP4vzhIg-BjgZSTpIYQt5OC5TuRkNSIwbFU1AVbwVBVIxDLrBQG1SnxSKwnscuxPL8WcwrirY0gOK8irfME6r9jq8SaFa5CVI68KqhqFQRm8Ro6lUHRJQUDxTP0R6zLMtw2FwmaaPTeaCoNbBKGQchEmieJEmSP6AcSUg-rYzAAA1WErJC3XaspFDhSVzufb09A-HRpQ+6d8oYoDwcB2h9uR09RWS1LfGGNtmljB8CIUYxNB0nTfGjVQegJxzvuJnZSaBlgFEPJSDpR+RWecUUhxVAwsJUINbrZ58Oa55QBX9Pm5szQChf+sm9qMcWQsO1GtdM1pld0aEsJVlm4SMPs9DxxWHZ0XXaIFg2NGF3E4hwVB6V2ima1QuQdCDbRG1cRovRGIbVZimp9EsMd4ThOy1RTXKff1lzDYhwPg9Dq5RbNtrTzkSznDe8wBuBXS3BT5wRgz1tYW9JNc8nWaC-ov2A40IPsBDoLTZdSWa69SMmzbXDb0bVuWeUZw3ZvBohQFaFva+wvCpHseJ7DnQq5nyOBpd71LJi6PamvYapRvXtY0e1xGbeuV9--H6gOIPgOgABpOge1EYS0pqhJupkrBIiaEiEw-po63W8C7VKwZNKJhMG0X+RM-aAJAdxIOqR0hkAyLxMBFDkB0FICQtIFC4jh1CkdEEo1mjX3DK4eKqhbpmU0G7Dw6EVSeDwb7IuGhCGgI0LgK0SxHiFmQJQR4Lw1xgNkTEeRUN-o3EYJgZhFtIQnXqOhDKco0Fhh0ug1KOCOZNg8GIw+BopHcQajJfAOAwI0FXFEdA0kGoGKlggAcJlagjjSlCIUBk1B8JaC4OUwp9ADgMkgvB2QMjKMuBoGqUEwKkCUegDJuBgYJCSKQHJxAFIQPNkExQPMXAhhvB4RoctJRyBvBods3oYqtGFB3VUkwfwD3TOkl4MFxLZO2pU-JozlHgIvlAsKchHrJQ5hzZpeMzKSiRK7N2j14o4KSQM9UQzPoLFmeMi42TfEsUeAUopJTQakACdU6ukcYy9jWTpDZrSCLtLaJ0vG3TozUxGNlPupzCYXKyWBG59p7ljPmdPRZR1lnCnVmsn5Wy-l3VWRzNwZlERIi-BC6iULCljKySVDIqBMC0IRXM2IpTkjUsyHSwJNd14mVaAvHsytNkJUhIKBsSDvAjg-sCfQaSKWZImay2l9KLk0FkUo9YLK2LbA5e8psMSCKwkjCOHB6hBiuCaMMaVRSqUarZYqmVxTWK8WEqqziWqlnr16GYAUbYkEtOvLdEE8T1CJkMA-PGagLWUrldahVMy7VIqrJfJZSSLyNMqJUHB3owxdUEZYP08UvakocnlaFEz5KQwZcUgAtoIcQYBXVHTYJKFQwwUq0zbfUCNsqrllrIBWmgAAzPgAAbIdfAADu9bUa9DHANLQN4wwClbe22mUrC35xGXarJPbY0PNgEOsAYAeCTulqZfskomiRhzVevQnbLn+zAuWpVsAAAWYAh3CDAAAJ2PeUTQGUcHzoIl6jFXyvnHLzsM85m7S0Pt7Uq-tABDT9laf2hhZtCJdy7mirsGWSxyJbu2wZ3YigARgAV0EEOiAP7jIuGGAZJ6jGVnK3PW9EVZ0nA+BsmOQIapxB8AgHAKQEHPrIojm6nBN0-nNoNfiqE69iUFtw0WweC1thiZYajSTNQ3ZymGJ4dOaGjJ6FGiEkc8miWmscUPCRi48wacMVKIi-oWmZwaAx-QbT3CaHcI2FZUJcJDms2poCdnlwhwtA5oJQZeiCnqBGcMcJ1BaAXex706dhSIh7HO4L-8cwgVOCES4UXTxWGnb03CjYdKWabS2-TSCoqwhVMCXLgtgJLlNNSWk5cSuoQVJGFzeMu5BkTCllmA0ozKFZoKflb0Ahrsg-g2zuZlzmktNacSvWwqqE0GONoAxBRIMGE2vGaXm03iazN1rfswumgLEWYrCaUVlH68+ZQc7053jcCYNpMsXBhv80qcMvdlPrr-m127+Y1wbm3Jtp74mjrDGcIN1orZ3MJPPew6yj1WhDSqFUa7y2CtmgglBB4j2kYI7KGYF26g7pcfDOKH7QHTv1fO0iTmLWFtnKW4VSHGhn2CFgMILbR1u4iu3jpPS8IuNtJGJ0kJr13yClcITxaG1SpcVF6jBjuymjmCJZmv5Q1ehrIJQp1X3PCbiPV+5Fanlyo+QEv5USFPIFU+7COPXgpo6IiN4lNwIHzeWZJaDxbNvGIa-t2VbylVNrlO2m7mpNdgyjUET7w3UmuhdQSaMYMSD-S9TV79I2iRtfdlTtjDwZkkEWCM44R6fYhQjB1UCpTJy8N6xs0fUvuJCAWkwEnt5SzEwaRDGdaOBhzBja6GZEy78W+Njb8XkmveFiQUtCsYggDsDAKH4m1F68GzRxr74JJiJEy3U-jpywQYBzQgjOCsPPOI+r5LqPQ4rEevw80-ICMyUQ1mhM4DM8ZJQ58m9RgFQl98Yrd+YnE38yYZF8BxJOIt8d8984dKdf9f1Gwb9q99M68r8xwb8t579d4n8O8VMD5u8S938T5v8sDHMo4Tp5MhozARQIxPM15ExtAeFPA4pgRw1YCu8QsdgXFy9yhH8ahTArALp4FmYuhXAvd5MIx4R-N5tn9rd4CxCgFpF6EyFSBqE6AJC5AuZtBk0xwRxWgcIwx3BqgVDRgoRhQrAV8dCiEZE5FUAFEixlFSBVFjhjCf8mDfBkp4R4RTBLMUE9VKgTJVAqtjAKJTBXDJFdDXFKApJ3FPETC7YHp4w3oRgOxmdFD3wagGM1DLJahKhkjBdhcJCgxIwmN0oVdRRbpKhTNm09I7pCU4jb199ntpZBgFC1JzB1YkQDIrC+k95hDaICNJlappkK0TDvsXYbxOZoRBgFQfBftexE464BocFrpwN+4edZjYUUC7kLkljTALx6ZRRktNiZ95B44+hBxxjelWwpjND8NoMrl5U6ViNlErjvQXAQlH8NiGhHiEBxcTcmxjA51cUhpeiYNH07UriGh-slZ7iITz1-Q+xTA5t3AIwZ1VRAggA */
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
              "type": "entryCombat"
            },
            "invoke": {
              "id": "combatMonitor",
              "src": "serviceCombatMonitoring"
            },
            "always": [
              { "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist", "guard": "noEnemiesNearby" },
              { "target": ".FLEEING", "guard": "isFleeing" },
              { "target": ".DECIDING", "guard": "hasContextCombatChanged" }
            ],
            "on": {
              "UPDATE_COMBAT_CONTEXT": {
                "actions": ["updateCombatContext"]
              }
            },
            "states": {
              "FLEEING": {
                "entry": {
                  "type": "entryFleeing"
                },
                exit: {
                  type: "exitFleeing"
                }
              },
              "MELEE_ATTACKING": {
                "description": "Ближний бой",
                "entry": {
                  "type": "entryMeleeAttacking"
                },
                exit: {
                  type: "exitMeleeAttack"
                }
              },
              "DEFENDING": {
                "entry": {
                  "type": "entryDefenging"
                },
                exit: {
                  type: "exitDefenging"
                }
              },
              "RANGED_ATTACKING": {
                "description": "Дальний бой",
                "entry": {
                  "type": "entryRangedAttacking"
                },
                exit: {
                  type: "exitRangedAttacking"
                }
              },
              DECIDING: {
                entry: {
                  type: "entryDeciding"
                },
                always: [
                  {
                    target: "FLEEING",
                    guard: "isLowLealth",
                  },
                  {
                    target: "DEFENDING",
                    guard: "isSurrounded"
                  },
                  {
                    target: "RANGED_ATTACKING",
                    guard: "isEnemyFar"
                  },
                  {
                    target: "MELEE_ATTACKING",
                    guard: "isEnemyClose"
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
            on: {
              UPDATE_ENTITIES: {
                actions: ["addEntities"]
              },
              REMOVE_ENTITY: {
                actions: ["removeEntity"]
              },
              ENEMY_MOVED: {
                actions: ["updateEntities"]
              }
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

