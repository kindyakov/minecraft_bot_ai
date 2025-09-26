import { createMachine } from 'xstate';
import { context } from './context.js'
import { states } from "./states/index.states.js"
import { actions } from './actions/index.actions.js'
import { services } from "./services/index.services.js"
import { guards } from './guards/index.guards.js'

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYArAHYATADoAnADZ1AZh0L96naoA0IAJ6JDWjSrYKAHABYjCrUuNaAvr8s0LDwiJmoaAFUABQARfGJMUijKOlRiVEp0di4kEH4hUQkpWQRFHTZ7NSUdEwUddx1nSxsEJQqNZxUtJzY2JTV9H39AjBwCEgpqDWR8DFJ8bHSANTSATQ0ozAXMQgiAGWmMDABxGii9-FXMXFI6Ykoo7Kl8kTFJXJKBpQ69FxqVIwqBQKZq2VzODoqVy6NSeep6JRKYYgIJjUKTYjTWboeaLVArYjrTbbXYHcgRVB7GInM4XK43O4PJ65F6Fd6gEoqJSuDTuCrlTzOapGUEIFz6DQmaHQrlaFQAtg6ZGokITZhYuYLZZrDZbbA7fYaOh7TCYKI086Xa63e6PTjPASvIofRBKZwShoKVx81RsQaitQ6exC5T6NhqCNy-TOZWjVVhTEzTV4glEvUGg6EfC4IKnS30m1M+0sx1s4qILk8hRA5xyxoqQauNSiuQqCEmNr9NtOYH1WPBcYJjU4rX4nXE-WkjSESh7PaUADqFrp1sZdpyvFLb3LCGjPLbe60VVcFTYQoDwI0fS0Qra0r0Rn7aLVUyTI5T4-TU7oAAlMHsElwZcrQZW1mU3AptxdBBHH3BtvWhfQ5XlVxRX0EwNG8ZxPCcJtESDJ94wxYdcW1QkNAiXBjkwdAyCwTAYjoDRMGQa5qPQbBVlILZ0nQU4Z0oGJbi2XBsB-cC8i3Z0OXkdDvnlfR3BPJx1DUKEWzYbQ6h0MwtDqYw2EcaNCMHYi31IsdyMo9i6NNRjmNYqiaM47j4hpCTWSgmTSjkjoFCqQM2n0NRXGClsvR0DQdJ0rpFWC-zFJM9F1XM0dUwopzaNIej7JYtjnK4v98D2GkBKEhhszEjypPZGRZKDDQFEVLo225RUQtFIFGui6ocIQtskpfRNsQs9LrJo2yGKYvLMpcoqSr4mhqsg6S6p8hsOnBG9EWjMxQtFYweS0Y7js8YE1EMlRBqHVKP3I7BKGQch4hoGiWK47B5wYZanVqkpFC6-RuRcAEvAuwYVAO5reROuVnDU5xsKRAIUTjUyUpGtKdQep6Xre5AuKzXAfrLaC5D2qLOm8JQtCbNSgc6m9tABGmdKcTpGmuszMbu9Ycee2g6Eo3BKAidAYgYkmvLWuRuU0et+mrP0QuhUU3A9E7ayaoUGzULmMeTMi+cegWaHnBdSHm4hxOLCDfp3OQm008Mz0U0GTAbRmJXddCvURQyQ3118eaNjR+ZeqXVs+KLouhNQ5S0QwjG5A6IcldCkJCv0oyD4bDcs43ccTf9TXmYhiAWABpGl8cJ7NI7++QTwlCNjG5WnOnhpprEQYF3F5bSulcN1lBC3OSKx+6TfiaYS8SeIK+wavFvNy2tgAm2N0klbG9KKp7HQ28BhPVw6i5UUbxUGGTtcIE930cfbtD8PMQlwgaOpFfFzX4rrYbh2nZXguu6W+QYPb6Avp0a+x1b7GHVo-EOBcw7T0xAQPiDEy6L2XqcWupBPopEwP-Mmp8JRckDH0IGnRtI6AOrCeW0U9BAgGIjBB+d0ovw0Gg6iQkF5VxpKvK2m8HQ7wdjTK+3REYAlhIqJqWhIFX2hDfO+8CUYqnRsHNhOoK50ErnQJattt72zJhnTCzhDKZzMc4HQgZUI9zFFYyKvRegnjMfpIGrD3yh20bojQEtkipDIGkFieignIDoKQPxKQgkxCId5OQEZIpyV0N6Iy0I2C2JaH7CEDDazeEVKoGMqi0bJQ0Z4pB3imK4DNLMG42ZkCUBuPcWceiqlRBqXgx65xGCEIMZ5KO8gIxXzMNY+U4ZqxNnPHYuo7QM5A39oGZQSoikDhKXnMp6UKnTkoIJYS+AcA-hoDOMWQkyqxJlsA3kShBjeDUnhTwzYpmqVMehQyNM2htiWSMFZQ1piZDSA0k4GhBGkHqegf5uBIixHiIkQRZz-rKBPBocG-krnD0GEeFsSFmZmErMoRE0jkZfOfDdP59wgJ8SBeva2ILSUNP0VvPpu85DHUcU43oikrlnVFP0dOGcYHBWwl4T5qNvkkrBWSwFP4xbURuKC8FkK4gJFIKc3pNUHahk0Gy9laL7ktgjBCOsqhgaIkVo-Wl5LjhAuldaOVZL6XCKMXEllV4tUcvRSCOxihDAut6P5PSJrYRmvFQCilE00ioEwOE21dLoiKsSGG9Ika4XyARVWasIM3CcoxY8iUtMex+uqLCAEQbwWAoTRGqN5r7UlhEWTLw+4-QJQbG2cUAYGqzOCkYb0wUH7InEHwCAcApBqNWQ60mcS6iIuBDWNsOrs0tEdp4H1MjwQJJcB40aawx3S3+i1Xlhg-QmvdJiwYmEnEnnbr8PWyziXc00eRCcGZt39LFBhb0nK6hUyhMdPVGEBguDioMMM-kFAbsnmmEkhpUAxBNM+3eqgeTlAfEecobgAQBirG4d0iddCIg+deolREDbrM-JBg4QQThwZ3LCD0Oq+h+mjIjDJiBwSaRDO8vSVj1BXRvUR0pm6H1fkNOSSkn9jhUeggnXkOrGhVAbFYg6iL2NNXKGiwyBGRW3uIwJiDk5DTGlNOaPiEnvKInsPpYeyddDXNFIhDo1MzxNlvuksDvNdRkenHUyjNbHVrSk04QtidTz+W7gupq3x-1dBhMhQMhTCPqLWTp9zenMyznNt5u2461ouG+O+wYn6uTfrkXY09OkfB6X8rfEwvb4urInm5x934-wAWuBlwxWWSjum+GY9wtZdLdHDLZxO9nlCOZCrBVzodGuGgABaCFgMIEza0LkgzaL0dQ8NqgQM9bWBwa3-LpNpuUQNvGEv1dDuNLKOU6BLd3dCfd5Q5lum2wulWy64RKzMdYybSDLuTVyo5diLkeJtcZQ7RwCgHuHsRMez1513vxzxaa07dWn6-cyv96agOCo-wWuJnzHX5AQ6h092HLQGqKMvo5lJfgUc-LR+wlBt2iehTPb62ENNwaihGR0dCgYGzpMjDx2r9PEGM6LtOE0mBQdquIb0RqzUgTSjoaFxAtZNVsuHgMOKwvNN8cS+B5BEvWJS8wXw4zBOd0DIwjhc6dRaas0hlMr0kOfYcqO6fUDdObpi+xig3xOwP4y9rXE0+bHqyOFpsCF3DzMnQ0p3DBGSMfvi4Fpw-A6CeHl3N-jzLVvShBm+GtpwHOjx+gOi73n6Fh4e5UynrR+AdE3cty+8mx1tCdl9ji79qd7uI-qMBnDwqR2i-vesTZkSAmkFCc3vPrezDh-lBdaxZ85SKewkivSd81JeBq3rs7DOG9N84dU1AtScwNNIE0vYs-2v5-Jt4DvFDBjd9VlMowEJgZAn6HMoGe+R8+5j4aCbJlS7L7LM4F7DyNR+y74srwxO6ZJQiaCdCKJdBIRdDVj17kRzYLYQFeg8haryjeAuCVYHQ1D2Bf7TL9BygloSoW5z5MrKBHjQEzqZroqx6yTVhIrF7L6IxIS04i5iqloUrArRq4AQGKBqSRRVC9BBigJyjVCYrIGzKhTTodj-7FL07mqSrWqyrmoSH+RtgOAuCCryFcg0KeqRh7bs7+r4pe6CFmTaGhq0ThqRo0rBriEt6MFqRXwyGKi0ygzmEHTDawx3xug7SGT+D+BAA */
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
            "description": "Состояние сражения (приоритет 7.5)",
            "initial": "FLEEING",
            "entry": {
              "type": "entryCombat"
            },
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

