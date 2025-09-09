"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Button } from "./button"
import { Search, X, Clock, TrendingUp } from "lucide-react"

const EnhancedSearch = React.forwardRef(({
  className,
  placeholder = "Search cars...",
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  onSearch,
  onSuggestionSelect,
  loading = false,
  showSuggestions = true,
  maxSuggestions = 8,
  ...props
}, ref) => {
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const [filteredSuggestions, setFilteredSuggestions] = React.useState([])
  
  const inputRef = React.useRef()
  const containerRef = React.useRef()

  // Filter suggestions based on query
  React.useEffect(() => {
    if (query.trim().length === 0) {
      setFilteredSuggestions([])
      return
    }

    const filtered = suggestions
      .filter(item => 
        typeof item === 'string' 
          ? item.toLowerCase().includes(query.toLowerCase())
          : item.label.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, maxSuggestions)

    setFilteredSuggestions(filtered)
    setHighlightedIndex(-1)
  }, [query, suggestions, maxSuggestions])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown') {
        setIsOpen(true)
        e.preventDefault()
      }
      return
    }

    const totalItems = filteredSuggestions.length + (recentSearches.length > 0 ? recentSearches.length : 0)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => prev < totalItems - 1 ? prev + 1 : -1)
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : totalItems - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0) {
          const selectedItem = getItemByIndex(highlightedIndex)
          if (selectedItem) {
            selectSuggestion(selectedItem)
          }
        } else {
          handleSearch()
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const getItemByIndex = (index) => {
    if (index < filteredSuggestions.length) {
      return filteredSuggestions[index]
    }
    const recentIndex = index - filteredSuggestions.length
    return recentSearches[recentIndex]
  }

  const selectSuggestion = (item) => {
    const value = typeof item === 'string' ? item : item.label
    setQuery(value)
    setIsOpen(false)
    setHighlightedIndex(-1)
    onSuggestionSelect?.(item)
    inputRef.current?.focus()
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query.trim())
      setIsOpen(false)
    }
  }

  const clearQuery = () => {
    setQuery("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pr-20 pl-10"
          inputMode="search"
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          {...props}
        />
        
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" 
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={clearQuery}
              aria-label="Clear search"
              className="h-6 w-6"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          <Button
            type="button"
            onClick={handleSearch}
            disabled={!query.trim() || loading}
            size="sm"
            className="h-8"
          >
            {loading ? "..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && showSuggestions && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-80 overflow-auto">
          {/* Filtered suggestions */}
          {filteredSuggestions.length > 0 && (
            <div className="p-2 border-b">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Suggestions
              </div>
              {filteredSuggestions.map((item, index) => {
                const label = typeof item === 'string' ? item : item.label
                const description = typeof item === 'object' ? item.description : null
                
                return (
                  <button
                    key={index}
                    onClick={() => selectSuggestion(item)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors",
                      index === highlightedIndex && "bg-muted"
                    )}
                    role="option"
                    aria-selected={index === highlightedIndex}
                  >
                    <div className="flex items-center gap-2">
                      <Search className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="truncate">{label}</div>
                        {description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {description}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && query.trim().length === 0 && (
            <div className="p-2 border-b">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Recent Searches
              </div>
              {recentSearches.slice(0, 5).map((search, index) => {
                const adjustedIndex = filteredSuggestions.length + index
                
                return (
                  <button
                    key={`recent-${index}`}
                    onClick={() => selectSuggestion(search)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded text-sm hover:bg-muted transition-colors",
                      adjustedIndex === highlightedIndex && "bg-muted"
                    )}
                    role="option"
                    aria-selected={adjustedIndex === highlightedIndex}
                  >
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{search}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* Popular searches */}
          {popularSearches.length > 0 && query.trim().length === 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground mb-2 px-2">
                Popular Searches
              </div>
              <div className="flex flex-wrap gap-1 px-2">
                {popularSearches.map((search, index) => (
                  <button
                    key={`popular-${index}`}
                    onClick={() => selectSuggestion(search)}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    <TrendingUp className="h-2 w-2" />
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredSuggestions.length === 0 && query.trim().length > 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No suggestions found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
})

EnhancedSearch.displayName = "EnhancedSearch"

export { EnhancedSearch }
