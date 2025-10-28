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

export default function AddVidrioDialog({ autoId, onAdded }) {
  const [open, setOpen] = useState(false);
  const [vidrio, setVidrio] = useState({
    codigo: "",
    descripcion: "",
    precio: "",
    mano: "",
    stock: "",
    estanteria: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();

    await window.api.createVidrio({
      auto_id: autoId,
      codigo: vidrio.codigo,
      descripcion: vidrio.descripcion,
      precio: parseFloat(vidrio.precio || "0"),
      mano: parseFloat(vidrio.mano || "0"),
      stock: parseInt(vidrio.stock || "0"),
      estanteria: vidrio.estanteria,
    });

    setVidrio({
      codigo: "",
      descripcion: "",
      precio: "",
      mano: "",
      stock: "",
      estanteria: "",
    });

    setOpen(false);
    onAdded(); // refresca lista de autos
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 text-white my-2 cursor-pointer">+ Agregar Vidrio</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-xl border border-gray-300 shadow-xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Agregar Vidrio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Código</Label>
            <Input
              value={vidrio.codigo}
              onChange={(e) =>
                setVidrio({ ...vidrio, codigo: e.target.value })
              }
              required
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Input
              value={vidrio.descripcion}
              onChange={(e) =>
                setVidrio({ ...vidrio, descripcion: e.target.value })
              }
            />
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Precio</Label>
              <Input
                type="number"
                value={vidrio.precio}
                onChange={(e) =>
                  setVidrio({ ...vidrio, precio: e.target.value })
                }
              />
            </div>

            <div className="flex-1">
              <Label>A la Mano</Label>
              <Input
                type="number"
                value={vidrio.mano}
                onChange={(e) =>
                  setVidrio({ ...vidrio, mano: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Label>Stock</Label>
              <Input
                type="number"
                value={vidrio.stock}
                onChange={(e) =>
                  setVidrio({ ...vidrio, stock: e.target.value })
                }
              />
            </div>

            <div className="flex-1">
              <Label>Estantería</Label>
              <Input
                value={vidrio.estanteria}
                onChange={(e) =>
                  setVidrio({ ...vidrio, estanteria: e.target.value })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="bg-green-700 text-white">
              Guardar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
