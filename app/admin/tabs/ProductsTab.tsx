"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Edit,
  Trash2,
  X,
  Loader2,
} from "lucide-react";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  moveProduct,
} from "../actions";

export default function ProductsTab({
  initialProducts,
  monthlyUploadsCount,
}: {
  initialProducts: any[];
  monthlyUploadsCount: number;
}) {
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultForm = {
    name: "",
    category: "care",
    price: "",
    img: "",
    desc: "",
    descEn: "",
  };
  const [form, setForm] = useState<any>(defaultForm);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [useRemoveBg, setUseRemoveBg] = useState(true);

  const existingCategories = Array.from(
    new Set(initialProducts?.map((p: any) => p.category).filter(Boolean)),
  ) as string[];
  if (existingCategories.length === 0) {
    existingCategories.push("prep", "pomades", "waxes", "care", "cologne");
  }

  const sortedProducts = [...(initialProducts || [])].sort(
    (a: any, b: any) => (a.sortOrder || 0) - (b.sortOrder || 0),
  );

  const openNew = () => {
    setForm(defaultForm);
    setProductFile(null);
    setEditingId(null);
    setIsNewCategory(false);
    setModalOpen(true);
  };
  const openEdit = (product: any) => {
    setForm({
      name: product.name || "",
      category: product.category || "care",
      price: product.price || "",
      img: product.img || "",
      desc: product.desc || "",
      descEn: product.descEn || "",
    });
    setProductFile(null);
    setEditingId(product.id);
    setIsNewCategory(false);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (productFile && productFile.size > 5 * 1024 * 1024) {
      alert("⚠️ The image is too large (exceeds 5MB).");
      return;
    }
    setIsSubmitting(true);
    try {
      if (editingId) {
        await updateProduct(editingId, form);
      } else {
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("price", form.price);
        formData.append("category", form.category);
        formData.append("desc", form.desc);
        formData.append("descEn", form.descEn);
        formData.append("useRemoveBg", useRemoveBg ? "true" : "false");
        if (productFile) formData.append("file", productFile);
        await createProduct(formData);
      }
      setModalOpen(false);
      router.refresh();
    } catch (error) {
      alert("An error occurred while saving.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-zinc-200 pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manage Products
          </h2>
          <p className="text-xs font-medium text-zinc-500 mt-1">
            Remove.bg usage this month:{" "}
            <span
              className={`font-bold ${monthlyUploadsCount >= 50 ? "text-red-500" : "text-zinc-900"}`}
            >
              {monthlyUploadsCount} / 50
            </span>{" "}
            free removals.
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center justify-center gap-2 bg-zinc-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors shadow-sm w-full sm:w-auto"
        >
          <Plus size={16} /> New Product
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {sortedProducts.map((product: any) => (
                <tr
                  key={product.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <td className="px-6 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 bg-zinc-100 rounded-lg p-1 flex items-center justify-center overflow-hidden border border-zinc-200">
                      <img
                        src={product.img || ""}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-zinc-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-400 max-w-xs truncate">
                        {product.desc}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-100 text-zinc-700 px-2.5 py-1 rounded-md text-xs font-medium">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-zinc-900">
                    {product.price}
                  </td>
                  <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                    <button
                      onClick={async () => {
                        await moveProduct(product.id, "up");
                        router.refresh();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        await moveProduct(product.id, "down");
                        router.refresh();
                      }}
                      className="p-1.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <span className="text-zinc-300">|</span>
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-md"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`Delete ${product.name}?`)) {
                          await deleteProduct(product.id);
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
                {editingId ? "Edit Product" : "New Product"}
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
                      Brand / Name *
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
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. $13"
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {isNewCategory ? (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        New Category *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          placeholder="e.g. accessories"
                          value={form.category}
                          onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                          }
                          className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setIsNewCategory(false);
                            setForm({
                              ...form,
                              category: existingCategories[0] || "care",
                            });
                          }}
                          className="px-3 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-semibold"
                        >
                          List
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => {
                          if (e.target.value === "__NEW__") {
                            setIsNewCategory(true);
                            setForm({ ...form, category: "" });
                          } else {
                            setForm({ ...form, category: e.target.value });
                          }
                        }}
                        className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none"
                      >
                        {existingCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option
                          value="__NEW__"
                          className="font-bold text-zinc-600"
                        >
                          + New Category...
                        </option>
                      </select>
                    </div>
                  )}
                  {editingId === null && (
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 mb-1">
                        Product Image *
                      </label>
                      <input
                        type="file"
                        required
                        accept="image/*"
                        onChange={(e) =>
                          setProductFile(e.target.files?.[0] || null)
                        }
                        className="w-full px-4 py-1.5 border border-zinc-200 rounded-lg outline-none file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-950 file:text-white"
                      />
                      <div className="mt-3 mb-1 flex items-center gap-2 bg-zinc-50 p-2 rounded border border-zinc-200">
                        <input
                          type="checkbox"
                          id="removeBgToggle"
                          checked={useRemoveBg}
                          onChange={(e) => setUseRemoveBg(e.target.checked)}
                          className="rounded border-zinc-300 text-zinc-900 cursor-pointer"
                        />
                        <label
                          htmlFor="removeBgToggle"
                          className="text-sm font-medium text-zinc-700 cursor-pointer"
                        >
                          Auto-remove background (AI)
                        </label>
                      </div>
                      {useRemoveBg && monthlyUploadsCount >= 50 ? (
                        <p className="text-[11px] text-amber-600 font-medium bg-amber-50 border border-amber-200 rounded p-1.5">
                          ⚠️ 50 free removals reached.
                        </p>
                      ) : useRemoveBg ? (
                        <p className="text-[11px] text-zinc-400">
                          ✨ Background will be removed automatically.
                        </p>
                      ) : (
                        <p className="text-[11px] text-zinc-400">
                          ℹ️ Image will be uploaded as is.
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Description (Primary) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={form.desc}
                    onChange={(e) => setForm({ ...form, desc: e.target.value })}
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">
                    Description (Secondary)
                  </label>
                  <textarea
                    rows={2}
                    value={form.descEn}
                    onChange={(e) =>
                      setForm({ ...form, descEn: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-900 outline-none resize-none"
                  ></textarea>
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
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 text-white bg-zinc-950 hover:bg-zinc-800 rounded-lg font-medium disabled:opacity-50"
                  >
                    {isSubmitting && (
                      <Loader2 size={16} className="animate-spin" />
                    )}{" "}
                    {isSubmitting ? "Saving..." : "Save"}
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
