"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  getProject,
  getDailyLogs,
  getAppreciations,
  updateProject,
  deleteProject,
  deleteAppreciation,
  createDailyLog,
  createAppreciation,
  type Project,
  type DailyLog,
  type Appreciation,
  type ProjectUpdateInput,
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
import { ArrowLeft, Pencil, Trash2, Plus, AlertCircle, Heart } from "lucide-react";

export default function ProjectDetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = parseInt(params.id as string);

  const [project, setProject] = useState<Project | null>(null);
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>([]);
  const [appreciations, setAppreciations] = useState<Appreciation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteAppreciationDialogOpen, setDeleteAppreciationDialogOpen] = useState(false);
  const [appreciationToDelete, setAppreciationToDelete] = useState<number | null>(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [appreciationDialogOpen, setAppreciationDialogOpen] = useState(false);

  const [formData, setFormData] = useState<ProjectUpdateInput>({
    name: "",
    description: "",
    priority: "medium",
    status: "in-progress",
    target_client: "",
    ibm_products: "",
    next_action: "",
    background: "",
    business_partner: "",
    delivery: "",
  });

  const [logFormData, setLogFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    raw_text: "",
  });

  const [appreciationFormData, setAppreciationFormData] = useState({
    appreciation_date: new Date().toISOString().split("T")[0],
    person_name: "",
    reason: "",
  });

  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      const [projectData, logsData, appreciationsData] = await Promise.all([
        getProject(projectId),
        getDailyLogs({ projectId }),
        getAppreciations({ projectId }),
      ]);
      setProject(projectData);
      setDailyLogs(logsData);
      setAppreciations(appreciationsData);
      setError(null);
    } catch (err) {
      setError("Failed to load project details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    try {
      await updateProject(project.id, formData);
      setEditDialogOpen(false);
      loadProjectData();
    } catch (err) {
      setError("Failed to update project");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!project) return;

    try {
      await deleteProject(project.id);
      router.push("/projects");
    } catch (err) {
      setError("Failed to delete project");
      console.error(err);
    }
  };

  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDailyLog({
        log_date: logFormData.log_date,
        raw_text: logFormData.raw_text,
        project_id: projectId,
      });
      setLogFormData({
        log_date: new Date().toISOString().split("T")[0],
        raw_text: "",
      });
      setLogDialogOpen(false);
      loadProjectData();
    } catch (err) {
      setError("Failed to create log");
      console.error(err);
    }
  };

  const handleAppreciationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAppreciation({
        appreciation_date: appreciationFormData.appreciation_date,
        person_name: appreciationFormData.person_name,
        reason: appreciationFormData.reason,
        project_id: projectId,
      });
      setAppreciationFormData({
        appreciation_date: new Date().toISOString().split("T")[0],
        person_name: "",
        reason: "",
      });
      setAppreciationDialogOpen(false);
      loadProjectData();
    } catch (err) {
      setError("Failed to create appreciation");
      console.error(err);
    }
  };

  const handleDeleteAppreciation = async () => {
    if (!appreciationToDelete) return;
    
    try {
      await deleteAppreciation(appreciationToDelete);
      setDeleteAppreciationDialogOpen(false);
      setAppreciationToDelete(null);
      loadProjectData();
    } catch (err) {
      setError("Failed to delete appreciation");
      console.error(err);
    }
  };

  const openDeleteAppreciationDialog = (id: number) => {
    setAppreciationToDelete(id);
    setDeleteAppreciationDialogOpen(true);
  };

  const openEditDialog = () => {
    if (!project) return;
    setFormData({
      name: project.name,
      description: project.description || "",
      priority: project.priority,
      status: project.status,
      target_client: project.target_client || "",
      ibm_products: project.ibm_products || "",
      next_action: project.next_action || "",
      background: project.background || "",
      business_partner: project.business_partner || "",
      delivery: project.delivery || "",
    });
    setEditDialogOpen(true);
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "bg-red-500 text-white hover:bg-red-600";
      case "medium":
        return "bg-yellow-500 text-white hover:bg-yellow-600";
      case "low":
        return "bg-blue-500 text-white hover:bg-blue-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "business-development":
        return "bg-purple-500 text-white hover:bg-purple-600";
      case "in-progress":
        return "bg-green-500 text-white hover:bg-green-600";
      case "pending":
        return "bg-orange-500 text-white hover:bg-orange-600";
      case "completed":
        return "bg-gray-700 text-white hover:bg-gray-800";
      case "future-plan":
        return "bg-cyan-500 text-white hover:bg-cyan-600";
      default:
        return "bg-gray-500 text-white hover:bg-gray-600";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "business-development":
        return "Business Development";
      case "in-progress":
        return "In Progress";
      case "pending":
        return "Pending";
      case "completed":
        return "Completed";
      case "future-plan":
        return "Future Plan";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground text-sm">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.push("/projects")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">Project not found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={() => router.push("/projects")}
            className="mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <Badge className={`text-xs font-medium ${getPriorityColor(project.priority)}`}>
              {project.priority}
            </Badge>
            <Badge className={`text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusLabel(project.status)}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={openEditDialog} variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button onClick={() => setLogDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Log
          </Button>
          <Button
            onClick={() => setDeleteDialogOpen(true)}
            variant="destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Details */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.description && (
              <div>
                <Label className="text-muted-foreground text-xs">Description</Label>
                <p className="mt-1 text-sm">{project.description}</p>
              </div>
            )}
            {project.background && (
              <div>
                <Label className="text-muted-foreground text-xs">Background</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{project.background}</p>
              </div>
            )}
            {project.target_client && (
              <div>
                <Label className="text-muted-foreground text-xs">Target Client</Label>
                <p className="mt-1 text-sm font-medium">{project.target_client}</p>
              </div>
            )}
            {project.business_partner && (
              <div>
                <Label className="text-muted-foreground text-xs">Business Partner (BP)</Label>
                <p className="mt-1 text-sm font-medium">{project.business_partner}</p>
              </div>
            )}
            {project.delivery && (
              <div>
                <Label className="text-muted-foreground text-xs">Delivery</Label>
                <p className="mt-1 text-sm font-medium">{project.delivery}</p>
              </div>
            )}
            {project.ibm_products && (
              <div>
                <Label className="text-muted-foreground text-xs">IBM Products</Label>
                <p className="mt-1 text-sm">{project.ibm_products}</p>
              </div>
            )}
            <div>
              <Label className="text-muted-foreground text-xs">Created</Label>
              <p className="mt-1 text-sm">
                {new Date(project.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Last Updated</Label>
              <p className="mt-1 text-sm">
                {new Date(project.updated_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Action</CardTitle>
          </CardHeader>
          <CardContent>
            {project.next_action ? (
              <p className="text-sm whitespace-pre-wrap">{project.next_action}</p>
            ) : (
              <p className="text-sm text-muted-foreground">No next action defined</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Daily Logs</CardTitle>
              <CardDescription>
                Work activities and progress tracking ({dailyLogs.length} log
                {dailyLogs.length !== 1 ? "s" : ""})
              </CardDescription>
            </div>
            <Button onClick={() => setLogDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Log
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dailyLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No daily logs yet. Add your first log to track progress.
            </p>
          ) : (
            <div className="space-y-4">
              {dailyLogs.map((log) => (
                <Card key={log.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium">
                        {new Date(log.log_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardTitle>
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(log.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{log.raw_text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Appreciations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Appreciations</CardTitle>
              <CardDescription>
                People who helped in this project ({appreciations.length} appreciation
                {appreciations.length !== 1 ? "s" : ""})
              </CardDescription>
            </div>
            <Button onClick={() => setAppreciationDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Appreciation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {appreciations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No appreciations yet. Recognize people who helped in this project.
            </p>
          ) : (
            <div className="space-y-4">
              {appreciations.map((appreciation) => (
                <Card key={appreciation.id} className="border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <CardTitle className="text-sm font-medium">
                          {appreciation.person_name}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(appreciation.appreciation_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openDeleteAppreciationDialog(appreciation.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{appreciation.reason}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update project details and information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Project Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
                <Label htmlFor="edit-background">Background</Label>
                <Textarea
                  id="edit-background"
                  value={formData.background || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, background: e.target.value })
                  }
                  placeholder="Project background and context"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-target-client">Target Client</Label>
                <Input
                  id="edit-target-client"
                  value={formData.target_client || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, target_client: e.target.value })
                  }
                  placeholder="e.g., ABC Corporation"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-business-partner">Business Partner (BP)</Label>
                <Input
                  id="edit-business-partner"
                  value={formData.business_partner || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, business_partner: e.target.value })
                  }
                  placeholder="e.g., Partner Company Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-delivery">Delivery</Label>
                <Input
                  id="edit-delivery"
                  value={formData.delivery || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, delivery: e.target.value })
                  }
                  placeholder="e.g., Delivery method or team"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-ibm-products">IBM Products</Label>
                <Textarea
                  id="edit-ibm-products"
                  value={formData.ibm_products || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ibm_products: e.target.value })
                  }
                  placeholder="e.g., Watson, Cloud Pak for Data"
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-next-action">Next Action</Label>
                <Textarea
                  id="edit-next-action"
                  value={formData.next_action || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, next_action: e.target.value })
                  }
                  placeholder="What needs to be done next?"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business-development">
                        Business Development
                      </SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="future-plan">Future Plan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{project.name}"? This action cannot
              be undone and will also delete all associated daily logs.
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

      {/* Daily Log Dialog */}
      <Dialog open={logDialogOpen} onOpenChange={setLogDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleLogSubmit}>
            <DialogHeader>
              <DialogTitle>Log Daily Work</DialogTitle>
              <DialogDescription>
                Record your daily work activities for this project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="log_date">Date *</Label>
                <Input
                  id="log_date"
                  type="date"
                  value={logFormData.log_date}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, log_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="log_raw_text">Work Notes *</Label>
                <Textarea
                  id="log_raw_text"
                  value={logFormData.raw_text}
                  onChange={(e) =>
                    setLogFormData({ ...logFormData, raw_text: e.target.value })
                  }
                  placeholder="Describe what you worked on today..."
                  rows={5}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Log</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Appreciation Dialog */}
      <Dialog open={appreciationDialogOpen} onOpenChange={setAppreciationDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <form onSubmit={handleAppreciationSubmit}>
            <DialogHeader>
              <DialogTitle>Add Appreciation</DialogTitle>
              <DialogDescription>
                Recognize someone who helped in this project.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="appreciation_date">Date *</Label>
                <Input
                  id="appreciation_date"
                  type="date"
                  value={appreciationFormData.appreciation_date}
                  onChange={(e) =>
                    setAppreciationFormData({ ...appreciationFormData, appreciation_date: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="person_name">Person Name *</Label>
                <Input
                  id="person_name"
                  value={appreciationFormData.person_name}
                  onChange={(e) =>
                    setAppreciationFormData({ ...appreciationFormData, person_name: e.target.value })
                  }
                  placeholder="Enter the person's name"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Appreciation *</Label>
                <Textarea
                  id="reason"
                  value={appreciationFormData.reason}
                  onChange={(e) =>
                    setAppreciationFormData({ ...appreciationFormData, reason: e.target.value })
                  }
                  placeholder="Describe why you appreciate this person..."
                  rows={5}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Appreciation</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Appreciation Confirmation Dialog */}
      <Dialog open={deleteAppreciationDialogOpen} onOpenChange={setDeleteAppreciationDialogOpen}>
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
                setDeleteAppreciationDialogOpen(false);
                setAppreciationToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAppreciation}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Made with Bob