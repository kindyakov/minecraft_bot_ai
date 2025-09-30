import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout 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-o5u+Xi84ORMgLoBKocl870DodwDEBIvNSDFP-UsKqWs5FAQ8GiPU5C5BAQYnI5MJVAEzhYl8nlPy3Rocfph7DPGF1hoVc2229NoJRok9RuRPkCQIq0PJiG5VCrso436-WAmSIGSwzK2SEIcN4YI4MFIf7w2Ktto4lcEnJPuBo4BAk9H0yMcnBvHieo2NIc4yh-TvGtN4R01GbzgnSNias1GqTvb7OBXVFZ1wPl7D3INSdf1GnMNxTKQTUggX8M8yGGlrIBNSMlg5duCcs5fq2fIeOLyizvArAhlrS0o6Utaby6gDLWWaD33nXcFIeXHiFeAmaOqQFjA2ek6e9i0FeJ+FVC4De+xkN5ua-8VS8l0s1o68F4CDEcxuDxH-ZMEEFryZASoRNbgmu4Z8ytgRZAOsAFtBDiDAP+tgBJ8Erhql977DhLt4cw7dzLGmaAADM+AABtwd8AAO6kbHL4B0QEIJVW+6jtU2g-vXfLhgu7wPYDg7AGAHghXvIU04sdk7lP5OY4w1pwHHXYAAAswDg+EGAAATqRpw9UyHJsQJqSzoWhcOhp5pm7OOgdXcEyDgAhuz+7-6HHEgvWjmqGO73qal2L7HSRJcGYAEYAFdBDg4gKRryLhZyk0hjb3wfOfyw0Wr9IGSafBBWUEEA44g+AQDgFINTpwm3EymTudUJXJzLjG7R+zmZnBMfTAYRPe1VSjofU8IPNtFgrScCdrUrvMX2ZxLLOcRh-D+UQgtzzea09SXPC2DPr8KFOAzDRupv9Sb2b23HumVItQHQ8wHvlx8mx8gDBbYMDfHWTa1BswCWpfqqmR07v6JgdT1CBpXwfvz+Uj4vAGUIAJJ-DjMGOQBuIqtZkpO9ycy-fpFSjX31P3Td8tlUIKYUEcj-fmtIWFvciZzewtDVAZwgRFg8Q8QOiYiljtAa5dJ-LYSj4-BBghhhgGRf5Kp+A7Tpg+D2gL7AG1CeAfzO74KxoP6YhP7wG144QBhRKdjoFzQ-5TaEIsSgSuAGCRZZjd4rQ6hEi4jFRHSLb3rP4+iIFXg3h3iPhoFXIiblCThmh-7bgzjt4QycRQRpg6DQwar7YaAUE74iF75IEERETgiH7SHB5zRzIag3pu7FQ+AzjvZOI1YkH3JkED5JbQKUEv6XiM6CCwDCD0HlBawrgR7LDXqGBASaD2b2xrgrANYIT6CJZQJwF6FXTxRKR0ABHyDyz9obzGDxaHZUwZjiZRodp7D2I6GwFD67KpE3TpFJT9SPTpT6T-CZEVDBRQS555H2AFGLjbiywxb5TxYuC6HD4dSaRpG9TJSpRPSWqmGSzmFZ4rA5F575H4h5gLTW6zhkgHQrQjG7IVytFLgMYMoLJPLrG6BgHo72QZiBSb7uHJGjFMJVw1xSHzGZ6VSuCXHLjLzMqgxYhOA2h7Emq9KIKXyvGiILGIBAzqATi6D2AkJ-yVZ6grjJjeq0KVHb6PHaK+KsJDKFKHEuyLTLRty-EZxZpAnZIArEp4lzEQnvEVDto5GWjIquzapqj9qgLomCEeF6FPEfDmrgkOrH7kjmhwmupKwuBaoZw6peqcluLckPG7ITqHEFjqikJmAAz3JJqgxGCWb4KGgYhqhyJuFJFVGBpPpFp1rpCZCkBVoZFmH0kSKYEt76lbiBTWhQagGYjKD6hEg8F3GmmYlKkWmTqhhrpzoLqkBLpfD2lvGN5OkYrLgalDHal5hay3L5TBT6CCSGAUmPrPpiHGRvofoqn4IMSKK6DLg+StwQRaxqGwbkjsr6jJi-YYn4qjE+F+GtGARxI251RaiSk6m2jQT4L+DulFb4Ki60lCniIlj6iLTjgR7lbjaF7GDib3IqDkiGB8EVEKnoTLZYaWo3x66PyHFsGywjYOjEiqjWg+CRYYpJ7sogSFTAQbxTm+b+Z6YaZnkJoMSTjKZ+AFg2j4F5QliojrjsRbg6hTgmm8otQHmtbtbfkOnxlsEpiXkFiAW3kgWEhkjOAZgTj6CdrzawVcaoZa4A4S5ZY-k2hx795YXAWcRFGmCl5mAbw+S+COhBBAA */
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
    states: {
      MAIN_ACTIVITY: {
        initial: "PEACEFUL",
        states: {
          PEACEFUL: {
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
          URGENT_NEEDS: {
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
          COMBAT: {
            initial: "DECIDING",
            description: "Состояние сражения (приоритет 7.5)",
            entry: { type: "entryCombat" },
            exit: { type: 'exitCombat' },
            on: {
              NO_ENEMIES: {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                actions: ["clearCombatContext"]
              },
              ANALYZE_COMBAT: {
                actions: ["analyzeCombat", "savePrevCombatState"]
              }
            },
            invoke: {
              id: "combatMonitor",
              src: "serviceCombatMonitoring",
              input: ({ context }) => ({ context })
            },
            states: {
              DECIDING: {
                entry: { type: 'entryDeciding' },
                always: [
                  { target: "FLEEING", guard: "isLowHealth" },
                  { target: "DEFENDING", guard: "isSurrounded" },
                  { target: "RANGED_ATTACKING", guard: "canUseRangedAndEnemyFar" },
                  { target: "MELEE_ATTACKING" }
                ]
              },
              FLEEING: {
                entry: { type: "entryFleeing" },
                exit: { type: "exitFleeing" },
                on: {
                  TARGET_CHANGED: {
                    target: "FLEEING",
                    reenter: true
                  },
                  HEALTH_RESTORED: {
                    target: "DECIDING"
                  },
                }
              },
              MELEE_ATTACKING: {
                description: "Ближний бой",
                entry: { type: "entryMeleeAttacking" },
                exit: { type: "exitMeleeAttack" },
                on: {
                  TARGET_CHANGED: [
                    {
                      // Новая цель близко - перезапускаем атаку
                      target: "MELEE_ATTACKING",
                      guard: ({ event }) => event.distance <= 5,
                      reenter: true
                    },
                    {
                      // Новая цель далеко - переключаемся на лук
                      target: "RANGED_ATTACKING",
                      guard: "canUseRanged",
                    }
                  ],
                  ENEMY_BECAME_FAR: {
                    target: "RANGED_ATTACKING",
                    guard: "canUseRanged"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  }
                }
              },
              RANGED_ATTACKING: {
                entry: "entryRangedAttacking",
                exit: "exitRangedAttacking",
                on: {
                  TARGET_CHANGED: [
                    {
                      // Новая цель далеко - перезапускаем стрельбу
                      target: "RANGED_ATTACKING",
                      guard: ({ event }) => event.distance > 8,
                      reenter: true
                    },
                    {
                      // Новая цель близко - переключаемся на меч
                      target: "MELEE_ATTACKING",
                    }
                  ],
                  ENEMY_BECAME_CLOSE: {
                    target: "MELEE_ATTACKING"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  }
                }
              },
              DEFENDING: {
                entry: "entryDefending",
                exit: "exitDefending",
                on: {
                  NOT_SURROUNDED: {
                    target: "DECIDING"
                  },
                  HEALTH_CRITICAL: {
                    target: "FLEEING"
                  }
                }
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
              "actions": ["setTargetOnEnemy"],
              "meta": {}
            },
            on: {
              UPDATE_ENTITIES: {
                actions: ["updateEntities"]
              },
              REMOVE_ENTITY: {
                actions: ["removeEntity"]
              },
            },
            invoke: {
              id: "entitiesTracking",
              src: "serviceEntitiesTracking",
            },
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

