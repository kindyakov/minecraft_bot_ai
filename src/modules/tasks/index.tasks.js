import { NeedFoodTask } from "./NeedFoodTask.js";
import { RepairArmorTask } from "./RepairArmorTask.js";
import { FindShelterTask } from "./FindShelterTask.js";

export const TASK_TYPES = {
  NEED_FOOD: 'NEED_FOOD',
  REPAIR_ARMOR: 'REPAIR_ARMOR',
  FIND_SHELTER: 'FIND_SHELTER'
}

export const TASKS = {
  [TASK_TYPES.NEED_FOOD]: NeedFoodTask,
  [TASK_TYPES.REPAIR_ARMOR]: RepairArmorTask,
  [TASK_TYPES.FIND_SHELTER]: FindShelterTask
}