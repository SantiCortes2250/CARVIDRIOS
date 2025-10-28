import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AddVidrioDialog from "@/components/AddVidrioDialog";
import EditVidrioDialog from "@/components/EditVidriosDialog";
import ConfirmDialog from "../components/ConfirmDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

function App() {
  const [autos, setAutos] = useState([]);
  const [nuevoAuto, setNuevoAuto] = useState({
    nombre: "",
    marca: "",
    modelo: "",
    imagen: "",
  });
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [editAuto, setEditAuto] = useState(null);
  const [filterMarca, setFilterMarca] = useState("");

  // Catálogo fijo de marcas
  const marcasDisponibles = [
    "Toyota",
    "Renault",
    "Chevrolet",
    "Ford",
    "Kia",
    "Mazda",
    "Nissan",
  ];

  // Cargar usuarios al inicio
  useEffect(() => {
    fetchAutos();
  }, []);

  async function fetchAutos() {
    const autosData = await window.api.listAutos();

    // Para cada auto, obtenemos sus vidrios
    const autosConVidrios = await Promise.all(
      autosData.map(async (auto) => {
        const vidrios = await window.api.listVidriosByAuto(auto.id);
        return { ...auto, vidrios };
      })
    );

    setAutos(autosConVidrios);
  }

  async function handleAddAuto(e) {
    e.preventDefault();

    if (!nuevoAuto.nombre || !nuevoAuto.marca) {
      setError("Completa todos los campos obligatorios");
      return;
    }

    if (editAuto) {
      await window.api.updateAuto({ ...nuevoAuto, id: editAuto.id });
    } else {
      await window.api.createAuto(nuevoAuto);
    }

    setNuevoAuto({ nombre: "", marca: "", modelo: "", imagen: "" });
    setEditAuto(null);

    setNuevoAuto({ nombre: "", marca: "", modelo: "", imagen: "" });
    setOpen(false);
    await fetchAutos();
  }

  async function handleDelete(id) {
    await window.api.deleteAuto(id);
    fetchAutos();
  }

  function openEdit(auto) {
    setEditAuto(auto);
    setNuevoAuto(auto);
    setOpen(true);
  }

  // Filtro combinado
  const filteredAutos = autos.filter((a) => {
    const matchMarca = filterMarca
      ? a.marca.toLowerCase() === filterMarca.toLowerCase()
      : true;

    const searchText = search.toLowerCase();
    const matchSearch =
      a.nombre.toLowerCase().includes(searchText) ||
      a.marca.toLowerCase().includes(searchText);

    return matchMarca && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 items-center">
        {/* Filtro por catálogo */}
        <select
          className="border p-2 rounded-md cursor-pointer"
          value={filterMarca}
          onChange={(e) => setFilterMarca(e.target.value)}
        >
          <option value="">Todas las marcas</option>
          {marcasDisponibles.map((marca, i) => (
            <option key={i} value={marca}>
              {marca}
            </option>
          ))}
        </select>

        {/* Buscador extra */}
        <Input
          placeholder="Buscar por texto..."
          className="w-72"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Agregar vehículo */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-green-600 text-white cursor-pointer"
              onClick={() => {
                setEditAuto(null);
                setNuevoAuto({ nombre: "", marca: "", modelo: "", imagen: "" });
              }}
            >
              + Agregar Vehículo
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-md rounded-xl border border-gray-300 shadow-xl p-6 bg-white">
            <DialogHeader>
              <DialogTitle>
                {editAuto ? "Editar Vehículo" : "Agregar Vehículo"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={nuevoAuto.nombre}
                  onChange={(e) =>
                    setNuevoAuto({ ...nuevoAuto, nombre: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Marca</Label>
                <select
                  className="border p-2 rounded-md w-full"
                  value={nuevoAuto.marca}
                  onChange={(e) =>
                    setNuevoAuto({ ...nuevoAuto, marca: e.target.value })
                  }
                >
                  <option value="">Seleccionar marca</option>
                  {marcasDisponibles.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label>Modelo</Label>
                <Input
                  placeholder="Ej: 2011/13"
                  value={nuevoAuto.modelo}
                  onChange={(e) =>
                    setNuevoAuto({ ...nuevoAuto, modelo: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>URL de Imagen</Label>
                <Input
                  placeholder="https://..."
                  value={nuevoAuto.imagen}
                  onChange={(e) =>
                    setNuevoAuto({ ...nuevoAuto, imagen: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                onClick={handleAddAuto}
                className="bg-green-700 text-white"
              >
                {editAuto ? "Actualizar" : "Guardar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 max-h-[80vh] overflow-y-auto pr-2">
        {filteredAutos.map((auto, index) => (
          <Card key={index} className="bg-gray-100 border-none shadow">
            <div className="flex items-center gap-4">
              <img
                src={auto.imagen}
                alt={auto.marca}
                className="rounded-lg w-60 h-40 m-4"
              />
              <CardTitle className="text-green-600 font-bold text-xl">
                {auto.nombre} — {auto.modelo}
                <div className="flex gap-2 mt-3 w-30">
                  <Button
                    variant="outline"
                    onClick={() => openEdit(auto)}
                    className="w-full cursor-pointer"
                  >
                    Editar
                  </Button>
                  <ConfirmDialog
                    title="Eliminar vehículo"
                    message="¿Seguro que quieres eliminar este vehículo? Esta acción no se puede deshacer."
                    onConfirm={() => handleDelete(auto.id)}
                  >
                    <Button
                      variant="destructive"
                      className="w-full cursor-pointer"
                    >
                      Eliminar
                    </Button>
                  </ConfirmDialog>
                </div>
              </CardTitle>
            </div>

            <CardContent>
              <AddVidrioDialog autoId={auto.id} onAdded={fetchAutos} />

              <Table className="border border-black">
                <TableHeader>
                  <TableRow>
                    <TableHead># Estanteria</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Codigo</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>A Mano</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auto.vidrios.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell>{v.estanteria}</TableCell>
                      <TableCell>{v.stock}</TableCell>
                      <TableCell>{v.codigo}</TableCell>
                      <TableCell>{v.descripcion}</TableCell>
                      <TableCell>${v.precio.toLocaleString()}</TableCell>
                      <TableCell>${v.mano.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditVidrioDialog vidrio={v} onUpdated={fetchAutos} />
                          <ConfirmDialog
                            title="Eliminar vidrio"
                            message="¿Seguro que quieres eliminar este vidrio? Esta acción no se puede deshacer."
                            onConfirm={async () => {
                              await window.api.deleteVidrio(v.id);
                              fetchAutos();
                            }}
                          >
                            <Button
                              variant="outline"
                              className="cursor-pointer"
                            >
                            🗑
                            </Button>
                          </ConfirmDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}

        {filteredAutos.length === 0 && (
          <p className="text-center text-gray-500">
            No hay vehículos para esta marca todavía.
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
