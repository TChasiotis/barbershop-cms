"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ArrowUp, ArrowDown, Edit, Trash2, X } from "lucide-react";
import {
  createService,
  updateService,
  deleteService,
  moveService,
} from "../actions";

export default function ServicesTab({
  initialServices,
}: {
  initialServices: any[];
}) {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultForm = { name: "", nameEn: "", duration: "", price: "" };
  const [form, setForm] = useState(defaultForm);

  const sortedServices = [...(initialServices || [])].sort(
    (a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  const openNew = () => {
    setForm(defaultForm);
    setEditingId(null);
    setModalOpen(true);
  };
  const openEdit = (service: any) => {
    setForm({
      name: service.name || "",
      nameEn: service.nameEn || "",
      duration: service.duration || "",
      price: service.price || "",
    });
    setEditingId(service.id);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateService(editingId, form);
    } else {
      await createService(form);
    }
    setModalOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Manage Services
        </h2>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Name (Primary/Sec)</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {sortedServices.map((service: any) => (
                <tr
                  key={service.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-semibold text-zinc-900">
                      {service.name}
                    </p>
                    <p className="text-xs text-zinc-400">
                      {service.nameEn || "-"}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-zinc-500">
                    {service.duration}
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {service.price}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={async () => {
                        await moveService(service.id, "up");
                        router.refresh();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        await moveService(service.id, "down");
                        router.refresh();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <span className="text-zinc-300">|</span>
                    <button
                      onClick={() => openEdit(service)}
                      className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Delete ${service.name}?`)) {
                          await deleteService(service.id);
                          router.refresh();
                        }
                      }}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-4 md:p-6 border-b border-zinc-100 flex-shrink-0">
              <h3 className="text-lg md:text-xl font-bold text-zinc-900">
                {editingId ? "Edit Service" : "New Service"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-4 md:p-6">
              <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Name (EN)
                    </label>
                    <input
                      type="text"
                      value={form.nameEn}
                      onChange={(e) =>
                        setForm({ ...form, nameEn: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                      Duration *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.duration}
                      onChange={(e) =>
                        setForm({ ...form, duration: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-5 py-2.5 text-zinc-700 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg font-medium"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
