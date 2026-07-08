export default function ModelSelector({ models, selectedModel, onChange, loadError }) {
  if (loadError) {
    return <span className="model-selector-error">Ollama unreachable</span>;
  }

  if (!models.length) {
    return <span className="model-selector-error">No models installed</span>;
  }

  return (
    <select
      className="model-selector"
      value={selectedModel ?? ""}
      onChange={(e) => onChange(e.target.value)}
    >
      {models.map((model) => (
        <option key={model.name} value={model.name}>
          {model.name}
        </option>
      ))}
    </select>
  );
}
