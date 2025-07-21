import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun, Rocket, Shield, DollarSign, Zap } from "lucide-react";

export default function Landing() {
  const { theme, setTheme } = useTheme();

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

              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign In
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => window.location.href = "/api/login"}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                #1 SMM PANEL
              </span>
              <br />
              <span className="text-foreground">IN THE WORLD!</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              With SocialPanel, you'll revolutionize your social media growth – together; we lead, they follow! 
              Get the best and most affordable SMM panel services.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
                onClick={() => window.location.href = "/api/login"}
              >
                SIGN UP NOW
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
              <div className="text-center animate-counter">
                <div className="text-2xl font-bold text-primary mb-1">Every 0.14s</div>
                <div className="text-sm text-muted-foreground">An order</div>
              </div>
              <div className="text-center animate-counter" style={{ animationDelay: "0.2s" }}>
                <div className="text-2xl font-bold text-accent mb-1">804,531,666</div>
                <div className="text-sm text-muted-foreground">Orders Completed</div>
              </div>
              <div className="text-center animate-counter" style={{ animationDelay: "0.4s" }}>
                <div className="text-2xl font-bold text-green-500 mb-1">$0.01/1K</div>
                <div className="text-sm text-muted-foreground">Prices from</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Why Choose SocialPanel?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join millions of satisfied customers who trust us for their social media growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Cheapest Prices</h3>
                <p className="text-sm text-muted-foreground">
                  We offer the most competitive prices in the market without compromising on quality.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Secure & Safe</h3>
                <p className="text-sm text-muted-foreground">
                  Your privacy is protected with advanced encryption and secure payment processing.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Delivery</h3>
                <p className="text-sm text-muted-foreground">
                  Most orders start processing within minutes of successful payment.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Rocket className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">High Quality</h3>
                <p className="text-sm text-muted-foreground">
                  Premium services from real, active accounts that won't be detected.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Grow Your Social Media?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of satisfied customers and start boosting your social media presence today.
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Rocket className="text-white" size={16} />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                SocialPanel
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SocialPanel. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}