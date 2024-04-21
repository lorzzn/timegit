export const getEnv = () => {
  return process.env
}

export const getEnvValue = (key: string, mustExist: boolean = true, defaultValue?: string) => {
  const value = process.env[key]
  if (mustExist && !value) {
    throw new Error(`Missing environment variable: ${key}`)
  }
  return value || defaultValue
}
