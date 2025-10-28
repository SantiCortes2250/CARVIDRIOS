import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ title, message, onConfirm, children }) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{children}</div>

      <DialogContent className="max-w-sm rounded-xl shadow-lg border">
        <DialogHeader>
          <DialogTitle>{title || "Confirmar acción"}</DialogTitle>
        </DialogHeader>

        <p className="text-gray-600">{message}</p>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" className="cursor-pointer" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" className="cursor-pointer" onClick={handleConfirm}>
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
