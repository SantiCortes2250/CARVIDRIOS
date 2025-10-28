import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EditVidrioDialog({ vidrio, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...vidrio });

  async function handleSubmit(e) {
    e.preventDefault();
    await window.api.updateVidrio({
      id: form.id,
      codigo: form.codigo,
      descripcion: form.descripcion,
      precio: parseFloat(form.precio || "0"),
      mano: parseFloat(form.mano || "0"),
      stock: parseInt(form.stock || "0"),
      estanteria: form.estanteria,
    });
    setOpen(false);
    onUpdated();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-green-600 cursor-pointer">
          ✏️ 
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl border border-gray-300 shadow-xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Editar Vidrio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Código</Label>
            <Input
              value={form.codigo}
              onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Input
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Precio</Label>
              <Input
                type="number"
                value={form.precio}
                onChange={(e) => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label>Mano de Obra</Label>
              <Input
                type="number"
                value={form.mano}
                onChange={(e) => setForm({ ...form, mano: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Stock</Label>
              <Input
                type="number"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <Label>Estantería</Label>
              <Input
                value={form.estanteria}
                onChange={(e) =>
                  setForm({ ...form, estanteria: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-700 text-white">
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
