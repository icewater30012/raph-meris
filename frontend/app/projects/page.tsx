"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDailyLog,
  createProject,
  deleteProject,
  getProjects,
  updateProject,
  type Project,
  type ProjectCreateInput,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Plus, AlertCircle, MoreVertical, Pencil, Trash2, Filter, ArrowUpDown } from "lucide-react";

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  
  // Sort states
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<string>("desc");
  
  const [formData, setFormData] = useState<ProjectCreateInput>({
    name: "",
    description: "",
    priority: "medium",
    status: "in-progress",
    target_client: "",
    ibm_products: "",
    next_action: "",
  });
  
  // Daily log dialog state
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [logFormData, setLogFormData] = useState({
    log_date: new Date().toISOString().split("T")[0],
    raw_text: "",
    project_id: "",
  });

  useEffect(() => {
    loadProjects();
  }, [statusFilter, priorityFilter, sortBy, sortOrder]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const filters: { status?: string; priority?: string; sortBy?: string; sortOrder?: string } = {};
      if (statusFilter) filters.status = statusFilter;
      if (priorityFilter) filters.priority = priorityFilter;
      if (sortBy) filters.sortBy = sortBy;
      if (sortOrder) filters.sortOrder = sortOrder;
      
      const data = await getProjects(filters);
      setProjects(data);
      setError(null);
    } catch (err) {
      setError("Failed to load projects");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject({
        name: formData.name,
        description: formData.description || null,
        priority: formData.priority,
        status: formData.status,
        target_client: formData.target_client || null,
        ibm_products: formData.ibm_products || null,
        next_action: formData.next_action || null,
      });
      setFormData({
        name: "",
        description: "",
        priority: "medium",
        status: "in-progress",
        target_client: "",
        ibm_products: "",
        next_action: "",
      });
      setCreateDialogOpen(false);
      loadProjects();
    } catch (err) {
      setError("Failed to create project");
      console.error(err);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    try {
      const updateData: ProjectUpdateInput = {
        name: formData.name,
        description: formData.description || null,
        priority: formData.priority,
        status: formData.status,
        target_client: formData.target_client || null,
        ibm_products: formData.ibm_products || null,
        next_action: formData.next_action || null,
      };
      
      await updateProject(selectedProject.id, updateData);
      setEditDialogOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (err) {
      setError("Failed to update project");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!selectedProject) return;
    
    try {
      await deleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      loadProjects();
    } catch (err) {
      setError("Failed to delete project");
      console.error(err);
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || "",
      priority: project.priority,
      status: project.status,
      target_client: project.target_client || "",
      ibm_products: project.ibm_products || "",
      next_action: project.next_action || "",
    });
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
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
  
  const handleLogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createDailyLog({
        log_date: logFormData.log_date,
        raw_text: logFormData.raw_text,
        project_id: logFormData.project_id ? parseInt(logFormData.project_id) : null,
      });
      setLogFormData({
        log_date: new Date().toISOString().split("T")[0],
        raw_text: "",
        project_id: "",
      });
      setLogDialogOpen(false);
      loadProjects();
    } catch (err) {
      setError("Failed to create log");
      console.error(err);
    }
  };
  
  const openLogDialog = (project: Project) => {
    setLogFormData({
      ...logFormData,
      project_id: project.id.toString(),
    });
    setLogDialogOpen(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-semibold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm max-w-2xl leading-relaxed">
            Manage your projects, track priorities, and monitor progress for
            performance-oriented tracking.
          </p>
        </div>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-sm">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Add a new project to track your work and achievements.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="Enter project name"
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
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="target-client">Target Client</Label>
                  <Input
                    id="target-client"
                    value={formData.target_client || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, target_client: e.target.value })
                    }
                    placeholder="e.g., ABC Corporation"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ibm-products">IBM Products</Label>
                  <Textarea
                    id="ibm-products"
                    value={formData.ibm_products || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, ibm_products: e.target.value })
                    }
                    placeholder="e.g., Watson, Cloud Pak for Data"
                    rows={2}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="next-action">Next Action</Label>
                  <Textarea
                    id="next-action"
                    value={formData.next_action || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, next_action: e.target.value })
                    }
                    placeholder="What needs to be done next?"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger id="priority">
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
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData({ ...formData, status: value })
                      }
                    >
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="business-development">Business Development</SelectItem>
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
                <Button type="submit">Create Project</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Sorting */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <CardTitle className="text-base">Filters & Sorting</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filter-status">Status</Label>
              <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value === "all" ? "" : value)}>
                <SelectTrigger id="filter-status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="business-development">Business Development</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="future-plan">Future Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-priority">Priority</Label>
              <Select value={priorityFilter || "all"} onValueChange={(value) => setPriorityFilter(value === "all" ? "" : value)}>
                <SelectTrigger id="filter-priority">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-by">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort-by">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort-order">Order</Label>
              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger id="sort-order">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(statusFilter || priorityFilter) && (
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("");
                    setPriorityFilter("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <p className="text-muted-foreground text-sm">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16 space-y-2">
            <h3 className="text-base font-medium text-muted-foreground">
              No projects found
            </h3>
            <p className="text-sm text-muted-foreground">
              {statusFilter || priorityFilter
                ? "Try adjusting your filters or create a new project."
                : "Create your first project to get started."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-md transition-all duration-200 border-border/50 cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl font-semibold">
                        {project.name}
                      </CardTitle>
                      <Badge
                        className={`text-xs font-medium ${getPriorityColor(project.priority)}`}
                      >
                        {project.priority}
                      </Badge>
                      <Badge
                        className={`text-xs font-medium ${getStatusColor(project.status)}`}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    {project.description && (
                      <CardDescription className="text-sm leading-relaxed">
                        {project.description}
                      </CardDescription>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(project)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => openLogDialog(project)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Log Daily Work
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(project)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                {/* Statistics */}
                <div className="flex items-center gap-6 pt-2 border-t text-xs text-muted-foreground">
                  <span>
                    Created {new Date(project.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  {project.total_logs !== undefined && (
                    <span>{project.total_logs} log{project.total_logs !== 1 ? 's' : ''}</span>
                  )}
                  {project.recent_activity && (
                    <span>
                      Last activity: {new Date(project.recent_activity).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleEdit}>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update project details and track progress.
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
                  rows={2}
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
                      <SelectItem value="business-development">Business Development</SelectItem>
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
              Are you sure you want to delete "{selectedProject?.name}"? This action
              cannot be undone and will also delete all associated daily logs.
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
    </div>
  );
}

// Made with Bob
