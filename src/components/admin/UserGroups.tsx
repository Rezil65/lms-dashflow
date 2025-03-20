
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Users, 
  FolderPlus, 
  Pencil, 
  Trash, 
  MoreHorizontal, 
  UserPlus,
  BookPlus
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Define the validation schema for group form
const groupFormSchema = z.object({
  name: z.string().min(2, {
    message: "Group name must be at least 2 characters.",
  }),
  description: z.string().optional(),
});

type GroupFormValues = z.infer<typeof groupFormSchema>;

// Sample groups data - in a real app, this would come from an API
const initialGroups = [
  { 
    id: 1, 
    name: "College A", 
    description: "Students and faculty from College A",
    memberCount: 45,
    courses: 3,
  },
  { 
    id: 2, 
    name: "Web Development", 
    description: "Web development track students",
    memberCount: 28,
    courses: 5,
  },
  { 
    id: 3, 
    name: "Business School", 
    description: "Business program participants",
    memberCount: 36,
    courses: 4,
  },
  { 
    id: 4, 
    name: "Marketing Team", 
    description: "Marketing department members",
    memberCount: 12,
    courses: 2,
  },
];

const UserGroups = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState(initialGroups);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [currentGroup, setCurrentGroup] = useState<{ id: number } | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });
  
  // Filter groups based on search query
  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (group.description && group.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const openAddGroupModal = () => {
    setCurrentGroup(null);
    setIsEditMode(false);
    form.reset({
      name: "",
      description: "",
    });
    setGroupModalOpen(true);
  };
  
  const openEditGroupModal = (group: typeof initialGroups[0]) => {
    setCurrentGroup(group);
    setIsEditMode(true);
    form.reset({
      name: group.name,
      description: group.description || "",
    });
    setGroupModalOpen(true);
  };
  
  const handleSubmitGroup = (values: GroupFormValues) => {
    if (isEditMode && currentGroup) {
      // Edit existing group
      setGroups(groups.map(group => 
        group.id === currentGroup.id
          ? { ...group, name: values.name, description: values.description }
          : group
      ));
      toast.success("Group updated successfully");
    } else {
      // Add new group
      const newGroup = {
        id: Math.max(0, ...groups.map(g => g.id)) + 1,
        name: values.name,
        description: values.description || "",
        memberCount: 0,
        courses: 0,
      };
      setGroups([...groups, newGroup]);
      toast.success("Group created successfully");
    }
    
    setGroupModalOpen(false);
    form.reset();
  };
  
  const handleDeleteGroup = (id: number) => {
    // In a real app, this would call an API to delete the group
    setGroups(groups.filter(group => group.id !== id));
    toast.success("Group deleted successfully");
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Groups</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{groups.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {groups.reduce((total, group) => total + group.memberCount, 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Assigned Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {groups.reduce((total, group) => total + group.courses, 0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <Button 
            className="gap-1"
            onClick={openAddGroupModal}
          >
            <FolderPlus className="h-4 w-4" />
            Create Group
          </Button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search groups..." 
            className="pl-8" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.length > 0 ? (
                filteredGroups.map(group => (
                  <TableRow key={group.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {group.name}
                      </div>
                    </TableCell>
                    <TableCell>{group.description}</TableCell>
                    <TableCell>{group.memberCount}</TableCell>
                    <TableCell>{group.courses}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditGroupModal(group)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add Members
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookPlus className="h-4 w-4 mr-2" />
                            Assign Courses
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteGroup(group.id)}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No groups found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Add/Edit Group Modal */}
      <Dialog open={groupModalOpen} onOpenChange={setGroupModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Group" : "Create New Group"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode 
                ? "Update the details for this user group." 
                : "Create a new group to categorize users."
              }
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmitGroup)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Group Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Marketing Team" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Brief description of this group" 
                        {...field} 
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setGroupModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {isEditMode ? "Save Changes" : "Create Group"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserGroups;
