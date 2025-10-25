const AuthLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <main className="min-h-screen bg-linear-to-br from-slate-50 via-white to-green-50/30 relative overflow-hidden">
      {/* Modern geometric background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-linear-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-linear-to-tr from-blue-400/20 to-green-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-linear-to-r from-green-300/10 to-emerald-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-size-[20px_20px]"></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Main content */}
        <div className="flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-8">
          <div className="w-full max-w-[95%] sm:max-w-md lg:max-w-lg">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;