import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOgU1OxcSCD8QqISUg4IcioK+hps9Wxu+spKSq46trIICio+GipabPrVJkZKajomaoHBGDgEJLnEGsj4GKT42JkAahkAmhoxmJuYhFEAMisYGADiNDHn+HuYuKR0xJQx+VLFImKShS6Xg0Si8oLYKlMOjUE1sFSMwxcbFG+laCLMyK0MxAIXm4SWKzWOU2O32h2O2FOFw05CiqHOcVu90ez1e70+30Kv1KANAXTUqn6g30gxq3i0WgUcMQChMOg00JUw30ApVakGWKCOLmYUWzEJ6xJqF2xAORxOZ0udHOmEwMSZDyeLzeHy+nB+Aj+ZUBiCUcqFkpUAzY43MUvsiCMWlq3mUOmMVhVk2xuN1EWWq0NW2NZPNlMtGkI+FwITujtZLo57q5np5Un5goUallKq0Ux0PRsEcqahMCoFIaMvcaCgUvhTOoW6YNxOzJrNFKpl0IlHO50oAHUHSzney3QVeLX-vXEJMVBpe2f9GMVENkUppQhXAo6kp9N4lBDhlp1QoJ6EpwJTNZ1JU1yQtak6AACUwc4klwbcnTZV1OUPEpjx9BA1AhC8JiDJUDBhNQVEfPRNCUWUakaSFWmjf88T1agZw2OcySiXAbkwdAyCwTA4joDRMGQF5OPQbA9lIY5MnQO4V0oOI3mOXBsCg1CiiPb0+XkPRnBhDxfHqJsrGIx85DYDRmglLQ3zHBR42w5MtVTQD9WAljQIOdjRJ421+ME4SOK48TJMSJk1O5DCtMqHSNBMNw2ms8wjE8LsKkUAZtCstRDF0Vx3BUei0yAol3JzMCvK4ny+IEoSRKCiSYPwc4mTkhSGGLFTwo03kZG06MNAUNgfxVbxby0ZLH2bAarJ8Kj8N7QqXKYtyjXnDQKu40heL82rArEhrjmamSaC69DNN66KJlilQTHfVpJmszxHzs899Det6alHIw2BhRb8VckrVrJbBKGQchEmieJEmSEGwcSUgQe4zAAA1WGrNCvR6rpFGRR9br7ZE9H0iZZR0P7GIzQHWLA2HwdoU7MZPboRUyiURimCV4wfbtBqHOoGl8CjVF8AqnMnf7lqpjyNFpiGWAUA91LOrH5EG5waiHIaDHw3o1Ge4xNAaIbemUAYg3J6cVupg5ZfpoxFYi87sdNizR16XRhnw8Z9dGBUibsz2g1BC3iqzaXbY0OIcFQRljoZutMLkHRxm0Iy4z9W6Jp5obnFuywx1GQmTBDgGw7Km3QbpyPo9ju55Yd7qmbkN9nB+8xbwhRpm1SmUc9i-R87bb65WLsWAIlymy7WiOo+wGOwvtj1labv1ambKYYVULu3Gelo-cscZP2-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-AgA */
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
            exit: {
              type: 'exitCombat'
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
            "invoke": {
              "id": "combatMonitor",
              "src": "serviceCombatMonitoring"
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
    guards,
    actors,
    delays: {}
  }
)

