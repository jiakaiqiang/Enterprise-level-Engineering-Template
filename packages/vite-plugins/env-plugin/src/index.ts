import type { Plugin } from 'vite'

export function companyEnvPlugin(mode: string): Plugin {
  return {
    name: 'company-env-plugin',
    config() {
      const env = require(`../../../configs/env/${mode}`).default

      if (!env.API_BASE) {
        throw new Error(`API_BASE 未配置，mode=${mode}`)
      }

      return {
        define: {
          __ENV__: JSON.stringify(env)
        }
      }
    }
  }
}
