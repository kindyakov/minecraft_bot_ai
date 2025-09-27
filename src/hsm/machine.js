import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCIo6ajoaJiZaako6WloKCuoqtg4Ivioaqj5q9Qom+mZKgcEYOAQkFNQayPgYpPjYmQBqGQCaGjGYq5iEUQAyCxgYAOI0Mcf4W5i4pHTElDG5UoUiYpL5ZV59XkabBUpkqVU6iCM+l6RjYJihSiUULMcK0ExAIWm4TmxAWS3QKzWqE2xB2ewOR1O5CiqGOcUu11u90ez1e73yn2KP1AZQavRUWjY+kFClGPhaEIQw2qlRU0P0DQVgzYaKCGKmYVmzDxy1WG22u322EOJw0dGOmEwMQZNzuDyeLzenA+Ai+JV+iCUJmqApaKgFbCUanMCklRi0+hqSmUOmMVgVOhM6MxmoiuMWuqJJLJRpNp0I+FwISutuZDrZzo5rq5pUQfI0CjUwwVWhMVTaNns8jUJg0lSUgaMPbYrQUvmTGpmaZ1BL1xIN5ONlI0hEox2OlAA6jamfbWU68rxq99awhE70e+f9EZVEK4Uow60NIGxQO5QLBgoJ6EpziZ4T9VJQ0KVNOgAAlMGOJJcB3O0WUddkjyKE8PQQYMLyqf05QMNRcI6Lsz0qPphlFEcQURCNvyxLV5gzWcswNKJcAuTB0DILBMDiOgNEwZAHhY9BsC2Uh9kydArlXSg4iefZcGwMDEIKY93R5eQ9GcXCPF8NgRzUKw1Hwro5DYDR9DHZolDMlpY2DRMqNTP86IA+cgKYgT2MtLieL45jWKEkTEgZRTORQ1TynUmo3CRLQB0sTxOyMtotG0Zp6kMXRXHcFR7N-bUnLnbMNDc1iPM47jeP4vzhIg-BjgZSTpIYQt5OC5TuRkNSIwbFU1AVbwVBVIxDLrBQG1SnxSKwnscuxPL8WcwrirY0gOK8irfME6r9jq8SaFa5CVI68KqhqFQRm8Ro6lUHRJQUDxTP0R6zLMtw2FwmaaPTeaCoNbBKGQchEmieJEmSP6AcSUg-rYzAAA1WErJC3Xaso2ElNgPunfKGKA8HAdofbkdPUVktS3xhjbZpYwfAiFGMTQdJ03xo1UHpMcc76cZ2PGgZYBRDyUg6UfkZRI1FIcVQMLCVCDSVhV6PQ9DcTxA2GVVJh-WbaM5wDuf+-G9qMAWQsOspFFUUzWhl3RoSw2XabhIw+0Vu7bf9Rp2bmzNdY0HncTiHBUHpXbCZrVC5B0INtEbVxGi9EYhtulVnBGSwx3hOE7LVFNcu172XL1iH-cD4Orj5422tPORLOcN7zAG4FdLcJOYpqfQ09bWFvSTbPJy1r788Kv2NAD7Ag6Co2XSFquvUjJs21w29G2b2nlGcRWbwaIUBWhT28-on3h9H8eQ50Cvp-Dgane9SyYsj2pr2GqUb17WNHtcKm3rlPeB4PguNGIPgOgABpOge1EaCyJqhBupkrBIiaEiEw-pI63W8E7VKwZNKJhMG0H+-4fpAUASA7iAdUjpDIBkXiYDKHIDoKQUhaRKFxFDqFI6IJRrNCvuGVw8VVC3TMpoRWHh0Iqk8Hg7GPsiGgI0LgK0SxHiFmQJQR4Lw1xgNkTEeRUN-o3EYJgFhptIQnXqOhDKco0Fhh0ug1KODGZNg8OInW-8pHcQajJfAOAwI0FXFEdA0kGoGOFggAcJlagjjSlCIUBk1D8JaC4OUwp9ADgMkg8R2QMjKMuBoGqUEwKkCUegDJuBgYJCSKQHJxAFIQJNkE82A0XAhhvB4Ro4tJQR0jC2IMqg15IjpuMXumtPoLHSS8GC4lsnbUqfkkZyjwHnygWFOQj1kqM0Zs0nQopQwESRM7RWj14o4KSerdUgysYzLGRcbJviWKPAKUUkpoNSABOqZXcOMYnarJ0us1pBE5BWF7J0vkPTXBpMKaMrJYFrn2juaMuZU8FlHSWcKZ8nzvlmTaXdFZjM3BmURL00FRSsklQyKgTAdCYWzNiKU5IxLMhksCVXZQ-oGzLzbEglp15bonWhCOVoCItCuEGAS8F4zaWkvJecuFVYL6LKSReRplRKg4O9GGLqQjLB+nijoYVmTxnyUhhS4pABbQQ4gwAMtQmjAiKhhgpTJva+oOqLm+zAgayVAAzPgAAbL1fAADuFrFm9DHANAVNMuhDVJg6h1+gnVZP1WQQ1NBYBerAGAHggbEWjXbg0SUTRIzqsLXoONerXWJslbAAAFmAL1wgwAACdM1m00BlHBN5JQCl7J87tTMS2XITdMsFsz3UAEN61GqbYgLZXRRS9GjTGvtLq3VDuKQAIwAK6CC9RASd5QTKuDbAkp6x7mZ5reg2JBdRI4+BsmOQIapxB8AgHAKQOd+7wrDoskNJlWjzx7DLDZnLfk2sjKsnFwK7qOMHtsD9rCzY4OqN6PQcphieHbtOtSGy+jYqhBB7VAzqJYycYVRceZYOGKlERd2Gz04NAMo9Np7hNDuEbMsqEuEhxQb-iR3My4g4WnI0EoMc6eoRnDHCdQWgwzBsvRYYUiIewCq4wtBcvHTQhEuIJ08Vhg2tCVI2HSeKEqIBtb2VDSCoqwhVMCZTBCcwgSpDSOkmnpUIrKAqSM1H06b0TFJ2m9TvDKDpoKADb0AgEYcl7bjqmHNmgtFaFzSNP1HVUJoMcbQBiCiQYMDtWHzM2pvFZkLtmubASXKaAsRZEuQOS+53qz5lACvbneNwJgMWBhcBs3qwp2N6VbCVn2pHlyrnXFuarNTibeA0F52jwmGMESw80V2L0hpVCqAN-+Q3QIQSgg8cbrywpmCduoO6N7wzija9avLl6CtIiZjZiLudf4qaAlt04lbBCwGEFp1CXcL1bx0npeEN62kjA0AD1675BQgse-3fBpWlqlS4j9xZ9HdlNHMHilVvyhq9DA7hozX5YdDIkf-RHK1PLlR8gJfyol9sysRcGUaQjBTXq9DdX5fKUU6XA4Tjbi0NpI6p5VTa5Ttr07c92Ec6PWdY4510LqR62wSf9L1fnv19aJBR4z1uSGPBmSQRYDD3RHp9iFCMJs7ZvTq9xpr3EhB4sS9q2pKbtk2g3wMOYPzXQzImTfhbxsGzrfE6I9B23RcFiQUtCsYggDsDAKd3BkWiIGyRwN74JJiJEy3Q-jUPQm8BzQgjNlEPHMw+F3xiPQ4rFS7a7NhGZKhgmgtFbGhjZcs6Zm9GAqQP0obcV8SDI-A4lOIx7jwn8SdfuyNjz8hg3bfjduDHLPgv29i-999nbqvY9a+ued8daouGhpmBFBGfQt07q9l8JYa6cVgRqA3y4qf5Ri81FMP8ozKCCKuGl7hiM8I2NwsNZCMy9otCEgFpEGFyFSAaE6Bn85BmZtA5UxxeVXYYlv93BD8rJRgoQesgCTkQCosXsdgXEZE5FUAFEixlFSBVFjg4C98k8X8BQ394RTBP9w1IRKgTJulgxjAKJTBH8IDXFKApJ3FPF4CbYHp4w3oRgOxLsI13wah6MADLJahKgN8Psvtn8gwOlj10podRRbpKhRoeDXADA14bU+14DRYnZf1hh-0OVjNwoZ8bwecCdEQzDF0Kk8lDVrChxkpXCVRoRBgFQfA2lLBZ9kMaM1sPZS88pzkIUoVblzk-CexwcKZZ0QiGhvd5B4xwcQlecPCidgDItaIEjRU2ISUyVB0ilUjmMQli8siwjaZ24HpHp7EvQs83pF0B1fCGCKNFBwxIwsppYmicjCITJM4i1FZ71-AgA */
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

