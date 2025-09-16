import { NeedFoodTask } from "./NeedFoodTask.js";
import { RepairArmorTask } from "./RepairArmorTask.js";
import { FindShelterTask } from "./FindShelterTask.js";

export const TASK_TYPES = {
  NEED_FOOD: 'need_food',
  REPAIR_ARMOR: 'repair_armor',
  FIND_SHELTER: 'find_shelter'
}

export const TASKS = {
  [TASK_TYPES.NEED_FOOD]: NeedFoodTask,
  [TASK_TYPES.REPAIR_ARMOR]: RepairArmorTask,
  [TASK_TYPES.FIND_SHELTER]: FindShelterTask
}