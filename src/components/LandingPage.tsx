"use client";

import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Video, 
  Code, 
  Users, 
  Clock, 
  Shield, 
  Zap,
  ArrowRight,
  CheckCircle,
  Home,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function LandingPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  const features = [
    {
      icon: Video,
      title: "Real-time Video Interviews",
      description: "Conduct seamless video interviews with built-in screen sharing and recording capabilities."
    },
    {
      icon: Code,
      title: "Code Analysis",
      description: "Advanced code analysis and plagiarism detection to ensure fair assessments."
    },
    {
      icon: Users,
      title: "Collaborative Review",
      description: "Multiple interviewers can join sessions and provide comprehensive feedback."
    },
    {
      icon: Clock,
      title: "Scheduled Sessions",
      description: "Easy scheduling and calendar integration for organized interview management."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security with end-to-end encryption for all communications."
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started in minutes with our intuitive interface and guided setup process."
    }
  ];

  const benefits = [
    "Real-time code execution and analysis",
    "Built-in plagiarism detection",
    "Multi-user interview sessions",
    "Recording and playback capabilities",
    "Comprehensive candidate evaluation",
    "Integration with popular IDEs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4 container mx-auto">
          {/* LEFT SIDE - LOGO */}
          <Link
            href={isSignedIn ? "/dashboard" : "/"}
            className="flex items-center gap-2 font-semibold text-2xl mr-6 font-mono hover:opacity-80 transition-opacity"
          >
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              //Code_View
            </span>
          </Link>

          {/* RIGHT SIDE - ACTIONS */}
          <div className="flex items-center space-x-4 ml-auto">
            {isSignedIn ? (
              <>
                <Button 
                  onClick={() => router.push("/dashboard")}
                  className="gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go to Dashboard
                </Button>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button>Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container px-4 py-24 mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="secondary" className="mb-4">
            🚀 Now in Beta
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            The Future of{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Technical Interviews
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Conduct seamless technical interviews with real-time code analysis, 
            collaborative review, and comprehensive candidate evaluation - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Button 
                size="lg" 
                className="text-lg px-8"
                onClick={() => router.push("/dashboard")}
              >
                <Home className="mr-2 h-5 w-5" />
                Access Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <SignUpButton mode="modal">
                <Button size="lg" className="text-lg px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            )}
            <Button variant="outline" size="lg" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-24 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need for technical interviews
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial screening to final evaluation, we provide all the tools 
            you need to conduct effective technical interviews.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container px-4 py-24 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Why choose CodeView?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our platform is designed specifically for technical interviews, 
              providing everything you need to evaluate candidates effectively.
            </p>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Card className="p-8 border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">
                  {isSignedIn ? "Ready to continue?" : "Ready to get started?"}
                </CardTitle>
                <CardDescription className="text-lg">
                  {isSignedIn 
                    ? "Return to your dashboard to manage interviews and candidates"
                    : "Join thousands of companies using CodeView for their technical interviews"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isSignedIn ? (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => router.push("/dashboard")}
                  >
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <SignUpButton mode="modal">
                      <Button className="w-full" size="lg">
                        Create Free Account
                      </Button>
                    </SignUpButton>
                    <SignInButton mode="modal">
                      <Button variant="outline" className="w-full" size="lg">
                        Sign In to Existing Account
                      </Button>
                    </SignInButton>
                  </>
                )}
                <p className="text-sm text-muted-foreground text-center">
                  No credit card required • Free 14-day trial
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="h-6 w-6 rounded bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center">
                <Code className="h-4 w-4 text-white" />
              </div>
              <span className="font-semibold">CodeView</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
