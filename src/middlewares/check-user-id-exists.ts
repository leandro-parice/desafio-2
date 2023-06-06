import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function checkUserIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.userId

  if (!userId) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  knex('users')
    .where({
      id: userId,
    })
    .then((rows) => {
      if (rows.length === 0) {
        return reply.status(401).send({
          error: 'Unauthorized.',
        })
      }
    })
}
