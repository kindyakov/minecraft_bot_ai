export const MONITORING = {
  type: "parallel",
  states: {
    HEALTH_MONITOR: {
      entry: {
        type: "entryHealthMonitoring"
      },
      on: {
        UPDATE_HEALTH: [
          {
            actions: [
              {
                type: "updateHealth"
              }
            ]
          }
        ]
      },
      always: {
        target: "#MINECRAFT_BOT.MAIN_ACTIVITY.URGENT_NEEDS.EMERGENCY_HEALING",
        cond: "isHealthCritical",
        actions: [],
        description: "Переход выполнится если \\\nтекущий приоритет состояния \\\nниже HEALTH_MONITOR ",
        meta: {}
      }
    },
    // HUNGER_MONITOR: {
    //   entry: {
    //     type: "entryHungerMonitoring"
    //   },
    //   on: {
    //     UPDATE_FOOD: [
    //       {
    //         actions: [
    //           {
    //             type: "updateFood"
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   always: {
    //     target: "#MINECRAFT_BOT.MAIN_ACTIVITY.URGENT_NEEDS.EMERGENCY_EATING",
    //     cond: "isHungerCritical",
    //     actions: [],
    //     description: "Переход выполнится если \\\nтекущий приоритет состояния \\\nниже HUNGER_MONITOR",
    //     meta: {}
    //   }
    // },
    // ENTITIES_MONITOR: {
    //   entry: {
    //     type: "startEntitiesMonitoring"
    //   },
    //   on: {
    //     UPDATE_ENTITIES: [
    //       {
    //         actions: [
    //           {
    //             type: "updateEntities"
    //           }
    //         ]
    //       }
    //     ]
    //   },
    //   always: {
    //     target: "#MINECRAFT_BOT.MAIN_ACTIVITY.COMBAT",
    //     cond: "isEnemyNearby",
    //     actions: []
    //   }
    // },
    // INVENTORY_MONITOR: {
    //   entry: {
    //     type: "startInventoryMonitoring"
    //   },
    //   always: {
    //     target: "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.DEPOSIT_ITEMS",
    //     cond: "isInventoryFull",
    //     actions: []
    //   }
    // },
    // CHAT_MONITOR: {
    //   description: "Команды игрока",
    //   entry: {
    //     type: "entryChatMonitoring"
    //   },
    //   "on": {
    //     "mine": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.MINING",
    //         actions: []
    //       }
    //     ],
    //     "follow": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FOLLOWING",
    //         actions: []
    //       }
    //     ],
    //     "sleep": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SLEEPING",
    //         actions: []
    //       }
    //     ],
    //     "shelter": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.SHELTERING",
    //         actions: []
    //       }
    //     ],
    //     "farm": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.FARMING",
    //         actions: []
    //       }
    //     ],
    //     "build": [
    //       {
    //         target: "#MINECRAFT_BOT.MAIN_ACTIVITY.PEACEFUL.BUILDING",
    //         actions: []
    //       }
    //     ]
    //   }
    // },
    // ARMOR_TOOLS_MONITOR: {
    //   entry: {
    //     type: "startArmorToolsMonitoring"
    //   },
    //   always: {
    //     target: "#MINECRAFT_BOT.MAIN_ACTIVITY.TASKS.REPAIR_ARMOR_TOOLS",
    //     cond: "isBrokenArmorOrTools",
    //     actions: []
    //   }
    // },
  }
}