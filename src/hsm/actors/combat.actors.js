import { createStatefulService } from "./base/createStatefulService.js"
import { GoalXZ, GoalNear } from "../../modules/plugins/goals.js"


const serviceMeleeAttack = createStatefulService({
  name: 'MeleeAttack',
  tickInterval: 500,
  initialState: {
    currentTarget: null
  },

  onStart: ({ bot }) => {
    const meleeWeapon = bot.utils.getMeleeWeapon() // поиск оружия меч/топор

    if (meleeWeapon) {
      console.log(`🗡️ Экипировал оружие: ${meleeWeapon.name}`)
      bot.equip(meleeWeapon, 'hand')
    } else {
      console.log('🗡️ Нет оружия ближнего боя❗')
    }
  },

  onTick: ({ context, state, bot, sendBack, setState }) => {
    const { nearestEnemy, preferences } = context

    if (!nearestEnemy?.entity?.isValid || nearestEnemy.distance > preferences.maxDistToEnemy) {
      console.log('⚔️ Нет валидного врага для атаки')

      if (state.currentTarget) {
        bot.pvp.stop()
        setState({ currentTarget: null })
      }

      sendBack({ type: 'NO_ENEMIES' })
      return
    }

    const enemy = nearestEnemy.entity
    const distance = nearestEnemy.distance

    if (distance > preferences.enemyRangedRange) {
      const weapon = bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
      const arrows = bot.utils.getArrow()

      if (weapon && arrows) {
        sendBack({ type: 'ENEMY_BECAME_FAR' })
        return
      }
    }

    if (!state.currentTarget || state.currentTarget.id !== enemy.id) {
      console.log(`⚔️ Атакую ${enemy.name} ${enemy.id}`)
      if (state.currentTarget) bot.pvp.stop()
      bot.pvp.attack(enemy)
      setState({ currentTarget: enemy })
    }
  },

  onCleanup: ({ bot }) => {
    bot.pvp.stop()
    bot.pathfinder.setGoal(null)
    console.log('🆑 Очистка боя')
  }
})

const serviceRangedAttack = createStatefulService({
  name: 'RangedAttack',
  tickInterval: 1500,
  initialState: {
    currentTarget: null,
    weapon: null
  },

  onStart: ({ bot, sendBack, setState }) => {
    const weapon = bot.utils.getRangeWeapon() // поиск оружия лук/арбалет
    const arrows = bot.utils.getArrow()

    if (weapon && arrows) {
      bot.equip(weapon, 'hand')
      console.log(`🏹 Экипировал: ${weapon.name}`)
      setState({ weapon })
    } else {
      sendBack({ type: 'ENEMY_BECAME_CLOSE' })
    }
  },

  onTick: ({ context, state, bot, sendBack, setState }) => {
    const { nearestEnemy, preferences } = context

    if (!nearestEnemy?.entity?.isValid || nearestEnemy.distance > preferences.maxDistToEnemy) {
      console.log('⚔️ Нет валидного врага для атаки')

      if (state.currentTarget) {
        bot.hawkEye.stop()
        setState({ currentTarget: null })
      }

      sendBack({ type: 'NO_ENEMIES' })
      return
    }

    const enemy = nearestEnemy.entity
    const distance = nearestEnemy.distance

    if (distance <= preferences.enemyMeleeRange) {
      sendBack({ type: 'ENEMY_BECAME_CLOSE' })
      return
    }

    if (!state.currentTarget || state.currentTarget.id !== enemy.id) {
      console.log(`🏹 Стреляю в ${enemy.name} ${enemy.id}`)
      if (state.currentTarget) bot.hawkEye.stop()
      bot.hawkEye.autoAttack(enemy, state.weapon.name)
      setState({ currentTarget: enemy })
    }
  },

  onCleanup: ({ bot }) => {
    bot.hawkEye.stop()
    bot.pathfinder.setGoal(null)
  }
})

const serviceFleeing = createStatefulService({
  name: 'Fleeing',
  tickInterval: 500,

  onStart: ({ bot }) => {
    console.log('🏃 Тактическое отступление')
    if (bot.movements) {
      bot.movements.allowSprinting = true
    }
  },

  onTick: ({ bot, context, sendBack }) => {
    const { nearestEnemy, preferences, position } = context

    // Нет врагов - выходим
    if (!nearestEnemy?.entity?.isValid || nearestEnemy.distance > preferences.maxDistToEnemy) {
      sendBack({ type: 'NO_ENEMIES' })
      return
    }

    const enemy = nearestEnemy.entity

    // Просто убегаем от врага
    const enemyPos = enemy.position
    const direction = position.clone().subtract(enemyPos).normalize()
    const fleeTarget = position.clone().add(direction.scaled(preferences.fleeTargetDistance))

    console.log(`🏃 Отхожу от ${enemy.name}`)

    bot.pathfinder.setGoal(new GoalXZ(
      Math.floor(fleeTarget.x),
      Math.floor(fleeTarget.z),
    ))
  },

  onCleanup: ({ bot }) => {
    bot.pathfinder.setGoal(null)
  }
})

export default {
  serviceFleeing,
  serviceMeleeAttack,
  serviceRangedAttack,
}