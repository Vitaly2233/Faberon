import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'

type CustomersToolbarProps = {
  searchQuery: string
  onSearchChange: (query: string) => void
  onFilterClick: (filter: string) => void
}

const filters = ['Status: All', 'Contract: Any', 'Location: All', 'Saved views']

export function CustomersToolbar({
  searchQuery,
  onSearchChange,
  onFilterClick,
}: CustomersToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface p-2 shadow-field">
      <label className="flex h-9 min-w-56 items-center rounded-lg border border-line bg-canvas px-3 text-copy">
        <SearchRoundedIcon fontSize="small" aria-hidden="true" />
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search customers..."
          className="min-w-0 flex-1 bg-transparent px-2 text-xs text-ink outline-none placeholder:text-copy"
          aria-label="Search customers"
        />
      </label>
      {filters.map((filter) => (
        <button
          key={filter}
          type="button"
          onClick={() => onFilterClick(filter)}
          className="flex h-9 cursor-pointer items-center gap-1 rounded-lg border border-line bg-surface px-3 text-xs font-medium text-copy transition hover:border-brand hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          {filter}
          <ExpandMoreRoundedIcon fontSize="small" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}
