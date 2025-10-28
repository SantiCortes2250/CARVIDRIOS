export default function FiltroMarcas({ marcas, selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        className={`px-3 py-1 rounded-md border font-medium ${
          selected === "" ? "bg-green-600 text-white" : "bg-white text-gray-700"
        }`}
        onClick={() => onSelect("")}
      >
        Todas
      </button>

      {marcas.map((m, i) => (
        <button
          key={i}
          className={`px-3 py-1 rounded-md border font-medium ${
            selected === m
              ? "bg-green-600 text-white"
              : "bg-white text-gray-700"
          }`}
          onClick={() => onSelect(m)}
        >
          {m}
        </button>
      ))}
    </div>
  )
}
