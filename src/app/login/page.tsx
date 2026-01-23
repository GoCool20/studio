import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from './LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-secondary p-4">
      <div className="w-full max-w-md space-y-6">
        <LoginForm />
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">First Time Logging In?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Before you can access the admin dashboard, you need to create an
              admin user in your Firebase project&apos;s Authentication section.
            </p>
            <ol className="list-decimal list-inside space-y-1 pl-2">
              <li>
                Open the{' '}
                <a
                  href="https://console.firebase.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Firebase Console
                </a>
                .
              </li>
              <li>Select your project, then go to <strong>Authentication</strong>.</li>
              <li>In the <strong>Users</strong> tab, click <strong>Add user</strong>.</li>
              <li>
                Create a user with an email and password.
              </li>
              <li>Come back here and log in with those credentials.</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
