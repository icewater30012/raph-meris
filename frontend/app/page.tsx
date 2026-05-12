import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, FolderKanban, FileText, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-semibold tracking-tight">
          Welcome to raph-meris
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          From daily order to annual impact.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="group hover:shadow-md transition-all duration-200 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
                <FolderKanban className="h-5 w-5 text-foreground/70" />
              </div>
              <CardTitle className="text-lg font-semibold">Projects</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Manage your projects, track priorities, and monitor status for
              performance-oriented tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/projects">
              <Button variant="ghost" className="w-full justify-between group/btn">
                View Projects
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
                <FileText className="h-5 w-5 text-foreground/70" />
              </div>
              <CardTitle className="text-lg font-semibold">Daily Logs</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Capture daily work notes in free text and organize them under
              projects for performance tracking.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/logs">
              <Button variant="ghost" className="w-full justify-between group/btn">
                View Logs
                <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="group hover:shadow-md transition-all duration-200 border-border/50">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-secondary rounded-xl group-hover:bg-primary/10 transition-colors">
                <TrendingUp className="h-5 w-5 text-foreground/70" />
              </div>
              <CardTitle className="text-lg font-semibold">Performance Insights</CardTitle>
            </div>
            <CardDescription className="text-sm leading-relaxed">
              Transform your daily work records into structured project context
              and performance-ready achievements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/30 border-border/50">
        <CardHeader className="space-y-2">
          <CardTitle className="text-xl font-semibold">Getting Started</CardTitle>
          <CardDescription className="text-sm">
            Follow these steps to make the most of raph-meris
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium text-sm">
              1
            </div>
            <div className="space-y-1 pt-1">
              <p className="font-medium text-sm">Create Your First Project</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Start by creating a project to organize your work activities.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium text-sm">
              2
            </div>
            <div className="space-y-1 pt-1">
              <p className="font-medium text-sm">Log Your Daily Work</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Record what you worked on each day and link it to your projects.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground font-medium text-sm">
              3
            </div>
            <div className="space-y-1 pt-1">
              <p className="font-medium text-sm">Track Your Progress</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Review your work history and prepare performance-ready
                achievements.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Made with Bob
