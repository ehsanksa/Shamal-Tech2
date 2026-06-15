import { redirect } from 'next/navigation'

/** Alias route — same training platform at /course */
export default function CourseAliasPage() {
  redirect('/training')
}
