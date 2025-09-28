import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout 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-CqhcGq-Y+KdXnD1V6+SPq-Vko9aastixOV-hzG4PEy5Jz4jzEVQshTuEqAcW4DNnq+UWUJgGmgABbQQ4gwBDsQGwAk7hJzqDFuemqK7eX-CHnhDdeaABmfAAA2z6+AAHcD0VDHL4daMtagbSqhei9OjtWa07QO-VN711kE3bAZ9YAwA8C-YobyOJ-2IDVXO+dOHClXqg7e+9kGaCwAABZgGfcIMAAAnFDTh6ryKAsemctLrVyrxd4oh6Eu1rrvbBx9ABDajW6v25lqHqEkwGQP4Z+TB-twKaAACMACughn0QBQ15Fws5LSQz0zqW2nE4ZJqBvXHwQVlBBAOOIPgEA4BSGrJrWhFqQ6+HVNuCcMaFUovtSewscrnUlkpIFd5p9GzOaFjC+RP1CmWknJ4FiYm8oItRHMwLrqQtgc9pnQe54WwRbnuUQKTgMzIr-jabRKiPLjucAi2qOoiS4g3KFvxTY+QBhvsGArKS6jsXUMtAsRUyR+GqDOscv1kwsR1PUIGbbOMEoqRdbC7WfihABN1wZG0o16lxOOBWrrj2nvi79QqitMQtcqe1PLl5BTCmgRt4c1pCylYRTOHhLRRviZAkWZWS0tQKrhnNxz2WwvLYvAGIMIYwwGQe9+YCTgAoR3tL9VUx6UvHZPUBWGDpztZd8ZdsHLYryNPWx+aFc0nsNp8ESDuKxDD2qWmaNw44nmNf8DOC7S2pLXYDNeW8D5SdU0i3NScZoXvbhnBV3TnF0kqB0D5Vwfhvqc+9m18HPx8KEWIoLyuwvyhGFkX4QK5mio+BnGjqCGPTs468cD-HXO1dE9I4IWAwhYe2TwXItcCt-DknM-ahh3vXDwUzG6vHxCCcxQevFJSdB3fz20SytVq97DJntRtEkAWiRBZschcPgiHcdU0jH3qyVUo6T0jrh+NNgpQXnVqMza9p2Lhhk67PGWVfLKuiXu6ZeBpPTeC9f48fFi16Tw35uae8wLV0-qYKv0My1U78IiBI-5CqiwbFnyv0TBJYQIhFMHcpwTjZmU-PejI-n35leYMmAq-mJhS0ByOY-r1x0MYT7iAfI721Mf8cqrl8wEyF1Jb8J5S579ycQ5OFjdt9fBOV7AWhW41BmYeFlg+FbcToQdWtwEL4glCA5J7sycXN5ACx1RdA1UVAZwEsEUCRv91F9RrR-8p1ADSEIFVBR5ZITIkhJ5p5h8iC9d19xwiwt94td8kD1QUDHA0DNQtV21wMcsgC2DRFCChdCs8papvIFUQJ34pxP5Y5XB0kclk4QI-AWCDF8AjE49+C1CKhgpZFyRyQ25KRHFY4-BCxs8CxyRWcgdMD7dVcVkLDAk4kQkyAokrDVCes5BiphkR1lAtxAprRQYVAHkfJPCiQGsfCfEI9C9VkOkulGlmlSBWkvhwjdcbCojgIixDAzAAYbEXDxNXlUQT1gp9BBINwCF5sO0FD2pVkxpNltk18Kg2hvJAIiQ4Ypx5wDAnF-AixtEvDbQGYcQzCpJndXdBjHBCx9M6otQXAqtxMcQoJgJxwW0XUjiZMYdrDIiSx9Qo1PNlxvN40PIMQUx9s3ItwcVZDOj5CeMb1SUA1BjKhyRnBTkCwRtrQfAGcVw15vAR0yQXY1VzjfijUhU9UATXBfpGEGYJNVRwTP8KgXAzRlgbF2J3jNUMCsjuNINu0shQ1c1IM0TsRgTFZiQcSbQ8TPcM8Jx9BDRApDRySuNCUqTeMiNgUGSbRasbYwS2TOIMxzRDBAdbFUjNQrMAggA */
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
            always: [
              {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                guard: "noEnemiesNearby",
                actions: [
                  {
                    type: "clearCombatContext",
                  },
                ]
              },
              { target: ".FLEEING", guard: "isLowLealth" },
              { target: ".DECIDING", guard: "hasContextCombatChanged" }
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
              "actions": [
                {
                  type: "setTargetOnEnemy",
                },
              ],
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

