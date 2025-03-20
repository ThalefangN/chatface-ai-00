
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, CheckCircle } from "lucide-react";

interface SubscriptionNotificationProps {
  open: boolean;
  onClose: () => void;
}

const SubscriptionNotification: React.FC<SubscriptionNotificationProps> = ({
  open,
  onClose
}) => {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Dumela! Free Trial Activated
          </DialogTitle>
          <DialogDescription className="pt-2 text-base">
            Welcome to SpeakAI! You have unlocked your 14-day free trial.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 text-lg text-center">After your trial ends, choose a plan</h3>
            
            <div className="grid gap-4 mt-4">
              <div className="border border-primary/30 p-4 rounded-lg bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-bl-md">
                  Recommended
                </div>
                <h4 className="font-bold text-lg">Pro Plan</h4>
                <div className="flex items-baseline mt-1 mb-3">
                  <span className="text-2xl font-bold">$40</span>
                  <span className="text-muted-foreground ml-1">/month</span>
                  <span className="text-muted-foreground ml-2">(~600 BWP)</span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Unlimited AI interviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Advanced feedback analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Interview recording & history</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Priority customer support</span>
                  </li>
                </ul>
                <Button className="w-full">
                  Subscribe Now
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              Continue with Free Trial
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionNotification;
