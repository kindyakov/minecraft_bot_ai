import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCIo6ajoaJiZaako6WloKCuoqtg4Ivioaqj5q9Qom+mZKgcEYOAQkFNQayPgYpPjYmQBqGQCaGjGYq5iEUQAyCxgYAOI0Mcf4W5i4pHTElDG5UoUiYpL5ZV59XkabBUpkqVU6iCM+l6RjYJihSiUULMcK0ExAIWm4TmxAWS3QKzWqE2xB2ewOR1O5CiqGOcUu11u90ez1e73yn2KP1AZQavRUWjY+kFClGPhaEIQw2qlRU0P0DQVgzYaKCGKmYVmzDxy1WG22u322EOJw0dGOmEwMQZNzuDyeLzenA+Ai+JV+iCUJmqApaKgFbCUanMCklRi0+hqSmUOmMVgVOhM6MxmoiuMWuqJJLJRpNp0I+FwISutuZDrZzo5rq5pUQfI0CjUwwVWhMVTaNns8jUJg0lSUgaMPbYrQUvmTGpmaZ1BL1xIN5ONlI0hEox2OlAA6jamfbWU68rxq99awhE70e+f9EZVEK4Uow60NIGxQO5QLBgoJ6EpziZ4T9VJQ0KVNOgAAlMGOJJcB3O0WUddkjyKE8PQQYMLyqf05QMNRcI6Lsz0qPphlFEcQURCNvyxLV5gzWcswNKJcAuTB0DILBMDiOgNEwZAHhY9BsC2Uh9kydArlXSg4iefZcGwMDEIKY93R5eQ9GcXCPF8NgRzUKw1Hwro5DYDR9DHZolDMlpY2DRMqNTP86IA+cgKYgT2MtLieL45jWKEkTEgZRTORQ1TynUmo3CRLQB0sTxOyMtotG0Zp6kMXRXHcFR7N-bUnLnbMNDc1iPM47jeP4vzhIg-BjgZSTpIYQt5OC5TuRkNSIwbFU1AVbwVBVIxDLrBQG1SnxSKwnscuxPL8WcwrirY0gOK8irfME6r9jq8SaFa5CVI68KqhqFQRm8Ro6lUHRJQUDxTP0R6zLMtw2FwmaaPTeaCoNbBKGQchEmieJEmSP6AcSUg-rYzAAA1WErJC3XaspFDhSVzufb09A-HRpQ+6d8oYoDwcB2h9uR09RWS1LfGGNtmljB8CIUYxNB0nTfGjVQegJxzvuJnZSaBlgFEPJSDpR+RWecUUhxVAwsJUINbrZ58Oa55QBX9Pm5szQChf+sm9qMcWQsO1GtdM1pld0aEsJVlm4SMPs9DxxWHZ0XXaIFg2NGF3E4hwVB6V2ima1QuQdCDbRG1cRovRGIbVZimp9EsMd4ThOy1RTXKff1lzDYhwPg9Dq5RbNtrTzkSznDe8wBuBXS3BT5wRgz1tYW9JNc8nWaC-ov2A40IPsBDoLTZdSWa69SMmzbXDb0bVuWeUZw3ZvBohQFaFva+wvCpHseJ7DnQq5nyOBpd71LJi6PamvYapRvXtY0e1xGbeuV9--H6gOIPgOgABpOge1EYS0pqhJupkrBIiaEiEw-po63W8C7VKwZNKJhMG0X+RM-aAJAdxIOqR0hkAyLxMBFDkB0FICQtIFC4jh1CkdEEo1mjX3DK4eKqhbpmU0G7Dw6EVSeDwb7IuGhCGgI0LgK0SxHiFmQJQR4Lw1xgNkTEeRUN-o3EYJgZhFtIQnXqOhDKco0Fhh0ug1KOCOZNg8GIw+BopHcQajJfAOAwI0FXFEdA0kGoGKlggAcJlagjjSlCIUBk1B8JaC4OUwp9ADgMkgvB2QMjKMuBoGqUEwKkCUegDJuBgYJCSKQHJxAFIQPNkExQPMXAhhvB4RoctJRyBvBods3oYqtGFB3VUkwfwD3TOkl4MFxLZO2pU-JozlHgIvlAsKchHrJQ5hzZpeMzKSiRK7N2j14o4KSQM9UQzPoLFmeMi42TfEsUeAUopJTQakACdU6ukcYy9jWTpDZrSCLtLaJ0vG3TozUxGNlPupzCYXKyWBG59p7ljPmdPRZR1lnCnVmsn5Wy-l3VWRzNwZlERIi-BC6iULCljKySVDIqBMC0IRXM2IpTkjUsyHSwJNd14mVaAvHsytNkJUQI2blSDvAjg-sCfQaSKWZImay2l9KLk0FkUo9YLK2LbA5e8-oplBqxX5b8roXDnwkXUIMVwTQAikocnlaFcqNVssVTK4pWqllJIvI0yolQcHejDF1QRlg-TxS9ta-OIznVZPkpDBlxSAC2ghxBgFdUdNgkoVDDBSrTLN9RpVFMjWBaNSqABmfAAA2pa+AAHdk2o16GOAaWgbxhgFJm7NtMpWhuGeciNEyo1kBjTQWApawBgB4DW6Wpl+ySiaJGANc69C5spb2gt-alWwAABZgFLcIMAAAncd5RNAZRwU2giApPlfMvSqRdsqrl9pmc6mgRaACGu7Y0HtDCzaEra23NA7YMsljk7V3pXQ+h5AAjAAroIUtEAD3GRcMMAyT0UMrOVtOt6DZRVOB8DZMcgQ1TiD4BAOAUg87DORRHJZ9bko8qQ0glp142npsjGsgl69iUhoAzaweC1tiUZYajHB1RsYeDMkgiwn6jJ6FGiEkcUIOMWscUPCRi48wCcMVKIi-oWmZwaMh-QbT3CaHcI2FZUJcJDmU3xoCanlwhwtBpoJQZeiCnqBGcMcJ1BaGbVhs6FhhSIh7I26z-8cwgVOCES4TnTxWDrb03CwrAyIkFQgdNvZhhnXTTeWEKpgShcFsBJcppqS0nLjF1CCpIw6bxl3IMiYfMswGlGZQrNBT8rela7jYa-6Fbs6BC0VpotVkvmFVQmgxxtAGIKJBgw014z80gqKuX2sFb9v1-MijhtIyo0dKrJqfBQnfvJkwbSZYuDxr1YUFm9KtjW6p3My5Vzri3NtyBu2yjDGcDV1orZ9MJOnew6yj1WhDSqFUe7hUNtmgglBB4b2amnjMC7dQd1cPhnFKds9C3MtLZy5zfLnazn4IexFjQ67BCwGEBVsK3csPbx0npeEuG2kjE6SE1675BSuEh4xDapUuI09Rch3ZTRzBEt9X8oavQ2MKaJTzonhNxGLX5ytTy5UfICX8qJBHbylnBlGoIwU0dESS8Sm4DF8nCUpZJd1rtJOVfuTV2VbylVNrlO2rr0bwuRyi+NxLm6BEuoJNGMGJB-peq85JkbRIQvUaDHbm7OUmXJOSgjLOoUIwmxdK4ycwDesVNHxj7iQgg2vcotRomDSIZ-ONEME0SUZkTLvyz42IFufyPE+V79YvCxIKWhWMQQB2BgHl4+9LREDZo7id8EkxEiZbqfxqHoLeA5oQRnBXbrvTjo8l1HocVi5WRsV-kBGZK9fmiZ08OnKTiAm99kzwqNv+NFf8x38XMmMj8DiU4oP4fo-xI49uxGxl8cZxNr88ZF8xxQDV8d4N8o8P9Eh99x4j8dtBM1IToFMhozARR09bo7pexfBLBro4pgQ1AEDJEgFQEgDygN8ahTArALp4FmYjVWZRoFMIx4RzMus88eMD5C9nEqDiErQGFyEkgaEaC5AuZtB3UxwRxWgcIwx3BqgODRgoRrseDO8ld39KCiEZE5FUAFEixlFSBVFjg6BJDfBkp4R4RTB5cUECJjMTJVAksbxDte4t9tCBCAEhCVxKApJ3FPFLCDAHp4w3oRgOwscjV3wahkMuDLJahKgKCKcqcaCgxIxUN0pudRRbpKhZN009I7prd00b1LlJDlBRgGwV42wGMBU2lYxqgdIkQDJ5C+k95X9bUe0rkKk8kY1yiGCXAQkN9BgFQfAztexE464BocFrpjktCgMujrkf87kLl+ikFOl6ZRRvNRjGsjJ44+hBwWjelWx2jPCFi817VMhHUwMxk1iVChjoQRiGhdjIQ4R4lUdjBG1cUhpSj81C1nV+iGgLslZtjnjp1-Q+xTBOt3AIwaMCN-AgA */
    id: 'MINECRAFT_BOT',
    type: "parallel",
    predictableActionArguments: true,
    preserveActionOrder: true,
    context,
    on: {
      SET_BOT: {
        actions: [{ type: "setBot" }]
      },
      UPDATE_POSITION_BOT: {
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
              "actions": [],
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
    services,
    guards,
    delays: {}
  }
)

