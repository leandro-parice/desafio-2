// eslint-disable-next-line no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      updated_at: string
    }
    meals: {
      id: string
      user_id: string
      name: string
      description: string
      on_diet: boolean
      created_at: string
      updated_at: string
    }
  }
}
