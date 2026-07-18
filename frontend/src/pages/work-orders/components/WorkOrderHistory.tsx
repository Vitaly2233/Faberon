import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import { useState } from 'react'
import type { HistoryEntry } from '../../../store/workOrderTypes'
import { formatDate } from '../../../store/workOrderTypes'
import { fieldClassName } from './fieldStyles'

type WorkOrderHistoryProps = {
  history: HistoryEntry[]
  onPost: (comment: string) => void
}

export function WorkOrderHistory({ history, onPost }: WorkOrderHistoryProps) {
  const [comment, setComment] = useState('')

  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-card">
      <h2 className="mb-4 text-sm font-extrabold text-ink">History & comments</h2>
      <div className="mb-4 space-y-3 border-l border-line pl-4">
        {history.map((entry) => (
          <div key={entry.id} className="relative">
            <span className="absolute -left-5.5 top-1 size-2 rounded-full bg-line ring-2 ring-surface" />
            <div className="flex items-center gap-2">
              <b className="text-xs text-ink">{entry.author}</b>
              <span className="text-2xs text-copy">{formatDate(entry.date)}</span>
            </div>
            <p className="text-xs text-copy">{entry.text}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Add a comment — the client is notified"
          className={fieldClassName}
        />
        <button
          type="button"
          disabled={!comment.trim()}
          onClick={() => {
            onPost(comment.trim())
            setComment('')
          }}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-canvas px-3 text-xs font-bold text-ink transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChatBubbleOutlineRoundedIcon fontSize="small" aria-hidden="true" />
          Post
        </button>
      </div>
    </article>
  )
}
