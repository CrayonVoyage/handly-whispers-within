import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Search, Check, ChevronsUpDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface UserSearchProps {
  onUserSelect: (username: string) => void;
  loading: boolean;
  currentUserId: string;
}

interface UserSuggestion {
  username: string;
  full_name: string;
}

export const UserSearch: React.FC<UserSearchProps> = ({ onUserSelect, loading, currentUserId }) => {
  const [compareUsername, setCompareUsername] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userSuggestions, setUserSuggestions] = useState<UserSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const searchUsers = useCallback(async (query: string) => {
    if (!query || query.length < 2 || !currentUserId) return;

    setSearchLoading(true);
    try {
      // First get user_ids with completed readings
      const { data: completedReadings } = await supabase
        .from('handly_users')
        .select('user_id')
        .not('reading_result', 'is', null);

      if (!completedReadings) {
        setUserSuggestions([]);
        return;
      }

      const userIdsWithReadings = completedReadings.map(r => r.user_id).filter(Boolean);

      // Then fetch profiles that match the search and have completed readings
      const { data: profiles } = await supabase
        .from('profiles')
        .select('username, full_name, user_id')
        .ilike('username', `%${query}%`)
        .neq('user_id', currentUserId)
        .in('user_id', userIdsWithReadings)
        .limit(10);

      if (profiles) {
        setUserSuggestions(profiles.map(p => ({
          username: p.username,
          full_name: p.full_name || p.username
        })));
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearchLoading(false);
    }
  }, [currentUserId]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchUsers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compareUsername.trim()) return;
    onUserSelect(compareUsername.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <Label className="text-foreground">
          Search username to compare with:
        </Label>
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={isPopoverOpen}
              className="w-full justify-between mt-2"
            >
              {compareUsername || "Search username..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Type username..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                <CommandEmpty>
                  {searchLoading ? "Searching..." : "No users found."}
                </CommandEmpty>
                <CommandGroup>
                  {userSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion.username}
                      value={suggestion.username}
                      onSelect={(value) => {
                        setCompareUsername(value);
                        setSearchQuery('');
                        setIsPopoverOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          compareUsername === suggestion.username ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{suggestion.username}</span>
                        {suggestion.full_name !== suggestion.username && (
                          <span className="text-sm text-muted-foreground">{suggestion.full_name}</span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      <Button 
        type="submit" 
        disabled={loading || !compareUsername.trim()}
        className="w-full"
      >
        {loading ? (
          "Searching..."
        ) : (
          <>
            <Search className="h-4 w-4 mr-2" />
            Compare Readings
          </>
        )}
      </Button>
    </form>
  );
};