import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout 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-Q+qJkRKlUE3EUtBeId-FcjWSyoGeKyZrLCEDinBDxSu0JEoVZUBGKuahejcuvBiKwsI6tTcLNaEsARiiLfPoYSUHWhZYlSjiLiAKQzqie1x9GcYGKnYy9Ni7dwHhPAPkUG755J6aFvColTWxQTewGB97QLFtkhhWON8RZi+nhxm+uVk7JrsnmNbFQyap7A8rWLGLiiUAUGw1FiVQjE4wY+OZbM7Vo1y2iyYT5W2WTqQ88NxVYsIwwDVMuKAbWI1hjjLaqP7m9zuc8GRWasPOYF866B4PoD3Jxz2cCZDKldzULGvALAwj0CRKqIxvCxHPizri3DuPcmFwfkX6v0WMVdsFs0GrTyU9ODDXgcMz+XtvVz2-yDewQsBhCu9igJj7zGt0ylTKZFimgtvUVBIYJMoekmVS8jBOPXzTcHvxOXeUMMWVmvi1dC6HsCOpet5IhX4l6qF58nJJCil0Jq5RarJM518sV6K6Zdi0qnCQnhDyxVhH14t7DwX6q0lO9+QasfZqYOieha+YPsvBXK-wmLosQRr1oTDBF3nhuv9i9Q1GKo7BeoB0InmNGnEht2IDRW84HoV-SHb0IHxz7yUTgX-XMkGG-W0HHG2wymPTL3hGTG0E8CUD-x-m3gQnxyAQ7mAOJy+VznVBcGqxWDjFvnQUQCfxDQ4jfnlS8yt3n0SWv23l3n3hwJ3yzgWF0lBChESjvjGGLknGfhfn1HPw+joMM2xzQIBj-nwAASoXjmARd23w13kCSj20f2GH1BfwUGLlSg-yTGoPGErTEKx3qxXBSVvxUOTHNXWG1FWQ8FvC5m9nmDaRCRYkjXcFGFQLMPwFkVgg8S8QcV3FcQsMjFDBP3jEvDqXLzUxGmZlNljBsl4RDBsi8MsR8OsUKWKU1VySGV1RCOhgumsK2GDE2AcOKwfnYjZVSkiSRnv1UFSJSAGVChGTGXyMmn9x5WpxF1og2V5mvmDB6FVCsAaLUCjxjxCPsHBGQw2AfHXUHRaX-WqOQUYjBFBHA3yMDnKxU2qNMlUHYQqx0HGArj1CEzhX9Q2KQSWHXSrn1HsG4jIMyhfBZzS2OGM3VQ3EFXJSvQuMmnRGGG5V4RVDogeLMn-TYhlSn3lV5WMJOQzUuWyO1VyIkwzQuNTAhARAGkH0nCxGjWxA90cyTCe3qJhJVThOJS9R9VwD9W+KUJa3kEnCTGN0MG4msC-1jABURwqy1AYl1mlCE0g3ONpKWzMh6DZViXDWnyCUTCfCsPaWvk4lELn3ELeOE1iHk2ROhR+L6BCUSkBLuPYkHANnGi2EGFCWDm8yAA */
    id: 'MINECRAFT_BOT',
    type: "parallel",
    predictableActionArguments: true,
    preserveActionOrder: true,
    context,
    on: {
      SET_BOT: {
        actions: [{ type: "setBot" }]
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
            "description": "Состояние сражения (приоритет 7.5)",
            "initial": "FLEEING",
            "states": {
              "FLEEING": {},
              "MELEE_ATTACKING": {
                "description": "Ближний бой",
                "entry": {
                  "type": "entryMeleeAttacking"
                },
                "on": {
                  "ENEMY_FAR": [
                    {
                      "target": "RANGED_ATTACKING",
                      "actions": []
                    }
                  ],
                  "LOW_HEALTH": [
                    {
                      "target": "FLEEING",
                      "actions": []
                    }
                  ]
                }
              },
              "DEFENDING": {
                "on": {
                  "LOW_HEALTH": [
                    {
                      "target": "FLEEING",
                      "actions": []
                    }
                  ]
                }
              },
              "RANGED_ATTACKING": {
                "description": "Дальний бой",
                "entry": {
                  "type": "entryRangedAttacking"
                },
                "on": {
                  "ENEMY_CLOSE": [
                    {
                      "target": "MELEE_ATTACKING",
                      "actions": []
                    }
                  ],
                  "LOW_HEALTH": [
                    {
                      "target": "FLEEING",
                      "actions": []
                    }
                  ]
                }
              }
            },
            "always": {
              "target": "hist",
              "guard": "noEnemies",
              "actions": []
            },
            "on": {
              "ENEMY_CLOSE": [
                {
                  "target": ".MELEE_ATTACKING",
                  "actions": []
                }
              ],
              "ENEMY_FAR": [
                {
                  "target": ".RANGED_ATTACKING",
                  "actions": []
                }
              ],
              "SURROUNDED": [
                {
                  "target": ".DEFENDING",
                  "actions": []
                }
              ],
              "LOW_HEALTH": [
                {
                  "target": ".FLEEING",
                  "actions": []
                }
              ]
            }
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
          }
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
          // "CHAT_MONITOR": {
          //   "description": "Команды игрока",
          //   "entry": {
          //     "type": "entryChatMonitoring"
          //   },
          //   "on": {
          //     "mine": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.MINING",
          //         "actions": []
          //       }
          //     ],
          //     "follow": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FOLLOWING",
          //         "actions": []
          //       }
          //     ],
          //     "sleep": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SLEEPING",
          //         "actions": []
          //       }
          //     ],
          //     "shelter": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SHELTERING",
          //         "actions": []
          //       }
          //     ],
          //     "farm": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FARMING",
          //         "actions": []
          //       }
          //     ],
          //     "build": [
          //       {
          //         "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.BUILDING",
          //         "actions": []
          //       }
          //     ]
          //   }
          // },
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

