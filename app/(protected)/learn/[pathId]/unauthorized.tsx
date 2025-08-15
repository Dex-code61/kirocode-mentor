import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Shield,
  Lock,
  ArrowLeft,
  BookOpen,
  CreditCard,
  Users,
} from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-destructive/20">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-destructive" />
            </div>

            <CardTitle className="text-2xl font-bold text-foreground mb-2">
              Access Restricted
            </CardTitle>
            <p className="text-muted-foreground">
              You don't have permission to access this learning path.
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Possible Reasons */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Possible reasons:
              </h3>

              <div className="space-y-3 pl-6">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Premium Content</p>
                    <p className="text-xs text-muted-foreground">
                      This learning path requires a premium subscription
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Prerequisites Not Met</p>
                    <p className="text-xs text-muted-foreground">
                      You need to complete prerequisite courses first
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Enrollment Required</p>
                    <p className="text-xs text-muted-foreground">
                      You need to enroll in this learning path first
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Account Verification</p>
                    <p className="text-xs text-muted-foreground">
                      Your account may need additional verification
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* What you can do */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">
                What you can do:
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/learn" className="block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">
                          Browse Free Courses
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Explore available learning paths
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/pricing" className="block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Upgrade Account</p>
                        <p className="text-xs text-muted-foreground">
                          Get access to premium content
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/dashboard" className="block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">My Dashboard</p>
                        <p className="text-xs text-muted-foreground">
                          View your enrolled courses
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>

                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                  <Link href="/support" className="block">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Contact Support</p>
                        <p className="text-xs text-muted-foreground">
                          Get help with access issues
                        </p>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <Link href="/learn" className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Learning Paths
                </Link>
              </Button>

              <Button asChild variant="outline" className="flex-1">
                <Link href="/dashboard" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>

            {/* Help Text */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact our{' '}
                <Link
                  href="/support"
                  className="text-primary hover:underline font-medium"
                >
                  support team
                </Link>{' '}
                for assistance with access issues.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
