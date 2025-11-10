import { supabase } from '@/src/lib/supabase';
import type { SearchHistory, SearchSuggestion } from '@/src/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// ==================== Search History Hooks ====================

export function useSearchHistory(limit = 10) {
  return useQuery({
    queryKey: ['search-history', limit],
    queryFn: async (): Promise<SearchHistory[]> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching search history:', error);
        return [];
      }

      return data || [];
    },
    enabled: true,
  });
}

export function useAddSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      search_query, 
      search_type = 'general',
      result_count = 0 
    }: {
      search_query: string;
      search_type?: SearchHistory['search_type'];
      result_count?: number;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Check if this query already exists for this user
      const { data: existing } = await supabase
        .from('search_history')
        .select('id')
        .eq('user_id', user.id)
        .eq('search_query', search_query)
        .single();

      if (existing) {
        // Update existing record with new timestamp
        const { data, error } = await supabase
          .from('search_history')
          .update({ 
            result_count,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('search_history')
          .insert({
            user_id: user.id,
            search_query,
            search_type,
            result_count,
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });
}

export function useClearSearchHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['search-history'] });
    },
  });
}

// ==================== Search Suggestions Hooks ====================

export function useSearchSuggestions(type?: SearchSuggestion['suggestion_type']) {
  return useQuery({
    queryKey: ['search-suggestions', type],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      let query = supabase
        .from('search_suggestions')
        .select('*')
        .eq('is_active', true)
        .order('display_order')
        .order('popularity_score', { ascending: false });

      if (type) {
        query = query.eq('suggestion_type', type);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching search suggestions:', error);
        return [];
      }

      return data || [];
    },
  });
}

export function useTrendingSuggestions(limit = 6) {
  return useQuery({
    queryKey: ['trending-suggestions', limit],
    queryFn: async (): Promise<SearchSuggestion[]> => {
      const { data, error } = await supabase
        .from('search_suggestions')
        .select('*')
        .eq('is_active', true)
        .eq('is_trending', true)
        .order('popularity_score', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching trending suggestions:', error);
        return [];
      }

      return data || [];
    },
  });
}

// ==================== Search Functionality ====================

export function useSearch() {
  const addSearchHistory = useAddSearchHistory();

  return useMutation({
    mutationFn: async ({ 
      query, 
      type = 'general' 
    }: {
      query: string;
      type?: SearchHistory['search_type'];
    }) => {
      if (!query.trim()) return [];

      // For now, we'll search in dishes table
      // In a real app, this would be a more sophisticated search
      const { data, error } = await supabase
        .from('dishes')
        .select(`
          *,
          restaurants!inner(name, image, rating)
        `)
        .ilike('name', `%${query}%`)
        .limit(20);

      if (error) {
        console.error('Search error:', error);
        return [];
      }

      // Add to search history
      await addSearchHistory.mutateAsync({
        search_query: query,
        search_type: type,
        result_count: data?.length || 0,
      });

      return data || [];
    },
  });
}

export * from './useFlashSales';
