/* eslint-disable camelcase */
import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

export async function reportRoutes(app: FastifyInstance) {
  /// COUNT MEALS
  app.get(
    '/meals',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const report = await knex('meals')
        .where({ user_id: userId })
        .count('id', { as: 'meals' })

      return { report }
    },
  )

  /// COUNT MEALS ON DIET
  app.get(
    '/meals/on-diet',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const report = await knex('meals')
        .where({ user_id: userId, on_diet: true })
        .count('id', { as: 'meals_on_diet' })

      return { report }
    },
  )

  /// COUNT MEALS OUT DIET
  app.get(
    '/meals/out-diet',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const report = await knex('meals')
        .where({ user_id: userId, on_diet: false })
        .count('id', { as: 'meals_out_diet' })

      return { report }
    },
  )

  /// BEST SEQUENCE
  app.get(
    '/meals/best-sequence',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const meals = await knex('meals')
        .select()
        .where({ user_id: userId, on_diet: true })
        .orderBy([
          { column: 'date', order: 'asc' },
          { column: 'time', order: 'asc' },
        ])

      let currentSequence: number = 0
      let bestSequence: number = 0
      let lastDay: string | null = null

      meals.forEach((meal) => {
        if (lastDay !== meal.date) {
          if (currentSequence > bestSequence) {
            bestSequence = currentSequence
          }

          lastDay = meal.date
          currentSequence = 1
        } else {
          currentSequence += 1
        }
      })

      return { bestSequence }
    },
  )
}
