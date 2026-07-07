import { signIn } from '@/app/admin/actions'

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: 'Incorrect email or password.',
  not_authorized: 'That account is not authorized for admin access.',
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>
}) {
  const { redirect: redirectTo = '/admin', error } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-bold text-xl text-brand-900">ANON INDIA</span>
          <p className="text-sm text-gray-500 mt-1">Admin sign in</p>
        </div>

        <form action={signIn} className="bg-white border border-gray-200 rounded-2xl shadow-soft p-6 space-y-4">
          <input type="hidden" name="redirect" value={redirectTo} />

          {error && (
            <div className="text-sm text-danger-700 bg-danger-50 border border-danger-100 rounded-lg px-3 py-2">
              {ERROR_MESSAGES[error] ?? 'Something went wrong. Please try again.'}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email" name="email" type="email" required autoComplete="email" autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              id="password" name="password" type="password" required autoComplete="current-password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-900 text-white text-sm font-semibold rounded-lg py-2.5 hover:bg-brand-700 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
