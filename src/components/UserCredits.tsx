
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

interface UserCreditsData {
  credits_remaining: number;
  credits_used: number;
  plan_type: string;
  lifetime_credits_used: number;
}

export const UserCredits = () => {
  const [credits, setCredits] = useState<UserCreditsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadCredits();
      
      // Set up real-time subscription for credit updates
      const channel = supabase
        .channel('user-credits-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_credits',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            loadCredits();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const loadCredits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining, credits_used, plan_type, lifetime_credits_used')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading credits:', error);
        return;
      }

      if (data) {
        setCredits(data);
      }
    } catch (error) {
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card p-4">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-gold-400 animate-pulse" />
          <span className="text-sm text-foreground/60">Loading credits...</span>
        </div>
      </Card>
    );
  }

  if (!credits) {
    return (
      <Card className="glass-card p-4">
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-red-400" />
          <span className="text-sm text-foreground/60">Credits unavailable</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Coins className="w-5 h-5 text-gold-400" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gold-400">{credits.credits_remaining}</span>
              <span className="text-sm text-foreground/60">credits</span>
              <Badge variant="outline" className="border-gold-500/30 text-gold-400 text-xs">
                {credits.plan_type}
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-xs text-foreground/60 mt-1">
              <div className="flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Used: {credits.credits_used}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Total: {credits.lifetime_credits_used || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
