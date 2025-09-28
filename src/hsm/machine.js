import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArABYA7ADoAbAGYdATjYAmABxsDOo0YA0IAJ6JdSjUYVGdKvSaVb1RgL7+tmhYeERM1DQAqgAKACL4xJikMZR0qMSolOgU1OxcSCD8QqISUg4IcioK+hps9Wxu+spKSq46trIICio+GipabPrVJkZKajomaoHBGDgEJLnEGsj4GKT42JkAahkAmhoxmJuYhFEAMisYGADiNDHn+HuYuKR0xJQx+VLFImKShS6Xg0Si8oLYKlMOjUE1sFSMwxcbFG+laCLMyK0MxAIXm4SWKzWOU2O32h2O2FOFw05CiqHOcVu90ez1e70+30Kv1KANAXTUqn6g30gxq3i0WgUcMQChMOg00JUw30ApVakGWKCOLmYUWzEJ6xJqF2xAORxOZ0udHOmEwMSZDyeLzeHy+nB+Aj+ZUBiCUcqFkpUAzY43MUvsiCMWlq3mUOmMVhVk2xuN1EWWq0NW2NZPNlMtGkI+FwITujtZLo57q5np5Un5goUallKq0Ux0PRsEcqahMCoFIaMvcaCgUvhTOoW6YNxOzJrNFKpl0IlHO50oAHUHSzney3QVeLX-vXEJMVBpe2f9GMVENkUppQhXAo6kp9N4lBDhlp1QoJ6EpwJTNZ1JU1yQtak6AACUwc4klwbcnTZV1OUPEpjx9BA1AhC8JiDJUDBhNQVEfPRNCUWUakaSFWmjf88T1agZw2OcySiXAbkwdAyCwTA4joDRMGQF5OPQbA9lIY5MnQO4V0oOI3mOXBsCg1CiiPb0+XkPRnBhDxfHqJsrGIx85DYDRmglLQ3zHBR42w5MtVTQD9WAljQIOdjRJ421+ME4SOK48TJMSJk1O5DCtMqHSNBMNw2ms8wjE8LsKkUAZtCstRDF0Vx3BUei0yAol3JzMCvK4ny+IEoSRKCiSYPwc4mTkhSGGLFTwo03kZG06MNAUNgfxVbxby0ZLH2bAarJ8Kj8N7QqXKYtyjXnDQKu40heL82rArEhrjmamSaC69DNN66KJlilQTHfVpJmszxHzs899Det6alHIw2BhRb8VckrVrJbBKGQchEmieJEmSEGwcSUgQe4zAAA1WGrNCvR6rpFGRR9br7ZE9H0iZZR0P7GIzQHWLA2HwdoU7MZPboRUyiURimCV4wfbtBqHOoGl8CjVF8AqnMnf7lqpjyNFpiGWAUA91LOrH5EG5waiHIaDHw3o1Ge4xNAaIbemUAYg3J6cVupg5ZfpoxFYi87sdNizR16XRhnw8Z9dGBUibsz2g1BC3iqzaXbY0OIcFQRljoZutMLkHRxm0Iy4z9W6Jp5obnFuywx1GQmTBDgGw7Km3QbpyPo9ju55Yd7qmbkN9nB+8xbwhRpm1SmUc9i-R87bb65WLsWAIlymy7WiOo+wGOwvtj1labv1ambKYYVULu3Gelo-cscZP2-YYS8lqfgcrxJq7n2uTp0Bvl8T28jFi5ORVBDPrxInmxj7eM3tcJzH6SpT6TxAuXDQxB8B0AANJ0BOujJWjNMIdwslYNoOhrKmCDMnZ63gX5ZR+hMSYcVRazHHhTZiQMwJQNgQJKOqR0hkAyEJeBLDkB0FIAwtILC4jx0ihdSEL42YJnGj0A+38KifU0ETDw2ExqeFAVQ62kDoFwI0LgO0axXjFmQJQV4HxVzwM0TEbRCNQYPEYJgfhTtIxXR-PI3KSp8GPm+sYVmbZBr1GbB4JRVtpa0PUa1RS+AcBQRoCuKI6AFKtRsSrBAn5zImDMGObKCIhjET1jzEUL5kpvWjJ+YiJgyHagoZbbIGR9G3A0I1OCUFSB6PQJU3AkMEhJFILU4gqlEGO3iYoYWSIOxjA8KCDWpkxgXg7HKayo4RR501OQhi5SmkfAQjJGph0ukNIqashBD9kFRTkPk-mRsRkdmaI+No+89BvRSnFVECzSlLKAjsqp6yoJRM4q8RpzTWnQ1ILEnpjdE5xgJkbduozrzjJ6JM0mMyahthPmPZ5rlXlrJuDUz5zofm7LiU3Y54KIXnPDGlOyWgTmNARC0Nof5kVFVRSst5GLKoZFQJgThOL9F-PaSyzI7K8UgtaOZUc69ey9HOT3bo2EBrFO8I0ABX4-FouqbytlHK0U0E0Xo7YyReV7AFYc02zgcpjCJWM7sUYX6NFITCMRmCAh0qWhmZV6zVXsu2YylpBqLpHMFA5Nw0JoRxTlK4-qsjLCBhSmTR1E8VguoxSpeGnKWkAFtBDiDAN6robBHwjA8VZAtP4lWeuqYmsgyaaAADM+AABsa18AAO5ZvkOeMcY0xiuIyoW7tEp9DFuaaWqCSaNWwBrWAMAPBm2VBfAPAUpEw3hsXdGxZ9LlrxplkO8tI6AAWYAa3CDAAAJynXITQuU4odu7AMMFhLwWPOcrG5Ng7h2eqrQAQ0PSmqdJKZSIh7d2vtMbKFPvWWWj1vyABGABXQQNaIAnvMq4KYSp3qoZFL0UiP0ZU3ScD4eyY5AhanEHwCAcApAPopkvA5Pq23kpFbKMVkLJVVBqBSu8KpbICj8VLcuVGE6HLivKOUeglSyk8APH90UOz9FQzCZK1RoTcfPmBPMS4+MCK6HZTQQcOwFwFMRN64zoQuCmSGQit0NZKfAWtVTBYY42nU7YhJxFtBDXVNeQYxT1Sduw3KAe79xgmHGlZ0qNnFwFhCLcRz8SrCttmTCJs9RWhtFzbKXz1QxhuMGCUijlseNhYgpcWk9Ja7RaZiqWoOmC5jAmEF56t5YpC0Gtl8EagHUrqdco6WtnII2jtFFmsj8oqqE0LZd26pkTqC0Lm6TYninxSyxCEL1CFyFcLLogbGN+MXQq3UZQ40B53jcCYUyasTNNnyQiOTbZlsqJ68uVc64twyTK5hWUzgqt6fGCh0iwjJQGGaG4dQgbbvdfC5BGCcEXibaQdtroZgX7qDsnhqMPg2wzZfHNjLbR6jZdBxA+7Ght2CFgMIV7UVh4yoHN40wYxdCmVuheRJbgvzBlcPjtaG0qr8XJz6gz1zBjJ1aCG7sch5MUtlG2TBPjl1PNXWA0LbE9rc5qgFUSwUpIw96U3bCL5ZGC+SyL0lbgJdUuS+zoDeXlOeWV1tXyqu6r7Q6YdLXwLDm64F+YQ3HRuz9RQ++bCxSgzZQ5xfOGxBefY3VLnImonikWEk9GWo-9DBDGaOMXxlvQ7WbD1XQgfXXdDZ9ZMXSYYbrJwMOYab3ZmjmX-rdZsJM5Sh5ppfDMsFbQbGIFA7AMDC-Uedq0Aab9JdKmS5MZ6gDX4HwHMfHL4tgP5dz1fKOhAuKlcGwP+Q0ZyWGEwZKNs4mOyPlrwqIYDemxTNl7l7PivW-h40fgGSfEu8977y9zfcP5CN+nx4Zo8eJNJ8xxp8asj4BgkUOtH0l978q5Z554P8tsNNtIroqVkozBRQk9d5JhtAUpVA9BkoIRpgs9S4c8aE1E6BI9t9ERRhRhTBzdcELVBpcl-9VBPpRklAW8DhAl6E7QeFmEkgOFKDKhBZtBURqhRRRxCJXF3B5QqVowUQRQrBODVE6ENEtFUAdESx9FSBDFzgKDP8kDhCMoaCrAPwMFuZ4RoRzJWDsJjBaJTBlDuDCxKB5IQkwkhC5APYLJrx0lexmhIQTsLUlRzxkN3wEQ3xklFNiCz5SCDhidSchDxhag0McpBhXB9BnpoQXwbD2h09WD+1Vl+8v9p0IiBomwGNikmNTJ4x5QkthlBxmwXoCimUNkmotlk0PDjsX5TUhphh3MBRq9SU+wM4W5bw4o8D70F9lkB13ksVvk0VOjsELxZR7kpsVQfBoVnBPw2hiIRw5kIC5dOsQNmVuJWV3UOiDCnNFAoQXBElow1iBjXFkQXBg9eY7Vxp58ykXkS1QNN1wNVlFiBQTMdYHiNjuwPBzxLAzA2t3BoxaNCN-AgA */
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
    services,
    guards,
    delays: {}
  }
)

