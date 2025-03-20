
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Upload, Download, Search, CheckCircle, XCircle, MoreHorizontal, UserCog, Trash, BookPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import UserAddModal, { UserFormValues } from "./UserAddModal";
import UserBulkImportModal from "./UserBulkImportModal";
import { useAuth } from "@/context/AuthContext";

// Sample user data - in a real app, this would come from an API
const initialUsers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john@example.com", 
    role: "Admin", 
    status: "Active", 
    lastLogin: "2023-05-12",
    group: "College A"
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane@example.com", 
    role: "Instructor", 
    status: "Active", 
    lastLogin: "2023-05-10",
    group: "Web Development"
  },
  { 
    id: 3, 
    name: "Bob Johnson", 
    email: "bob@example.com", 
    role: "Student", 
    status: "Inactive", 
    lastLogin: "2023-04-22",
    group: null
  },
  { 
    id: 4, 
    name: "Alice Williams", 
    email: "alice@example.com", 
    role: "Student", 
    status: "Active", 
    lastLogin: "2023-05-11",
    group: "College A"
  },
  { 
    id: 5, 
    name: "Charlie Brown", 
    email: "charlie@example.com", 
    role: "Instructor", 
    status: "Active", 
    lastLogin: "2023-05-09",
    group: "Business School"
  },
];

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState(initialUsers);
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const { hasPermission } = useAuth();
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.group && user.group.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddUser = (userData: UserFormValues) => {
    const newUser = {
      id: users.length + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      lastLogin: "Never",
      group: userData.group ? groups.find(g => g.id === userData.group)?.name || null : null
    };
    
    setUsers([...users, newUser]);
  };

  const handleImportUsers = (importedUsers: UserFormValues[]) => {
    const newUsers = importedUsers.map((userData, index) => ({
      id: users.length + index + 1,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      status: userData.status,
      lastLogin: "Never",
      group: userData.group ? groups.find(g => g.id === userData.group)?.name || null : null
    }));
    
    setUsers([...users, ...newUsers]);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">User Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{users.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {users.filter(user => user.status === "Active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New Users (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {/* Mock calculation for demo */}
              {Math.floor(users.length * 0.3)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2">
          <Button 
            className="gap-1"
            onClick={() => setAddUserModalOpen(true)}
            disabled={!hasPermission("manage_users")}
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
          <Button 
            variant="outline" 
            className="gap-1"
            onClick={() => setImportModalOpen(true)}
            disabled={!hasPermission("manage_users")}
          >
            <Upload className="h-4 w-4" />
            Import
          </Button>
          <Button variant="outline" className="gap-1">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      {user.group ? (
                        <Badge variant="outline">{user.group}</Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">None</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.status === "Active" 
                        ? <span className="inline-flex items-center gap-1 text-green-600"><CheckCircle className="h-4 w-4" /> Active</span>
                        : <span className="inline-flex items-center gap-1 text-red-600"><XCircle className="h-4 w-4" /> Inactive</span>
                      }
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <UserCog className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BookPlus className="h-4 w-4 mr-2" />
                            Assign Courses
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Add User Modal */}
      <UserAddModal 
        open={addUserModalOpen}
        onOpenChange={setAddUserModalOpen}
        onUserAdded={handleAddUser}
      />

      {/* Import Users Modal */}
      <UserBulkImportModal
        open={importModalOpen}
        onOpenChange={setImportModalOpen}
        onUsersImported={handleImportUsers}
      />
    </div>
  );
};

// Sample groups data
const groups = [
  { id: "1", name: "College A" },
  { id: "2", name: "Web Development" },
  { id: "3", name: "Business School" },
  { id: "4", name: "Marketing Team" },
];

export default UserManagement;
