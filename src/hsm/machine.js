import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCIo6ajoaJiZaako6WloKCuoqtg4Ivioaqj5q9Qom+mZKgcEYOAQkFNQayPgYpPjYmQBqGQCaGjGYq5iEUQAyCxgYAOI0Mcf4W5i4pHTElDG5UoUiYpL5ZV59XkabBUpkqVU6iCM+l6RjYJihSiUULMcK0ExAIWm4TmxAWS3QKzWqE2xB2ewOR1O5CiqGOcUu11u90ez1e73yn2KP1AZQavRUWjY+kFClGPhaEIQw2qlRU0P0DQVgzYaKCGKmYVmzDxy1WG22u322EOJw0dGOmEwMQZNzuDyeLzenA+Ai+JV+iCUJmqApaKgFbCUanMCklRi0+hqSmUOmMVgVOhM6MxmoiuMWuqJJLJRpNp0I+FwISutuZDrZzo5rq5pUQfI0CjUwwVWhMVTaNns8jUJg0lSUgaMPbYrQUvmTGpmaZ1BL1xIN5ONlI0hEox2OlAA6jamfbWU68rxq99awhE70e+f9EZVEK4Uow60NIGxQO5QLBgoJ6EpziZ4T9VJQ0KVNOgAAlMGOJJcB3O0WUddkjyKE8PQQYMLyqf05QMNRcI6Lsz0qPphlFEcQURCNvyxLV5gzWcswNKJcAuTB0DILBMDiOgNEwZAHhY9BsC2Uh9kydArlXSg4iefZcGwMDEIKY93R5eQ9GcXCPF8NgRzUKw1Hwro5DYDR9DHZolDMlpY2DRMqNTP86IA+cgKYgT2MtLieL45jWKEkTEgZRTORQ1TynUmo3CRLQB0sTxOyMtotG0Zp6kMXRXHcFR7N-bUnLnbMNDc1iPM47jeP4vzhIg-BjgZSTpIYQt5OC5TuRkNSIwbFU1AVbwVBVIxDLrBQG1SnxSKwnscuxPL8WcwrirY0gOK8irfME6r9jq8SaFa5CVI68KqhqFQRm8Ro6lUHRJQUDxTP0R6zLMtw2FwmaaPTeaCoNbBKGQchEj2yskLddqylFZLUt8YY22aWMHwIhRjE0HSdN8aNVB6D7p3yhigL+gGgZYBRDyUg7wfkZRI1FIcVQMLCVCDSVhV6PQ9DcTxA2GVVJh-WbaO+-GdkJwHaBYIwyZCw6ykUVRTNaJndGhLDmaRuEjD7dm7pV-1GhxxyhcAkX-rFjQ4hwVB6V2-awdPOQdCDbRG1cRovRGIbbpVZwRksMd4ThOy1RTXLBczY2NFFxJzct62rhJqW2vtyznDe8wBuBXS3C9mKan0P3W1hb0k2DycBa+8OXJNoncQt7AraCyWXQp5ORg0Js21w29G2zpHlGcdmbwaIUBWhA25srwqo9r2Ogp0ROW9QuQBs171LJix3amvYapRvXtY0e1x4beuVx7D+iI+IfA6AAaToYGF7t1CM9MqwkSaJETH9R3bu8TXUuDJpRMJg2hnwrhfKuGgr6324hbVI6QyAZF4vfJByA6CkDgWkJBcRbY1mfq4FKK9wyuHiqoW6ZlNDsw8OhFUngwH-h+kBaBd8NC4CtEsR4hZkCUEeC8Nc982ExA4aQQmNxGCYFwaFI6Q5qj1HQhlOUf8ww6X-qlEBaMmweHoXjS+18WENRkvgHAYEaCriiOgaSDVJEy09DpGoZgxy9ShEKAyahyEtBcHKYU+gBwGS-to7IGQeGXA0DVKCYFSDcPQEE3A0R4iJGSGE4gCkQbkyfmFOWA0XAhhvB4RotNJQO0jC2IMqh+5ImRuMUu-NPoLECS8GC4lQnbWSZE+pPCH7N3SUdOQj1kpozRnknQopQwESRFrdmj14ogJ8bzdUNTcbtMaRcUJ5iWKPCiTEuJCQkikCsak6WlNygxk1gMnSQyCkETkFYXsJS+TlNcAE6JDSQlgTWfaTZDTOlVkXhkvpz4zkXLMoUu6-S0ZuDMoiCpTyYkhJKhkVAmB0GfI6bEHZyR4WZCRdYo5mTeitA7j2Jmwzry3ROtCEcrQERaFcIMGFLymmYsRcipZ3zQZ4L+fLWybhKiVBAd6MMXUqGWD9PFHQ9LglNPkokNpzyOkAFtBDiDADi08bBJQqGGClaGOr6gSuWZHMCMqUWxIAGZ8AADYWr4AAd1VUvfF2kaWIy6ENKGurdX6H1SE6VZATU0FgBasAYAeD2oyaNfODRJRNEjMKuNehvVSqNX61lsAAAWYALXCDAAAJzDT0zQGUQE3g1a2AFZyK1zJDuXOpcqDW+tlVs01ABDHN8r80Q3Ib0D1nrE0rIbf6gARgAV0EBaiAHb5AmVcG2LxT150Y2jW9BsX86iOx8DZMcgQ1TiD4BAOAUhq2fS6RynpY4skEuGES-JpKrmasjAMiFDy7raKNlXE9UjZYgOqN6PQcphieHzqMoyHM+jgqhM+8V1TqK4zfYVRceYP02KlERPWwz-YNAMo9Qp7hNDuEbH0qEuEhyvsnguXMy4rYWiQ0coM3aeoRnDHCdQWgwz4tXRYYUiIew0tIxA+DFHTQhEuDR08Vh8WtCVI2HSUKEqIE1b2ADX8oqwhVMCPjC1yMgSpDSOkImfndLKAqSMaH-ZD0TKxpGWTvDKGRoKYlb0AjQYchPfjWmlygQtFafT7LP2enUGNNoAxBRf0GBq4ZK6zqapvKp+zGnGE5m0yuLhPm0mnqM71Z8ygaX5zvG4EwILAwuGGb1YURG9Ktni8LYCHn8xrg3NucSonULDGcKZjDdHsMEQi80HWL0hpVCqFViOCHlzgUgtBVLhzTxmE1uoO6G7wzigKwRTwo0lPRaROjdTznQ7gM00BUbpo02CFgMIZrYUi4ruHjpPS8IN2FLbjd1675BSPN2zWnRkClqlS4hdgtcoJlNHMFCgVVyhq9EfRB2TX4Pu1K+4tDav3yo+QEv5USU2k5L2DKNKhgp11ehulcql5aRzQ8RO9vmMHDZkdckjlankUeVU2qQMJmPfkFpHED-HoOiddC6nOtszH-S9WG5A6e-3ZaDB9uzf9X8LDAbrP6PsQoRhNnbN6MXU9TbR0IF59nhm1LeHbiGM6jsDDmEs10MyJkD5q8bMMzXcPYO0+rmbPiXmVjECvtgG+Bv0tU0RA2R2Zk6hyihYmW6R8ah6CHgOaEEZsrO5p25gmOuZ6EFYnHSX8gIzJUME0ForZAPDJZsjFXowFQO+lFr366fWH4HEpxL3Pu-dNYMwH8o6uY9-tDyXxXu8xw97jyPRPte081xjvXbPHe-PhU8C4MyQ0zAigjPoW6bRC2kM8HFYEahx87GYXQHP5RE81FMDc2TP8CKuC5xBiM8JCNOapy58+B3D96NgVaLBiCkhoJP3IBjNoD4pqiKK0DhGGO4NUPfqMFCGVs-vMtTq5u-lAp-qwuwqgJwkWDwqQHwscMfrPshoAQKOfvCKYFfi6pCJUCZGUsGMYBRKYAfqgTAiuJQFJIYsYgAcrA9PGG9CMB2Ctq6u+DUFho-pZLUJUEwSdmdifkGMUvOulG9qKLdJUKNLQa4AYP3Jqn2gAdTJrJem2F-DenJuFI2C4AOGTpChTi+snnlEsq8i0hEiaroUOMlDeOjNCIMAqD4IUpYD3n+uhoNvrLYbRPYU0m8k3hsksi4T2O3LDKKCxt4VbvIPGO3BYU+jDn2jxGxAikio2g0jEXhhYYnl4Q0MkVKPnA9I9Jol6IiDZFkQOtEYQbim4F1FlIzKUT4d1rGM+L+vGgmtukAA */
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
              { "target": ".FLEEING", "guard": "isLowLealth" },
              { "target": ".DECIDING", "guard": "isDeciding" }
            ],
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

