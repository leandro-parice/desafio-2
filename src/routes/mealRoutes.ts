import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    return 'ok'
  })

  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      onDiet: z.boolean().default(false),
    })

    const { name, description, onDiet } = createMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      onDiet,
    })

    return reply.status(201).send()
  })
}
