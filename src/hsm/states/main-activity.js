export const MAIN_ACTIVITY = {
  initial: "PEACEFUL",
  states: {
    "PEACEFUL": {
      description: "Переход в эти состояния по командам игрока (приоритеты 7 - 9)",
      initial: "IDLE",
      states: {
        "IDLE": {
          description: "Приоритет 1"
        },
        "MINING": {
          description: "Приоритет 7",
          entry: {
            type: "entryMining"
          },
          exit: [
            {
              type: "exitMining"
            },
            {
              type: "saveMiningProgress"
            }
          ],
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: [
                  {
                    type: "saveMiningProgress"
                  }
                ]
              }
            ]
          }
        },
        "BUILDING": {
          description: "Приоритет 7",
          entry: {
            type: "entryBuilding"
          },
          exit: [
            {
              type: "exitBuilding"
            },
            {
              type: "saveBuildingProgress"
            }
          ],
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: [
                  {
                    type: "saveBuildingProgress"
                  }
                ],
                "meta": {}
              }
            ]
          }
        },
        "SLEEPING": {
          description: "Приоритет 7",
          entry: {
            type: "entrySleeping"
          },
          exit: {
            type: "exitSleeping"
          },
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: []
              }
            ]
          }
        },
        "FARMING": {
          description: "Приоритет 7",
          entry: {
            type: "entryFarming"
          },
          exit: [
            {
              type: "exitFarming"
            },
            {
              type: "saveFarmingProgress"
            }
          ],
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: [
                  {
                    type: "saveFarmingProgress"
                  }
                ]
              }
            ]
          }
        },
        "FOLLOWING": {
          description: "Приоритет 9",
          entry: {
            type: "entryFollowing"
          },
          exit: {
            type: "exitFollowing"
          },
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: []
              }
            ]
          }
        },
        "SHELTERING": {
          description: "Приоритет 7",
          entry: {
            type: "entrySheltering"
          },
          exit: {
            type: "exitSheltering"
          },
          on: {
            "PLAYER_STOP": [
              {
                targe: "IDLE",
                actions: []
              }
            ]
          }
        },
        hist: {
          history: "shallow",
          type: "history"
        }
      }
    },
    "URGENT_NEEDS": {
      description: "Срочные потребности (приоритет 8)",
      initial: "EMERGENCY_EATING",
      states: {
        "EMERGENCY_EATING": {
          entry: {
            type: "entryEmergencyEating"
          },
          always: {
            targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.hist",
            guard: "isFoodRestored",
            actions: []
          },
          on: {
            FOOD_SEARCH: [
              {
                targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.FOOD_SEAECH",
                actions: []
              }
            ]
          }
        },
        "EMERGENCY_HEALING": {
          entry: {
            type: "entryEmergencyHealing"
          },
          always: {
            targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.hist",
            guard: "isHealthRestored",
            actions: []
          },
          on: {
            FOOD_SEARCH: [
              {
                targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.FOOD_SEAECH",
                actions: []
              }
            ]
          }
        }
      }
    },
    "COMBAT": {
      description: "Состояние сражения (приоритет 7.5)",
      initial: "FLEEING",
      states: {
        "FLEEING": {},
        "MELEE_ATTACKING": {
          description: "Ближний бой",
          entry: {
            type: "entryMeleeAttacking"
          },
          on: {
            "ENEMY_FAR": [
              {
                targe: "RANGED_ATTACKING",
                actions: []
              }
            ],
            "LOW_HEALTH": [
              {
                targe: "FLEEING",
                actions: []
              }
            ]
          }
        },
        "DEFENDING": {
          on: {
            "LOW_HEALTH": [
              {
                targe: "FLEEING",
                actions: []
              }
            ]
          }
        },
        "RANGED_ATTACKING": {
          description: "Дальний бой",
          entry: {
            type: "entryRangedAttacking"
          },
          on: {
            "ENEMY_CLOSE": [
              {
                targe: "MELEE_ATTACKING",
                actions: []
              }
            ],
            "LOW_HEALTH": [
              {
                targe: "FLEEING",
                actions: []
              }
            ]
          }
        }
      },
      always: {
        targe: "hist",
        guard: "noEnemies",
        actions: []
      },
      on: {
        "ENEMY_CLOSE": [
          {
            targe: ".MELEE_ATTACKING",
            actions: []
          }
        ],
        "ENEMY_FAR": [
          {
            targe: ".RANGED_ATTACKING",
            actions: []
          }
        ],
        "SURROUNDED": [
          {
            targe: ".DEFENDING",
            actions: []
          }
        ],
        "LOW_HEALTH": [
          {
            targe: ".FLEEING",
            actions: []
          }
        ]
      }
    },
    "TASKS": {
      description: "Задачи бота",
      initial: "DEPOSIT_ITEMS",
      states: {
        "DEPOSIT_ITEMS": {
          description: "Выкладывание вещей в сундук",
          on: {
            "ITEMS_DEPOSITED": [
              {
                targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                actions: []
              }
            ]
          }
        },
        "REPAIR_ARMOR_TOOLS": {
          description: "Починка брони и инструментов",
          on: {
            "REPAIR_COMPLETE": [
              {
                targe: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                actions: []
              }
            ]
          }
        },
        FOOD_SEAECH: {
          description: "Поиск еды",
          entry: {
            type: "entrySearchFood"
          },
          on: {
            FOUND_FOOD: [
              {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                actions: []
              }
            ]
          }
        }
      },
      always: {
        targe: "hist",
        guard: "noTasks",
        actions: []
      }
    },
    hist: {
      history: "shallow",
      type: "history"
    }
  }
}
