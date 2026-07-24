import { useState } from "react";
import { Modal } from "../components/Modal";
import { useCreateCustomer } from "../pages/customers/hooks/useCreateCustomer";
import { useModalsStore, type ModalOptions } from "../store/modals";

type NewCustomerModalProps = {
  options: ModalOptions<"NewCustomer">;
};

type NewCustomerForm = {
  name: string;
  contactPerson: string;
  contactPhone: string;
  email: string;
  address: string;
};

const emptyForm: NewCustomerForm = {
  name: "",
  contactPerson: "",
  contactPhone: "",
  email: "",
  address: "",
};

export function NewCustomerModal({ options }: NewCustomerModalProps) {
  const close = useModalsStore((state) => state.close);
  const createCustomer = useCreateCustomer();
  const [form, setForm] = useState<NewCustomerForm>({
    ...emptyForm,
    name: options.data?.initialName ?? "",
  });

  const updateField = (field: keyof NewCustomerForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleClose = () => {
    if (createCustomer.isPending) return;
    close();
  };

  const handleSave = () => {
    const contactPerson = form.contactPerson.trim();

    createCustomer.mutate(
      {
        name: form.name.trim(),
        address: form.address.trim() || null,
        ...(contactPerson
          ? {
              contact: {
                name: contactPerson,
                phone: form.contactPhone.trim() || null,
                email: form.email.trim() || null,
              },
            }
          : {}),
      },
      {
        onSuccess: (customer) => {
          options.onSaved?.({ customerId: customer.id });
          close();
        },
        onError: (error) => {
          options.onError?.(error);
        },
      },
    );
  };

  const errorMessage =
    createCustomer.error instanceof Error
      ? createCustomer.error.message
      : createCustomer.error
        ? "Failed to add customer."
        : null;

  return (
    <Modal
      title="Add customer"
      subtitle="A customer contact can be reached by the company when needed."
      onClose={handleClose}
      wide
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!form.name.trim() || createCustomer.isPending) return;
          handleSave();
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        {errorMessage ? (
          <p className="sm:col-span-2 text-sm text-danger" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <label className="block sm:col-span-2">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Customer name
          </span>
          <input
            autoFocus
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="e.g. Grand Hotel"
            className="field-control"
            disabled={createCustomer.isPending}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Contact person
          </span>
          <input
            value={form.contactPerson}
            onChange={(event) =>
              updateField("contactPerson", event.target.value)
            }
            placeholder="Full name"
            className="field-control"
            disabled={createCustomer.isPending}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Contact phone
          </span>
          <input
            value={form.contactPhone}
            onChange={(event) =>
              updateField("contactPhone", event.target.value)
            }
            placeholder="+4798765432"
            className="field-control"
            disabled={createCustomer.isPending}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Email
          </span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => updateField("email", event.target.value)}
            placeholder="name@company.com"
            className="field-control"
            disabled={createCustomer.isPending}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs font-semibold text-ink">
            Address
          </span>
          <input
            value={form.address}
            onChange={(event) => updateField("address", event.target.value)}
            placeholder="Street, city, state"
            className="field-control"
            disabled={createCustomer.isPending}
          />
        </label>

        <div className="flex justify-end gap-2 sm:col-span-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={createCustomer.isPending}
            className="h-9 cursor-pointer rounded-lg px-3.5 text-sm font-bold text-copy transition hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!form.name.trim() || createCustomer.isPending}
            className="h-9 cursor-pointer rounded-lg bg-brand px-3.5 text-sm font-bold text-surface transition hover:bg-brand-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:bg-line disabled:text-copy"
          >
            {createCustomer.isPending ? "Adding…" : "Add customer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
