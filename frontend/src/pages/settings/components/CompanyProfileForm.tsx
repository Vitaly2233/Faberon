import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import { useRef } from 'react'
import type { CompanyProfile } from '../../../store/companyStore'

type CompanyProfileFormProps = {
  value: CompanyProfile
  isDirty: boolean
  isSaved: boolean
  onChange: (value: CompanyProfile) => void
  onSave: () => void
}

const fieldClassName = 'field-control'

export function CompanyProfileForm({
  value,
  isDirty,
  isSaved,
  onChange,
  onSave,
}: CompanyProfileFormProps) {
  const fileRef = useRef<HTMLInputElement>(null)

  const updateField = <Field extends keyof CompanyProfile>(field: Field, next: CompanyProfile[Field]) => {
    onChange({ ...value, [field]: next })
  }

  return (
    <article className="rounded-xl border border-line bg-surface p-5 shadow-card">
      <h2 className="text-sm font-extrabold text-ink">Company profile</h2>
      <p className="mt-0.5 text-xs text-copy">
        Your company name and logo appear on generated invoices.
      </p>

      <div className="mb-5 mt-5 flex items-center gap-4">
        {value.logo ? (
          <img
            src={value.logo}
            alt=""
            className="size-16 rounded-xl border border-line object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-xl border border-dashed border-line bg-canvas text-xl font-extrabold text-copy">
            {value.name.slice(0, 1) || 'F'}
          </div>
        )}
        <div className="flex flex-col gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => updateField('logo', reader.result as string)
              reader.readAsDataURL(file)
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg border border-line bg-canvas px-3.5 text-xs font-bold text-ink transition hover:bg-brand-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <ImageOutlinedIcon fontSize="small" aria-hidden="true" />
            Upload logo
          </button>
          {value.logo && (
            <button
              type="button"
              onClick={() => updateField('logo', null)}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-copy transition hover:text-danger focus-visible:outline-2 focus-visible:outline-brand"
            >
              <DeleteOutlineRoundedIcon fontSize="small" aria-hidden="true" />
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Company name</span>
          <input
            value={value.name}
            onChange={(event) => updateField('name', event.target.value)}
            className={fieldClassName}
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">Default address</span>
          <input
            value={value.address}
            onChange={(event) => updateField('address', event.target.value)}
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="mt-6 flex justify-end border-t border-line pt-5">
        <button
          type="button"
          disabled={!isDirty && !isSaved}
          onClick={onSave}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg bg-brand px-3.5 text-xs font-bold text-surface transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-copy"
        >
          {isSaved ? (
            <>
              <CheckRoundedIcon fontSize="small" aria-hidden="true" />
              Saved
            </>
          ) : (
            'Save changes'
          )}
        </button>
      </div>
    </article>
  )
}
