import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/session-id'

export async function mealRoutes(app: FastifyInstance) {
  const mealParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const mealBodySchema = z.object({
    name: z.string(),
    description: z.string(),
    onDiet: z.boolean().default(false),
    userId: z.string().uuid(),
  })

  app.get('/', async () => {
    const meals = await knex('meals').select()

    return { meals }
  })

  app.post('/', async (request, reply) => {
    const { name, description, onDiet, userId } = mealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      onDiet,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.get('/:id', async (request) => {
    const { id } = mealParamsSchema.parse(request.params)

    const meal = await knex('meals')
      .where({
        id,
      })
      .first()

    return { meal }
  })

  app.put('/:id', async (request, reply) => {
    const { id } = mealParamsSchema.parse(request.params)

    const { name, description, onDiet, userId } = mealBodySchema.parse(
      request.body,
    )

    await knex('meals')
      .where({
        id,
      })
      .update({
        name,
        description,
        onDiet,
        user_id: userId,
      })

    return reply.status(201).send()
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = mealParamsSchema.parse(request.params)

    await knex('meals')
      .where({
        id,
      })
      .del()

    return reply.status(201).send()
  })
}
