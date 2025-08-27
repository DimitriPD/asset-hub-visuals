import { useState } from "react";
import { Search, Edit, Users, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useAuth, useTranslation, User as UserType } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function Employees() {
  const { currentRole } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEmployee, setEditingEmployee] = useState<UserType | null>(null);

  // Mock employees data
  const [employees, setEmployees] = useState<UserType[]>([
    {
      id: '1',
      email: 'admin@company.com',
      name: 'Sarah Johnson',
      profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b68e8bdd?w=150&h=150&fit=crop&crop=face',
      entryDate: '2020-01-15',
      role: 'admin',
      department: 'IT Administration',
      accessGroups: ['admin', 'managers', 'employees']
    },
    {
      id: '2',
      email: 'user@company.com',
      name: 'Michael Chen',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      entryDate: '2021-03-22',
      role: 'user',
      department: 'Marketing',
      accessGroups: ['employees']
    },
    {
      id: '3',
      email: 'john.doe@company.com',
      name: 'John Doe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      entryDate: '2019-08-10',
      role: 'admin',
      department: 'Human Resources',
      accessGroups: ['admin', 'managers', 'employees']
    },
    {
      id: '4',
      email: 'jane.smith@company.com',
      name: 'Jane Smith',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      entryDate: '2022-05-15',
      role: 'user',
      department: 'Sales',
      accessGroups: ['employees']
    },
    {
      id: '5',
      email: 'alex.wilson@company.com',
      name: 'Alex Wilson',
      profilePicture: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&h=150&fit=crop&crop=face',
      entryDate: '2021-11-30',
      role: 'user',
      department: 'Engineering',
      accessGroups: ['employees']
    },
    {
      id: '6',
      email: 'lisa.brown@company.com',
      name: 'Lisa Brown',
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      entryDate: '2020-07-20',
      role: 'admin',
      department: 'Finance',
      accessGroups: ['admin', 'managers', 'employees']
    }
  ]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminEmployees = filteredEmployees.filter(emp => emp.role === 'admin');
  const regularEmployees = filteredEmployees.filter(emp => emp.role === 'user');

  const handleRoleChange = (employeeId: string, newRole: 'admin' | 'user') => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId 
        ? { 
            ...emp, 
            role: newRole,
            accessGroups: newRole === 'admin' 
              ? ['admin', 'managers', 'employees']
              : ['employees']
          }
        : emp
    ));
    
    toast({
      title: "Role Updated",
      description: `Employee role has been changed to ${newRole}.`,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (currentRole !== 'admin') {
    return (
      <div className="p-6">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-foreground mb-4">Access Restricted</h2>
          <p className="text-foreground-muted">Employee management is only available for administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t('employees')}</h1>
          <p className="text-foreground-muted">Manage employee roles and access permissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-foreground-muted">
            Total: {employees.length} employees
          </Badge>
        </div>
      </div>

      {/* Search */}
      <div className="p-4 bg-white rounded-lg border border-border-subtle shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground-muted" />
          <Input
            placeholder="Search employees by name, email, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white"
          />
        </div>
      </div>

      {/* Administrators Section */}
      <Card className="bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Administrators ({adminEmployees.length})
          </CardTitle>
          <CardDescription className="text-foreground-muted">
            Users with administrative privileges and full system access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {adminEmployees.map((employee) => (
              <Card key={employee.id} className="bg-surface-elevated border-border-subtle">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={employee.profilePicture} 
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{employee.name}</h3>
                      <p className="text-sm text-foreground-muted truncate">{employee.email}</p>
                      <p className="text-sm text-foreground-muted">{employee.department}</p>
                      <p className="text-xs text-foreground-muted">
                        Since {formatDate(employee.entryDate)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className="bg-primary text-primary-foreground">
                        Admin
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingEmployee(employee)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-surface border-border-subtle">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Edit Employee Role</DialogTitle>
                            <DialogDescription className="text-foreground-muted">
                              Change the role and permissions for {employee.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Role</Label>
                              <Select 
                                value={employee.role} 
                                onValueChange={(value: 'admin' | 'user') => handleRoleChange(employee.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="user">Regular User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Access Groups</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {employee.accessGroups.map(group => (
                                  <Badge key={group} variant="outline">
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regular Users Section */}
      <Card className="bg-surface border-border-subtle">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <User className="w-5 h-5" />
            Regular Users ({regularEmployees.length})
          </CardTitle>
          <CardDescription className="text-foreground-muted">
            Standard employees with limited system access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularEmployees.map((employee) => (
              <Card key={employee.id} className="bg-surface-elevated border-border-subtle">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <img 
                      src={employee.profilePicture} 
                      alt={employee.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate">{employee.name}</h3>
                      <p className="text-sm text-foreground-muted truncate">{employee.email}</p>
                      <p className="text-sm text-foreground-muted">{employee.department}</p>
                      <p className="text-xs text-foreground-muted">
                        Since {formatDate(employee.entryDate)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <Badge variant="outline" className="text-foreground-muted">
                        User
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setEditingEmployee(employee)}
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-surface border-border-subtle">
                          <DialogHeader>
                            <DialogTitle className="text-foreground">Edit Employee Role</DialogTitle>
                            <DialogDescription className="text-foreground-muted">
                              Change the role and permissions for {employee.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label>Current Role</Label>
                              <Select 
                                value={employee.role} 
                                onValueChange={(value: 'admin' | 'user') => handleRoleChange(employee.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Administrator</SelectItem>
                                  <SelectItem value="user">Regular User</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Access Groups</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {employee.accessGroups.map(group => (
                                  <Badge key={group} variant="outline">
                                    {group}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* No results */}
      {filteredEmployees.length === 0 && (
        <div className="text-center py-20">
          <h3 className="text-xl font-semibold text-foreground mb-2">No employees found</h3>
          <p className="text-foreground-muted">Try adjusting your search criteria</p>
        </div>
      )}
    </div>
  );
}