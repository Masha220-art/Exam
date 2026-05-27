export function getFieldLabel(config, fieldName) {
  const field = config.application.fields.find((f) => f.name === fieldName)
  return field?.label || fieldName
}

export function formatFieldValue(config, fieldName, value) {
  const field = config.application.fields.find((f) => f.name === fieldName)
  if (!field || value == null || value === '') return value

  if (field.type === 'select' || field.type === 'radio') {
    const option = field.options?.find((o) => o.value === value)
    return option?.label || value
  }

  return value
}

export function getStatusBadgeClass(color) {
  const colors = {
    blue: 'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-sky-100 text-sky-800',
    yellow: 'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-900',
    green: 'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800',
    red: 'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-800',
  }
  return colors[color] || colors.blue
}
