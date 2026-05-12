"use client";

import { useEffect, useState } from "react";
import {
  createAppreciation,
  deleteAppreciation,
  getAppreciations,
  getProjects,
  type Appreciation,
  type Project,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertCircle, Heart, Trash2 } from "lucide-react";

export default function AppreciationsPage() {
  const [appreciations, setAppreciations] = useState<Appreciation[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [appreciationToDelete, setAppreciationToDelete] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<string>("desc");
  const [formData, setFormData] = useState({
    appreciation_date: new Date().toISOString().split("T")[0],
    person_name: "",
    reason: "",
    project_id: "",
  });

  useEffect(() => {
    loadData();
  }, [sortOrder]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appreciationsData, projectsData] = await Promise.all([
        getAppreciations({ sortOrder }),
        getProjects(),
      ]);
      setAppreciations(appreciationsData);
      setProjects(projectsData);
      setError(null);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppreciation({
        appreciation_date: formData.appreciation_date,
        person_name: formData.person_name,
        reason: formData.reason,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
      });
      setFormData({
        appreciation_date: new Date().toISOString().split("T")[0],
        person_name: "",
        reason: "",
        project_id: "",
      });
      setOpen(false);
      loadData();
    } catch (err) {
      setError("Failed to create appreciation");
      console.error(err);
    }
  };

  const getProjectName = (projectId: number | null) => {
    if (!projectId) return null;
    const project = projects.find((p) => p.id === projectId);
    return project?.name;
  };

  const handleDelete = async () => {
    if (!appreciationToDelete) return;
    
    try {
      await deleteAppreciation(appreciationToDelete);
      setDeleteDialogOpen(false);
      setAppreciationToDelete(null);
      loadData();
    } catch (err) {
      setError("Failed to delete appreciation");
      console.error(err);
    }
  };

  const openDeleteDialog = (id: number) => {
    setAppreciationToDelete(id);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Appreciations</h1>
          <p className="text-muted-foreground">
            Recognize and appreciate people who have helped you in your projects and work.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-order" className="text-sm font-medium">
              Timeline Order:
            </Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger id="sort-order" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Appreciation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Add Appreciation</DialogTitle>
                  <DialogDescription>
                    Recognize someone who has helped you in your work.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="appreciation_date">Date *</Label>
                    <Input
                      id="appreciation_date"
                      type="date"
                      value={formData.appreciation_date}
                      onChange={(e) =>
                        setFormData({ ...formData, appreciation_date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="person_name">Person Name *</Label>
                    <Input
                      id="person_name"
                      value={formData.person_name}
                      onChange={(e) =>
                        setFormData({ ...formData, person_name: e.target.value })
                      }
                      placeholder="Enter the person's name"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reason">Reason for Appreciation *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      placeholder="Describe why you appreciate this person..."
                      rows={5}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="project_id">Related Project (Optional)</Label>
                    <Select
                      value={formData.project_id || "none"}
                      onValueChange={(value) =>
                        setFormData({ ...formData, project_id: value === "none" ? "" : value })
                      }
                    >
                      <SelectTrigger id="project_id">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id.toString()}>
                            {project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Appreciation</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading appreciations...</p>
        </div>
      ) : appreciations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              No appreciations yet
            </h3>
            <p className="text-sm text-muted-foreground">
              Start recognizing people who have helped you in your work.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {appreciations.map((appreciation) => (
            <Card key={appreciation.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      <CardTitle className="text-xl">
                        {appreciation.person_name}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      {new Date(appreciation.appreciation_date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardDescription>
                    {appreciation.project_id && (
                      <Badge variant="secondary" className="mt-2">
                        {getProjectName(appreciation.project_id)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(appreciation.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{appreciation.reason}</p>
                <p className="text-xs text-muted-foreground mt-4">
                  Added: {new Date(appreciation.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Appreciation</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appreciation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setAppreciationToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Made with Bob