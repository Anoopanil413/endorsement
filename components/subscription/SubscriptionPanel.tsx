'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Check, Star, Zap, Shield, Cloud } from 'lucide-react';
import { UserProfile } from '@/lib/indexedDB';
import WaveBackground from '@/components/ui/wave-background';

interface SubscriptionPanelProps {
  user: UserProfile;
}

export default function SubscriptionPanel({ user }: SubscriptionPanelProps) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      features: [
        'Up to 5 documents per month',
        'Basic signature and stamp',
        'Local storage only',
        'Standard support'
      ],
      buttonText: 'Current Plan',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Star
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: '/month',
      description: 'For professional maritime workers',
      features: [
        'Unlimited documents',
        'Advanced background removal',
        'Cloud storage & sync',
        'Custom signature styles',
        'Priority support',
        'Bulk processing'
      ],
      buttonText: 'Upgrade to Premium',
      buttonVariant: 'default' as const,
      popular: true,
      icon: Crown
    },
    {
      name: 'Enterprise',
      price: '$29.99',
      period: '/month',
      description: 'For maritime organizations',
      features: [
        'Everything in Premium',
        'Team collaboration',
        'Advanced security',
        'API access',
        'Custom integrations',
        'Dedicated support',
        'Compliance tools'
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline' as const,
      popular: false,
      icon: Shield
    }
  ];

  const currentPlan = plans.find(plan => 
    plan.name.toLowerCase() === user.subscriptionStatus
  ) || plans[0];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-50">
      <WaveBackground />
      
      <div className="relative z-10 max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Subscription Plans</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Choose the perfect plan for your maritime document endorsement needs. 
            Upgrade anytime to unlock more powerful features.
          </p>
        </div>

        {/* Current Plan Status */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <currentPlan.icon className="h-5 w-5 text-sky-600" />
              <span>Current Plan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{currentPlan.name}</h3>
                <p className="text-slate-600">{currentPlan.description}</p>
              </div>
              <Badge variant={user.subscriptionStatus === 'free' ? 'secondary' : 'default'} className="px-4 py-2">
                {user.subscriptionStatus === 'free' ? 'Free Plan' : `${user.subscriptionStatus} Plan`}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = plan.name.toLowerCase() === user.subscriptionStatus;
            
            return (
              <Card
                key={plan.name}
                className={`backdrop-blur-sm bg-white/80 border-0 shadow-xl relative transition-all duration-200 hover:shadow-2xl ${
                  plan.popular ? 'ring-2 ring-orange-400 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className={`p-3 rounded-full ${
                      plan.name === 'Free' ? 'bg-slate-100 text-slate-600' :
                      plan.name === 'Premium' ? 'bg-orange-100 text-orange-600' :
                      'bg-sky-100 text-sky-600'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-slate-800">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                      <span className="text-slate-500">{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    className={`w-full font-semibold ${
                      plan.name === 'Premium'
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
                        : plan.buttonVariant === 'default'
                        ? 'bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white'
                        : ''
                    }`}
                    variant={isCurrentPlan ? 'outline' : plan.buttonVariant}
                    disabled={isCurrentPlan}
                  >
                    {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Features Comparison */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-orange-600" />
              <span>Premium Features</span>
            </CardTitle>
            <CardDescription>
              Unlock advanced capabilities with our premium plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <div className="p-3 bg-sky-100 rounded-lg w-fit">
                  <Cloud className="h-6 w-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-800">Cloud Storage</h4>
                <p className="text-sm text-slate-600">
                  Sync your documents across all devices with secure cloud storage.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-orange-100 rounded-lg w-fit">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-slate-800">AI Processing</h4>
                <p className="text-sm text-slate-600">
                  Advanced AI-powered background removal and image enhancement.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-green-100 rounded-lg w-fit">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-slate-800">Enterprise Security</h4>
                <p className="text-sm text-slate-600">
                  Bank-level encryption and compliance with maritime regulations.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-purple-100 rounded-lg w-fit">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-800">Priority Support</h4>
                <p className="text-sm text-slate-600">
                  Get help when you need it with our dedicated support team.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Status */}
        <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">Network Status: Online</span>
                </div>
                <span className="text-sm text-slate-500">
                  Subscription management available
                </span>
              </div>
              <Button variant="outline" size="sm">
                Manage Billing
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}