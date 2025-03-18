
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  UserCog, 
  Plus, 
  Shield, 
  Users, 
  BookOpen, 
  FileText, 
  BarChart, 
  Mail, 
  CreditCard, 
  Settings
} from "lucide-react";

// Mock role permissions data
const rolePermissions = [
  { 
    id: 1, 
    name: "Administrator", 
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      courses: { view: true, create: true, edit: true, delete: true },
      content: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true, export: true },
      communication: { view: true, send: true },
      payments: { view: true, process: true, refund: true },
      settings: { view: true, edit: true }
    }
  },
  { 
    id: 2, 
    name: "Instructor", 
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      courses: { view: true, create: true, edit: true, delete: false },
      content: { view: true, create: true, edit: true, delete: true },
      analytics: { view: true, export: false },
      communication: { view: true, send: true },
      payments: { view: true, process: false, refund: false },
      settings: { view: false, edit: false }
    }
  },
  { 
    id: 3, 
    name: "Student", 
    permissions: {
      users: { view: false, create: false, edit: false, delete: false },
      courses: { view: true, create: false, edit: false, delete: false },
      content: { view: true, create: false, edit: false, delete: false },
      analytics: { view: false, export: false },
      communication: { view: true, send: false },
      payments: { view: true, process: false, refund: false },
      settings: { view: false, edit: false }
    }
  }
];

const getRoleIcon = (name: string) => {
  switch(name.toLowerCase()) {
    case "administrator":
      return <Shield className="h-5 w-5 text-red-600" />;
    case "instructor":
      return <BookOpen className="h-5 w-5 text-blue-600" />;
    case "student":
      return <Users className="h-5 w-5 text-green-600" />;
    default:
      return <UserCog className="h-5 w-5 text-gray-600" />;
  }
};

const getModuleIcon = (module: string) => {
  switch(module.toLowerCase()) {
    case "users":
      return <Users className="h-4 w-4" />;
    case "courses":
      return <BookOpen className="h-4 w-4" />;
    case "content":
      return <FileText className="h-4 w-4" />;
    case "analytics":
      return <BarChart className="h-4 w-4" />;
    case "communication":
      return <Mail className="h-4 w-4" />;
    case "payments":
      return <CreditCard className="h-4 w-4" />;
    case "settings":
      return <Settings className="h-4 w-4" />;
    default:
      return <Shield className="h-4 w-4" />;
  }
};

const RoleAccess = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Role-Based Access Control</h2>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          Create Role
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {rolePermissions.map(role => (
          <Card key={role.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                {getRoleIcon(role.name)}
                {role.name} Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>View</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(role.permissions).map(([module, permissions]) => (
                    <TableRow key={module}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {getModuleIcon(module)}
                          <span className="capitalize">{module}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={'view' in permissions ? permissions.view : false}
                          disabled={role.name === "Administrator"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={'create' in permissions ? permissions.create : false}
                          disabled={role.name === "Administrator"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={'edit' in permissions ? permissions.edit : false}
                          disabled={role.name === "Administrator"}
                        />
                      </TableCell>
                      <TableCell>
                        <Switch 
                          checked={'delete' in permissions ? permissions.delete : false}
                          disabled={role.name === "Administrator"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RoleAccess;
