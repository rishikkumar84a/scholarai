export default function SettingsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account preferences and app configurations.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input 
                  type="text" 
                  disabled
                  placeholder="John Doe" 
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm cursor-not-allowed opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email Address</label>
                <input 
                  type="email" 
                  disabled
                  placeholder="user@example.com" 
                  className="w-full px-3 py-2 bg-muted border border-border rounded-md text-sm cursor-not-allowed opacity-50"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Profile information is currently managed by your authentication provider.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card">
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          <div className="space-y-4 flex items-center justify-between p-4 border border-border rounded-lg bg-background">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">The application defaults to dark mode.</p>
            </div>
            <div className="h-6 w-11 rounded-full bg-primary relative cursor-pointer">
              <div className="absolute right-1 top-1 h-4 w-4 rounded-full bg-primary-foreground" />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-destructive/20 bg-destructive/5">
          <h2 className="text-xl font-semibold mb-4 text-destructive">Danger Zone</h2>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all of your data. This action cannot be undone.
            </p>
            <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
