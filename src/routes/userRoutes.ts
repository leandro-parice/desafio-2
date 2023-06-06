import { randomUUID } from 'crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  const userParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const userBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
  })

  app.get('/', async () => {
    const users = await knex('users').select()

    return { users }
  })

  app.post('/', async (request, reply) => {
    const { name, email } = userBodySchema.parse(request.body)

    console.log(name, email)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
    })

    return reply.status(201).send()
  })

  app.get('/:id', async (request) => {
    const { id } = userParamsSchema.parse(request.params)

    const user = await knex('users')
      .where({
        id,
      })
      .first()

    return { user }
  })

  app.put('/:id', async (request, reply) => {
    const { id } = userParamsSchema.parse(request.params)

    const { name, email } = userBodySchema.parse(request.body)

    await knex('users')
      .where({
        id,
      })
      .update({
        name,
        email,
      })

    return reply.status(201).send()
  })

  app.delete('/:id', async (request, reply) => {
    const { id } = userParamsSchema.parse(request.params)

    await knex('users')
      .where({
        id,
      })
      .del()

    return reply.status(201).send()
  })
}
