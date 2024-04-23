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

export const env = {
  GITHUB_OAUTH_CLIENT_ID: getEnvValue("GITHUB_OAUTH_CLIENT_ID"),
  GITHUB_OAUTH_SECRET: getEnvValue("GITHUB_OAUTH_SECRET"),
  GITHUB_REPOSITORY_NAME: getEnvValue("GITHUB_REPOSITORY_NAME"),
  GITHUB_REPOSITORY_PRIVATE: getEnvValue("GITHUB_REPOSITORY_PRIVATE"),
  NEXTAUTH_URL: getEnvValue("NEXTAUTH_URL"),
  NEXTAUTH_SECRET: getEnvValue("NEXTAUTH_SECRET"),
}
