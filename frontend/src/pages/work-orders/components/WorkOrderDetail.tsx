import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { useState } from 'react'
import { useCustomersStore } from '../../../store/customersStore'
import { useWorkOrdersStore } from '../../../store/workOrdersStore'
import {
  WORK_ORDER_STAGES,
  formatDate,
  type WorkOrderStage,
} from '../../../store/workOrderTypes'
import { fieldClassName } from './fieldStyles'
import { InvoiceModal } from './InvoiceModal'
import { LineItemsEditor } from './LineItemsEditor'
import { StageBadge, StatusBadge } from './StatusBadge'
import { StageChangeModal } from './StageChangeModal'
import { StageStepper } from './StageStepper'
import { WorkOrderHistory } from './WorkOrderHistory'

type WorkOrderDetailProps = {
  workOrderId: number
  onBack: () => void
}

export function WorkOrderDetail({ workOrderId, onBack }: WorkOrderDetailProps) {
  const workOrder = useWorkOrdersStore((state) =>
    state.workOrders.find((entry) => entry.id === workOrderId),
  )
  const printers = useWorkOrdersStore((state) => state.printers)
  const updateWorkOrder = useWorkOrdersStore((state) => state.updateWorkOrder)
  const setLineItems = useWorkOrdersStore((state) => state.setLineItems)
  const customer = useCustomersStore((state) =>
    workOrder ? state.customers.find((entry) => entry.id === workOrder.customerId) : undefined,
  )

  const [estimate, setEstimate] = useState(workOrder?.estimate ?? '')
  const [invoiceOpen, setInvoiceOpen] = useState(false)
  const [stageChange, setStageChange] = useState<{
    target: WorkOrderStage
    direction: 'forward' | 'back'
  } | null>(null)

  if (!workOrder) return null

  const printer = printers.find((entry) => entry.id === workOrder.printerId)
  const stageIndex = WORK_ORDER_STAGES.indexOf(workOrder.stage)
  const nextStage = WORK_ORDER_STAGES[stageIndex + 1]
  const prevStage = WORK_ORDER_STAGES[stageIndex - 1]
  const canAdvance = Boolean(nextStage) && nextStage !== 'Confirmed by client'

  return (
    <main>
      <button
        type="button"
        onClick={onBack}
        className="mb-4 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-copy transition hover:text-ink"
      >
        <ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
        Work orders
      </button>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-mono text-2xl font-bold tracking-tight text-ink">
              WO #{workOrder.id}
            </h1>
            <StageBadge stage={workOrder.stage} />
            <StatusBadge tone={workOrder.type === 'client-requested' ? 'info' : 'inactive'}>
              {workOrder.type === 'client-requested' ? 'Client request' : 'Company'}
            </StatusBadge>
          </div>
          <p className="mt-2 text-sm text-ink">{workOrder.problem}</p>
        </div>
        <button
          type="button"
          onClick={() => setInvoiceOpen(true)}
          className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-bold text-ink transition hover:bg-canvas"
        >
          <DescriptionOutlinedIcon fontSize="small" aria-hidden="true" />
          Invoice PDF
        </button>
      </div>

      <div className="mb-4 rounded-xl border border-line bg-surface p-4 shadow-card">
        <StageStepper stage={workOrder.stage} />
      </div>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <LineItemsEditor
            items={workOrder.lineItems}
            onChange={(items) => setLineItems(workOrderId, items)}
          />
          <WorkOrderHistory
            history={workOrder.history}
            onPost={(comment) => updateWorkOrder(workOrderId, {}, comment)}
          />
        </div>

        <div className="space-y-4 xl:col-span-4">
          <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <h2 className="mb-3 text-sm font-extrabold text-ink">Details</h2>
            <dl className="space-y-2.5 text-xs">
              {(
                [
                  ['Customer', customer?.name ?? '—'],
                  ['Contact', workOrder.contact],
                  ['Address', workOrder.address],
                  ['Created', formatDate(workOrder.createdAt)],
                  ['Assigned', workOrder.assignedTo ?? 'Unassigned'],
                ] as const
              ).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-3">
                  <dt className="text-copy">{label}</dt>
                  <dd className="text-right font-semibold text-ink">{value}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <dt className="text-copy">Printer</dt>
                <dd className="text-right font-semibold text-ink">
                  {printer ? (
                    `${printer.manufacturer} ${printer.model}`
                  ) : (
                    <span className="text-inactive">None</span>
                  )}
                </dd>
              </div>
            </dl>
          </article>

          <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <h2 className="mb-3 text-sm font-extrabold text-ink">Progress</h2>
            {workOrder.stage === 'Confirmed by client' ? (
              <div className="rounded-lg border border-success/30 bg-success-soft p-3 text-xs text-success">
                Completed and confirmed by client.
              </div>
            ) : (
              <div className="space-y-2">
                {canAdvance ? (
                  <button
                    type="button"
                    onClick={() => setStageChange({ target: nextStage, direction: 'forward' })}
                    className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-brand px-3 text-xs font-bold text-surface transition hover:bg-brand-strong"
                  >
                    <ArrowForwardRoundedIcon fontSize="small" aria-hidden="true" />
                    Advance to “{nextStage}”
                  </button>
                ) : (
                  <div className="flex items-start gap-2 rounded-lg border border-line bg-canvas p-3 text-caption leading-relaxed text-copy">
                    <InfoOutlinedIcon fontSize="small" className="mt-0.5 shrink-0" aria-hidden="true" />
                    Repaired — waiting for the client to confirm from their app. Only the client can
                    mark this as confirmed.
                  </div>
                )}
                {prevStage && (
                  <button
                    type="button"
                    onClick={() => setStageChange({ target: prevStage, direction: 'back' })}
                    className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-3 text-xs font-bold text-ink transition hover:bg-canvas"
                  >
                    <ArrowBackRoundedIcon fontSize="small" aria-hidden="true" />
                    Move back to “{prevStage}”
                  </button>
                )}
              </div>
            )}
            <div className="mt-4">
              <span className="mb-1.5 block text-xs font-semibold text-ink">Estimated ready date</span>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={estimate}
                  onChange={(event) => setEstimate(event.target.value)}
                  className={fieldClassName}
                />
                <button
                  type="button"
                  disabled={!estimate || estimate === workOrder.estimate}
                  onClick={() =>
                    updateWorkOrder(
                      workOrderId,
                      { estimate },
                      `Estimated ready date set to ${formatDate(estimate)}.`,
                    )
                  }
                  className="h-10 cursor-pointer rounded-lg border border-line bg-canvas px-3 text-xs font-bold text-ink transition hover:bg-brand-soft disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Set
                </button>
              </div>
              <p className="mt-1.5 text-caption text-copy">
                The client is notified whenever the estimate changes.
              </p>
            </div>
          </article>

          <article className="rounded-xl border border-line bg-surface p-4 shadow-card">
            <label className="flex cursor-pointer items-start gap-2.5">
              <input
                type="checkbox"
                checked={workOrder.invoiceFinalOnly}
                onChange={(event) =>
                  updateWorkOrder(workOrderId, { invoiceFinalOnly: event.target.checked })
                }
                className="mt-0.5 size-3.5 accent-brand"
              />
              <span className="text-xs">
                <b className="block text-ink">Show only final price on invoice</b>
                <span className="text-copy">Hide the itemized breakdown from the client.</span>
              </span>
            </label>
          </article>
        </div>
      </section>

      {invoiceOpen && (
        <InvoiceModal workOrder={workOrder} onClose={() => setInvoiceOpen(false)} />
      )}
      {stageChange && (
        <StageChangeModal
          from={workOrder.stage}
          target={stageChange.target}
          direction={stageChange.direction}
          onClose={() => setStageChange(null)}
          onConfirm={(note) => {
            const label = stageChange.direction === 'forward' ? 'Advanced to' : 'Moved back to'
            const text = note.trim()
              ? `${label} “${stageChange.target}” — ${note.trim()}`
              : `${label} “${stageChange.target}”.`
            updateWorkOrder(workOrderId, { stage: stageChange.target }, text)
            setStageChange(null)
          }}
        />
      )}
    </main>
  )
}
