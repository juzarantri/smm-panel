import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { GoogleSignIn } from "@/components/ui/google-sign-in"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, Menu, Rocket, Play, Shield, DollarSign, UserCheck, Zap, Headphones, TrendingUp, Lock } from "lucide-react"
import type { ServiceCategory } from "@shared/schema"

export default function Home() {
  const { theme, setTheme } = useTheme()

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<ServiceCategory[]>({
    queryKey: ["/api/categories"],
  })

  const stats = {
    ordersCompleted: "804,531,666",
    orderFrequency: "Every 0.14s",
    startingPrice: "$0.01/1K"
  }

  const steps = [
    {
      number: 1,
      title: "Sign Up",
      description: "Create your account with just a few clicks. Once registered, all services will be available for you to choose from."
    },
    {
      number: 2,
      title: "Choose Service",
      description: "Take time to pick what you require. We have plenty of options across all major social media platforms."
    },
    {
      number: 3,
      title: "Enter Details",
      description: "Paste the URL of the account/post/website you'd like to boost and specify the quantity you need."
    },
    {
      number: 4,
      title: "Review Order",
      description: "Check all the details about your order including service, quantity, price, and delivery time."
    },
    {
      number: 5,
      title: "Make Payment",
      description: "If everything looks perfect, proceed with secure payment using your preferred payment method."
    },
    {
      number: 6,
      title: "Get Results",
      description: "We'll get to work immediately and deliver your order according to the specified timeframe."
    }
  ]

  const features = [
    {
      icon: DollarSign,
      title: "Cheapest Prices",
      description: "We offer the most competitive prices in the market without compromising on quality.",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30"
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Multiple secure payment options including PayPal, cards, and cryptocurrencies.",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      icon: UserCheck,
      title: "Complete Anonymity",
      description: "Your privacy is protected with advanced encryption and anonymous purchasing.",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Most orders start processing within minutes of successful payment.",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900/30"
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Round-the-clock customer support to help you with any questions or issues.",
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-900/30"
    },
    {
      icon: TrendingUp,
      title: "High Quality",
      description: "Premium services from real, active accounts that won't be detected by algorithms.",
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-100 dark:bg-indigo-900/30"
    }
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Rocket className="text-white text-xl" size={20} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SocialPanel
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-muted-foreground hover:text-primary transition-colors">Services</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a>
              <a href="/api" className="text-muted-foreground hover:text-primary transition-colors">API</a>
              <a href="/blog" className="text-muted-foreground hover:text-primary transition-colors">Blog</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>

              <div className="hidden sm:flex items-center space-x-3">
                <Button variant="ghost" className="text-primary hover:text-primary/80">
                  Sign In
                </Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sign Up
                </Button>
              </div>

              <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  #1 SMM PANEL
                </span>
                <br />
                <span className="text-foreground">IN THE WORLD!</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
                With SocialPanel, you'll revolutionize your social media growth – together; we lead, they follow! 
                Get the best and most affordable SMM panel services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                  SIGN UP NOW
                </Button>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4 text-lg">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
                <div className="text-center animate-counter">
                  <div className="text-2xl font-bold text-primary mb-1">{stats.orderFrequency}</div>
                  <div className="text-sm text-muted-foreground">An order</div>
                </div>
                <div className="text-center animate-counter" style={{ animationDelay: "0.2s" }}>
                  <div className="text-2xl font-bold text-accent mb-1">{stats.ordersCompleted}</div>
                  <div className="text-sm text-muted-foreground">Orders Completed</div>
                </div>
                <div className="text-center animate-counter" style={{ animationDelay: "0.4s" }}>
                  <div className="text-2xl font-bold text-green-500 mb-1">{stats.startingPrice}</div>
                  <div className="text-sm text-muted-foreground">Prices from</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 animate-float">
                <Card className="shadow-2xl border-0">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-foreground">Quick Order</h3>
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="service" className="text-sm font-medium text-muted-foreground">Service</Label>
                        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg mt-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">IG</span>
                          </div>
                          <span className="text-sm">Instagram Followers - Real & Active</span>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="link" className="text-sm font-medium text-muted-foreground">Link</Label>
                        <Input 
                          id="link"
                          type="url" 
                          placeholder="https://instagram.com/username" 
                          className="mt-2"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="quantity" className="text-sm font-medium text-muted-foreground">Quantity</Label>
                        <Input 
                          id="quantity"
                          type="number" 
                          defaultValue="1000" 
                          className="mt-2"
                        />
                      </div>
                      
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Place Order - $12.50
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-orange-500 rounded-full blur-2xl opacity-20"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-primary to-indigo-600 rounded-full blur-2xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Our SMM Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Boost your social media presence across all major platforms with our premium services
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="p-6 animate-pulse">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-2xl"></div>
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded mb-3"></div>
                    <div className="h-3 bg-muted rounded w-20 mx-auto"></div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card 
                  key={category.id} 
                  className="group p-6 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-105"
                >
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <i className={`${category.icon} text-white text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                    <div className="mt-3 text-xs text-primary font-medium">150+ Services</div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">How Does SocialPanel Work?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get started with our simple 6-step process and watch your social media grow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <Card key={step.number} className="group hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {step.number}
                    </div>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose SocialPanel?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We provide the best SMM panel services with unmatched quality and reliability
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className={`w-16 h-16 ${feature.bg} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className={`${feature.color} text-2xl`} size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Boost Your Social Media?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and start growing your social media presence today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started Now
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                  <Rocket className="text-white" size={20} />
                </div>
                <span className="text-2xl font-bold text-white">SocialPanel</span>
              </div>
              <p className="text-gray-400 mb-6">
                The world's leading SMM panel providing high-quality social media marketing services at affordable prices.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-discord text-xl"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">TikTok</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Spotify</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/blog" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="/api" className="hover:text-primary transition-colors">API</a></li>
                <li><a href="/affiliate" className="hover:text-primary transition-colors">Affiliate Program</a></li>
                <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="/support" className="hover:text-primary transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/refund" className="hover:text-primary transition-colors">Refund Policy</a></li>
                <li><a href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</a></li>
                <li><a href="/security" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© 2024 SocialPanel. All rights reserved.</p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Lock size={16} />
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield size={16} />
                <span>100% Safe</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
