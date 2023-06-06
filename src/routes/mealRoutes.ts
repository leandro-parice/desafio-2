/* eslint-disable camelcase */
import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkUserIdExists } from '../middlewares/check-user-id-exists'

export async function mealRoutes(app: FastifyInstance) {
  const mealParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const mealBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    on_diet: z.boolean().default(false),
  })

  /// INDEX
  app.get(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId

      const meals = await knex('meals').select().where({ user_id: userId })

      return { meals }
    },
  )

  /// CREATE
  app.post(
    '/',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId
      const { name, description, on_diet } = mealBodySchema.parse(request.body)

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        on_diet,
        user_id: userId,
      })

      return reply.status(201).send()
    },
  )

  /// SHOW
  app.get(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request) => {
      const { id } = mealParamsSchema.parse(request.params)
      const userId = request.cookies.userId

      const meal = await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .first()

      return { meal }
    },
  )

  /// UPDATE
  app.put(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId
      const { id } = mealParamsSchema.parse(request.params)

      const { name, description, on_diet } = mealBodySchema.parse(request.body)

      await knex('meals')
        .where({
          id,
        })
        .update({
          name,
          description,
          on_diet,
          user_id: userId,
        })

      return reply.status(204).send()
    },
  )

  /// DELETE
  app.delete(
    '/:id',
    {
      preHandler: [checkUserIdExists],
    },
    async (request, reply) => {
      const userId = request.cookies.userId
      const { id } = mealParamsSchema.parse(request.params)

      await knex('meals')
        .where({
          id,
          user_id: userId,
        })
        .del()

      return reply.status(204).send()
    },
  )
}
