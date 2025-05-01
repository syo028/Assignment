import { config } from 'dotenv'
import populateEnv from 'populate-env'

config()

export let env = {
  PORT: 8100,
  ERROR_INJECTION_PROBABILITY_WINDOW: 5000,
}

populateEnv(env, { mode: 'halt' })
