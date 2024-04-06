import { logout } from '~/lib/auth.server'

export const loader = async () => {
  return logout()
}
