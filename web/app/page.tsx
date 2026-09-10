// The console only keeps the Apps surface, so the root route goes straight there.
import { redirect } from '@/next/navigation'

export default function RootPage(): never {
  redirect('/apps')
}
