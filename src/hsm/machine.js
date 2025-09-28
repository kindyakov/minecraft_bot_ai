import { createMachine } from 'xstate';
import { context } from './context.js'
import { actions } from './actions/index.actions.js'
import { guards } from './guards/index.guards.js'
import { actors } from './actors/index.actors.js';

export const machine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFkCSA5AogYQEoEEAxAFQH0AhAeWIGIBlTMq4gbQAYBdRUABwHtYASwAugvgDtuIAB6IAtAEYAbMoB0SgMwaAnGwBMADjY6NevQBoQAT0QBWWwHZVehXo0AWLQdtL3DvQC+AZZoWHhETNQ0AKoACgAi+MSYpLGUdKjEqJTo7FxIIPxCohJSsgiKhkqWNgj2Ti5unhrevv5BIRg4BCQUUXGJyaR0SdEEWTl5UkUiYpIF5Yq2bAo1do7Orh5ePn6BwSCh3RF9xKrI+Bik+NhZAGqZAJqqsZg3mITRADLnGBgA4jRYl98I9MLhhsRKLEpgUZiV5qByl5VLYdho2O5DBoHA4NGsEHptO5nGwDET7ESjGSlB1Dl1wr1mOdLuhrrdUA9iM9Xu9Pj9yNFUF94gCgSCwRC6FCYZxpgJZqUFogHEolKp3Eo2NotQptK0lBZrIhXLZVDj3MTtA5bNbVWxaQcjozImcLlcbvcni83tgPt9VHQvphMLExcDQeDIdDYbwFQiynYDBoNWqFO5NWxHMZVsbCUptKpvAo0fozNaWnTnT1XSyPRyuTzff6foR8LhQoCI5Lo7L8nHinNEwgbSSFA4FAZrUoDHj00banIHAZzTas3plysFMp3FWGTXTnW2Z7Od7eX7+apCJQvl9KAB1cMSqPSmNyuHxofKhAtEnL3-aHotjuNqZK2ASLgKKoWb6vYmLEkoqoKHuYQHsy7rHg2Z7NpedAABKYF8yS4E+kZSjKsaFJ+SpIiqmKqLiHgZtoOi4g47gEloTi2JOeorFi9gFihxxMtQR7sl63KqGM-yYOgZBYJg8R0KomDIOCsnoNgjykG8WToIC16UPEwxvLg2B4ZR8JfrRFRaGajGaiBKz+BuHF5nIbCqNoyhqraygKBiDjGAYwkuoeGESaeUkyXJCkhspqnqbgmnabpSRilZ1GIjI8hElBBimnoSjLKYngLvImrqGqiG6JojQeGFaFiZFJ6NtJKVxaQimJWpGlyWlBH4F8YpGSZDDthZWWDjRuV2QWqgKA6DjWt4IGGu5tQTotNU+HxGZ+KFTr7ic6GslF7WxfJ3UJSpfWdVpOlDSNBk0NNio5YsIFmgY7hTt4aIGCVngEgF3naBDPk+a4bC4k1p0tedbXetglDIOQSQxAkSQpKj6NJKQqPyZgAAarDvgOH3DnIaJFv4WIZjDZgFtUeZbCu+gaMsegrMBvjIcdqEI26SNYVJeMY7Q70Jt+bheTV-MGLOaoYuBbPbiStjJlzPmaLDlrw6JIv1pJzwS5jLAKP2VEzZ9KreUSM42qD2oc2w7u+DxfPuALnRC0b4nI+LaOS1ewaYJlFM21T35yDzJIOj4Drpto9iAwSgFsIbtatWLZsh0kYchplVvyrb1PrRnPPZxFoum6o5tnIQ4eZXo1vWbNixeKDxXaDXZ0m9F+f426hEhtcxDEDcADSkft9lFcaFB-iTntlpp5tJoluqGIQy4Kv633gsiTnddDw3Bej+HE9T9gs+vZb8-l7HBZ6ItnhzinG8u0D5paEBa4EI+X7ojQe7VG6qAIAZJSN8Z5zzLjHWychPDLxcK0L+9hN4IAhiSLQphHDLCAb7ek-tT5gJRpfSB+BoEmSSLfe+gJH4IJlkgy0KZiQOmTuvTBP8d7-wIdqTUwDj7hQHpheuU86DTzoG9KOHc7YIGcg7ICbgSqGAzFzUG3g341WCoxFohVdwiOasbcR59JHSNUPEUM6RMikEyGpGRDjkB0FINYtIGRkjxGljZOaWIoJqhAszFw5VgKgx8k4PBHhgrrU8CA0xF1vQWJUrgUMlwITtmQJQCEUIbwyNSbEdJhM0bAkYJgHxndEAbhTIhGJ9VLTaIgu7HRNVCru1hoFIxfsT613IVJZJV5KDGVMvgHAeEaDXmiOgEyY0KkKOWF5JWKxapEm1OxBw4SVDOEtDqVO+tfrxPODkTI2SASqGesQPCpAsnoBObgLGgwUgXMsnIhescSxVR5kvICHg0R6gqhUICDEl7JhKtuHUU4NCOm6aIlqxyoQkQMuct4RErk3LubIp+iC5pyAhuqdp7TflLx8gSWwb8ok6GJKYQqqdoUkJ6eheFpykV4SmbJCE6KEUPJxqQWZrzn5IJLC0aCBLjDuD+YBAkcd0zAsnFCnieoZzEkOZy5l-xzlsqjKq+5czqZ4pFQSolepcyLkCvi9prgfJpxcCqpliL1VxUyKgTArjtXcqGI6rILrdXvLgotcck5lziuJQC8cXlJx-WWHqTOBtjHCyObchFZzPXOtdXamgqSsl3BSJ6x4PrBXATNHVICYqJUArctBXifhVQuChfsGFJiE13OTfJJ1LrrnpvzTi1Of4cxuDxMuOVEEFoUuKumcqGhbWJrVQ3PCBM3UAFtBDiDAF28obACQ+xXArHduip3NqRRZed6aABmfAAA256+AAHc12VR2utICEEqq7tfUfBt8btVnKPWQN1sBz1gDADwO9FQoIsWdnmKFhYKUwa0PupNh652-vTbAAAFmAc9wgwAACcQNLnUNS00m6ZwGtFaKul1ZP12u-Uhjt077knoAIbYYXSBk1JpiTVVfQrd99LYVumo4h499GaAACMACughz0QDw15NB7FIaKbxeKzisNFq-SBlzHwQVlBBAOOIPgEA4BSEo0bZhvjFg7nVNuCcs5fplqlT7QsBLLUlkpIFFVZ9GzmcqRUFakS8Fai01rfEHktBQQWSsfK1qPNxoDrneu54Ww+YUYFJwGY-nKFnI4HZUr+3OCXitHURJcQbk830psfIAyoHiMGFLw4cvqGWq-LUv1VTPvU39EwOp6hA3rXxxtCXz5JcvKEAE9XZZ6DHOC3EYasyUk3ZOTrv0ioe0xOVsx7URsBkFMKUUBkJu2WtIWDLS8ZwAJaKzWo6ZFleyWlqYNsN+umbIZt7CVWfhBhDGGA7H4BVzWAk4AK4rEKtb8FdxAKDls+xUWtrpA3P1efexeAMbYOzjb+9i8ox3K0+CJLvKLBgpVLTNG4cceKSv+BnBtxJUltuthvHeR8v3KYsLmqvDUwbtxOxyxDTiASVCUu3FNgdk64uvdp5VlHn2CJEXBBj1nFnEBGDfn4QK2nio+BnJupe0PVucPhy93pb26c4QDKhwQsBhCHbmjzFcgbIv+HJNpqVU4GILJhpaTMNrxfG8lx1TS8UlJ0Bt4sBTf8tBBbTsmPLGZSOuZizToOzwrpB96slVKOk9IK+jmzsPKwI9QuMNH0LprXDx+i+5pPecA9dR6ndDPA0noopz-I6mwUoJRKj-YGPeYFo7P1MFX6GYVrV-ro3UP8h2Lho-kvDBYS+9qiLPwwBQjiFG7Ef7iBzdi4s9z0r0DENUSbmJH9KbaCids0xNxZMADCFr7H+fCB6lr50LgXvtvL9vCLWWkDGcngWJ2MEAbNuJH9wFKEoFZJaFJ539-hJ8KglVl8tBLQI0TAgDdAUxtY79BECx18Tp4skdg4R4rEPg5J9s4DMc895BMDbRvoeIbRB0n08w6pURb8BEiEwCkl8ApEQ9KCD8lx9AixDAzAAYyVNE2Y-BCx8oCxyQKdnt8CJdk9VABl3FbEyBnFeDFdfM5ASoake1lAtxAprRQYVAoJpD9QiRit5DSE-clCBkCkilMlslSBckvhND99tDgYhDyRDBrVxDrt2IVxgI5sgI8dlxOD+luDLExoRkxl4CdC-BwZyxYYpx5xL9rtZw35ZwGkKR9RkwHAIjngLcrd4DHBCwlM6otQXBtBQYcQIsfYV4dA3MfZ4M1V4iSx9R-VbMg0HMwtjARUyVp9wUlVDcFCIpBN1Vnk6M7l2jhDnAFkCxwdrQfBicgilZbRgIyQPkoVWj7UNVoEOU7VZjfoGJJwaUlibQIdAUSxUR1whjFUpxRibDGV6MW0sgvU016NjiUwS0HRiRVRliri7dtk1d9BDQzUptdiaNhMZi+DtDXAbQCsDoR8CxLjOI49qUntVFdZNQ9MAggA */
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
                  { target: "DEFENDING", guard: "isSurrounded" },
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
              DEFENDING: {
                entry: {
                  type: "entryDefenging"
                },
                exit: {
                  type: "exitDefenging"
                }
              },
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

