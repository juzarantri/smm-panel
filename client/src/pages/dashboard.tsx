import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Search,
  Bell,
  Settings,
  DollarSign,
  Sun,
  Moon,
  ChevronLeft,
  Plus,
  Sparkles,
  ShoppingCart,
  CreditCard,
  Ticket,
  HelpCircle,
  Star,
  MoreHorizontal,
  Menu,
  X
} from "lucide-react";
import { 
  SiInstagram, 
  SiFacebook, 
  SiYoutube, 
  SiX, 
  SiSpotify, 
  SiTelegram, 
  SiDiscord, 
  SiSnapchat, 
  SiLinkedin,
  SiGoogle,
  SiTiktok,
  SiTwitch
} from "react-icons/si";
import type { Order, Service, ServiceCategory } from "@shared/schema";

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState("new-order");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Order form state
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<number>(100);
  const [link, setLink] = useState<string>("");

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: isAuthenticated,
  });

  const { data: socialPlatforms = [], isLoading: platformsLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  });

  // Get service categories for selected platform
  const { data: platformCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/platforms", selectedPlatform, "categories"],
    enabled: !!selectedPlatform,
  });

  // Get services for selected platform and category
  const { data: categoryServices = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/platforms", selectedPlatform, "categories", selectedCategory, "services"],
    enabled: !!selectedPlatform && !!selectedCategory,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      return apiRequest("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      });
    },
    onSuccess: () => {
      toast({ title: "Order created successfully!" });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      // Reset form
      setSelectedPlatform(null);
      setSelectedCategory(null);
      setSelectedService(null);
      setQuantity(100);
      setLink("");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create order", 
        description: error.message || "Please try again",
        variant: "destructive"
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  const sidebarItems = [
    { id: "new-order", label: "New Order", icon: Plus, color: "text-orange-500" },
    { id: "mass-order", label: "Mass Order", icon: ShoppingCart, color: "text-gray-600" },
    { id: "orders", label: "Orders", icon: ShoppingCart, color: "text-orange-500" },
    { id: "add-funds", label: "Add Funds", icon: CreditCard, color: "text-gray-600" },
    { id: "tickets", label: "Tickets", icon: Ticket, color: "text-orange-500" },
    { id: "services", label: "Services", icon: MoreHorizontal, color: "text-gray-600" },
    { id: "updates", label: "Updates", icon: Bell, color: "text-gray-600" },
    { id: "vip-updates", label: "VIP Updates", icon: Star, color: "text-gray-600" },
  ];

    // Icon mapping for dynamic categories
  const getIconForCategory = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('instagram')) return { icon: SiInstagram, color: "text-pink-500" };
    if (name.includes('facebook')) return { icon: SiFacebook, color: "text-blue-600" };
    if (name.includes('youtube')) return { icon: SiYoutube, color: "text-red-500" };
    if (name.includes('twitter') || name.includes('x')) return { icon: SiX, color: "text-black dark:text-white" };
    if (name.includes('spotify')) return { icon: SiSpotify, color: "text-green-500" };
    if (name.includes('tiktok')) return { icon: SiTiktok, color: "text-black dark:text-white" };
    if (name.includes('telegram')) return { icon: SiTelegram, color: "text-blue-400" };
    if (name.includes('discord')) return { icon: SiDiscord, color: "text-indigo-500" };
    if (name.includes('linkedin')) return { icon: SiLinkedin, color: "text-blue-700" };
    if (name.includes('snapchat')) return { icon: SiSnapchat, color: "text-yellow-400" };
    if (name.includes('google')) return { icon: SiGoogle, color: "text-red-500" };
    if (name.includes('twitch')) return { icon: SiTwitch, color: "text-purple-500" };
    if (name.includes('traffic')) return { icon: Search, color: "text-gray-500" };
    if (name.includes('reviews')) return { icon: Star, color: "text-yellow-500" };
    if (name.includes('other')) return { icon: Plus, color: "text-gray-500" };
    return { icon: MoreHorizontal, color: "text-gray-500" };
  };

  // Calculate total price based on selected service and quantity
  const calculatePrice = () => {
    if (!selectedService || !quantity) return 0;
    return (selectedService.price * quantity) / 100000; // Convert from cents per 1000
  };

  // Handle order submission
  const handleSubmitOrder = () => {
    if (!selectedService || !link || !quantity) {
      toast({ 
        title: "Missing information", 
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (quantity < selectedService.minQuantity || quantity > selectedService.maxQuantity) {
      toast({ 
        title: "Invalid quantity", 
        description: `Quantity must be between ${selectedService.minQuantity} and ${selectedService.maxQuantity}`,
        variant: "destructive"
      });
      return;
    }

    createOrderMutation.mutate({
      serviceId: selectedService.id,
      link,
      quantity,
    });
  };

  // Reset form when platform changes
  useEffect(() => {
    setSelectedCategory(null);
    setSelectedService(null);
  }, [selectedPlatform]);

  // Reset service when category changes
  useEffect(() => {
    setSelectedService(null);
  }, [selectedCategory]);

  const renderNewOrderPage = () => {
    if (!selectedPlatform) {
      // Step 1: Choose Social Platform (Image 1)
      return (
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">CHOOSE A SOCIAL NETWORK</h2>
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-500">Hide the filter</div>
            </div>
          </div>
          
          {platformsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialPlatforms.map((platform) => {
                const iconData = getIconForCategory(platform.name);
                const Icon = iconData.icon;
                return (
                  <Card 
                    key={platform.name} 
                    className="cursor-pointer hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                    onClick={() => setSelectedPlatform(platform.name)}
                  >
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${iconData.color}`} />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{platform.name}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    // Step 2: Order Form (Images 2-5)
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white py-3">
                NEW ORDER
              </Button>
              <Button variant="outline" className="py-3">
                MY FAVORITE
              </Button>
              <Button variant="outline" className="py-3">
                AUTO SUBSCRIPTION
              </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <Input placeholder="Search" className="w-full" />
            </div>

            {/* Service Category Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="mb-4">
                <button 
                  onClick={() => setSelectedPlatform(null)}
                  className="text-orange-500 hover:text-orange-600 mb-2 flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back to platforms
                </button>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  {selectedPlatform} Services
                </h3>
              </div>

              {/* Category Dropdown */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Category
                  </label>
                  <Select value={selectedCategory || ""} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categoriesLoading ? (
                        <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                      ) : (
                        platformCategories.map((category: any) => (
                          <SelectItem key={category.name} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Service Selection */}
                {selectedCategory && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Service
                    </label>
                    <Select 
                      value={selectedService?.id || ""} 
                      onValueChange={(value) => {
                        const service = categoryServices.find(s => s.id === value);
                        setSelectedService(service || null);
                        if (service) {
                          setQuantity(service.minQuantity);
                        }
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a service..." />
                      </SelectTrigger>
                      <SelectContent>
                        {servicesLoading ? (
                          <SelectItem value="loading" disabled>Loading services...</SelectItem>
                        ) : (
                          categoryServices.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - ${(service.price / 100).toFixed(4)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Service Details & Order Form */}
                {selectedService && (
                  <div className="space-y-4 border-t pt-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                        {selectedService.id} - {selectedService.name}
                      </h4>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mb-2">
                        {selectedService.description}
                      </p>
                      <div className="text-sm text-blue-600 dark:text-blue-300">
                        Min: {selectedService.minQuantity} - Max: {selectedService.maxQuantity}
                      </div>
                    </div>

                    {/* Link Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Link
                      </label>
                      <Input 
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="Enter your link here..."
                        className="w-full"
                      />
                    </div>

                    {/* Quantity Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantity
                      </label>
                      <Input 
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                        min={selectedService.minQuantity}
                        max={selectedService.maxQuantity}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Min: {selectedService.minQuantity} - Max: {selectedService.maxQuantity}
                      </p>
                    </div>

                    {/* Price Display */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        ${calculatePrice().toFixed(5)}
                      </div>
                    </div>

                    {/* Submit Button */}
                    <Button 
                      onClick={handleSubmitOrder}
                      disabled={createOrderMutation.isPending || !link || !quantity}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3"
                    >
                      {createOrderMutation.isPending ? "SUBMITTING..." : "SUBMIT"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Service Info */}
          <div className="space-y-4">
            {selectedService && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-orange-500">NEW ORDER</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {selectedService.id} - {selectedService.name}
                    </h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">START TIME</div>
                      <div className="text-orange-500">N/A</div>
                    </div>
                    <div>
                      <div className="text-gray-500">SPEED</div>
                      <div className="text-orange-500">N/A</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">GUARANTEED</div>
                      <div className="text-orange-500">
                        {selectedService.refillSupported ? "Yes" : "No"}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-500">AVERAGE TIME</div>
                      <div className="text-orange-500">N/A</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-gray-500 text-sm">DESCRIPTION</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                      {selectedService.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOrdersPage = () => (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0">
              <TabsTrigger value="all" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">All</TabsTrigger>
              <TabsTrigger value="pending" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Pending</TabsTrigger>
              <TabsTrigger value="in-progress" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">In progress</TabsTrigger>
              <TabsTrigger value="completed" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Completed</TabsTrigger>
              <TabsTrigger value="partial" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Partial</TabsTrigger>
              <TabsTrigger value="processing" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Processing</TabsTrigger>
              <TabsTrigger value="canceled" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Canceled</TabsTrigger>
              <TabsTrigger value="refunds" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Refunds</TabsTrigger>
            </TabsList>
            <div className="p-4">
              <Input placeholder="Search" className="w-full" />
            </div>
          </Tabs>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Link</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Charge</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Start count</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Quantity</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Remains</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-500">
                    No orders found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddFundsPage = () => (
    <div className="p-6">
      <div className="mb-6">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
          <p className="text-green-800 dark:text-green-200">
            Please pay attention when paying with PAYTM. We have updated our QR code, so please do not send payments to the old one.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Button className="bg-orange-500 hover:bg-orange-600 text-white py-3">
          ADD FUNDS
        </Button>
        <Button variant="outline" className="py-3">
          CHECK HISTORY
        </Button>
        <Button variant="outline" className="py-3">
          REFUND HISTORY
        </Button>
        <Button variant="outline" className="py-3 text-xs">
          PAYEER, PAYPAL, SKRILL, CRYPTOCURRENCY - BNB - AND MORE (3% BONUS)
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Payeer, Paypal, Skrill, Cryptocurrency - BNB - and more (3% bonus)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amount</label>
                <Input placeholder="Enter amount" />
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3">
                PAY
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payeer - Paypal - Credit Card - Skrill - Cryptocurrency - Bank Transfer - and more</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">5$ Minimum Payment!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">3% Bonus on Payeer payments!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTicketsPage = () => (
    <div className="p-6">
      <div className="mb-6">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 dark:text-yellow-200">
            Please make sure to read out Terms before opening a ticket! Check out our general, service, and refund policy here: <span className="underline">Terms and Service</span>
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <Tabs defaultValue="tickets" className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0">
              <TabsTrigger value="tickets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">Tickets</TabsTrigger>
              <TabsTrigger value="new-tickets" className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-500 data-[state=active]:bg-transparent">New Tickets</TabsTrigger>
            </TabsList>
            <div className="p-4">
              <Input placeholder="Search" className="w-full" />
            </div>
          </Tabs>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Subject</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Last update</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No tickets found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServicesPage = () => (
    <div className="p-6">
      <div className="mb-6 flex items-center space-x-4">
        <Input placeholder="Search" className="flex-1" />
        <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
          <option>All</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Service</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Rate/1000</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Min</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Max</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Average time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <td colSpan={7} className="py-4 px-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">CoinMarketCap</span>
                      </div>
                    </div>
                  </td>
                </tr>
                {services.slice(0, 5).map((service) => (
                  <tr key={service.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{service.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <ShoppingCart className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-sm">{service.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">${(service.price / 100).toFixed(2)}</td>
                    <td className="py-3 px-4">{service.minQuantity}</td>
                    <td className="py-3 px-4">{service.maxQuantity?.toLocaleString()}</td>
                    <td className="py-3 px-4">{service.deliveryTime || "N/A"}</td>
                    <td className="py-3 px-4">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        SHOW DETAILS
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "new-order":
        return renderNewOrderPage();
      case "orders":
        return renderOrdersPage();
      case "add-funds":
        return renderAddFundsPage();
      case "tickets":
        return renderTicketsPage();
      case "services":
        return renderServicesPage();
      default:
        return renderNewOrderPage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">J</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                JAP
              </span>
              <span className="text-sm text-gray-500">JUST ANOTHER PANEL</span>
            </div>

            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-6 text-sm">
              <span className="text-blue-600 dark:text-blue-400">Welcome: {user?.firstName || user?.email}</span>
              <span className="text-blue-600 dark:text-blue-400">Total Orders: {orders.length}</span>
              <span className="text-blue-600 dark:text-blue-400">Current Balance: ****</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Input placeholder="Search" className="w-64 hidden md:block" />
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white">
                  1
                </Badge>
              </Button>
              
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>

              <Button variant="ghost" size="icon">
                <DollarSign className="h-5 w-5" />
              </Button>

              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || ""} alt={user?.firstName || "User"} />
                <AvatarFallback className="bg-blue-500 text-white">
                  {(user?.firstName?.charAt(0) || user?.email?.charAt(0) || "U").toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 lg:hidden">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 px-4 py-4 space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-l-4 border-orange-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${item.color}`} />
                  {item.label}
                </button>
              ))}
              
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md mt-4">
                Show More
              </button>
            </nav>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {renderCurrentPage()}
        </div>
      </div>
    </div>
  );
}