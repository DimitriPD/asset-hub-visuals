import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth, useTranslation } from "@/contexts/AuthContext";
import { 
  Plus, 
  Clock, 
  Users, 
  Gavel, 
  Trophy, 
  Timer, 
  Send,
  Heart,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

interface Event {
  id: string;
  title: string;
  type: 'auction' | 'sortition';
  status: 'upcoming' | 'live' | 'ended';
  startDate: Date;
  endDate: Date;
  participants: number;
  maxParticipants: number;
  description: string;
  assets: EventAsset[];
  rules: string[];
  currentWinner?: string;
  minCompanyTime?: number; // in months
}

interface EventAsset {
  id: string;
  name: string;
  image: string;
  startingBid?: number;
  currentBid?: number;
  bidder?: string;
  quantity: number;
  description: string;
}

export default function Events() {
  const { currentRole, user } = useAuth();
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bidAmount, setBidAmount] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  // Mocked corporate calendar events (AIE)
  const corporateCalendar = [
    { date: '2025-10-12', type: 'Feriado', reason: t('holidayNossaSenhoraAparecida'), color: 'bg-red-500' },
    { date: '2025-10-13', type: 'Reunião', reason: t('meetingReuniaoGeral'), color: 'bg-blue-500' },
    { date: '2025-10-14', type: 'Recesso', reason: t('recessRecessoAdministrativo'), color: 'bg-yellow-500' },
  ];

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Office Equipment Auction",
      type: "auction",
      status: "live",
      startDate: new Date(Date.now() - 3600000), // 1 hour ago
      endDate: new Date(Date.now() + 7200000), // 2 hours from now
      participants: 15,
      maxParticipants: 50,
      description: "Auction for premium office equipment including chairs, desks, and monitors",
      minCompanyTime: 6,
      assets: [
        {
          id: "a1",
          name: "Herman Miller Chair",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
          startingBid: 200,
          currentBid: 350,
          bidder: "John D.",
          quantity: 1,
          description: "Premium ergonomic office chair"
        },
        {
          id: "a2", 
          name: "Standing Desk",
          image: "https://images.unsplash.com/photo-1595515106969-1ce29566662e?w=400&h=300&fit=crop",
          startingBid: 300,
          currentBid: 425,
          bidder: "Sarah W.",
          quantity: 1,
          description: "Electric height-adjustable standing desk"
        }
      ],
      rules: [
        "Minimum bid increment: $25",
        "Bids are final and cannot be retracted",
        "Payment due within 48 hours",
        "Pickup required within 1 week"
      ]
    },
    {
      id: "2",
      title: "Tech Gadgets Sortition",
      type: "sortition",
      status: "upcoming",
      startDate: new Date(Date.now() + 86400000), // 1 day from now
      endDate: new Date(Date.now() + 172800000), // 2 days from now
      participants: 8,
      maxParticipants: 20,
      description: "Sortition event for latest tech gadgets and accessories",
      minCompanyTime: 12,
      assets: [
        {
          id: "s1",
          name: "iPad Pro 12.9\"",
          image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
          quantity: 2,
          description: "Latest generation iPad Pro with accessories"
        },
        {
          id: "s2",
          name: "AirPods Pro",
          image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=400&h=300&fit=crop",
          quantity: 5,
          description: "Wireless earbuds with active noise cancellation"
        }
      ],
      rules: [
        "Maximum 1 item per participant",
        "Purchase window: 10 minutes",
        "Turn order determined by sortition",
        "Payment via payroll deduction only"
      ]
    },
    {
      id: "3",
      title: "Furniture Clearance Auction",
      type: "auction",
      status: "ended",
      startDate: new Date(Date.now() - 259200000), // 3 days ago
      endDate: new Date(Date.now() - 172800000), // 2 days ago
      participants: 22,
      maxParticipants: 30,
      description: "Clearance auction for office furniture",
      assets: [
        {
          id: "e1",
          name: "Conference Table",
          image: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400&h=300&fit=crop",
          startingBid: 500,
          currentBid: 750,
          bidder: "Michael C.",
          quantity: 1,
          description: "Large oak conference table"
        }
      ],
      rules: ["Standard auction rules apply"]
    }
  ]);

  // Mock chat messages for auction
  const [chatMessages] = useState([
    { id: 1, user: "Sarah W.", message: "Great selection this time!", time: "2 min ago" },
    { id: 2, user: "John D.", message: "Anyone interested in the chair?", time: "5 min ago" },
    { id: 3, user: "Mike L.", message: "The desk is perfect for my home office", time: "7 min ago" },
    { id: 4, user: "Lisa K.", message: "Good luck everyone! 🍀", time: "10 min ago" }
  ]);

  // Auto-update auction times and bids (simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      setEvents(prev => prev.map(event => {
        if (event.status === 'live' && event.type === 'auction') {
          // Simulate random bid updates
          if (Math.random() < 0.3) {
            return {
              ...event,
              assets: event.assets.map(asset => ({
                ...asset,
                currentBid: asset.currentBid ? asset.currentBid + 25 : asset.startingBid! + 25
              }))
            };
          }
        }
        return event;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBid = (assetId: string) => {
    const amount = parseFloat(bidAmount);
    if (!amount || !selectedEvent) return;

    const asset = selectedEvent.assets.find(a => a.id === assetId);
    if (!asset || !asset.currentBid) return;

    if (amount <= asset.currentBid) {
      toast({
        title: "Invalid Bid",
        description: `Bid must be higher than current bid of $${asset.currentBid}`,
        variant: "destructive"
      });
      return;
    }

    // Update the bid
    setEvents(prev => prev.map(event => {
      if (event.id === selectedEvent.id) {
        return {
          ...event,
          assets: event.assets.map(a => 
            a.id === assetId 
              ? { ...a, currentBid: amount, bidder: user?.name.split(' ')[0] + " " + user?.name.split(' ')[1]?.[0] + "." }
              : a
          )
        };
      }
      return event;
    }));

    setBidAmount("");
    toast({
      title: "Bid Placed",
      description: `Your bid of $${amount} has been placed successfully!`,
    });
  };

  const joinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, participants: event.participants + 1 }
        : event
    ));
    
    toast({
      title: "Joined Event",
      description: "You have successfully joined the event!",
    });
  };

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-auction-live text-white';
      case 'upcoming': return 'bg-auction-upcoming text-white';
      case 'ended': return 'bg-auction-ended text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diff = endDate.getTime() - now.getTime();
    
    if (diff <= 0) return "Ended";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  const activeEvents = events.filter(e => e.status === 'live' || e.status === 'upcoming');
  const myEvents = events.filter(e => e.participants > 0); // Mock user participation
  const endedEvents = events.filter(e => e.status === 'ended');

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-foreground-muted">
            {currentRole === 'admin' 
              ? 'Manage auctions and sortition events' 
              : 'Participate in auctions and sortitions'}
          </p>
        </div>
        {currentRole === 'admin' && (
          <Dialog open={isCreateEventOpen} onOpenChange={setIsCreateEventOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary text-white border-none hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-surface border-border-subtle">
              <DialogHeader>
                <DialogTitle className="text-foreground">Create New Event</DialogTitle>
                <DialogDescription className="text-foreground-muted">
                  Set up a new auction or sortition event
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('eventTitle')}</Label>
                    <Input placeholder="Enter event title" />
                  </div>
                  <div>
                    <Label>{t('eventType')}</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auction">Auction</SelectItem>
                        <SelectItem value="sortition">Sortition</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>{t('description')}</Label>
                  <Textarea placeholder="Event description" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>{t('startDateTime')}</Label>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => {
                        const d = date.toISOString().slice(0, 10);
                        return corporateCalendar.some(ev => ev.date === d);
                      }}
                      modifiers={{
                        feriado: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Feriado'),
                        reuniao: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Reunião'),
                        recesso: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Recesso'),
                      }}
                      modifiersClassNames={{
                        feriado: 'bg-red-500 text-white',
                        reuniao: 'bg-blue-500 text-white',
                        recesso: 'bg-yellow-500 text-black',
                      }}
                    />
                  </div>
                  <div>
                    <Label>{t('endDateTime')}</Label>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) => {
                        const d = date.toISOString().slice(0, 10);
                        return corporateCalendar.some(ev => ev.date === d);
                      }}
                      modifiers={{
                        feriado: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Feriado'),
                        reuniao: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Reunião'),
                        recesso: (date) => corporateCalendar.some(ev => ev.date === date.toISOString().slice(0, 10) && ev.type === 'Recesso'),
                      }}
                      modifiersClassNames={{
                        feriado: 'bg-red-500 text-white',
                        reuniao: 'bg-blue-500 text-white',
                        recesso: 'bg-yellow-500 text-black',
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <span className="w-3 h-3 bg-red-500 inline-block rounded-full mr-1"></span> {t('holiday')}
                  <span className="w-3 h-3 bg-blue-500 inline-block rounded-full mx-2"></span> {t('meeting')}
                  <span className="w-3 h-3 bg-yellow-500 inline-block rounded-full mx-2"></span> {t('recess')}
                </div>
                <Button onClick={() => setIsCreateEventOpen(false)}>Create Event</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Event Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-surface border border-border-subtle">
          <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            Active Events
          </TabsTrigger>
          <TabsTrigger value="my-events" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            My Events
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            History
          </TabsTrigger>
        </TabsList>

        {/* Active Events */}
        <TabsContent value="active" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeEvents.map((event) => (
              <Card key={event.id} className="bg-surface border-border-subtle hover:shadow-card transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        {event.type === 'auction' ? <Gavel className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                        {event.title}
                      </CardTitle>
                      <CardDescription className="text-foreground-muted">
                        {event.description}
                      </CardDescription>
                    </div>
                    <Badge className={getEventStatusColor(event.status)}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground-muted">
                        {formatTimeRemaining(event.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-foreground-muted">
                        {event.participants}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Assets ({event.assets.length})</p>
                    <div className="grid grid-cols-2 gap-2">
                      {event.assets.slice(0, 2).map((asset) => (
                        <div key={asset.id} className="text-xs bg-surface-elevated p-2 rounded border border-border-subtle">
                          <p className="font-medium text-foreground">{asset.name}</p>
                          {event.type === 'auction' && asset.currentBid && (
                            <p className="text-primary">${asset.currentBid}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedEvent(event)}
                          className="flex-1"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-surface border-border-subtle">
                        <DialogHeader>
                          <DialogTitle className="text-foreground flex items-center gap-2">
                            {event.type === 'auction' ? <Gavel className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                            {event.title}
                          </DialogTitle>
                          <DialogDescription className="text-foreground-muted">
                            {event.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Event Assets */}
                          <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-semibold text-foreground">Assets</h3>
                            <div className="space-y-4">
                              {event.assets.map((asset) => (
                                <Card key={asset.id} className="bg-surface-elevated border-border-subtle">
                                  <CardContent className="p-4">
                                    <div className="flex gap-4">
                                      <img 
                                        src={asset.image} 
                                        alt={asset.name}
                                        className="w-20 h-20 object-cover rounded-lg"
                                      />
                                      <div className="flex-1">
                                        <h4 className="font-medium text-foreground">{asset.name}</h4>
                                        <p className="text-sm text-foreground-muted">{asset.description}</p>
                                        {event.type === 'auction' && (
                                          <div className="mt-2 space-y-2">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-foreground-muted">Current Bid:</span>
                                              <span className="font-bold text-primary">${asset.currentBid}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span className="text-foreground-muted">Leading Bidder:</span>
                                              <span className="text-foreground">{asset.bidder}</span>
                                            </div>
                                            {event.status === 'live' && (
                                              <div className="flex gap-2">
                                                <Input
                                                  type="number"
                                                  placeholder="Bid amount"
                                                  value={bidAmount}
                                                  onChange={(e) => setBidAmount(e.target.value)}
                                                  className="flex-1"
                                                />
                                                <Button 
                                                  size="sm"
                                                  onClick={() => handleBid(asset.id)}
                                                  className="bg-gradient-primary text-white border-none hover:opacity-90"
                                                >
                                                  Bid
                                                </Button>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        {event.type === 'sortition' && (
                                          <div className="mt-2">
                                            <div className="flex justify-between text-sm">
                                              <span className="text-foreground-muted">Quantity:</span>
                                              <span className="text-foreground">{asset.quantity} available</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>

                          {/* Event Info & Chat */}
                          <div className="space-y-4">
                            {/* Event Info */}
                            <Card className="bg-surface-elevated border-border-subtle">
                              <CardHeader>
                                <CardTitle className="text-sm text-foreground">Event Information</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-foreground-muted">Status:</span>
                                  <Badge className={getEventStatusColor(event.status)}>
                                    {event.status}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground-muted">Type:</span>
                                  <span className="text-foreground capitalize">{event.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground-muted">Participants:</span>
                                  <span className="text-foreground">{event.participants}/{event.maxParticipants}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-foreground-muted">Time Remaining:</span>
                                  <span className="text-foreground">{formatTimeRemaining(event.endDate)}</span>
                                </div>
                                {event.minCompanyTime && (
                                  <div className="flex justify-between">
                                    <span className="text-foreground-muted">Min. Company Time:</span>
                                    <span className="text-foreground">{event.minCompanyTime} months</span>
                                  </div>
                                )}
                              </CardContent>
                            </Card>

                            {/* Rules */}
                            <Card className="bg-surface-elevated border-border-subtle">
                              <CardHeader>
                                <CardTitle className="text-sm text-foreground">Rules</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ul className="space-y-1 text-xs text-foreground-muted">
                                  {event.rules.map((rule, index) => (
                                    <li key={index}>• {rule}</li>
                                  ))}
                                </ul>
                              </CardContent>
                            </Card>

                            {/* Chat (only for live auctions) */}
                            {event.type === 'auction' && event.status === 'live' && (
                              <Card className="bg-surface-elevated border-border-subtle">
                                <CardHeader>
                                  <CardTitle className="text-sm text-foreground flex items-center gap-2">
                                    <MessageCircle className="w-4 h-4" />
                                    Chat
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="h-32 overflow-y-auto space-y-2">
                                    {chatMessages.map((msg) => (
                                      <div key={msg.id} className="text-xs">
                                        <div className="flex justify-between">
                                          <span className="font-medium text-foreground">{msg.user}</span>
                                          <span className="text-foreground-subtle">{msg.time}</span>
                                        </div>
                                        <p className="text-foreground-muted">{msg.message}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      placeholder="Type a message..."
                                      value={chatMessage}
                                      onChange={(e) => setChatMessage(e.target.value)}
                                      className="flex-1 text-xs"
                                    />
                                    <Button size="sm" variant="outline">
                                      <Send className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {event.status === 'upcoming' && (
                      <Button 
                        size="sm" 
                        onClick={() => joinEvent(event.id)}
                        className="bg-gradient-primary text-white border-none hover:opacity-90"
                      >
                        Join Event
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Events */}
        <TabsContent value="my-events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {myEvents.map((event) => (
              <Card key={event.id} className="bg-surface border-border-subtle">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {event.type === 'auction' ? <Gavel className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                    {event.title}
                  </CardTitle>
                  <Badge className={getEventStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">You are participating in this event</p>
                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {endedEvents.map((event) => (
              <Card key={event.id} className="bg-surface border-border-subtle opacity-80">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    {event.type === 'auction' ? <Gavel className="w-5 h-5" /> : <Trophy className="w-5 h-5" />}
                    {event.title}
                  </CardTitle>
                  <Badge className={getEventStatusColor(event.status)}>
                    Ended
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-foreground-muted">Event ended on {event.endDate.toLocaleDateString()}</p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">
                      View Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}