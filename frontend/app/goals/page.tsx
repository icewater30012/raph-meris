"use client";

import { useEffect, useState } from "react";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  type Goal,
  type GoalCreateInput,
  type GoalUpdateInput,
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
import { Plus, Pencil, Trash2, Target } from "lucide-react";

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [formData, setFormData] = useState<GoalCreateInput>({
    title: "",
    description: "",
    category: "certificate",
    target_date: null,
    progress: 0,
    completed: false,
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      setLoading(true);
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error("Failed to load goals:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createGoal(formData);
      setCreateDialogOpen(false);
      resetForm();
      loadGoals();
    } catch (err) {
      console.error("Failed to create goal:", err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await updateGoal(selectedGoal.id, formData as GoalUpdateInput);
      setEditDialogOpen(false);
      setSelectedGoal(null);
      resetForm();
      loadGoals();
    } catch (err) {
      console.error("Failed to update goal:", err);
    }
  };

  const handleDelete = async () => {
    if (!selectedGoal) return;

    try {
      await deleteGoal(selectedGoal.id);
      setDeleteDialogOpen(false);
      setSelectedGoal(null);
      loadGoals();
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  const handleToggleComplete = async (goal: Goal) => {
    try {
      await updateGoal(goal.id, { completed: !goal.completed });
      loadGoals();
    } catch (err) {
      console.error("Failed to toggle goal completion:", err);
    }
  };

  const openEditDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || "",
      category: goal.category,
      target_date: goal.target_date ? goal.target_date.split("T")[0] : null,
      progress: goal.progress,
      completed: goal.completed,
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "certificate",
      target_date: null,
      progress: 0,
      completed: false,
    });
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case "certificate":
        return "Certificate";
      case "course":
        return "Course";
      case "skill":
        return "Skill Development";
      case "promotion":
        return "Promotion";
      case "other":
        return "Other";
      default:
        return category;
    }
  };

  const getProgressColor = (progress: number): string => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-blue-500";
    if (progress >= 25) return "bg-yellow-500";
    return "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Loading goals...</p>
      </div>
    );
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">Goals</h1>
          <p className="text-muted-foreground mt-2">
            Track your annual goals and professional development targets
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Goal
        </Button>
      </div>

      {/* Active Goals */}
      <div className="grid gap-6 md:grid-cols-2">
        {activeGoals.map((goal) => (
          <Card key={goal.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(goal.category)}
                  </Badge>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEditDialog(goal)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDeleteDialog(goal)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {goal.description && (
                <p className="text-sm text-muted-foreground">
                  {goal.description}
                </p>
              )}
              
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-semibold">{goal.progress}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getProgressColor(goal.progress)} transition-all duration-300`}
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
              </div>

              {goal.target_date && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Target: </span>
                  <span className="font-medium">
                    {new Date(goal.target_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {activeGoals.length === 0 && (
        <Card>
          <CardContent className="py-16">
            <p className="text-sm text-muted-foreground text-center">
              No active goals. Create one to start tracking your progress!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Completed Goals</CardTitle>
            <CardDescription>
              {completedGoals.length} goal{completedGoals.length !== 1 ? "s" : ""} achieved
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedGoals.map((goal) => (
                <Card key={goal.id} className="border-border/50">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{goal.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {getCategoryLabel(goal.category)}
                          </Badge>
                          <Badge className="text-xs bg-green-500 text-white">
                            Completed
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleComplete(goal)}
                          title="Mark as incomplete"
                        >
                          Reopen
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditDialog(goal)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(goal)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleCreate}>
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription>
                Set a new goal to track your progress
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g., Complete AWS Certification"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your goal..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="skill">Skill Development</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="target_date">Target Date</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={formData.target_date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, target_date: e.target.value || null })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="progress">Progress (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Goal</DialogTitle>
              <DialogDescription>Update goal details and progress</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value })
                  }
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="skill">Skill Development</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-target_date">Target Date</Label>
                  <Input
                    id="edit-target_date"
                    type="date"
                    value={formData.target_date || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, target_date: e.target.value || null })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-progress">Progress (%)</Label>
                  <Input
                    id="edit-progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="edit-completed"
                  checked={formData.completed}
                  onChange={(e) =>
                    setFormData({ ...formData, completed: e.target.checked })
                  }
                  className="h-4 w-4"
                />
                <Label htmlFor="edit-completed" className="cursor-pointer">
                  Mark as completed
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Goal</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedGoal?.title}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
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
