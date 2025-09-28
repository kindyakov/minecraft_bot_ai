import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9xKrI+Bik+NhZAGqZAJqqsZg3mITRADLnGBgA4jRYl98I9MLhhsRKLEpgUZiV5qByl5VLYdho2O5DBoHA4NGsEHptO5nGwDET7ESjGSlB1Dl1wr1mOdLuhrrdUA9iM9Xu9Pj9yNFUF94gCgSCwRC6FCYZxpgJZqUFogHEolKp3Eo2NotQptK0lBZrIhXLZVDj3MTtA5bNbVWxaQcjozImcLlcbvcni83tgPt9VHQvphMLExcDQeDIdDYbwFQiynYDBoNWqFO5NWxHMZVsbCUptKpvAo0fozNaWnTnT1XSyPRyuTzff6foR8LhQoCI5Lo7L8nHinNEwgbSSFA4FAZrUoDHj00banIHAZzTas3plysFMp3FWGTXTnW2Z7Od7eX7+apCJQvl9KAB1cMSqPSmNyuHxofKhAtEnL3-aHotjuNqZK2ASLgKKoWb6vYmLEkoqoKHuYQHsy7rHg2Z7NpedAABKYF8yS4E+kZSjKsaFJ+SpIiqmKqLiHgZtoOi4g47gEloTi2JOeorFi9gFihxxMtQR7sl63KqGM-yYOgZBYJg8R0KomDIOCsnoNgjykG8WToIC16UPEwxvLg2B4ZR8JfrRFRaGajGaiBKz+BuHF5nIbCqNoyhqraygKBiDjGAYwkuoeGESaeUkyXJCkhspqnqbgmnabpSRilZ1GIjI8j2UWpp6EoyymJ4C7yOm6pqmqDi6JojQeGFaFiZFJ6NtJKVxaQimJWpGlyWlBH4F8YpGSZDDthZWWDjRuV2QWqgKA6tXLsBDp6O5tQTot1U+HxGZ+KFTr7ic6GslF7WxfJ3UJSpfWdVpOlDSNBk0NNio5YsIFmgY7hTt4aIGMVngEgF3naBDPk+a4bC4k1p0tedbXetglDIOQSQxAkSQpKj6NJKQqPyZgAAarDvgOH3Doof1Fv4WIZjDZgOASBhA9BbjLHoKzAb4yHHahCNukjWFSXjGO0O9Cbfm4XnVXzbOqpoWag9uJK2MmGj+cr7HaPDonC-WknPOLmMsAo-ZUTNn0Vfq0HBRopqg9zhZsG7DruDxvPuPznSCwb4nI2LaMS1ewaYJlFNW1T35yFx0HFVqKiWvYwEEtD0Hu74XtOb79L+7WrWiybIdJGHIaZRb8rW9TpgGM7Bh59WQuB8Xqim26hEhtcxDEDcADSkeW9Zs1fY7DEuK06baKnm0miW6oYhDLhqkFlr64XIvG+3ped+HPd99gg+vebw-ZdTBZ6ItnhztPs+gzS5paEBa4IT5G8RVv0Ul-jZwEAZSkD4DyHtXGOtk5CeCgv4Sce0U72DnggCGJItCmEcMsN+TcToByLtvDuqh-6yRMkkQ+x9ASn1AdLcBloUzEgdA6O+8CH7sxQS-dBmp34CxEpvI239VB9zoP3Ogb0o4jxtggZy3kzC2DcMVQwGYtag28FfaqwVGItEbruTh4Uzo8PavwwRqh4ihnSJkUgmQ1JCPMcgOgpAjFpAyMkeIUsbJzSxFBNUIEzCGnTKghBepxxPy0H4TEHsNAfx0Zhbe+iVK4FDJcCE7ZkCUAhFCG8QjYmxHiYTNGwJGCYGcaPRAG4UyIWCpqUqsFyqEjdso6qjd3YTkalo5qhtIm8OiVeSgxlTL4BwHhGg15ojoBMmNApYjlheTZisRCgFdDWj8KDHUUENoQwLMsdiv1wktRyJkZJAJVDPWIHhUgST0C7NwFjQYKRDmWREefWOJZNSkkdkBDwaI9RVLkEBBijtkzFW3DqKcGhHR+y4RFHZUISIGQOW8IixzTnnOEWfGusdVmZ3dsYT2jsfIEmkYErQSC656h8Fst0EK9nQrwkM2SEIEWQsuTjUgoy7kovASWFo6L3ZvOxZ8lwf5fnAp4nqGcxJSXnHJVC-4BzqVRjpckpFFCXGLDRRit23L-EEkUMCzlrgfKpxcGKuVkrVLyUyKgTANijUMqGHFM1FqxnUxLMsRa45JzLixR80GwVFq-W8CsZe8FDUSv2barIFqTkSpoLEpJdwUihseA6h5wEzR1SApi95gEILsWgrxPwqoXDAv2KC7R2yzmQpDaasNlrI2JvATPP8OY3B4mXJOfEeYiqFhQc-ZOZUwnNJbka-ZFkCZWoALaCHEGAWtc02AEh9iueWi6VFBrLRSqVw6yBWoAGZ8AADa7r4AAd2nV9HaIFDTgXbU8pdN69b9uwcG6FG6I2roubAXdYAwA8BPRVbyOJL21GBZ2rtIGUErvOUOvCI7I2wAABZgF3cIMAAAnH9FQnD1UbkBOdM5OWqoxSC-OYL0KPvXVBzdkat0AENkOjrQ7mWoeoSQ3qXXe4tLTxWvsg9B19NAABGABXQQu6IBoc8psWclpIbSZ1J7TisMfV-U0IJIKygggHHEHwCAcApDNwNoqwpFQdzqm3BOWcv0M2fJ9q7d2uqnXSMCoar+jYDNiKXNafFWotb2GTJqrQUEJkrCJPZgtTndHYT5N8Vzw5ApOAzO85Qs5HBSc1U25wjtao6iJLiDcYW2ntXPC2VQqB4jBmi9+ZL6hlqXy1L9VUEExy+pMDqeoQMi1EZLa0i6EWLwBlCACcrtkzBjgBbiccbt9VzsnIp36hU3Zak0exgdzmetFcFMKUUBlBtzWtIWeLjsZwvxaNUPM6ZJleyWgt0s7R73cPy6t3C4cwxbY-KyuawEnABU9ohWrfgTu1EgTNn2QFuZ0MWx1jjODeGFcvG2DsA3XtgJ27VHNPgiRLyC-XDyS0zRuHHKs7L-gZx5e61JGHAZry3gfAjymlC5owI1B6xLNpdbaE4u4lQOhoYbWbX2pb2CVtk5wgGfChFiI0+jnT8oRgr5+ECj4UwicZxzvHpOP6wPpHzcxCToOTZIs-Fg4IWAwhtvlG5iuN1gX-DkgV5qqcDEJkw0tJmA1t3P7hZig9eKSk6Cm-kLrTzxhU6+Y8htEkGK7P6swQXd393PeaW971ZKqUdJ6Ql6I6mwUoJdq88Htti5txXwj8FqPOu25XUT3dZPA0nqwvT-c8BWfA-eY1vnxAC0pP6mCr9DMtUy+4N3n79DIFr44kdgwtOeZqpFmfmg7U7Do-EcRh7n+odCDh3r29xYepCyOCMMSP6G1J5Y8Y5ibiyZWHz4LIvzrrcB+-3OF3FIxDgEvdp0q+QM4zSXeXGqX6JgGN55cRUR+9eE8EjFCA5JNt-gh8lwTMb5x84FAZnZDQQC3cIlSdV8y4CFAEX8j5N8kdFgRUZ8gkfJ-8WJADEFjASDL8MFQC9F8ABFfdEcpd-d9AixDAzAAZpEFFTs-BCxgsCxyQCd2s9M7tMC+FGCDE7ETEyArFmD39DM5BioSl61lAtxAprRQYVBlkfIhCiQstRCsFxDddJCmD8E4lUAEkOxklSBUkvgFDJcP8KhgYODyRDB9VeDGMNlUQfZgp9BBINwjp+cTC24Okxoek+lYC2hwZyxYYpx5wT8TRZwr5JN9QKR9RkwHB6DvRDdjch9HBCwZM6otQXA2dTscQAs-CC09VgIb9IdSNYCSw7ZTM3ULMeU-NqCJs3ItxAVRV0DS0INKVYUjkX1zkmjODnAJkCw-trQfBNVpsNZvB60yRHlgVwNy1KUZVaUJUJjfoGJJxG5iRVQ5j-t5AXAzRlhpF2JeiRVwcxDwUuNoVQ1zVq1X09iUw00HRjiCwbQzjqkVww8Jx9BvFC17jjDHihiyMeNxiWDnDKgbR0sDpe9fj5i8wmJzRDBYYzAgNjN1MAggA */
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
            initial: "MELEE_ATTACKING",
            description: "Состояние сражения (приоритет 7.5)",
            entry: {
              type: "entryCombat"
            },
            exit: {
              type: 'exitCombat'
            },
            always: [
              {
                target: "#MINECRAFT_BOT.MAIN_ACTIVITY.hist",
                guard: "noEnemiesNearby",
                actions: [
                  { type: "clearCombatContext", },
                ]
              },
              { target: ".FLEEING", guard: "isLowLealth" },
            ],
            on: {
              UPDATE_COMBAT_CONTEXT: {
                actions: ["updateCombatContext"]
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
                },
                always: [
                  { target: "RANGED_ATTACKING", guard: "isEnemyFar" },
                  { target: "MELEE_ATTACKING", guard: "isEnemyClose" },
                ]
              },
              MELEE_ATTACKING: {
                description: "Ближний бой",
                entry: {
                  type: "entryMeleeAttacking"
                },
                exit: {
                  type: "exitMeleeAttack"
                },
                always: [
                  { target: "FLEEING", guard: "isLowLealth" },
                  { target: "RANGED_ATTACKING", guard: "isEnemyFar" }
                ]
              },
              RANGED_ATTACKING: {
                description: "Дальний бой",
                entry: { type: "entryRangedAttacking" },
                exit: { type: "exitRangedAttacking" },
                always: [
                  { target: "FLEEING", reenter: true, guard: "isLowLealth" },
                  { target: "MELEE_ATTACKING", reenter: true, guard: "isEnemyClose" }
                ]
              },
              // DEFENDING: {
              //   entry: {
              //     type: "entryDefenging"
              //   },
              //   exit: {
              //     type: "exitDefenging"
              //   }
              // },
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

