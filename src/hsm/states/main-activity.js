export const MAIN_ACTIVITY = {
  "initial": "PEACEFUL",
  "states": {
    "PEACEFUL": {
      "description": "Переход в эти состояния по командам игрока (приоритеты 7 - 9)",
      "initial": "IDLE",
      "states": {
        "IDLE": {
          "description": "Приоритет 1"
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
            "cond": "isFoodRestored",
            "actions": []
          }
        },
        "EMERGENCY_HEALING": {
          "entry": {
            "type": "entryEmergencyHealing"
          },
          "always": {
            "target": "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.hist",
            "cond": "isHealthRestored",
            "actions": []
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
            "Event 1": [
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
        "cond": "noEnemies",
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
        }
      },
      "always": {
        "target": "hist",
        "cond": "noTasks",
        "actions": []
      }
    },
    "hist": {
      "history": "shallow",
      "type": "history"
    }
  }
}
