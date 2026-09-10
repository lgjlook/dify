// Console sign-in has been removed from this deployment. /signin and every
// nested route (check-code, invite-settings, ...) now land on the home page.
import { redirect } from '@/next/navigation'

export default function SignInLayout(): never {
  redirect('/')
}
