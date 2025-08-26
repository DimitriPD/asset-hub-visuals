import { useState } from "react";
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Reservation {
  id: string;
  assetName: string;
  assetImage: string;
  requestedBy: string;
  requestedDate: Date;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  purpose: string;
  notes?: string;
  approvedBy?: string;
  approvedDate?: Date;
  category: string;
}

export default function Reservations() {
  const { currentRole, user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isCreateReservationOpen, setIsCreateReservationOpen] = useState(false);

  // Mock reservations data
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      assetName: "Conference Room A",
      assetImage: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=400&h=300&fit=crop",
      requestedBy: "Sarah Johnson",
      requestedDate: new Date("2024-01-15"),
      startDate: new Date("2024-01-20T09:00:00"),
      endDate: new Date("2024-01-20T17:00:00"),
      status: "approved",
      purpose: "Monthly team meeting and quarterly review",
      notes: "Need projector and video conferencing setup",
      approvedBy: "Mike Wilson",
      approvedDate: new Date("2024-01-16"),
      category: "Meeting Rooms"
    },
    {
      id: "2", 
      assetName: "Company Vehicle - Toyota Prius",
      assetImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=300&fit=crop",
      requestedBy: "John Davis",
      requestedDate: new Date("2024-01-18"),
      startDate: new Date("2024-01-25T08:00:00"),
      endDate: new Date("2024-01-25T18:00:00"),
      status: "pending",
      purpose: "Client visit to downtown office",
      notes: "Will need parking pass for client building",
      category: "Vehicles"
    },
    {
      id: "3",
      assetName: "Presentation Projector",
      assetImage: "https://images.unsplash.com/photo-1591389938283-b5eff0e4d5bc?w=400&h=300&fit=crop",
      requestedBy: "Emily Brown",
      requestedDate: new Date("2024-01-10"),
      startDate: new Date("2024-01-15T14:00:00"),
      endDate: new Date("2024-01-15T16:00:00"),
      status: "completed",
      purpose: "Sales presentation to potential client",
      approvedBy: "Lisa Chen",
      approvedDate: new Date("2024-01-11"),
      category: "Electronics"
    },
    {
      id: "4",
      assetName: "Outdoor Event Tent",
      assetImage: "https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?w=400&h=300&fit=crop",
      requestedBy: "Michael Rodriguez",
      requestedDate: new Date("2024-01-12"),
      startDate: new Date("2024-01-30T08:00:00"),
      endDate: new Date("2024-01-30T20:00:00"),
      status: "rejected",
      purpose: "Company picnic and team building event",
      notes: "Weather concerns and permit issues",
      category: "Event Equipment"
    },
    {
      id: "5",
      assetName: "MacBook Pro 16\"",
      assetImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
      requestedBy: "Alex Kim",
      requestedDate: new Date("2024-01-19"),
      startDate: new Date("2024-01-22T09:00:00"),
      endDate: new Date("2024-01-29T17:00:00"),
      status: "pending",
      purpose: "Remote work during business trip",
      notes: "Need Adobe Creative Suite access",
      category: "Electronics"
    }
  ]);

  const statusOptions = ["all", "pending", "approved", "rejected", "completed"];

  const filteredReservations = reservations.filter(reservation => {
    const matchesStatus = selectedStatus === "all" || reservation.status === selectedStatus;
    const matchesUser = currentRole === 'admin' || reservation.requestedBy === user?.name;
    return matchesStatus && matchesUser;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'pending': return 'bg-warning text-warning-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'completed': return 'bg-info text-info-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleApprove = (reservationId: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId 
        ? { 
            ...res, 
            status: 'approved' as const, 
            approvedBy: user?.name || 'Admin',
            approvedDate: new Date()
          }
        : res
    ));
    
    toast({
      title: "Reservation Approved",
      description: "The reservation has been approved successfully.",
    });
  };

  const handleReject = (reservationId: string) => {
    setReservations(prev => prev.map(res => 
      res.id === reservationId 
        ? { ...res, status: 'rejected' as const }
        : res
    ));
    
    toast({
      title: "Reservation Rejected",
      description: "The reservation has been rejected.",
      variant: "destructive"
    });
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateRange = (start: Date, end: Date) => {
    const sameDay = start.toDateString() === end.toDateString();
    
    if (sameDay) {
      return `${start.toLocaleDateString()} ${start.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })} - ${end.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else {
      return `${formatDateTime(start)} to ${formatDateTime(end)}`;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservations</h1>
          <p className="text-foreground-muted">
            {currentRole === 'admin' 
              ? 'Manage all asset reservations and approvals' 
              : 'View and manage your asset reservations'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentRole !== 'admin' && (
            <Dialog open={isCreateReservationOpen} onOpenChange={setIsCreateReservationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-primary text-white border-none hover:opacity-90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Reservation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-surface border-border-subtle">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Create New Reservation</DialogTitle>
                  <DialogDescription className="text-foreground-muted">
                    Request to reserve an asset for a specific time period
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Asset</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an asset to reserve" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conf-room-a">Conference Room A</SelectItem>
                        <SelectItem value="projector">Presentation Projector</SelectItem>
                        <SelectItem value="vehicle">Company Vehicle</SelectItem>
                        <SelectItem value="laptop">MacBook Pro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date & Time</Label>
                      <Input type="datetime-local" />
                    </div>
                    <div>
                      <Label>End Date & Time</Label>
                      <Input type="datetime-local" />
                    </div>
                  </div>
                  <div>
                    <Label>Purpose</Label>
                    <Input placeholder="Reason for reservation" />
                  </div>
                  <div>
                    <Label>Additional Notes</Label>
                    <Textarea placeholder="Any special requirements or notes" />
                  </div>
                  <Button onClick={() => setIsCreateReservationOpen(false)}>
                    Submit Reservation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 p-4 bg-surface rounded-lg border border-border-subtle">
        <Filter className="w-4 h-4 text-foreground-muted" />
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(status => (
              <SelectItem key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {filteredReservations.map((reservation) => (
          <Card key={reservation.id} className="bg-surface border-border-subtle hover:shadow-card transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                {/* Asset Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={reservation.assetImage} 
                    alt={reservation.assetName}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                </div>

                {/* Reservation Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{reservation.assetName}</h3>
                      <p className="text-foreground-muted">{reservation.category}</p>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      {getStatusIcon(reservation.status)}
                      <span className="ml-1 capitalize">{reservation.status}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-foreground-muted">Requested by:</span>
                        <span className="text-foreground font-medium">{reservation.requestedBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-foreground-muted">Requested on:</span>
                        <span className="text-foreground">{reservation.requestedDate.toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-foreground-muted">Duration:</span>
                        <span className="text-foreground">{formatDateRange(reservation.startDate, reservation.endDate)}</span>
                      </div>
                      {reservation.approvedBy && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-success" />
                          <span className="text-foreground-muted">Approved by:</span>
                          <span className="text-foreground">{reservation.approvedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-foreground-muted font-medium mb-1">Purpose:</p>
                    <p className="text-foreground">{reservation.purpose}</p>
                  </div>

                  {reservation.notes && (
                    <div>
                      <p className="text-sm text-foreground-muted font-medium mb-1">Notes:</p>
                      <p className="text-sm text-foreground-muted">{reservation.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons for Admin */}
                  {currentRole === 'admin' && reservation.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(reservation.id)}
                        className="bg-success text-success-foreground hover:bg-success/90"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleReject(reservation.id)}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No reservations */}
      {filteredReservations.length === 0 && (
        <div className="text-center py-20">
          <Calendar className="w-16 h-16 text-foreground-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No reservations found</h3>
          <p className="text-foreground-muted">
            {selectedStatus === 'all' 
              ? 'No reservations to display' 
              : `No ${selectedStatus} reservations found`}
          </p>
        </div>
      )}
    </div>
  );
}