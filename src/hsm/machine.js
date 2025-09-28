import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOjsXEgg-EKiElKyCGy2DuWBwRg4BCQUkbEJSaR0iVEEmdm5UoUiYpL5ZRX2iGw1ICH14U3EGsj4GKT42JkAahkAmhoxmGuYhFEAMosYGADiNDEn+NuYuO3ElDF9+QPFw6BlXhpKXgBbBUph0ajUOkqiCM+hULjYJhhSiUMLMCK0UxmYUazEWy3Qq3WqC2xF2+0OxzO5CiqBOcSuNzuDyedBeb04-QEgxKI0QalUGhUWjY+mFCn03i0WgUUIQChMOg0YJUsP0-LVamFGKC0zq2IiCyWKzWmx2ewO2COpw0dBOmEwMQZt3uj2er3evC5X1KiCUCsFUoUKiFbCUanMMvGCCMWn0Gm8yh0xisap0JkxeoaBrxxqJJLJFqtZ0I+FwIWuzuZbvZeU9RSGPoQ-LhCjU8rVWhMEKDNijcjUJiV-NDRgHbAUE98GdCWfmOYJJuJZvJlspGkIlBOJ0oAHUnUzXaz3RyPl6G7yEGm4QOr-ojKoRQilLLXAoNKGJcjgbCtJqFNPZhxah50JU1SXNClrToAAJTATiSXB9xdFk2Q9Aozx5H4+WBDRwQ8YN9AMcE1BUWU9E0JR5XFccQWRWMAP1OcjQXPMzS6S5MHQMgsEwOI6A0TBkEeDj0GwbZSAOTJ0GuDdKDidoDlwbBoLQz5zywhA5D0Zw8KFFQ2HHNQrBI2U5DYDR9AUKUtCUSzpSTcM0wY2dcWY0Cl3A9jOO4+0+IEoTcBEsSJMSBlVIw74ZHkbT4zcFEbPMIxPF7KpFCFbRrLUQxdFcdwVGcuZXPxdz8w0LyuNIHi-ME4TOOC2D8BOBlZPkhhS2U8L60wqLNJ0WMNAUNhfzVbx9K0JLZTbAbrJ8ajg3UdMdSxFzgLcxdSvKnzeP4mrArq8SGqa6SaE67lIrKLSIXjFQTE-AETBszxZQUDwLP0d7LMstw2HBAqgMNYr1rNbBKGQchEmieJEmSEGwcSUgQa4zAAA1WBPOszsbRQEVlW7BwRPQPF-HR5R0P7szW1jwNh8HaFO70L3FLQMqlFR5S7KUk2fKNBtHd8DKGlRKNUXx8qWzNCtWwGqd2GmIZYBRa3QrrzvkQbnHFUchoMeahbUZ7jE0AXBeFvSxdqGdJYB3MwNl0HaZOowlbU7qLuUOEvqF3RYXmsMDcRJVCZen3gwBcmmOl22NDlw04PtVZiGINYAGkwvR5XMYvOQYRbHRbPlXx9GRVRntMZwk3e1xOZ+lVw6Km2PLtuGFgIaTeITpPsFT476fUnq5E8RV+QHfS85MW6Jp5vRzIru8rN0Gv9DrqWG9KmONDiHBUHpHv05d1XerDbRW1cAE-Qn0ieaG5xbssKzEQJxaLcAinI8b6P7cSDet5364FediKWNbLOB+uYfSwJDJuANjZeMhEq4PwVE-XUlt-ogSBtTT+CxN7YG3mFJ2nIVZANurheUxEHytigTzZQ5c9D3mHD+WEy9rYsSjuvbBuCe46AAYQrO+kjADRMKQpMYpYz6FLnoJUIo57VxIkvcWKDX6rzNEnOgyc6AnT3oAi84CLJWBRH1FEJhgx52et4fhmUfoQjTII82yCX4RyUeBFRajv6pHSGQDIgl1GeOQHQUgm83GeLiL3V2iAQRvlZsmcaQZLAlx5pZTQhMPDhjGp4JhaCZYaGcfxXADplhPFLMgSgTwXibnUbkmI+SEag1uIwTAISD6jkVL+FJOUVRmJfAZcx1lBECzbB4dJlMo7ZPXJQOSCl8A4GgjQDcUR0DyRag0xsSgDLxjMFZLKMIRQkX1vE6ULgVSiiLjXIxgzsgZGKVcDQh1iDQVIEU9AFzcCQ1aMkG5KlNE8I0ooEW8ISb3g8ACTWpl7y4RJgqGyE5RS321M-RirlzkvEQtJa5Bx4J3IeU8jR3DM7fPeszY2BlAUk0srKFEgdCbvWSoIousK7HwtWoiy5KLoJzI4k8TFSKXnQ1IIsz5uL+6JnxoS4lwK+yuGvOCgxULOyMPkfYhFjykVXNZW3DlTLnlLKzvi-mxtRWkr7C9AlAs3CWWLq4M5SrmWXAElxDIqBMB+M5cU7lbRvL2sdVq751DzITjbF2IxQK7zPXDAIm6KzxR3m-Jap5Vz3WZEdfcjVNBclFI2MkeN2wvWCtUM4bK94wFBpStCca74qLqE1K4PqAR5UMsNBquNdqE1OuTdmi6RdrwRncBCAcpMXz9SSZYaUxj3AxuVSi5S8NnXPIALaCHEGANtExZRs0HNZddG61BjutdHaCU7k0ADM+AABtj18AAO5Ls0i2XwQ17wvnShup9Uo5FwpWvWq1yKbWTrINOmgsBj1gDADwK9igLJgm5lUPqcZB2wb0Nur9u792fv-QACzAMe4QYAABOoHNA5UEfeqMQphWErI3S5aVtFgNonXu39h6ACG2GZ1XsjFUcUcJn1PtffS991HP1XJ-UmlDAAjAAroIY9EBQPmVcF2Q5H1FO+Eg4gByYaHp5x8A5KygQdTiD4BAOAUhKP-QIQKt2vhmZ+tIYGklxbr3il1eOGE1CUQvUGW-fMZmGbfMEYqBUegVTyk8IRNj0USb-BNS5817na18aGe-FcRZvN9zKC9TQocSb32HockFYIXAkyyqKGE4JRweccQWSCZxt52hS6EhAYZONDU1HeYURjNQPvUxYUUyIBzjXKywxLhY1whCuHVxpSUBpQvBK2Ay5qV3ynU2ze8RgDLClsSZxRg3SpJbXNSWkv9xuNjVHGTL986Fpi0M9fS8ZhaDXW0CIyA2SrLmG1BO0Doxuni+T1VQmgrJBh8JqBE6grvEYi8FoxcVVtDWBM99BlXVzWhLGWL7GMfM9RO2WnwMIK7OZMKZdWBXWz4pK0ZTs8PMm7eR5ubce5pJHcZt4QUQssudhy+9MiET7LvQnElHtZM4tUYSztt7ZwYJwQQmjjOGOyhmH4eoF6WmYw+E7CuiHRiocrbW3DoXqCRevaqxoVDghYDCEZxpVbg5SErIMkZREWnTLEOHM578IYLV662y9zye0KpVToBb-usiKV9XMMXBUILgxOdNa5j3b7heebYr7ra1UApBXEpJaX+8sbhjfEk4Umm-SQkNW4aP0XkRx94wnirZVk+VV8jtNP+1SCHSz1o75ueQ8F-D8Xqo-UFNdhB8GLKlPWGYMDxdTUN9CZBaMRYMLCBiaSIlGqVsUrR-v3XoQD7befsXTTDpCMN084GHMGDqolkZ4ilum2bsCoN9r0wYsOOyREid27pcCfatkQDTzpZB6KoxcaYpcVk8YtCYYKyDCG2Es+uieGCzc38hAnEh2325m8gsYzMhgfU0onYIWJMsol+y+N+a+pMD+wMT+rcHE8kb+Kcu+aBmkt+YBgW-+eBC+bgoBAWdCkBQocq8esBNebCP8dBsu0UWUFkrOo858d4l87G7B2gyUqgtC+k6gZBTi+AqiAeqBIhmksYcIiIiIZcFeJiUYrg44LgdkEoMIxWNafBXuCOWS6hLiASaQGQpAPimh6OqW6BQs2gHaVk44E4REL47gioLmsYiIpONhVe-B22yijhOSeSqABSZYxSpApSJwHhMuXhOh6U+hVg3gRhKm0YYI5kqgs2xgdEpgqhuwIyLUEyUyX+OhBgb0KYP0t0PYBOJhKoehsiERtk48YI1Rxupu5uWh2RYYcYim70Q0worgYiU8U0ZRRkwc1CbMCGwh2RPyEoU2-qI8RapkSYioc2o4+kMqt00BCiTENGNq7ywmTyjRigpg-CBaQ0sILW-I5+asg458wC+kgiihFGMBFM1x1ybKro06DxbgRiJC48HG7xPgIKygkWKIJEAR0KvB0RwJAmKK8aDqLan6kJoILgtuuh8Jnx0YCIByiuxg0S1aFxCqjK2J36dGdxSKhJ-IBWusoOaoCJUY+ESopgP0Vg0GVkQoum-gQAA */
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
          "COMBAT": {
            initial: "DECIDING",
            "description": "Состояние сражения (приоритет 7.5)",
            "entry": {
              "type": "entryCombat"
            },
            exit: {
              type: 'exitCombat'
            },
            "always": [
              { "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.hist", "guard": "noEnemiesNearby" },
              { "target": ".FLEEING", "guard": "isLowLealth" },
              { "target": ".DECIDING", "guard": "hasContextCombatChanged" }
            ],
            "on": {
              "UPDATE_COMBAT_CONTEXT": {
                "actions": ["updateCombatContext"]
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
                }
              },
              MELEE_ATTACKING: {
                description: "Ближний бой",
                entry: {
                  type: "entryMeleeAttacking"
                },
                exit: {
                  type: "exitMeleeAttack"
                },
                always: {
                  target: "RANGED_ATTACKING",
                  guard: "isEnemyFar"
                }
              },
              DEFENDING: {
                entry: {
                  type: "entryDefenging"
                },
                exit: {
                  type: "exitDefenging"
                }
              },
              RANGED_ATTACKING: {
                description: "Дальний бой",
                entry: {
                  type: "entryRangedAttacking"
                },
                exit: {
                  type: "exitRangedAttacking"
                },
                always: {
                  target: "MELEE_ATTACKING",
                  guard: "isEnemyClose"
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
    guards,
    actors,
    delays: {}
  }
)

